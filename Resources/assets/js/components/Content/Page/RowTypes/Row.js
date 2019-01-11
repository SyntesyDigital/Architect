import React, {Component} from 'react';
import { render } from 'react-dom';

import Col from './../ColTypes/Col';
import ColTypeOption from './../ColTypes/ColTypeOption';

class Row extends Component {

  constructor(props){
    super(props);

    //console.log("Row : constructor ",props);

    this.state = {
      colsOpen : false
    };

    this.colTypes = [
      ['col-xs-12'],
      ['col-xs-12 col-sm-6','col-xs-12 col-sm-6'],
      ['col-xs-12 col-sm-4','col-xs-12 col-sm-8'],
      ['col-xs-12 col-sm-8','col-xs-12  col-sm-4'],
      ['col-xs-12  col-sm-4','col-xs-12 col-sm-4','col-xs-12 col-sm-4'],
      ['col-xs-12 col-sm-6 col-md-3','col-xs-12  col-sm-6 col-md-3','col-xs-12  col-sm-6 col-md-3','col-xs-12 col-sm-6 col-md-3'],
      ['col-xs-12 col-sm-offset-1 col-sm-10 columna central']
    ];

    this.deleteRow = this.deleteRow.bind(this);
    this.handleColTypeSelect = this.handleColTypeSelect.bind(this);
    this.toggleColumns = this.toggleColumns.bind(this);

  }

  componentWillReceiveProps(nextProps) {

    //console.log("Row : componentWillRecieveProps ",nextProps);

    this.setState({
      colsOpen : false
    });

  }

  getPathToIndex(index) {
    const pathToIndex = this.props.pathToIndex.slice(0);
    pathToIndex.push(parseInt(index));
    return pathToIndex;
  }

  renderChildren() {

    var children = [];

    if(this.props.data.children != null){
      for(var key in this.props.data.children){
          var item = this.props.data.children[key];
          if(item.type == "col"){
            children.push(
              <Col
                key={key}
                colClass={item.colClass}
                index={parseInt(key)}
                data={item}
                onSelectItem={this.props.onSelectItem}
                onColsChanged={this.props.onColsChanged}
                onDeleteRow={this.props.onDeleteRow}
                pathToIndex={this.getPathToIndex(key)}
                onEditItem={this.props.onEditItem}
                onPullDownItem={this.props.onPullDownItem}
                onPullUpItem={this.props.onPullUpItem}
                onCopyItem={this.props.onCopyItem}
                onEditClass={this.props.onEditClass}
                onDeleteItem={this.props.onDeleteItem}
                onSelectItemBefore={this.props.onSelectItemBefore}
                onSelectItemAfter={this.props.onSelectItemAfter}
              />
            );
          }
      }
    }

    return children;
  }

  deleteRow(e) {

    e.preventDefault();

    var self = this;

    bootbox.confirm({
				message: Lang.get('fields.delete_row_alert'),
				buttons: {
						confirm: {
								label: Lang.get('fields.si'),
								className: 'btn-primary'
						},
						cancel: {
								label: Lang.get('fields.no'),
								className: 'btn-default'
						}
				},
				callback: function (result) {
					if(result){
						self.props.onDeleteRow(self.props.pathToIndex);
					}
				}
		});

  }

  onPullDownItem(e) {
    e.preventDefault();

    this.props.onPullDownItem(this.props.pathToIndex);

  }

  onPullUpItem(e) {
    e.preventDefault();

    this.props.onPullUpItem(this.props.pathToIndex);
  }

  onCopyItem(e) {
    e.preventDefault();

    this.props.onCopyItem(this.props.pathToIndex);
  }

  onEditClass(e) {
    e.preventDefault();

    this.props.onEditClass(this.props);
  }

  toggleColumns(e) {
    e.preventDefault();

    this.setState({
      colsOpen : !this.state.colsOpen
    });
  }

