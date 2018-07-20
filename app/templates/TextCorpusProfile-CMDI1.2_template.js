import uuid from 'uuid';

export function instantiateResourceProxyListInfo( file, name, size, type, checksum ) {
    const id = uuid.v4();
    
    return (
	{  "ResourceProxyList" :
	   {
	       "cmd:ResourceProxy": {
		   "cmd:ResourceType": {
                       "mimetype": type,       // <============
                       "content": "Metadata"   // <============ (todo)
		   },
		   "cmd:ResourceRef": id
               }
	   },
	   
	   "ResourceProxyListInfo" : {  
               "cmdp:ResourceProxyInfo": {
                   "xml:base": "http://www.oxygenxml.com/",
                   "cmd:ref": "ID000",
                   "cmd:ComponentId": "clarin.eu:cr1:c_1361876010673",
                   "cmdp:ResProxItemName": id,   // <============
                   "cmdp:ResProxFileName": name, // <============
                   "cmdp:CharacterEncoding": {
                       "xml:lang": "en-US",
                       "content": "CharacterEncoding0"
                   }, 
                   "cmdp:FileSize": size,        // <============
                   "cmdp:SizeInfo": {
                       "xml:base": "http://www.oxygenxml.com/",
                       "cmd:ref": "ID000",
                       "cmd:ComponentId": "clarin.eu:cr1:c_1450777779942",
                       "cmdp:TotalSize": {
                           "xml:base": "http://www.oxygenxml.com/",
                           "cmd:ref": "ID000",
                           "cmd:ComponentId": "clarin.eu:cr1:c_1459844210452",
                           "cmdp:Size": size,    // <============
                           "cmdp:SizeUnit": "Bytes"
                       }
                   },
                   "cmdp:Descriptions": {
                       "xml:base": "http://www.oxygenxml.com/",
                       "cmd:ref": "ID000",
                       "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                       "cmdp:Description": {
                           "type": "short",
                           "xml:lang": "en-US",
                           "content": "Description19"
                       }
                   },
                   "cmdp:LanguageScripts": {
                       "xml:base": "http://www.oxygenxml.com/",
                       "cmd:ref": "ID000",
                       "cmd:ComponentId": "clarin.eu:cr1:c_1290431694510",
                       "cmdp:LanguageScriptGrp": {
                           "xml:base": "http://www.oxygenxml.com/",
                           "cmd:ref": "ID000",
                           "cmd:ComponentId": "clarin.eu:cr1:c_1290431694509",
                           "cmdp:ScriptName": {
                               "xml:lang": "en-US",
                               "content": "ScriptName0"
                           },
                           "cmdp:LanguageScript": {
                               "xml:lang": "en-US",
                               "content": "LanguageScript0"
                           }
                       }
                   },
                   "cmdp:Checksums": {
                       "xml:base": "http://www.oxygenxml.com/",
                       "cmd:ref": checksum // <============
                   }
               }
           }
	}
    )
}

