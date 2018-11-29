// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: AlertSubmitSuccessful.jsx
// Time-stamp: <2018-11-29 13:32:13 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailArchiveManagerCommand} from './../back-end/util';

export default class AlertSubmitSuccessful extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }
    constructor(props) {
	super(props);
	this.propagateFun = this.props.onCloseProp;
    }
    
  state = {
    showModal: true
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
    this.setState({showModal: false});
  }
  render() {
    return <a className={this.props.className} onClick={this.openModal}>
      {this.state.showModal ?
        <AlertSubmitSuccessfulText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AlertSubmitSuccessfulText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="devHelpDialog" width={800} top={100} margin={50}>
          <h2>Submission Report</h2>
            <p>
              Thank you for your submission. Jack The SIPper has uploaded your package to
	      the <a href="https://talar.sfb833.uni-tuebingen.de">TALAR </a> cloud storage server for
	      intermediate storage. Please click on the following link to compose and send an e-mail to the 
	      <a href={emailArchiveManagerCommand }> TALAR archive manager.</a> 
            </p>
        </ModalDialog>
</ModalContainer>;
  }
}
