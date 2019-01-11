import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

class MediaCropModal extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            image : {},
            currentFormat : null
        };

        this.onModalClose = this.onModalClose.bind(this);
        this.setCurrentFormat = this.setCurrentFormat.bind(this);
        this.onCropClose = this.onCropClose.bind(this);
        this.onCropSubmit = this.onCropSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps)
    {
      if(nextProps.display){
          this.modalOpen();
      } else {
          this.modalClose();
      }
    }

    componentDidMount()
    {
      // console.log("MediaEditModal :: open");
      //TO TEST modal
      //this.modalOpen();
    }

    modalOpen()
    {
      TweenMax.to($("#media-crops"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
    }

    modalClose()
    {
      TweenMax.to($("#media-crops"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){
      }});
    }

    onCropClose(event)
    {
      event.preventDefault();

      this.setState({
          currentFormat : null
      })
    }

    onCropSubmit(event)
    {
        event.preventDefault();

        var currentFormat = this.state.currentFormat;
        var index = null;
        this.state.image.formats.map(function(format, i){
            if(currentFormat.name == format.name) {
                index = i;
            }
        });

        var formats = this.state.image.formats;
        formats[index]['data'] = this.refs.cropper.getCroppedCanvas().toDataURL();

        this.setState({
            formats : formats,
            currentFormat : null
        });
    }

    onCropDone()
    {
      // image in dataUrl
      //console.log(this.refs.cropper.getCroppedCanvas().toDataURL());
      //console.log(this.refs.cropper);
    }

    setCurrentFormat(event)
    {
      var id = $(event.target).closest('.crop-item').attr('id');

      this.setState({
          currentFormat : this.state.image.formats[id]
      })
    }

    onModalClose(e)
    {
        e.preventDefault();
        this.props.onModalClose(this.state.image);
    }

    renderFormats()
    {
        return (
          this.state.image.formats.map((format,i) => (
            <div
                id={i}
                className={"crop-item "+(this.state.currentFormat != null && this.state.currentFormat == i ? "selected" : "")}
                key={i}
                onClick={this.setCurrentFormat}
              >
              <div className="crop-info">
                <p className="crop-title">
                  {format.name}
                </p>
                <p className="crop-dimensions">
                  <b>{Lang.get('modals.max_size')}</b>: {format.width}x{format.height} <br/>
                  <b>{Lang.get('modals.ratio')}</b>: {format.ratio}
                </p>
                {format.error != "" &&
                  <p className="error-message">
                    {format.error}
                  </p>
                }
              </div>
              <div className="crop-image" style={{backgroundImage:'url('+format.url+')'}}>
              </div>

            </div>
          ))
        );
    }

    render()
    {
        return (
          <div className="custom-modal" id="media-crops">
            <div className="modal-background"></div>

              <div className="modal-container">
                  <div className="modal-header">

                      <h2>{Lang.get('modals.cut_media')}</h2>

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

                        {this.state.currentFormat != null &&
                            <h3>{this.state.currentFormat.name} {this.state.currentFormat.width}x{this.state.currentFormat.height} ( ratio 1:2 )</h3>
                        }

                        {this.state.currentFormat != null &&
                          <Cropper
                            ref='cropper'
                            src={this.state.image.url}
                            style={{height: $(window).height() - 360, width: '100%'}}
                            // Cropper.js options
                            aspectRatio={this.state.currentFormat.width / this.state.currentFormat.height}
                            guides={false}
                            crop={this.onCropDone.bind(this)}
                          />
                        }

                        {this.state.currentFormat == null &&
                          <div className="original-image" style={{backgroundImage:'url(' + this.state.image.url + ')'}}>
                          </div>
                        }

                        <div className="image-actions">

                          {this.state.currentFormat == null &&
                            <p>
                            {Lang.get('modals.select_right_list')}
                            </p>
                          }

                          {this.state.currentFormat != null &&
                            <div>
                              <a href="" className="btn btn-default" onClick={this.onCropClose}> {Lang.get('fields.cancel')}  </a>
                              <a href="" className="btn btn-primary" onClick={this.onCropSubmit}> {Lang.get('fields.apply')}  </a>
                            </div>
                          }
                        </div>

                      </div>
                      <div className="col-xs-6 content-col">
                          {this.state.image.formats && this.state.image.formats.map((format,i) => (
                            <div
                                id={i}
                                className={"crop-item "+(this.state.currentFormat != null && this.state.currentFormat == i ? "selected" : "")}
                                key={i}
                                onClick={this.setCurrentFormat}
                              >
                              <div className="crop-info">
                                <p className="crop-title">
                                  {format.name}
                                </p>
                                <p className="crop-dimensions">
                                  <b>{Lang.get('modals.max_size')}</b>: {format.width}x{format.height} <br/>
                                  <b>{Lang.get('modals.ratio')}</b>: {format.ratio}
                                </p>
                                {format.error != "" &&
                                  <p className="error-message">
                                    {format.error}
                                  </p>
                                }
                              </div>
                              <div className="crop-image" style={{backgroundImage:'url('+ (format.data ? format.data : format.url) +')'}}>
                              </div>

                            </div>
                            ))}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <a href="" className="btn btn-default" onClick={this.onModalClose}> {Lang.get('fields.back')} </a> &nbsp;
                  </div>

                </div>
            </div>
            }
          </div>
        );
    }
}

export default MediaCropModal;
