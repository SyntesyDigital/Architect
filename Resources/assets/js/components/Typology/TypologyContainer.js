import React, {Component} from 'react';
import { render } from 'react-dom';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper'

//import CustomFieldTypes from './../common/CustomFieldTypes';
import TypologyDropZone from './TypologyDropZone';
import TypologySidebar from './TypologySidebar';
import TypologyDragField from './TypologyDragField';
import TypologyModal from './TypologyModal';
import TypologyBar from './TypologyBar';

import axios from 'axios';

class TypologyContainer extends Component {

  constructor(props) {
     super(props);



     this.state = {
         typology : null,
         inputs: {
             name: "",
             identifier: "",
             icon: "",
             template: "",
             slug : null,
             categories: props.typology ? props.typology.has_categories : false,
             tags: props.typology ? props.typology.has_tags : false,
         },
         errors: {
             name: null,
             identifier: null,
             fields: null,
         },
         fields: [],
         settingsField: null,
         fieldsList: null
     };

     this.handleInputChange = this.handleInputChange.bind(this);
     this.moveField = this.moveField.bind(this);
     this.handleRemoveField = this.handleRemoveField.bind(this);
     this.handleFieldChange = this.handleFieldChange.bind(this);
     this.handleFieldAdded = this.handleFieldAdded.bind(this);
     this.handleOpenSettings = this.handleOpenSettings.bind(this);
     this.handleModalClose = this.handleModalClose.bind(this);
     this.handleSettingsChanged = this.handleSettingsChanged.bind(this);
     this.handleSubmitForm = this.handleSubmitForm.bind(this);
     this.onSaveError = this.onSaveError.bind(this);
     this.delete = this.delete.bind(this);
 }

 handleInputChange(field) {

     const inputs = this.state.inputs;

     var braket = field.name.match(/\[(.*?)\]/i);

     if(braket) { // Build field array from name slug[ca]
         var fieldName = field.name.replace(braket[0], "");
         var fieldKey = braket[1];

         if(inputs[fieldName] === undefined) {
             var obj = {};
             obj[fieldKey] = field.value;

             inputs[fieldName] = obj;
         } else {
             inputs[fieldName][fieldKey] = field.value;
         }
     } else {
         inputs[field.name] = field.value;
     }

     //console.log("TypologyContainer :: handleInputChange => ",inputs);

     this.setState({
         inputs: inputs
     });

 }

 handleFieldAdded(field) {

     const fields = this.state.fields;

     fields.push(field);

     this.setState({
         fields: fields
     });
 }

 moveField(dragIndex, hoverIndex) {
     const {
         fields
     } = this.state
     const dragField = fields[dragIndex]

     this.setState(
         update(this.state, {
             fields: {
                 $splice: [
                     [dragIndex, 1],
                     [hoverIndex, 0, dragField]
                 ],
             },
         }),
     )
 }

 handleRemoveField(fieldId) {

     const {
         fields
     } = this.state;

     for (var i = 0; i < fields.length; i++) {
         if (fieldId == fields[i].id) {
             fields.splice(i, 1);
             break;
         }
     }

     this.setState({
         fields: fields
     });

 }

 handleFieldChange(field) {
     const {
         fields
     } = this.state;

     for (var i = 0; i < fields.length; i++) {
         if (field.id == fields[i].id) {
            fields[i]["name"] = field.name;
            fields[i]["identifier"] = field.identifier;
             break;
         }
     }

     this.setState({
         fields: fields
     });

 }

 handleOpenSettings(fieldId) {

     const {
         fields
     } = this.state;

     for (var i = 0; i < fields.length; i++) {
         if (fieldId == fields[i].id) {
             this.setState({
                 settingsField: fields[i]
             });
         }
     }

     $("#settings-modal").css({
         display: "block"
     });
     TweenMax.to($("#settings-modal"), 0.5, {
         opacity: 1,
         ease: Power2.easeInOut
     });

 }


 handleSettingsChanged(field) {

     const settingsField = this.state.settingsField;

     settingsField[field.source][field.name] = field.value;

     const {fields} = this.state;

     if(field.name == "entryTitle" && field.value == true){
       for(var key in fields){
         var tempField = fields[key];
         if(tempField.settings != null && tempField.settings.entryTitle !== undefined){
           if(tempField.settings.entryTitle &&
             tempField.identifier != this.state.settingsField.identifier ){
             //reset value
             fields[key].settings.entryTitle = false;
           }
         }
       }
     }

     this.setState({
         fields : fields,
         settingsField: settingsField
     });
 }


 handleModalClose(e) {

     e.preventDefault();

     const {
         fields
     } = this.state;
     const settingsField = this.state.settingsField;

     for (var i = 0; i < fields.length; i++) {
         if (settingsField.id == fields[i].id) {
             fields[i] = settingsField;
             break;
         }
     }

     var self = this;

     TweenMax.to($("#settings-modal"), 0.5, {
         display: "none",
         opacity: 0,
         ease: Power2.easeInOut,
         onComplete: function() {
             self.setState({
                 settingsField: null,
                 fields: fields
             })
         }
     });

 }

     handleSubmitForm(e) {
         e.preventDefault();

         this.setState({
             errors :  {
                 name: null,
                 identifier: null,
                 fields: null,
             }
         });

         if(this.state.typology) {
             this.update();
         } else {
             this.create();
         }
     }

