// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: UserHelp.jsx
// Time-stamp: <2018-10-24 10:25:14 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand} from './../back-end/util';
import { Button, ButtonToolbar } from 'react-bootstrap';

export default class UserHelp extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }
  state = {
    showModal: false,
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
    this.setState({showModal: false});
  }
  render() {
    return(
      <Button onClick={this.openModal} bsStyle="primary">
        Help
	{this.state.showModal ?
        <UserHelpText onClose={this.closeModal}/>
	: null}
      </Button>
      );
  }
}

class UserHelpText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }

  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="userHelpDialog"  width={800}  margin={50}>

	    <h2>How to use Jack The SIPper</h2>
	  <p>You have research data that you would like to archive. Jack The SIPper helps you organising your data by describing it with some simple metadata and by packaging it into a SIP, a so-called "Submission Information Package". For this, the software guides you through a number of forms and UI widgets, see below.
          </p>


	  <h3>Usage:</h3>
	  <ol>
	  <li>The main page comes with five tabs: Project, Researcher(s), Profile, License, and Packaging. Please fill out as much information as possible. For this, please overwrite any default values that should only indicate the texts we expect.</li>
	  <li>In the Tab "Packaging", please use the buttons "Add Folder" and "Add File(s)" to structure you research data package.</li>
	  <li>You can interrupt the process any time. To avoid browser timeouts, please save the current status of your work via "Save SIP". To resume the session, please use "Load SIP".</li>
	  <li>Once your package is complete, please press "Submit SIP", this will send your package to the admins of the SFB research repository. </li>
	  </ol>
	  
	  <h3>Frequently Asked Questions</h3>
	  <ul>
	    <li>
	      <em>Q: Is there a way to suspend working on the package, and resume at a later time.</em>
	      <p>
		A: Yes, first press "Save SIP", which creates a ZIP file you can store on your desktop. All information gathered during the browser session is stored. To resume, press "Load SIP", which loads the ZIP file back into the memory of the browser.
	      </p>	      
	    </li>
	    <li>
	      <em>Q: Where is the research data stored?</em>
	      <p>
		A: When you prepare your SIP in the browser, it is the browser that stores all research data in memory. It is not transferred to anywhere else. You can get use "Save SIP" to get the current status of your "package" as a zip file. If you press "Clear SIP", the browser deletes the current SIP from the browser's storage. When you press "Submit SIP", your package is zipped, and send via e-mail to the admins of the ERDORA research repository. (In fact, it is uploaded to a Tuebingen-local cloud space, that the ERDORA admin (and only the admin can access...)
	      </p>	      
	    </li>	    
	    <li>	      
	      <em>Q: Your question comes here</em>
	    </li>
	  </ul>
          <hr />
	  <p>
	    Please contact the <a href={ emailContactCommand }>Developer Team</a>.
	  </p>
        </ModalDialog>
</ModalContainer>;
  }
}

