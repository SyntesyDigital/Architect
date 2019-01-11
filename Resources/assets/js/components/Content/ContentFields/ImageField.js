import React, {Component} from 'react';
import { render } from 'react-dom';

class ImageField extends Component {

  constructor(props){
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.onImageSelect = this.onImageSelect.bind(this);
    this.cancelImage = this.cancelImage.bind(this);
  }

  handleOnChange(event) {
    this.props.onFieldChange({
      identifier : this.props.field.identifier,
      language : $(event.target).closest('.form-control').attr('language'),
      value : event.target.value
    });
  }

  onImageSelect(event) {
    event.preventDefault();
    console.log('onImageSelect => ', event);

    this.props.onImageSelect(this.props.field);
  }

  cancelImage(event) {
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

    var format = (this.props.field.settings && this.props.field.settings.cropsAllowed && this.props.field.settings.cropsAllowed !== null)
        ? this.getImageFormat(this.props.field.settings.cropsAllowed)
        : null;

    var url = this.props.field.value != null && this.props.field.value.urls ? this.props.field.value.urls.original : null;


    if(format && this.props.field.value && this.props.field.value.urls) {
        if(format.name) {
            url = this.props.field.value.urls[format.name];
        }
    }

    return (
      <div className="form-group bmd-form-group image-field-container">
         <div className="image-field">
            {url &&
            <div className="image" style={{backgroundImage:"url(/"+ url +")"}} ></div>
            }

            {(!defined || value.url == "" ) &&
              <div className="add-button">
                <a href="#" className="btn btn-default" onClick={this.onImageSelect}><i className="fa fa-plus-circle"></i>  {Lang.get('fields.select')}</a>
              </div>
            }
         </div>

          {defined && value.url != "" &&
            <div className="image-buttons">
              {/*<a href="" className="btn btn-link"><i className="fa fa-pencil"></i> Editar</a>*/}
               <a href="" className="btn btn-link text-danger" onClick={this.cancelImage}><i className="fa fa-times"></i> {Lang.get('modals.cancel')}</a>
            </div>
           }

           {format &&
               <p className="field-help"> <b>{format.name}</b> : {Lang.get('modals.sizes')} {format.width}x{format.height} (  {Lang.get('modals.ratio')} {format.ratio} )</p>
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
            <i className={"fa "+ FIELDS.IMAGE.icon }></i> {FIELDS.IMAGE.name}
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
export default ImageField;
