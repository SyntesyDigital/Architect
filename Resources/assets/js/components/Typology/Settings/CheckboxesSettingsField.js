import React, {Component} from 'react';
import { render } from 'react-dom';

class CheckboxesSettingsField extends Component {

  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.existInput = this.existInput.bind(this);

    this.state = {
      checkbox : null,
      fields : [],
      display : false
    };

  }

  componentWillReceiveProps(nextProps)
  {
    var checkbox = null;
    var display = false;
    var fields = [];

    if(nextProps.field != null 
        && nextProps.field[nextProps.source] != null 
        && nextProps.field[nextProps.source][nextProps.name] !== undefined)
    {
      checkbox = nextProps.field[nextProps.source][nextProps.name] != null;
      display = true;
      fields = nextProps.field[nextProps.source][nextProps.name];
    }

    this.setState({
        checkbox : checkbox,
        fields : fields,
        display : display
    });
  }

  handleFieldChange(event) {
    var field = {
        name : this.props.name,
        source : this.props.source,
        value : event.target.checked ? [] : null
    };

    this.props.onFieldChange(field);
  }

  handleCheckboxChange(event) {

    var fields = this.state.fields;

    console.log("CheckboxesSettingsField::handleFieldChange");
    console.log(event.target.value);

    if(event.target.checked){
      //add value
      if(!this.existInput(event.target.value)){
        fields.push(parseInt(event.target.value));
      }
    }
    else {
      //remove value
      this.removeValue(event.target.value,fields);
    }

    var field = {
      name : this.props.name,
      source : this.props.source,
      value : fields
    };

    //console.log("selectorSettingsField");
    //console.log(field);

    this.props.onFieldChange(field);

  }

  removeValue(value,fields) {

    for(var i = fields.length-1;i>=0;i--){
      if(fields[i] == value){
        fields.splice(i,1);
      }
    }

  }

  existInput(value) {

    //console.log("SelectorSettings : existInput : "+value);
    const fields = this.state.fields;

    if(fields == null){
      return false;
    }

    if(fields.indexOf(value) != -1){
      return true;
    }

    return false;
  }

  renderOptions() {

    return (
      this.props.options.map((item,i) => (
        <label className="form-check-label" key={i}>
            <input className="form-check-input" type="checkbox"
              checked={this.existInput(item.id)}
              value={item.id}
              onChange={this.handleCheckboxChange}
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
                  checked={ checkbox != null ? checkbox : false }
                  onChange={this.handleFieldChange}
                />
                {this.props.label}
            </label>
          </div>


          <div className="setup-field-config" style={{display : checkbox != null && checkbox ? "block" : "none" }}>

            <div className="form-group bmd-form-group">
              {this.renderOptions()}
            </div>
          </div>

        </div>
      </div>

    );
  }

}
export default CheckboxesSettingsField;
