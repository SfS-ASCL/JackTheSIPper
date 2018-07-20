// -- C. Zinn, claus.zinn@uni-tuebingen.de
// -- SFB, Jack
// -- Spring 2018

'use strict';

import Dropzone from 'react-dropzone';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, ButtonToolbar } from 'react-bootstrap';

import CMDIHandler from '../back-end/CMDIHandler';
import { sleep, readCMDI } from '../back-end/util';
import JSZip from 'jszip';
import AboutHelp from './AboutHelp.jsx';
import UserHelp from './UserHelp.jsx';

import SortableTree, {addNodeUnderParent} from 'react-sortable-tree';
import BagIt from '../my-bag-it/index.js';
var Readable = require('stream').Readable

import '../css/react-tabs.css';
import '../css/react-select.css';
import '../css/react-form-styles.css';

import '../css/main.css';
import '../css/ionicons.min.css';

import '../css/vlo.css';
import '../css/font-awesome.min.css';


import DropArea from './DropArea.jsx';
import Project from './Project.jsx';
import Researcher from './Researcher.jsx';
import Licence from './Licence.jsx';
import CMDIViewer from './CMDIViewer.jsx';
import ProfileSelection from './ProfileSelection.jsx';
import {getFlatDataFromTree} from 'react-sortable-tree';

import BagSaver from '../back-end/BagSaver';
import BagLoaderViewer from './BagLoaderViewer';

export default class App extends React.Component {

    constructor(props) {
	super(props);

	this.onDrop        = this.onDrop.bind(this);
	this.onDropHelper  = this.onDropHelper.bind(this);
	
	this.clearSIP      = this.clearSIP.bind(this);
	this.loadSIP       = this.loadSIP.bind(this);
	this.saveSIP       = this.saveSIP.bind(this);
	this.submitSIP     = this.submitSIP.bind(this);
	
	this.showCMDIViewer   = this.showCMDIViewer.bind(this);
	this.unshowCMDIViewer = this.unshowCMDIViewer.bind(this);
	this.showBagLoaderViewer   = this.showBagLoaderViewer.bind(this);
	this.unshowBagLoaderViewer = this.unshowBagLoaderViewer.bind(this);
	
	this.updateProject    = this.updateProject.bind(this);
	this.updateResearcher = this.updateResearcher.bind(this);	
	this.updateProfile    = this.updateProfile.bind(this);
	this.updateLicence    = this.updateLicence.bind(this);

	this.setStateForZip = this.setStateForZip.bind(this);	
	
	this.dropzoneRef      = undefined;	

	this.state = {

	    showCMDIViewer: false,
	    showBagLoaderViewer: false,	    
	    researcher: {
		firstName : "Max",
		lastName: "Mustermann",
		email: "max.mustermann@uni-tuebingen.de",
		phone: "+49 (0) 7071-29 73968",
		status: "researcher"
	    },
	    
	    project: {
		name : "Second Language Acquisition in Parrots",
		status: "ongoing",
		context: "sfb833",
		description: "The project investigates whether parrots from Taka-Tuka island have second language acquisition skills better than their peers from Madagasgar."
	    },
	    
	    profile: "textCorpus",

	    licence: "clarin_pub_by",

	    treeData: [{ title: 'SIP', isDirectory: false, isRoot: true}],

	    researchData: undefined,   // holds tree structure from packing
	    metadata: undefined,       // holds entire metadata (CMDIHandler)

	    // start with first tab (project info)
	    selectedIndex: 0,

	    // to control activation of navigation buttons
	    sipClearedP: true,
	    sipLoadedP: false,
	    sipSavedP: false,
	    sipSubmitted: false,
	    sipGeneratedP: true,

	    // the bag, once it has been generated by the BagSaver/BagLoader
	    zip: undefined
	};

	this.cmdiHandler = new CMDIHandler( this.state.project,
					    this.state.researcher,
					    this.state.profile,
					    this.state.licence);
	
	this.state.metadata = this.cmdiHandler.finaliseCMDI_JSON( [] );
    }

