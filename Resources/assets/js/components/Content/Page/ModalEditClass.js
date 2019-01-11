import React, {Component} from 'react';
import { render } from 'react-dom';

import InputSettingsField from './../../Typology/Settings/InputSettingsField';
import BooleanSettingsField from './../../Typology/Settings/BooleanSettingsField';


class ModalEditClass extends Component {

  constructor(props){
    super(props);

    // console.log(" ModalEditClass :: construct ",props);

    this.state = {
      field : null
    };

    this.onModalClose = this.onModalClose.bind(this);
  }

  componentDidMount() {

    if(this.props.display){
        this.modalOpen();
    }

  }

  componentWillReceiveProps(nextProps)
  {

    console.log(" ModalEditClass :: componentWillReceiveProps ",nextProps);

    var field = null;

    if(nextProps.display){
        this.modalOpen();
        field = nextProps.item;

    } else {
        this.modalClose();
    }

     //console.log("ModalEditClass :: componentWillReceiveProps :: =>",field);

    this.setState({
      field : field
    });

  }

  onModalClose(e){
      e.preventDefault();
      this.props.onCancel();
  }

  modalOpen()
  {
    TweenMax.to($("#modal-edit-class"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
  }

  modalClose() {

    var self =this;
      TweenMax.to($("#modal-edit-class"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){
        /*
        self.setState({
          field : null
        });
        */
      }});
  }

  onSubmit(e) {
    e.preventDefault();

    const field = this.state.field;

    this.props.onSubmit(field);

  }

  /*************** SETTINGS **********************/

  handleFieldSettingsChange(field) {

      console.log("ModalEditClass :: handleFieldSettingsChange => ", field);

      const stateField = this.state.field;

      stateField.data[field.source][field.name] = field.value;

      this.setState({
          field : stateField
      });
  }

  renderSettings() {

    console.log("renderSettings!",this.state.field);

    const data = this.state.field != null ? this.state.field.data : null;

    return (
      <div>

        <h6>{Lang.get('modals.configuration')}</h6>

        <InputSettingsField
          field={data}
          name="htmlId"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label="Html ID"
          inputLabel={Lang.get('modals.indica_html')}
        />

        <InputSettingsField
          field={data}
          name="htmlClass"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label="Html Class"
          inputLabel={Lang.get('modals.indica_css')}
        />

        <BooleanSettingsField
          field={data}
          name="hasContainer"
          source="settings"
          onFieldChange={this.handleFieldSettingsChange.bind(this)}
          label={Lang.get('modals.has_container')}
        />

      </div>

    );


  }

  render() {

    return (
      <div>

        <div className="custom-modal" id="modal-edit-class" style={{zIndex:this.props.zIndex}}>
          <div className="modal-background"></div>


            <div className="modal-container">

              {this.state.field != null &&
                <div className="modal-header">
                    <h2>{this.state.field.data.type == 'row' ? 'Fila' : 'Columna'} | {Lang.get('modals.edition')}</h2>
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
                    <div className="col-xs-6 col-xs-offset-3">
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
export default ModalEditClass;
