// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Project.jsx
// Time-stamp: <2018-10-31 10:08:01 (zinn)>
// -------------------------------------------

import React from 'react';
import { Form, Text, TextArea, Radio, RadioGroup, Select, Checkbox } from 'react-form';

export default class Project extends React.Component {
    constructor(props) {
	super(props);
    }

    shouldComponentUpdate() {
        return true;
    }
    
    render() {

	const statusOptions = [
	    {
		label: 'Ongoing Project',
		value: 'ongoing',
	    },
	    {
		label: 'Completed Project',
		value: 'completed',
	    },
	];

	const {name, affiliation, status, description, ...props} = this.props.project;

	return (
<div>
  <Form onSubmit={project => this.props.updateProject({ project })}>
    {formApi => (
    <form onSubmit={formApi.submitForm} id="form2">
      <div>
        <label htmlFor="name" className="d-block">Project Name: </label>
        <Text field="name" id="name" className="textBox" defaultValue={name}  style={{width: 400}}/>
      </div>
      <div>
        <label htmlFor="affiliation" className="d-block">Project Affiliation: </label>
        <RadioGroup field="affiliation" defaultValue={affiliation}>
	  <table >
	    <tbody>
	      <tr>
		<td>
		  <label htmlFor="sfb833" className="mr-2">SFB 833</label>
		  <Radio value="sfb833" id="sfb833" className="mr-3 d-inline-block" />
		</td>
		<td>
		  <label htmlFor="sfb441" className="mr-2">SFB 441</label>
		  <Radio value="sfb441" id="sfb441" className="d-inline-block" />
		</td>
		<td>
		  <label htmlFor="internal" className="mr-2">internal (EKUT)</label>
		  <Radio value="internal" id="internal" className="d-inline-block" />
		</td>
		<td>
		  <label htmlFor="external" className="mr-2">external</label>
		  <Radio value="external" id="external" className="d-inline-block" />
		</td>
	      </tr>
	    </tbody>
	  </table>
        </RadioGroup>
      </div>
      <div>
        <label htmlFor="status" className="d-block">Status: </label>
        <Select field="status" id="status"
	        options={statusOptions} className="mb-4" defaultValue={status} />
      </div>
      
      <label htmlFor="description">Short Project Description: </label>
      <TextArea field="description"
		id="projectDescription"
		defaultValue={description}
	style={{width: 500, height: 120}} />
       
      <button type="submit" className="mb-4 btn btn-primary">
        Save
      </button>
    </form>
    )}
  </Form>
</div>
  )}
}
