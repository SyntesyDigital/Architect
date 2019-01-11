import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MediaFieldsList from './MediaFieldsList';
import MediaCropModal from './MediaCropModal';
import axios from 'axios';

export default class MediaEditModal extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            media : null,
            image : {}, // Different format
            fields : {
                title : {},
                alt : {},
                description : {},
            },
            cropsOpen : false,
            languages : LANGUAGES,
            formats : IMAGES_FORMATS,
        };

        this.onModalClose = this.onModalClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleCrops = this.toggleCrops.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleModalCropClose = this.handleModalCropClose.bind(this);
    }

    initFields()
    {
        var fields = this.state.fields;
        this.state.languages.forEach(function(language) {
            fields.title[language.iso] = {
                'label' : language.name,
                'value' : ''
            };

            fields.alt[language.iso] = {
                'label' : language.name,
                'value' : ''
            };

            fields.description[language.iso] = {
                'label' : language.name,
                'value' : ''
            };
        });

        this.setState({
            fields : fields
        });
    }

    handleChange(field)
    {
        var locale = field.name.match(/\[(.*?)\]/i)[1];
        var name = field.name.replace('[' + locale + ']','');
        var fields = this.state.fields;
        fields[name][locale].value = field.value;

        this.setState({
            fields : fields
        });
    }

    toggleCrops(event)
    {
        event.preventDefault();

        this.setState({
            cropsOpen : true
        });
    }

    componentDidMount()
    {
        // IF media lib is present...
        if(architect.medias._settings != null) {
            architect.medias._editModal = this;
        }
    }

    modalOpen(mediaId)
    {
        this.initFields();
        this.read(mediaId);
        TweenMax.to($("#media-edit"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
    }

    modalClose() {
        if(architect.medias._settings != null) {
            architect.medias.refresh();
        }
        else {
          this.props.onModalClose();
        }

        TweenMax.to($("#media-edit"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){

        }});
    }

    onModalClose(e){
      e.preventDefault();

        this.modalClose();
    }

    handleModalCropClose(image){
      this.setState({
          cropsOpen : false,
          image : image
      });
    }

    read(mediaId)
    {
        axios.get('/architect/medias/' + mediaId)
            .then(response => {
                var media = response.data.media;

                if(media.metadata.fields !== undefined) {
                    this.setState({
                        fields: media.metadata.fields,
                    });
                }

                this.mediaFieldsList.loadMedia(media);

                var image = {
                    url: '/storage/medias/original/' + media.stored_filename,
                    width: media.metadata.dimension.split('x')[0] ? media.metadata.dimension.split('x')[0] : 0,
                    height: media.metadata.dimension.split('x')[1] ? media.metadata.dimension.split('x')[1] : 0,
                    formats: []
                };

                this.state.formats.map(function(format, i){
                    image['formats'].push({
                        url : '/storage/medias/' + format.directory + '/' + media.stored_filename,
                        width: format.width,
                        height: format.height,
                        name: format.name,
                        ratio: format.ratio
                    });
                });

                this.mediaCropModal.setState({
                    image : image
                });

                this.setState({
                    media: media,
                    image: image
                });
            });
    }

    onSubmit(e) {
        e.preventDefault();

        var _this = this;

        var data = {
            metadata : {
                fields : this.state.fields
            },
            formats: this.state.image.formats
        };

        if(this.state.image.formats) {
            data.formats = this.state.image.formats;
        }

        axios.put('/architect/medias/' + this.state.media.id + '/update', data)
        .then(response => {
            if(response.data.success) {
                _this.modalClose();
            }
        });
    }

    render() {

        return (
          <div style={{zIndex:10000}}>
            <MediaCropModal
                ref={(mediaCropModal) => this.mediaCropModal = mediaCropModal}
                media = {this.state.media}
                display = {this.state.cropsOpen}
                onModalClose = {this.handleModalCropClose}
            />

            <div className="custom-modal" id="media-edit">
              <div className="modal-background"></div>


                <div className="modal-container">
                    <div className="modal-header">

                        <h2>{Lang.get('fields.edit_media')}  </h2>

                      <div className="modal-buttons">
                        <a className="btn btn-default close-button-modal" onClick={this.onModalClose}>
                          <i className="fa fa-times"></i>
                        </a>
                      </div>
                    </div>
                  <div className="modal-content">
                    <div className="container">
                      <div className="row">
                        <div className="col-xs-6 image-col">

                        {this.state.media &&
                          <div className="original-image" style={{backgroundImage:'url(/storage/medias/original/' + this.state.media.stored_filename + ')'}}></div>
                          }
                          <div className="image-actions">
                            <a href="" className="btn btn-default" onClick={this.toggleCrops}> <i className="fa fa-scissors"></i> {Lang.get('fields.cut')}  </a>
                          </div>

                        </div>
                        <div className="col-xs-6 content-col">
                          <MediaFieldsList
                            ref={(mediaFieldsList) => this.mediaFieldsList = mediaFieldsList}
                            media={this.state.media}
                            fields={this.state.fields}
                            onHandleChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <a href="" className="btn btn-default" onClick={this.onModalClose}> {Lang.get('fields.cancel')}  </a> &nbsp;
                      <a href="" className="btn btn-primary" onClick={this.onSubmit}> {Lang.get('fields.save')}  </a>
                    </div>

                  </div>
              </div>
            </div>
          </div>
        );
    }
}

if (document.getElementById('media-edit-modal')) {
    var languages = document.getElementById('media-edit-modal').getAttribute('languages');
    var formats = document.getElementById('media-edit-modal').getAttribute('formats');

    ReactDOM.render(<MediaEditModal languages={languages} formats={formats}/>, document.getElementById('media-edit-modal'));
}
