import React, { Component } from 'react';
import { Container, Menu, Image, Button, Grid, Header, List, Segment, Icon } from 'semantic-ui-react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import logo from './work-in-progress.jpeg';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="mainSearch">
          <Container>
            <MainMenu/>
            <Header className='mainHeader' size='huge'>Book a Verified, Professionally Managed Home.</Header>
            <SearchRentals/>
          </Container>
        </div>
        <div className='mainInfo'>
          <Header className='infoHeader' size='large' color='red'>What makes a home verified?</Header>
          <List className='infoList' horizontal size={'huge'}>
            <List.Item> 
              <List.Content className='infoText' >
                We work directly with rental communities so you don't have to worry about sneaking around or not feeling welcome.
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content className='infoText' >
                Unlike most booking platforms, we make sure all homes have 24/7 access.
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content className='infoText' >
                We guarantee all homes are hosted and managed in a professional manner.
              </List.Content>
            </List.Item>
          </List>
          <Button basic >LEARN MORE ABOUT OUR VERIFICATION PROCESS </Button>
        </div>
      </div>
    );
  }
}

class MainMenu extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state
    return (
      <Menu pointing secondary color='red'>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
            <Image size='tiny' src={logo}/>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item name='About' active={activeItem === 'About'}  onClick={this.handleItemClick} />
          <Menu.Item name='Contact' active={activeItem === 'Contact'} onClick={this.handleItemClick} />
          <Menu.Item name='Login' active={activeItem === 'Login'} onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
    )
  }
}

class SearchRentals extends Component {
constructor(props) {
    super(props)
    this.state = { 
      address: '',
      Infants:0,
      Children:0,
      Adults:0
      }
    this.onChange = (address) => this.setState({ address })
  }

  handlePersonCounterPlus = (type) => {
    switch(type) {
      case 'Adults': 
        this.setState({Adults:this.state.Adults+1});
        break;
      case 'Children':
        this.setState({Children:this.state.Children+1});
        break;
      case 'Infants':
        this.setState({Infants:this.state.Infants+1});
        break;
      default:
        return;
    }
  }

  handlePersonCounterMinus = (type) => {
    switch(type) {
      case 'Adults': 
        this.setState({Adults:this.state.Adults-1});
        break;
      case 'Children':
        this.setState({Children:this.state.Children-1});
        break;
      case 'Infants':
        this.setState({Infants:this.state.Infants-1});
        break;
      default:
        return;
    }
  }

  searchApiCall = (latLng) => {
    latLng.radius = 30;
    latLng.Adults = this.state.Adults;
    latLng.Children = this.state.Children;
    latLng.Infants = this.state.Infants;
    console.log('Josh, this is what a search object could look like: ', latLng)
  }

  handleSearchSubmit = () => {
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.searchApiCall(latLng))
      .catch(error => console.error('Error', error))
  }
  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: 'Location'
    }
    const classNames = {
      root: '',
      input: 'autocomplete',
      autocompleteContainer: 'maxWidth'
    } 
    const guests = {
      Adults: this.state.Adults,
      Children: this.state.Children,
      Infants: this.state.Infants 
    }
    return (
      <div className='searchMargin'>
        <Grid centered={true} columns={2}>
        <Grid.Column width={3} textAlign={'right'}>
        <PlacesAutocomplete inputProps={inputProps} classNames={classNames}/>
      </Grid.Column>
      <Grid.Column width={3}>
        <PersonPicker guests={guests} plus={this.handlePersonCounterPlus} minus={this.handlePersonCounterMinus}/>
      </Grid.Column>
      <Grid.Column width={2}>
        <Button className='searchButton' color='red' onClick={this.handleSearchSubmit}>
          Search
        </Button>
      </Grid.Column>
      </Grid>
      </div>
    );
  }
}


class PersonPicker extends Component {
  state = {
    showPersonPicker: false,
  }

  render() {
    if(this.state.showPersonPicker) {
      return (
        <div>
          <Button className='guestsButton' onClick={() => this.setState({showPersonPicker: !this.state.showPersonPicker})}>
          Guests 
          <Icon className='floatRight' name='angle down'/>
        </Button>
        <Segment className='personPicker'>
          <PersonCounter 
            type='Adults' 
            total={this.props.guests.Adults} 
            plus={this.props.plus} 
            minus={this.props.minus}
          />
          <PersonCounter 
            type='Children'
            total={this.props.guests.Children} 
            plus={this.props.plus} 
            minus={this.props.minus}
          />
          <PersonCounter 
            type='Infants'
            total={this.props.guests.Infants} 
            plus={this.props.plus} 
            minus={this.props.minus}
          />
        </Segment>
        </div>
      )
    } else {
      return (
        <Button className='guestsButton' onClick={() => this.setState({showPersonPicker: !this.state.showPersonPicker})}>
          Guests
          <Icon className='floatRight' name='angle down'/>
        </Button>
      )
    }
  }
}

const PersonCounter = (props) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={4}>
        <Button className='counterbutton' color='red' icon='minus' onClick={() => props.minus(props.type)}/>  
      </Grid.Column>      
          <Grid.Column width={5}>
            <Grid.Row>
              <Container textAlign='center'>
                {props.total}
              </Container>
            </Grid.Row>
            <Grid.Row>
              <Container textAlign='center'>
                {props.type}
              </Container>
            </Grid.Row>
          </Grid.Column>
        <Grid.Column width={3}>
        <Button className='counterbutton'  color='red' icon='plus' onClick={() => props.plus(props.type)}/>
        </Grid.Column>
      </Grid>
    </div>
  );
}


export default App;
