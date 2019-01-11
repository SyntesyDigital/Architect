import React, {Component} from 'react';
import { render } from 'react-dom';

// CONTENT FIELDS
import TextField from './../ContentFields/TextField';
import RichTextField from './../ContentFields/RichTextField';
import ImageField from './../ContentFields/ImageField';
import DateField from './../ContentFields/DateField';
import ImagesField from './../ContentFields/ImagesField';
import ListField from './../ContentFields/ListField';
import ContentsField from './../ContentFields/ContentsField';
import BooleanField from './../ContentFields/BooleanField';
import LinkField from './../ContentFields/LinkField';
import VideoField from './../ContentFields/VideoField';
import LocalizationField from './../ContentFields/LocalizationField';
import FileField from './../ContentFields/FileField';
import TranslatedFileField from './../ContentFields/TranslatedFileField';


// WIDGETS LIST
import CommonWidget from './../Widgets/CommonWidget';
import ListWidget from './../Widgets/ListWidget';
import TitleImageWidget from './../Widgets/TitleImageWidget';


import InputSettingsField from './../../Typology/Settings/InputSettingsField';
import RadioSettingsField from './../../Typology/Settings/RadioSettingsField';
import CheckboxesSettingsField from './../../Typology/Settings/CheckboxesSettingsField';
import SelectorSettingsField from './../../Typology/Settings/SelectorSettingsField';
import InputTranslatedSettingsField from './../../Typology/Settings/InputTranslatedSettingsField';
import BooleanSettingsField from './../../Typology/Settings/BooleanSettingsField';


import ModalEditListItem from './ModalEditListItem';

import axios from 'axios';

class ModalEditItem extends Component {




  /*
    listItemInfo = {
      identifier : this.props.field.identifier,
      field : field,
      index : index //fields array index,
      type : 'list-item'
    };
  */
  constructor(props){
    super(props);

    this.widgets = {
        CommonWidget: CommonWidget,
        TitleImageWidget: TitleImageWidget
    };

    // console.log(" ModalEditItem :: construct ",props);

    this.state = {
        field : null,
        displayListItemModal : false,
        listItemInfo : null,
        programs : [],
        axes : [],
        categories : [{
          value:'',
          name:'----'
        }],
        originalCategories : []
    };

    this.TYPOLOGIES = [{
          id:'',
          name:'----'
        }
    ];

    this.SELECTABLE_TYPOLOGIES = [{
          id:'',
          name:'----'
        }
    ];
    this.LISTABLE_TYPOLOGIES = [{
          id:'',
          name:'----'
        }
    ];
    const selectableArray = [4,6,7,14];
    const nonSelectableTypologies = [1];

    for(var key in TYPOLOGIES){
      if(selectableArray.indexOf(parseInt(TYPOLOGIES[key].id)) != -1){
        this.SELECTABLE_TYPOLOGIES.push(TYPOLOGIES[key]);
      }
    }

    for(var key in TYPOLOGIES){
      if(nonSelectableTypologies.indexOf(parseInt(TYPOLOGIES[key].id)) == -1){
        this.LISTABLE_TYPOLOGIES.push(TYPOLOGIES[key]);
      }
    }

    for(var key in TYPOLOGIES){
      this.TYPOLOGIES.push(TYPOLOGIES[key]);
    }

    console.log("ModalEditItem ::  typologies => ",this.SELECTABLE_TYPOLOGIES);

    this.onModalClose = this.onModalClose.bind(this);
  }

  loadAxes() {
    var self = this;

    axios.get(ASSETS+'externalapi/axes')
      .then(function (response) {

          if(response.status == 200
              && response.data.data !== undefined
              && response.data.data.length > 0)
          {
              self.setState({
                  axes : response.data.data
              });
          }


      }).catch(function (error) {
         console.log(error);
       });
  }



