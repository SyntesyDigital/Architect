import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ContentDataTable from './ContentDataTable';

class ContentSelectModal extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
          contentSelected : null,
          isOpen : false,
        };

        this.onModalClose = this.onModalClose.bind(this);
        this.handleSelectItem = this.handleSelectItem.bind(this);
    }

    componentWillReceiveProps(nextProps)
    {
      if(nextProps.display){
          this.modalOpen();
      } else {
          this.modalClose();
      }
    }

    onModalClose(e){
        e.preventDefault();
        this.props.onContentCancel();


    }

    componentDidMount(){
      //this.modalOpen();
    }

    processContent(content) {

      var data = {
        id : content.id,
        title : content.title
      };

      if(!content.is_page){
        data["typology"] = {
          id : content.typology.id,
          name : content.typology.name,
          icon : content.typology.icon
        };
      }

      return data;
    }

    handleSelectItem(item){

      console.log("ContentSelectModal :: handleSelectItem => ",item);

      if(item != null){
        this.props.onContentSelected(this.processContent(item));
      }
    }

    modalOpen()
    {
        TweenMax.to($("#content-select"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
        this.setState({
          isOpen : true
        });
    }

    modalClose() {
      var self =this;
        TweenMax.to($("#content-select"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){
          self.setState({
            imageSelected : null,
            isOpen : false
          });
        }});
    }

    getModalRoute() {

      const field = this.props.field;

      console.log("handleContentSelect => ContentSelectModal :: this.props.field => ",field);

      var route = routes["contents.data"];

      if(field != null){
        if(field.type == "link" || field.type == "url"){
          return route+'?is_page=1&has_slug=1';
        }
        else if(field.type == "widget" || field.type == "contents"){
          if(field.settings !== undefined && field.settings != null
            && field.settings.typologyAllowed !== undefined && field.settings.typologyAllowed != null){
            return route+'?typology_id='+field.settings.typologyAllowed;
          }
        }
      }

      return route;

    }


    render() {

        var zIndex = this.props.zIndex !== undefined ? this.props.zIndex : 10000;
        //only linkable contents
        var route = this.getModalRoute();

        console.log("ContentSelectModal :: Field => ",this.props.field,route);

        return (
          <div style={{zIndex:zIndex}}>
            <div className="custom-modal" id="content-select">
              <div className="modal-background"></div>


                <div className="modal-container">
                    <div className="modal-header">

                        <h2>{Lang.get('fields.select_content')}</h2>

                      <div className="modal-buttons">
                        <a className="btn btn-default close-button-modal" onClick={this.onModalClose}>
                          <i className="fa fa-times"></i>
                        </a>
                      </div>
                    </div>
                  <div className="modal-content">
                    <div className="container">
                      <div className="row">
                        <div className="col-xs-12">

                            <ContentDataTable
                              init={this.state.isOpen}
                              route={route}
                              onSelectItem={this.handleSelectItem}
                            />

                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <a href="" className="btn btn-default" onClick={this.onModalClose}> {Lang.get('modals.cancel')}</a> &nbsp;
                    </div>

                  </div>

              </div>
            </div>
          </div>
        );
    }
}

export default ContentSelectModal;
