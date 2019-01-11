import React, {Component} from 'react';
import { render } from 'react-dom';

import TextField from './../ContentFields/TextField';
import RichTextField from './../ContentFields/RichTextField';
import ImageField from './../ContentFields/ImageField';
import UrlField from './../ContentFields/UrlField';


/**

{
    image : {
      id :
      url :
    },
    title : {
      "ca" : "asdfasdfasdf",
      "es" : "sdfasdfsdf"
    },
    richtect : {
      "ca" : "sfasdfasdf",
      "es" : "asfasdfasdf"
    },
    url : {
      url :
      content :
    },

}
*
*/
class TitleImageWidget extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      image : {
        id : 0,
        identifier : "image",
        value : null,
        name : "Imatge"
      },
      title : {
        id : 1,
        identifier : "title",
        value : {},
        name : "Títol"
      },
      richtext : {
        id : 2,
        identifier : "richtext",
        value : {},
        name : "Descripció"
      },
      url : {
        id : 3,
        identifier : "url",
        value : {},
        name : "URL"
      }
    }

  }

  getStateFromProms(props) {

    console.log("TitleImageWidget :: getStateFromProms => ",props);

    const state = this.state;

    var titleValue = {};
    var richtextValue = {};
    var urlValue = {};
    var imageValue = null;
    var settings = null;

    if(props.field.value !== undefined && props.field.value != null){

      settings = props.field.settings;

      if(props.field.value.title !== undefined && props.field.value.title != null){
        titleValue = props.field.value.title;
      }

      if(props.field.value.richtext !== undefined && props.field.value.richtext != null){
        richtextValue = props.field.value.richtext;
      }

      //field value.value url came with url or content depending on type
      if(props.field.value.url !== undefined && props.field.value.url != null){
        urlValue = props.field.value.url;
      }

      if(props.field.value.image !== undefined && props.field.value.image != null){
        imageValue = props.field.value.image;
      }
    }

    state["title"].value = titleValue;
    state["richtext"].value = richtextValue;
    state["url"].value = urlValue;
    state["image"].value = imageValue;
    state["image"].settings = settings;

    return state;

  }

  componentDidMount() {

    this.setState(this.getStateFromProms(this.props));

  }

  componentWillReceiveProps(nextProps){

    this.setState(this.getStateFromProms(nextProps));
  }

  onFieldChange(field) {

    console.log("TitleImageWidget :: onFieldChange => ",field);

    const value = this.props.field.value !== undefined && this.props.field.value != null ?
      this.props.field.value : {};

    value[field.identifier] = field.value;

    var field = {
      identifier : this.props.field.identifier,
      value : value
    };

    //propagate the state to its parent
    this.props.onFieldChange(field);
  }

  render() {

    const hideTab = this.props.hideTab !== undefined && this.props.hideTab == true ? true : false;

    return (
      <div className="widget-item">

          <ImageField
            field={this.state.image}
            onFieldChange={this.onFieldChange.bind(this)}
            onImageSelect={this.props.onImageSelect}
          />

          <TextField
            field={this.state.title}
            translations={this.props.translations}
            onFieldChange={this.onFieldChange.bind(this)}

          />

          <RichTextField
            field={this.state.richtext}
            translations={this.props.translations}
            onFieldChange={this.onFieldChange.bind(this)}

          />

          <UrlField
            field={this.state.url}
            translations={this.props.translations}
            onFieldChange={this.onFieldChange.bind(this)}
            onContentSelect={this.props.onContentSelect}
          />

      </div>

    );
  }

}
export default TitleImageWidget;
