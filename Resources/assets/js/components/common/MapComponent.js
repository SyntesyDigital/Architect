import React, {Component} from 'react';
import { render } from 'react-dom';

import { Map, Marker, TileLayer } from 'react-leaflet';

const stamenTonerTiles = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const stamenTonerAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const mapCenter = [41.3850639, 2.1734];
const zoomLevel = 12;

class MapComponent extends Component
{
  constructor(props)
  {
    super(props);

    var markerPosition = {
      lat: 41.38641962447808,
      lng: 2.16962680220604,
    };

    if(props.markerPosition != null && props.markerPosition.lat !== undefined
      && props.markerPosition.lat != ""){
      markerPosition = props.markerPosition;
    }

    this.state = {
      center: markerPosition,
      markerPosition : markerPosition,
      zoom: 13,
      draggable: true,
    };

    this.updatePosition = this.updatePosition.bind(this);

  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;

    setTimeout(function(){
        leafletMap.invalidateSize();
    },1000);

  }

  updatePosition(event) {

    //console.log(event.target.getLatLng());
    this.props.onLatLngChange(event.target.getLatLng());

    //var latLng = event.target.getLatLng();
  }


  render() {

    const position = [this.state.center.lat, this.state.center.lng]

    var markerPosition = this.state.markerPosition;
    if(this.props.markerPosition != null && this.props.markerPosition.lat !== undefined
      && this.props.markerPosition.lat != ""){
      markerPosition = this.props.markerPosition;
    }

    var customIcon = L.icon({
        iconUrl: ASSETS+'modules/architect/images/marker-icon.png',
        shadowUrl: ASSETS+'modules/architect/images/marker-shadow.png',

        iconSize:     [25, 41], // size of the icon
        shadowSize:   [41, 41], // size of the shadow
        iconAnchor:   [12, 40], // point of the icon which will correspond to marker's location
        shadowAnchor: [12, 40],  // the same for the shadow
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    return (
      <div className="map-container">
          <Map
              center={position}
              zoom={this.state.zoom}
              ref={m => { this.leafletMap = m; }}
          >
              <Marker
                draggable={this.state.draggable}
                onDragend={this.updatePosition}
                position={markerPosition}
                icon={customIcon}
                ref={m => { this.refmarker = m; }}
              />
              <TileLayer
                  attribution={stamenTonerAttr}
                  url={stamenTonerTiles}
              />
          </Map>
      </div>
    );
  }

}
export default MapComponent;
