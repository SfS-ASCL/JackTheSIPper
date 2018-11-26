// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: AboutHelp.jsx
// Time-stamp: <2018-11-26 09:10:41 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand} from './../back-end/util';

export default class AboutHelp extends React.Component {
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
      About
      {this.state.showModal ?
        <AboutHelpText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AboutHelpText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="devHelpDialog" width={800} top={100} margin={50}>
          <div className="content" id="about">
	  
            <h2>About</h2>
            <p>
              Jack The SIPper is being developed within
              the <a href="https://www.sfb833.uni-tuebingen.de">SFB 833</a> project. It aims at
              helping researchers to transfer their research data to
              the <a href="https://talar.sfb833.uni-tuebingen.de">TALAR </a> research data
              repository.
            </p>
            
          <h3>Credits</h3>
            <ul>
              <li>Dr Claus Zinn (main developer)</li>
  	      <li>
          Icons by <a href="http://glyphicons.com/">Glyphicons</a> and <a href="http://fontawesome.io/icons/">Font Awesome</a>.
	  </li>
            </ul>
	    
            <h3 id="sources">Source code</h3>
            <p>
              The <a href="https://github.com/SfS-ASCL/JackTheSIPper">Jack The SIPper GitHub repository</a> provides
	      the source code.
            </p>
	    
            <h3 id="licence">Licence</h3>
            <div className="licenceText">
              <p>Copyright (C) 2018- University of Tuebingen</p>
              <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>
              <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.</p>
              <p>You should have received a copy of the GNU General Public License along with this program. If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.</p>
            </div>
	    
            <h3>Technology used</h3>
            <ul>
              <li><a href="https://facebook.github.io/react/">ReactJS</a> (version 15.6.1)</li>
	      <li><a href="https://nodejs.org/en/">Nodejs</a> (version 8.11.1)</li>
	      <li><a href="https://www.npmjs.com">Javascript package manager npm</a> (version 5.6.0)</li>
	      <li><a href="https://webpack.github.io">Webpack Javascript module bundler</a>(version 4.12.0)</li>
	      <li><a href="http://www.json.org">JSON (JavaScript Object Notation)</a></li>
            </ul>
	    
	    <p>
	      The <a href="https://github.com/SfS-ASCL/JackTheSIPper">Jack The SIPper GitHub
		repository</a> hosts a <code>package.json</code> file that defines all Javascript dependencies.
	    </p>
          </div>

	  <p>
	    We value your feedback! For any questions or suggestions, please contact the <a href={ emailContactCommand }>Developer Team</a>. But please consult the user help beforehand (see top navigation bar).
	  </p>
        </ModalDialog>
</ModalContainer>;
  }
}
