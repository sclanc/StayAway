import React, { Component } from 'react';
import LoginModal from './LoginModal';
import './Login.css';

class Login extends Component {
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
          <LoginModal 
            handleChange={(event, input) => this.handleChange(event, input)}
            close={ () => this.props.close()}
            login={ () => this.processLogin()}
          />
        </div>
      );
    }
  }

  export default Login;