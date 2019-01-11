import React, {Component} from 'react';
import { render } from 'react-dom';
import Select from 'react-select';

import TagManager from "./Tags/TagManager";
import InputSettingsField from './../Typology/Settings/InputSettingsField';
import SelectorSettingsField from './../Typology/Settings/SelectorSettingsField';

import moment from 'moment';

class ContentSidebar extends Component {

  constructor(props) {
    super(props);

    //console.log('PROPS ======>', props);

    this.handleChange = this.handleChange.bind(this);
    this.handleTranslationChange = this.handleTranslationChange.bind(this);
  }

  handleChange(event) {

    var field = null;

    if(event.target.type == "text" || event.target.type == "select-one"){
        field = {
            name : event.target.name,
            value : event.target.value
        };
    }
    else if(event.target.type == "checkbox"){
        field = {
            name : event.target.name,
            value : event.target.checked
        };
    }

    if(field != null) {
        this.props.onFieldChange(field);
    }

  }

  handleTranslationChange(event) {
    var field = {
      name : event.target.name,
      value : event.target.checked
    };

    this.props.onTranslationChange(field);
  }

  renderLanguagesCheckbox()
  {
    return (LANGUAGES.map((language, k) => (
        <div className="togglebutton" key={k}>
            <label>
              {language.name}
              {language.iso == DEFAULT_LOCALE &&
                <input type="checkbox" name={language.iso} value={true} checked="true" disabled="true" />
              }
              {language.iso != DEFAULT_LOCALE &&
                <input type="checkbox" name={language.iso} checked={this.props.translations[language.iso]} onChange={this.handleTranslationChange} />
              }
            </label>
        </div>
    )));
  }

  printSpace(level)
  {

    if(level <= 1)
      return null;

    var spaces = [];
    for(var i=1;i<level;i++){
      spaces.push(
        "- "
      );
    }

    return spaces;
  }

  handleFieldSettingsChange(field) {

      //console.log("ModalEditItem :: handleFieldSettingsChange => ", field);

      const settings = this.props.settings;

      settings[field.name] = field.value;

      this.props.onUpdateSettings(settings);
  }

  renderSettings()
  {

    console.log("settings => ",this.props.settings)

    const field = {
      settings : this.props.settings
    };

    return (
      <div>
        <div className="form-group bmd-form-group sidebar-item">
          <SelectorSettingsField
            field={field}
            name="pageType"
            source="settings"
            onFieldChange={this.handleFieldSettingsChange.bind(this)}
            label={Lang.get('fields.page_type')}
            options={[
              {
                value : '',
                name : '---'
              },
              {
                value : 'single',
                name : 'Single'
              },
              {
                value : 'landing',
                name : 'Landing'
              },
              {
                value : 'home',
                name : 'Home'
              }
            ]}
          />
        </div>
        <div className="form-group bmd-form-group sidebar-item">
          <InputSettingsField
            field={field}
            name="htmlClass"
            source="settings"
            onFieldChange={this.handleFieldSettingsChange.bind(this)}
            label={Lang.get('modals.html_class')}
            inputLabel={Lang.get('modals.indica_html')}
          />
        </div>

      </div>


    )
  }

