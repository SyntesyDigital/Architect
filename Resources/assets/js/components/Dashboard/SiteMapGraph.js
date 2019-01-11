import React, {Component} from 'react';

const r = 7;
const colors = ["#749fb1","#000","#ebfc5b"];

//background, links, nodes, background_node, text
const colorDark = ["#0a0705","#999896","#ffffff","#ffffff"];
const zoomFactor = 0.40;

const highlight_trans = 0.15;

const maxZoom = 7;
const minZoom = 0.25;
const statusColor = {
  "0" : "#ffb102",
  "1" : "#47daa4"
};

export default class SiteMapGraph extends Component {

  constructor(props) {
    super(props);

    console.log("SiteMapGraph :: constrcutor => ",this.props.graph);

    this.graph = Object.assign({}, this.props.graph);
    this.metric = this.props.metric;

    this.ticked = this.ticked.bind(this);
    this.onZoom = this.onZoom.bind(this);

    this.currentZoom = 0.5;

    this.onDragstarted = this.onDragstarted.bind(this);
    this.onDragged = this.onDragged.bind(this);
    this.onDragended = this.onDragended.bind(this);
    this.onClickNode = this.onClickNode.bind(this);
    this.onZoomIn = this.onZoomIn.bind(this);
    this.onZoomOut = this.onZoomOut.bind(this);

  }

