import React, {Component} from 'react';
import { render } from 'react-dom';

import CustomFieldTypes from './../../common/CustomFieldTypes';

class ListField extends Component {

  constructor(props){
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);

  }

  handleOnChange(event) {

    const fields = this.props.field.values;

    for(var i=0;i<fields.length;i++){
      if(fields[i].value == event.target.value){
        fields[i].checked = event.target.checked;
        break;
      }
    }


    this.props.onFieldChange(fields);
  }

  renderInputs() {

    return (
      this.props.field.values.map((item,i) => (
        <div className="checkbox-field" key={i}>

          <label className="form-check-label">
              <input className="form-check-input" type="checkbox"
                checked={item.checked}
                value={item.value}
                onChange={this.handleOnChange}
              /> {'\u00A0'}
              {item.name}
          </label>
        </div>

      ))
    );
  }


  render() {
    return (
      <div className="field-item">

        <button id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+CustomFieldTypes.LIST.icon}></i> {CustomFieldTypes.LIST.name}
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
export default ListField;
