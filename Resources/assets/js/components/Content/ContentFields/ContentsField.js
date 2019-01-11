import React, {Component} from 'react';
import { render } from 'react-dom';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper'
import ContentsDragField from './ContentsDragField';

class ContentsField extends Component {

  constructor(props) {
     super(props);

     this.handleOnChange = this.handleOnChange.bind(this);
     this.moveField = this.moveField.bind(this);
     this.handleRemoveField = this.handleRemoveField.bind(this);
     this.onContentSelect = this.onContentSelect.bind(this);
 }

 componentDidMount(){

   if(this.props.field.value === undefined || this.props.field.value == null){
     //setup value if not yet defined
     var newField = {
         identifier: this.props.field.identifier,
         value: []
     };

     //this.props.onFieldChange(newField);
   }
 }

 moveField(dragIndex, hoverIndex) {

     const field = this.props.field;
     const dragField = field.value[dragIndex]

     var result = update(field, {
         value: {
             $splice: [
                 [dragIndex, 1],
                 [hoverIndex, 0, dragField]
             ],
         }
     });

     // console.log("\n\nResult value : ");
     // console.log(field.value);
     // console.log(result);

     this.props.onFieldChange({
         identifier: this.props.field.identifier,
         value: result.value
     });

 }

 handleRemoveField(fieldId) {

     const fields = this.props.field.value;

     if(fields) {
         for (var i = 0; i < fields.length; i++) {
             if (fieldId == fields[i].id) {
                 fields.splice(i, 1);
                 break;
             }
         }
     }

     var field = {
         identifier: this.props.field.identifier,
         value: fields
     };

     this.props.onFieldChange(field);

 }

 handleOnChange(event) {
     const language = $(event.target).closest('.form-control').attr('language');
     const value = this.props.field.value;
     value[language] = event.target.value;

     var field = {
         identifier: this.props.field.identifier,
         value: value
     };

     // console.log("textField :: handleOnChange ");
     // console.log(field);

     this.props.onFieldChange(field);
 }

 onContentSelect(event) {
     event.preventDefault();
     this.props.onContentSelect(this.props.field.identifier);
 }

 renderInputs() {
    var fields = [];
    var _this = this;

    if(this.props.field.value !== undefined && this.props.field.value != null) {
        this.props.field.value.map(function(content, i){
            fields.push(
                <ContentsDragField
                   key = {content.id}
                   index = {i}
                   id = {content.id}
                   type = {_this.props.field.type}
                   label = {content.typology !== undefined ? content.typology.name : null}
                   icon = {content.typology !== undefined ? content.typology.icon : 'fa-file-o'}
                   name = {content.title !== undefined && content.title != null ? content.title : ''}
                   moveField = {_this.moveField}
                   onRemoveField = {_this.handleRemoveField}  />
            );
        });
    }


    return fields;
 }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item contents-field">

        <button style={{display:(hideTab ? 'none' : 'block')}} id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+FIELDS.CONTENTS.icon}></i> {FIELDS.CONTENTS.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

          <div className="field-form fields-list-container">
          {this.renderInputs()}
          </div>


          <div className="add-content-button">
            <a href="" className="btn btn-default" onClick={this.onContentSelect}><i className="fa fa-plus-circle"></i> {Lang.get('fields.add')}  </a>
          </div>

        </div>

      </div>
    );
  }

}
export default ContentsField;