    // see DropArea for construction when files are dragged&dropped during packaging
    // -- need to consult CMDI file with information about files in ResourceProxyInfo(List)s
    onDropHelper( resourceProxyList, resourceProxyListInfo ) {
	const getNodeKey = ({ treeIndex }) => treeIndex;
	var parentKey = this.state.parentKey;

	console.log('App/onDropHelper', resourceProxyList, resourceProxyListInfo, resourceProxyList.length, resourceProxyListInfo.length );
	
	if (! (resourceProxyList.length == resourceProxyListInfo.length) ) {
	    alert("Conflict in ResourceProxy information");
	} else {
	    for (var i=0; i<resourceProxyList.length; i++) {
		console.log('App/onDropHelper',
			    resourceProxyList[i]["cmd:ResourceProxy"]["cmd:ResourceRef"]["_text"], '::',
			    resourceProxyList[i]["cmd:ResourceProxy"]["cmd:ResourceType"]["mimetype"]["_text"],'::',
			    
			    resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:FileSize"]["_text"],'::',
			    resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:ResProxFileName"]["_text"],'::',
			    resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:ResProxItemName"]["_text"] );

		let fileSize = resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:FileSize"]["_text"];
		let fileName = resourceProxyListInfo[i]["cmdp:ResourceProxyInfo"]["cmdp:ResProxFileName"]["_text"];
		let fileType = resourceProxyList[i]["cmd:ResourceProxy"]["cmd:ResourceType"]["mimetype"]["_text"]

		fileName = fileName.replace('data/', ''); // todo: see BagSaver.jsx
    		this.setState( (state) => {
		    return {treeData : addNodeUnderParent({ treeData: state.treeData,
							    parentKey: parentKey,
							    expandParent: true,
							    getNodeKey,
							    newNode: {
								file: "readFromSIP", // needs to be fetched from bag
								title: fileName,
								isDirectory: false, 
								size: fileSize,
								type: fileType,
								date: "no one cares"
							    },
							  }).treeData
			   };
		})
	    }}
    }

    // for each file in the zip, add it to the bag
    bagItHelper(zip, bag, [ head, ...tail ]) {

	if (head === undefined && !tail.length) {
	    return [];
	}

	// by default, adding a file to a bag, puts them at /bag/data,
	// so we have to remove that part from the file's bzip location.
	var that = this;
	if (tail.length) {
	    zip.file(head).async("string")
		.then(function(data) {
		    var s = new Readable;
		    s.push(data);
		    s.push(null);	    
		    s.pipe(bag.createWriteStream(head.replace('/bag/data',''), {}, function() {
			that.bagItHelper(zip, bag, tail);
		}))
		})
	} else {
	    zip.file(head).async("string")
		.then(function(data) {
		    var s = new Readable;
		    s.push(data);
		    s.push(null);	    	    
		    s.pipe(bag.createWriteStream(
			head.replace('/bag/data',''),
			{},
			function() {
			    bag.finalize( function () {
				console.log('App/bagItHelper: bag has been finalized', bag);

				// check bag for manifest file (should be identical to the one in the zip file)
				bag.readFileNoCheck( bag.manifest, 'utf-8', function(err, data) {
				    if (err) return console.log('Error reading manifest', err, bag)
				    console.log('+++ reading manifest file', data);
				});
				
				bag.readFileNoCheck('/bag/data/cmdi.xml', 'utf-8', function(err, data) {
				    if (err) return console.log('Error reading cmdi.xml', err, bag)
				    console.log('+++ reading cmdi.xml file', data);
				});
			    });				
			}))})
	}
    }

    
    onDrop(acceptedFiles, rejectedFiles) {
	const dateBefore = new Date();
	const bagFile = acceptedFiles[0];
	const that = this;

	var Buffer = BrowserFS.BFSRequire('buffer').Buffer;
	BrowserFS.configure({
	    fs: "LocalStorage",
	    options: {}
	}, function(e) {
	    if (e) {
		throw e;
	    } else {

		// first, reset the filetree
    		that.setState( (state) => (
		    {
			treeData: [{ title: 'SIP', isDirectory: false, isRoot: true}]
		    },
		    function() {console.log('Have initialised filetree')}));
		
		// re-create the bag
    		var bag = BagIt('/bag', 'sha256', {'Contact-Name': 'Claus Zinn'});	
		JSZip.loadAsync(bagFile)                                  
		    .then(function(zip) {
			const dateAfter = new Date();		
			console.log("(loaded in " + (dateAfter - dateBefore) + "ms)");

			
			// here, we need to fill state.treedata using addNodeUnderParent({})

			// timing issues, need recursion with call backs
			let entries = []
			zip.forEach(function (relativePath, zipEntry) { 
			    console.log('zip entry', zipEntry.name);
			    if (zipEntry.name.includes("/data/")) {
				console.log('processing research data', zipEntry.name);
				// hack
				if (zipEntry.name == '/bag/data/') {
				    console.log('fetched directory, noop', zip.file(zipEntry.name))
				} else {
				    entries.push(zipEntry.name);
				}}
			});

			that.bagItHelper(zip, bag, entries);
			
			// may want to read CMDI file from bag (rather than zip)
			let cmdiFilePromise = zip.file("/bag/data/cmdi.xml").async("string") // arraybuffer
			cmdiFilePromise.then(
			    function(cmdiData) {
				let result = readCMDI(cmdiData);
				console.log('App/onDrop', result, that);
				that.onDropHelper( result.resourceProxyList, result.resourceProxyListInfo ); // populate the file tree
				
				console.log('App/onDrop should have called onDropHelper');			
				that.setState( state => ({ profile:    result.profile,
							   researcher: result.researcher,
							   project:    result.project,
							   licence:    result.licence,
							   zip: bagFile.name,
							   showBagLoaderViewer: true}));

				that.forceUpdate();
			    },
			    function(error) {
				console.log('App/onDrop: error case', error);
			    });
		    })
	    }})
    };
	
    setStateForZip(zip) {
	this.setState( state => ({ zip: zip }));
    }
    
    /* todo: this should clear the entire SIP information, including personal, project and licence data */
    clearSIP() {
	this.setState( state => ({ sipClearedP: true }));
	this.setState( state => ({ treeData: [{ title: 'SIP', isDirectory: false, isRoot: true}]})); 
	console.log('App/clearSIP');
    }

    loadSIP() {
	console.log('loadSIP');
	this.dropzoneRef.open( )
    }

    saveSIP() {
	const getNodeKey = ({ treeIndex }) => treeIndex;		
	var flattenedFileTree = getFlatDataFromTree(
	    { treeData: this.state.treeData,
	      getNodeKey: getNodeKey
	    });

	if ( (flattenedFileTree === undefined) || (flattenedFileTree.length == 1) ) {
	    alert("Please add at least a single file to the research data package!")
	} else {
	    this.setState( state => ({
		researchData: flattenedFileTree
	    }), () => { 
		// create the bag; pass down entire state
		const bagSaver = new BagSaver( this.state ); 
		bagSaver.createBag();
	    })
	}
    }

    submitSIP() {
	console.log('submitSIP', this.state);
    }
    
    showCMDIViewer() {
	this.setState( state => ({
	    showCMDIViewer: true
	}));
    }

    unshowCMDIViewer() {
	this.setState( state => ({
	    showCMDIViewer: false
	}))
    }

    showBagLoaderViewer( bagName ) {
	this.setState( state => ({
	    showBagLoaderViewer: true,
	    zip: bagName
	}));
    }

    unshowBagLoaderViewer() {
	this.setState( state => ({
	    showBagLoaderViewer: false
	}))
    }
    
    updateProject = (project) => {
	console.log('App/updateProject', project);
	this.setState( project );
    }

    updateResearcher = (researcher) => {
	console.log('App/updateResearcher', researcher);
	this.setState( researcher );
    }

    updateProfile(value) {
	console.log('Metadata Profile has been changed to', value);
	this.setState(state => ({
	    profile: value
	}));
    }

    updateLicence = (licence) => {
	console.log('Metadata Licence has been changed to ', licence.value);
	this.setState( state => ({
	    licence : licence.value
	}));
    }

    // N.B. DropArea is given a link to its parent to manipulate state.
    
    componentDidMount() {
	localStorage.removeItem("app");

	// clear all 
	localStorage.clear();

	const p = window.performance;
	if (p) {
	    if (p.navigation.type == 1) {
		console.info( "This page is reloaded, clearing DropZone", p.navigation.type);
	    } else {
		console.info( "This page is not reloaded", p.navigation.type);
	    }
	}
    }


    getInitialState() {
	return {selectedValue: 'Textcorpus'};
    }

  render() {
      const { sipClearedP, sipLoadedP, sipSavedP, sipSubmittedP, sipGeneratedP } = this.state;
      var style1 = {
	    display: 'none',
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 10,
            padding: 10,
            width: 20, // do not display, that is, shrink ten-fold
	    height:10,
	    resize: 'none',
	    transition: 'all 0.5s',
//	    display:'inline-block'
        };

        var activeStyle = {
	    display: 'none',
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 0 // 8
        };

      let project=this.state.project;
      let researcher=this.state.researcher;
      
      console.log('App/render', this.state, project, researcher);
      
      return (


<div>
  <header id="header" role="banner">
    <div className="navbar-static-top  navbar-default navbar" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <a className="navbar-brand" href="./" id="idce">
	    <span><i className="fa fa-sitemap fa-1x fa-fw" aria-hidden="true"></i> Jack the SIPper</span>
          </a>
	</div>
	<div style={{margin: 10}}>
	  <ButtonToolbar >
	  <Button onClick={!sipClearedP ? this.clearSIP : null} bsStyle="primary" disabled={sipClearedP}>Clear SIP</Button>
   	  <Button onClick={this.loadSIP} bsStyle="primary">Load SIP
	        <Dropzone ref={(node) => { this.dropzoneRef = node; }}
         	    onDrop={this.onDrop}
		    accept="application/zip"
		    multiple={false}
	            style={style1}
	            activeStyle={activeStyle} >	    
		</Dropzone>
	  </Button>
	  <Button onClick={this.saveSIP} bsStyle="primary">Save SIP</Button>
  	  <Button onClick={!sipSubmittedP ? this.submitSIP   : null} bsStyle="primary" disabled={!sipGeneratedP}>Submit SIP</Button>
    	      <Button onClick={this.showCMDIViewer} bsStyle="primary">Inspect CMDI</Button>
	      </ButtonToolbar>
	      <AboutHelp className="header-link" />
	      <UserHelp className="header-link" />	      	      
	      </div>			
      </div>			
    </div>
  </header>

  <div className="container">
    {this.state.showCMDIViewer ?
     <CMDIViewer cmdiContent={this.state.metadata} cmdiContentJSON={this.state.metadata} unmount={this.unshowCMDIViewer} />
     : null }
    {this.state.showBagLoaderViewer ?
     <BagLoaderViewer bagName={this.state.zip} unmount={this.unshowBagLoaderViewer} />
    : null }	  
    <Tabs
      selectedIndex={this.state.selectedIndex}
      onSelect={ (selectedIndex) => {this.setState({ selectedIndex })}}
    >
      <TabList>
	<Tab>Project</Tab>
	<Tab>Researcher</Tab>
	<Tab>Profile</Tab>
	<Tab>Licence</Tab>
	<Tab>Packaging</Tab>
      </TabList>
      
      <TabPanel>
	<h2>Project information</h2>
	<div style={{height: 600}} >	    	    	    
	  <Project project={project} updateProject={this.updateProject}/>
	</div>
      </TabPanel>
      <TabPanel>
        <h2>Contact Details</h2>
	<div style={{height: 600}} >	    	    
	  <Researcher researcher={researcher} updateResearcher={this.updateResearcher}/>
        </div>
      </TabPanel>
      <TabPanel>
	    <h2>Profile Selection</h2>
	<div style={{height: 600}} >	    
	    <ProfileSelection style={{ float: "left" }}
	        updateProfile={this.updateProfile}
    	        selectedProfile={this.state.profile} />
	</div>
      </TabPanel>
      <TabPanel>
	<h2>Licence Selection</h2>
	<p>
	Please select the preferred licence for your research data. It
	will be applied to all parts of your research data, but exceptions can be marked when you
	package your research data into a Submission Information Package (last step).
	</p>

	<div style={{height: 600}} >
            <Licence licence={this.state.licence} updateLicence={this.updateLicence} />
	</div>
      </TabPanel>
      <TabPanel>
	<h2>Packaging</h2>
	<p>
	  <small>
	  Please package your files by adding them to the root node marked SIP. You can
	  reorganize the tree by manipulating its nodes using drag & drop. Please name directories
	  accordingly. Note, you cannot add entire directories, but only set of files.
	  </small>
	</p>
	
	<DropArea parent={this} fileTree={this.state.treeData} />
      </TabPanel>	    
    </Tabs>
  </div>
  <footer id="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-6 col-sm-push-3 col-xs-12">
          <div className="text-center">
            <span className="footer-fineprint">
              Service provided by <a href="http://www.sfb833.uni-tuebingen.de">SFB-833</a>
            </span>
          </div>
        </div>
        <div className="col-sm-3 col-sm-pull-6 col-xs-12">
          <div className="version-info text-center-xs">
          </div>
        </div>
        <div className="col-sm-3 text-right">
		<a href='mailto:claus.zinn@uni-tuebingen.de?subject=Jack The SIPper'>Contact</a>
        </div>
      </div>
    </div>
  </footer>
</div>
);
}}
