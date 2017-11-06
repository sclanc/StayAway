import React, { Component } from 'react';
import { Form, Input } from 'semantic-ui-react';
import 'react-dates/initialize';
import SearchResult from './Search/SearchResult';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'


class Search extends Component {
  constructor(props) {  
      super(props); 
    this.state = {
          results:[],
          searchParams:{},
          startDate: null,
          endDate: null,
          focusedInput: null,
      }
    this.onChange = (address) => this.setState({ address })
  }
    api = 'http://api.stayrestful.com/search';

    parseQueryString =  (queryString) => {
        queryString = queryString.substring(queryString.indexOf('?')+1).split('&');
        let params = {}, pair, d = decodeURIComponent;
        for (let i = queryString.length - 1; i >= 0; i--) {
            pair = queryString[i].split('=');
            params[d(pair[0])] = d(pair[1] || '');
        }
     return params;
    };

    componentDidMount() {
      let searchParams = this.parseQueryString(this.props.location.search); 
      this.setState({searchParams: searchParams});
      fetch(`${this.api}?lat=${this.state.searchParams.lat}&lng=${this.state.searchParams.lng}&adults=${this.state.searchParams.Adults}&infants=${this.state.searchParams.Infants}&children=${this.state.searchParams.Children}`)
          .then((response) => response.json())
          .then((json) => this.setState({results: json}))
          .catch((error) => console.log(error))
    }

    render() {
      console.log(JSON.stringify(this.state.results))
      const inputProps = {
        value: this.state.address,
        onChange: this.onChange,
        placeholder: 'Location'
      }

      let mapResults = () => {
        let results = this.state.results.map((result) => { return (
          <SearchResult 
            image={result.pictures} 
            price={result.price} 
            rating={result.rating} 
            reviewCount={result.reviewCount} 
            name={result.name} key={result.id}
          />
        )})
        return results 
      }
      return (
        <div className='searchContainer'>
          <div  style={{width:'90%', height: '100%', marginLeft: '5%'}}>
            <div className='resultsContent'>
              <div className='searchContent'>
                <Form>
                  <Form.Group widths='equal'> 
                  <Form.Field>
                    <PlacesAutocomplete inputProps={inputProps}/>
                  </Form.Field>
                  <Form.Field>
                  <DateRangePicker
                    startDate={this.state.startDate} 
                    endDate={this.state.endDate} 
                    onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} 
                    focusedInput={this.state.focusedInput} 
                    onFocusChange={focusedInput => this.setState({ focusedInput })} 
                  />
                  </Form.Field>
                  </Form.Group>
                  <Form.Group widths='equal'>
                    <Form.Input  placeholder='Number of Guests' />
                    <Form.Input  placeholder='Price Range' />
                  </Form.Group>
                  <Form.Button>More Filters</Form.Button>
                </Form>
              </div>
              <div className='resultsContainer'>
                <div className='results'>
                  {mapResults()}
                </div>
              </div>
            </div>
            <div className='mapFrame'>
            </div>
          </div>
        </div>
      );
    }
}

export default Search;


