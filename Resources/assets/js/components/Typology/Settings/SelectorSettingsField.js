import React, {Component} from 'react';
import { render } from 'react-dom';

class SelectorSettingsField extends Component {

  constructor(props) {
    super(props);

    this.state = {
        value : '',
        display : false
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  componentDidMount()
  {
      var display = false;
      var value = "";

      if(this.props.field != null
          && this.props.field[this.props.source] != null
          && this.props.field[this.props.source][this.props.name] !== undefined)
      {
        display = true;
        if(this.props.field[this.props.source][this.props.name] != null ) {
            value = this.props.field[this.props.source][this.props.name];
        }
      }

      this.setState({
          value : value,
          display : display
      });
  }

  handleFieldChange(event) {

    var field = {
      name : this.props.name,
      source : this.props.source,
      value : event.target.value
    };

    this.props.onFieldChange(field);
  }


  componentWillReceiveProps(nextProps)
  {
      var display = false;
      var value = "";

      if(nextProps.field != null
          && nextProps.field[nextProps.source] != null
          && nextProps.field[nextProps.source][nextProps.name] !== undefined)
      {
        display = true;
        if(nextProps.field[nextProps.source][nextProps.name] != null ) {
            value = nextProps.field[nextProps.source][nextProps.name];
        }
      }

      this.setState({
          value : value,
          display : display
      });
  }


  renderOptions() {
    return (this.props.options.map((item,i) => (
        <option value={item.value} key={i}>{item.name}</option>
      ))
    );
  }

  render() {

    const {value,display} = this.state;

    console.log("SelectorSettingsValue => ",value);

    return (
      <div style={{display : display ? 'block' : 'none'}}>
        <div className="setup-field">

          <div className="togglebutton">
            <div>
              <label>{this.props.label}</label>
            </div>
          </div>

          <div className="setup-field-config">
            <div className="form-group bmd-form-group">
              <select className="form-control" name={this.props.name} value={value} onChange={this.handleFieldChange} >
                {this.renderOptions()}
              </select>
            </div>
          </div>

        </div>
      </div>
    );
  }

}
export default SelectorSettingsField;
