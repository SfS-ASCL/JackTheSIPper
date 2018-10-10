// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: LicenceMenu.jsx
// Time-stamp: <2018-10-09 09:03:48 (zinn)>
// -------------------------------------------

import React from 'react';
import ReactSelectize from 'react-selectize';

var SimpleSelect = ReactSelectize.SimpleSelect;

export default class LicenceMenu extends React.Component {

    constructor(props) {
	super(props);
    }

    render() {
	const {defaultValue, ...props } = this.props;
	const that = this;
	var options = [
	    { label: "Please identify licence",
	      value: "any"
	    },
	    { label: "General Public Licence",
	      value: "gpl"
	    },	    
	    { label: "MIT Licence",
	      value: "mit"
	    },
	    ].map(function(licence){
                return {label: licence.label, value: licence.value}
                       });

        return (
	    <SimpleSelect
	      options = {options}
              defaultValue  = {that.props.defaultValue}
   	      placeholder = "Select licence"
              renderValue = {function(item){
		var exists = options.map(function(option){
		    return option.label
		}).indexOf(item.label) != -1
		
		return
		<div className="simple-value"
		  style={{ color: exists ? "black" : "red" }}
		>
		{item.label}
		</div>
		    }}
              onValueChange = {this.props.onLicenceSelection}	
  	      >
	    </SimpleSelect>
	)}
}
