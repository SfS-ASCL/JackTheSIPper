import BagIt from '../my-bag-it/index.js';
import CMDIHandler from './CMDIHandler';
import crypto from 'crypto';
import md5 from 'md5';
import shajs from 'sha.js';

//import BagIt from 'bagit-fs';
import path from 'path';

import JSZip from 'jszip';
var FileSaver = require('file-saver');
var fileReaderStream = require('filereader-stream')

// import fetch from 'node-fetch';

export default class BagHandler {

    constructor( state, setState ) {

	this.state = state;
	this.setState = setState.bind(this);
	
	this.bagItHelper = this.bagItHelper.bind(this);
	this.generateZIP = this.generateZIP.bind(this);
	this.generateZIPHelper = this.generateZIPHelper.bind(this);

	this.cmdiHandler = new CMDIHandler( this.state.project,
					    this.state.researcher,
					    this.state.profile,
					    this.state.licence,
					    this.state.researchData);

    }

    // alternative: create /bag<uuid> directory with <uuid> newly generated for each bag
    deleteBagManifestFile()  {
	var fs = require('fs');
	console.log('BagHandler/deleteBagManifestFile')
	fs.stat('/bag/manifest-sha256.txt', function (err, stats) {
	    console.log(stats);//here we got all information of file in stats variable
	    if (err) {
		return console.error(err);
	    }
	    fs.unlink('/bag/manifest-sha256.txt',function(err){
		if(err) return console.log(err);
		console.log('file deleted successfully');
	    });  
	});
    }
	
    // see https://github.com/jvilk/BrowserFS
    createBag() {
	const that = this;
	if (this.state.researchData == undefined) return;
	
	var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
	BrowserFS.configure({
	    fs: "LocalStorage",
	    options: {}
	}, function(e) {
	    if (e) {
		throw e;
	    } else {
		// todo: create CMDI (passed on to this.state)
		console.log('BagHandler/createBag');
		that.deleteBagManifestFile( );
    		var bag = BagIt('/bag', 'sha256', {'Contact-Name': 'Claus Zinn'});
		var entryPoints = that.state.researchData[0].node.children; // all childrens of the SIP root node
		that.bagItHelper( bag, '', entryPoints, [] );     // bagDirectory at root ''
	    }
	})
    }

    // todo: gather file information for CMDI ResourceProxyInfo...
    bagItHelper(bag, currentPath, [ head, ...tail ], cmdiProxyListInfoFragment) {

	if (head === undefined && !tail.length) {
	    return [];
	}
	
	var filePath
	var that = this;
	if (head.isDirectory) {
	    filePath = path.join(currentPath, head.value);
	} else {
	    filePath = path.join(currentPath, head.title);
	}
	
	if (tail.length) {
	    // process head
	    if (head.isDirectory) {
		// process the directorys children (with new path)
		bag.mkdir(filePath, function(){
		    // and treat its children
		    that.bagItHelper(bag, filePath, head.children, cmdiProxyListInfoFragment);		    
		});

	    } else {
		fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob
		    .pipe(bag.createWriteStream(filePath, {}, function() {
			cmdiProxyListInfoFragment.push( {path: filePath,
					    name: 'data/'+head.title,
					    size: head.size,
					    type: head.type });
			that.bagItHelper(bag, currentPath, tail, cmdiProxyListInfoFragment);
		   }))
	    }
	} else {
	    // only head there
	    if (head.isDirectory) {
		bag.mkdir(filePath, function(){
		    that.bagItHelper(bag, filePath, head.children, cmdiProxyListInfoFragment);
		});		
	    } else {
		fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob		
		   .pipe(bag.createWriteStream(filePath,
					       {},
					       function() {
						   cmdiProxyListInfoFragment.push( {path: filePath,
								       name: 'data/'+head.title,
								       size: head.size,
								       type: head.type });

						   // at the very end, add the CMDI file to the bag
						   let completeCMDI = that.cmdiHandler.finaliseCMDI( cmdiProxyListInfoFragment );
						   let cmdiFile = new File([completeCMDI], "cmdi.xml", {type: "application/xml"});
						   // 2 second add to bag
						   fileReaderStream(cmdiFile)
						       .pipe(bag.createWriteStream("cmdi.xml",
										   {},
										   function() {
										       bag.finalize( function () {
											   console.log('BagHandler/createBag: bag has been finalized', bag);
											   // add cmdi to bag (and then generate ZIP)
											   that.generateZIP( bag, cmdiProxyListInfoFragment ); 
											   // that.setState( state => ({
											   // 	   "bag" : bag
						       // }), () => { 
											   // 	   that.generateZIP( bag );
											   // })
										       })}));
					       }))
	    }
	}
    }

