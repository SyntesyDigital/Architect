import React, {Component} from 'react';
import { render } from 'react-dom';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ContentBar from './ContentBar';
import ContentSidebar from './ContentSidebar';
import ContentFields from './ContentFields';
import MediaSelectModal from './../Medias/MediaSelectModal';
import ContentSelectModal from './ContentSelectModal';
import moment from 'moment';
import axios from 'axios';

class ContentContainer extends Component {

  constructor(props) {
     super(props);

     var self = this;

     // Build translations state from content languages fields
     var translations = {};
     LANGUAGES.map(function(language){
         if(self.props.content) {
             var exist = false;
            self.props.content.languages.map(function(contentLanguage){
                if(contentLanguage.iso == language.iso) {
                    exist = true;
                }
            });
            translations[language.iso] = exist;
         } else {
             translations[language.iso] = false;
         }
     });
     translations[DEFAULT_LOCALE] = true;

     //console.log("ContentContainer :: content => ", props.content);

     // Build state
     this.state = {
         status: this.props.content ? this.props.content.status : 0,
         template: "",
         category: props.content && props.content.categories && props.content.categories.length > 0 ? props.content.categories[0].id : null,
         errors : {},
         tags : this.props.content.tags ? this.props.content.tags : [],   // Los tags del contenido que hay que guardar
         tagsList : props.tags ? props.tags : [], // La lista de los tags
         translations: translations,
         author: props.content ? props.content.author_id : CURRENT_USER.id,
         authors: props.authors,
         content: props.content,
         typology: props.typology,
         categories: props.categories,
         languages: LANGUAGES,
         fields: props.fields ? props.fields : props.typology.fields,
         created_at: props.content ? moment(props.content.created_at).format('DD/MM/YYYY') : null,
         parent_id : this.props.content ? this.props.content.parent_id : null,
         settings : props.settings ? props.settings : this.exploteToObject(CONTENT_SETTINGS),
         saving : false,

         //modal states
         displayMediaModal: false,
         sourceField: null,

         displayContentModal: false,
         contentSourceField: null,
         sourceLanguage : null
     };

     console.log('CONTENT =>', props.content);
     console.log('LOADED FIELDS => ', this.state.fields);

     this.handleSubmitForm = this.handleSubmitForm.bind(this);
     this.handlePublish = this.handlePublish.bind(this);
     this.handleUnpublish = this.handleUnpublish.bind(this);
     this.handleFieldChange = this.handleFieldChange.bind(this);
     this.handleTagAdded = this.handleTagAdded.bind(this);
     this.handleRemoveTag = this.handleRemoveTag.bind(this);
     this.handleTranslationChange = this.handleTranslationChange.bind(this);
     this.handleCustomFieldChange = this.handleCustomFieldChange.bind(this);
     this.handleImageSelect = this.handleImageSelect.bind(this);
     this.handleImageSelected = this.handleImageSelected.bind(this);
     this.handleImageCancel = this.handleImageCancel.bind(this);
     this.handleContentSelect = this.handleContentSelect.bind(this);
     this.handleContentSelected = this.handleContentSelected.bind(this);
     this.handleContentCancel = this.handleContentCancel.bind(this);
 }

 exploteToObject(fields) {

   if(fields == null){
     return null;
   }

   var result = {};

   for(var i=0;i<fields.length;i++){
     result[fields[i]] = null;
   }
   return result;
 }


  /******** Images  ********/

  handleImageSelect(identifier,language) {
      console.log('handleImageSelect => ', identifier);

    this.setState({
      displayMediaModal : true,
      sourceField : identifier,
      sourceLanguage : language !== undefined ? language : null
    });

  }

  handleImageCancel(){
    this.setState({
      displayMediaModal : false,
      sourceField : null,
      sourceLanguage : null
    });
  }

  handleImageSelected(media){
      this.updateImage(this.state.sourceField,media);
  }

  updateImage(field,media){

      var fields = this.state.fields;

      switch (field.type) {
          case FIELDS.IMAGES.type:
              fields[field.identifier].value.push(media);
              break;

          case FIELDS.FILE.type:
          case FIELDS.IMAGE.type:
              fields[field.identifier].value = media;
              break;

          case FIELDS.TRANSLATED_FILE.type:

              if(fields[field.identifier].value === undefined || fields[field.identifier].value == null ){
                fields[field.identifier].value = {};
              }

              fields[field.identifier].value[this.state.sourceLanguage] = media;
              break;

      }

    this.setState({
      fields : fields,
      displayMediaModal : false,
      sourceField : null,
      sourceLanguage : null
    });

  }

