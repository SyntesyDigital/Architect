import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ContentContainer from './ContentContainer';
import PageContainer from './Page/PageContainer';

export default class ContentForm extends Component {

    constructor(props)
    {
        super(props);

        this.state = {
            typology : props.typology ? JSON.parse(atob(props.typology)) : '',
            authors : props.users ? JSON.parse(atob(props.users)) : '',
            content : props.content ? JSON.parse(atob(props.content)) : '',
            fields : props.fields ? JSON.parse(atob(props.fields)) : '',
            tags : props.tags ? JSON.parse(atob(props.tags)) : '',
            page : props.page ? JSON.parse(atob(props.page)) : '',
            pages : props.pages ? JSON.parse(atob(props.pages)) : '',
            settings : props.settings ? JSON.parse(atob(props.settings)) : '',
            categories : props.categories ? JSON.parse(atob(props.categories)) : '',
            saved : props.content || props.page ? true : false
        };
    }

    componentDidMount()
    {
        // if(this.state.typology) {
        //     this.contentContainer.setState({
        //         typology : this.state.typology
        //     });
        // }
    }

    render() {
        const page = this.state.typology ? false : true;

        return (
            <div>
                {!page &&
                  <ContentContainer
                    authors={this.state.authors}
                    typology={this.state.typology}
                    content={this.state.content}
                    fields={this.state.fields}
                    categories={this.state.categories}
                    tags={this.state.tags}
                    saved={this.state.saved}
                    settings={this.state.settings}
                    ref={(contentContainer) => this.contentContainer = contentContainer}
                />
                }

                {page &&
                  <PageContainer
                    authors={this.state.authors}
                    content={this.state.content}
                    categories={this.state.categories}
                    tags={this.state.tags}
                    page={this.state.page}
                    pages={this.state.pages}
                    settings={this.state.settings}
                    saved={this.state.saved}
                    ref={(contentContainer) => this.contentContainer = contentContainer}
                  />
                }
            </div>
        );
    }
}


if (document.getElementById('content-form')) {
    var element = document.getElementById('content-form');
    var typology = element.getAttribute('typology');
    var users = element.getAttribute('users');
    var content = element.getAttribute('content');
    var fields = element.getAttribute('fields');
    var tags = element.getAttribute('tags');
    var page = element.getAttribute('page');
    var pages = element.getAttribute('pages');
    var categories = element.getAttribute('categories');
    var settings = element.getAttribute('settings');

    ReactDOM.render(<ContentForm settings={settings} page={page} pages={pages} tags={tags} categories={categories} fields={fields} typology={typology} content={content} users={users} />, element);
}
