import React, {Component} from 'react';
import { render } from 'react-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import CustomFieldTypes from './../../common/CustomFieldTypes';

class RichTextField extends Component {

  constructor(props){
    super(props);
    //this.handleOnChange = this.handleOnChange.bind(this);

    var values = this.props.field.value ? this.props.field.value : {};

    for(var key in this.props.translations){
        if(values[key] === undefined) {
            values[key] = '';
        }
    }

    console.log("RichTextField :: constructor : ",values);

    this.state = {
        value : values
    };

  }

  handleOnChange(content, delta, source, editor)
  {
    var _this = this.parent;
    var language = this.language ? this.language : null;

    _this.state.value[language] = content;

    _this.props.onFieldChange({
        identifier : _this.props.field.identifier,
        value : _this.state.value
    });
  }

  renderInputs() {

    var inputs = [];

    for(var key in this.props.translations){
      //if(this.props.translations[key]){

        var value = this.props.field.value && this.props.field.value[key] ? this.props.field.value[key] : '';
        var error = this.props.errors && this.props.errors[key] ? this.props.errors[key] : null;

        inputs.push(
        <div className={'form-group bmd-form-group ' + (error !== null ? 'has-error' : null)} key={key}>
         <label htmlFor={this.props.field.identifier} className="bmd-label-floating">{this.props.field.name} - {key}</label>
         <ReactQuill
            id={key}
            language={key}
            parent={this}
            value={value}
            onChange={this.handleOnChange}
          />
        </div>
        );
      //}
    }
    return inputs;
  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item">
        <button  style={{display:(hideTab ? 'none' : 'block')}}  id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+FIELDS.RICHTEXT.icon}></i> {FIELDS.RICHTEXT.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <div className="field-form">
            {this.renderInputs()}
          </div>
        </div>
      </div>
    );
  }

}
export default RichTextField;
