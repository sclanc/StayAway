import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react'
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'


class Search extends Component {
  constructor(props) {  
      super(props); 
    this.state = {
          results:[],
          searchParams:{}
      }
    this.onChange = (address) => this.setState({ address })
  }
    api = 'http://stayaway.ga/search';

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
        fetch(`${this.api}?lat=${this.state.searchParams.lat}&lng=${this.state.searchParams.lng}&adults=
${this.state.searchParams.Adults}&infants=${this.state.searchParams.Infants}&children=${this.state.searchParams.Children}`)
            .then((response) => response.json())
            .then((json) => this.setState({results: json}))
            .catch((error) => console.log(error))
    }

//parseInt(this.state.searchParams.lat,10)
//parseInt(this.state.searchParams.lng,10)
    render() {
      console.log(JSON.stringify(this.state.results))
      const inputProps = {
        value: this.state.address,
        onChange: this.onChange,
        placeholder: 'Location'
      }
      const classNames = {
        root: 'searchAutoComplete',
        input: 'searchAutoComplete',
        autocompleteContainer: 'maxWidth'
      } 

      let mapResults = () => {
        let results = this.state.results.map((result) => { return (
          <div>
            <div>
              {result.price}
            </div>
            <div>
              {result.name}
              {result.reviewCount}
            </div>
          </div>
        )})
        return results 
      }
        return (
          <div className='searchContainer'>
            <div  style={{width:'90%', marginLeft: '5%'}}>
              <div className='resultsContent'>
                <div className='searchContent'>
                  <Form>
                    <Form.Group style={{width: '100%', marginLeft: 0}}> 
                    <PlacesAutocomplete inputProps={inputProps} classNames={classNames}/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Input placeholder='Check In' />
                      <Form.Input  placeholder='Check Out' />
                    </Form.Group>
                    <Form.Group widths='equal'>
                      <Form.Input  placeholder='Number of Guests' />
                      <Form.Input  placeholder='Price Range' />
                    </Form.Group>
                    <Form.Button>More Filters</Form.Button>
                  </Form>
                </div>
                <div className='results'>
                  {mapResults()}
                </div>
              </div>
              <div className='mapFrame'>
                <GettingStartedExample/>
              </div>
            </div>
          </div>
        );
    }
}


const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={3}
    defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    onClick={props.onMapClick}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
      />
    ))}
  </GoogleMap>
));

class GettingStartedExample extends Component {

  state = {
    markers: [{
      position: {
        lat: 25.0112183,
        lng: 121.52067570000001,
      },
      key: `Taiwan`,
      defaultAnimation: 2,
    }],
  };

  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  /*
   * This is called when you click on the map.
   * Go and try click now.
   */
  handleMapClick(event) {
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      },
    ];
    this.setState({
      markers: nextMarkers,
    });

    if (nextMarkers.length === 3) {
      this.props.toast(
        `Right click on the marker to remove it`,
        `Also check the code!`
      );
    }
  }

  handleMarkerRightClick(targetMarker) {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
  }

  render() {
    return (
      <div style={{height: `100%`}}>
        <GettingStartedGoogleMap
          containerElement={
            <div style={{ height: `100vh` }} />
          }
          mapElement={
            <div style={{ height: `100vw` }} />
          }
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.state.markers}
          onMarkerRightClick={this.handleMarkerRightClick}
        />
      </div>
    );
  }
}



export default Search;

// actual api call: 
// 