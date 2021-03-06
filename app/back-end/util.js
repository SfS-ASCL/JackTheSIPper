// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: util.js
// Time-stamp: <2018-12-04 22:45:18 (zinn)>
// -------------------------------------------

import uuid from 'uuid';
var convert = require('xml-js');

export const ncUser              = process.env.NC_USER;
export const ncPass              = process.env.NC_PASS;
export const softwareVersion     = process.env.VERSION;
export const emailContact        = process.env.CONTACT;
export const emailArchiveContact = process.env.ARCHIVE_CONTACT;

export const emailContactCommand = "mailto:"+emailContact+"?subject=SFB833 - Jack the SIPper";
export const emailArchiveManagerCommand = "mailto:"+emailArchiveContact+"?subject=SFB833 - New research data received.";
export const fileStorageServer   = '/nextcloud/';

export function rewriteURL( fileURL )
{
    const href = window.location.origin.concat(window.location.pathname);
    var corsLink = "";
    if ( fileURL.indexOf("https://weblicht.sfs.uni-tuebingen.de/nextcloud") !== -1 ) {
	corsLink = fileURL.replace('https://weblicht.sfs.uni-tuebingen.de/nextcloud',
				   'weblicht-sfs-nextcloud').concat('/download');
    }
    return href.concat(corsLink);                            
}

export function readCMDI( xmlData )
{
    // read xml data into js object
    const cmdiJS = convert.xml2js(xmlData, {compact: true, spaces: 4});
    //	const cmdiJSON = convert.xml2json(xmlData, {compact: true, spaces: 4});
    
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
	   };
}

export function getExperimentProfile() {
    const profile = convert.xml2js(experimentProfile, {compact: true, spaces: 4});
    console.log('util/getExperimentProfile', profile);
    return profile;
}

export function getCMDIInstance( profile )
{
    let json = {};
     
    switch (profile) {
    case "textCorpus":
	json = require('../profiles/instances/TextCorpusProfile.json');
	break;
    case "lexicalResource":
	json = require('../profiles/instances/LexicalResourceProfile.json');
	break;
    case "speechCorpus":
	json = require('../profiles/instances/SpeechCorpusProfile.json');	    	    
	break;
    case "tool":
	json = require('../profiles/instances/ToolProfile.json');
	break;
    default:
	json = require('../profiles/instances/ExperimentProfile.json');
	break;
    }

    return json;
}

export function errorHandler(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}

export function getProfilePath( profile ) {

    let profilePath = undefined;
    switch (profile) {
    case "textCorpus":
	profilePath = "cmdp:TextCorpusProfile";
	break;
    case "lexicalResource":
	profilePath = "cmdp:LexicalResourceProfile";
	break;
    case "speechCorpus":
	profilePath = "cmdp:SpeechCorpusProfile";
	break;
    case "tool":
	profilePath = "cmdp:ToolProfile";
	break;
    case "experiment":
	profilePath = "cmdp:ExperimentProfile";
	break;
    default:
	// todo, create a simple OTHER profile
	profilePath = "cmdp:TextCorpusProfile";
    }
    
    return profilePath;
}
    
export function attachProject( cmdi, profile, project ) {
    console.log('attachProject', cmdi, profile, project);
    let profilePath = getProfilePath( profile );
    
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:ProjectName"] = project.name;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:ProjectTitle"] = project.name;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Duration"]["cmdp:StartYear"] = project.status;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Funder"]["cmdp:fundingAgency"] = project.context;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Descriptions"]["cmdp:Description"] = project.descriptions;
    
    return cmdi;
}

export function attachResearchers( cmdi, profile, researchers ) {
    let profilePath = getProfilePath( profile );

    // only first researcher added here
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:firstname"] = researchers[0].firstName;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:lastname"] = researchers[0].lastName;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:email"] = researchers[0].email;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:telephoneNumber"] = researchers[0].phone;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:role"] = researchers[0].status;

    // in Person slot; there should be multiple Person components
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Person"]["cmdp:firstName"] = researchers[0].firstName;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Person"]["cmdp:lastName"]  = researchers[0].lastName;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Person"]["cmdp:role"]      = researchers[0].status;

    for (var i = 0; i < researchers.length; i++) {
	let researcher = researchers[i];
	//TODO
    }
    
    return cmdi;    
}

export function attachLicence( cmdi, profile, licence ) {
    let profilePath = getProfilePath( profile );	
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Licence"] = licence;
    return cmdi;    
}

// todo: needs specification/clarification and testing
export function attachResourceProxyInfo( cmdi, profile, cmdiProxyListInfoFragment ) {
    let profilePath = getProfilePath( profile );
    let proxyInf = generateResourceProxyInformation( cmdiProxyListInfoFragment );
    
    let resources = 
	{
	    "cmd:ResourceProxyList":{"cmd:ResourceProxy": proxyInf.ResourceProxyList},
            "cmd:JournalFileProxyList": {"cmd:JournalFileProxy": {"cmd:JournalFileRef": ""}},
            "cmd:ResourceRelationList": {},
	};

    let proxyListInfoTree =
	{
	    "cmdp:ResourceProxyInfo": proxyInf.ResourceProxyListInfo
	};

    cmdi["cmd:CMD"]["cmd:Resources"] = resources;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:ResourceProxyListInfo"] = proxyListInfoTree;
//    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:ResourceProxyListInfo"] = proxyInf.ResourceProxyListInfo;    

    return cmdi;    
}

export function buildXML( cmdi )
{
    return convert.json2xml(cmdi, {compact: true, ignoreComment: true, spaces: 4});
}

export function generateResourceProxyInformation( cmdiProxyListInfoFragment ) {

    let resourceProxyList = [];
    let resourceProxyInfo = [];
    
    if (cmdiProxyListInfoFragment === undefined) {
	// do Nothing
    } else {
	for (var i = 0; i < cmdiProxyListInfoFragment.length; i++) {
	    let id = uuid.v4();
	    let mid = "id_".concat(id);
	    console.log('util/generate...', cmdiProxyListInfoFragment[i]);
	    resourceProxyList.push(
		{ 
		    "_attributes"      : { "id" : mid },
		    "cmd:ResourceType": {
			"_attributes" : { "mimetype": cmdiProxyListInfoFragment[i].type },
			"_text"        : "Resource"
		    },
		    "cmd:ResourceRef": "HandleToBeInserted@"+cmdiProxyListInfoFragment[i].name
		});
	    
	    resourceProxyInfo.push(
		    {
			"_attributes" : { "cmd:ref": mid }, // ns1:
			"cmdp:ResProxItemName": "",   
			"cmdp:ResProxFileName": cmdiProxyListInfoFragment[i].name, 
			"cmdp:SizeInfo": {
			    "cmdp:TotalSize": {
				"cmdp:Size": cmdiProxyListInfoFragment[i].size, 
				"cmdp:SizeUnit": "B"
			    }
			},
			"cmdp:Checksums": {
			    "cmdp:md5" : cmdiProxyListInfoFragment[i].md5,
			    "cmdp:sha1": cmdiProxyListInfoFragment[i].sha256
			}

		});
	}

    const result = 	{
	ResourceProxyList: resourceProxyList,
	ResourceProxyListInfo: resourceProxyInfo
    };
    
    console.log('util/generateResourceProxyInformation', result);
    
    return result;
    }
}

    



