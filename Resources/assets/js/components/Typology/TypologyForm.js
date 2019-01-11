import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import TypologyModal from './TypologyModal';
import TypologyBar from './TypologyBar';
import TypologyContainer from './TypologyContainer';



export default class TypologyForm extends Component {

    constructor(props)
    {
        super(props);

        // Set translations
        var translations = {};
        LANGUAGES.map(function(v,k){
            translations[v.iso] = true;
        });


        this.state = {
            typology : props.typology ? JSON.parse(atob(props.typology)) : '',
            fieldsList : FIELDS,
            translations: translations,
        };
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

    componentDidMount()
    {
        if(this.state.typology) {
            // Build field list
            var fields = [];
            this.state.typology.fields.map(function(field){
                fields.push({
                    icon : field.icon,
                    id : field.id,
                    label : field.type,
                    name : field.name,
                    identifier : field.identifier,
                    type : field.type,
                    rules : field.rules,
                    settings : field.settings,
                    saved : true,
                    editable : field.type == FIELDS.SLUG.type ? false : true
                });
                //console.log("field text => ",field);
            });
            
            var slug = {};
            if(this.state.typology.attrs) {
                var self = this;
                LANGUAGES.map(function(language){
                    self.state.typology.attrs.map(function(attr){
                        if(attr.name == "slug" && language.id == attr.language_id) {
                            slug[language.iso] = attr.value;
                        }
                    })
                });
            }        
            
            
            
            this.typologyContainer.setState({
                typology : this.state.typology,
                fields : fields,
                icon : this.state.typology.icon,
                inputs : {
                    name: this.state.typology.name,
                    identifier: this.state.typology.identifier,
                    icon: {
                      value : this.state.typology.icon,
                      label : this.state.typology.icon
                    },
                    template: "",
                    slug: Object.keys(slug).length !== 0 ? slug : null,
                    categories: false,
                    tags: false,
                    categories: this.state.typology.has_categories,
                    tags: this.state.typology.has_tags
                }
            });
        }
        else {
          var fields = [];

          //add title
          fields.push({
            icon : FIELDS.TEXT.icon,
            id : 0,
            label : FIELDS.TEXT.name,
            name : "Títol",
            identifier : "title",
            type : FIELDS.TEXT.type,
            rules : this.exploteToObject(FIELDS.TEXT.rules),
      			settings : this.exploteToObject(FIELDS.TEXT.settings),
            saved : false,
            editable : true
          });

          fields[0].rules["required"] = true;
          fields[0].settings["entryTitle"] = true;

          //add slug
          fields.push({
            icon : FIELDS.SLUG.icon,
            id : 1,
            label : FIELDS.SLUG.name,
            name : "Slug",
            identifier : "slug",
            type : FIELDS.SLUG.type,
            rules : this.exploteToObject(FIELDS.SLUG.rules),
      			settings : this.exploteToObject(FIELDS.SLUG.settings),
            saved : false,
            editable : false
          });

          fields[1].rules["required"] = true;
          fields[1].rules["unique"] = true;

          this.typologyContainer.setState({
            fields : fields
          });

        }



        this.typologyContainer.setState({
            fieldsList: this.state.fieldsList
        });
    }

    getSlugFromTypology()
    {
        if(!this.state.typology) {
            return null;
        }

        var slugs = this.state.typology.attrs.filter(function(attr){
            return (attr.name == "slug");
        });

        var _slug = {};
        slugs.map(function(slug){
            return LANGUAGES.map(function(language){
                if(slug.language_id == language.id) {
                    _slug[language.iso] = slug.value;
                }
            });
        });

        return _slug;
    }

    render() {
        return (
            <div>
                <TypologyContainer
                    typology={this.state.typology ? this.state.typology : null}
                    ref={(typologyContainer) => this.typologyContainer = typologyContainer}
                    translations={this.state.translations}
                />
            </div>
        );
    }
}

if (document.getElementById('typology-form')) {
    var element = document.getElementById('typology-form');
    var typology = element.getAttribute('typology');
    var fields = element.getAttribute('fields');
    ReactDOM.render(<TypologyForm fields={fields} typology={typology} />, element);
}
