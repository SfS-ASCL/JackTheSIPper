// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: ProfileSelection.jsx
// Time-stamp: <2018-12-05 10:13:56 (zinn)>
// -------------------------------------------

'use strict';

import React from 'react';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	this.gotoPreviousTab = this.gotoPreviousTab.bind(this);	
	this.gotoNextTab     = this.gotoNextTab.bind(this);	
    }

    gotoPreviousTab() {
	this.props.gotoPreviousTab();
    }

    gotoNextTab() {
	this.props.gotoNextTab();
    }

    render() {
	const tabStyle = { width: '200px', border:'8pt' };	
	const selectedProfile = this.props.selectedProfile
	console.log('ProfileSelection', selectedProfile);
	
	return (
<div style={{ height: 180, width: 500 }} >
  <h4 style={ { marginTop: 32 } }>Select Type of Research Data:</h4>
  <RadioGroup 
	    value={selectedProfile}
	    onChange={ this.props.updateProfile }
     >
    <RadioButton value="textCorpus"  iconSize={20} style={tabStyle} >
      Textcorpus
    </RadioButton>
    <RadioButton value="lexicalResource"  iconSize={20}>
      Lexical Resource
    </RadioButton>
    <RadioButton value="speechCorpus"  iconSize={20}>
      Speech Corpus
    </RadioButton>      
    <RadioButton value="tool"  iconSize={20}>
      Tool
    </RadioButton>
    <RadioButton value="experiment"  iconSize={20}>
      Experiment
    </RadioButton>
  </RadioGroup>
  <div>
    <ButtonToolbar >    
      <Button onClick={ () => {
	this.gotoPreviousTab() }} bsStyle="primary">Previous
      </Button>
      <Button onClick={ () => {
	this.gotoNextTab() }} bsStyle="primary">Next
      </Button>		
    </ButtonToolbar>
  </div>
</div>
);
    }
}