  componentDidMount(){

    console.log("SiteMapGraph :: componentDidMount => ");

    this.t = null;

    var width = this.props.width;
    var height = this.props.height;

    this.zoom = d3.zoom()
      .scaleExtent([minZoom, maxZoom])
      //.translateExtent([[-100, -100], [width + 90, height + 100]])
      //.extent([[0, 0], [width, height]])
      .on("zoom", this.onZoom);

    this.svg = d3.select("svg#sitemap-graph").call(this.zoom).on("dblclick.zoom", null)
      .append("g");
    this.link = this.svg.append("g").selectAll("svg#sitemap-graph .link"),
    this.node = this.svg.append("g").selectAll("svg#sitemap-graph .node");
    this.svgContainer = d3.select("svg#sitemap-graph");

    this.simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {return d.id;})
      .distance(r*10)
      //.strength(0.5)
    )
    .force("charge", d3.forceManyBody()
      .strength(-400)
      .distanceMax(r*45)
    )
    //.force("collide", d3.forceCollide(r*1.25))
    .force("center", d3.forceCenter(this.props.width / 2, this.props.height / 2));

    this.update();

    this.initZoom();

  }


  componentWillReceiveProps(nextProps){

    console.log("SiteMapGraph :: componentWillReceiveProps",nextProps);
    //console.log(nextProps);

    //this.setFocus(null);
    d3.selectAll('.node').classed("selected",false);

    if(nextProps.selectedItem != null){

      const selectedId = nextProps.selectedItem;

      //select node
      //console.log("AuthorsGraph :: "+selectedId);
      d3.select('#node-'+selectedId).classed("selected",true);

      //this.centerOnNode(selectedId);

      /*
      this.setState({
        selectedItem : this.getGraphNode(selectedId)
      });
      */

    }
    else {
      //remove selected node
      //console.log("Graph :: componentWillReceiveProps")

      /*
      this.setState({
        selectedItem : null
      });
      */
    }

    if(nextProps.graph != null){
      this.graph = nextProps.graph;
      this.metric = nextProps.metric;
      this.update();
    }

    //this.updateFilters();

  }

  ticked() {

    this.link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    this.node
        .attr("transform", function(d){return "translate("+d.x+","+d.y+")"});

  }

  onDragstarted(d) {
      if (!d3.event.active) this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x;
      d.fy = d.y;
  }

  onDragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }

  onDragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  onClickNode(d) {

    this.props.onAuthorSelected(d.id);
  }

  centerOnNode(id) {
    //center node

    var d = null;

    for(var i=0;i<this.graph.nodes.length;i++){
      if(this.graph.nodes[i].id == id){
        d = this.graph.nodes[i];
        break;
      }
    }

    if(d == null){
      console.error("AuthorGraph :: Center node d = null");
      return;
    }

    var t = d3.zoomTransform(this.svgContainer.node());

    var dcx = (this.props.width/2-d.x*t.k);
    var dcy = (this.props.height/2-d.y*t.k);


    var svgContainer = this.svgContainer;
    var zoom = this.zoom;

    this.svg.transition()
      .duration(1000)
      .attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + t.k + ")")
      .on('end',function(){
        svgContainer.call(zoom.transform, d3.zoomIdentity.translate(dcx,dcy).scale(t.k));

      });
  }


  getColor(d){

    //console.log("getColor :: ",this.props.metric);

    if(this.metric == "status"){
      return this.props.legend[this.metric][d.status].color;
    }
    else if(this.metric == "author"){
      return this.props.legend[this.metric][d.author].color;
    }
    else{
      //primary
      return "#3097D1";
    }
  }

  update(){

    //console.log("update : ");
    //console.log(this.graph);

    // Apply the general update pattern to the nodes.
    this.node = this.node.data(this.graph.nodes, function(d) { return d.id;});
    this.node.exit().remove();

    var self = this;

    this.node = this.node.enter()
      .append("g")
      .merge(this.node);

      this.node.selectAll("*").remove();

      var circles = this.node
        .classed('node',true)
        .attr('id',function(d){
          return "node-"+d.id;
        })
        .call(d3.drag()
          .on("start", this.onDragstarted)
          .on("drag", this.onDragged)
          .on("end", this.onDragended))
        .append("circle")
          .attr("fill", function(d) {
            return self.getColor(d);
          })
          .attr("opacity",1)
          .attr('r',function(d) {
            return r;
          });

      this.node
          .append("text")
          .style("font-size",10)
          .style("font-weight",100)
          //.style("font-family",'Open Sans')
          .attr("dx", 0)
          .attr("dy", 20)
          .attr("text-anchor","middle")
          .text(function(d) { return d.title })
          .style("fill", "#000");

      this.node
      /*
        .append("svg:image")
        .attr("xlink:href",  function(d) { return '/images/josep-sqr.jpg';})
        .attr("clip-path", function(d) {return 'url(#clipCircle-'+d.id+')'})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)
        */
          .on('click',this.onClickNode);


    // Apply the general update pattern to the links.
    //console.log(this.graph.links);
    this.link = this.link.data(this.graph.links, function(d) { return d.source.id + "-" + d.target.id; });
    this.link.exit().remove();
    this.link = this.link.enter().append("line").merge(this.link);

    this.link
      .style("stroke",colorDark[1])
      .attr("class","links")
      .attr("stroke-width", function(d) {
        return 1;
        //return Math.sqrt(d.value);
      });

    // Update and restart the simulation.
    this.simulation.nodes(this.graph.nodes).on("tick", this.ticked);
    this.simulation.force("link").links(this.graph.links);
    this.simulation.alpha(0.5).restart();

  }

  onZoom(){
    this.svg.attr("transform", d3.event.transform);
  }

  getGraphNode(id){
    for(var i=0;i<this.graph.nodes.length;i++){
      if(this.graph.nodes[i].id == id){
        return this.graph.nodes[i];
      }
    }
    console.error("AuthorsGraph :: getGraphNode node is null with id : "+id);
    return null;
  }





  initZoom(){

    var width = this.props.width;
    var height = this.props.height;

    var x = width/2;
    var y = height/2;

    var k =0.7;

    var _this = this;

    this.svg.transition()
      .duration(1000)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .on('end',function(){
        _this.svgContainer.call(_this.zoom.transform, d3.zoomIdentity.translate(width / 2,height / 2).scale(k).translate(-x,-y));
      });

  }

  onZoomIn(e){
    e.preventDefault();

    var width = this.props.width;
    var height = this.props.height;

    var x = width/2;
    var y = height/2;

    this.currentZoom += zoomFactor;

    if(this.currentZoom > maxZoom)
     this.currentZoom = maxZoom;

    var k = this.currentZoom;

    var _this = this;

    this.svg.transition()
      .duration(1000)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .on('end',function(){
        _this.svgContainer.call(_this.zoom.transform, d3.zoomIdentity.translate(width / 2,height / 2).scale(k).translate(-x,-y));
      });

  }


  onZoomOut(e){

    e.preventDefault();

    var width = this.props.width;
    var height = this.props.height;

    var x = width/2;
    var y = height/2;

    this.currentZoom -= zoomFactor;

    if(this.currentZoom < minZoom)
     this.currentZoom = minZoom;

    var k = this.currentZoom;

    var _this = this;

    this.svg.transition()
      .duration(1000)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .on('end',function(){
        _this.svgContainer.call(_this.zoom.transform, d3.zoomIdentity.translate(width / 2,height / 2).scale(k).translate(-x,-y));
      });

  }


  render() {

    return (
      <div>

        <div className="leaflet-top leaflet-right">
          <div className="leaflet-control-zoom leaflet-bar leaflet-control">
            <a className="leaflet-control-zoom-in" href="#" title={Lang.get('fields.zoom_in')} role="button" aria-label="Zoom in" onClick={this.onZoomIn}>+</a>
            <a className="leaflet-control-zoom-out" href="#" title={Lang.get('fields.zoom_out')} role="button" aria-label="Zoom out" onClick={this.onZoomOut}>−</a>
          </div>
        </div>

        <svg id="sitemap-graph" width={this.props.width} height={this.props.height}>
        </svg>
      </div>
    );
  }
}
