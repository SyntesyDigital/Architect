import React, {Component} from 'react';
import { render } from 'react-dom';


import MapComponent from './../../common/MapComponent';

class LocalizationField extends Component
{
  constructor(props)
  {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleLatLngChange = this.handleLatLngChange.bind(this);
  }

  componentDidMount(){

    if(this.props.field.value === undefined || this.props.field.value == null){
      //setup value if not yet defined
      this.props.onFieldChange({
          identifier: this.props.field.identifier,
          value: {
            lat : "",
            lng : ""
          }
      });

    }
  }

  handleOnChange(event)
  {
    const value = this.props.field.value ? this.props.field.value : {};
    value[event.target.name] = parseFloat(event.target.value);

    var field = {
      identifier : this.props.field.identifier,
      value : value
    };

    console.log(field);

    this.props.onFieldChange(field);
  }

  handleLatLngChange(latLng){

    var field = {
      identifier : this.props.field.identifier,
      value : {
        lat : latLng.lat,
        lng : latLng.lng,
      }
    };

    this.props.onFieldChange(field);
  }

  renderInputs()
  {

    const value = this.props.field.value !== undefined && this.props.field.value != null ? this.props.field.value : null;

    const lat = value != null && value.lat !== undefined ? value.lat : "";
    const lng = value != null && value.lng !== undefined ? value.lng : "";

    return (
      <div className="row">
        <div className="col-xs-6">
          <div className="form-group bmd-form-group">
             <label htmlFor={this.props.field.identifier+"_lat"} className="bmd-label-floating">{Lang.get('fields.latitude')}</label>
             <div>{lat}</div>
             {/*
             <input type="text" className="form-control" name="lat" value={lat} onChange={this.handleOnChange} />
             */}
          </div>
        </div>
        <div className="col-xs-6">
          <div className="form-group bmd-form-group">
             <label htmlFor={this.props.field.identifier+"_lng"} className="bmd-label-floating">{Lang.get('fields.longitude')}</label>
             <div>{lng}</div>
             {/*
             <input type="text" className="form-control" name="lng" value={lng} onChange={this.handleOnChange} />
             */}
          </div>
        </div>
      </div>
    );
  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;
    const value = this.props.field.value !== undefined && this.props.field.value != null ? this.props.field.value : null;

    const lat = value != null && value.lat !== undefined ? value.lat : "";
    const lng = value != null && value.lng !== undefined ? value.lng : "";

    return (
      <div className="field-item">

        <button  style={{display:(hideTab ? 'none' : 'block')}} id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa " + FIELDS.LOCALIZATION.icon}></i> {FIELDS.LOCALIZATION.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

          <div className="field-form">

            <MapComponent
              markerPosition={lat && lng ? value : ''}
              onLatLngChange={this.handleLatLngChange}
            />

            {this.renderInputs()}

          </div>

        </div>

      </div>
    );
  }

}
export default LocalizationField;
