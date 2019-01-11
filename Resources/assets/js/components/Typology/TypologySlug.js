import React, {Component} from 'react';
import { render } from 'react-dom';

class TypologySlug extends Component {

  constructor(props){
    super(props);

    this.state = {
      checkbox : false,
      value : null,
      display : false
    }

  }

  componentWillReceiveProps(nextProps){

    console.log("TypologySlug :: componentWillReceiveProps",nextProps)

    var checkbox = false;
    var value = null;
    var display = false;

    //console.log("InputSettingsField :: componentWillRecieveProps");
    //console.log(nextProps);

    if(nextProps.field !== undefined && nextProps.field != null &&
      nextProps.field.slug !== undefined && nextProps.field.slug != null){

      checkbox = true;
      display = true;
      value = nextProps.field.slug;
    }

    this.setState({
      checkbox : checkbox,
      value : value,
      display : display
    });

  }

  handleFieldChange(event) {

    this.setState({
      checkbox : event.target.checked,
      display : event.target.checked
    });

    if(!event.target.checked && this.state.value != null){
      this.props.onFieldChange(null);
    }

  }

  handleInputChange(event) {

    var value = this.state.value;

    if(value == null)
      value = {};

    value[event.target.name] = event.target.value;

    this.setState({
      value : value
    });
    //console.log("handleInputChange => ", value);

    this.props.onFieldChange(value);

  }

  renderInputs()
  {
    var inputs = [];
    for(var key in this.props.translations){
        if(this.props.translations[key]){
          var value = this.state.value && this.state.value[key] ? this.state.value[key] : '';

          inputs.push(
              <div className="form-group bmd-form-group" key={key}>
                 <input type="text" className="form-control" placeholder={"Slug - "+key} name={key} value={value} onChange={this.handleInputChange.bind(this)} />
              </div>
          );
        }
    }

    return inputs;
  }

  render() {
    return (
      <div>
        <div className="togglebutton">
          <label>
              Accessible via URL
              <input type="checkbox" name="slug" checked={this.state.checkbox} onChange={this.handleFieldChange.bind(this)} />
          </label>
        </div>

        {this.state.display &&
          <div>
            {this.renderInputs()}
          </div>
        }
      </div>

    );
  }

}
export default TypologySlug;
