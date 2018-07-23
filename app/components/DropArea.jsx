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
	    treeData: [{ title: 'SIP', isDirectory: true, isRoot: true}],	    
	    currentNode: {
		file: "",
		title: "SIP",
		size: 0,
		type: "root",
		date: "noDate"
	    }
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
	    const dateReadable = new Date(files[i].lastModified);
	    console.log('date', dateReadable);
	    this.props.parent.setState( (state) => {
		return {treeData : addNodeUnderParent({ treeData: state.treeData,
							parentKey: parentKey,
							expandParent: true,
							getNodeKey,
							newNode: {
							    file: file,
							    title: name,
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
        var dropzoneStyle = {
	    display: 'none',
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 10,
            padding: 10,
            width: 20, // do not display, that is, shrink ten-fold
	    height:10,
	    resize: 'none',
	    transition: 'all 0.5s',
//	    display:'inline-block'
        };

        var dropzoneActiveStyle = {
	    display: 'none',
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 0 // 8
        };

	const fileTree = this.props.parent.state.treeData

	return (
  <div>
    <Dropzone ref={(node) => { dropzoneRef = node; }}
	    onDrop={this.onDrop}
	    style={dropzoneStyle}
	    activeStyle={dropzoneActiveStyle} >
      Drop your file, or click to select the file to upload.
	    </Dropzone>

    <table style={{height: 600, width: 1000}} >
    <tbody>
      <tr>
	<td>
	  <div style={{ float: "left", height: 600, width: 700 }}>
	    <SortableTree
	    treeData={fileTree} 
	    canDrop={canDrop}
	    onChange={treeData => this.props.parent.setState({ treeData })}
            generateNodeProps={ ( {node, path} ) => {
		var buttons = undefined;

		// the infoButton that comes with each node
		var infoButton =
		<button onClick={() => {
		    this.setState(state => ({
			currentNode: {
			    file: node.file,
			    title: node.title,
			    size: node.size,
			    type: node.type,
			    date: node.date
			}})) 
			}}
			>
			Info
		</button>;

		var removeFilesButton =
		<button onClick={() =>
		    this.props.parent.setState(state => ({
			treeData: removeNodeAtPath({
			    treeData: state.treeData,
			    path,
			    getNodeKey,
			}),
		    }))
		}
		>
			Remove file(s)
		</button>;
		    
		if ((node.isRoot) || (node.isDirectory) ) {
		    buttons =
		    [
			<button
			onClick={() => {

			    // first, add the node with dummy title
			    var result = addNodeUnderParent({
				treeData: this.props.parent.state.treeData,
				parentKey: path[path.length - 1],
				expandParent: true,
				getNodeKey,
				newNode: {
				    title: "Please Edit", 
				    isDirectory: true
				    }
			    });

			    // The tree index at which the node was inserted
			    var treeIndex = result.treeIndex;
			    
			    // The updated tree data
			    var localTreeData = result.treeData;   
			    var newPath = path.concat([treeIndex]);

			    // second, get the node just added
			    var node = getNodeAtPath({
				treeData: localTreeData,
				path: newPath,
				getNodeKey: getNodeKey,
				ignoreCollapsed: false});

			    this.props.parent.setState(state => ({
				treeData: localTreeData
				}));
			    
			    // third, replace dummy title with input field
			    this.props.parent.setState(state => ({
				treeData: changeNodeAtPath({
				    treeData: localTreeData, 
				    path: newPath,
				    getNodeKey,
				    newNode: {
					title: (
					<input
					style={{ fontSize: '1.1rem' }}
					value={node.title}
					onChange={event => {
					    const newValue = event.target.value;
					    
					    var node = getNodeAtPath({
						 treeData: this.props.parent.state.treeData, 
						 path: newPath,
						 getNodeKey: getNodeKey,
						 ignoreCollapsed: false});

					    var nnode = node.node;
					    nnode.title.props.value = newValue;
					    this.props.parent.setState(state => ({
						treeData: changeNodeAtPath({
						    treeData: state.treeData, 
						    path: newPath,
						    getNodeKey,
						    newNode: {...nnode, value:newValue}
						}),
					    }));
					}}
					/>
				    ),
				    isDirectory: true
				}
			    })}));
			} }
			    >
			Add Folder
		        </button>,
			
			<button onClick= { () =>
			{ this.setState({ parentKey: path[path.length - 1] }); dropzoneRef.open( ) } } >
			Add file(s)
		        </button>,
		    ]
		} else {
		    buttons =
		[
		    <button
		    onClick={() =>
			this.props.parent.setState(state => ({
			    treeData: removeNodeAtPath({
				treeData: state.treeData,
				path,
				getNodeKey,
			    }),
			}))
		    }
		    >
		    Remove file
		    </button>,
		    <button
		    onClick={() => {
			this.setState(state => ({
			    currentNode: {
				title: node.title,
				size: node.size,
				type: node.type,
				date: node.date,
				licence: "to be requested"
			    }}))
		    }}
		    >
		    Licence
		    </button>,

		]}

		// all directories (except root) get a "Remove file(s) button.
		if (node.isDirectory) {
		    buttons.push(removeFilesButton);
		}

		// all nodes get an INFO box
		buttons.push(infoButton);
		
		return {
		    buttons: buttons
		}
	    }}
         
	    />
	  </div>
	</td>
	<td>
	  <Resource fileInfo={ this.state.currentNode } style={{ float: "left" }}/>
	</td>	
      </tr>
    </tbody>
    </table>	  
  </div>
	)
    }
}
