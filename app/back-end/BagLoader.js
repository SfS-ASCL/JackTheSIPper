import JSZip from 'jszip';
import { readCMDI } from '../back-end/util';

// not working, code moved to App.js for the time being
export default class BagLoader {

    constructor(setStateFun) {
	this.setStateFun = setStateFun;
    }
    
    readBag( bagFile )  {
	console.log('BagLoader/readBag', this.setStateFun)
	const that = this;
	const dateBefore = new Date();
	const setParentState = this.setStateFun.bind(this);
	
	JSZip.loadAsync(bagFile)                                  
	    .then(function(zip) {
		const dateAfter = new Date();		
		console.log("(loaded in " + (dateAfter - dateBefore) + "ms)");
		zip.forEach(function (relativePath, zipEntry) { 
		    console.log(zipEntry.name);
		});
		let cmdiFilePromise = zip.file("/bag/data/cmdi.xml").async("string") // arraybuffer
		cmdiFilePromise.then(
		    function(cmdiData) {
			let result = readCMDI(cmdiData);
			console.log('BagLoader/readBag', result, that.setStateFun);

			setParentState(			
			    state => ({ profile: result.profile }));
		    },
		    function(error) {
			console.log('BagLoader/readBag: error case', error);
		    });
	    }, function (e) {
		console.log("Error reading " + bagFile.name + ": " + e.message)
	    });
    };
}
