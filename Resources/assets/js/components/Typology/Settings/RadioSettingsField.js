import React, {Component} from 'react';
import { render } from 'react-dom';

class RadioSettingsField extends Component {

  constructor(props) {
    super(props);

    this.state = {
        checkbox : false,
        value : null,
        display : false
    }

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  componentWillReceiveProps(nextProps){

    var checkbox = false;
    var display = false;
    var value = null;

    if(nextProps.field != null && nextProps.field[nextProps.source] != null &&
      nextProps.field[nextProps.source][nextProps.name] !== undefined){

      checkbox = nextProps.field[nextProps.source][nextProps.name] != null;
      display = true;
      value = nextProps.field[nextProps.source][nextProps.name];
    }

    this.setState({
      checkbox : checkbox,
      value : value,
      display : display
    });

  }

  handleFieldChange(event) {

    this.setState({
      checkbox : event.target.checked
    });

    if(!event.target.checked && this.state.value != null){

      var field = {
        name : this.props.name,
        source : this.props.source,
        value : null
      };

      this.props.onFieldChange(field);
    }

  }

  handleCheckboxChange(event) {
      console.log('=> handleCheckboxChange');
      console.log('value => ',event.target.value);

      this.setState({
          value : event.target.value
      });

      var field = {
        name : this.props.name,
        source : this.props.source,
        value : event.target.value
      };

      this.props.onFieldChange(field);
  }


  renderOptions() {

    var self = this;
    var value = this.state.value;

    return (
      this.props.options.map((item,i) => (
        <label className="form-check-label" key={i}>
            <input className="form-check-input" type="radio"
              checked={(value != null && value == item.value) ? true : false}
              name={self.props.name}
              value={item.value}
              onChange={self.handleCheckboxChange}
            /> {'\u00A0'}
            {item.name}
            {'\u00A0'}
            {'\u00A0'}
        </label>

      ))
    );
  }

  render() {

    const {checkbox,display,fields} = this.state;

    return (
      <div style={{display : display ? 'block' : 'none'}}>
        <div className="setup-field" >
          <div className="togglebutton">
            <label>
                <input type="checkbox"
                  name={this.props.name}
                  checked={checkbox}
                  onChange={this.handleFieldChange}
                />
                {this.props.label}
            </label>
          </div>

          <div className="setup-field-config" style={{display : checkbox ? "block" : "none" }}>
            <div className="form-group bmd-form-group">
              {this.renderOptions()}
            </div>
          </div>
        </div>
      </div>
    );
  }

}
export default RadioSettingsField;
