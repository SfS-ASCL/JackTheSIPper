import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';

export default class License extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    searchable: true,
	    clearable: true,
	    selectValue: 'clarin_pub_by'
	}

	this.updateValue = this.updateValue.bind(this);
    }

    updateValue(newValue) {
	console.log('updateValue', newValue);
	this.setState({
	    selectValue: newValue,
	});
    }
    
    render() {

	const choices = [
	    { value: 'clarin_pub_by',              label: 'CLARIN PUB+BY'},
	    { value: 'clarin_pub_by_sa',           label: 'CLARIN PUB+BY+SA'},
	    { value: 'clarin_pub_by_nc',           label: 'CLARIN PUB+BY+NC'},
	    { value: 'clarin_pub_by_nc_sa',        label: 'CLARIN PUB+BY+NC+SA'},
	    { value: 'clarin_pub_id_by_lrt_nored', label: 'CLARIN PUB+ID+BY+LRT+NORED'},
	];

	return (
	    <div>
	      <Select
	        searchable={this.state.searchable}
   	        clearable={this.state.clearable}
	        options={choices}
	        value={this.props.license}
	        onChange={this.updateValue}
	      />
	    </div>
	);
    }
};

