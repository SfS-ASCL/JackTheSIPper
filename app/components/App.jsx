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
import License from './License.jsx';
import CMDIViewer from './CMDIViewer.jsx';
import ProfileSelection from './ProfileSelection.jsx';
import {getFlatDataFromTree} from 'react-sortable-tree';

import BagHandler from '../back-end/BagHandler';

export default class App extends React.Component {

    constructor(props) {
	super(props);

	this.onDrop        = this.onDrop.bind(this);	
	this.clearSIP      = this.clearSIP.bind(this);
	this.loadSIP       = this.loadSIP.bind(this);
	this.saveSIP       = this.saveSIP.bind(this);
	this.submitSIP     = this.submitSIP.bind(this);	
	this.showCMDIViewer   = this.showCMDIViewer.bind(this);
	this.unshowCMDIViewer = this.unshowCMDIViewer.bind(this);
	
	this.updateProject    = this.updateProject.bind(this);
	this.updateResearcher = this.updateResearcher.bind(this);	
	this.updateProfile    = this.updateProfile.bind(this);
	this.updateLicense    = this.updateLicense.bind(this);

	this.setStateForBag = this.setStateForBag.bind(this);
	this.setStateForZip = this.setStateForZip.bind(this);	
	
	this.dropzoneRef      = undefined;	

	this.state = {

	    showCMDIViewer: false,
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

	    license: "clarin_pub_by",

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

	    // the bag, once it has been generated by the BagHandler
	    bag: undefined,

	    // the zip, once it has been generated by the BagHandler
	    // will later be used to add the CMDI file.
	    zip: undefined
	};
    }

    onDrop(acceptedFiles, rejectedFiles) {
	for (var i=0; i<acceptedFiles.length; i++) {
	    console.log('onDrop (zip) acceptedFiles[i]', acceptedFiles[i]);
	    
	}
	for (var i=0; i<rejectedFiles.length; i++) {
	    console.log('onDrop (zip) rejectedFiles[i]', rejectedFiles[i]);
	}	
    }

    setStateForBag(bag) {
	this.setState( state => ({ bag: bag }));
    }

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
		// create the bag; pass down entire state, and state changing function
		const bagHandler = new BagHandler( this.state, this.setState);
		bagHandler.createBag();
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

    updateLicense = (license) => {
	console.log('App/updateLicense', license);
	this.setState( license );
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

      console.log('App/render', this.state);
      
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
	</div>			
      </div>			
    </div>
  </header>

  <div className="container">
    {this.state.showCMDIViewer ?
     <CMDIViewer cmdiContent={this.state.metadata} cmdiContentJSON={this.state.project} unmount={this.unshowCMDIViewer} />
    : null }
    <Tabs
      selectedIndex={this.state.selectedIndex}
      onSelect={ (selectedIndex) => {this.setState({ selectedIndex })}}
    >
      <TabList>
	<Tab>Project</Tab>
	<Tab>Researcher</Tab>
	<Tab>Profile</Tab>
	<Tab>License</Tab>
	<Tab>Packaging</Tab>
      </TabList>
      
      <TabPanel>
	<h2>Project information</h2>
	<div style={{height: 600}} >	    	    	    
	  <Project project={this.state.project} updateProject={this.updateProject}/>
	</div>
      </TabPanel>
      <TabPanel>
        <h2>Contact Details</h2>
	<div style={{height: 600}} >	    	    
	  <Researcher researcher={this.state.researcher} updateResearcher={this.updateResearcher}/>
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
	<h2>License Selection</h2>
	<p>
	Please select the preferred license for your research data. It
	will be applied to all parts of your research data, but exceptions can be marked when you
	package your research data into a Submission Information Package (last step).
	</p>

	<div style={{height: 600}} >
            <License license={this.state.license} updateLicense={this.updateLicense} />
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
