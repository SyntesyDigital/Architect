import React, {Component} from 'react';
import { render } from 'react-dom';

import BooleanSettingsField from './Settings/BooleanSettingsField';
import InputSettingsField from './Settings/InputSettingsField';
import CheckboxesSettingsField from './Settings/CheckboxesSettingsField';
import SelectorSettingsField from './Settings/SelectorSettingsField';
import RadioSettingsField from './Settings/RadioSettingsField';

class TypologyModal extends Component {

  constructor(props) {
    super(props);

    this.handleFieldSettingsChange = this.handleFieldSettingsChange.bind(this);

  }

  handleFieldSettingsChange(field) {
      this.props.onSettingsFieldChange(field);
  }

  handleInputSettingsChange(event) {

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

  render() {
    return (
      <div className="custom-modal" id={this.props.id}>
        <div className="modal-background"></div>
          <div className="modal-container">
            {this.props.field != null &&
              <div className="modal-header">

                  <i className={"fa "+this.props.field.icon}></i>
                  <h2>{this.props.field.name} | {Lang.get('header.configuration')}</h2>

                <div className="modal-buttons">
                  <a className="btn btn-default close-button-modal" onClick={this.props.onModalClose}>
                    <i className="fa fa-times"></i>
                  </a>
                </div>
              </div>
            }
            <div className="modal-content">
              <div className="container">
                <div className="row">
                  <div className="col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">


                    <BooleanSettingsField
                      field={this.props.field}
                      name="entryTitle"
                      source="settings"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Títol principal"
                    />

                    <BooleanSettingsField
                      field={this.props.field}
                      name="required"
                      source="rules"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Camp obligatori"
                    />

                    <BooleanSettingsField
                      field={this.props.field}
                      name="unique"
                      source="rules"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Camp únic"
                    />

                    <InputSettingsField
                      field={this.props.field}
                      name="minCharacters"
                      source="rules"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Caràcters mínims"
                      inputLabel="Indica el número mínim de caràcters"
                    />

                    <InputSettingsField
                      field={this.props.field}
                      name="maxCharacters"
                      source="rules"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Caràcters màxims"
                      inputLabel="Indica el número màxim de caràcters"
                    />

                    <InputSettingsField
                      field={this.props.field}
                      name="maxItems"
                      source="rules"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Número màxim d'elements"
                      inputLabel="Indica el número màxim"
                    />


                    <InputSettingsField
                      field={this.props.field}
                      name="minItems"
                      source="rules"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Número mínim d'elements"
                      inputLabel="Indica el número mínim"
                    />

                    <InputSettingsField
                      field={this.props.field}
                      name="fieldHeight"
                      source="settings"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Alçada del camp"
                      inputLabel="Indica la alçada en pixels"
                    />

                    <CheckboxesSettingsField
                      field={this.props.field}
                      name="typologiesAllowed"
                      source="settings"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Tipologies permeses"
                      options={TYPOLOGIES}
                    />

                    <RadioSettingsField
                      field={this.props.field}
                      name="cropsAllowed"
                      source="settings"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Mides permeses"
                      options={this.getCropsformats()}
                    />

                    {/*
                    <SelectorSettingsField
                      field={this.props.field}
                      name="listAllowed"
                      source="settings"
                      onFieldChange={this.handleFieldSettingsChange}
                      label="Llista seleccionada"
                      options={[
                        {name:"Llista 1",value:1},
                        {name:"Llista 2",value:2}
                      ]}
                    />
                    */}


                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <a href="" className="btn btn-default" onClick={this.props.onModalClose}> Tancar </a> &nbsp;
                {/*
                <a href="" className="btn btn-primary"> Guardar </a>
                */
                }
              </div>

            </div>
        </div>
        }
      </div>
    );
  }

}
export default TypologyModal;
