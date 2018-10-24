// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: App.jsx
// Time-stamp: <2018-10-24 13:02:24 (zinn)>
// -------------------------------------------

'use strict';

import Dropzone from 'react-dropzone';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { softwareVersion, sleep, readCMDI } from '../back-end/util';
import AboutHelp from './AboutHelp.jsx';
import UserHelp from './UserHelp.jsx';

var Readable = require('stream').Readable

import uuid from 'uuid';

import '../css/react-tabs.css';
import '../css/react-select.css';
import '../css/react-form-styles.css';

import '../css/main.css';
import '../css/ionicons.min.css';

import '../css/vlo.css';
import '../css/font-awesome.min.css';
import '../css/fancy-example.css';
import '../css/react-tabs2.css';

import DropArea from './DropArea.jsx';
import Project from './Project.jsx';
import Researchers from './Researchers.jsx';
import Licence from './Licence.jsx';
import CMDIViewer from './CMDIViewer.jsx';
import ProfileSelection from './ProfileSelection.jsx';

import BagSaver  from '../back-end/BagSaver';
import BagLoader from '../back-end/BagLoader';
import BagLoaderViewer from './BagLoaderViewer';

// uploading to NC
import Uploader from '../back-end/Uploader';

export default class App extends React.Component {

    constructor(props) {
	super(props);

	this.onDropBagFile        = this.onDropBagFile.bind(this);
	
	this.clearSIP      = this.clearSIP.bind(this);
	this.loadSIP       = this.loadSIP.bind(this);
	this.saveSIP       = this.saveSIP.bind(this);
	this.submitSIP     = this.submitSIP.bind(this);
	
	this.showBagLoaderViewer   = this.showBagLoaderViewer.bind(this);
	this.unshowBagLoaderViewer = this.unshowBagLoaderViewer.bind(this);
	
	this.updateProject    = this.updateProject.bind(this);
	this.updateResearcher = this.updateResearcher.bind(this);
	this.duplicateResearcher = this.duplicateResearcher.bind(this);
	this.removeResearcher = this.removeResearcher.bind(this);		
	this.updateProfile    = this.updateProfile.bind(this);
	this.updateLicence    = this.updateLicence.bind(this);
	this.updateZip        = this.updateZip.bind(this);	

	this.setStateForZip = this.setStateForZip.bind(this);	
	
	this.dropzoneReference      = undefined;	

	this.state = {

	    showBagLoaderViewer: false,	    
	    researchers: [ {
		id : uuid.v4(),
		firstName : "Max",
		lastName: "Mustermann",
		email: "max.mustermann@uni-tuebingen.de",
		phone: "+49 (0) 7071-29 73968",
		status: "researcher"
	    } ],
	    
	    project: {
		name : "Second Language Acquisition in Parrots",
		status: "ongoing",
		context: "sfb833",
		description: "The project investigates whether parrots from Taka-Tuka island have second language acquisition skills better than their peers from Madagasgar."
	    },
	    
	    profile: "textCorpus",

	    licence: "clarin_pub_by",

	    treeData: [{ name: 'SIP', isDirectory: false, isRoot: true}],
	    parentKey: undefined,

	    cmdi: undefined,      

	    // start with first tab (project info)
	    selectedIndex: 0,

	    // to control activation of navigation buttons
	    sipClearedP: true,
	    sipLoadedP: false,
	    sipSavedP: false,
	    sipSubmitted: false,
	    sipGeneratedP: false,

	    // the bag, once it has been generated by the BagSaver/BagLoader
	    zip: undefined
	};
    }
       
    onDropBagFile(acceptedFiles, rejectedFiles) {
	const that = this;
	const bagFile = acceptedFiles[0];
    	this.setState( (state) => 
		    {
			treeData: [{ name: 'SIP', isDirectory: false, isRoot: true}]
		    },
	    function() {
		const bagLoader = new BagLoader( that ); 
		bagLoader.loadBag( bagFile );
	    }
	)
    }
    
    /* todo: this should clear the entire SIP information, including personal, project and licence data */
    clearSIP() {
	this.setState( state => ({ sipClearedP: true }));
	this.setState( state => ({ treeData: [{ name: 'SIP', isDirectory: false, isRoot: true}]})); 
	console.log('App/clearSIP');
    }

    loadSIP() {
	console.log('loadSIP');
	this.dropzoneReference.open( )
    }

    saveSIP() {
	const bagSaver = new BagSaver( this.state, this.updateZip ); 
	bagSaver.saveBag();
	this.state.sipGeneratedP = true;
    }