export function instantiateTextCorpusProfile( project, researcher, profile, licence ) {
    console.log('instantiateTextCorpusProfile', project, researcher, profile, licence );
    return ( function( resourceProxyList, resourceProxyListInfo) {
	console.log('adding', resourceProxyList, resourceProxyListInfo);
	return (
{"cmd:CMD": {
    "xmlns:cmd": "http://www.clarin.eu/cmd/1",
    "xmlns:cue": "http://www.clarin.eu/cmdi/cues/1",
    "xmlns:cmdp": "http://www.clarin.eu/cmd/1/profiles/clarin.eu:cr1:p_1524652309874",
    "xmlns:dcr": "http://www.isocat.org/ns/dcr",
    "xmlns:vc": "http://www.w3.org/2007/XMLSchema-versioning",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation": "http://www.clarin.eu/cmd/1 file:/Users/zinn/Projects/SFB833/code/jack/profiles/TextCorpusProfile-CMDI1.2.xsd",
    "CMDVersion": 1.2,
    "cmd:Header": {
        "cmd:MdCreator": "MdCreator0",
        "cmd:MdCreationDate": "2006-05-04",
        "cmd:MdSelfLink": "http://www.oxygenxml.com/",
        "cmd:MdProfile": "http://www.oxygenxml.com/",
        "cmd:MdCollectionDisplayName": "MdCollectionDisplayName0"
    },
    "cmd:Resources": {
        "cmdp:ResourceProxyList": resourceProxyList,
        "cmd:JournalFileProxyList": {"cmd:JournalFileProxy": {"cmd:JournalFileRef": "http://www.oxygenxml.com/"}},
        "cmd:ResourceRelationList": {"cmd:ResourceRelation": {
            "cmd:RelationType": {
                "ConceptLink": "http://www.oxygenxml.com/",
                "content": "RelationType0"
            },
            "cmd:Resource": [
                {
                    "ref": "ID000",
                    "cmd:Role": {
                        "ConceptLink": "http://www.oxygenxml.com/",
                        "content": "Role0"
                    }
                },
                {
                    "ref": "ID000",
                    "cmd:Role": {
                        "ConceptLink": "http://www.oxygenxml.com/",
                        "content": "Role1"
                    }
                }
            ]
        }}
    },
    "cmd:IsPartOfList": {"cmd:IsPartOf": "http://www.oxygenxml.com/"},
    "cmd:Components": {"cmdp:TextCorpusProfile": {
        "xml:base": "http://www.oxygenxml.com/",
        "cmd:ref": "ID000",
        "cmdp:GeneralInfo": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1444726211569",
            "cmdp:ResourceName": {
                "xml:lang": "en-US",
                "content": name         // <============
            },
            "cmdp:ResourceTitle": {
                "xml:lang": "en-US",
                "content": name         // <============
            },
            "cmdp:ResourceClass": profile,      // <============
            "cmdp:Version": {
                "xml:lang": "en-US",
                "content": "Version0"
            },
            "cmdp:LifeCycleStatus": "planned",
            "cmdp:StartYear": 2006,
            "cmdp:CompletionYear": 2006,
            "cmdp:PublicationDate": "PublicationDate0",
            "cmdp:LastUpdate": "LastUpdate0",
            "cmdp:TimeCoverage": {
                "xml:lang": "en-US",
                "content": "TimeCoverage0"
            },
            "cmdp:LegalOwner": {
                "xml:lang": "en-US",
                "content": "LegalOwner0"
            },
            "cmdp:Genre": {
                "xml:lang": "en-US",
                "content": "Genre0"
            },
            "cmdp:FieldOfResearch": "FieldOfResearch0",
            "cmdp:Location": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1444726211570",
                "cmdp:Address": {
                    "xml:lang": "en-US",
                    "content": "Address0"
                },
                "cmdp:Region": {
                    "xml:lang": "en-US",
                    "content": "Region0"
                },
                "cmdp:Country": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694493",
                    "cmdp:CountryName": {
                        "xml:lang": "en-US",
                        "content": "CountryName0"
                    },
                    "cmdp:CountryCoding": "AD"
                },
                "cmdp:AuthoritativeIDs": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1444726211568",
                    "cmdp:AuthoritativeID": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmdp:id": "http://www.oxygenxml.com/",
                        "cmdp:issuingAuthority": "VIAF"
                    }
                }
            },
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": "someDescription" // <============ todo
                }
            },
            "cmdp:tags": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1342181139653",
                "cmdp:tag": {
                    "xml:lang": "en-US",
                    "content": "tag0"
                }
            },
            "cmdp:ModalityInfo": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1450777779938",
                "cmdp:Modalities": "spoken",
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description1"
                    }
                }
            }
        },
        "cmdp:Project": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1527668176007",
            "cmdp:ProjectName": {
                "xml:lang": "en-US",
                "content": project.name // <============
            },
            "cmdp:ProjectTitle": {
                "xml:lang": "en-US",
                "content": project.name // <============
            },
            "cmdp:ProjectID": "ProjectID0",
            "cmdp:Url": {
                "targetLang": "targetLang0",
                "content": "http://www.oxygenxml.com/"
            },
            "cmdp:Funder": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1442920133047",
                "cmdp:fundingAgency": project.context, // <============
                "cmdp:fundingReferenceNumber": "fundingReferenceNumber0",
                "cmdp:AuthoritativeIDs": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1444726211568",
                    "cmdp:AuthoritativeID": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmdp:id": "http://www.oxygenxml.com/",
                        "cmdp:issuingAuthority": "VIAF"
                    }
                }
            },
            "cmdp:Institution": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1527668176006",
                "cmdp:Department": {
                    "xml:lang": "en-US",
                    "content": "Department0"
                },
                "cmdp:Url": "Url0",
                "cmdp:Organisation": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000"
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description2"
                    }
                }
            },
            "cmdp:Cooperations": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1524652309891",
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description3"
                    }
                },
                "cmdp:Cooperation": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1524652309884",
                    "cmdp:CooperationPartner": {
                        "xml:lang": "en-US",
                        "content": "CooperationPartner0"
                    },
                    "cmdp:Organisation": {
                        "xml:lang": "en-US",
                        "content": "Organisation0"
                    }
                }
            },
            "cmdp:Person": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1447674760335",
                "cmdp:firstName": researcher.firstName,  // <============
                "cmdp:lastName":  researcher.lastName,   // <============
                "cmdp:role": researcher.status,
                "cmdp:AuthoritativeIDs": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1444726211568",
                    "cmdp:AuthoritativeID": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmdp:id": "http://www.oxygenxml.com/",
                        "cmdp:issuingAuthority": "VIAF"
                    }
                }
            },
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": project.description // <============
                }
            },
            "cmdp:Duration": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1271859438116",
                "cmdp:StartYear": project.status, // <============
                "cmdp:CompletionYear": "CompletionYear0"
            }
        },
        "cmdp:Publications": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1444726211574",
            "cmdp:Publication": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1444726211572",
                "cmdp:PublicationTitle": {
                    "xml:lang": "en-US",
                    "content": "PublicationTitle0"
                },
                "cmdp:resolvablePID": "resolvablePID0",
                "cmdp:Author": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1444726211573"
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description5"
                    }
                }
            },
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": "Description6"
                }
            }
        },
        "cmdp:Creation": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1444726211575",
            "cmdp:Topic": {
                "xml:lang": "en-US",
                "content": "Topic0"
            },
            "cmdp:Creators": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1442920133044",
                "cmdp:Person": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1447674760335",
                    "cmdp:firstName": "firstName1",
                    "cmdp:lastName": "lastName1",
                    "cmdp:role": "role1"
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmdp:Description": "Description7"
                }
            },
            "cmdp:CreationToolInfo": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694497",
                "cmdp:CreationTool": {
                    "xml:lang": "en-US",
                    "content": "CreationTool0"
                },
                "cmdp:ToolType": {
                    "xml:lang": "en-US",
                    "content": "ToolType0"
                },
                "cmdp:Version": {
                    "xml:lang": "en-US",
                    "content": "Version1"
                },
                "cmdp:Url": "http://www.oxygenxml.com/",
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description8"
                    }
                }
            },
            "cmdp:Annotation": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1459844210459",
                "cmdp:AnnotationMode": {
                    "xml:lang": "en-US",
                    "content": "AnnotationMode0"
                },
                "cmdp:AnnotationStandoff": {
                    "xml:lang": "en-US",
                    "content": "AnnotationStandoff0"
                },
                "cmdp:InterannotatorAgreement": {
                    "xml:lang": "en-US",
                    "content": "InterannotatorAgreement0"
                },
                "cmdp:AnnotationFormat": {
                    "xml:lang": "en-US",
                    "content": "AnnotationFormat0"
                },
                "cmdp:SegmentationUnits": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1459844210458",
                    "cmdp:SegmentationUnit": "grapheme"
                },
                "cmdp:AnnotationTypes": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694568",
                    "cmdp:AnnotationType": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmd:ComponentId": "clarin.eu:cr1:c_1290431694567",
                        "cmdp:AnnotationLevelType": {
                            "xml:lang": "en-US",
                            "content": "AnnotationLevelType0"
                        }
                    }
                },
                "cmdp:AnnotationToolInfo": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694534"
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description9"
                    }
                }
            },
            "cmdp:Source": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1521028545541",
                "cmdp:OriginalSource": {
                    "xml:lang": "en-US",
                    "content": "OriginalSource0"
                },
                "cmdp:SourceType": {
                    "xml:lang": "en-US",
                    "content": "SourceType0"
                },
                "cmdp:MediaFiles": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1521028545542",
                    "id": "id0",
                    "cmdp:MediaFile": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmd:ComponentId": "clarin.eu:cr1:c_1521028545543",
                        "cmdp:CatalogueLink": {
                            "xml:lang": "en-US",
                            "content": "CatalogueLink0"
                        },
                        "cmdp:Type": "Unknown",
                        "cmdp:Quality": 1,
                        "cmdp:RecordingConditions": {
                            "xml:lang": "en-US",
                            "content": "RecordingConditions0"
                        },
                        "cmdp:Position": {
                            "xml:base": "http://www.oxygenxml.com/",
                            "cmd:ref": "ID000",
                            "cmd:ComponentId": "clarin.eu:cr1:c_1302702320463",
                            "cmdp:PositionType": {
                                "xml:lang": "en-US",
                                "content": "PositionType0"
                            },
                            "cmdp:StartPosition": "StartPosition0",
                            "cmdp:EndPosition": "EndPosition0"
                        },
                        "cmdp:Access": {
                            "xml:base": "http://www.oxygenxml.com/",
                            "cmd:ref": "ID000",
                            "cmd:ComponentId": "clarin.eu:cr1:c_1444726211578",
                            "cmdp:Contact": {
                                "xml:base": "http://www.oxygenxml.com/",
                                "cmd:ref": "ID000",
                                "cmd:ComponentId": "clarin.eu:cr1:c_1442920133041",
                                "cmdp:email": "email0",
                                "cmdp:role": "role2",
                                "cmdp:Address": {
                                    "xml:base": "http://www.oxygenxml.com/",
                                    "cmd:ref": "ID000",
                                    "cmdp:street": "street0",
                                    "cmdp:ZIPCode": "ZIPCode0",
                                    "cmdp:city": "city0"
                                }
                            }
                        }
                    }
                },
                "cmdp:Derivation": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694503"
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description10"
                    }
                }
            },
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": "Description11"
                }
            }
        },
        "cmdp:Documentations": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1454489235463",
            "cmdp:Documentation": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1342181139641",
                "cmdp:DocumentationType": {
                    "xml:lang": "en-US",
                    "content": "DocumentationType0"
                },
                "cmdp:FileName": {
                    "xml:lang": "en-US",
                    "content": "FileName0"
                },
                "cmdp:Url": "Url1",
                "cmdp:DocumentationLanguages": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694561",
                    "cmdp:DocumentationLanguage": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmd:ComponentId": "clarin.eu:cr1:c_1290431694560",
                        "cmdp:Language": {
                            "xml:base": "http://www.oxygenxml.com/",
                            "cmd:ref": "ID000",
                            "cmd:ComponentId": "clarin.eu:cr1:c_1271859438111",
                            "cmdp:LanguageName": {
                                "xml:lang": "en-US",
                                "content": "LanguageName0"
                            },
                            "cmdp:ISO639": {
                                "xml:base": "http://www.oxygenxml.com/",
                                "cmd:ref": "ID000",
                                "cmd:ComponentId": "clarin.eu:cr1:c_1271859438110",
                                "cmdp:iso-639-3-code": {
                                    "cmd:ValueConceptLink": "http://www.oxygenxml.com/",
                                    "content": "aaa"
                                }
                            }
                        }
                    }
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description12"
                    }
                }
            },
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": "Description13"
                }
            }
        },
        "cmdp:TextCorpusContext": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1450777779936",
            "cmdp:CorpusType": "comparable corpus",
            "cmdp:TemporalClassification": "diachronic",
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": "Description14"
                }
            },
            "cmdp:ValidationGrp": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1450777779937",
                "cmdp:Validation": false,
                "cmdp:ValidationType": {
                    "xml:lang": "en-US",
                    "content": "ValidationType0"
                },
                "cmdp:ValidationMode": {
                    "xml:lang": "en-US",
                    "content": "ValidationMode0"
                },
                "cmdp:ValidationLevel": {
                    "xml:lang": "en-US",
                    "content": "ValidationLevel0"
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description15"
                    }
                }
            },
            "cmdp:SubjectLanguages": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1450777779941",
                "cmdp:NumberOfLanguages": 0,
                "cmdp:SubjectLanguage": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1357720977479",
                    "cmdp:Language": {
                        "xml:base": "http://www.oxygenxml.com/",
                        "cmd:ref": "ID000",
                        "cmd:ComponentId": "clarin.eu:cr1:c_1271859438111",
                        "cmdp:LanguageName": {
                            "xml:lang": "en-US",
                            "content": "LanguageName1"
                        },
                        "cmdp:ISO639": {
                            "xml:base": "http://www.oxygenxml.com/",
                            "cmd:ref": "ID000",
                            "cmd:ComponentId": "clarin.eu:cr1:c_1271859438110",
                            "cmdp:iso-639-3-code": {
                                "cmd:ValueConceptLink": "http://www.oxygenxml.com/",
                                "content": "aaa"
                            }
                        }
                    }
                },
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description16"
                    }
                }
            },
            "cmdp:TypeSpecificSizeInfo": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1466690369343",
                "cmdp:TypeSpecificSize": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1466690369344"
                }
            }
        },
        "cmdp:Access": {
            "xml:base": "http://www.oxygenxml.com/",
            "cmd:ref": "ID000",
            "cmd:ComponentId": "clarin.eu:cr1:c_1444726211578",
            "cmdp:Availability": {
                "xml:lang": "en-US",
                "content": "Availability0"
            },
            "cmdp:DistributionMedium": {
                "xml:lang": "en-US",
                "content": "DistributionMedium0"
            },
            "cmdp:CatalogueLink": "http://www.oxygenxml.com/",
            "cmdp:Price": {
                "xml:lang": "en-US",
                "content": "Price0"
            },
            "cmdp:Licence": {
                "src": "http://www.oxygenxml.com/",
                "xml:lang": "en-US",
                "content": licence  // <============
            },
            "cmdp:Contact": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1442920133041",
                "cmdp:firstname": researcher.firstname,    // <============
                "cmdp:lastname":  researcher.lastname,     // <============
                "cmdp:email": researcher.email,            // <============
                "cmdp:telephoneNumber": researcher.phone,  // <============
                "cmdp:role": researcher.status,            // <============
                "cmdp:Address": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmdp:street": "street1",
                    "cmdp:ZIPCode": "ZIPCode1",
                    "cmdp:city": "city1"
                }
            },
            "cmdp:DeploymentToolInfo": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694500",
                "cmdp:DeploymentTool": {
                    "xml:lang": "en-US",
                    "content": "DeploymentTool0"
                },
                "cmdp:ToolType": {
                    "xml:lang": "en-US",
                    "content": "ToolType1"
                },
                "cmdp:Version": {
                    "xml:lang": "en-US",
                    "content": "Version2"
                },
                "cmdp:Url": "http://www.oxygenxml.com/",
                "cmdp:Descriptions": {
                    "xml:base": "http://www.oxygenxml.com/",
                    "cmd:ref": "ID000",
                    "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                    "cmdp:Description": {
                        "type": "short",
                        "xml:lang": "en-US",
                        "content": "Description17"
                    }
                }
            },
            "cmdp:Descriptions": {
                "xml:base": "http://www.oxygenxml.com/",
                "cmd:ref": "ID000",
                "cmd:ComponentId": "clarin.eu:cr1:c_1290431694486",
                "cmdp:Description": {
                    "type": "short",
                    "xml:lang": "en-US",
                    "content": "Description18"
                }
            }
        },
        "cmdp:ResourceProxyListInfo": resourceProxyListInfo
    }}
}}) })
}