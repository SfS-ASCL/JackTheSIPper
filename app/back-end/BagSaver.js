// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: BagSaver.jsx
// Time-stamp: <2018-12-12 12:21:27 (zinn)>
// -------------------------------------------

import {softwareVersion,
	getCMDIInstance,
	attachProject,
	attachResearchers,
        attachLicence,
	attachResourceProxyInfo,
	buildXML,
	errorHandler
       } from './util';

import BagIt from '../my-bag-it/index.js';
import path from 'path';
import JSZip from 'jszip';
import uuid from 'uuid';
import cryptojs from 'crypto-js';


var FileSaver = require('file-saver');
var fileReaderStream = require('filereader-stream')

export default class BagSaver {

    constructor( state, parentSetState ) {

	this.state = state;
	this.parentSetState = parentSetState;

	this.generateZIP = this.generateZIP.bind(this);
	this.generateZIPHelper = this.generateZIPHelper.bind(this);
	this.bagCMDI = this.bagCMDI.bind(this);
	this.bagDate = this.bagDate.bind(this);
    }

    bagDate() {
	// 29.11.2018
	const today = new Date();
	return today.toLocaleDateString("de-DE");
    }    
    
    bagCMDI( bag, cmdiProxyListInfoFragment ) {

	console.log('BagSaver/bagCMDI', bag, cmdiProxyListInfoFragment, this.state.profile);

	/*

	var cipherText = cryptojs.AES.encrypt('clarin-plus', 'do not hack me').toString();
	console.log('cipherText', cipherText);

	var bytes  = cryptojs.AES.decrypt(cipherText, 'do not hack me');
	var originalText = bytes.toString(cryptojs.enc.Utf8);
	console.log('originalText', originalText);	

	*/
	
	var hash = cryptojs.SHA256("Message");
	console.log('sha256', hash.toString());

	// 2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91
	
	// generate CMDI file, step by step
	const cmdi0 = getCMDIInstance( this.state.profile );
	
	const cmdi1 = attachProject( cmdi0,       this.state.profile, this.state.project );
	const cmdi2 = attachResearchers( cmdi1,   this.state.profile, this.state.researchers );
	const cmdi3 = attachLicence( cmdi2,       this.state.profile, this.state.licence );
	const cmdi4 = attachResourceProxyInfo( cmdi3, this.state.profile, cmdiProxyListInfoFragment);
	const cmdiXML = buildXML( cmdi4 );
	
	const cmdiFile    = new File([cmdiXML], "cmdi.xml", {type: "application/xml"});
	const that = this;
	/* add CMDI file to the bag

	   metadata is stored with the bag metadata at root
	   /bag/bag-cmdi.xml
	   /bag/.profile

        For this, we need to change bag.createWriteStream. For the time being, there's a hack
	in createWriteStream: if the name is prefixed with "metadata-", then path is set to empty.

	*/

	fileReaderStream(cmdiFile)
	    .pipe(bag.createWriteStream(
		"metadata-cmdi.xml",
		{},
		function( sha256, md5 ) { // both ignored
		    // finalize bag file
		    bag.finalize( function () {
			console.log('BagSaver/saveBag: bag has been finalized', bag, sha256, md5);
			// add cmdi to bag (and then generate ZIP)
			that.generateZIP( bag, cmdiProxyListInfoFragment ); 
		    })}));
    }

    saveBag() {
	const that = this;
	const getNodeKey = ({ treeIndex }) => treeIndex;
	const id = uuid.v4();

	// see https://github.com/jvilk/BrowserFS
	var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
	BrowserFS.configure({
	    // fs: "LocalStorage",
	    // fs: "HTML5FS",
	    // fs: "IndexedDB",
	    fs: "InMemory", 
	    options: {}
	}, function(error) {
	    if (error) {
		throw error;
	    } else {
    		var bag = BagIt('bag-'+id, // use relative path (no leading /)
				'sha256',
				{ 'Source-Organization': 'Tuebingen University',
				  'Organization-Address': 'Wilhelmstrasse 19, 72074 Tuebingen, Germany',
				  'Contact-Phone': '+49 07071 29-73969',
				  'Contact-Email': 'claus.zinn@uni-tuebingen.de',
				  'Bagging-Date' : that.bagDate(),
				  'Contact-Name' : 'Claus Zinn',
				  'Generated-By' : 'JackTheSIPper ' + softwareVersion,
				  'Bag-Size'     : 'willBeOverwritten',
				  'Profile'      : that.state.profile
				});
		
		const entryPoints = ( (that.state.treeData[0].children === undefined) ? [] : that.state.treeData[0].children );
		const cmdiProxyListInfoFragment =  that.flattenTree(bag, '', entryPoints, []);
		that.bagHelper( bag,
				[], 
				cmdiProxyListInfoFragment);
	    }
	})
    }

    /* flatten the SIP tree
       - use own variant rather than method 'getFlatDataFromTree' provided by react-sortable-tree
       - returns flat list with 'proper' path information
    */
    