  render() {

    var self = this;

    return (
      <div className="sidebar">
        { this.props.saved &&
          <div className="publish-group">
            { this.props.status == 1 &&
              <div className="publish-form sidebar-item">
                  <b>Estat</b> : <i className="fa fa-circle text-success"></i> {Lang.get('fields.published')} <br/>
                  {!architect.currentUserHasRole('author') &&
                    <a className="btn btn-default" href="" onClick={this.props.onUnpublish}> {Lang.get('fields.unpublish')} </a>
                  }
                  <p className="field-help">{moment(this.props.content.published_at).format('LLLL')}</p>
              </div>
            }

            {this.props.status == 0 &&
              <div className="publish-form sidebar-item">
                  <b>Estat</b> : <i className="fa fa-circle text-warning"></i> {Lang.get('fields.draft')} <br/>
                  {!architect.currentUserHasRole('author') &&
                    <a className="btn btn-success" href=""  onClick={this.props.onPublish}> {Lang.get('fields.publish')} </a>
                  }
                  <p className="field-help"></p>
              </div>
            }

            <hr/>

          </div>
        }

        <div className="form-group bmd-form-group sidebar-item">
           <label className="bmd-label-floating">{Lang.get('fields.active_languages')}</label>
           {this.renderLanguagesCheckbox()}
        </div>

        <hr/>

        {this.props.pages !== undefined && this.props.pages != null &&
          <div>
            <div className="form-group bmd-form-group sidebar-item">
               <label htmlFor="parent_id" className="bmd-label-floating">{Lang.get('fields.parent_page')}</label>

               {!architect.currentUserHasRole('author') &&
                 <select className="form-control" id="parent_id" name="parent_id" value={this.props.parent_id}  onChange={this.handleChange}>
                      <option value="">---</option>
                     {
                       this.props.pages && Object.keys(this.props.pages).map(function(id) {
                           return <option value={self.props.pages[id].id} key={self.props.pages[id].id} selected={self.props.content && self.props.content.parent_id == self.props.pages[id].id ? "selected" : ""}>{self.props.pages[id].title}</option>
                       })
                     }
                 </select>
               }
               {architect.currentUserHasRole('author') &&
                 <select disabled="true" className="form-control" id="parent_id" name="parent_id" value={this.props.parent_id}  onChange={this.handleChange}>
                      <option value="">---</option>
                     {
                       this.props.pages && Object.keys(this.props.pages).map(function(id) {
                           return <option value={self.props.pages[id].id} key={self.props.pages[id].id} selected={self.props.content && self.props.content.parent_id == self.props.pages[id].id ? "selected" : ""}>{self.props.pages[id].title}</option>
                       })
                     }
                 </select>
               }

            </div>
            <hr/>
          </div>
        }

        {this.props.enableCategories == 1 &&
          <div>
            <div className="form-group bmd-form-group has-danger">
               <label htmlFor="template" className="bmd-label-floating">{Lang.get('fields.category')}</label>
               <select className="form-control" id="template" name="category" value="" value={this.props.category} onChange={this.handleChange}>
                    <option value="">---</option>
                   {
                     this.props.categories && this.props.categories.map(function(category, i) {
                       return <option value={category.id} key={i}>{self.printSpace(category.level)}{category.name}</option>
                     })
                   }
               </select>
            </div>
            <hr/>
          </div>
        }

        {this.props.enableTags  == 1 &&
          <div>
            <div className="form-group bmd-form-group sidebar-item">
              <TagManager
                tags={this.props.tags}
                tagsList={this.props.tagsList}
                content={this.props.content}
                onTagAdded={this.props.onTagAdded}
                onRemoveTag={this.props.onRemoveTag}
              />
            </div>

            <hr/>
          </div>
        }



        <div className={'form-group bmd-form-group sidebar-item ' + ( this.props.errors['author_id'] ? 'has-error' : '')}>
           <label htmlFor="author" className="bmd-label-floating">{Lang.get('fields.author')}</label>
           <select className="form-control" disabled={(architect.currentUserHasRole('author') ? 'true' : 'false')} id="author" name="author" value={this.props.author} onChange={this.handleChange} placeholder="---">
           <option value=""></option>
           {
             this.props.authors.map(function(author, i) {
               return <option value={author.id} key={i}>{author.firstname + ' ' + author.lastname}</option>
             })
           }
           </select>

           <p className="field-help">Creat el {this.props.createdAt}</p>

        </div>

        {this.props.settings !== undefined && !architect.currentUserHasRole('author') &&

          <div>
            <hr/>

            <div className="sidebar-item">
               <label className="bmd-label-floating">{Lang.get('header.configuration')}</label>
               {this.renderSettings()}
            </div>


          </div>
        }


      </div>
    );
  }

}
export default ContentSidebar;
