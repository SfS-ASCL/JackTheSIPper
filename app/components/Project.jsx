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

	const {name, context, status, description, ...props} = this.props.project;

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
        <RadioGroup field="context" defaultValue={context}>
          <label htmlFor="sfb833" className="mr-2">SFB 833</label>
          <Radio value="sfb833" id="sfb833" className="mr-3 d-inline-block" />
          <label htmlFor="sfb441" className="mr-2">SFB 441</label>
          <Radio value="sfb441" id="sfb441" className="d-inline-block" />
        </RadioGroup>
      </div>
      <div>
        <label htmlFor="status" className="d-block">Status: </label>
        <Select field="status" id="status"
	        options={statusOptions} className="mb-4" defaultValue={status} />
      </div>
      
      <label htmlFor="description">Short Project Description: </label>
      <TextArea field="description" id="projectDescription" defaultValue={description} style={{width: 500}} />
       
      <button type="submit" className="mb-4 btn btn-primary">
        Submit
      </button>
    </form>
    )}
  </Form>
</div>
  )}
}
