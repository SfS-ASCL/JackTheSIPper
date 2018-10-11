// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Uploader.jsx
// Time-stamp: <2018-10-10 11:45:54 (zinn)>
// -------------------------------------------

/* Uploads a file to the Nextcloud space. */

import Request from 'superagent';
import {fileStorageServer, ncUser, ncPass} from './util';

export default class Uploader {

    constructor( file )  {
	this.file = file;
	this.remoteFilename = undefined;
    }

    uploadFile() {
	let that = this;
	console.log('***', that.file, that.file.name);
	return new Promise(function(resolve, reject) {
	    // 1a. store in NEXTCLOUD
	    Request
		.put(fileStorageServer.concat('remote.php/webdav/').concat(that.file.name))    
		.auth(ncUser, ncPass)
		.set('Access-Control-Allow-Origin', '*')	
		.set('Access-Control-Allow-Credentials', 'true')
		.set('Content-Type', that.file.type)
		.withCredentials()    
		.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
		.send(that.file)
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Error in uploading resource to NC instance');
		    } else {
			// 1b. Create a 'share link' action on the file you uploaded
			Request
			    .post(fileStorageServer.concat('ocs/v1.php/apps/files_sharing/api/v1/shares'))
			    .set('Content-Type', 'application/json')
			    .set('Accept', 'application/xml')
			    .set('Access-Control-Allow-Origin', '*')
			    .set('Access-Control-Allow-Credentials', 'true')
			    .set('OCS-APIRequest',  'true') // nextcloud v11+
			    .send( { path : that.file.name,
				     shareType: 3
				   } )
			    .auth(ncUser, ncPass)			
			    .withCredentials()
			    .end((err, res) => {
				if (err) {
				    reject(err);			
				    alert('Error in creating a share-link with NEXTCLOUD'.concat(that.file.name));
				} else {
				    var parseString = require('xml2js').parseString;
				    parseString(res.text, function (err, result) {
					console.log('sharing result', result, err);
					that.remoteFilename = result.ocs.data[0].url[0].concat('/download')
					that.remoteFilename = that.remoteFilename.replace('http', 'https');
					console.log('Uploader/remoteFilename', that.remoteFilename);
				    });
				    resolve(res)
				}})
		    }
		})})
    }
}



