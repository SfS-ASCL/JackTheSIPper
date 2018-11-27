// -------------------------------------------
// Jack The SIPper
// 2018- Claus Zinn, University of Tuebingen
// 
// File: DropArea.jsx
// Time-stamp: <2018-11-27 09:36:37 (zinn)>
// -------------------------------------------

import React from 'react';
import Dropzone from 'react-dropzone';
import Resource from './Resource.jsx';
import SortableTree, {
    getNodeAtPath,
    changeNodeAtPath,
    addNodeUnderParent,
    removeNodeAtPath } from 'react-sortable-tree';
import LicencePopup from './LicencePopup.jsx';

import ReactTooltip from 'react-tooltip';
import {findDOMNode} from 'react-dom';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);
	this.onDrop      = this.onDrop.bind(this);
	this.dropzoneRef = undefined;		
    }

    onDrop(files) {

	console.log('DropArea/onDrop', files);
	const that = this.props.parent;
	
	that.setState( (state) => {
	    return { sipClearedP: false };
	});
	
	const getNodeKey = ({ treeIndex }) => treeIndex;	
	var parentKey = that.state.parentKey;
	for (var i=0; i<files.length; i++) {

	    const file = files[i];
	    const name = files[i].name;
	    const size = files[i].size;
	    const type = files[i].type;
	    const date = files[i].lastModified.toString();
	    const dateReadable = new Date(files[i].lastModified).toDateString();
	    
	    that.setState( (state) => {
		return {treeData : addNodeUnderParent({ treeData: state.treeData,
							parentKey: parentKey,
							expandParent: true,
							getNodeKey,
							newNode: {
							    file: file,
							    name: name,
							    isDirectory: false,
							    size: size,
							    type: type,
							    licence: "MIT",
							    date: dateReadable
							},
						      }).treeData
		       };
	    })
	}
    }

    // todo: may implement onDrop recursively
    map([ head, ...tail ], fn) {
	if (head === undefined && !tail.length) return [];
	return tail.length ? [ fn(head), ...(map(tail, fn)) ] : [ fn(head) ];
    }

    render() {
	const that = this.props.parent;
	const tthis = this;
	const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
	    if (nextParent && (nextParent.isRoot)) {
		return true
	    }
	    // node is node to be dropped, nextParent must be directory
	    if (nextParent && (! nextParent.isDirectory)) {
		return false;
	    }
	    // root (SIP) (which has no parents) cannot have any siblings
	    if (! nextParent) {
		return false;
	    }
	    return true;
	};
	
        var dropzoneStyle = { display: 'none' };
	const getNodeKey = ({ treeIndex }) => treeIndex;

	console.log('DropArea/render', that, tthis, canDrop);
	
	return (
  <div>
    <Dropzone ref    = {(node) => { tthis.dropzoneRef = node; }}
	    onDrop   = {tthis.onDrop}
	    style    = {dropzoneStyle} >
      Drop your file, or click to select the file to upload.
    </Dropzone>

    <div style={{ float: "left", height: 600, width: 960 }}>
      <SortableTree
	treeData={that.state.treeData} 
	canDrop={canDrop}
	onChange={treeData => that.setState({ treeData })}
        generateNodeProps={ ( {node, path} ) => {
	
	    const getNodeKey = ({ treeIndex }) => treeIndex;
	    var title = (
		    <input
		style={{ fontSize: '1.1rem' }}
		value={node.name}
		onChange={event => {

		    console.log('generateNodeProps/onChange', event, node);
		    const name = event.target.value;
		    
		    that.setState(state => ({
			treeData: changeNodeAtPath({
			    treeData: state.treeData,
			    path,
			    getNodeKey,
			    newNode: { ...node, name },
			}),
		    }));
		}}
		    />
	    );
	    
	    var buttons = undefined;
	    
	    // the infoButton that comes with each file node
	    var infoButton =
		<div>
		<a data-tip data-for={node.name}>
   		  <button>Info</button>
		</a>
		<ReactTooltip id={node.name} place='right' type='light' offset={{top: 200, left: 10}}>
		  <Resource fileInfo={ { title: node.name,
			                 size: node.size,
				         type: node.type,
				         date: node.date
				       } }/>				
		</ReactTooltip>
		</div>;
	    
	    var licenseButton =
		<LicencePopup licence={node.licence}
			      updateLicence={(licence)  => {
				  if (licence === null) {
				      node.licence = "";
				  } else {
				      node.licence = licence.value
				  }
				  console.log('Metadata Licence for the given file has been changed to ', licence, node);
				  that.setState(state => ({
				      treeData: changeNodeAtPath({
					  treeData: state.treeData,
					  path,
					  getNodeKey,
					  newNode: { ...node },
				      }),
				  }));
			      }}
		>
		Licence
	    </LicencePopup>;
	    
	    var removeFolder =
		<button onClick={() =>
				 that.setState(state => ({
				     treeData: removeNodeAtPath({
					 treeData: state.treeData,
					 path,
					 getNodeKey,
				     }),
				 }))
				}
		>
		Remove Folder
	    </button>;
	    
	    var addFolder = 
		<button onClick={() => {
		    const getNodeKey = ({ treeIndex }) => treeIndex;
		    that.setState(state => ({
			treeData: addNodeUnderParent({
			    treeData: state.treeData,
			    parentKey: path[path.length - 1],
			    expandParent: true,
			    getNodeKey,
			    newNode: {
				name: "Please-edit-me",
				isDirectory: true
			    },
			}).treeData,
		    }))}
				}
		> Add Folder </button>;
	    
	    var addFiles =
		<button onClick= { () =>
				   { that.setState({ parentKey: path[path.length - 1] },
						   function() { tthis.dropzoneRef.open( ) });
				      } } >
		Add file(s)
	    </button>			
		
	    var removeFile =
		<button onClick={() =>
				 that.setState(state => ({
				     treeData: removeNodeAtPath({
					 treeData: state.treeData,
					 path,
					 getNodeKey,
				     }),
				 }))
				}
		>
		Remove file
	    </button>;
	    
	    if (node.isRoot) {
		buttons =  [ addFolder, addFiles ];
	    } else if (node.isDirectory) {
		buttons =  [ addFolder, addFiles, removeFolder ]		;
	    } else {
		buttons =
		    [ removeFile, infoButton, licenseButton ];
	    }
	    
	    return { buttons: buttons,
		     title: title
		   }
	}}
		/>
    </div>
  </div>
	)
    }
}
