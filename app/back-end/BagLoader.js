// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: BagLoader.jsx
// Time-stamp: <2018-10-11 10:20:13 (zinn)>
// -------------------------------------------

import JSZip from 'jszip';
import { readCMDI } from '../back-end/util';
import BagIt from '../my-bag-it/index.js';
import SortableTree, {addNodeUnderParent} from 'react-sortable-tree';
var fileReaderStream = require('filereader-stream');


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

    constructor(setStateFun) {
	this.setStateFun = setStateFun;
	this.onDropBagFileHelper  = this.onDropBagFileHelper.bind(this);
	this.loadBag              = this.loadBag.bind(this);
    }

    onDropBagFileHelper( resourceProxyList, resourceProxyListInfo ) {
	const getNodeKey = ({ treeIndex }) => treeIndex;
	var parentKey = this.state.parentKey;

	console.log('App/onDropBagFileHelper', resourceProxyList, resourceProxyListInfo,
		    resourceProxyList.length, resourceProxyListInfo.length );
	
	if (! (resourceProxyList.length == resourceProxyListInfo.length) ) {
	    alert("Conflict in ResourceProxy information");
	} else {
	    for (var i=0; i<resourceProxyList.length; i++) {
		console.log('App/onDropBagFileHelper',
			    resourceProxyList[i]["cmd:ResourceProxy"]["cmd:ResourceRef"]["_text"], '::',
			    resourceProxyList[i]["cmd:ResourceProxy"]["cmd:ResourceType"]["mimetype"]["_text"],'::',
			    
			    resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:FileSize"]["_text"],'::',
			    resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:ResProxFileName"]["_text"],'::',
			    resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:ResProxItemName"]["_text"] );

		let fileSize = resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:FileSize"]["_text"];
		let fileName = resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:ResProxFileName"]["_text"];
		let fileType = resourceProxyList[i]["cmd:ResourceProxy"]["cmd:ResourceType"]["mimetype"]["_text"]

		fileName = fileName.replace('data/', ''); 
    		this.setStateFun( (state) => {
		    return {treeData : addNodeUnderParent({ treeData: state.treeData,
							    parentKey: parentKey,
							    expandParent: true,
							    getNodeKey,
							    newNode: {
								file: "readFromSIP", // needs to be fetched from bag
								name: fileName,
								isDirectory: false, 
								size: fileSize,
								type: fileType,
								date: "no one cares"
							    },
							  }).treeData
			   };
		})
	    }}
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
	    }, function(e) {
		if (e) {
		    // An error occurred.
		    throw e;
		}
		var fs = BrowserFS.BFSRequire('fs');
		fs.readdir('/zip/bag-d8abf2f5-6301-43d1-ac2e-4ba840f85a0c/data', function(e, contents) {
		    console.log('reading /zip/bag-d8abf2f5-6301-43d1-ac2e-4ba840f85a0c/data', contents);
		});		// Otherwise, BrowserFS is ready to use!
	    })
	}

	fr.readAsArrayBuffer(zipFile);
    }
	
    populateFileTree() {
    	var bag = BagIt('/bag', 'sha256', {'Contact-Name': 'Claus Zinn'}); // 
	that.bagItHelper(zip, bag, entries);
	
	let cmdiFilePromise = zip.file("/bag/data/cmdi.xml").async("string") // arraybuffer
	cmdiFilePromise.then(
	    function(cmdiData) {
		let result = readCMDI(cmdiData);
		console.log('BagLoader/loadBag', result, that.setStateFun); // 
		console.log('App/onDropBagFile', result, that);
		that.onDropBagFileHelper( result.resourceProxyList, result.resourceProxyListInfo ); // populate the file tree
		
		
		setParentState(			
		    state => ({ profile: result.profile }));
	    },
	    function(error) {
		console.log('BagLoader/loadBag: error case', error);
	    });
    }
