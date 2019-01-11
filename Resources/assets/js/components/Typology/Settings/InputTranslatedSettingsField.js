import React, {Component} from 'react';
import { render } from 'react-dom';

class InputTranslatedSettingsField extends Component {

  constructor(props) {
    super(props);

    var input = {};
    var display = false;

    this.state = {
      input : input,
      display : display
    };

    this.handleInputChange = this.handleInputChange.bind(this);

  }

  componentDidMount(){
    this.processProps(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.processProps(nextProps);
  }

  processProps(nextProps){
    var input = {};
    var display = false;

    //console.log("InputSettingsField :: componentWillRecieveProps");
    //console.log(nextProps);

    if(nextProps.field != null && nextProps.field[nextProps.source] != null &&
       nextProps.field[nextProps.source][nextProps.name] !== undefined){

      display = true;
      input = nextProps.field[nextProps.source][nextProps.name];
    }

    this.setState({
      input : input,
      display : display
    });
  }

  handleInputChange(language,event) {

    console.log("InputTranslatedSettingsField :: handleInputChange => ",language);
    const values = this.state.input !== undefined && this.state.input != null ? this.state.input : {};
    values[language] = event.target.value;

    var field = {
      name : this.props.name,
      source : this.props.source,
      value : values
    };

    this.props.onFieldChange(field);

  }

  renderInputs()
  {

    const value = this.state.input !== undefined && this.state.input != null ? this.state.input : null;

    var inputs = [];
    for(var key in this.props.translations){
        //if(this.props.translations[key]){
          var fieldValue = value != null && value[key] !== undefined ? value[key] : '';

          inputs.push(
              <div className={'form-group bmd-form-group'} key={key}>
                  <label htmlFor={this.props.name+"-"+key} className="bmd-label-floating">{this.props.inputLabel} - {key}</label>
                  <input id={this.props.name+"-"+key} type="text" className="form-control" language={key} name={this.props.name+"-"+key} value={fieldValue} onChange={this.handleInputChange.bind(this,key)} />
              </div>
          );
        //}
    }

    return inputs;
  }

  render() {

    const {input} = this.state;

    return (

      <div style={{display : this.state.display ? 'block' : 'none'}}>
        <div className="setup-field input-translated" >

          <div className="togglebutton">
            <label>
                {this.props.label}
            </label>
          </div>
          <div className="setup-field-config">
            {this.renderInputs()}
          </div>

        </div>

        <hr/>
        <br/>

      </div>

    );
  }

}
export default InputTranslatedSettingsField;
