import BagIt from '../my-bag-it/index.js';
//import BagIt from 'bagit-fs';
import path from 'path';
import JSZip from 'jszip';
var FileSaver = require('file-saver');
var fileReaderStream = require('filereader-stream')

// import fetch from 'node-fetch';

export default class FileTreeHandler {

    constructor( fileTree ) {

	this.fileTree = fileTree;
	this.errorHandler = this.errorHandler.bind(this);
	this.bagItHelper = this.bagItHelper.bind(this);
	this.generateZIPHelper = this.generateZIPHelper.bind(this);

	// initiate FS request
	// this.requestFS();
	this.startBagging();
    }

    generateZIP( bag ) {
	console.log('start generateZIP', bag);
	var that = this;
	var zip = new JSZip();

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

	// process content of manifest file 
	bag.readManifest( function(err, entries) {
	    if (err) return console.log('Error reading manifest', err, bag)
	    // zip each of the entries
	    that.generateZIPHelper( zip, bag, entries )	    
	})
    }
	
    generateZIPHelper(zip, bag, [ head, ...tail ]) {

	var self = this;
	if (head === undefined && !tail.length) {
	    console.log('Called with undefined head and no tail');
	    return [];
	}

	var fileNameFullPath = bag.dir.concat('/').concat(head.name);
	var encoding  = 'binary';
	var c_base64 = true;
	var c_binary = true;
	if ( fileNameFullPath.includes('rtf') || fileNameFullPath.includes('txt') ) {
	    encoding = 'utf-8';
	    c_base64 = false;
	    c_binary = false;
	}

	if (tail.length) {
	    console.log('recurring on tail', tail.length, head, fileNameFullPath, encoding);
	    bag.readFileNoCheck(fileNameFullPath, encoding, function (err, data) {
		if (err) return console.log('Error reading this file', err, fileNameFullPath, data, bag, c_base64, c_binary);	    		
		// zip.file(fileNameFullPath, data, {base64: c_base64});
		zip.file(fileNameFullPath, data, {binary: c_binary});		
		self.generateZIPHelper(zip, bag, tail);   })
	} else {
	    // the first entry is undefined: we take this an indicator to wrap up
	    console.log('recurring on head', tail.length, head, fileNameFullPath, encoding);
	    zip.generateAsync({type:"blob"}).then(function (blob) { 
		console.log('Blob', blob);
		FileSaver.saveAs(blob, "projectName.zip");
	    })			   
	}
    }

    // see https://github.com/jvilk/BrowserFS
    startBagging() {
	var flat = this.fileTree;
	var bagItHelper = this.bagItHelper;
	var generateZIP = this.generateZIP;

	var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
	console.log('startBagging', Buffer);
	BrowserFS.configure({
	    fs: "LocalStorage",
	    options: {}
	}, function(e) {
	    if (e) {
		// An error occurred.
		throw e;
	    } else {
		// Otherwise, BrowserFS is ready to use!
    		var bag = BagIt('/bag', 'sha256', {'Contact-Name': 'Claus Zinn'});
		// console.log('FileTreeHandler', bag, flat);
		var entryPoints = flat[0].node.children; // all childrens of the SIP root node
		if (entryPoints === undefined) {
		    console.log('There is an empty list of children', bag);
		    bag.finalize( function () {
			console.log('FileTreeHandler/startBagging: bag has been finalized with no children', bag);
			bag.readManifest( function(err, entries) {
			    if (err) return console.log('Error reading manifest', err, bag)
			    console.log('readManifest entries (no children)', entries ) });
		    })
		} else {
		    bagItHelper( bag, '', entryPoints ); // bagDirectory at root ''
		}
	    }
	})
    }

    bagItHelper(bag, currentPath, [ head, ...tail ]) {

	if (head === undefined && !tail.length) {
	    console.log('Called with undefined head and no tail');
	    return [];
	}
	
	var filePath
	var that = this;
	if (head.isDirectory) {
	    filePath = path.join(currentPath, head.value);
	} else {
	    filePath = path.join(currentPath, head.title);
	}
	
	console.log('FileTreeHandler/bagItHelper filePath', filePath, head, tail);

	if (tail.length) {
	    // process head
	    if (head.isDirectory) {
		// process the directorys children (with new path)
		bag.mkdir(filePath, function(){
		    console.log('bagItHelper, created dir', filePath);
		    // and treat its children
		    that.bagItHelper(bag, filePath, head.children);		    
		});

	    } else {
		console.log('recurring on tail', tail.length);
		fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob
		   .pipe(bag.createWriteStream(filePath, {}, function() {
		       that.bagItHelper(bag, currentPath, tail); }))
	    }
	} else {
	    // only head there
	    if (head.isDirectory) {
		bag.mkdir(filePath, function(){
		    console.log('bagItHelper, created dir II', {}, filePath);
		    that.bagItHelper(bag, filePath, head.children);
		});		
	    } else {
		console.log('recurring on head', tail.length);
		fileReaderStream(head.file) // ;bag.createReadStream(head.file) fromBlob		
		   .pipe(bag.createWriteStream(filePath,
					       {},
					       function() {
						   bag.finalize( function () {
						       console.log('FileTreeHandler/startBagging: bag has been finalized', bag);	
						       that.generateZIP( bag );
		})}));
	    }
	}
    }

    errorHandler(e) {
	console.log('errorHandler: ', e);
    }
}