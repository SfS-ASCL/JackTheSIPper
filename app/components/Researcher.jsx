import React from 'react';
import { Form, Text, TextArea, Radio, RadioGroup, Select, Checkbox } from 'react-form';

export default class Researcher extends React.Component {
    constructor(props) {
	super(props);
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

	const {firstName, lastName, email, phone, status, ...props} = this.props.researcher;
	
	return (
<div>
  <Form onSubmit={researcher => this.props.updateResearcher({ researcher })}>
    {formApi => (
    <form onSubmit={formApi.submitForm} id="form2">
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
        <button type="submit" className="mb-4 btn btn-primary">
          Submit
        </button>
      </form>
    )}
  </Form>
</div>
  )}
}
