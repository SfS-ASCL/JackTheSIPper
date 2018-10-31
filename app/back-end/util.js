// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: util.js
// Time-stamp: <2018-10-31 14:18:32 (zinn)>
// -------------------------------------------

import xmlbuilder from 'xmlbuilder';
import uuid from 'uuid';

var convert = require('xml-js');

export const ncUser         = process.env.NC_USER;
export const ncPass         = process.env.NC_PASS;
export const softwareVersion     = process.env.VERSION;
export const emailContact        = process.env.CONTACT;
export const emailContactCommand = "mailto:"+emailContact+"?subject=SFB833 - Jack the SIPper";
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


export function getCMDIInstance( profile )
{
    let json = {};
    switch (profile) {
    case "textCorpus":
	json = require('../profiles/instance_json/TextCorpusProfile_instance.json');	    
	break;
    case "lexicalResource":
	json = require('../profiles/instance_json/LexicalResourceProfile_instance.json');	    	    
	break;
    case "speechCorpus":
	json = require('../profiles/instance_json/SpeechCorpusProfile_instance.json');	    	    
	break;
    case "tool":
	json = require('../profiles/instance_json/ToolProfile_instance.json');	    	    
	break;
    case "experiment":
	json = require('../profiles/instance_json/ExperimentProfile_instance.json');	
	break;
    default:
	// todo: create some simple OTHER profile.
	json = require('../profiles/instance_json/TextCorpusProfile_instance.json');	    	
    }

    console.log('getCMDIInstance', json);
    return json;
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
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:firstname"] = researchers[0].firstname;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:lastname"] = researchers[0].lastname;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:email"] = researchers[0].email;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:telephoneNumber"] = researchers[0].phone;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Access"]["cmdp:Contact"]["cmdp:role"] = researchers[0].status;

    // in Person slot; there should be multiple Person components
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Person"]["cmdp:firstName"] = researchers[0].firstname;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:Project"]["cmdp:Person"]["cmdp:lastName"]  = researchers[0].lastname;
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
export function attachResourceProxyInfo( cmdi, profile, fileInfo ) {
    let profilePath = getProfilePath( profile );
    let proxyInf = generateResourceProxyInformation( fileInfo );
    
    let resources = 
	{
	    "ResourceProxyList":{"ResourceProxy": proxyInf.ResourceProxyList},
            "JournalFileProxyList": {"JournalFileProxy": {"JournalFileRef": ""}},
            "ResourceRelationList": {"ResourceRelation": {"RelationType": "", "Res1": "", "Res2": ""}},
	};

    cmdi["cmd:CMD"]["cmd:Resources"] = resources;
    cmdi["cmd:CMD"]["cmd:Components"][profilePath]["cmdp:ResourceProxyListInfo"] = proxyInf.ResourceProxyList;    
    
    return cmdi;    
}

export function buildXML( cmdi )
{
    return xmlbuilder.create(cmdi, { encoding: 'utf-8' }).end({ pretty: true });
}

export function generateResourceProxyInformation( fileInfo )
{
    let resourceProxyList = [];
    let resourceProxyInfo = [];
    
    if (fileInfo === undefined) {
	// do Nothing
    } else {
	for (var i = 0; i < fileInfo.length; i++) {
	    let id = uuid.v4();
	    resourceProxyList.push(
		{
		    "cmd:id" : id,
		    "cmd:ResourceType": {
			"mimetype": fileInfo[i].type,
			"content": "Resource"   
		    },
		    "cmd:ResourceRef": "HandleToBeInserted"+id
		});
	    
	    resourceProxyInfo.push(
		{
		       "cmdp:ResourceProxyInfo": {
			   "cmd:ref": id,
			   "cmdp:ResProxItemName": id,   
			   "cmdp:ResProxFileName": fileInfo[i].name, 
			   "cmdp:FileSize": fileInfo[i].size,       
			   "cmdp:SizeInfo": {
			       "cmdp:TotalSize": {
				   "cmdp:Size": fileInfo[i].size, 
				   "cmdp:SizeUnit": "Bytes"
			       }
			   },
			   "cmdp:Checksums": {
			       "cmd:ref": fileInfo[i].checksum 
			   }
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

    



