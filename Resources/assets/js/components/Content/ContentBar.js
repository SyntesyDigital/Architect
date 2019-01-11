import React, {Component} from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class ContentBar extends Component {

  constructor(props){
    super(props);

    if(props.typologyId != null){
      this.createRoute = routes['contents.create'].replace(':id',props.typologyId);
    }
    else {
      this.createRoute = routes['contents.page.create'];
    }

  }

  duplicate(){
      axios.post('/architect/contents/' + this.props.content.id + '/duplicate', {})
          .then((response) => {
              if(response.data.content) {
                  window.location.href = "/architect/contents/" + response.data.content.id;
              }
          })
          .catch((error) => {
              //console.log(error.config);
          });
  }

  saveLayout(e) {
      e.preventDefault();
      this.props.onLayoutSave != undefined ? this.props.onLayoutSave() : null;
  }

  loadLayout(e) {
      e.preventDefault();
      this.props.onLoadLayout != undefined ? this.props.onLoadLayout() : null;
  }

  onSubmitForm(e) {

    e.preventDefault();

    if(!this.props.saving)
      this.props.onSubmitForm(e);
  }

  renderUnsavedMenu() {




    return (
      <ul className="dropdown-menu dropdown-menu-right default-padding">
          <li className="dropdown-header"></li>
          <li>
              <a href={this.createRoute}>
                  <i className="fa fa-plus-circle"></i>
                  &nbsp;{Lang.get('fields.new')}
              </a>
          </li>
          {this.props.onLoadLayout &&
          <li>
              <a href="#" onClick={this.loadLayout.bind(this)}>
                  <i className="fa fa-download"></i>
                  &nbsp;{Lang.get('modals.load_template')}
              </a>
          </li>
          }
      </ul>
    );
  }

  renderFullMenu() {

    return (
      <ul className="dropdown-menu dropdown-menu-right default-padding">
          <li className="dropdown-header"></li>
          <li>
              <a href={this.createRoute}>
                  <i className="fa fa-plus-circle"></i>
                  &nbsp;{Lang.get('fields.new')}
              </a>
          </li>
          <li>
              <a href="#" onClick={this.duplicate.bind(this)}>
                  <i className="fa fa-files-o"></i>
                  &nbsp;{Lang.get('fields.duplicate')}
              </a>
          </li>

          {this.props.onLoadLayout &&
          <li>
              <a href="#" onClick={this.loadLayout.bind(this)}>
                  <i className="fa fa-download"></i>
                  &nbsp;{Lang.get('modals.load_template')}
              </a>
          </li>
          }

          {this.props.onLayoutSave &&
          <li>
              <a href="#" onClick={this.saveLayout.bind(this)}>
                  <i className="fa fa-upload"></i>
                  &nbsp;{Lang.get('modals.save_template')}
              </a>
          </li>
          }

          <li>
              <a href="#" className="text-danger" onClick={this.props.onDelete}>
                  <i className="fa fa-trash text-danger"></i>
                  &nbsp;
                  <span className="text-danger">{Lang.get('fields.delete')}</span>
              </a>
          </li>
      </ul>
    );

  }

  render() {
    return (
      <div className="page-bar">
        <div className="container">
          <div className="row">

            <div className="col-md-12">
              <a href={routes.contents} className="btn btn-default"> <i className="fa fa-angle-left"></i> </a>
              <h1>
                {this.props.icon != "" &&
                  <i className={"fa "+this.props.icon}></i>
                }
                {'\u00A0'}

                { this.props.name != "" ? this.props.name : Lang.get('modals.new_content') }
              </h1>

              <div className="float-buttons pull-right">


                {!architect.currentUserHasRole('author') &&

                  <div className="actions-dropdown">
                    <a href="#" className="dropdown-toggle btn btn-default" data-toggle="dropdown" aria-expanded="false">
                      Accions
                      <b className="caret"></b>
                      <div className="ripple-container"></div>
                    </a>
                      { this.props.saved && this.props.content !== undefined && this.props.content != null && !architect.currentUserHasRole('author') &&
                        this.renderFullMenu()
                      }

                      { !this.props.saved  &&
                        this.renderUnsavedMenu()
                      }
                  </div>
                }

              {  this.props.saved && this.props.content !== undefined && this.props.content != null &&
                this.props.hasPreview &&
                <a href={routes['previewContent'].replace(':id',this.props.content.id)} target="_blank" className="btn btn-default" > <i className="fa fa-eye"></i> &nbsp; {Lang.get('fields.preview') } </a>
              }
              <a href="" className="btn btn-primary" onClick={this.onSubmitForm.bind(this)} disabled={this.props.saving} > <i className="fa fa-cloud-upload"></i> &nbsp; {Lang.get('fields.save') } </a>
            </div>

            </div>
          </div>
        </div>
      </div>

    );
  }

}
export default ContentBar;
