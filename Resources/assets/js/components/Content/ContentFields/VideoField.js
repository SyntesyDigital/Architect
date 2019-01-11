import React, {Component} from 'react';
import { render } from 'react-dom';

import CustomFieldTypes from './../../common/CustomFieldTypes';

const TYPE_YOUTUBE = "youtube";
const TYPE_VIMEO = "vimeo";

class VideoField extends Component
{
  constructor(props)
  {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);

    this.state = {
      title : {},
      linkValues : {}
    };
  }

  componentDidMount()
  {
    var title = {};
    var linkValues = {};

    if(this.props.field.value === undefined || this.props.field.value == null){
      linkValues = {};
    }
    else {

      if(this.props.field.value.title !== undefined && this.props.field.value.title != null){
        title = this.props.field.value.title;
      }

      if(this.props.field.value.url !== undefined){
        linkValues = this.props.field.value.url;
      }

      this.setState({
        title : title,
        linkValues : linkValues
      });
    }

  }

  componentWillReceiveProps(nextProps){

    var title = null;
    var linkValues = null;

    if(nextProps.field.value === undefined || nextProps.field.value == null){
      title = {};
      linkValues = {};
    }
    else {

      if(nextProps.field.value.title !== undefined && nextProps.field.value.title != null){
        title = nextProps.field.value.title;
      }

      if(nextProps.field.value.url !== undefined && nextProps.field.value.url != null){
        linkValues = nextProps.field.value.url;
      }
      else {
        linkValues = {};
      }

      this.setState({
        title : title,
        linkValues : linkValues
      });

    }

  }


  handleOnChange(event)
  {
    const language = $(event.target).closest('.form-control').attr('language');
    const value = this.props.field.value !== undefined && this.props.field.value != null ?
      this.props.field.value : {};

    //console.log("LinkField :: handleOnChange ",value);
    if(value.title === undefined){
      value.title = {};
    }

    value.title[language] = event.target.value;

    var field = {
      identifier : this.props.field.identifier,
      value : value
    };

    this.props.onFieldChange(field);
  }

  handleLinkChange(event)
  {

    const language = $(event.target).closest('.form-control').attr('language');
    const value = this.props.field.value ? this.props.field.value : {};

    var linkValues = this.props.field.value !== undefined && this.props.field.value != null &&
      this.props.field.value.url !== undefined && this.props.field.value.url != null ?
      this.props.field.value.url : {};

    linkValues[language] = event.target.value;
    value.url = linkValues;

    var field = {
      identifier : this.props.field.identifier,
      value : value
    };

    this.props.onFieldChange(field);
  }

  renderTitle()
  {
    var inputs = [];
    for(var key in this.props.translations){
      //if(this.props.translations[key]){
          var value = '';

          if(this.state.title !== undefined && this.state.title != null ) {
              value = this.state.title[key] ? this.state.title[key] : '';
          }

        inputs.push(
          <div className="form-group bmd-form-group" key={key}>
             <label htmlFor={this.props.field.identifier} className="bmd-label-floating">{Lang.get('fields.title')} - {key}</label>
             <input type="text" className="form-control" language={key} name="name" value={value} onChange={this.handleOnChange} />
          </div>
        );
      //}
    }

    return inputs;
  }

  renderLinks(linkValues)
  {

    var inputs = [];
    for(var key in this.props.translations){
      //if(this.props.translations[key]){
          var value = '';
          console.log(this.props.field);

          if(linkValues !== undefined && linkValues != null) {
              value = linkValues[key] ? linkValues[key] : '';
          }

        inputs.push(
          <div className="form-group bmd-form-group" key={key}>
             <label htmlFor={this.props.field.identifier} className="bmd-label-floating">{Lang.get('fields.link')} - {key}</label>
             <input type="text" className="form-control" language={key} name="name" value={value} onChange={this.handleLinkChange} />
          </div>
        );
      //}
    }

    return inputs;
  }

  render() {

    const linkValues = this.state.linkValues;
    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="field-item">

        <button style={{display:(hideTab ? 'none' : 'block')}} id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa " + CustomFieldTypes.VIDEO.icon}></i> {CustomFieldTypes.VIDEO.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

          <div className="field-form">

            {this.renderTitle()}

            <hr/>
            <br/>
            <label className="bmd-label-floating">{Lang.get('fields.link_youtube_vimeo')} :</label>
            <br/>
            <br/>

            {this.renderLinks(linkValues)}

          </div>

        </div>

      </div>
    );
  }

}
export default VideoField;
