import React, {Component} from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'

import CustomFieldTypes from './../../common/CustomFieldTypes';
import ImageFieldTypes from './ImageFieldTypes';
import flow from 'lodash/flow';

const style = {
	cursor: 'move',
}

const fieldSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		}
	},
}

const fieldTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

		// Determine mouse position
		const clientOffset = monitor.getClientOffset()

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return
		}

		// Time to actually perform the action
		props.moveField(dragIndex, hoverIndex)

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex
	},
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
	  isDragging: monitor.isDragging(),
  };
}

class ImagesDragField extends Component {


	constructor(props){
		super(props);

		//console.log("ImagesDragField => ",props);

		this.onRemoveField = this.onRemoveField.bind(this);
	}

	onRemoveField(event) {
		event.preventDefault();

		this.props.onRemoveField(this.props.id);
	}

  render() {

    const {
			isDragging,
			connectDragSource,
			connectDropTarget,
		} = this.props
		const opacity = isDragging ? 0 : 1

    return connectDragSource(
			connectDropTarget(

      <div className="typology-field" style={{ ...style, opacity }}>
        <div className="field-type">
          <i className={"fa "+FIELDS.IMAGE.icon}></i> &nbsp; {FIELDS.IMAGE.name}
        </div>

        <div className="field-inputs">
			<div className="image" style={{backgroundImage:'url(/' + this.props.media.urls.thumbnail + ')'}}>
			</div>

			<div className="field-name">
				{this.props.media.uploaded_filename}
			</div>
        </div>

        <div className="field-actions">
          <a href="" className="remove-field-btn" onClick={this.onRemoveField}> <i className="fa fa-trash"></i> {Lang.get('fields.delete')} </a>
					&nbsp;&nbsp;
        </div>
      </div>),
    );
  }

}

ImagesDragField.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
	connectDropTarget: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	isDragging: PropTypes.bool.isRequired,
	id: PropTypes.any.isRequired,
	moveField: PropTypes.func.isRequired,
};

export default flow(
  DragSource(ImageFieldTypes.FIELD, fieldSource, collectSource),
  DropTarget(ImageFieldTypes.FIELD, fieldTarget, collectTarget)
)(ImagesDragField);
