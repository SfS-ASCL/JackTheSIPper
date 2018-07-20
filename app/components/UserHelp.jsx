// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: UserHelp.jsx
// Time-stamp: <2018-07-19 14:39:42 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand} from './../back-end/util';

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
    return <a className={this.props.className} onClick={this.openModal}>
      -Help-
      {this.state.showModal ?
        <UserHelpText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class UserHelpText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  state = {
    showSecondModal: false
  }
  openModal = () => {
    this.setState({showSecondModal: true});
  }
  closeModal = () => {
    this.setState({showSecondModal: false});
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="userHelpDialog"  width={800}>
          {this.state.showSecondModal ?
            <SecondModal onClose={this.closeModal}/>
          : null}

	    <h2>How to use Jack The SIPper</h2>
	    <center><p><small><b><em>Leave Help with ESC</em></b></small></p></center>
	  <p>You have research data that you would like to archive. Jack The SIPper helps you organising your data by describing it with some simple metadata and by packaging it into a SIP [...]
          </p>


	  <h3>Usage:</h3>
	  <ol>
	  <li>The main page comes with five tabs: Project, Researcher, Profile, License, and Packaging. [...]</li>
	  <li>2nd step.</li>
	  <li>3rd step.</li>	  
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

class SecondModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
      <ModalDialog onClose={this.props.onClose} width={350} className="userHelpDialog">
        <h1>Second Dialog</h1>
        <p>When you hit esc, only this one will close</p>
      </ModalDialog>
    </ModalContainer>;
  }
}
