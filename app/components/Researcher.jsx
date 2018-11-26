// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Reseacher.jsx
// Time-stamp: <2018-11-23 11:38:53 (zinn)>
// -------------------------------------------

import React from 'react';
import { Form, Text, TextArea, Radio, RadioGroup, Select, Checkbox } from 'react-form';
import { Button } from 'react-bootstrap';

export default class Researcher extends React.Component {
    constructor(props) {
	super(props);
	this.removeResearcher  = this.removeResearcher.bind(this);
	this.duplicateResearcher  = this.duplicateResearcher.bind(this);

    }

    removeResearcher( researcher ) {
	this.props.removeResearcher( researcher.id )
    }

    duplicateResearcher( researcher ) {
	this.props.duplicateResearcher( researcher.id )
    }

    render() {

	const statusOptions = [
	    {
		label: 'Research Assistant',
		value: 'researchAssistant',
	    },
	    {
		label: 'Researcher',
		value: 'researcher',
	    },	    
	    {
		label: 'Postdoc',
		value: 'postdoc',
	    },
	    {
		label: 'Professor',
		value: 'prof',
	    },
	];

	const {id, firstName, lastName, email, phone, status, ...props} = this.props.researcher;
	const selectedIndex = this.props.selectedIndex;
	
	return (
<div>
  <h4>Researcher</h4>
  <Form onSubmit={researcher => this.props.updateResearcher( researcher )}>
    {formApi => (
    <form onSubmit={formApi.submitForm} id="form2">
      <div>
        <label htmlFor="id">Id: </label>
        <Text field="id" id="id" className="textBox" defaultValue={id}/>
      </div>
      <div>
        <label htmlFor="firstName">First name: </label>
        <Text field="firstName" id="firstName" className="textBox" defaultValue={firstName}/>
      </div>	    
      <div>
        <label htmlFor="lastName">Last name: </label>
        <Text field="lastName" id="lastName" className="textBox" defaultValue={lastName}/>
      </div>
      <div>
        <label htmlFor="email">Email: </label>
        <Text field="email" id="email" className="textBox" defaultValue={email} />
      </div>
      <div>	    
        <label htmlFor="phone">Phone: </label>
        <Text field="phone" id="phone" className="textBox" defaultValue={phone}/>
      </div>
      <label htmlFor="status" className="d-block">Staff Status: </label>
      <Select field="status" id="status" options={statusOptions}
	      className="mb-4" defaultValue={status}/>
      <button type="submit" className="mb-4 btn btn-primary">Save</button>
	    <Button onClick={ () => this.removeResearcher( {id} )} disabled={selectedIndex==0} bsStyle="primary">Remove Person</Button>
      <Button onClick={ () => this.duplicateResearcher( {id} )} bsStyle="primary">Duplicate Person</Button>
    </form>
    )}
  </Form>
</div>
  )}
}
