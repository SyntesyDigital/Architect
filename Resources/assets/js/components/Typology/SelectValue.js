import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const stringOrNode = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.node,
]);

class SelectValue extends Component {

    constructor(props)
    {
        super(props);

    }

    render() {

        var gravatarStyle = {
          borderRadius: 3,
          display: 'inline-block',
          marginRight: 10,
          position: 'relative',
          top: -2,
          verticalAlign: 'middle',
        };

        return (
          <div className="Select-value" title={this.props.value.title}>
    				<span className="Select-value-label">
    					<i className="fa fa-envelope"></i>
    					{this.props.children}
    				</span>
    			</div>
        );
    }
}

SelectValue.propTypes = {
    children: PropTypes.node,
    placeholder: stringOrNode,
    value: PropTypes.object
};

export default SelectValue;