    flattenTree(bag, currentPath, [ head, ...tail ], cmdiProxyListInfoFragment) {

	if (head === undefined && !(tail.length)) {
	    return cmdiProxyListInfoFragment;
	} else if (head.isDirectory) {
	    cmdiProxyListInfoFragment.push( {"path": path.join(currentPath, head.name),
					     "isDirectory": true,
					     "name": head.name,
					     "size": head.size,
					     "type": head.type });	    	    	    
	    return this.flattenTree(bag,
				    currentPath,
				    tail,
				    this.flattenTree(bag, path.join(currentPath, head.name),
						     head.children,
						     cmdiProxyListInfoFragment));
	    
	} else {
	    cmdiProxyListInfoFragment.push( {"path": path.join(currentPath, head.name),
					     "isDirectory": false,
					     "file": head.file,
					     "name": head.name,
					     "size": head.size,
					     "type": head.type,
					     "md5" :  null,   // to be defined later
					     "sha256" : null
					    });
	    return this.flattenTree(bag,
				    currentPath,
				    tail,	    
				    cmdiProxyListInfoFragment);
	}
    }

    /*
      second argument is constructed, with hash info (sha256, md5) enriched in bag routine
      third argument is destructed for recursion
     */
    bagHelper(bag, cmdiProxyListInfoFragment, [ head, ...tail ]) {
	const that = this;
	console.log('bagHelper', cmdiProxyListInfoFragment);
	
	if (head === undefined && !tail.length) {
	    that.bagCMDI( bag, cmdiProxyListInfoFragment );
	} else if (head.isDirectory) {
	    bag.mkdir(head.path, function() {
		that.bagHelper(bag, cmdiProxyListInfoFragment, tail)
	    })
	} else {
	    fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob
		.pipe(bag.createWriteStream(head.path, {}, function( sha256, md5 ) {
		    head.sha256 = sha256;
		    head.md5 = md5;
		    that.bagHelper(bag,
				   [head, ...cmdiProxyListInfoFragment],
				   tail);
		}))
	}
    }
    

    /* this is the continuation-passing-style of the tree-recursive subst function
       the same principle will be applied above

       example call with identity function: 
              subst( 6, 99, [1,2,3,[4,5], 6, 7, [8,9]], (v) => v);
    */
    subst( s1, s2, term, newTerm ) {
	const loop = (s, k) => {
	    if (s == s1) {
		return k(s2);
	    } else if ((s === undefined) || (s.length == 0) || typeof(s) == 'number') {
		return k(s);
	    } else {
		return loop( s[0], v1 => loop(s.slice(1), v2 => k( [v1].concat(v2) )))
	    }
	}
	return loop(term, newTerm);
    }

    generateZIP( bag, cmdiProxyListInfoFragment ) {

	// this.subst( 6, 99, [1,2,3,[4,5], 6], (v) => v);

	const that = this;
	const zip = new JSZip();

	// use this, rather than the manifest file?
	bag.readdir('', function(err, data) {
	    if (err) return console.log('Error reading directory', err, bag);	    		
	    console.log('readdir at ""', data);
	});
	
	// zip manifest file
	bag.readFileNoCheck( bag.manifest, 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading manifest', err, bag)
	    zip.file(bag.manifest, data);
	})

	// zip bag-info.txt file
	bag.readFileNoCheck( bag.dir+'/bag-info.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bag-info.txt file', err, bag)
	    zip.file(bag.dir+'/bag-info.txt', data);
	})

	// zip bag.it.txt file
	bag.readFileNoCheck( bag.dir+'/bagit.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bagit.txt file', err, bag)
	    zip.file(bag.dir+'/bag-it.txt', data);
	})

	// zip all files mentioned in the manifest file 
	bag.readManifest( function(err, entries) {
	    if (err) return console.log('Error reading manifest', err, bag)
	    that.generateZIPHelper( zip, bag, entries, cmdiProxyListInfoFragment );
	})
    }
	
    generateZIPHelper(zip, bag, [ head, ...tail ], cmdiProxyListInfoFragment) {

	const that = this;
	if (head === undefined && !tail.length) {
	    return [];
	}

	var fileNameFullPath = bag.dir.concat('/').concat(head.name);
	var encoding  = 'binary';
	var c_binary = true;
	let mimetype;
	
	// todo: may use mimetype in cmdiProxyListInfoFragment structure
	/*
	if ( fileNameFullPath.includes('rtf') || fileNameFullPath.includes('txt') ) {
	    encoding = 'utf-8';
	    c_binary = false;
	}
	*/
	
	if (tail.length) {
	    mimetype = that.getMimetype(head.name, cmdiProxyListInfoFragment);
	    if ( (! (mimetype == undefined)) && (mimetype.includes("text/"))) {
		//console.log('BagSaver/generateZIPHandler: we have a textfile', mimetype);
		encoding = 'utf-8';
		c_binary = false;		
	    } else {
		//console.log('BagSaver/generateZIPHandler: we have a non textfile', mimetype);
	    }
	    
	    bag.readFileNoCheck(fileNameFullPath, encoding, function (err, data) {
		if (err) return console.log('Error reading this file', err, fileNameFullPath, data, bag, c_binary);
		zip.file(fileNameFullPath, data, {binary: c_binary});
		that.generateZIPHelper(zip, bag, tail, cmdiProxyListInfoFragment);
	    })
	} else {
	    zip.generateAsync({type:"blob"}).then(function (blob) { 
		that.parentSetState( { zip: blob } );
		FileSaver.saveAs(blob, that.state.researchers[0].lastName + ".zip");
	    })
	}
    }

    getMimetype(fileNameFullPath, cmdiProxyListInfoFragment)    {
	for (var i = 0; i < cmdiProxyListInfoFragment.length; i++) {
	    if (cmdiProxyListInfoFragment[i].name == fileNameFullPath) {
		return cmdiProxyListInfoFragment[i].type;
	    }
	}
	return undefined
    }
}