import React, { Component } from 'react';
import "./Signin/Signin.css";
import ResetThink from "./ResetThink.png";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPass: '',
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
  sendnewPass =(e)=> {
    e.preventDefault();
    const { newPass } = this.state;
    if (newPass === '') {
      this.setState({
        showError: false,
        messageFromServer: '',
        showNullError: true,
      });
    } else {
        const LinkForBack=""+window.location.pathname;
        fetch(LinkForBack,{
            method:"post",
            headers: {"Content-Type":'application/json'},
            body: JSON.stringify({
                newPass:this.state.newPass
            })
        })
        .then(response=>response.json())
        .then(result=>{
            if (result === 'Done'){
                this.setState({
                  showError: false,
                  messageFromServer: 'Done',
                  showNullError: false,
                });
            }
            if(result==="Password enc err"){
                this.setState({
                    showError: true,
                    messageFromServer: 'Password enc err',
                    showNullError: false,
                });
            }
            if (result === 'Unauth'){
                this.setState({
                  showError: true,
                  messageFromServer: 'Unauth',
                  showNullError: false,
                });
            }
            if (result === 'Token not in db'){
                this.setState({
                  showError: true,
                  messageFromServer: "Token Expired",
                  showNullError: false,
                });
            }            
        });
      }
  };

  render() {
    const {newPass, messageFromServer, showNullError, showError} = this.state;
    return (
      <div  className="container">
        <div className="imgcontainer">
            <img src={ResetThink} alt="Avatar" length={151.91} width={151.91} className="avatar"/>
        </div>
        <form onSubmit={this.sendnewPass}>
            <div className="container">
                <label htmlFor="newPass"><b style={{color:"white"}}>New Password</b></label>
                <input 
                    type="text" 
                    placeholder="Enter New Password" 
                    name="newPass" 
                    value={newPass}
                    onChange={this.handleChange}
                />
                <h6 style={{color:"green"}}>The Password Must be of Atleast 6 Characters Long and can be Alpha-Numeric*</h6>
                <button type="submit">Set Password</button>
            </div>
        </form>
        {showNullError && (
          <div>
            <p style={{color:"red"}}>New Password field cannot be Empty.</p>
            <a href="/reset"><button style={{backgroundColor:"greenyellow"}}>REQUEST AGAIN</button></a>
          </div>
        )}
        {(showError && messageFromServer==="Password enc err") && (
          <div>
            <p style={{color:"red"}}>Password encryption error!!</p>
          </div>
        )}
        {(showError && messageFromServer==="Unauth") && (
          <div>
            <p style={{color:"red"}}>Password Invalid!!</p>
          </div>
        )}
        {(showError && messageFromServer==="Token Expired") && (
          <div>
            <p style={{color:"red"}}>Token has expired!!</p>
            <a href="/reset"><button style={{backgroundColor:"greenyellow"}}>REQUEST AGAIN</button></a>  
          </div>
        )}
        {messageFromServer === 'Done' && (
          <div>
            <h3 style={{color:"white"}}>Password has been successfully set!</h3>
          </div>
        )}
      </div>
    );
  }
}

export default ForgotPassword;