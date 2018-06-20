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
import ProfileSelection from './ProfileSelection.jsx';
import {getFlatDataFromTree} from 'react-sortable-tree';

import CmdiHandler from '../back-end/CmdiHandler';
import FileTreeHandler from '../back-end/FileTreeHandler';

export default class App extends React.Component {

    constructor(props) {
	super(props);

	this.onDrop        = this.onDrop.bind(this);	
	this.clearDropzone = this.clearDropzone.bind(this);
	this.loadSIP       = this.loadSIP.bind(this);
	this.saveSIP       = this.saveSIP.bind(this);
	this.submitSIP     = this.submitSIP.bind(this);	
	this.inspectCMDI   = this.inspectCMDI.bind(this);
	
	this.updateProject    = this.updateProject.bind(this);
	this.updateResearcher = this.updateResearcher.bind(this);	
	this.updateProfile    = this.updateProfile.bind(this);
	this.updateLicense    = this.updateLicense.bind(this);
	this.dropzoneRef      = undefined;	

	this.state = {
	    researcher: {
		firstName : "Max",
		lastName: "Mustermann",
		email: "max.mustermann@uni-tuebingen.de",
		phone: "+49 (0) 7071-29 73968",
		status: "researcher"
	    },
	    
	    project: {
		projectName : "Second Language Acquisition in Parrots",
		projectStatus: "ongoing",
		projectContext: "sfb833",
		projectDescription: "The project investigates whether parrots from Taka-Tuka island have second language acquisition skills better than their peers from Madagasgar."
	    },
	    
	    profile: "textCorpus",

	    license: "clarin_pub_by",

	    treeData: [{ title: 'SIP', isDirectory: false, isRoot: true}],

	    // start with first tab (project info)
	    selectedIndex: 0,

	    // to control activation of navigation buttons
	    sipClearedP: true,
	    sipLoadedP: false,
	    sipSavedP: false,
	    sipSubmitted: false,
	    sipGeneratedP: false,
	    cmdiGeneratedP: false
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
    
    clearDropzone() {
	console.log('clearSIP');
	localStorage.removeItem("app");
    }

    loadSIP() {
	console.log('loadSIP');
	this.dropzoneRef.open( )
    }

    saveSIP() {
	console.log('saveSIP');

	const getNodeKey = ({ treeIndex }) => treeIndex;		
	var flat = getFlatDataFromTree(	{ treeData: this.state.treeData,
	                                  getNodeKey: getNodeKey
					});

	this.setState({ sipSavedP: true });

	// This probably where you would have an `ajax` call
	setTimeout(() => {
	    // Completed of async action, set loading state back
	    this.setState({ sipSavedP: false });
	}, 2000);
	

	new FileTreeHandler( flat );
    }

    submitSIP() {
	console.log('submitSIP');
	new CmdiHandler( "zinn123" );
    }
    
    inspectCMDI() {
	console.log('inspectCMDI');		
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
		this.clearDropzone();		
	    } else {
		console.info( "This page is not reloaded", p.navigation.type);
	    }
	}
    }


    getInitialState() {
	return {selectedValue: 'Textcorpus'};
    }

  render() {
      const { sipClearedP, sipLoadedP, sipSavedP, sipSubmittedP, sipGeneratedP, cmdiSubmittedP, cmdiGeneratedP } = this.state;
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
	  <Button onClick={sipClearedP ? this.clearDropzone : null} bsStyle="primary" disabled={sipClearedP}>Clear SIP</Button>
   	  <Button onClick={!sipLoadedP  ? this.loadSIP       : null} bsStyle="primary" disabled={sipGeneratedP}>Load SIP
	        <Dropzone ref={(node) => { this.dropzoneRef = node; }}
         	    onDrop={this.onDrop}
		    accept="application/zip"
		    multiple={false}
	            style={style1}
	            activeStyle={activeStyle} >	    
		</Dropzone>
	  </Button>
	  <Button onClick={sipGeneratedP  ? this.saveSIP     : null} bsStyle="primary" disabled={sipGeneratedP}>Save SIP</Button>
   	  <Button onClick={cmdiGeneratedP ? this.inspectCMDI : null} bsStyle="primary" disabled={cmdiGeneratedP}>Inspect CMDI</Button>
  	  <Button onClick={cmdiSubmittedP ? this.submitSIP   : null} bsStyle="primary" disabled={sipGeneratedP}>Submit SIP</Button>
	  </ButtonToolbar>
	</div>			
      </div>			
    </div>
  </header>

  <div className="container">
    <Tabs
      selectedIndex={this.state.selectedIndex}
      onSelect={ (selectedIndex) => {console.log('selectedIndex', selectedIndex); this.setState({ selectedIndex })}}
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
	
	<DropArea clearDropzoneFun={this.clearDropzone} parent={this} fileTree={this.state.treeData} />
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
