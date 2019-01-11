import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class SelectOption extends Component {

    constructor(props)
    {
        super(props);

    }

    handleMouseDown (event) {
  		event.preventDefault();
  		event.stopPropagation();
  		this.props.onSelect(this.props.option, event);
  	}

  	handleMouseEnter (event) {
  		this.props.onFocus(this.props.option, event);
  	}

  	handleMouseMove (event) {
  		if (this.props.isFocused) return;
  		this.props.onFocus(this.props.option, event);
  	}

    render() {

        let gravatarStyle = {
          borderRadius: 3,
          display: 'inline-block',
          marginRight: 10,
          position: 'relative',
          top: -2,
          verticalAlign: 'middle',
        };

        return (
          <div className={this.props.className}
            onMouseDown={this.handleMouseDown}
            onMouseEnter={this.handleMouseEnter}
            onMouseMove={this.handleMouseMove}
            title={this.props.option.title}>
            <i className="fa fa-envelope"></i>
            {this.props.children}
          </div>
        );
    }
}

SelectOption.propTypes = {
    children: PropTypes.node,
  	className: PropTypes.string,
  	isDisabled: PropTypes.bool,
  	isFocused: PropTypes.bool,
  	isSelected: PropTypes.bool,
  	onFocus: PropTypes.func,
  	onSelect: PropTypes.func,
  	option: PropTypes.object.isRequired,
};

export default SelectOption;
