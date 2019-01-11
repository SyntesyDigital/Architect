import React, {Component} from 'react';
import { render } from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class DateField extends Component {

  constructor(props){
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }


  handleOnChange(date) {

    var field = {
      identifier : this.props.field.identifier,
      value : date
    };

    this.props.onFieldChange(field);
  }

  renderInputs() {

      var error = this.props.errors && this.props.errors[this.props.field.identifier] ? true : false;

    return (
      <div className={'form-group bmd-form-group ' + (error ? 'has-error' : null)} >
         <label htmlFor={this.props.field.identifier} className="bmd-label-floating">{this.props.field.name}</label>

         <DatePicker
             className="form-control"
             selected={ this.props.field.value ? moment(this.props.field.value) : null }
             onChange={this.handleOnChange}
             showTimeSelect
             timeFormat="HH:mm"
             timeIntervals={15}
             dateFormat="DD/MM/YYYY HH:mm"
             timeCaption={Lang.get('fields.hour')}
             locale="ca-es"
         />

      </div>
    );
  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item">

        <button style={{display:(hideTab ? 'none' : 'block')}}  id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+FIELDS.DATE.icon}></i> {FIELDS.DATE.name}
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
export default DateField;
