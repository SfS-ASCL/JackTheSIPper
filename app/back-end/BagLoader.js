// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: BagLoader.jsx
// Time-stamp: <2018-10-12 11:15:17 (zinn)>
// -------------------------------------------



import { readCMDI } from '../back-end/util';
import BagIt from '../my-bag-it/index.js';
import SortableTree, {addNodeUnderParent, find} from 'react-sortable-tree';

    /* User loaded single application/zip file that contains a bag
       Given the bag's information, it is required to:

       1. read the project-related information to update state.project
       2. read the researchers'-related information to update state.researchers
       3. read the profile to update state.profile
       4. read the licence information to update state.licence
       5. read the entire file structure to update state.treeData and state.researchData
       6. read the CMDI-based metadata

       --
       7. a validation process should support steps 1-6.
    */


export default class BagLoader {

    constructor(parentState) {
	console.log('BagLoader/constructor', parentState);
	this.parentState = parentState;
    }

    /* loads the bag into the browser's state so that UI forms get set to the resp. values
       extracted from the zipFile; to ensure that the zip file is properly loaded,
       the BagIt API is used to read files from the zip

       After that, you can write code like this:

       var fs = require('fs');
       fs.writeFile('/test.txt', 'Cool, I can do this in the browser!', function(err) {
         fs.readFile('/test.txt', function(err, contents) {
         	 console.log(contents.toString());
		 });
	});
    */

    loadBag(zipFile) {

	const that = this;
	var output = undefined;
	var data = undefined;
	var array = undefined;
	var fr = new FileReader();
	fr.onload = function () {
	    data = fr.result;
	    array = new Int8Array(data);
	    output = JSON.stringify(array, null, '  ');

	    /* this reads the zip file containing the bag
               into the browser's filesystem. Here, a ZIPFS is used
	       that mounts the bag onto /zip
	    */
	    
	    var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
	    BrowserFS.configure({
		fs: "MountableFileSystem",
		options: {
		    "/zip": {
			fs: "ZipFS",
			options: {
			    // Wrap as Buffer object.
			    zipData: Buffer.from( array )
			}
		    },
		}
	    }, function(error) {
		if (error) {
		    // An error occurred.
		    console.log("AN ERROR HAS OCCURED");
		    throw error;
		} else {
		    // file system is ready to use.
		    var fs = BrowserFS.BFSRequire('fs');
		    fs.readdir('/zip', function(e, contents) {
			if (e) {
			    console.log("ERROR when reading zip directory", contents);
			} else {
			    console.log('SUCCESS when reading zip directory', contents);
			    that.readProfileFromZip(fs, contents[0]);
			    that.readCMDIFromZip(fs, contents[0]);
			    that.readFileTreeFromZip(fs, contents[0]);
			}
		    });
		}
	    })
	}

	fr.readAsArrayBuffer(zipFile);
    }

    // read data/.profile
    readProfileFromZip(fs, bagDir) {
	fs.readFile('/zip/'+bagDir+'/data/.profile', function(err, contents) {
	    console.log('BagLoader/readProfileFromZip', contents.toString());
	})
    }

    // read data/cmdi.xml 
    readCMDIFromZip(fs, bagDir) {
	fs.readFile('/zip/'+bagDir+'/data/cmdi.xml', function(err, contents) {
	    var parseString = require('xml2js').parseString;
	    parseString(contents, function (err, result) {
		console.log(result);
	    });

	    // alternatively
	    const relCMDI = readCMDI(contents);
	    console.log('relCMDI', relCMDI);
	})
    }

    // read file structure, using manifest file
    readFileTreeFromZip(fs, bagDir) {

    	var bag = BagIt('/zip/'+bagDir, 'sha256');
	const that = this;
	bag.readFileNoCheck( bag.manifest, 'utf-8', function(err, data) {
	    if (err) {
		return console.log('Error reading manifest', err, bag);
	    } else {
		console.log('entire file:', data);
		var lines = data.split('\n');
		var files = [];
		for(var i = 0;i < lines.length;i++){
		    if (lines[i] == "") {
			console.log('empty line', lines[i]);
		    } else {
			var lineInfo = lines[i].split(' data/');
			console.log('line', i, lineInfo[1]);
			files.push( lineInfo[1] );
		    }
		}
		// sort the files alphabetically
		files = files.sort();
		console.log('BagLoader/readFileTreeFromZip', files);	    
		that.readFileTreeFromZipHelper(fs, bagDir, files);
	    }
	})
    }

