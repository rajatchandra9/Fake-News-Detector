import React, { Component } from 'react';
import "./Signin/Signin.css";
import forgotpanic from "./forgotpanic.png";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      showError: false,
      messageFromServer: '',
      showNullError: false,
    };
  }
  handleChange=(event)=>{
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  sendEmail =(e)=> {
    e.preventDefault();
    const { email } = this.state;
    if (email === '') {
      this.setState({
        showError: false,
        messageFromServer: '',
        showNullError: true,
      });
    } else {
        console.log(window.location.href);
        fetch("/reset",{
            method:"post",
            headers: {"Content-Type":'application/json'},
            body: JSON.stringify({
                email:this.state.email,
                linkForReset:window.location.href
            })
        })
        .then(response=>response.json())
        .then(result=>{
            if (result === 'recovery email sent') {
                this.setState({
                  showError: false,
                  messageFromServer: 'recovery email sent',
                  showNullError: false,
                });
              }
              if (result === 'email not in db') {
                  console.log("nhi hai nhi");
                this.setState({
                  showError: true,
                  messageFromServer: '',
                  showNullError: false,
                });
              }             
        });
      }
  };

  render() {
    const {email, messageFromServer, showNullError, showError} = this.state;
    return (
      <div  className="container">
        <div className="imgcontainer">
            <img src={forgotpanic} alt="Avatar" length={151.91} width={151.91} className="avatar"/>
        </div>
        <form onSubmit={this.sendEmail}>
            <div className="container">
                <label htmlFor="email"><b style={{color:"white"}}>Email Address</b></label>
                <input 
                    type="text" 
                    placeholder="Enter Email Address" 
                    name="email" 
                    value={email}
                    onChange={this.handleChange}
                />
                <button type="submit">Send me a password reset email</button>
            </div>
        </form>
        {showNullError && (
          <div>
            <p style={{color:"white"}}>The email address cannot be null.</p>
          </div>
        )}
        {showError && (
          <div>
            <p style={{color:"white"}}>That email address isn't recognized. Please try again or register for a new account.</p>
            <a href="/register"><button style={{backgroundColor:"greenyellow"}}>REGISTER</button></a>
          </div>
        )}
        {messageFromServer === 'recovery email sent' && (
          <div>
            <h3 style={{color:"white"}}>Password Reset Email Successfully Sent!</h3>
          </div>
        )}
      </div>
    );
  }
}

export default ForgotPassword;