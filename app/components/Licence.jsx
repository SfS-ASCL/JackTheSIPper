// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Licence.jsx
// Time-stamp: <2018-12-05 10:16:17 (zinn)>
// -------------------------------------------

import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class Licence extends React.Component {
    constructor(props) {
	super(props);

	this.gotoPreviousTab = this.gotoPreviousTab.bind(this);
	this.gotoNextTab = this.gotoNextTab.bind(this);
	
	this.state = {
	    searchable: true,
	    clearable: true,
	}
    }

    gotoPreviousTab() {
	this.props.gotoPreviousTab();
    }

    gotoNextTab() {
	this.props.gotoNextTab();
    }
    
    updateValue(newValue) {
	console.log('updateValue', newValue);
	this.setState({
	    selectValue: newValue,
	});
    }
    
    render() {

	const {licence, ...props} = this.props.licence;	
	const choices = [
	    { label: 'CLARIN PUB+BY',              value: 'clarin_pub_by'},
	    { label: 'CLARIN PUB+BY+SA',           value: 'clarin_pub_by_sa'},
	    { label: 'CLARIN PUB+BY+NC',           value: 'clarin_pub_by_nc'},
	    { label: 'CLARIN PUB+BY+NC+SA',        value: 'clarin_pub_by_nc_sa'},
	    { label: 'CLARIN PUB+ID+BY+LRT+NORED',                                   value: 'clarin_pub_id_by_lrt_nored'},
	    { label: 'Public Domain Mark (PD)',                                      value: '(PD)'},
    	    { label: 'Public Domain Dedication (CC Zero)',                           value: '(CC Zero)'},
	    { label: 'Creative Commons Attribution (CC-BY)',                         value: '(CC-BY)'},
	    { label: 'Creative Commons Attribution-ShareAlike (CC-BY-SA)',           value: '(CC-BY-SA)'},
	    { label: 'Creative Commons Attribution-NoDerivs (CC-BY-ND)',             value: '(CC-BY-ND)'},
	    { label: 'Creative Commons Attribution-NonCommercial (CC-BY-NC)',        value: '(CC-BY-NC)'},
	    { label: 'Creative Commons Attribution-NonCommercial-ShareAlike (CC-BY-NC-SA)', value: '(CC-BY-NC-SA)'},
	    { label: 'Creative Commons Attribution-NonCommercial-NoDerivs (CC-BY-NC-ND)',   value: '(CC-BY-NC-ND)'},
	    { label: 'Artistic License 1.0', value:'AT-1.0'},
	    { label: 'Artistic License 2.0', value:'AT-1.0'},
	    { label: 'GNU General Public License 2 or later (GPL-2.0)', value:'(GPL-2.0)'},
	    { label: 'GNU General Public License 3 (GPL-3.0)', value:'(GPL-3.0)'},
	    { label: 'Affero General Public License 3 (AGPL-3.0)', value:'(AGPL-3.0)'},
	    { label: 'Mozilla Public License 2.0', value:'MPL-2.0'},
	    { label: 'GNU Library or "Lesser" General Public License 2.1 or later (LGPL-2.1)', value:'(LGPL-2.1)'},
	    { label: 'GNU Library or "Lesser" General Public License 3.0 (LGPL-3.0)', value:'(LGPL-3.0)'},
	    { label: 'Eclipse Public License 1.0 (EPL-1.0)', value:'(EPL-1.0)'},
	    { label: 'Common Development and Distribution License (CDDL-1.0)', value:'(CDDL-1.0)'},
	    { label: 'The MIT License (MIT)', value:'MIT'},
	    { label: 'The BSD 3-Clause "New" or "Revised" License (BSD)', value:'(BSD)'},
	    { label: 'The BSD 2-Clause "Simplified" or "FreeBSD" License', value:'FreeBSD'},
	    { label: 'Apache License 2', value:'AP-2'}
	];

	return (
	    <div>
	      <Select
	        searchable={this.state.searchable}
   	        clearable={this.state.clearable}
	        options={choices}
	        value={this.props.licence}
	        onChange={this.props.updateLicence}
		 />
		<div><p />
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
};

