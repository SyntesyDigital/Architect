import React, {Component} from 'react';
import { render } from 'react-dom';

import update from 'immutability-helper'

import CustomFieldTypes from './../../common/CustomFieldTypes';
import ImagesDragField from './ImagesDragField';

class ImagesField extends Component {

  constructor(props){
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.moveField = this.moveField.bind(this);
    this.handleRemoveField = this.handleRemoveField.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
  }

  componentDidMount(){
      console.log('IMAGES =>', this.props.field);

    if(this.props.field.value === undefined || this.props.field.value == null || Object.keys(this.props.field.value).length == 0){
      //setup value if not yet defined
      var newField = {
          identifier: this.props.field.identifier,
          value: []
      };

      this.props.onFieldChange(newField);

      console.log('componentDidMount =>', this.props.field);

    }
  }

  moveField(dragIndex, hoverIndex) {

    const field = this.props.field;
    const dragField = field.value[dragIndex]

    var result = update(field, {
        value: {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragField]
            ],
        }
    });

    var newField = {
      identifier : this.props.field.identifier,
      value : result.value
    };

    this.props.onFieldChange({
        identifier: this.props.field.identifier,
        value: result.value
    });

	}

  handleOnChange(event) {
      this.props.field.value = event.target.value;
      this.props.onFieldChange(this.props.field);
  }

  onImageSelect(event) {
    event.preventDefault();
    this.props.onImageSelect(this.props.field);
  }

  handleRemoveField(fieldId) {

        const fields = this.props.field.value;

        for(var i=0;i<fields.length;i++){
        	if(fieldId == fields[i].id ){
        		fields.splice(i,1);
        		break;
        	}
        }

        this.props.onFieldChange({
            identifier : this.props.field.identifier,
            value : fields
        });

    }

    getImageFormat(format)
    {
        var _format = null;

        if(IMAGES_FORMATS) {
            IMAGES_FORMATS.map(function(f){
                if(f.name == format) {
                    _format = f;
                }
            });
        }

        return _format;
    }

  renderInputs() {


    if(this.props.field.value === undefined || this.props.field.value == null || Object.keys(this.props.field.value).length === 0){
      return;
    }

    const images = this.props.field.value;

    return (
			images.map((item, i) => (
  					<ImagesDragField
  						key={item.id}
  						index = {i}
  						id={item.id}
              media={item}
  						moveField={this.moveField}
  						onRemoveField={this.handleRemoveField}
  					/>

				))
		);

  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item contents-field images-field">

        <button style={{display:(hideTab ? 'none' : 'block')}}  id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+ FIELDS.IMAGES.icon}></i> {FIELDS.IMAGES.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

            <div className="field-form fields-list-container images-form">
                {this.renderInputs()}
            </div>

            <div className="add-content-button">
               <a href="#" className="btn btn-default" onClick={this.onImageSelect}><i className="fa fa-plus-circle"></i>  {Lang.get('fields.select')}</a>
            </div>

        </div>

      </div>
    );
  }

}
export default ImagesField;
