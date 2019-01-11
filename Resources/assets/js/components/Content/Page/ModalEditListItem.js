import React, {Component} from 'react';
import { render } from 'react-dom';

// WIDGETS LIST
import CommonWidget from './../Widgets/CommonWidget';
//import TitleImageWidget from './../Widgets/TitleImageWidget';

class ModalEditListItem extends Component {

  constructor(props){
    super(props);

    // console.log(" ModalEditItem :: construct ",props);

    this.widgets = {
        CommonWidget: CommonWidget
    };

    this.state = {
      field : null
    };

    this.onModalClose = this.onModalClose.bind(this);
  }

  processProps(props) {

    //console.log(" ModalEditListItem :: processProps ",props);

    var field = JSON.parse(JSON.stringify(props.item.field));
    //field.identifier = "temp_"+JSON.stringify(props.item.id);
    field.value = field !== undefined && field.value !== undefined ? field.value : null;

    return field;
  }

  componentDidMount() {

    if(this.props.display){
        this.modalOpen();
    }

  }

  componentWillReceiveProps(nextProps)
  {

    //console.log(" ModalEditListItem :: componentWillReceiveProps ",nextProps);

    var field = null;

    if(nextProps.display){
        this.modalOpen();
        field = this.processProps(nextProps);

    } else {
        this.modalClose();
    }

    //console.log("ModalEditListItem :: componentWillReceiveProps :: =>",field);

    this.setState({
      field : field
    });

  }

  onModalClose(e){
      e.preventDefault();
      this.props.onItemCancel();
  }

  modalOpen()
  {
    TweenMax.to($("#modal-edit--list-item"),0.5,{opacity:1,display:"block",ease:Power2.easeInOut});
  }

  modalClose() {

    var self =this;
      TweenMax.to($("#modal-edit--list-item"),0.5,{display:"none",opacity:0,ease:Power2.easeInOut,onComplete:function(){

      }});
  }

  onWidgetChange(field) {

    //const stateField = this.state.field;

    /*
    this.setState({
        field : stateField
    });
    */

    //console.log("ModalEditListItem :: onWidgetChange :: =>",field);

    this.props.onUpdateData(field);

  }

  onSubmit(e) {
    e.preventDefault();

    const field = this.state.field;

    this.props.onSubmitData(field);

  }

  renderWidget() {

    switch(this.state.field.type) {
        case "widget":
            const Widget = this.widgets[this.state.field.component || 'CommonWidget'];
            return (
                <Widget
                    field={this.state.field}
                    hideTab={true}
                    translations={this.props.translations}
                    onWidgetChange={this.onWidgetChange.bind(this)}
                    onContentSelect={this.props.onContentSelect}
                    onImageSelect={this.props.onImageSelect}
                />
            );

      default :
        return null;
    }
  }

  render() {

    return (
      <div className="custom-modal" id="modal-edit--list-item" style={{zIndex:this.props.zIndex}}>
        <div className="modal-background"></div>


          <div className="modal-container">

            {this.state.field != null &&
              <div className="modal-header">

                  <i className={"fa "+this.state.field.icon}></i>
                  <h2>{this.state.field.name} | {Lang.get('modals.edition')}</h2>

                <div className="modal-buttons">
                  <a className="btn btn-default close-button-modal" onClick={this.onModalClose}>
                    <i className="fa fa-times"></i>
                  </a>
                </div>
              </div>
            }

            <div className="modal-content">
              <div className="container">
                <div className="row">
                  <div className="col-xs-8 col-xs-offset-2">

                    {this.state.field != null &&
                      this.renderWidget()}

                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <a href="" className="btn btn-default" onClick={this.onModalClose}> {Lang.get('fields.cancel')} </a> &nbsp;
                <a href="" className="btn btn-primary" onClick={this.onSubmit.bind(this)}> {Lang.get('fields.accept')} </a> &nbsp;
              </div>

            </div>
        </div>
      </div>
    );
  }

}
export default ModalEditListItem;
