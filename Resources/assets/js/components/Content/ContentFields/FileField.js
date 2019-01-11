import React, {Component} from 'react';
import { render } from 'react-dom';

class FileField extends Component {

  constructor(props){
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.cancelFile = this.cancelFile.bind(this);
  }

  handleOnChange(event) {
    this.props.onFieldChange({
      identifier : this.props.field.identifier,
      language : $(event.target).closest('.form-control').attr('language'),
      value : event.target.value
    });
  }

  onFileSelect(event) {
    event.preventDefault();
    console.log('onFileSelect => ', event);

    this.props.onImageSelect(this.props.field);
  }

  cancelFile(event) {
    event.preventDefault();
    this.props.onFieldChange({
      identifier : this.props.field.identifier,
      value : null
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

    var value = this.props.field.value ? this.props.field.value : {};
    var defined = this.props.field.value ? true : false;

    var url = null;

    //console.log("FileField :: url => ",this.props.field);

    if(this.props.field.value != null && this.props.field.value.type.indexOf("application") != -1){
      url = this.props.field.value.urls.files;
    }

    return (
      <div className="form-group bmd-form-group image-field-container">
         <div className="image-field">
            {url &&
              <div className="image-container file-field">
                <div className="pdf-preview"><i className="fa fa-file-pdf-o"></i></div>
                <ul>
                  <li>
                    <b>Nom arxiu</b> : {this.props.field.value.uploaded_filename}
                  </li>
                </ul>
              </div>
            }

            {(!defined || value.url == "" ) &&
              <div className="add-button">
                <a href="#" className="btn btn-default" onClick={this.onFileSelect}><i className="fa fa-plus-circle"></i>  {Lang.get('fields.select')}</a>
              </div>
            }
         </div>

          {defined && value.url != "" &&
            <div className="image-buttons">
              <a href={ASSETS+url} className="btn btn-link" target="_blank"><i className="fa fa-eye"></i> {Lang.get('fields.view')}</a> &nbsp;&nbsp;
              <a href="" className="btn btn-link text-danger" onClick={this.cancelFile}><i className="fa fa-times"></i> {Lang.get('modals.cancel')}</a>
            </div>
           }

      </div>
    );

  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item">

        <button style={{display:(hideTab ? 'none' : 'block')}} id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa "+ FIELDS.FILE.icon }></i> {FIELDS.FILE.name}
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
export default FileField;
