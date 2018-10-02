import React from 'react';
import Dropzone from 'react-dropzone';
import Resource from './Resource.jsx';
import SortableTree, {
    getNodeAtPath,
    changeNodeAtPath,
    addNodeUnderParent,
    removeNodeAtPath } from 'react-sortable-tree';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.onDrop      = this.onDrop.bind(this);
	
	this.state = {
	    treeData: [{ name: 'SIP', isDirectory: true, isRoot: true}],
	    currentNode: {
		file: "",
		name: "SIP",
		size: 0,
		type: "root",
		date: "noDate"
	    },
	    counter : 0
	};
    }

    onDrop(files) {
	this.props.parent.setState( (state) => {
	    return { sipClearedP: false };
	});
	
	const getNodeKey = ({ treeIndex }) => treeIndex;	
	var parentKey = this.state.parentKey;
	for (var i=0; i<files.length; i++) {

	    console.log('DropArea/onDrop: files[i]', files[i]);
	    const file = files[i];
	    const name = files[i].name;
	    const size = files[i].size;
	    const type = files[i].type;
	    const date = files[i].lastModified.toString();
	    const dateReadable = new Date(files[i].lastModified).toDateString();
	    
	    // console.log('date', dateReadable, dateReadable.toDateString(), dateReadable.toISOString());
	    
	    this.setState( (state) => {
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

	// make sure that files (or directory) cannot be subfolders of a file
	// that is, the parent must be a directory
	const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
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

	
	let dropzoneRef;
	const getNodeKey = ({ treeIndex }) => treeIndex;
	
        var dropzoneStyle = { display: 'none' };

	return (
  <div>
    <Dropzone ref  = {(node) => { dropzoneRef = node; }}
	    onDrop = {this.onDrop}
	    style  = {dropzoneStyle} >
      Drop your file, or click to select the file to upload.
    </Dropzone>

    <table style={{height: 600, width: 600}} >
      <tbody>
	<tr>
	  <td>
	    <div style={{ float: "left", height: 600, width: 600 }}>
	      <SortableTree
	        treeData={this.state.treeData} 
		canDrop={canDrop}
		onChange={treeData => this.setState({ treeData })}
                generateNodeProps={ ( {node, path} ) => {

		    const getNodeKey = ({ treeIndex }) => treeIndex;
		    var title = (
			    <input
				 style={{ fontSize: '1.1rem' }}
				 value={node.name}
				 onChange={event => {
				     const name = event.target.value;
				     
				     this.setState(state => ({
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
			<button onClick={() => {
			    this.setState(state => ({
				currentNode: {
				    file: node.file,
				    title: node.name,
				    size: node.size,
				    type: node.type,
				    date: node.date
				}})) 
			}}
			>
			Info
		    </button>;

		    var licenseButton =
			<button onClick={() => {
			    this.setState(state => ({
				currentNode: {
				    title: node.name,
				    size: node.size,
				    type: node.type,
				    date: node.date,
				    licence: "to be requested"
				}}))
			}}
			>
			Licence
		    </button>;

		    var removeFolder =
			<button onClick={() =>
					 this.setState(state => ({
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
					this.setState(state => ({
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
					   { this.setState({ parentKey: path[path.length - 1] });
					     dropzoneRef.open( ) } } >
			Add file(s)
		    </button>			

		    var removeFile =
			<button onClick={() =>
					 this.setState(state => ({
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
		    
		    if ((node.isRoot) || (node.isDirectory) ) {
			buttons =
			    [ addFolder, addFiles, removeFolder ];
		    } else {
			buttons =
			    [ removeFile, infoButton, licenseButton ]
		    }
		    
		    return { buttons: buttons,
			     title: title
			   }
		}}
	    />
	  </div>
	</td>
	<td  style={{ verticalAlign: "top" }}>
	  <Resource fileInfo={ this.state.currentNode }/>
	</td>	
      </tr>
    </tbody>
    </table>	  
  </div>
	)
    }
}