  /******** Contents  ********/

  handleContentSelect(identifier) {

    this.setState({
      displayContentModal : true,
      contentSourceField : identifier
    });

  }

  handleContentCancel(){
    this.setState({
      displayContentModal : false,
      contentSourceField : null
    });
  }

  handleContentSelected(content){
      this.updateContent(this.state.contentSourceField, content);
  }

  updateContent(identifier,content){

    var fields = this.state.fields;

    Object.keys(fields).map(function(k){
        if(fields[k].identifier == identifier){
            switch(fields[k].type) {
                case FIELDS.URL.type:
                case FIELDS.LINK.type:

                    if(fields[identifier].value == null){
                      fields[identifier].value = {};
                    }
                    else if(fields[identifier].value.url !== undefined){
                      delete fields[identifier].value['url'];
                    }
                    fields[identifier].value.content = content;
                    break;
                case FIELDS.CONTENTS.type:
                    if(fields[identifier].value == null) {
                        fields[identifier].value = [];
                    }
                    fields[identifier].value.push(content);
                    break;
            }
        }
    })


    this.setState({
        fields : fields,
        displayContentModal : false,
        contentSourceField : null
    });

  }

  /********  Form ********/


  handleSubmitForm(e) {
    e.preventDefault();

    this.state.content ? this.update() : this.create();

    this.setState({
      saving : true
    });
  }

  getFormData()
  {
      return {
          parent_id: this.state.parent_id,
          translations : this.state.translations,
          content_id : this.state.content !== undefined ? this.state.content.id : null,
          typology_id : this.state.typology.id,
          status : this.state.status,
          category_id : this.state.category,
          tags : this.state.tags,
          fields : this.state.fields,
          author_id : this.state.author,
          translations : this.state.translations,
          settings : this.state.settings,
      };
  }

  handleUpdateSettings(settings){
    this.setState({
      settings : settings
    });
  }

  create()
  {
      var _this = this;
      axios.post('/architect/contents', this.getFormData())
         .then((response) => {
             if(response.data.success) {
                 _this.onSaveSuccess(response.data);

                 setTimeout(function(){
                     window.location.href = routes.showContent.replace(':id',response.data.content.id);
                 },1500);
             }
         })
         .catch((error) => {
             if (error.response) {
                 _this.onSaveError(error.response.data);
             } else if (error.message) {
                 toastr.error(error.message);
             } else {
                 console.log('Error', error.message);
             }
             //console.log(error.config);
         });
  }

  update()
  {
      var _this = this;
      axios.put('/architect/contents/' + this.state.content.id + '/update', this.getFormData())
          .then((response) => {
              if(response.data.success) {

                  _this.onSaveSuccess(response.data);
              }
          })
          .catch((error) => {
              if (error.response) {
                  _this.onSaveError(error.response.data);
              } else if (error.message) {
                  toastr.error(error.message);
              } else {
                  console.log('Error', error.message);
              }
              //console.log(error.config);
          });
  }

  handleDeleteContent()
  {
      var _this = this;
      axios.delete('/architect/contents/' + this.state.content.id + '/delete', this.getFormData())
          .then((response) => {
              if(response.data.success) {

                  toastr.success(Lang.get('fields.delete')+'! '+Lang.get('fields.redirect')+' ...');
                  setTimeout(function(){
                    window.location.href= "/architect/contents/";
                  },1000);

              }
          })
          .catch((error) => {
              if (error.response) {
                  _this.onSaveError(error.response.data);
              } else if (error.message) {
                  toastr.error(error.message);
              } else {
                  console.log('Error', error.message);
              }
              //console.log(error.config);
          });
  }

  onSaveSuccess(response)
  {
      if(response.content) {
          this.setState({
              content : response.content,
              saving : !this.props.saved ? true : false
          });
          toastr.success(Lang.get('models.content_saved'));
      }
  }


 onSaveError(response)
 {
     var errors = response.errors ? response.errors : null;
     var _this = this;
     var stateErrors = this.state.errors;

     if(errors) {

         var fields = errors.fields ? errors.fields : null;

         if(fields) {
             fields.map(function(field){
                Object.keys(field).map(function(identifier){
                    stateErrors[identifier] = field[identifier];
                })
             });
         }

         if(errors['author_id'] !== undefined) {
            stateErrors['author_id'] = errors['author_id'][0] ? errors['author_id'][0] : null;
         }
     }

     this.setState({
       saving : false,
       errors : stateErrors
     });


     if(response.message) {
         toastr.error(response.message);
     }
 }

