import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';

export class MapContainer extends Component {
    render() {
        const markers = {};
        if(!this.props.loaded) {
            return <div>Loading...</div>;
        }
        return(
            <Map google={this.props.google} zoom={14} >
                {markers}
            </Map>
        );
    }
}


export default GoogleApiWrapper({
    apiKey: ('AIzaSyBx12OOVwA4FwxZfN4cfxcegSO6ToulU5o')
  })(MapContainer)