// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Reseachers.jsx
// Time-stamp: <2018-12-03 15:01:27 (zinn)>
// -------------------------------------------

import React from 'react';
import Researcher from './Researcher.jsx';
import uuid from 'uuid';
import { Button } from 'react-bootstrap';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default class Researchers extends React.Component {
    constructor(props) {
	super(props);
	this.removeResearcher    = this.props.removeResearcher;	
	this.state = { selectedIndex: 0 };
	this.removeResearcher = this.removeResearcher.bind(this);
    }

    removeResearcherHelper(r) {
	console.log('this', this);
	this.setState( { selectedIndex: 0 });
	this.removeResearcher(r);
    }

    render() {
	const removeResearcherHelper = this.removeResearcherHelper.bind(this);

	const researchers         = this.props.researchers;
        const updateResearcher    = this.props.updateResearcher;
	const duplicateResearcher = this.props.duplicateResearcher;
	const gotoNextTab         = this.props.gotoNextTab;
	
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
					     removeResearcher    = {removeResearcherHelper}
					     duplicateResearcher = {duplicateResearcher}
					     gotoNextTab         = {gotoNextTab}
             				     key                 = {index}
					     researcher          = {researcher}
					     selectedIndex       = {this.state.selectedIndex}
					     />
				 </TabPanel>
				 )}
            </Tabs>		
          </div>
	</div>
	);
    }
}
