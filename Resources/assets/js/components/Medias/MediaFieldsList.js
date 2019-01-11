import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class MediaFieldsList extends Component {

    constructor(props)
    {
        super(props);

        // Building form stats...
        this.state = {
            fields : props.fields,
            media : props.media,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    loadMedia(media) {
        this.setState({
            media: media,
        });

        if(media.metadata.fields !== undefined) {
            this.setState({
                fields: media.metadata.fields,
            });
        }
    }

    handleChange(event)
    {
        var locale = event.target.name.match(/\[(.*?)\]/i)[1];
        var name = event.target.name.replace('[' + locale + ']','');
        var fields = this.state.fields;
        fields[name][locale].value = event.target.value;

        this.setState({
            fields : fields
        });

        this.props.onHandleChange(event.target);
    }

    renderField(name, type, label)
    {
        // console.log(this.state.fields);

        var field = this.state.fields[name];

        switch(type) {
            case "text":
                return Object.keys(field).map((k) =>
                    <div className="form-group bmd-form-group" key={name + '_' + k}>
                       <input type="text" className="form-control" placeholder={label +' - ' + field[k].label} value={this.state.fields[name][k].value} name={name + '[' + k + ']'} onChange={this.handleChange} />
                    </div>
                );
            break;

            case "textarea":
                return Object.keys(field).map((k) =>
                    <div className="form-group bmd-form-group" key={name + '_' + k}>
                       <textarea className="form-control" id="descriptionCa" placeholder={label + ' - ' + field[k].label} rows="4" name={name + '[' + k + ']'} onChange={this.handleChange} value={field[k].value}></textarea>
                    </div>
                );
            break;
        }
    }

    render()
    {
        return (

          <div>
            <div className="image-info row">
              <div className="col-xs-6">

                <ul>
                  <li>
                    <b>{Lang.get('fields.filename')}</b> : {this.state.media && this.state.media.uploaded_filename}
                  </li>
                  <li>
                    <b>{Lang.get('fields.date')}</b> : {this.state.media && this.state.media.created_at}
                  </li>
                  <li>
                    <b>{Lang.get('fields.author')}</b> : {this.state.media && this.state.media.author.firstname + ' ' + this.state.media.author.lastname}
                  </li>
                </ul>
              </div>
              <div className="col-xs-6">
              <ul>
                <li>
                  <b>{Lang.get('fields.tipus')}</b> : image/jpeg
                </li>
                <li>
                  <b>{Lang.get('fields.original_weight')}</b> :  {this.state.media && this.state.media.metadata.filesize + 'Kb'}
                </li>
                <li>
                  <b>{Lang.get('fields.original_size')}</b> :{this.state.media && this.state.media.metadata.dimension}
                </li>

              </ul>
              </div>

            </div>
            <hr/>

            <div className="media-form">

              <div className="fields-group">
                <label>{Lang.get('fields.legend')}</label>
                {this.renderField('title', 'text', Lang.get('fields.lengend'))}
              </div>

              <div className="fields-group">
                <label>{Lang.get('fields.alternative_text')}</label>
                {this.renderField('alt', 'text', Lang.get('fields.alternative_text'))}
              </div>

              <div className="fields-group">
                <label>{Lang.get('fields.description')}</label>
                {this.renderField('description', 'textarea', Lang.get('fields.description'))}
              </div>

            </div>
          </div>
        );
    }
}

export default MediaFieldsList;
