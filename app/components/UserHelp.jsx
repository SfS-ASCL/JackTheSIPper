// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: UserHelp.jsx
// Time-stamp: <2018-11-26 09:07:27 (zinn)>
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
	  <p>You have research data that you would like to archive. Jack The SIPper helps you organizing your data, describing it with metadata, packaging all data into a "Submission Information Package" (SIP), and submitting the package to the archive manager. 
          </p>


	  <h3>Usage:</h3>
	  The main page comes with five tabs: Project, Researcher(s), Profile, License, and Packaging. 	  
	  <ol>
	    <li>In the first two tabs, please overwrite the sample information with your project details. </li>
	    <li>In the tab "Profile", please select a profile that best describes your research data.</li>
	    <li>In the tab "Licence", please select the license for your entire research data. This
	    information can be overwritten for individual files you supply in the "Packaging"
	    tab.</li>
	  <li>In the Tab "Packaging", you can organize your research data into a hierarchical
	  trees. Unfortunately, you cannot drag and drop existing file hierarchies into the
	  browser window, but need to recreate or produce such hierarchies step by step. For this, please
	  use the buttons "Add Folder" to create a new folder, and "Add File(s)" to add one or more
	  files to the given folder. You can drag around existing structures in the file tree, if
	  necessary.</li>
	  <li>You can interrupt the process any time. To avoid browser timeouts, please save the
	  current status of your work via "Save SIP". To resume the session after a timeout (or you
	  have closed the browser), please use "Load SIP". </li>
	  <li>Once your package is complete, please press "Submit SIP", this will send your package
	  to the archive manager of <a href="https://talar.sfb833.uni-tuebingen.de">TALAR</a>, the SFB research data repository. </li>
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
		A: When you prepare your SIP in the browser, it is the browser that stores all
		research data in memory. It is not transferred to anywhere else. You can press
		"Save SIP" to save the current status of your "package" as a zip file. If you press
		"Clear SIP", the browser deletes the current SIP from the browser's storage. When
		you press "Submit SIP", your package is zipped, and uploaded to a secure file
		storage server hosted by the TALAR team. The TALAR archive manager gets a notice
		via e-mail that new research data has been uploaded; the archive manager will
		access the research data via the file storage server, inspect it, and will contact you for
		further action that is to be taken (e.g., clarification on metadata, license issues).
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

