import React, {Component} from 'react';
import { render } from 'react-dom';
import KeyValueField from './KeyValueField';

class KeyValuesField extends Component {

  constructor(props){
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleRemoveField = this.handleRemoveField.bind(this);
  }

  componentDidMount(){
      //console.log('KeyValues =>', this.props.field);

    if(this.props.field.value === undefined || this.props.field.value == null || Object.keys(this.props.field.value).length == 0){
      //setup value if not yet defined
      var newField = {
          identifier: this.props.field.identifier,
          value: []
      };

      this.props.onFieldChange(newField);

      //console.log('componentDidMount =>', this.props.field);

    }
  }

  handleOnChange(e,index) {

      const field = this.props.field;

      field.value[index][e.target.name] = e.target.value;

      //console.log("KeyValuesField :: handleOnChange => ",e,index);

      this.props.onFieldChange(field);
  }

  handleRemoveField(index) {

    //console.log("KeyValuesField :: handleRemoveField => ",index);

      const fields = this.props.field.value;

      fields.splice(index,1);

      this.props.onFieldChange({
          identifier : this.props.field.identifier,
          value : fields
      });

  }


  renderInputs() {


    if(this.props.field.value === undefined || this.props.field.value == null || Object.keys(this.props.field.value).length === 0){
      return;
    }

    console.log("KeyValuesField => ",this.props.field.value);

    const images = this.props.field.value;

    return (
			images.map((item, i) => (
  					<KeyValueField
              key={i}
  						index = {i}
              name = {item.name}
              identifier = {item.identifier}
              value = {item.value}
              onChangeField={this.handleOnChange}
              onRemoveField={this.handleRemoveField}
  					/>
				))
		);

  }

  onAddItem(e){
    e.preventDefault();

    //console.log("KeyValuesField :: on AddItem");

    const field = this.props.field;

    field.value.push({
      name : "",
      key : "",
      value : 0
    });

    this.props.onFieldChange(field);
  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item contents-field images-field">

        <button style={{display:(hideTab ? 'none' : 'block')}}  id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+ FIELDS.KEY_VALUES.icon}></i> {FIELDS.KEY_VALUES.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

            <div className="field-form fields-list-container images-form">
                {this.renderInputs()}
            </div>

            <div className="add-content-button">
               <a href="#" className="btn btn-default" onClick={this.onAddItem.bind(this)}><i className="fa fa-plus-circle"></i>  {Lang.get('fields.add')} </a>
            </div>

        </div>

      </div>
    );
  }

}
export default KeyValuesField;
