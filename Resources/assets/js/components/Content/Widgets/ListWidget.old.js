import React, {Component} from 'react';
import { render } from 'react-dom';
import update from 'immutability-helper'
import ItemListDragField from './ItemListDragField';


class ListWidget extends Component
{
  constructor(props)
  {
    super(props);

    this.moveField = this.moveField.bind(this);
    this.handleEditField = this.handleEditField.bind(this);

    this.state = {
      fields : []
    };
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

      this.props.onFieldChange({
          identifier: this.props.field.identifier,
          value: result.value
      });

  }

  handleEditField(index) {

      // console.log('PROPS ====>', _this.props);

    const fields = this.props.field.value;
    var field = fields[index];
    // var field = null;
    // var index = -1;
    //
    // for (var i = 0; i < fields.length; i++) {
    //     if (fieldId == fields[i].id) {
    //         field = fields[i];
    //         index = i;
    //         break;
    //     }
    // }
    //
    // if(field == null){
    //     return;
    // }

    var editInfo = {
      identifier : this.props.field.identifier,
      field : field,
      index : index,
      type : 'list-item'
    };

    this.props.onListItemEdit(editInfo);
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

  exploteToObject(fields) {

    if(fields == null){
      return null;
    }

    var result = {};

    for(var i=0;i<fields.length;i++){
      result[fields[i]] = null;
    }
    return result;
  }

  onAddField(event) {

    event.preventDefault();

    var index = this.props.field.value !== undefined && this.props.field.value != null ? this.props.field.value.length : 0;

    var field = this.props.field;
    field.index = index;
    field.id = index;
    field.type = 'widget';

    // var field = {
    //     'index' : index,
    //     'id' : index,
    //     'class' : "Modules\Architect\Widgets\Types\TitleImage",
    //     'rules' : null,
    //     "label": "WIDGET",
    //     "name": "TITLE_IMAGE",
    //     "type": "widget",
    //     "icon": "fa-file-o",
    //     "fields" : [
    //         {
    //             "class" : 'Modules\Architect\Fields\Types\Text',
    //             "identifier" : "title",
    //             "type" : "text",
    //             "name" : "Títol",
    //         },{
    //             "class" : 'Modules\Architect\Fields\Types\Text',
    //             "identifier" : "slug",
    //             "type" : "text",
    //             "name" : "Slug"
    //         },{
    //             "class" : 'Modules\Architect\Fields\Types\Image',
    //             "identifier" : "image",
    //             "type" : "image",
    //             "name" : "Image"
    //         }
    //     ]
    //     //"settings": this.exploteToObject(['htmlId','htmlClass','cropsAllowed']),
    // };

    console.log('PROPS', this.props);

    this.props.onAddField(field);

  }

  renderInputs() {
     var fields = [];
     var _this = this;

     if(this.props.field.value !== undefined && this.props.field.value != null) {
         this.props.field.value.map(function(widget, i){
             fields.push(
                 <ItemListDragField
                    key = {widget.index}
                    index = {i}
                    id = {widget.index}
                    type = {widget.type}
                    label = {widget.name}
                    icon = {widget.icon}
                    name = {widget.title !== undefined && widget.title != null ? widget.title : ''}
                    moveField = {_this.moveField}
                    onEditField = {_this.handleEditField.bind(_this)}
                    onRemoveField = {_this.handleRemoveField.bind(_this)}
                />
             );
         });
     }

     return fields;
  }

  render() {

    return (
      <div className="field-item contents-field">

        <div>

          <div className="field-form fields-list-container">
            {this.renderInputs()}
          </div>

          <div className="add-content-button">
            <a href="" className="btn btn-default" onClick={this.onAddField.bind(this)}><i className="fa fa-plus-circle"></i> Afegir </a>
          </div>

        </div>

      </div>


      //click botton to add field of some type
        //create field from field type ( widget type )
        //add the field to array from layot, with no value
        //open modalEditListItem with widget field type to edit
          //edit is the same with no settigns intherited,
        //images and contents, got directly to layout, with pathToIndex,
          //and field array index


    );
  }

}
export default ListWidget;
