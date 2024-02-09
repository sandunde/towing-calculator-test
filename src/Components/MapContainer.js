import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapComponent extends Component {
  render() {
    const mapStyles = {
      width: '50%',
      height: '50%',
    };

    return (
      <Map
        google={this.props.google}
        zoom={12}
        style={mapStyles}
        initialCenter={{ lat: 44.9778, lng: -93.2650 }}
      >
        <Marker position={{ lat: 44.9778, lng: -93.2650 }} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyD1-kK-XpZFXmP9H3IoCRMr2qtblWLp1tE',
})(MapComponent);
