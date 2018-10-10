// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: CMDIViewer.jsx
// Time-stamp: <2018-10-09 09:03:24 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import JSONViewer from 'react-json-viewer';

export default class CMDIViewer extends React.Component {

    constructor(props) {
	console.log('CMDIViewer/constructor', props);
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
             <CMDIViewerText cmdiContent={this.props.cmdiContent} cmdiContentJSON = {this.props.cmdiContentJSON} onClose={this.closeModal}/>
	     : null}
	</a>;
    }
}

class CMDIViewerText extends React.Component {
    static propTypes = {
	onClose: PropTypes.func,
    }
    render() {
	const cmdiContent = this.props.cmdiContent;
	const cmdiContentJSON = this.props.cmdiContentJSON;
	console.log('CMDIViewerText', cmdiContent);
	return(
          <ModalContainer onClose={this.props.onClose}>
	    <ModalDialog onClose={this.props.onClose} className="systemAlertDialog"  width={400}>
		<h2>CMDI Content</h2>
		<JSONViewer json={cmdiContentJSON}></JSONViewer>
            </ModalDialog>
	</ModalContainer>
	);
    }
}

