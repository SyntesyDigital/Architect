import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import LayoutDataTable from './../LayoutDataTable';

class LayoutSelectModal extends Component {

    constructor(props)
    {
        super(props);
    }

    componentDidMount(){

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

    modalOpen()
    {
        TweenMax.to($("#layout-select"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
    }

    modalClose() {
      var self =this;
        TweenMax.to($("#layout-select"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){

        }});
    }

    render() {

        var zIndex = this.props.zIndex !== undefined ? this.props.zIndex : 10000;

        return (
          <div style={{zIndex:zIndex}}>
            <div className="custom-modal" id="layout-select">
              <div className="modal-background"></div>


                <div className="modal-container">
                    <div className="modal-header">

                      <h2>{Lang.get('fields.select_template')}</h2>

                      <div className="modal-buttons">
                        <a className="btn btn-default close-button-modal" onClick={this.onModalClose.bind(this)}>
                          <i className="fa fa-times"></i>
                        </a>
                      </div>
                    </div>
                  <div className="modal-content">
                    <div className="container">
                      <div className="row">
                        <div className="col-xs-12">

                          <LayoutDataTable
                            route={routes["pagelayouts.data"]}
                            onSelectItem={this.props.onLayoutSelected}
                          />

                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <a href="" className="btn btn-default" onClick={this.onModalClose.bind(this)}> {Lang.get('fields.cancel')} </a> &nbsp;
                    </div>

                  </div>

              </div>
            </div>
          </div>
        );
    }
}

export default LayoutSelectModal;
