import xmlbuilder from 'xmlbuilder';

export default class CmdiHandler {
    constructor( projectId ) {

	projectName = projectId;
	var cmdi = xmlbuilder.create(c_projectCMD, { encoding: 'utf-8' })
	console.log(cmdi.end({ pretty: true }));
    }

    c_resourceProxyList(landingPage, resourceList) {
	var template = 
	{
	    "ResourceProxyList": [
		{
		    "@id": "GermaNet_resLP",
		    "ResourceType": "LandingPage",
		    "ResourceRef": "http://www.sfs.uni-tuebingen.de/GermaNet"
		},
		{
		    "@id": "GermaNet_res6",
		    "ResourceType": "Resource",
		    "ResourceRef": "http://hdl.handle.net/11858/00-1778-0000-0005-896E-B@ds2"
		},
	    ],
	    "JournalFileProxyList": [],
	    "ResourceRelationList": []
	}

	return undefined;
    }

    c_resourceProxyListInfo(reference, itemName, fileName, fileSize, sizeInfoSize, sizeInfoSizeUnit) {
	var template =
	{
	    "ResourceProxyInfo": {
		"@ref": reference,
		"ResProxItemName": itemName,
		"ResProxFileName": fileName,
		"FileSize": fileSize,
		"SizeInfo": {
		    "TotalSize": {
			"Size": sizeInfoSize,
			"SizeUnit": sizeInfoSizeUnit
		    }
		}
	    }
	}
	return undefined;
    }

    c_generalInfo( resourceName, resourceTitle, resourceClass, resourceDescription) {
	var template = 
	{
	    "ResourceName": resourceName,
	    "ResourceTitle": {
		"@lang": "de",
		"#text": resourceTitle
	    },
	    "ResourceClass": resourceClass,
	    "PublicationDate": "",
	    "LastUpdate": "",
	    "TimeCoverage": {},
	    "LegalOwner": [
		{
		    "@lang": "en",
		    "#text": "University of Tübingen"
		}
	    ],
	    "Genre": [],
	    "Location": {
		"Address": "Seminar für Sprachwissenschaft, Wilhelmstr. 19, D-72074 Tübingen",
		"Country": {
		    "CountryName": {
			"@lang": "de",
			"#text": "Deutschland"
		    },
		    "CountryCoding": "DE"
		}
	    },
	    "Descriptions": [
		{
		    "@lang": "en",
		    "#text": resourceDescription
		}
	    ],
	    "tags": [],

	    "ModalityInfo": {
		"Modalities": "",
		"Descriptions": {
		    "Description": []
		}
	    }
	};
	
	return undefined;
    }

    c_projectCMD( projectName, projectTitle, projectPersonFirstName, projectPersonLastName, projectRole) {
	var template = 
	{
	    "ProjectName": projectName,
	    "ProjectTitle": projectTitle,
	    "Url": [],
	    "Funder": {
		"fundingAgency": []
	    },
	    "Institution": {
		"Department": [],
		"Url": [],
		"Organisation": [],
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
		"firstName": projectPersonFirstName,
		"lastName": projectPersonLastName,
		"Role": projectRole
	    },
	    "Descriptions": {
		"Description": []
	    },
	    "Duration": []
	};
	
	return undefined;
    }
}