    generateZIP( bag, cmdiProxyListInfoFragment ) {

	const that = this;
	const zip = new JSZip();

	console.log('BagHandler/generateZIP', bag, cmdiProxyListInfoFragment);	

	// use this, rather than the manifest file?
	bag.readdir('', function(err, data) {
	    if (err) return console.log('Error reading directory', err, bag);	    		
	    console.log('readdir at ""', data);
	});
	
	// zip manifest file
	bag.readFileNoCheck( bag.manifest, 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading manifest', err, bag)
	    console.log('zipping manifest file', bag.manifest, data);
	    zip.file(bag.manifest, data);
	})

	// zip bag-info.txt file
	bag.readFileNoCheck( '/bag/bag-info.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bag-info.txt file', err, bag)
	    console.log('zipping bag-info.txt file', '/bag/bag-info.txt', data);
	    zip.file('/bag/bag-info.txt', data);
	})

	// zip bag.it.txt file
	bag.readFileNoCheck( '/bag/bagit.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bagit.txt file', err, bag)
	    console.log('zipping bag-it.txt file', '/bag/bagit.txt', data);
	    zip.file('/bag/bag-it.txt', data);
	})

	// process content of manifest file 
	bag.readManifest( function(err, entries) {
	    if (err) return console.log('Error reading manifest', err, bag)
	    // zip each of the entries
	    that.generateZIPHelper( zip, bag, entries, cmdiProxyListInfoFragment )	    
	})

	// test to generate md5
	bag.readFileNoCheck( '/bag/bagit.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bagit.txt file', err, bag)
	    console.log('md5-ing bag-it.txt file', '/bag/bagit.txt', md5(data));
	})

	// test to generate sha on binary file (todo, need to check accuracy for binary files)
	bag.readFileNoCheck( '/bag/data/germanText.docx', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading file', err, bag)
	    console.log('sha-ing bag/data/germanText.docx file', '/bag/data/germanText.docx', shajs('sha256').update(data).digest('hex'));
	})

	// test to generate sha on text file	
	bag.readFileNoCheck( '/bag/data/germanText.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading file', err, bag)
	    console.log('sha-ing bag/data/germanText.txt file', '/bag/data/germanText.txt', shajs('sha256').update(data).digest('hex'));
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
		//console.log('BagHandler/generateZIPHandler: we have a textfile', mimetype);
		encoding = 'utf-8';
		c_binary = false;		
	    } else {
		//console.log('BagHandler/generateZIPHandler: we have a non textfile', mimetype);
	    }
	    
	    bag.readFileNoCheck(fileNameFullPath, encoding, function (err, data) {
		if (err) return console.log('Error reading this file', err, fileNameFullPath, data, bag, c_binary);
		cmdiProxyListInfoFragment = that.addChecksum(head.checksum, head.name, cmdiProxyListInfoFragment)
		zip.file(fileNameFullPath, data, {binary: c_binary});
		that.generateZIPHelper(zip, bag, tail, cmdiProxyListInfoFragment);
	    })
	} else {
	    zip.generateAsync({type:"blob"}).then(function (blob) { 
		console.log('Blob', blob, cmdiProxyListInfoFragment);
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