    submitSIP() {
	console.log('submitSIP', this.state, blob, file);

	if (this.state.zip == undefined) {
	    alert("Your research data package is empty. Please define your SIP first.");
	    return
	}

	let blob = this.state.zip.zip;
	let file = new File([blob],
			    this.state.researchers[0].lastName + ".zip",
			    {
				lastModified: new Date(0),
				type: "application/zip"
			    });
	
	let uploader = new Uploader( file );
	let promiseUpload = uploader.uploadFile();
	promiseUpload.then(
	    function(resolve) {
		alert('The SIP has been submitted');
	    },
	    function(reject) {
		console.log('Jack The SIPper failed to upload your package.', reject);
	    });	
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

    duplicateResearcher = (id) => {
	console.log('App/duplicateResearcher', id);
	var researchers = this.state.researchers;
	var newResearchers = [];

	for (var i = 0; i < researchers.length; i++) {
	    if (id == researchers[i].id) {
		newResearchers.push(researchers[i]);		
		newResearchers.push( {
		    id : uuid.v4(),
		    firstName : researchers[i].firstName + "(copy)",
		    lastName:   researchers[i].lastName + "(copy)",
		    email:      researchers[i].email + "(copy)",
		    phone:      researchers[i].phone + "(copy)",
		    status: "researcher"
		} );
	    } else {
		newResearchers.push(researchers[i]);
	    }
	}
	this.setState( { researchers : newResearchers } );	
    }

    removeResearcher = (id) => {

	var researchers = this.state.researchers;
	console.log('App/removeResearcher', id, researchers);

	var newResearchers = [];

	for (var i = 0; i < researchers.length; i++) {
	    if (id == researchers[i].id) {
		console.log('App.jsx/removeResearcher', id);
	    } else {
		newResearchers.push(researchers[i]);
	    }
	}
	this.setState( { researchers : newResearchers } );
    }
    
    updateResearcher = (researcher) => {

	console.log('App/updateResearcher', researcher);
	var researchers = this.state.researchers;
	var newResearchers = [];

	for (var i = 0; i < researchers.length; i++) {
	    if (researcher.id == researchers[i].id) {
		newResearchers.push(researcher);
	    } else {
		newResearchers.push(researchers[i]);
	    }
	}
	this.setState( { researchers : newResearchers } );
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

    updateZip = (zip) => {
	console.log('zip has been changed to ', zip);
	this.setState( state => ({
	    "zip" : zip
	}));
    }

    setStateForZip(zip) {
	this.setState( state => ({ zip: zip }));
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
      const style1 = { display: 'none' };
      const tabStyle = { height: 548 };

      let project=this.state.project;
      let researchers=this.state.researchers;
      
      console.log('App/render', this.state, project, researchers);
      
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
	      <Dropzone ref={(node) => { this.dropzoneReference = node; }}
         	onDrop={this.onDropBagFile}
		accept="application/zip"
		multiple={false}
	        style={style1} >	    
	      </Dropzone>
	    </Button>
	    <Button onClick={this.saveSIP} bsStyle="primary">Save SIP</Button>
  	    <Button onClick={!sipSubmittedP ? this.submitSIP   : null} bsStyle="primary" disabled={!sipGeneratedP}>Submit SIP</Button>
	    <UserHelp  />	      	      
	  </ButtonToolbar>
	</div>			
      </div>			
    </div>
  </header>

  <div className="container">
    {this.state.showBagLoaderViewer ?
     <BagLoaderViewer bagName={this.state.zip} unmount={this.unshowBagLoaderViewer} />
    : null }	  
    <Tabs style={tabStyle}
      selectedIndex={this.state.selectedIndex}
      onSelect={ (selectedIndex) => {this.setState({ selectedIndex })}}
    >
      <TabList>
	<Tab>Project</Tab>
        <Tab>Researcher(s)</Tab>
	<Tab>Profile</Tab>
	<Tab>Licence</Tab>
	<Tab>Packaging</Tab>
      </TabList>
      
      <TabPanel>
	<h2>Project information</h2>
	<div>	    	    	    
	  <Project project={project} updateProject={this.updateProject}/>
	</div>
      </TabPanel>
      <TabPanel>
	<div>	    	    
	      <Researchers
		researchers         = {researchers}
		updateResearcher    = {this.updateResearcher}
		removeResearcher    = {this.removeResearcher}		
		duplicateResearcher = {this.duplicateResearcher}/>
        </div>
      </TabPanel>
      <TabPanel>
	    <h2>Profile Selection</h2>
	<div>	    
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
  	  Please consult the <a href="http://ufal.github.io/public-license-selector/">licence selector</a>.
	<p>	
	</p>

	<div>
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
    	  <AboutHelp className="header-link" />	      
          <div className="version-info text-center-xs">
	    {softwareVersion}
          </div>
        </div>
        <div className="col-sm-3 text-right">
	  <a href='mailto:claus.zinn@uni-tuebingen.de?subject=Jack The SIPper'>Contact</a>
	  <div>
	    <a href="https://talar.sfb833.uni-tuebingen.de/help/" target="_blank">
	      <span>
		Help Desk
	      </span>
	    </a>
	  </div>
        </div>
      </div>
    </div>
  </footer>
</div>
);
}}