     publishToogle(newStatus)
     {
         var _this = this;

         axios.put('/architect/contents/' + this.state.content.id + '/publish', {
             status : newStatus
         })
             .then((response) => {
                 if(response.data.success) {
                     toastr.success('ok');
                 }

                 _this.setState({
                     status : newStatus
                 });

             })
             .catch((error) => {
                 toastr.error(Lang.get('fields.error'));
             });
     }

    handlePublish(e)
    {
        e.preventDefault();

        const newStatus = 1;

        this.publishToogle(newStatus);
    }

    handleUnpublish(e)
    {
        e.preventDefault();

        const newStatus = 0;

        this.publishToogle(newStatus);
    }

    handleFieldChange(field) {
        const result = {};
        result[field.name] = field.value;
        this.setState(result);
    }

    handleTranslationChange(field) {

        const {translations} = this.state;
        translations[field.name] = field.value;

        this.setState({
            translations : translations
        });

    }

  handleTagAdded(tag) {

    console.log("handleTagAdded => ", tag);

    const {tags} = this.state;

    var found = false;
    for(var i=0;i<tags.length;i++){
      if(tags[i].id == tag.id){
        found = true;
        break;
      }
    }

    if(!found){
      tags.push(tag);

      this.setState({
        tags : tags
      });
    }
    else {
        console.error("Tag already added");
    }
  }

  handleRemoveTag(tagId) {

    const {tags} = this.state;

    for(var i=0;i<tags.length;i++){
      if(tags[i].id == tagId){
        tags.splice(i,1);
        break;
      }
    }

    this.setState({
      tags : tags
    });
  }

  handleCustomFieldChange(field){
      var fields = this.state.fields;
      fields[field.identifier].value = field.value;

      this.setState({
          fields : fields
      });
  }

  render() {

    const {fields,contentSourceField} = this.state;
    const mediaType = this.state.sourceField != null ? this.state.sourceField.type : null;

    return (
      <div>

        <MediaSelectModal
          display={this.state.displayMediaModal}
          field={this.state.sourceField}
          onImageSelected={this.handleImageSelected}
          onImageCancel={this.handleImageCancel}
          mediaType={mediaType}
        />

        <ContentSelectModal
          display={this.state.displayContentModal}
          field={contentSourceField != null && fields != null ? fields[contentSourceField] : null}
          onContentSelected={this.handleContentSelected}
          onContentCancel={this.handleContentCancel}
        />

        <ContentBar
          content={this.state.content}
          icon={this.state.typology.icon}
          name={this.state.typology.name}
          typologyId={this.state.typology.id}
          onSubmitForm={this.handleSubmitForm}
          onDelete={this.handleDeleteContent.bind(this)}
          saved={this.props.saved}
          hasPreview={this.state.typology.has_slug == 1 ? true : false}
          saving={this.state.saving}
        />

        <div className="container rightbar-page content">

            <ContentSidebar
                content={this.state.content}
                enableCategories={this.state.typology.has_categories}
                enableTags={this.state.typology.has_tags}
                errors={this.state.errors}
                status={this.state.status}
                template={this.state.template}
                category={this.state.category}
                categories={this.state.categories}
                tags={this.state.tags}
                tagsList={this.state.tagsList}
                translations={this.state.translations}
                author={this.state.author}
                authors={this.state.authors}
                createdAt={this.state.created_at}
                onPublish={this.handlePublish}
                onUnpublish={this.handleUnpublish}
                onFieldChange={this.handleFieldChange}
                onTranslationChange={this.handleTranslationChange}
                onTagAdded={this.handleTagAdded}
                onRemoveTag={this.handleRemoveTag}
                settings={this.state.settings}
                onUpdateSettings={this.handleUpdateSettings.bind(this)}
                saved={this.props.saved}
            />

            <DragDropContextProvider backend={HTML5Backend}>
            {this.state.errors &&
              <ContentFields
                errors={this.state.errors}
                fields={this.state.fields}
                translations={this.state.translations}
                onFieldChange={this.handleCustomFieldChange}
                onImageSelect={this.handleImageSelect}
                onContentSelect={this.handleContentSelect}
                saved={this.props.saved}
              />
            }
            </DragDropContextProvider>

        </div>

      </div>
    );
  }

}
export default ContentContainer;
