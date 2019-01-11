import React, {Component} from 'react';
import { render } from 'react-dom';

class SlugInput extends Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      blocked : this.props.blocked,
      //value : this.props.value,
      sourceValue : this.props.sourceValue,
      manualUnblocked : false
    }
  }

  componentWillReceiveProps(nextProps) {

    //console.log("SlugInput ::will recieve props : =>",nextProps);

    var blocked = this.state.blocked;
    var sourceValue = nextProps.sourceValue;
    var changed = false;

    if(!this.state.manualUnblocked && nextProps.blocked != blocked){
      blocked = nextProps.blocked;
      changed = true;
    }

    if(nextProps.sourceValue != this.state.sourceValue && !this.state.blocked){

      var value = nextProps.value;

      //slugify identifier from sourve value

		  value = slugify(sourceValue, {
				replacement: '-',
				remove: /[$*+~.,()'"!\-\?\¿`´:@]/g,
				lower: true
			});

      changed = true;

      this.props.onFieldChange(value);

    }

    if(changed){
      this.setState({
        sourceValue : sourceValue,
        blocked : blocked
      });
    }

    /*
    console.log("SlugInput :: state : ",{
      sourceValue : sourceValue,
      blocked : blocked
    });
    */


  }

  onFieldChange(event){

    //console.log("SlugInput :: onFieldChange : =>",event.target.value, this.state.blocked);

    if(this.state.manualUnblocked || !this.state.blocked){

      var value = slugify(event.target.value, {
				replacement: '-',
				remove: /[$*+~.()'"!:@]/g,
				lower: true
			});

      this.props.onFieldChange(value);
    }
  }

  toggleBlock(event){

    var self = this;

    bootbox.confirm({
				message: Lang.get('modals.edit_slug_alert'),
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
						self.setState({
              blocked : false,
              manualUnblocked : true
            });
					}
				}
		});

  }

  render() {

    //console.log("SlugInput :: render blocked => ",this.state.blocked);

    return (
      <div>
        {!architect.currentUserHasRole('author') &&
        <div className="block-div" onClick={this.toggleBlock.bind(this)} style={{display: this.state.blocked ? 'display' : 'none'}}>
          <i className="fa fa-lock"></i>
        </div>
        }

        {architect.currentUserHasRole('author') &&
        <div className="block-div" style={{display: 'block'}}>
          <i className="fa fa-lock"></i>
        </div>
        }


        <input
          language={this.props.language}
          type="text"
          className={this.props.className}
          name={this.props.name}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.onFieldChange.bind(this)}
        />
      </div>
    )
  }

}
export default SlugInput;
