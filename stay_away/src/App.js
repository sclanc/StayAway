import React, { Component } from 'react';
import { Container, Menu, Image, Button, Grid, Header, List, Segment, Icon, Input } from 'semantic-ui-react'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import logo from './logo.png';
import './App.css';
import Search from './Search';
import About from './About';
import 'semantic-ui-css/semantic.min.css'
import { Route, Switch } from 'react-router-dom'

class App extends Component {
  state = {
    Modalopen: false,
    user: {}
  }

  RenderLoginModal = () => {
    this.setState({Modalopen: true});
  }

  CloseLoginModal = () => {
    this.setState({Modalopen: false})
  }

  login = (credentials) => {
    fetch('http://stayaway.ga/login', {
       method: 'POST', 
       headers: {    
         "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
       },
       body: `username=${credentials.username}&password=${credentials.password}`  
      }).then(res => res.json())
        .then(json => this.setState({user: json}))
        .catch( e => console.log(e))
  }   

  render() {
    return (
      <div>
        {this.state.Modalopen ? <LoginModal open={this.state.Modalopen} close={() => this.CloseLoginModal()}  login={this.login}/> : null}
        <Route render={({ history }) => (
          <MainMenu 
           handleItemClick={(route)=>{history.push(route)}}
           activeItem={window.location.hash}
           RenderLoginModal= {() => this.RenderLoginModal()}
          />
          )}/>
        <Main/>
      </div>
    )
  }
}


class Main extends Component {
  render() {
    return (
    <Switch>
      <Route exact path='/' render={({ history }) => (
        <Home handleItemClick={(route)=>{history.push(route)}}/>
      )}/>
      <Route path='/About' component={About} />
      <Route path='/Search' component={Search}/>
    </Switch>
    )
  }
}

class Home extends Component {
  render() {
    return (
      <div className="App">
        <div className="mainSearch">
          <Container>
            <Header className='mainHeader' size='huge'>Book a Verified, Professionally Managed Home.</Header>
            <SearchRentals handleItemClick={(route) => this.props.handleItemClick(route)}/>
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

class MainMenu  extends Component {

  render() {
    return (
      <div>
        <Menu className={'MainMenu'} pointing secondary color='red'>
          <Menu.Item name='home' active={this.props.activeItem === '#/'} onClick={() => this.props.handleItemClick('/')}>
              <Image size='small' src={logo}/>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item name='About' active={this.props.activeItem === '#/About'}  onClick={() => this.props.handleItemClick('/About')} />
            <Menu.Item name='Contact' active={this.props.activeItem === '#/Contact'} onClick={() => this.props.handleItemClick('/Contact')} />
            <Menu.Item name='Login' active={this.props.activeItem === '#/Login'} onClick={() => this.props.RenderLoginModal()} />
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}

class LoginModal extends Component {
  state = {
    username: 'sean',
    password: 'password1',
  }
  processLogin = () =>  {
    this.props.login({username: this.state.username, password: this.state.password});
    this.props.close();
  }

  handleChange = (event,input) => {
    input === 'username' ? this.setState({username: event.target.value}) : 
    this.setState({password: event.target.value}) 
  }

  render() {
    return (
      <div className='loginModalBackground'>
        <div className='loginModal'>
           <Input placeholder='Username' onChange={ (event) => this.handleChange(event,'username')}/>
           <Input placeholder='Password' onChange={(event) => this.handleChange(event, 'password')} />
           <br/>
            <Button color='black' content='Cancel' onClick={() => this.props.close()}/>
            <Button color='red' content="Log in" onClick={() => this.processLogin()} />
        </div>
      </div>
    );
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
    switch(true) {
      case type === 'Adults' && this.state.Adults - 1 >= 0: 
        this.setState({Adults:this.state.Adults-1});
        break;
      case type === 'Children' && this.state.Children - 1 >= 0:
        this.setState({Children:this.state.Children-1});
        break;
      case type === 'Infants' && this.state.Infants - 1 >= 0:
        this.setState({Infants:this.state.Infants-1});
        break;
      default:
        return;
    }
  }

  buildSearchURL = (latlng) => {
    let queryString = 
    `/Search?lat=${latlng.lat}&lng=${latlng.lng}&radius=${20}&Adults=${this.state.Adults}&Children=${this.state.Children}&Infants=${this.state.Infants}`
    console.log(queryString)
    this.props.handleItemClick(queryString)
  }

  handleSearchSubmit = () => {
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.buildSearchURL(latLng))
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



//stayrestful.com/search/Children=0&Adults=1&Infants=2&lat=1&long=1&
//stayrestful.com/apt/#

//negative number bug
