import React from 'react';
import ReactSelectize from 'react-selectize';

var SimpleSelect = ReactSelectize.SimpleSelect;

export default class LicenseMenu extends React.Component {

    constructor(props) {
	super(props);
    }

    render() {
	const {defaultValue, ...props } = this.props;
	const that = this;
	var options = [
	    { label: "Please identify license",
	      value: "any"
	    },
	    { label: "General Public License",
	      value: "gpl"
	    },	    
	    { label: "MIT License",
	      value: "mit"
	    },
	    ].map(function(license){
                return {label: license.label, value: license.value}
                       });

        return (
	    <SimpleSelect
	      options = {options}
              defaultValue  = {that.props.defaultValue}
              value  = {that.props.defaultValue}
   	      placeholder = "Select license"
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
              onValueChange = {this.props.onLicenseSelection}	
  	      >
	    </SimpleSelect>
	)}
}
