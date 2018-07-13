import xmlbuilder from 'xmlbuilder';
import {instantiateTextCorpusProfile,
	instantiateResourceProxyListInfo} from '../templates/TextCorpusProfile-CMDI1.2_template.js';

export default class CMDIHandler {
    constructor( project, researcher, profile, license, researchData ) {

	this.processManifest  = this.processManifest.bind(this);
	this.generateResourceProxyList = this.generateResourceProxyList.bind(this);
	this.createCMDI = this.createCMDI.bind(this);
	
	this.cmdiGenFinalise = this.createCMDI( project, researcher, profile, license);
//	console.log('CmdiHandler/constructor', this.cmdiGenFinalise);
    }
	
    createCMDI( project, researcher, profile, license ){
	const jsonCMDI_fun = instantiateTextCorpusProfile( project, researcher, profile, license );
	return jsonCMDI_fun
    }

    finaliseCMDI( proxyListInfo ) {
	if (this.cmdiGenFinalise == undefined) return

	const result = this.cmdiGenFinalise( proxyListInfo[0].ResourceProxyList,       // todo, only taking first.
					     proxyListInfo[0].ResourceProxyListInfo );

	return xmlbuilder.create(result, { encoding: 'utf-8' }).end({ pretty: true });
    }
	
	
    // generates both ResourceProxyList and ResourceProxyListInfo
    generateResourceProxyList( fileInfo ) {
	const that = this;
	let result = [];
	
	for (var i = 0; i < fileInfo.length; i++) {
	    result.push(
		instantiateResourceProxyListInfo(fileInfo[i].name,
						 fileInfo[i].name, // <======= todo
						 fileInfo[i].size,
						 fileInfo[i].type,
						 fileInfo[i].checksum)
	    )
	}

	return result;
	// return xmlbuilder.create(result, { encoding: 'utf-8' }).end({ pretty: true });
	
    }
	    
    // deprecated, iteration now in BagHandler
    processManifest( file ) {

	const reader = new FileReader();

	reader.onload = (event) => {
            const file = event.target.result;
            const allLines = file.split(/\r\n|\n/);
            // Reading line by line
            allLines.forEach((line) => {
		console.log(line);
            });
	};
	
	reader.onerror = (event) => {
            alert(event.target.error.name);
	};
	
	reader.readAsText(file);
    }    


    CMDI_template_Project( project,  researcher) {
	var template =
	    { "projectInfo" :
	      {
	    "ProjectName": project.name,
	    "ProjectTitle": project.name,
	    "Url": [],
	    "Funder": {
		"fundingAgency": []
	    },

	    // prefilled
	    "Institution": {
		"Department": ["Seminar für Sprachwissenschaft, Universität Tübingen"],
		"Url": ["www.sfs.uni-tuebingen.de"],
		"Organisation": ["Universität Tübingen"],
		"Descriptions": {
		    "Description": []
		}
	    },
	    "Cooperations": {
		"Cooperation": {
		    "CooperationPartner": [],
		    "Organisation": []
		}
	    },
	    "Person": {
		"firstName": researcher.firstName,
		"lastName": researcher.lastName,
		"Role": researcher.status
	    },
	    "Descriptions": {
		"Description": [ project.description]
	    },
	    "Duration": []
	      }};
	
	return template;
    }

    CMDI_template_ResourceProxyList(landingPage, resourceList) {
	var template = 
	{
	    "ResourceProxyList": [
		{
		    "@id": "GermaNet_resLP",
		    "ResourceType": "LandingPage",
		    "@mimetype":    "application/xml",
		    "ResourceRef": "http://www.sfs.uni-tuebingen.de/GermaNet"
		},
		{
		    "@id": "GermaNet_res6",
		    "ResourceType": "Resource",
		    "@mimetype":    "application/pdf",
		    "ResourceRef": "http://hdl.handle.net/11858/00-1778-0000-0005-896E-B @ ds2" // PID @ filename
		},
	    ],
	    "JournalFileProxyList": [],
	    "ResourceRelationList": []
	}

	return undefined;
    }

    CMDI_template_ResourceProxyListInfo(reference, fileName, fileSize, sizeInfoSize, sizeInfoSizeUnit) {
	var template =
	{
	    "ResourceProxyInfo": {
		"@ref": reference, // referring to the corresponding item in the list
		"ResProxItemName": undefined, // usually empty
		"ResProxFileName": fileName,
		"FileSize": fileSize,
		"SizeInfo": {
		    "TotalSize": {
			"Size": sizeInfoSize,
			"SizeUnit": sizeInfoSizeUnit
		    }
		},
		"Checksums" : {
		    "md5": "md5_value",
		    "sha1": "sha1_value"
		}
	    }
	}
	return undefined;
    }


}
