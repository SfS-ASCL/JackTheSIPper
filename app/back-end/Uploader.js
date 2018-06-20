/* Uploads a file to the Nextcloud space. */

import Request from 'superagent';
import {fileStorageServer,
	b2drop_user,
	b2drop_pass} from './util';

export default class Uploader {

    constructor( { file, type = 'file' } = {})  {
	this.file = file;
	this.protocol = window.location.protocol;

	let today = new Date();
	if (type == 'file') {
	    // todo: some filenames may come without an extension
	    let fileExtension = this.file.name.split('.').pop();
	    this.filenameWithDate = today.getTime() + "." + fileExtension;
	} else {
	    this.filenameWithDate = today.getTime() + ".txt";
	}

	// default upload (overwritten during sharing, todo: clean-up)
	this.remoteFilename = fileStorageServer + this.filenameWithDate;
    }

    // uploading to Nextcloud or B2DROP is a two stage process
    uploadFile() {
	let that = this;
	
	return new Promise(function(resolve, reject) {
	    // 1a. store in B2DROP 
	    Request
		.put(fileStorageServer.concat('remote.php/webdav/').concat(that.filenameWithDate))    
		.auth(b2drop_user, b2drop_pass)
		.set('Access-Control-Allow-Origin', '*')	
		.set('Access-Control-Allow-Credentials', 'true')
		.set('Content-Type', that.file.type)
		.withCredentials()    
		.set('Cache-Control', 'no-cache,no-store,must-revalidate,max-age=-1')
		.send(that.file)
		.end((err, res) => {
		    if (err) {
			reject(err);
			alert('Error in uploading resource to NC/B2Drop instance');
		    } else {
			// 1b. Create a 'share link' action on the file you uploaded
			Request
			    .post(fileStorageServer.concat('ocs/v1.php/apps/files_sharing/api/v1/shares'))
			    .set('Content-Type', 'application/json')
			    .set('Accept', 'application/xml')
			    .set('Access-Control-Allow-Origin', '*')
			    .set('Access-Control-Allow-Credentials', 'true')
			    .set('OCS-APIRequest',  'true') // nextcloud v11+
			    .send( { path : that.filenameWithDate,
				     shareType: 3
				   } )
			    .auth(b2drop_user, b2drop_pass)			
			    .withCredentials()
			    .end((err, res) => {
				if (err) {
				    reject(err);			
				    alert('Error in creating a share-link with B2Drop'.concat(that.filenameWithDate));
				} else {
				    var parseString = require('xml2js').parseString;
				    parseString(res.text, function (err, result) {
					console.log('sharing result', result, err);
					that.remoteFilename = result.ocs.data[0].url[0].concat('/download')
					// hack!
					console.log('Uploader/stored before', that.remoteFilename);					
					that.remoteFilename = that.remoteFilename.replace('http', 'https');
					console.log('Uploader/stored after', that.remoteFilename);
				    });
				    resolve(res)
				}})
		    }
		})})
    }
}



