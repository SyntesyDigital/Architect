import React, {Component} from 'react';
import { render } from 'react-dom';

class TypologyBar extends Component {

  constructor(props){
    super(props);

  }

  goBack(e)
  {
      e.preventDefault();
      window.history.back();
  }

  render() {
    return (
      <div className="page-bar">
        <div className="container">
          <div className="row">

            <div className="col-md-12">
              <a href={routes['typologies']} className="btn btn-default"> <i className="fa fa-angle-left"></i> </a>
              <h1>
                {this.props.icon != "" &&
                  <i className={"fa "+this.props.icon.value}></i>
                }

                {'\u00A0'}

                { this.props.name != "" ? this.props.name : "Nova tipologia" }
              </h1>

              <div className="float-buttons pull-right">
                <a href="" className="btn btn-primary" onClick={this.props.onSubmitForm}> <i className="fa fa-cloud-upload"></i> &nbsp; {Lang.get('fields.save')} </a>
              </div>

            </div>
          </div>
        </div>
      </div>

    );
  }

}
export default TypologyBar;
