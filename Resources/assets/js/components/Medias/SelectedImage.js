import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class SelectedImage extends Component {

    constructor(props)
    {
        super(props);
    }

    render() {
        return (
          <div className="image-container">
            <div className="image" style={{backgroundImage:"url("+this.props.url+")"}} ></div>

            {/*
            <a href="" className="btn btn-default"><i className="fa fa-pencil"></i> Editar</a>
            */}

            <ul>
              <li>
                <b>{Lang.get('fields.filename')}</b> : {this.props.name}
              </li>
              {/*
              <li>
                <b>Llegenda</b> : Lleganda de la imatge
              </li>
              */}
              <li>
                <b>{Lang.get('fields.original_size')}</b> : {this.props.dimension}
              </li>
              <li>
                <b>{Lang.get('fields.original weight')}</b> : {this.props.filesize}
              </li>
              <li>
                <b>{Lang.get('fields.author')}</b> : {this.props.author}
              </li>
              <li>
                <a href="" className="btn btn-link" onClick={this.props.onEdit}><i className="fa fa-pencil"></i> {Lang.get('fields.edit')}</a>
                {/*
                <a href="" className="btn btn-link text-danger"><i className="fa fa-trash"></i> Esborrar</a>
                */}
              </li>
            </ul>
          </div>
        );
    }
}

export default SelectedImage;
