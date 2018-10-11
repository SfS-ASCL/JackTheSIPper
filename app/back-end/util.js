// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: util.jsx
// Time-stamp: <2018-10-10 11:46:00 (zinn)>
// -------------------------------------------

export const ncUser         = process.env.NC_USER;
export const ncPass         = process.env.NC_PASS;
export const softwareVersion     = process.env.VERSION;
export const emailContact        = process.env.CONTACT;
export const emailContactCommand = "mailto:"+emailContact+"?subject=SFB833 - Jack the SIPper";
export const fileStorageServer   = '/nextcloud/';

var convert = require('xml-js');

export function sleep_inactive(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function sleep(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}

export function rewriteURL( fileURL ) {
    const href = window.location.origin.concat(window.location.pathname);
    var corsLink = "";
    if ( fileURL.indexOf("https://weblicht.sfs.uni-tuebingen.de/nextcloud") !== -1 ) {
	corsLink = fileURL.replace('https://weblicht.sfs.uni-tuebingen.de/nextcloud',
				   'weblicht-sfs-nextcloud').concat('/download');
    }
    return href.concat(corsLink);                            
}

export function readCMDI( xmlData ) {
    // read xml data into js object
    const cmdiJS = convert.xml2js(xmlData, {compact: true, spaces: 4});

    console.log('util/readCMDI', cmdiJS);
    // read xml data into text:
    //	const cmdiJSON = convert.xml2json(xmlData, {compact: true, spaces: 4});
    //	console.log('util/readCMDI', cmdiJSON);	
    
    // depending on the profile (todo: to be stored in the bag)
    const projectStr = cmdiJS["cmd:CMD"]["cmd:Components"]["cmdp:TextCorpusProfile"]["cmdp:Project"];
    const accessStr  = cmdiJS["cmd:CMD"]["cmd:Components"]["cmdp:TextCorpusProfile"]["cmdp:Access"];

    let project =
	{
	    name : projectStr["cmdp:ProjectTitle"]["content"]["_text"],
	    status: projectStr["cmdp:Duration"]["cmdp:StartYear"]["_text"],
	    context: projectStr["cmdp:Funder"]["cmdp:fundingAgency"]["_text"],
	    description: projectStr["cmdp:Descriptions"]["cmdp:Description"]["content"]["_text"]
	};
    
    let researcher = 
	{
	    firstName:  projectStr["cmdp:Person"]["cmdp:firstName"]["_text"],
	    lastName:   projectStr["cmdp:Person"]["cmdp:lastName"]["_text"],
	    email:      accessStr["cmdp:Contact"]["cmdp:email"]["_text"],
	    phone:      accessStr["cmdp:Contact"]["cmdp:telephoneNumber"]["_text"],
	    status:     projectStr["cmdp:Person"]["cmdp:role"]["_text"]
	};

    let profile = cmdiJS["cmd:CMD"]["cmd:Components"]["cmdp:TextCorpusProfile"]["cmdp:GeneralInfo"]["cmdp:ResourceClass"]["_text"];
    let licence = accessStr["cmdp:Licence"]["content"]["_text"];
    
    let resourceProxyList =     cmdiJS["cmd:CMD"]["cmd:Resources"]["cmdp:ResourceProxyList"];
    let resourceProxyListInfo = cmdiJS["cmd:CMD"]["cmd:Components"]["cmdp:TextCorpusProfile"]["cmdp:ResourceProxyListInfo"];
    

    return { "licence"   : licence,
	     "researcher": researcher,
	     "project"   : project,
	     "profile"   : profile,
	     "resourceProxyList":     resourceProxyList,
	     "resourceProxyListInfo": resourceProxyListInfo
	   }
}


