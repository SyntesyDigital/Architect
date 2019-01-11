import React, {Component} from 'react';
import { render } from 'react-dom';

import TypologyDropZone from './TypologyDropZone';


class TypologyFields extends Component {

  render() {
    return (
      <div className="col-md-9 page-content">

        <TypologyDropZone />

      </div>
    );
  }

}
export default TypologyFields;
