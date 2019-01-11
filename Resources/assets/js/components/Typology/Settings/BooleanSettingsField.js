import React, {Component} from 'react';
import { render } from 'react-dom';

class BooleanSettingsField extends Component {

  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(event) {
    var field = {
      name : event.target.name,
      source : this.props.source,
      value : event.target.checked
    };

    this.props.onFieldChange(field);

  }

  render() {

    var display = false;
    var checkbox = null;
    if(this.props.field != null && this.props.field[this.props.source] != null &&
       this.props.field[this.props.source][this.props.name] !== undefined){
      checkbox = this.props.field[this.props.source][this.props.name];
      display = true;
    }

    return (
      <div className="setup-field" style={{display : display ? "block":"none"}}>
        <div className="togglebutton">
          <label>
              <input
                type="checkbox"
                name={this.props.name}
                checked={  checkbox != null  ? checkbox : false }
                onChange={this.handleFieldChange}
              />
              {this.props.label}
          </label>
        </div>
      </div>
    );
  }

}
export default BooleanSettingsField;
