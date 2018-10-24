// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: BagSaver.jsx
// Time-stamp: <2018-10-15 14:12:00 (zinn)>
// -------------------------------------------

import BagIt from '../my-bag-it/index.js';
import CMDIProducer from './CMDIProducer.js';
import crypto from 'crypto';
import md5 from 'md5';
import shajs from 'sha.js';
import path from 'path';
import JSZip from 'jszip';
import uuid from 'uuid';
import {softwareVersion} from 'util';

var FileSaver = require('file-saver');
var fileReaderStream = require('filereader-stream')

export default class BagSaver {

    constructor( state, parentSetState ) {

	this.state = state;
	this.parentSetState = parentSetState;

	this.generateZIP = this.generateZIP.bind(this);
	this.generateZIPHelper = this.generateZIPHelper.bind(this);
	this.bagCMDI = this.bagCMDI.bind(this);
	this.bagSize = this.bagSize.bind(this);
	this.bagDate = this.bagDate.bind(this);	
    }

    bagSize() {
	return "260 GB";
    }

    bagDate() {
	return "10.10.2018";
    }    
    
    bagCMDI( bag, cmdiProxyListInfoFragment ) {

	console.log('BagSaver/bagCMDI', bag, cmdiProxyListInfoFragment);
	// generate CMDI file 
	const cmdiProducer = new CMDIProducer( this.state );
	const cmdi        = cmdiProducer.finaliseCMDI( cmdiProxyListInfoFragment );
	const cmdiFile    = new File([cmdi], "cmdi.xml", {type: "application/xml"});
	const that = this;
	// add CMDI file to the bag
	fileReaderStream(cmdiFile)
	    .pipe(bag.createWriteStream(
		"cmdi.xml",
		{},
		function() {
		    // add .profile file to the bag
		    let profileFile = new File([that.state.profile], ".profile", {type: "text/plain"});
		    fileReaderStream(profileFile)
			.pipe(bag.createWriteStream(".profile",
						    {},
						    function() {
							// finalize bag file
							bag.finalize( function () {
							    console.log('BagSaver/saveBag: bag has been finalized', bag);
							    // add cmdi to bag (and then generate ZIP)
							    that.generateZIP( bag, cmdiProxyListInfoFragment ); 
							})}));
		}))
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
				  'Contact-Phone': '+1 408-555-1212',
				  'Contact-Email': 'claus.zinn@uni-tuebingen.de',
				  'Bagging-Date' : that.bagDate(),
				  'Contact-Name' : 'Claus Zinn',
				  'Generated-By' : 'JackTheSIPper ' + softwareVersion,
				  'Bag-Size'     : that.bagSize()
				});
		
		console.log('BagSaver/saveBag tree', that.state.treeData);
		const entryPoints = ( (that.state.treeData[0].children === undefined) ? [] : that.state.treeData[0].children );
		const cmdiProxyListInfoFragment =  that.flattenTree('', entryPoints, []);
		console.log('constructing', bag, '', cmdiProxyListInfoFragment);
		that.bagHelper( bag,
				cmdiProxyListInfoFragment,
				cmdiProxyListInfoFragment);
	    }
	})
    }

    /* flatten the SIP tree
       - use own variant rather than method 'getFlatDataFromTree' provided by react-sortable-tree
       - returns flat list with 'proper' path information
    */
    
    flattenTree(currentPath, [ head, ...tail ], cmdiProxyListInfoFragment) {

	if (head === undefined && !(tail.length)) {
	    return cmdiProxyListInfoFragment;
	} else if (head.isDirectory) {
	    cmdiProxyListInfoFragment.push( {path: path.join(currentPath, head.name),
					     isDirectory: true,
					     name: head.name,
					     size: head.size,
					     type: head.type });	    	    	    
	    return this.flattenTree(currentPath,
				    tail,
				    this.flattenTree(path.join(currentPath, head.name),
						     head.children,
						     cmdiProxyListInfoFragment));
	    
	} else {
	    cmdiProxyListInfoFragment.push( {path: path.join(currentPath, head.name),
					     isDirectory: false,
					     file: head.file,
					     name: head.name,
					     size: head.size,
					     type: head.type });
	    return this.flattenTree(currentPath,
				    tail,	    
				    cmdiProxyListInfoFragment);
	}
    }
    
    bagHelper(bag, cmdiProxyListInfoFragment, [ head, ...tail ]) {
	const that = this;
	
	if (head === undefined && !tail.length) {
	    that.bagCMDI( bag, cmdiProxyListInfoFragment );
	} else if (head.isDirectory) {
	    //console.log('head I', head);	    
	    bag.mkdir(head.path, function() {
		that.bagHelper(bag, cmdiProxyListInfoFragment, tail)
	    })
	} else {
	    //console.log('head II', head);
	    fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob
		.pipe(bag.createWriteStream(head.path, {}, function() {	    
		    that.bagHelper(bag,
				   cmdiProxyListInfoFragment,
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

	//console.log('BagSaver/generateZIP', bag, cmdiProxyListInfoFragment);	

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
	
	// test to generate md5, sha256 with external libs.
	bag.readFileNoCheck( bag.dir+'/bagit.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bagit.txt file', err, bag)
	    console.log('md5-ing bag-it.txt file', '/bag/bagit.txt', md5(data),  shajs('sha256').update(data).digest('hex'));
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
	/* TODO INCOMPLETE!" */
	/* ----------------- */
	
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
		cmdiProxyListInfoFragment = that.addChecksum(head.checksum, head.name, cmdiProxyListInfoFragment)
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
    
    // enrich given element in cmdiProxyListInfoFragment
    addChecksum(checksum, fileNameFullPath, cmdiProxyListInfoFragment) {
	for (var i = 0; i < cmdiProxyListInfoFragment.length; i++) {
	    if (cmdiProxyListInfoFragment[i].name == fileNameFullPath) {
		cmdiProxyListInfoFragment[i].sha256 = checksum;
		break
	    }
	}
	return cmdiProxyListInfoFragment;
    }
    
}