     getFormData() {

         return {
             has_slug : this.state.inputs.slug ? true : false,
             slug : this.state.inputs.slug,
             has_tags : this.state.inputs.tags,
             has_categories : this.state.inputs.categories,
             name : this.state.inputs.name,
             identifier : this.state.inputs.identifier,
             fields : this.state.fields,
             icon : this.state.inputs.icon.value ? this.state.inputs.icon.value : null,
             slug : this.state.inputs.slug
         };
     }

     create() {
         var _this = this;

         axios.post('/architect/typologies', this.getFormData())
            .then((response) => {
                if(response.data.success) {
                    _this.onSaveSuccess(response.data);

                    //console.log(response.data);

                    setTimeout(function(){
                        window.location.href = routes.showTypology.replace(':id',response.data.typology.id);
                    },1500);

                }
            })
            .catch((error) => {
                if (error.response) {
                    _this.onSaveError(error.response.data);
                } else if (error.message) {
                    toastr.error(error.message);
                } else {
                    console.log(Lang.get('fields.error'), error.message);
                }
                //console.log(error.config);
            });
     }

    delete()
    {
        var _this = this;

        axios.delete('/architect/typologies/' + this.state.typology.id + '/delete')
            .then((response) => {
                if(response.data.success) {
                    _this.onSaveSuccess(response.data);

                    window.location.href = routes['typologies'];
                }
            })
            .catch((error) => {
                if (error.response) {
                    _this.onSaveError(error.response.data);
                } else if (error.message) {
                    toastr.error(error.message);
                } else {
                    console.log('Error', error.message);
                }
            });
    }

    update() {
        var _this = this;

        axios.put('/architect/typologies/' + this.state.typology.id + '/update', this.getFormData())
             .then((response) => {
                 if(response.data.success) {
                     _this.onSaveSuccess(response.data);
                 }
             })
             .catch((error) => {
                 if (error.response) {
                     _this.onSaveError(error.response.data);
                 } else if (error.message) {
                     toastr.error(error.message);
                 } else {
                     console.log('Error', error.message);
                 }
                 //console.log(error.config);
             });
    }

     onSaveSuccess(response) {

          //set all fields to saved
          //console.log("onSaveSuccess => ",response);

          const fields = this.state.fields;

          for(var i=0;i<fields.length;i++){
            fields[i].saved = true;
          }

          console.log("TypologySaved : ",fields);

         this.setState({
             typology : response.typology,
             fields : fields
         })

         toastr.success(Lang.get('fields.success'));

     }

    onSaveError(response) {
        var _this = this;
        var errors = response.errors ? response.errors : null;
        var stateErrors = this.state.errors;

        if(errors) {
            Object.keys(stateErrors).map(function(k){
                stateErrors[k] = errors[k] ? true : false;

                if(errors[k]) {
                    toastr.error(errors[k]);
                }
            });

            this.setState({
                errors : stateErrors
            });
        }

        if(response.message) {
            toastr.error(response.message);
        }
    }

    renderFields() {

      var result = null;

      if(this.state.fieldsList){


        var fieldList = Object.keys(this.state.fieldsList).filter((k,i) =>
          k != "SLUG"
        );

        result = fieldList.map((k,i) =>
          <TypologyDragField definition={this.state.fieldsList[k]} key={i}/>
        )
      }

      return result;
    }


    render() {

        return (
          <div>

          <TypologyBar
            icon={this.state.inputs.icon}
            name={this.state.inputs.name}
            onSubmitForm={this.handleSubmitForm}
          />

          <DragDropContextProvider backend={HTML5Backend}>

            <div className="container rightbar-page">

              <TypologyModal
                field={this.state.settingsField}
                id="settings-modal"
                onModalClose={this.handleModalClose}
                onSettingsFieldChange={this.handleSettingsChanged}
              />

                <div className="col-md-9 page-content">
                  <TypologyDropZone
                    errors={this.state.errors}
                    created={this.state.typology !== undefined && this.state.typology != null}
                    fields={this.state.fields}
                    onFieldAdded={this.handleFieldAdded}
                    onFieldChanged={this.handleFieldChange}
                    moveField={this.moveField}
                    onRemoveField={this.handleRemoveField}
                    onSettingsFieldChange={this.handleSettingsChanged}
                    onOpenSettings={this.handleOpenSettings}
                  />
                </div>

                <TypologySidebar
                    fields={this.state.inputs}
                    errors={this.state.errors}
                    onFieldChange={this.handleInputChange}
                    deleteHandler={this.delete}
                    translations={this.props.translations}
                >

                {this.renderFields()}

                </TypologySidebar>

            </div>
          </DragDropContextProvider>

          </div>
      );
  }

}

// <TypologyDragField definition={CustomFieldTypes.TEXT}/>
// <TypologyDragField definition={CustomFieldTypes.RICH}/>
// <TypologyDragField definition={CustomFieldTypes.IMAGE}/>
// <TypologyDragField definition={CustomFieldTypes.DATE}/>
// <TypologyDragField definition={CustomFieldTypes.MAP}/>
// <TypologyDragField definition={CustomFieldTypes.IMAGES}/>
// <TypologyDragField definition={CustomFieldTypes.CONTENTS}/>
// <TypologyDragField definition={CustomFieldTypes.LIST}/>
// <TypologyDragField definition={CustomFieldTypes.BOOLEAN}/>
// <TypologyDragField definition={CustomFieldTypes.LINK}/>
// <TypologyDragField definition={CustomFieldTypes.VIDEO}/>

export default TypologyContainer;
