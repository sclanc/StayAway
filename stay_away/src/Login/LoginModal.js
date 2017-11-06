import React, { Component } from 'react'
import { Button,Input } from 'semantic-ui-react'
import onClickOutside from 'react-onclickoutside'
import './Login.css';

class LoginModal extends Component {
    handleClickOutside = (event) => {
        this.props.close();
    };
    render() {
        return (
            <div className='loginModal'>
                <div className='loginTitle'>
                    <span>Log In</span>
                </div>
                <div className='loginForm'>
                    <Input className='loginField' placeholder='Username' onChange={ (event) => this.props.handleChange(event,'username')}/>
                    <Input className='loginField' placeholder='Password' onChange={(event) => this.props.handleChange(event, 'password')} />
                    <Button className='loginSubmit' color='red' content="Log in" onClick={() => this.props.login()} />
                </div>
                <div className='loginTerms'>
                    <a className='termsLink' href='#'>view terms and conditions</a>
                </div>
            </div>
        );
    }
  }

  export default onClickOutside(LoginModal);