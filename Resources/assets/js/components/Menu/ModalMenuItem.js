import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// CONTENT FIELDS
import LinkField from './../Content/ContentFields/LinkField';
import ContentSelectModal from './../Content/ContentSelectModal';
import InputSettingsField from './../Typology/Settings/InputSettingsField';

import axios from 'axios';

export default class ModalMenuItem extends Component {

  constructor(props){
    super(props);

    this.state = {
      editing : false,
      itemId : null,
      field : null,
      displayContentModal: false,
    };

    var self = this;

    this.translations = {};
    LANGUAGES.map(function(language){
        self.translations[language.iso] = true;
    });

    this.onModalClose = this.onModalClose.bind(this);
  }

  initFields()
  {

      var field = {
          id:0,
          identifier:"link",
          value:{},
          name:"Enllaç",
          type:"link",
          settings:{htmlId:null,htmlClass:null}
      };

      this.setState({
          field : field,
          editing : false,
          itemId : null,
      });
  }

  read(field,itemId) {
    console.log("ModalMenuItem :: read => ",JSON.parse(field),itemId);

    this.setState({
      field : JSON.parse(field),
      itemId : itemId,
      editing : true
    });
  }

  componentDidMount() {
    if(architect.menu.form !== undefined) {
        architect.menu.form._editModal = this;
    }
  }

  onModalClose(e){
      e.preventDefault();
      this.modalClose();
  }

  modalOpen(field,itemId) {

    console.log("itemID => ",itemId);

    if(field != null){
      this.read(field,itemId);
    }
    else {
      this.initFields();
    }

    TweenMax.to($("#modal-edit-menu"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
  }

  modalClose() {
    var self =this;

    TweenMax.to($("#modal-edit-menu"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){

      self.setState({
        field : null,
        itemId : null,
        editing : false
      });

    }});
  }

  onFieldChange(field) {

    console.log("ModalMenuItem :: onFieldChange => ",field);

    var stateField = this.state.field;
    stateField.value = field.value;
    this.setState({
        field : stateField
    });

    //this.props.onUpdateData(stateField);

  }

  onSubmit(e) {
    e.preventDefault();
    const field = this.state.field;

    var _this = this;

    if(this.state.editing) {
        this.update();
    } else {
        this.create();
    }
  }

  getFormData()
  {
      return {
          field : this.state.field
      };
  }

  create()
  {
      architect.menu.form.createItem(this.state.field);
      this.modalClose();
  }

  update()
  {
    architect.menu.form.updateItem(this.state.field,this.state.itemId);
    this.modalClose();
  }

  /**************** CONTENT MODAL ********************/

  handleContentSelected(content){
      this.updateContent(content);
  }

  updateContent(content){

    var self = this;
    var layout = this.props.layout;
    var field = this.state.field;

    if(field.value == null){
      field.value = {};
    }
    else if(field.value.url !== undefined){
      delete field.value['url'];
    }

    field.value.content = content;

    this.setState({
      field : field,
      displayContentModal : false
    });

  }

  handleContentSelect(){
    this.setState({
      displayContentModal : true
    });
  }

  handleContentCancel(){
    this.setState({
      displayContentModal : false
    });
  }

  handleFieldSettingsChange(field) {

      const stateField = this.state.field;

      stateField[field.source][field.name] = field.value;

      this.setState({
          field : stateField
      });
  }

  renderSettings() {
    return (
      <div>

        <h6>{Lang.get('modals.configuration')}</h6>

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
      </div>
    );
  }

  render() {

    return (

      <div>

        <ContentSelectModal
          display={this.state.displayContentModal}
          field={this.state.field}
          onContentSelected={this.handleContentSelected.bind(this)}
          onContentCancel={this.handleContentCancel.bind(this)}
          zIndex={11000}
        />

        <div className="custom-modal" id="modal-edit-menu" style={{zIndex:this.props.zIndex}}>
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
                        <LinkField
                            field={this.state.field}
                            hideTab={true}
                            translations={this.translations}
                            onFieldChange={this.onFieldChange.bind(this)}
                            onContentSelect={this.handleContentSelect.bind(this)}
                        />
                      }

                    </div>
                    <div className="col-xs-4 settings-col">
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

if (document.getElementById('menu-edit-modal')) {
  var element = document.getElementById('menu-edit-modal');
  var menu = element.getAttribute('menu');

  ReactDOM.render(<ModalMenuItem
      menu={menu}
    />, element);
}
