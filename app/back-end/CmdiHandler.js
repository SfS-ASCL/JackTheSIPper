// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: CMDIHandler.jsx
// Time-stamp: <2018-10-10 13:17:54 (zinn)>
// -------------------------------------------

import xmlbuilder from 'xmlbuilder';
import {instantiateTextCorpusProfile,
	instantiateResourceProxyListInfo} from '../templates/TextCorpusProfile-CMDI1.2_template.js';

export default class CMDIHandler {
    constructor( state ) {
	if (state.profile == "textCorpus") {
	    this.cmdiInstance = instantiateTextCorpusProfile( state.project,
							      state.researchers,
							      state.profile,
							      state.licence );
	} else {
	    alert('No CMDI support for profile', state.profile, 'yet.');
	}
    }
	
    finaliseCMDI( proxyListInfoArray ) {
	if (this.cmdiInstance == undefined) return

	const lists  = this.generateResourceProxyLists( proxyListInfoArray );
	const result = this.cmdiInstance( lists.ResourceProxyList,         
					  lists.ResourceProxyListInfo );

	console.log('result before generating', result);
	return xmlbuilder.create(result, { encoding: 'utf-8' }).end({ pretty: true });
    }

    finaliseCMDI_JSON( proxyListInfoArray ) {
	if (this.cmdiInstance == undefined) return

	const lists  = this.generateResourceProxyLists( proxyListInfoArray );
	const result = this.cmdiInstance( [], //lists.ResourceProxyList,         
					  [] ); // lists.ResourceProxyListInfo

	console.log('result before generating', result);
	return result;
    }
    
    generateResourceProxyLists( fileInfo ) {
	let intermediateResult = [];
	
	let resourceProxyLists = [];
	let resourceProxyListInfos = [];		

	// 1. collect all json structures
	for (var i = 0; i < fileInfo.length; i++) {
	    intermediateResult.push(
		instantiateResourceProxyListInfo(fileInfo[i].name,
						 fileInfo[i].name, // <======= todo
						 fileInfo[i].size,
						 fileInfo[i].type,
						 fileInfo[i].checksum)
	    )
	}

	// 2. reshuffle to correct place
	for (var i = 0; i < intermediateResult.length; i++) {
	    console.log('pushing list', intermediateResult[i].ResourceProxyList);
	    console.log('pushing info', intermediateResult[i].ResourceProxyListInfo);	    
	    resourceProxyLists.push(    intermediateResult[i].ResourceProxyList);
	    resourceProxyListInfos.push(intermediateResult[i].ResourceProxyListInfo);
	}

	const result = 	{
	    ResourceProxyList: resourceProxyLists,
	    ResourceProxyListInfo: resourceProxyListInfos
	};
	
	console.log('CMDIHandler/generateResourceProxyLists', result);
	
	return result;
    }
}
