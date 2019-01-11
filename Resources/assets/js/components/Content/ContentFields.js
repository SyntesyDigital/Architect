import React, {Component} from 'react';
import { render } from 'react-dom';

import TextField from './ContentFields/TextField';
import SlugField from './ContentFields/SlugField';
import RichTextField from './ContentFields/RichTextField';
import ImageField from './ContentFields/ImageField';
import FileField from './ContentFields/FileField';
import TranslatedFileField from './ContentFields/TranslatedFileField';
import DateField from './ContentFields/DateField';
import ImagesField from './ContentFields/ImagesField';
import ListField from './ContentFields/ListField';
import ContentsField from './ContentFields/ContentsField';
import BooleanField from './ContentFields/BooleanField';
import LinkField from './ContentFields/LinkField';
import VideoField from './ContentFields/VideoField';
import LocalizationField from './ContentFields/LocalizationField';
import UrlField from './ContentFields/UrlField';
import KeyValuesField from './ContentFields/KeyValuesField';

class ContentFields extends Component {

  constructor(props){
    super(props);

    this.state = {
        fields : [],
        errors : this.props.errors
    };

    this.entryTitleKey = this.getEntryTitleKey();
  }

  getEntryTitleKey() {
    for(var key in this.props.fields){
      if(this.props.fields[key].type == FIELDS.TEXT.type){
        if(this.props.fields[key].settings.entryTitle){
          return key;
        }
      }
    }

    return null;
  }

  renderFields() {
    var fields = [];
    var _this = this;

    console.log("fields => ",_this.props.fields);

    Object.keys(_this.props.fields).map(function(k){
        switch(_this.props.fields[k].type) {
            case FIELDS.TEXT.type:
                fields.push(
                  <TextField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                  />
                );
            break;

            case FIELDS.SLUG.type:
                fields.push(
                  <SlugField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    sourceField={_this.entryTitleKey != null ? _this.props.fields[_this.entryTitleKey] : null}
                    blocked={_this.props.saved}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                  />
                );
            break;

            case FIELDS.RICHTEXT.type:
                fields.push(
                <RichTextField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                />
                );
            break;

            case FIELDS.IMAGE.type:
                fields.push(
                <ImageField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onImageSelect={_this.props.onImageSelect}
                />
                );
            break;

            case FIELDS.FILE.type:
                fields.push(
                <FileField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onImageSelect={_this.props.onImageSelect}
                />
                );
            break;

            case FIELDS.TRANSLATED_FILE.type:
                fields.push(
                <TranslatedFileField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onFileSelect={_this.props.onImageSelect}
                />
                );
            break;



            case FIELDS.DATE.type:
                fields.push(
                <DateField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                />
                );
            break;

            case FIELDS.IMAGES.type:
                fields.push(
                <ImagesField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onImageSelect={_this.props.onImageSelect}
                />
                );
            break;

            case FIELDS.KEY_VALUES.type:
                fields.push(
                <KeyValuesField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                />
                );
            break;

            case FIELDS.CONTENTS.type:
                fields.push(
                <ContentsField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onContentSelect={_this.props.onContentSelect}
                />
                );
            break;

            case FIELDS.BOOLEAN.type:
                fields.push(
                <BooleanField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                />
                );
            break;


            case FIELDS.LINK.type:
                fields.push(
                <LinkField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onContentSelect={_this.props.onContentSelect}
                />
                );
            break;

            case FIELDS.VIDEO.type:
                fields.push(
                <VideoField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                />
                );
            break;

            case FIELDS.URL.type:
                fields.push(
                  <UrlField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                    onContentSelect={_this.props.onContentSelect}
                  />
                );
            break;

            case FIELDS.LOCALIZATION.type:
                fields.push(
                <LocalizationField
                    errors={_this.props.errors[k]}
                    field={_this.props.fields[k]}
                    translations={_this.props.translations}
                    key={k}
                    onFieldChange={_this.props.onFieldChange}
                />
                );
            break;
        }
    });

    return fields;
  }


  render() {
    return (
      <div className="col-xs-9 page-content">
        <div className="field-group">
            {this.renderFields()}
        </div>
      </div>
    );
  }

}
export default ContentFields;
