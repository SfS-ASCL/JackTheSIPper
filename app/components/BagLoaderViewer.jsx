// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: BagLoaderViewer.jsx
// Time-stamp: <2018-10-09 09:03:14 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class BagLoaderViewer extends React.Component {

    constructor(props) {
	console.log('BagLoaderViewer/constructor', props);
	super(props)
    }
    
    static propTypes = {
	className: PropTypes.string,
    }
    
    state = {
	showModal: true
    }
    openModal = () => {
	this.setState({showModal: true});
    }
    closeModal = () => {
	this.setState({showModal: false});
	this.props.unmount();
    }

    
    render() {

	return <a className={this.props.className} onClick={this.openModal}>
	    {this.state.showModal ?
             <BagLoaderViewerText bagName={this.props.bagName.name} onClose={this.closeModal}/>
	     : null}
	</a>;
    }
}

class BagLoaderViewerText extends React.Component {
    static propTypes = {
	onClose: PropTypes.func,
    }
    render() {
	const bagName = this.props.bagName;
	return(
          <ModalContainer onClose={this.props.onClose}>
	    <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
		<h2>Loading a new SIP/Bag</h2>
		<p>The SIP {bagName} has been loaded!</p>
            </ModalDialog>
	</ModalContainer>
	);
    }
}

