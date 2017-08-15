import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";


class Search extends Component {
    state = {
        results:[],
        searchParams:{}
    }
    api = 'https://stayaway.ga/search';

    parseQueryString =  (queryString) => {
        queryString = queryString.substring(queryString.indexOf('?')+1).split('&');
        let params = {}, pair, d = decodeURIComponent;
        for (let i = queryString.length - 1; i >= 0; i--) {
            pair = queryString[i].split('=');
            params[d(pair[0])] = d(pair[1] || '');
        }
     return params;
    };

    componentWillMount() {
        let searchParams = this.parseQueryString(this.props.location.search); 
        this.setState({searchParams: searchParams});
    }

    componentDidMount() {
        fetch(`http://stayaway.ga/search?lat=70&lng=30&adults=1&infants=0&children=0`)
            .then((response) => response.json())
            .then((json) => this.setState({results: json}))
            .catch((error) => console.log(error))
    }

//parseInt(this.state.searchParams.lat,10)
//parseInt(this.state.searchParams.lng,10)
    render() {
        return (
            <div>
            {JSON.stringify(this.state.results)}
            <GettingStartedGoogleMap
                lat={40.69512}
                lng={-73.98501}
                containerElement={
                <div style={{ height: `100vh` }} />
                }
                mapElement={
                <div style={{ height: `100vw` }} />
                }
                markers={[]}
            />
            </div>
        );
    }
}

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
    onClick={props.onMapClick}
  >
    {props.markers.map((marker, index) => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(index)}
      />
    ))}
  </GoogleMap>
));


export default Search;

// actual api call: 
// ${this.api}?lat=${this.state.searchParams.lat}&lng=${this.state.searchParams.lng}&adults=${
// this.state.searchParams.Adults}&infants=${this.state.searchParams.Infants}&children=${this.state.searchParams.Children}