  loadPrograms() {
    var self = this;

    axios.get(ASSETS+'externalapi/programs')
      .then(function (response) {

          if(response.status == 200
              && response.data.data !== undefined
              && response.data.data.length > 0)
          {

              response.data.data.unshift({
                "id": '',
          			"description_es": Lang.get('modals.without_program'),
              });

              self.setState({
                  programs : response.data.data
              });
          }


      }).catch(function (error) {
         console.log(error);
       });
  }

  loadCategories() {

    var self = this;


    axios.get(ASSETS+'api/categories/tree?accept_lang=es')
      .then(function (response) {
          if(response.status == 200
              && response.data.data !== undefined
              && response.data.data[0].descendants.length > 0)
          {

            console.log("original categories => ",response.data.data);

            var categories = [{
              value:'',
              name:'----'
            }];

            self.push_categories(response.data.data, 0,categories);

            self.setState({
              originalCategories : response.data.data,
              categories : categories
            });

          }

      }).catch(function (error) {
         console.log(error);
       });

  }
  printSpace(level)
 {

   if(level <= 1)
     return '';

   var spaces = [];
   for(var i=1;i<level;i++){
     spaces.push(
       "- "
     );
   }

   return spaces;
 }

 push_categories(categories_from, level, categories_to){
   level++;
   for (var i = 0; i< categories_from.length; i++ ){
        categories_to.push({
          value: categories_from[i].id,
          name: this.printSpace(level)+categories_from[i].name,
        });
       if(categories_from[i].descendants.length > 0){
          this.push_categories(categories_from[i].descendants,level, categories_to);
       }
   }

 }

  processProps(props) {

    console.log("ModalEditItem :: field processProps ",props);

    var field = JSON.parse(JSON.stringify(props.item.data.field));
    field.identifier = "temp_"+JSON.stringify(props.item.pathToIndex);
    field.value = props.item.data.field !== undefined &&
      props.item.data.field.value !== undefined ? props.item.data.field.value : null;

    //
    console.log("ModalEditItem :: field after process : ",field);

    return field;
  }

  componentDidMount() {
    if(this.props.display){
        this.modalOpen();
    }

    this.loadAxes();
    this.loadPrograms();
    this.loadCategories();

  }

  componentWillReceiveProps(nextProps)
  {
    var field = null;
    var categories = null;

    if(nextProps.display){
        this.modalOpen();
        field = this.processProps(nextProps);

        //update categories
        console.log("componentWillReceiveProps :: field => ",field);

        if(field.settings !== undefined && field.settings.typology !== undefined
          && field.settings.typology != null){

          console.log("Typology vale => ",field.settings.typology);
          categories = this.updateCategoriesFromTypology(field.settings.typology);
        }
        else {
          categories = this.updateCategoriesFromTypology(null);
        }

    } else {
        this.modalClose();
    }

    if(categories != null){
      this.setState({
        field : field,
        categories : categories
      });
    }
    else {
      this.setState({
        field : field
      });
    }
  }

  onModalClose(e){
      e.preventDefault();
      this.props.onItemCancel();
  }

