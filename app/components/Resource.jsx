import React from 'react';
import LicenseMenu from './LicenseMenu.jsx';

export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	this.setLicense             = this.setLicense.bind(this);	

	this.state = {
	    license : {
		license : "MIT License",
		threeLetterCode: "mit"
	    }
	}
    }

    setLicense( license ) {

	this.setState(state => ({ 	
	    license : {
		license : license.label,
		threeLetterCode: license.value
	    }}));
    }
    
    render() {
	const title = this.props.fileInfo.title;
	const size  = this.props.fileInfo.size;
	const type  = this.props.fileInfo.type;
	const date  = this.props.fileInfo.date.toString();
	return (
          <div className="resources" >
  	    <div className="resource-header">
	      <span>File Info</span>
	    </div>
  	    <ul className="notes">
	      <li className="note" key="resourceName" >
		<div>
   		  <span className="note">name: {title}</span>
		</div>		
	      </li>
	      <li className="note" key="resourceSize" >
		<div>
		  <span className="note">size: {size}</span>
		</div>				 
   	      </li>
	      <li className="note" key="resourceMimetype" >
		<div>
		  <span className="note">mimetype: {type}</span>
		</div>				 
              </li>
	      <li className="note" key="resourceDate" >
		<div>
		  <span className="note">date: {date}</span>
		</div>				 
   	      </li>
	    </ul>
         </div>
	);
    }
}
