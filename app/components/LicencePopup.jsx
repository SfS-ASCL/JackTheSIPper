// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: LicencePopup.jsx
// Time-stamp: <2018-11-27 09:44:49 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import Licence from './Licence.jsx';

export default class LicencePopup extends React.Component {
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
      const licence = this.props.licence;
      console.log('LicencePopup/render', this.props, licence);
      
      return(
        <button onClick={this.openModal} >
	  Licence
	  {this.state.showModal ?	  
           <LicencePopupText onClose={this.closeModal}
			     updateLicence={this.props.updateLicence}
	                     licence={this.props.licence} /> : null}
	</button>
      );
  }
}

class LicencePopupText extends React.Component {
    static propTypes = {
	onClose: PropTypes.func,
    }

    render() {
	return(
		<ModalContainer onClose={this.props.onClose}>
		  <ModalDialog onClose={this.props.onClose}
			       width={800}
			       margin={50}>
		    <Licence licence={this.props.licence} updateLicence={this.props.updateLicence} />
		  </ModalDialog>
		</ModalContainer>
	);
    }
}