  modalOpen() {
    TweenMax.to($("#modal-edit-item"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
  }

  modalClose() {
    var self =this;
      TweenMax.to($("#modal-edit-item"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){
        /*
        self.setState({
          field : null
        });
        */
      }});
  }

  onFieldChange(field) {

    //console.log("ModalEditItem :: onFieldChange => ",field);

    var stateField = this.state.field;
    stateField.value = field.value;
    this.setState({
        field : stateField
    });

    this.props.onUpdateData(stateField);

  }

  onWidgetChange(field) {

    var stateField = this.state.field;
    stateField.fields = field.fields;
    this.setState({
        field : stateField
    });

    this.props.onUpdateData(stateField);

  }

  onWidgetContentSelect(identifier) {

    console.log("ModalEditItem :: onWidgetContentSelect",identifier);

    var self = this;

    const fields = this.state.field.fields;
    const index = this.getFieldArrayIndex(fields,identifier);

    if(index == -1){
        console.error("ModalEditItem :: id not found : ",fields,identifier);
        return;
    }

    this.props.onContentSelect(identifier, function (field, content){

      console.log("ModalEditItem :: current field => ",field);

      field.fields[index] = self.processContentField(field.fields[index],content);

      return field;

    },fields[index]);

  }

  processContentField(field,content) {

    switch (field.type) {

      case FIELDS.LINK.type:
        if(field.value == null || field.value == ""){
          field.value = {};
        }
        else if(field.value.url !== undefined){
          delete field.value['url'];
        }
        field.value.content = content;

        return field;

      case FIELDS.URL.type:
        if(field.value == null || field.value == ""){
          field.value = {};
        }
        else if(field.value.url !== undefined){
          delete field.value['url'];
        }
        field.value.content = content;

        return field;

      case FIELDS.CONTENTS.type:

        if(field.value === undefined || field.value == null){
          field.value = [];
        }

        field.value.push(content);

        return field;
    }

  }

  handleListContentSelect(identifier) {

    var self = this;
    const {listItemInfo} = this.state;

    const fields = this.state.field.value[listItemInfo.index].fields;
    const index = this.getFieldArrayIndex(fields,identifier);

    if(index == -1){
        console.error("ModalEditItem :: id not found : "+identifier);
        return;
    }

    console.log("ModalEditItem :: handleListContentSelect => ",fields,index);

    this.props.onContentSelect(identifier, function (field, content){

      field.value[listItemInfo.index].fields[index] = self.processContentField(
        field.value[listItemInfo.index].fields[index],
        content
      );

      return field;

    },fields[index]);

  }

  getFieldArrayIndex(fields, identifier) {

    for(var i=0;i<fields.length;i++){
      if(fields[i].identifier == identifier){
        return i;
      }
    }



    return -1;

  }

  onTranslatedFileSelect(field,language) {

    console.log("ModalEditItem :: onTranslatedFileSelect => ",field,language);

    var self = this;

    this.props.onImageSelect(field, function (field, media){

      if(field.value === undefined || field.value == null ){
        field.value = {};
      }

      field.value[language] = media;
      return field;

    });

  }

  onWidgetImageSelect(field,language) {

    console.log("ModalEditItem :: onWidgetImageSelect => ",field,language);
    var self = this;

    const fields = this.state.field.fields;
    const index = this.getFieldArrayIndex(fields,field.identifier);

    if(index == -1){
        console.error("ModalEditItem :: id not found : "+field.identifier);
        return;
    }

    if(language !== undefined){

      //es un campo con localización
      this.props.onImageSelect(field, function (field, media){

        if(field.fields[index].value === undefined || field.fields[index].value == null ){
          field.fields[index].value = {};
        }

        field.fields[index].value[language] = media;
        //console.log("ModalEditItem :: Field after => ",field);
        return field;

      });
    }
    else {

      //es un campo image o file sin localización
      this.props.onImageSelect(field, function (field, media){

        field.fields[index].value = media;
        return field;

      });
    }
  }

  handleListImageSelect(field,language) {

    const {listItemInfo} = this.state;

    const fields = this.state.field.value[listItemInfo.index].fields;
    const index = this.getFieldArrayIndex(fields,field.identifier);

    if(index == -1){
        console.error("ModalEditItem :: id not found : "+identifier);
        return;
    }

    console.log("ModalEditItem :: handleListImageSelect => ",fields,index);

    if(language !== undefined){

      this.props.onImageSelect(field, function (field, media){

        if(field.value[listItemInfo.index].fields[index].value === undefined ||
          field.value[listItemInfo.index].fields[index].value == null ){

          field.value[listItemInfo.index].fields[index].value = {};
        }

        field.value[listItemInfo.index].fields[index].value[language] = media;
        console.log("ModalEditItem :: onImageSelect :: Field after => ",field,language);

        return field;

      });
    }
    else {

      this.props.onImageSelect(field, function (field, media){

        field.value[listItemInfo.index].fields[index].value = media;
        return field;

      });

    }

  }

  onSubmit(e) {
    e.preventDefault();
    const field = this.state.field;
    this.props.onSubmitData(field);
  }

  onAddListField(field) {
    this.props.onAddField(field);
  }

  onRemoveListField(index) {
    this.props.onRemoveField(index);
  }

  renderField() {

    console.log("ModalEditItem : renderField => ",this.state.field);

    switch(this.state.field.type) {
      case FIELDS.TEXT.type:
        return (
          <TextField
            //errors={_this.props.errors[k]}
            field={this.state.field}
            hideTab={true}
            translations={this.props.translations}
            onFieldChange={this.onFieldChange.bind(this)}

          />
        );
      case FIELDS.RICHTEXT.type:
        return (
          <RichTextField
            //errors={_this.props.errors[k]}
            field={this.state.field}
            hideTab={true}
            translations={this.props.translations}
            onFieldChange={this.onFieldChange.bind(this)}

          />
        );
        case FIELDS.IMAGE.type:
          return (
            <ImageField
                //errors={_this.props.errors[k]}
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onImageSelect={this.props.onImageSelect}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );
        case FIELDS.FILE.type:
          return (
            <FileField
                //errors={_this.props.errors[k]}
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onImageSelect={this.props.onImageSelect}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );
        case FIELDS.TRANSLATED_FILE.type:
          return (
            <TranslatedFileField
                //errors={_this.props.errors[k]}
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFileSelect={this.onTranslatedFileSelect.bind(this)}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );
        case FIELDS.DATE.type:
          return (
            <DateField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );
        case FIELDS.IMAGES.type:
          return (
            <ImagesField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
                onImageSelect={this.props.onImageSelect}
            />
          );
        case FIELDS.CONTENTS.type:
          return (
            <ContentsField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
                onContentSelect={this.props.onContentSelect}
            />
          );
        case FIELDS.BOOLEAN.type:
          return (
            <BooleanField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );
        case FIELDS.LINK.type:
          return (
            <LinkField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
                onContentSelect={this.props.onContentSelect}
            />
          );

        case FIELDS.VIDEO.type:
          return (
            <VideoField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );
        case FIELDS.LOCALIZATION.type:
          return (
            <LocalizationField
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onFieldChange={this.onFieldChange.bind(this)}
            />
          );



        case "widget":
            const Widget = this.widgets[this.state.field.component || 'CommonWidget'];
            return <Widget
                field={this.state.field}
                hideTab={true}
                translations={this.props.translations}
                onWidgetChange={this.onWidgetChange.bind(this)}
                onContentSelect={this.onWidgetContentSelect.bind(this)}
                onImageSelect={this.onWidgetImageSelect.bind(this)}
            />

        case "widget-list":

          return (
            <ListWidget
              field={this.state.field}
              hideTab={true}
              translations={this.props.translations}
              onFieldChange={this.onFieldChange.bind(this)}
              onAddField={this.onAddListField.bind(this)}
              onRemoveField={this.onRemoveListField.bind(this)}
              onListItemEdit={this.handleListItemEdit.bind(this)}
            />
          );

      default :
        return null;
    }
  }


  /**************** MODAL LIST *******************/

  handleListItemEdit(editInfo) {

    console.log("ModalEditItem :: handleListItemEdit :: editInfo => ",editInfo);

    this.setState({
      displayListItemModal : true,
      listItemInfo : editInfo
    });

  }

  handleListItemCancel() {

    this.setState({
      displayListItemModal : false,
      listItemInfo : null
    });

  }

  handleSubmitListItem(field) {

    var stateField = this.state.field;

    stateField.value[this.state.listItemInfo.index] = field;

    console.log("ModalEditItem :: handleSubmitListItem :: listItemInfo => ",this.state.listItemInfo);
    console.log("ModalEditItem :: handleSubmitListItem => ",stateField);

    this.setState({
        field : stateField,
        displayListItemModal : false,
        listItemInfo : null
    });

    //Iniclamente comentado



    this.props.onUpdateData(stateField);
  }

  handleListItemChange(field) {

    var stateField = this.state.field;
    const {listItemInfo} = this.state;

    stateField.value[this.state.listItemInfo.index] = field;

    //update the field used to comunicate between the ListWidget and the Modal
    listItemInfo.field = field;

    console.log("ModalEditItem :: handleListItemChange :: listItemInfo => ",this.state.listItemInfo);
    console.log("ModalEditItem :: handleListItemChange => ",stateField);

    this.setState({
        field : stateField,
        listItemInfo : listItemInfo
    });



    this.props.onUpdateData(stateField);
  }

  handleImageSelect(field) {
    //console.log("ModalEditItem :: handleImageSelect => ",field);

    this.props.onImageSelect(this.state.listItemInfo);
  }

  handleContentSelect(field) {
    //console.log("ModalEditItem :: handleContentSelect => ",field);

    this.props.onContentSelect(this.state.listItemInfo);
  }


  /*************** SETTINGS **********************/

  updateCategoriesFromTypology(typologyId) {

    const {originalCategories,categories} = this.state;

    var resultCategories = [{
      value:'',
      name:'----'
    }];

    if(typologyId === undefined || typologyId == null){
      this.push_categories(originalCategories, 0,resultCategories);
      //console.log("updateCategoriesFromTypology :: resultCategories : ",resultCategories);
      return resultCategories;
    }

    //console.log("updateCategoriesFromTypology :: original : ",originalCategories);

    //FIXME this relation should come from the BBDD
    var correspondance = {
      "2" : 0,
      "3" : 1,
      "8" : 2,
      "4" : 3,
      //"11" : 4
    };

    var index = correspondance[typologyId] !== undefined ? correspondance[typologyId] : null ;

    if(index != null){
      this.push_categories(originalCategories[index].descendants, 0,resultCategories);
      //console.log("updateCategoriesFromTypology :: resultCategories : ",resultCategories);
    }

    return resultCategories;

  }

  handleFieldSettingsChange(field) {

      console.log("ModalEditItem :: handleFieldSettingsChange => ", field);

      const stateField = this.state.field;

      stateField[field.source][field.name] = field.value;

      if(field.name == "typology"){
        this.setState({
            field : stateField,
            categories : this.updateCategoriesFromTypology(field.value)
        });

      }
      else {
        this.setState({
            field : stateField
        });
      }


  }

  getCropsformats() {
      var formats = [];
      IMAGES_FORMATS.map(function(format, k){
          formats.push({
              name : format.name+" ("+format.width+"x"+format.height+")",
              value : format.name
          });
      });

      return formats;
  }






  renderSettings() {

    //console.log("renderSettings!",this.state.field);

    return (
      <div>

        <h6>{Lang.get('modals.configuration')}</h6>

        <InputTranslatedSettingsField
          field={this.state.field}
          name="title"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.title')}
          inputLabel={Lang.get('modals.indica_title')}
          translations={this.props.translations}
        />



        <InputSettingsField
          field={this.state.field}
          name="htmlId"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label="Html ID"
          inputLabel={Lang.get('modals.indica_html')}
        />

        <InputSettingsField
          field={this.state.field}
          name="htmlClass"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label="Html Class"
          inputLabel={Lang.get('modals.indica_css')}
        />

        <RadioSettingsField
          field={this.state.field}
          name="cropsAllowed"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.sizes_allowed')}
          options={this.getCropsformats()}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="typologyAllowed"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.tipology_allowed')}
          options={this.TYPOLOGIES.map(function(obj){
              return {
                  value: obj.id,
                  name: obj.name
              };
          })}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="typology"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.typology_allowed')}
          options={this.LISTABLE_TYPOLOGIES.map(function(obj){
              return {
                  value: obj.id,
                  name: obj.name
              };
          })}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="selectableTypology"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.tipology')}
          options={this.SELECTABLE_TYPOLOGIES.map(function(obj){
              return {
                  value: obj.id,
                  name: obj.name
              };
          })}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="program"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.program')}
          options={this.state.programs.map(function(obj){
              return {
                  value: obj.id,
                  name: obj.description_es
              };
          })}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="axe"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.axe')}
          options={this.state.axes.map(function(item){
              return {
                  value: item.id,
                  name: item.description_es,
              };
          })}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="category"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.category')}
          options={this.state.categories}
        />

        <InputSettingsField
          field={this.state.field}
          name="maxItems"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.max_elements')}
          inputLabel={Lang.get('modals.indica_max_elements')}
        />

        <InputSettingsField
          field={this.state.field}
          name="itemsPerPage"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.max_elements_page')}
          inputLabel={Lang.get('modals.indica_max_elements_page')}
        />

        <InputSettingsField
          field={this.state.field}
          name="textIdentifier"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.search_field')}
          inputLabel={Lang.get('modals.indica_tipology_text_identifier')}
        />

        <InputSettingsField
          field={this.state.field}
          name="dateIdentifier"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.date_field')}
          inputLabel={Lang.get('modals.indica_tipology_date_identifier')}
        />

        <BooleanSettingsField
          field={this.state.field}
          name="extended"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.extended_version')}
        />

        <SelectorSettingsField
          field={this.state.field}
          name="columns"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.list_columns')}
          options={[
              {
                  value: "",
                  name: "---",
              },
              {
                  value: "col-1",
                  name: "1 "+Lang.get('modals.column'),
              },
              {
                  value: "col-2",
                  name: "2 "+Lang.get('modals.columns'),
              },
              {
                  value: "col-3",
                  name: "3 "+Lang.get('modals.columns'),
              },
              {
                  value: "col-4",
                  name: "4 "+Lang.get('modals.columns'),
              }
          ]}
        />

        <InputSettingsField
          field={this.state.field}
          name="height"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.height')}
          inputLabel={Lang.get('modals.indica_height')}
        />

      </div>


    );


  }



  render() {

    //console.log("ModalEditItem :: render field => ",this.state.field);

    return (
      <div>

        <ModalEditListItem
          display={this.state.displayListItemModal}
          item={this.state.listItemInfo}
          translations={this.props.translations}
          onItemCancel={this.handleListItemCancel.bind(this)}

          onSubmitData={this.handleSubmitListItem.bind(this)}
          onImageSelect={this.handleListImageSelect.bind(this)}
          onContentSelect={this.handleListContentSelect.bind(this)}
          onUpdateData={this.handleListItemChange.bind(this)}
          zIndex={9500}
        />


        <div className="custom-modal" id="modal-edit-item" style={{zIndex:this.props.zIndex}}>
          <div className="modal-background"></div>


            <div className="modal-container">

              {this.state.field != null &&
                <div className="modal-header">

                    <i className={"fa "+this.state.field.icon}></i>
                    <h2>{this.state.field.name} | {Lang.get('modals.edition')}</h2>

                  <div className="modal-buttons">
                    <a className="btn btn-default close-button-modal" onClick={this.onModalClose}>
                      <i className="fa fa-times"></i>
                    </a>
                  </div>
                </div>
              }

              <div className="modal-content">
                <div className="container">
                  <div className="row">
                    <div className="col-xs-8 field-col">

                      {this.state.field != null &&
                        this.renderField()}

                    </div>
                    <div className={"col-xs-4 settings-col "+(architect.currentUserHasRole('author') ? "disabled":"")}>
                      {this.renderSettings()}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <a href="" className="btn btn-default" onClick={this.onModalClose}> {Lang.get('modals.cancel')} </a> &nbsp;
                  <a href="" className="btn btn-primary" onClick={this.onSubmit.bind(this)}> {Lang.get('modals.accept')} </a> &nbsp;
                </div>

              </div>
          </div>
        </div>
      </div>
    );
  }

}
export default ModalEditItem;
