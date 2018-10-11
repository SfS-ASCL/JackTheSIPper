// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Reseachers.jsx
// Time-stamp: <2018-10-10 09:59:08 (zinn)>
// -------------------------------------------

import React from 'react';
import Researcher from './Researcher.jsx';
import uuid from 'uuid';
import { ButtonToolbar, Button } from 'react-bootstrap';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default class Researchers extends React.Component {
    constructor(props) {
	super(props);

	this.state = { selectedIndex: 0 };
    }

	    
    render() {
	const researchers         = this.props.researchers;
	const removeResearcher    = this.props.removeResearcher;
        const updateResearcher    = this.props.updateResearcher;
	const duplicateResearcher = this.props.duplicateResearcher;
	const tabStyle = { height: 548 };
	
	console.log('Researchers.jsx/render', researchers);
	
	return (
     	<div>
      	  <h2 id="researcherHeading">Researchers</h2>

	    <div>
	      <Tabs style={tabStyle}
		    selectedIndex={this.state.selectedIndex}
		    onSelect={ (selectedIndex) => {this.setState({ selectedIndex })}}
		>
		<TabList>
		{researchers.map((researcher, index) =>		  
				 <Tab key = {index}>{researcher.lastName}</Tab>
				)}
		</TabList>
		
		{researchers.map((researcher, index) =>		  
				 <TabPanel key={index}>
				 <Researcher updateResearcher    = {updateResearcher}
					     removeResearcher    = {removeResearcher}
					     duplicateResearcher = {duplicateResearcher}					     
             				     key                 = {index}
					     researcher          = {researcher}
					     />
				 </TabPanel>
				 )}
            </Tabs>		
          </div>
	</div>
	);
    }
}
