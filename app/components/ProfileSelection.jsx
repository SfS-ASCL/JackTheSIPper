// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: ProfileSelection.jsx
// Time-stamp: <2018-10-09 09:03:55 (zinn)>
// -------------------------------------------

'use strict';

import React from 'react';
import { RadioGroup, RadioButton } from 'react-radio-buttons';

export default class Resource extends React.Component {
    constructor(props) {
	super(props);
    }
    
    render() {
	const selectedProfile = this.props.selectedProfile
	console.log('ProfileSelection', selectedProfile);
	
	return (
<div style={{ height: 180, width: 500 }} >
  <h4 style={ { marginTop: 32 } }>Select Type of Research Data:</h4>
  <RadioGroup 
	    value={selectedProfile}
	    onChange={ this.props.updateProfile }
	    horizontal >
    <RadioButton value="textCorpus"  iconSize={20}>
      Textcorpus
    </RadioButton>
    <RadioButton value="lexicalResource"  iconSize={20}>
      Lexical Resource
    </RadioButton>
    <RadioButton value="speechData"  iconSize={20}>
      Speech Data
    </RadioButton>      
    <RadioButton value="Tool"  iconSize={20}>
      Tool
    </RadioButton>
    <RadioButton value="experiment"  iconSize={20}>
      Experiment
    </RadioButton>
    <RadioButton value="other"  iconSize={20}>
      Other
    </RadioButton>			
  </RadioGroup>
</div>
);
    }
}