    ignoreFile( file ) {
	return ( ( file == "cmdi.xml") ||
		 ( file == ".profile" ) )
    }

    isDirectory( file ) {
	return file.substr(-1) == "/";
    }

    findNode( nodeName ) {
	const keyFromTreeIndex = ({ treeIndex }) => treeIndex;
	const keyFromKey = ({ node }) => node.key;
	const commonArgs = {
	    searchQuery: nodeName,
	    searchMethod: ({ node, searchQuery }) => node.name === searchQuery,
	    expandAllMatchPaths: false,
	    expandFocusMatchPaths: true,
	    getNodeKey: keyFromTreeIndex,
	    searchFocusOffset: 0,
	};

	const treeData = this.parentState.state.treeData;
	const results = find({ ...commonArgs, treeData });
	if (results.matches.length) {
	    return results.matches[0];
	} else {
	    return undefined;
	}
    }
    
    // reading from the zip file does not give us a file's date or mimetype
    // for this, we might need to consult the cmdi.xml
    readFileTreeFromZipHelper(fs, bagDir, [ head, ...tail ]) {
	const that = this;
	const getNodeKey = ({ treeIndex }) => treeIndex;
	const parentKey = that.findNode("experiments");

	console.log('BagLoader/readFileTreeFromZipHelper ==>', parentKey);
	
	if (tail.length) {
	    // process head
	    fs.readFile('/zip/'+bagDir+'/data/'+head, function(err, data) {
		if (err) {
		    console.log('readFileTreeFromZipHelper: error in reading', '/zip/'+bagDir+'/data/'+head, err);
		} else {
		    console.log('readFileTreeFromZipHelper: success in reading', head, data, data.length);
		    if ( ! that.ignoreFile( head )  ) {
			that.parentState.setState( (state) => {
			  return {treeData : addNodeUnderParent({ treeData: state.treeData,
								  parentKey: parentKey,
								  expandParent: true,
								  getNodeKey,
								  newNode: {
								      file: (that.isDirectory(head) ? null : data) ,
								      name: head,
								      isDirectory: that.isDirectory(head),
								      size: (that.isDirectory(head) ? 0 : data.length),
								      type: "unknown",
								      date: "no one cares"
								  },
								}).treeData
				 };
			})
		    }
		    // recur on tail
		    that.readFileTreeFromZipHelper(fs, bagDir, tail);
		}
	    })
	} else {
	    // process head (tail is nil)
	    fs.readFile('/zip/'+bagDir+'/data/'+head, function(err, data) {
		if (err) {
		    console.log('readFileTreeFromZipHelper/term: error in reading', '/zip/'+bagDir+'/data/'+head, err);
		} else {
		    console.log('readFileTreeFromZipHelper/term: success in reading', head, data, data.length);
		    if ( ! that.ignoreFile( head )  ) {		    
			that.parentState.setState( (state) => {
			    return {treeData : addNodeUnderParent({ treeData: state.treeData,
								    parentKey: parentKey,
								    expandParent: true,
								    getNodeKey,
								    newNode: {
									file: (that.isDirectory(head) ? null : data),
									name: head,
									isDirectory: that.isDirectory(head),
									size: (that.isDirectory(head) ? 0 : data.length),
									type: "unknown",
									date: "no one cares"
								    },
								  }).treeData
				   };			
			})
		    }
		}
	    })
	}
    }



	// zip bag-info.txt file
	/*
	bag.readFileNoCheck( bag.dir+'/bag-info.txt', 'utf-8', function(err, data) {
	    if (err) return console.log('Error reading bag-info.txt file', err, bag)
	    console.log('bag-info', data);
	})
	*/
}
