import React, {Component} from 'react';
import { render } from 'react-dom';

class InputSettingsField extends Component {

  constructor(props) {
    super(props);

    var checkbox = null;
    var input = "";
    var display = false;

    this.state = {
      checkbox : checkbox,
      input : input,
      display : display
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  componentDidMount(){
    this.processProps(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.processProps(nextProps);
  }

  processProps(nextProps){
    var checkbox = null;
    var input = "";
    var display = false;

    //console.log("InputSettingsField :: componentWillRecieveProps");
    //console.log(nextProps);

    if(nextProps.field != null && nextProps.field[nextProps.source] != null &&
       nextProps.field[nextProps.source][nextProps.name] !== undefined){

      checkbox = nextProps.field[nextProps.source][nextProps.name] != null;
      display = true;

      input = nextProps.field[nextProps.source][nextProps.name];
    }

    this.setState({
      checkbox : checkbox,
      input : input,
      display : display
    });
  }

  handleFieldChange(event) {

    var field = {
      name : this.props.name,
      source : this.props.source,
      value : event.target.checked ? "" : null
    };

    this.props.onFieldChange(field);
  }

  handleInputChange(event) {

    var field = {
      name : this.props.name,
      source : this.props.source,
      value : event.target.value
    };

    this.props.onFieldChange(field);

  }

  render() {

    const {checkbox,input} = this.state;

    return (

      <div style={{display : this.state.display ? 'block' : 'none'}}>
        <div className="setup-field" >
          <div className="togglebutton">
            <label>
                <input type="checkbox"
                  name={this.props.name}
                  checked={ this.state.checkbox != null ? checkbox : false }
                  onChange={this.handleFieldChange}
                />
                {this.props.label}
            </label>
          </div>


          <div className="setup-field-config" style={{display : this.state.checkbox != null && this.state.checkbox ? "block" : "none" }}>
            <div className="form-group bmd-form-group">
               <label htmlFor="num" className="bmd-label-floating">{this.props.inputLabel}</label>
               <input type="text" name="" className="form-control" id="num" value={this.state.input} onChange={this.handleInputChange}/>
            </div>
          </div>

        </div>
      </div>

    );
  }

}
export default InputSettingsField;
