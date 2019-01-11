import React, {Component} from 'react';
import { render } from 'react-dom';

import Row from './../RowTypes/Row';
import EmptyItem from './../EmptyItem';
import PageItem from './../PageItem';


class Col extends Component {

  constructor(props){
    super(props);

    console.log("Col :: props => ",props);

  }

  getPathToIndex(index) {
    const pathToIndex = this.props.pathToIndex.slice(0);
    pathToIndex.push(parseInt(index));
    return pathToIndex;
  }

  renderChildren() {

    var children = [];

    if(this.props.data.children != null && this.props.data.children !== undefined &&
       this.props.data.children.length > 0){
      for(var key in this.props.data.children){
          var item = this.props.data.children[key];
          if(item.type == "row"){
            children.push(
              <Row
                key={key}
                index={parseInt(key)}
                childrenLength={this.props.data.children.length}
                onSelectItem={this.props.onSelectItem}
                onColsChanged={this.props.onColsChanged}
                onDeleteRow={this.props.onDeleteRow}
                data={item}
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
          else if(item.type == "item"){
            children.push(
              <PageItem
                key={key}
                childrenLength={this.props.data.children.length}
                data={item}
                pathToIndex={this.getPathToIndex(key)}
                onEditItem={this.props.onEditItem}
                onCopyItem={this.props.onCopyItem}
                onEditClass={this.props.onEditClass}
                onPullDownItem={this.props.onPullDownItem}
                onPullUpItem={this.props.onPullUpItem}
                onDeleteItem={this.props.onDeleteItem}
              />
            );
          }
          else {
            <EmptyItem
              key={key}
              index={key}
              onSelectItem={this.props.onSelectItem}
              pathToIndex={this.props.pathToIndex}
            />
          }

      }
    }
    else {
      children.push(
        <EmptyItem
          key={0}
          index={0}
          onSelectItem={this.props.onSelectItem}
          pathToIndex={this.props.pathToIndex}
        />
      );
    }

    return children;
  }

  onSelectItemAfter(e) {
    e.preventDefault();
    this.props.onSelectItemAfter(this.props.pathToIndex);
  }

  onSelectItemBefore(e) {
    e.preventDefault();
    this.props.onSelectItemBefore(this.props.pathToIndex);
  }

  onEditClass(e) {
    e.preventDefault();

    this.props.onEditClass(this.props);
  }


  render() {

    const childrenLength = this.props.data.children != null && this.props.data.children !== undefined &&
       this.props.data.children.length > 0 ? this.props.data.children.length : 0;

    return (

      <div className={this.props.colClass}>
        <div className="row-container-body-content">

          {!architect.currentUserHasRole('author') &&
            <div className="row-container-body-top">

              {childrenLength > 0 &&
                <a href="" className="btn btn-link" onClick={this.onSelectItemBefore.bind(this)}>
                  <i className="fa fa-plus"></i>
                </a>
              }
              &nbsp;&nbsp;
              <a href="" className="btn btn-link" onClick={this.onEditClass.bind(this)}>
                <i className="fa fa-pencil"></i>
              </a>
            </div>
          }
          {architect.currentUserHasRole('author') &&
            <div className="row-container-body-top"></div>
          }


            {this.renderChildren()}


          {!architect.currentUserHasRole('author') &&
            <div className="row-container-body-bottom">
              {childrenLength > 0 &&
                <a href="" className="btn btn-link" onClick={this.onSelectItemAfter.bind(this)}>
                  <i className="fa fa-plus"></i>
                </a>
              }
            </div>
          }

        </div>
      </div>


    );
  }

}
export default Col;
