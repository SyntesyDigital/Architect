import React, {Component} from 'react';
import { render } from 'react-dom';

class FirstEmptyRow extends Component {

  constructor(props){
    super(props);

  }


  render() {

    return (
      <div className="page-row add-row-block">
        <a href="" className="btn btn-default" onClick={this.props.onAddRow}>
          <i className="fa fa-plus-circle"></i> {Lang.get('fields.add_row')}
        </a>
      </div>
    );
  }

}
export default FirstEmptyRow;
