import React, {Component} from 'react';
import { render } from 'react-dom';

class EmptyItem extends Component {

  constructor(props){
    super(props);

  }

  onSelectItem(e) {
    e.preventDefault();

    console.log("EmptyItem :: onSelectItem : "+this.props.index);

    this.props.onSelectItem(this.props.pathToIndex);
  }

  render() {

    return (
      <div className="row empty-item">
          {!architect.currentUserHasRole('author') &&
            <a href="" className="btn btn-link" onClick={this.onSelectItem.bind(this)}>
              <i className="fa fa-plus"></i>
            </a>
          }
      </div>
    );
  }

}
export default EmptyItem;
