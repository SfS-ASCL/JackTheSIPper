// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: BagSaver.jsx
// Time-stamp: <2018-10-11 09:12:20 (zinn)>
// -------------------------------------------

import BagIt from '../my-bag-it/index.js';
import CMDIHandler from './CMDIHandler';
import crypto from 'crypto';
import md5 from 'md5';
import shajs from 'sha.js';
import path from 'path';
import JSZip from 'jszip';
import uuid from 'uuid';
import {softwareVersion} from 'util';
import {getFlatDataFromTree} from 'react-sortable-tree';

var FileSaver = require('file-saver');
var fileReaderStream = require('filereader-stream')

export default class BagSaver {

    constructor( state, parentSetState ) {

	this.state = state;
	this.parentSetState = parentSetState;

	this.bagItHelper = this.bagItHelper.bind(this);
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
	// generate CMDI file 
	const cmdiHandler = new CMDIHandler( this.state );
	const cmdi        = cmdiHandler.finaliseCMDI( cmdiProxyListInfoFragment );
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
	const flattenedFileTree = getFlatDataFromTree(
	    { treeData: that.state.treeData,
	      getNodeKey: getNodeKey
	    });
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
		
		console.log('BagSaver/saveBag', flattenedFileTree);
		if ( !(flattenedFileTree[0].node.children === undefined)) {
		    var entryPoints = flattenedFileTree[0].node.children; // all childrens of the SIP root node
		    if (entryPoints.length > 0)
			that.bagItHelper( bag, '', entryPoints, [] );         // bagDirectory at root ''
		} else {
		    console.log('No files have been added to SIP');
		    that.bagCMDI( bag, [] ) 
		}
	    }
	})
    }

    bagItHelper(bag, currentPath, [ head, ...tail ], cmdiProxyListInfoFragment) {

	const that = this;
	
	if (head === undefined && !tail.length) {
	    return;
	}

	// there is a tail
	if (tail.length) {
	    // process head
	    if (head.isDirectory) {
		// make a new directory
		bag.mkdir(path.join(currentPath, head.name), function() {
		    // process the directory's children
		    that.bagItHelper(bag, path.join(currentPath, head.name), head.children, cmdiProxyListInfoFragment);
		    // process the tail
		    that.bagItHelper(bag, currentPath, tail, cmdiProxyListInfoFragment);
		});
	    } else {
		// read the head and pipe it into the bag stream
		fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob
		    .pipe(bag.createWriteStream(path.join(currentPath, head.name), {}, function() {
			// update the CMDI helper structure
			cmdiProxyListInfoFragment.push( {path: path.join(currentPath, head.name),
							 //name: 'data/'+head.name,
							 name: head.name,
							 size: head.size,
							 type: head.type });
			// process the tail (with update CMDI helper structure
			that.bagItHelper(bag, currentPath, tail, cmdiProxyListInfoFragment);
		   }))
	    }
	} else {
	    // only head there
	    if (head.isDirectory) {
		bag.mkdir(path.join(currentPath, head.name), function(){
		    that.bagItHelper(bag, path.join(currentPath, head.name), head.children, cmdiProxyListInfoFragment);
		});		
	    } else {
		fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob		
		    .pipe(bag.createWriteStream(
			path.join(currentPath, head.name),
			{},
			function() {
			    cmdiProxyListInfoFragment.push( {path: path.join(currentPath, head.name),
							     //name: 'data/'+head.name,
							     name: head.name,							     
							     size: head.size,
							     type: head.type });

			    that.bagCMDI( bag, cmdiProxyListInfoFragment );
			}
		    ))
	    }
	}
    }

    //
    generateZIP( bag, cmdiProxyListInfoFragment ) {

	const that = this;
	const zip = new JSZip();

	console.log('BagSaver/generateZIP', bag, cmdiProxyListInfoFragment);	

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
		FileSaver.saveAs(blob, "projectName.zip");
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