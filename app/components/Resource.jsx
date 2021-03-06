// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: Resource.jsx
// Time-stamp: <2018-11-27 09:54:21 (zinn)>
// -------------------------------------------

import React from 'react';
import LicenceMenu from './LicenceMenu.jsx';

export default class Resource extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	const thStyle = {textAlign:'center'};
	const colStyle = {width:'200px'};
	const tableStyle = {
	    borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: 4,
            margin: 10,
            padding: 10,
	    marginLeft: 20,
            width: 400,
	    height:200,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block',
	    verticalAlign: 'top'
	};
	
	const title   = this.props.fileInfo.title;
	const size    = this.props.fileInfo.size;
	const type    = this.props.fileInfo.type;
	const licence = this.props.fileInfo.licence;
        var date      = this.props.fileInfo.date.toString();
	// date = ( date == "noDate" ? today.toString() : date );
	return (
            <div>
  	      <table style={tableStyle} >
		<colgroup>
		  <col style={colStyle}/>
		  <col style={colStyle}/>
		</colgroup>
		<thead>
		  <tr>
		    <th style={thStyle}>resource / size</th>
		    <th style={thStyle}>mimetype / date</th>
		  </tr>
		</thead>
		<tbody>
		  <tr className="notes">
		    <td className="note">
		      { title }
		    </td>
		    <td className="note">		    
		      { size} bytes
		    </td>
		  </tr>
		  <tr>
		    <td className="note">
		      { type } 
		    </td>
		    <td className="note">
		      { date }
		    </td>		  
                  </tr>
		  <tr>
		    <td className="note">
		      <b>licence</b> 
		    </td>
		    <td className="note">
		      { licence }
		    </td>		  
                  </tr>		
		</tbody>
	      </table>
	    </div>
	);
    }
}
