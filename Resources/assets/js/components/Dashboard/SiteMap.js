import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import SiteMapGraph from './SiteMapGraph';

export default class SiteMap extends Component {

    constructor(props)
    {
        super(props);

        this.legend = null;
        this.state = {
          items : null,
          selectedItem : null,
          selectedInfo : null,
          metric : 'status'
        };
    }

    componentDidMount() {

      var self = this;

      axios.get(ASSETS+'architect/contents/pages-tree')
        .then(response => {
          var items = [];

          if(response.status == 200 && response.data !== undefined){
              items = response.data;
              self.setupLegend(items);
          }

          self.setState({
            items : items
          });

        })
         .catch(function (error) {
           console.log(error);
         });

    }

    onItemClick(item,e) {
      e.preventDefault();

      //console.log("Table :: onItemClick => ",item,e);

      window.location.href = routes['showContent'].replace(':id',item.id);
    }

    handleItemSelected(itemId) {

      this.setState({
        selectedItem : itemId,
        selectedInfo : this.getGraphNode(itemId)
      });

      //TODO mostrar información sobre el nodo
      console.log("handleItemSelected => ",this.state.selectedInfo);
    }

    getGraphNode(id){
      for(var i=0;i<this.state.items.nodes.length;i++){
        if(this.state.items.nodes[i].id == id){
          return this.state.items.nodes[i];
        }
      }
      console.error("SiteMap :: getGraphNode node is null with id : "+id);
      return null;
    }

    onMetricChange(e){
      this.setState({
        metric : e.target.value
      });
    }

    setupLegend(items){

      var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      console.log("colorScale => ",colorScale(0));

      this.legend = {
        "status" : {
          "0" : {
            "name" : Lang.get('fields.draft'),
            "color" : "#ffb102",
            "values" : 0
          },
          "1" : {
            "name" : Lang.get('fields.published'),
            "color" : "#47daa4",
            "values" : 0
          }
        },
        "author" : {}
      };

      for(var i=0;i<items.nodes.length;i++){
        if(this.legend.author[items.nodes[i].author] === undefined){
          this.legend.author[items.nodes[i].author] = {
            "name" : items.nodes[i].author,
            "color" : colorScale(Object.keys(this.legend.author).length),
            "values" : 1
          };
        }
        else {
          this.legend.author[items.nodes[i].author].values ++;
        }

        this.legend.status[items.nodes[i].status].values ++;
      }

      console.log("SiteMap :: legend => ",this.legend);

    }

    renderLegend() {
      var result = [];
      var legend = this.legend[this.state.metric];


      for(var key in legend){
        result.push(
          <li key={key}>
            <i className="fa fa-circle" style={{color:legend[key]['color']}}></i>
            {legend[key]['name']} ({legend[key]['values']})
          </li>
        )
      }

      return result;

    }

    render() {
        return (

            <div className="dashboard-graph">
              <div className="dashboard-header">
                {Lang.get('home.map')}
                <div className="actions">
                  {/*
                  <a href="" className="btn btn-link">
                    <i className="fa fa-arrows-alt"></i>
                  </a>
                  */}
                </div>
              </div>
              <div className="dashboard-body">
                <div className="col-xs-3 sidebar">
                  <div className="form-group bmd-form-group">
                    <label htmlFor="parent_id" className="bmd-label-floating">{Lang.get('home.grouped')}</label>
                    <select className="form-control" value={this.state.metric} onChange={this.onMetricChange.bind(this)}>
                      <option value="status">{Lang.get('home.status')}</option>
                      <option value="author">{Lang.get('home.author')}</option>
                    </select>
                  </div>


                  <div className="legend">
                    <ul>
                      {this.state.items != null &&
                        this.renderLegend()
                      }
                    </ul>
                  </div>

                  {this.state.selectedInfo != null &&
                  <div className="item-info">
                    <ul>
                      <li><b>{Lang.get('home.name')}</b> : {this.state.selectedInfo.title}</li>
                      <li><b>{Lang.get('home.status')}</b> : {this.legend.status[this.state.selectedInfo.status].name}</li>
                      <li><b>{Lang.get('home.author')}</b> : {this.state.selectedInfo.author}</li>
                      <li><b>{Lang.get('home.url')}</b> : {this.state.selectedInfo.url}</li>
                      <li>
                        <a href={this.state.selectedInfo.url} target="_blank"><i className="fa fa-eye"></i> {Lang.get('home.view')}</a> |
                        &nbsp;<a href={"/architect/contents/"+this.state.selectedInfo.id} target="_blank"><i className="fa fa-pencil"></i> {Lang.get('home.edit')}</a>
                      </li>
                    </ul>
                  </div>
                  }

                </div>
                <div className="col-xs-9 graph-wrapper">
                  {this.state.items != null &&
                    <SiteMapGraph
                      graph={this.state.items}
                      metric={this.state.metric}
                      width={$(".graph-wrapper").width()}
                      height={460}
                      legend={this.legend}
                      selectedItem={this.state.selectedItem}
                      onAuthorSelected={this.handleItemSelected.bind(this)}
                    />
                  }
                </div>
              </div>
          </div>
        );
    }
}

if (document.getElementById('dashboard-sitemap')) {

    document.querySelectorAll('[id=dashboard-sitemap]').forEach( element => {

      ReactDOM.render(<SiteMap

        />, element);
    });
}
