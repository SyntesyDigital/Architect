import React, {Component} from 'react';
import { render } from 'react-dom';

import TextField from './../ContentFields/TextField';
import SlugField from './../ContentFields/SlugField';
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
import UrlField from './../ContentFields/UrlField';
import FileField from './../ContentFields/FileField';
import TranslatedFileField from './../ContentFields/TranslatedFileField';

class CommonWidget extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      field : props.field
    };

    console.log(props.field);

    this.onFieldChange = this.onFieldChange.bind(this);
  }

  getStateFromProms(props) {

    const state = this.state;
    state.field = props.field;

    return state;
  }

  componentDidMount() {
    this.setState(this.getStateFromProms(this.props));
  }

  componentWillReceiveProps(nextProps){
    this.setState(this.getStateFromProms(nextProps));
  }

  onFieldChange(field) {
    var _this = this;

    const stateField = _this.state.field;

    Object.keys(stateField.fields).map(function(k){
        if(field.identifier == stateField.fields[k].identifier) {
            stateField.fields[k].value = field.value;
        }
    });


    this.props.onWidgetChange(stateField);
  }

  handleContentSelect(identifier) {

    const stateFields = this.state.field.fields;

    console.log("CommonWidget :: handleContentSelect ::",identifier,stateFields[identifier]);

    var field = null;
    for(var key in stateFields){
      if(stateFields[key].identifier == identifier){
        field = stateFields[key];
        break;
      }
    }

    if(field == null){
      console.error("CommonWidget :: handleContentSelect : field = null");
      return;
    }

    field.settings = this.state.field.settings;

    console.log("CommonWidget :: handleContentSelect :: field => ",field);

    this.props.onContentSelect(identifier,null,field);

  }

  renderFields() {
    var fields = [];
    var _this = this;

    const stateFields = _this.state.field.fields;

    Object.keys(stateFields).map(function(k){

        switch(stateFields[k].type) {
            case FIELDS.TEXT.type:
                fields.push(
                  <TextField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange.bind(this)}
                  />
                );
            break;

            case FIELDS.SLUG.type:
                fields.push(
                  <SlugField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    sourceField={_this.entryTitleKey != null ? stateFields[_this.entryTitleKey] : null}
                    blocked={_this.props.saved}
                    key={k}
                    onFieldChange={_this.onFieldChange.bind(this)}
                  />
                );
            break;

            case FIELDS.RICHTEXT.type:
                fields.push(
                <RichTextField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                />
                );
            break;

            case FIELDS.IMAGE.type:
                fields.push(
                <ImageField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onImageSelect={_this.props.onImageSelect}
                />
                );
            break;

            case FIELDS.FILE.type:
                fields.push(
                <FileField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onImageSelect={_this.props.onImageSelect}
                />
                );
            break;

            case FIELDS.TRANSLATED_FILE.type:
                fields.push(
                <TranslatedFileField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onFileSelect={_this.props.onImageSelect}
                />
                );
            break;

            case FIELDS.DATE.type:
                fields.push(
                <DateField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                />
                );
            break;

            case FIELDS.IMAGES.type:
                fields.push(
                <ImagesField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onImageSelect={_this.props.onImageSelect}
                />
                );
            break;



            case FIELDS.CONTENTS.type:
                fields.push(
                <ContentsField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onContentSelect={_this.handleContentSelect.bind(_this)}
                />
                );
            break;

            case FIELDS.BOOLEAN.type:
                fields.push(
                <BooleanField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                />
                );
            break;


            case FIELDS.LINK.type:
                fields.push(
                <LinkField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onContentSelect={_this.props.onContentSelect}
                />
                );
            break;

            case FIELDS.VIDEO.type:
                fields.push(
                <VideoField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                />
                );
            break;

            case FIELDS.URL.type:
                fields.push(
                  <UrlField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                    onContentSelect={_this.props.onContentSelect}
                  />
                );
            break;

            case FIELDS.LOCALIZATION.type:
                fields.push(
                <LocalizationField
                    field={stateFields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.onFieldChange}
                />
                );
            break;
        }
    });

    return fields;
  }

  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="widget-item">
          {this.renderFields()}
      </div>
    );
  }

}
export default CommonWidget;
