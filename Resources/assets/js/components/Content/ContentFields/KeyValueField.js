import React, {Component} from 'react';
import { render } from 'react-dom';


const OPTIONS = ["Català","Español","Japanese","English","Français","Italian","Portuguese","Arabic","Czech","German","Chinese","Russian","Polish"];

class KeyValueField extends Component {

  constructor(props){
    super(props);

    /*
    this.state = {
      name : "",
      identifier : "",
      value : 0
    };
    */

    this.handleOnChange = this.handleOnChange.bind(this);

  }

  renderOptions() {
    return (OPTIONS.map((item,i) => (
        <option value={item} key={i+1}>{item}</option>
      ))
    );
  }

  handleOnChange(e) {

    this.props.onChangeField(e,this.props.index);

  }

  onRemoveField(e) {
    e.preventDefault();
    this.props.onRemoveField(this.props.index);
  }

  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    //console.log("keyValueField :: props => ",this.props);

    return (
      <div className="key-value-field row">
        <div className="col col-xs-4">
          <div className="form-group bmd-form-group">
            <select className="form-control" name="name" value={this.props.name} onChange={this.handleOnChange} >
              <option value="" key={0}>---</option>
              {this.renderOptions()}
            </select>
          </div>
        </div>

        <div className="col col-xs-4">
          <div className="form-group bmd-form-group">
            <input type="text" className="form-control" name="identifier" value={this.props.identifier} onChange={this.handleOnChange} placeholder="Clau" />
          </div>
        </div>

        <div className="col col-xs-3">
          <div className="form-group bmd-form-group">
            <input type="number" className="form-control" name="value" value={this.props.value} onChange={this.handleOnChange} />
          </div>
        </div>

        <div className="col col-xs-1 field-actions">
          <a href="" className="remove-field-btn text-danger" onClick={this.onRemoveField.bind(this)}> <i className="fa fa-trash"></i></a>
					&nbsp;&nbsp;
        </div>

      </div>
    );
  }

}
export default KeyValueField;
