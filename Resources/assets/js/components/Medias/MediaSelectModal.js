import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MediaSelectedItem from './MediaSelectedItem';
import MediaEditModal from './MediaEditModal';

const acceptedFiles = 'image/jpeg,image/png,image/gif',
      maxFilesize = 20, // MB
      paramName = 'file',
      identifier = '.medias-dropfiles';


class MediaSelectModal extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
          imageSelected : null,
          isOpen : false
        };

        this._dropzone = null;
        this._mediaEditModal = null;
        this._table = $('#table-medias');

        console.log("MediaSelectModal :: construct");

        this.onModalClose = this.onModalClose.bind(this);
        this.handleMediaSelected = this.handleMediaSelected.bind(this);
        this.initEvents = this.initEvents.bind(this);
        this.handleCancelImage = this.handleCancelImage.bind(this);
        this.handleImageEdit = this.handleImageEdit.bind(this);
        this.handleEditModalClose = this.handleEditModalClose.bind(this);

    }

    componentDidMount()
    {

      console.log("MediaSelectModal :: componentDidMount");

      this.initDropzone();
      //this.setDatatable();

      this.initEvents();

    }

    handleCancelImage(e){
      e.preventDefault();

      this.setState({
        imageSelected:null
      });
    }

    initDropzone()
    {
        var _this = this;

        console.log("MediaSelectModal :: initDropzone");

        var settings = {
            url: routes['medias.store'],
            uploadMultiple: false,
            parallelUploads: 1,
            createImageThumbnails : false,
            // acceptedFiles: _this._settings.acceptedFiles,
            addRemoveLinks: false,
            maxFilesize: maxFilesize,
            paramName: paramName,
            /*
            thumbnail: function(file, dataUrl) {
                return false;
            }*/
        };

        console.log(settings);

        this._dropzone = new Dropzone(identifier, settings);

        this._dropzone.on("error", function(file, response) {
            toastr.error(response.errors.file[0]);
        });

        this._dropzone.on("totaluploadprogress", function(progress) {
            $(".progress-bar").parent().addClass("progress-striped active");
            $(".progress-bar").width(progress + "%");
            $(".progress-bar").html(progress + "%");
        });

        this._dropzone.on("maxfilesreached", function() {
            toastr.error('Too many files added !');
        });

        this._dropzone.on("dragenter", function() {
            $('.medias-dropfiles').addClass("active");
        });

        this._dropzone.on("dragleave dragend dragover", function() {
            $('.medias-dropfiles').removeClass("active");
        });

        this._dropzone.on("maxfilesexceeded", function(file) {
            toastr.error('File ' + file.name + ' is too big !');
        });

        this._dropzone.on("queuecomplete", function(file, response) {
            setTimeout(function() {
                $(".progress-bar").parent().removeClass("progress-striped active");
                $(".progress-bar").width("0%");
                $(".progress-bar").html("");
            }, 2000);

            _this._dropzone.removeAllFiles(true);
        });


        this._dropzone.on("success", function(file, response) {
            _this.onSuccessUpload(_this);
        });
    }

    onSuccessUpload(_this)
    {
        toastr.success('Arxiu guardat correctament');
        _this.refresh();
    }

    getRoute(mediaType){
      if(mediaType == "file" || mediaType == "translated_file"){
          return routes["medias.data"]+"?type=application";
      }

      return routes["medias.data"]+"?type=image";
    }

    setDatatable(mediaType)
    {

        console.log("MediaSelectModal :: setDatatable route : ",mediaType,$(this.refs.main));

        var _this = this;

        var table = $(this.refs.main).DataTable({
    	    language: {
    	        "url": "/modules/architect/plugins/datatables/locales/french.json"
    	    },
    		processing: true,
          serverSide: true,
    	    pageLength: 20,
          language: {
              url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/"+Lang.get('datatables.json')+".json"
          },
    	    ajax: this.getRoute(mediaType),
    	    columns: [
    	        // {data: 'id', name: 'id', width: '40'},
                {data: 'preview', name: 'preview'},
    	        {data: 'uploaded_filename', name: 'uploaded_filename'},
                {data: 'type', name: 'type'},
                {data: 'author', name: 'author'},
    	        {data: 'action', name: 'action', orderable: false, searchable: false}
    	    ],
            initComplete: function(settings, json) {

    	    }
        });
    }

    destroyDatatable() {

      console.log("MediaSelectModal :: destroy datatable ");

      $(this.refs.main).DataTable().destroy();
    }

    refresh()
    {

        console.log("MediaSelectModal :: refresh ");

        var datatable = $(this.refs.main).DataTable();
        datatable.ajax.reload();
    }

    initEvents()
    {
        var _this = this;
        $(document).on('click','.select-media',function(e){
          e.preventDefault();

          _this.setState({
            imageSelected : $(this).data('id')
          });
        });

    }

    componentWillReceiveProps(nextProps)
    {
      if(nextProps.display){
          if(!this.state.isOpen){
            this.setDatatable(nextProps.mediaType);
            this.setState({
              isOpen : true
            });
          }

          this.modalOpen();
      } else {

          if(this.state.isOpen){
            this.destroyDatatable();
            this.setState({
              isOpen : false
            });
          }
          this.modalClose();
      }
    }

    onModalClose(e){
        e.preventDefault();
        //this.modalClose();
        this.props.onImageCancel();
    }

    modalOpen()
    {
        console.log("modalOpen");
        TweenMax.to($("#media-select"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
    }

    modalClose() {
        console.log("modalClose");
      var self =this;
        TweenMax.to($("#media-select"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){
          self.setState({
            imageSelected : null
          });
        }});
    }

    selectImage(e){
      this.setState({
        imageSelected : {
          url : ASSETS+"modules/architect/images/default.jpg"
        }
      })
    }

    handleMediaSelected(media){
      this.props.onImageSelected(media);
    }

    handleImageEdit(e) {
      e.preventDefault();

      this._mediaEditModal.modalOpen(this.state.imageSelected);

    }

    handleEditModalClose() {
      this.refresh();

      this.setState({
        imageSelected : this.state.imageSelected
      });
    }

    renderImages() {

      return (
          <table ref="main" className="table" id="table-medias">
              <thead>
                 <tr>
                     <th></th>
                     <th>{Lang.get('fields.filename')}</th>
                     <th data-filter="select">{Lang.get('fields.tipus')}</th>
                     <th data-filter="select">{Lang.get('fields.author')}</th>
                     <th></th>
                 </tr>
              </thead>
              <tfoot>
                 <tr>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                     <th></th>
                 </tr>
              </tfoot>
          </table>
        );

    }



    render() {

        var zIndex = this.props.zIndex !== undefined ? this.props.zIndex : 10000;

        return (
          <div style={{zIndex:zIndex}}>

            <MediaEditModal
              ref={m => { this._mediaEditModal = m; }}
              onModalClose = {this.handleEditModalClose}
            />

            <div className="custom-modal" id="media-select">
              <div className="modal-background"></div>


                <div className="modal-container">
                    <div className="modal-header">

                        <h2>{Lang.get('fields.select_media')}</h2>

                      <div className="modal-buttons">
                        <a className="btn btn-default close-button-modal" onClick={this.onModalClose}>
                          <i className="fa fa-times"></i>
                        </a>
                      </div>
                    </div>
                  <div className="modal-content">
                    <div className="container">
                      <div className="row">
                        <div className="col-xs-8 grid-col">

                          <div className="grid-items">
                            {this.renderImages()}
                          </div>


                        </div>


                        <div className="col-xs-4 image-col" style={{display: this.state.imageSelected == null ? "block" : "none"}}>
                          <div className="image no-selected medias-dropfiles">
                            <p align="center">
                              <strong>{Lang.get('fields.drag_file')}</strong> <br />
                              <a href="#" className="btn btn-default"><i className="fa fa-upload"></i> {Lang.get('fields.upload_file')} </a>
                            </p>
                          </div>

                          <div className="progress">
                            <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width:'0%'}}>
                              <span className="sr-only"></span>
                            </div>
                          </div>

                        </div>

                        { this.state.imageSelected != null &&
                          <div className="col-xs-4 image-col">
                            <MediaSelectedItem
                              onImageEdit={this.handleImageEdit}
                              selectedItem={this.state.imageSelected}
                              onCancelImage={this.handleCancelImage}
                              onMediaSelected={this.handleMediaSelected}
                            />
                          </div>
                        }

                      </div>
                    </div>

                  </div>
              </div>
              }
            </div>
          </div>
        );
    }
}

export default MediaSelectModal;
