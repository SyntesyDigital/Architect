import React, {Component} from 'react';
import { render } from 'react-dom';

class TranslatedFileField extends Component {

  constructor(props){
    super(props);

    //this.handleOnChange = this.handleOnChange.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.cancelFile = this.cancelFile.bind(this);
  }

  /*
  handleOnChange(event) {
    this.props.onFieldChange({
      identifier : this.props.field.identifier,
      language : $(event.target).closest('.form-control').attr('language'),
      value : event.target.value
    });
  }
  */

  onFileSelect(key,event) {
    event.preventDefault();
    console.log('TranslatedFileField :: onFileSelect => ', event,key);

    this.props.onFileSelect(this.props.field,key);
  }

  cancelFile(language,event) {
    event.preventDefault();
    console.log('TranslatedFileField :: cancelFile => ', event,language);

    const values = this.props.field.value ? this.props.field.value : {};
    values[language] = null;

    this.props.onFieldChange({
      identifier : this.props.field.identifier,
      value : values
    });

  }

  getImageFormat(value)
  {
      var format = null;

      if(IMAGES_FORMATS) {
          IMAGES_FORMATS.map(function(f){
              if(f.name == value) {
                  format = f;
              }
          });
      }

      return format;
  }

  renderInputs() {

    var inputs = [];

    for(var key in this.props.translations){

      var value = this.props.field.value && this.props.field.value[key]  ? this.props.field.value[key] : {};
      var defined = this.props.field.value && this.props.field.value[key] ? true : false;

      var url = null;

      //console.log("TranslatedFileField :: url => ",this.props.field);

      if(defined && value.type.indexOf("application") != -1){
        url = value.urls.files;
      }

      inputs.push(
        <div className="form-group bmd-form-group image-field-container translated-file" key={key}>

           <label className="bmd-label-floating">{this.props.field.name} - {key}</label>
           <div className="image-field">
              {url &&
                <div className="image-container file-field">
                  <div className="pdf-preview"><i className="fa fa-file-pdf-o"></i></div>
                  <ul>
                    <li>
                      <b>Nom arxiu</b> : {this.props.field.value[key].uploaded_filename}
                    </li>
                  </ul>
                </div>
              }

              {(!defined ) &&
                <div className="add-button">
                  <a href="#" className="btn btn-default" onClick={this.onFileSelect.bind(this,key)}><i className="fa fa-plus-circle"></i>  {Lang.get('fields.select')}</a>
                </div>
              }
           </div>

            {defined &&
              <div className="image-buttons">
                <a href={ASSETS+url} className="btn btn-link" target="_blank"><i className="fa fa-eye"></i> {Lang.get('fields.view')}</a> &nbsp;&nbsp;
                <a href="" className="btn btn-link text-danger" onClick={this.cancelFile.bind(this,key)}><i className="fa fa-times"></i> {Lang.get('fields.cancel')}</a>
              </div>
             }

        </div>
      );

    }

    return inputs;

  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item">

        <button style={{display:(hideTab ? 'none' : 'block')}} id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+ FIELDS.TRANSLATED_FILE.icon }></i> {FIELDS.TRANSLATED_FILE.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

          <div className="field-form">
            {this.renderInputs()}
          </div>

        </div>

      </div>
    );
  }

}
export default TranslatedFileField;
