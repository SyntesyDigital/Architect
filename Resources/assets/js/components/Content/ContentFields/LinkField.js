import React, {Component} from 'react';
import { render } from 'react-dom';

const TYPE_INTERNAL = "internal";
const TYPE_EXTERNAL = "external";

class LinkField extends Component
{
  constructor(props)
  {
    super(props);

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
    this.handleLinkTypeChange = this.handleLinkTypeChange.bind(this);
    this.onContentSelect = this.onContentSelect.bind(this);
    this.onRemoveField = this.onRemoveField.bind(this);

    this.state = {
      title : {},
      type : TYPE_INTERNAL,
      linkValues : null
    };

  }

  componentDidMount()
  {
    var title = {};
    var type = "";
    var linkValues = null;

    if(this.props.field.value === undefined || this.props.field.value == null){
      type = TYPE_INTERNAL;
      linkValues = this.getDefaultValue(TYPE_INTERNAL);
    }
    else {

      if(this.props.field.value.title !== undefined && this.props.field.value.title != null){
        title = this.props.field.value.title;
      }

      if(this.props.field.value.url !== undefined){
        type = TYPE_EXTERNAL;
        linkValues = this.props.field.value.url;
      }
      else {
        type = TYPE_INTERNAL;
        linkValues = this.props.field.value.content;
      }

      this.setState({
        title : title,
        type : type,
        linkValues : linkValues
      });

    }
  }

  componentWillReceiveProps(nextProps){

    var title = null;
    var type = "";
    var linkValues = null;

    console.log("LinkField :: componentWillReceiveProps => ",nextProps);

    if(nextProps.field.value === undefined || nextProps.field.value == null){
      title = {};
      type = TYPE_INTERNAL;
      linkValues = this.getDefaultValue(TYPE_INTERNAL);
    }
    else {

      if(nextProps.field.value.title !== undefined && nextProps.field.value.title != null){
        title = nextProps.field.value.title;
      }

      if(nextProps.field.value.url !== undefined && nextProps.field.value.url != null){
        type = TYPE_EXTERNAL;
        linkValues = nextProps.field.value.url;
      }
      else if(nextProps.field.value.content !== undefined && nextProps.field.value.content != null){
        type = TYPE_INTERNAL;
        linkValues = nextProps.field.value.content;
      }
      else {
        type = TYPE_INTERNAL;
        linkValues = null;
      }

      this.setState({
        title : title,
        type : type,
        linkValues : linkValues
      });

    }

  }


  getDefaultValue(type)
  {

    return type == TYPE_INTERNAL ?
        null
      :
        {}
      ;
  }

  setDefaultType(type)
  {

    var linkValues = type == TYPE_INTERNAL ?
        null
      :
        {}
      ;

      this.setState({
        type : type,
        linkValues : linkValues
      })
  }


  onContentSelect(event) {
      event.preventDefault();
      this.props.onContentSelect(this.props.field.identifier);
  }

  handleOnChange(event)
  {
    const language = $(event.target).closest('.form-control').attr('language');
    const value = this.props.field.value !== undefined && this.props.field.value != null ?
      this.props.field.value : {};

    console.log("LinkField :: handleOnChange ",value);
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

  handleLinkTypeChange(event)
  {
    this.setDefaultType(event.target.value);
  }

  handleLinkChange(event)
  {

    const language = $(event.target).closest('.form-control').attr('language');
    const value = this.props.field.value ? this.props.field.value : {};

    var linkValues = this.props.field.value !== undefined && this.props.field.value.url !== undefined
      && this.props.field.value.url != null ?
      this.props.field.value.url : {};

    linkValues[language] = event.target.value;
    value.url = linkValues;

    if(value.content !== undefined){
      delete value['content'];
    }

    var field = {
      identifier : this.props.field.identifier,
      value : value
    };

    this.props.onFieldChange(field);
  }

  onRemoveField(event){

    event.preventDefault();

    const value = this.props.field.value;

    value.content = null;

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

  renderRadio() {

    const linkType = this.state.type;

    return (

      <div className="radio-form">

        <br/>

        <label className="form-check-label" >
            <input className="form-check-input" type="radio"
              checked={linkType == TYPE_INTERNAL}
              name={"linkType"+this.props.field.identifier}
              value={TYPE_INTERNAL}
              onChange={this.handleLinkTypeChange}
            /> &nbsp;
            {Lang.get('fields.internal_link')}
            &nbsp;&nbsp;
        </label>

        &nbsp;

        <label className="form-check-label">
            <input className="form-check-input" type="radio"
              checked={linkType == TYPE_EXTERNAL}
              name={"linkType"+this.props.field.identifier}
              value={TYPE_EXTERNAL}
              onChange={this.handleLinkTypeChange}
            /> &nbsp;
            {Lang.get('fields.external_link')}
            &nbsp;&nbsp;
        </label>

        <br/>
        <br/>

      </div>


    );
  }

  renderLinks(linkValues)
  {

    var inputs = [];
    for(var key in this.props.translations){
      //if(this.props.translations[key]){
          var value = '';


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

  renderSelectedPage(linkValues)
  {

    const pageValues = linkValues;

    if(pageValues != null){
      return (
        <div className="field-form fields-list-container">

          <div className="typology-field">
            {pageValues.typology !== undefined && pageValues.typology != null &&
              <div className="field-type">
                {pageValues.typology.icon !== undefined &&
                  <i className={"fa "+pageValues.typology.icon}></i>
                }
                &nbsp; {pageValues.typology.name !== undefined ? pageValues.typology.name : ''}
              </div>
            }

            {(pageValues.typology === undefined || pageValues.typology == null) &&
              <div className="field-type">
                <i className="fa fa-file-o"></i>
                &nbsp; {Lang.get('fields.page')}
              </div>
            }


            <div className="field-inputs">
              <div className="row">
                <div className="field-name col-xs-6">
                  {pageValues.title ? pageValues.title : ""}
                </div>
              </div>
            </div>

            <div className="field-actions">
              <a href="" className="remove-field-btn" onClick={this.onRemoveField}> <i className="fa fa-trash"></i> {Lang.get('fields.delete')} </a>
              &nbsp;&nbsp;
            </div>
          </div>

        </div>
      );
    }
    else {
      return (
        <div className="add-content-button">
          <a href="" className="btn btn-default" onClick={this.onContentSelect}><i className="fa fa-plus-circle"></i> {Lang.get('fields.select')} </a>
        </div>
      );
    }

  }


  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;
    const linkType = this.state.type;
    const linkValues = this.state.linkValues;

    return (
      <div className="field-item">

        <button style={{display:(hideTab ? 'none' : 'block')}} id={"heading"+this.props.field.identifier} className="btn btn-link" data-toggle="collapse" data-target={"#collapse"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>
          <span className="field-type">
            <i className={"fa " + FIELDS.LINK.icon}></i> {FIELDS.LINK.name}
          </span>
          <span className="field-name">
            {this.props.field.name}
          </span>
        </button>

        <div id={"collapse"+this.props.field.identifier} className="collapse in" aria-labelledby={"heading"+this.props.field.identifier} aria-expanded="true" aria-controls={"collapse"+this.props.field.identifier}>

          <div className="field-form">
            {this.renderTitle()}
            {this.renderRadio()}

            {this.state.type == TYPE_INTERNAL &&
              this.renderSelectedPage(linkValues)
            }

            {this.state.type == TYPE_EXTERNAL &&
              this.renderLinks(linkValues)
            }

          </div>

        </div>

      </div>
    );
  }

}
export default LinkField;
