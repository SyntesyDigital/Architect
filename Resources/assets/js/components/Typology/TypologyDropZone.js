import React, {Component} from 'react';
import { render } from 'react-dom';
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'
import update from 'immutability-helper'

import FieldTypes from './FieldTypes'
import TypologyField from './TypologyField'
import CustomFieldTypes from './../common/CustomFieldTypes'

const fieldTarget = {
	drop(props, monitor, component) {

		const item = monitor.getItem();

		component.addField(item);

		return { name: 'Dustbin' }
	},
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  	isOver: monitor.isOver(),
  	canDrop: monitor.canDrop()
  };
}

class TypologyDropZone extends Component {

	constructor(props){
    super(props);

		this.moveField = this.moveField.bind(this);
		this.handleRemoveField = this.handleRemoveField.bind(this);
		this.handleFieldChange = this.handleFieldChange.bind(this);
		this.handleOpenSettings = this.handleOpenSettings.bind(this);
	}

	exploteToObject(fields) {

		if(fields == null){
			return null;
		}

		var result = {};

		for(var i=0;i<fields.length;i++){
			result[fields[i]] = null;
		}
		return result;
	}

	addField(field) {
		var field = {
			id : this.props.fields.length + 1,
			type : field.type,
			label : field.label,
			icon : field.icon,
			name : "",
			identifier : "",
			rules : this.exploteToObject(field.rules),
			settings : this.exploteToObject(field.settings),
			saved : false,
			editable : field.type == FIELDS.SLUG.type ? false : true
		};

		this.props.onFieldAdded(field);
	}

	moveField(dragIndex, hoverIndex) {
		this.props.moveField(dragIndex,hoverIndex);
	}

	handleRemoveField(fieldId) {

		this.props.onRemoveField(fieldId);

	}

	handleFieldChange(field) {
		this.props.onFieldChanged(field);

	}

	handleOpenSettings(fieldId) {
		this.props.onOpenSettings(fieldId);
	}

	renderFields() {
		const fields = this.props.fields;


		return (
			fields.map((item, i) => (
				<TypologyField
					created={this.props.created}
					saved={item.saved}
					editable={item.editable}
					key={item.id}
					index={i}
					id={item.id}
					type={item.type}
					label={item.label}
					icon={item.icon}
					name={item.name}
					settings={item.settings}
					identifier={item.identifier}
					moveField={this.moveField}
					onRemoveField={this.handleRemoveField}
					onFieldChange={this.handleFieldChange}
					onOpenSettings={this.handleOpenSettings}
				/>
			))
		);


	}

  render() {

    const { canDrop, isOver, connectDropTarget } = this.props
		const isActive = canDrop && isOver

    let className = '';
	if (isActive) {
		className += 'is-active';
	} else if (canDrop) {
		className += 'can-drop';
	}

	if(this.props.errors.fields) {
		className += ' error';
	}

    return connectDropTarget(
			<div className={"fields-list-container " + className}>

				{this.renderFields()}

				<div className="separator"></div>

				<div className="list-container-content-wrapper">
					<div className="list-container-content">
	          {Lang.get('fields.drag_fields')}
	        </div>
				</div>
      </div>
		);
  }

}

TypologyDropZone.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
};

export default DropTarget(FieldTypes.FIELD, fieldTarget, collect)(TypologyDropZone);