  handleColTypeSelect(cols) {

    var self = this;
    const children = this.props.data.children;

    if(cols.length < children.length ){

      bootbox.confirm({
  				message: Lang.get('fields.less_row_alert'),
  				buttons: {
  						confirm: {
  								label: Lang.get('fields.si'),
  								className: 'btn-primary'
  						},
  						cancel: {
  								label: Lang.get('fields.no'),
  								className: 'btn-default'
  						}
  				},
  				callback: function (result) {
  					if(result){
              self.setColType(cols);
  					}
  				}
  		});
    }
    else {
      self.setColType(cols);
    }
  }

  renderColTypes() {


    return (
      <div className={"col-types-container "+(this.state.colsOpen ? 'open' : '')}>
        <ul>

          {this.colTypes.map((item,index) => (
            <li key={index}>
              <ColTypeOption
                cols={item}
                onSelected={this.handleColTypeSelect}
              />
            </li>
          ))
          }

        </ul>
      </div>
    );

  }

  exploteToObject(fields) {

    if(fields == null){
      return null;
    }

    var result = {};

    for(var i=0;i<fields.length;i++){
      result[fields[i]] = null;
    }
    return result;
  }

  setColType(cols) {

    const children = this.props.data.children;

    if(cols.length < children.length ){
      //join cols
      //TODO como mejora unir las filas para no perder hijos
    }

    console.log("children actual => ",children);

    var resultChildren = [];

    for(var i=0;i<cols.length;i++){
      resultChildren.push({
        type : 'col',
        settings : this.exploteToObject(COL_SETTINGS),
        colClass : cols[i],
        children : children[i] !== undefined && children[i] != null ? children[i].children : []
        //children : []
      });

    }

    console.log("children final => ",resultChildren);

    //var pathToIndex = [];
    //pathToIndex.push(this.props.index);

    //console.log("Row :: setColType : "+this.props.pathToIndex);

    this.props.onColsChanged(this.props.pathToIndex,resultChildren);

  }

  joinChildren() {

    var childrenData = [];

    for(var i=0; i < this.props.data.children.length;i++){
      var col = this.props.data.children[i];

    }



  }


  render() {

    const childrenIndex = this.props.pathToIndex[this.props.pathToIndex.length-1];
    const childrenLength = this.props.childrenLength;
    const isWrapper = this.props.data.wrapper !== undefined ? this.props.data.wrapper : false ;

    return (
      <div className="page-row filled">
        <div className="row-container">
          <div className="row-container-header">

            {!architect.currentUserHasRole('author') &&
              <div className="left-buttons">
                { childrenIndex > 0 &&
                  <a href="" className="btn btn-link" onClick={this.onPullUpItem.bind(this)}>
                    <i className="fa fa-arrow-up"></i>
                  </a>
                }
                {childrenIndex < childrenLength - 1 &&
                  <a href="" className="btn btn-link" onClick={this.onPullDownItem.bind(this)}>
                    <i className="fa fa-arrow-down"></i>
                  </a>
                }
                <a href="" className="btn btn-link" onClick={this.toggleColumns}>
                  <i className="fa fa-columns"></i>
                </a>
              </div>
            }

            {!architect.currentUserHasRole('author') &&
              <div className="right-buttons">
                <a href="" className="btn btn-link" onClick={this.onEditClass.bind(this)}>
                  <i className="fa fa-pencil"></i>
                </a>
                {!isWrapper &&
                  <a href="" className="btn btn-link" onClick={this.onCopyItem.bind(this)}>
                    <i className="fa fa-files-o"></i>
                  </a>
                }
                {!isWrapper &&
                  <a href="" className="btn btn-link text-danger" onClick={this.deleteRow}>
                    <i className="fa fa-trash"></i>
                  </a>
                }
              </div>
            }
          </div>

          {this.renderColTypes()}

          <div className="row-container-body">

            {this.props.data.children != null &&
              <div className="row">
                {this.renderChildren()}
              </div>
            }

          </div>
        </div>
      </div>
    );
  }

}
export default Row;
