import React, {Component} from 'react';
import { render } from 'react-dom';

class ColTypeOption extends Component {

  constructor(props){
    super(props);

  }

  renderBars() {
    return (
      this.props.cols.map((item,index) => (
        <div className={"col "+item} key={index}>
          <div className="col-bars"></div>
        </div>
      ))
    );
  }

  render() {

    return (

      <div className="col-icon" onClick={this.props.onSelected.bind(this,this.props.cols)}>
        <div className="row">
          {this.renderBars()}
        </div>
      </div>

    );
  }

}
export default ColTypeOption;
