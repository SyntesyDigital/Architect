import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import SelectedImage from './SelectedImage';
import SelectedFile from './SelectedFile';

class MediaSelectedItem extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
          media : null,
          image : null
        };

        if(props.selectedItem != null){
          this.loadMedia(props.selectedItem);
        }

        this.onSubmit = this.onSubmit.bind(this);

    }

    componentWillReceiveProps(nextProps) {

      if(nextProps.selectedItem != null){
        this.loadMedia(nextProps.selectedItem);
      }
      else {
        this.setState({
          media : null,
          image : null
        });
      }
    }


    loadMedia(mediaId) {

      axios.get('/architect/medias/' + mediaId)
          .then(response => {
              var media = response.data.media;

              if(media.type == "image"){
                var image = {
                    url: '/storage/medias/original/' + media.stored_filename,
                    width: media.metadata.dimension.split('x')[0] ? media.metadata.dimension.split('x')[0] : 0,
                    height: media.metadata.dimension.split('x')[1] ? media.metadata.dimension.split('x')[1] : 0,
                    formats: []
                };
              }

              console.log(media);
              console.log(image);

              this.setState({
                  media: media,
                  image: image
              });
          });

    }

    onSubmit(e) {
      e.preventDefault();
      this.props.onMediaSelected(this.state.media);
    }

    render() {
        return (
          <div>
            {this.state.media != null &&

              <div>

              {this.state.media.type == "image" &&
                <SelectedImage
                  url={this.state.image.url}
                  name={this.state.media.uploaded_filename}
                  dimension={this.state.media.metadata.dimension}
                  filesize={this.state.media.metadata.filesize+" KB"}
                  author={this.state.media.author.firstname+" "+this.state.media.author.lastname}
                  onEdit={this.props.onImageEdit}
                />
              }

              {this.state.media.type == "application" &&
                <SelectedFile
                  name={this.state.media.uploaded_filename}
                  author={this.state.media.author.firstname+" "+this.state.media.author.lastname}
                />
              }

              </div>

            }
            {this.state.media != null &&
              <div className="col-footer">
                <a href="" className="btn btn-default" onClick={this.props.onCancelImage}> {Lang.get('fields.cancel')} </a> &nbsp;
                <a href="" className="btn btn-primary" onClick={this.onSubmit}> {Lang.get('fields.add')} </a>
              </div>
            }
          </div>
        );
    }
}

export default MediaSelectedItem;
