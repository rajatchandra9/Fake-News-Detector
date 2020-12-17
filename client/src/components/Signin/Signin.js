import React, { Component } from "react";
import "./Signin.css";
import avtimg from "./avatar.png";

class Signin extends Component{
    constructor(props){
        super(props);
        this.state={
            username:"",
            password:"",
            isValid:true
        };
    }
    handleChange=(evt)=>{
        this.setState({ [evt.target.name]:evt.target.value,isValid:"true"});
    }
    handleSubmit=(evt)=>{
        evt.preventDefault();
        alert(`You are signing as ${this.state.username}`);
        fetch("/signin",{
            method:"post",
            headers: {"Content-Type":'application/json'},
            body: JSON.stringify({
                email:this.state.username,
                password:this.state.password
            })
        })
         .then(response=>response.json())
         .then(result=>{
             if(result.msg==="Successful"){
               // window.location.href=`${window.location.href}/newscene` ;
                this.props.changeSuccess(true);
                this.props.changeCurrentUser(result.data.name,result.data._id);  
                const nextUrl=`${window.location.href}/detect/${result.data._id}`;
                window.history.pushState(null,"",nextUrl);
                window.history.replaceState(null,"",nextUrl);   
             }
             else{
                 this.setState({isValid:false});
                //  alert("Status Code :204 Invalid Credentials! Try again to login");
             }
         })
        this.setState({ username:"",password:""})
    }
    render(){
        return(
            <div style={{backgroundColor:"black"}}>
            <div className="container">               
                    <h2 style={{color:"white"}}>Login to detect fake news</h2>
                    <div className="imgcontainer">
                        <img src={avtimg} alt="Avatar" length={151.91} width={151.91} className="avatar"/>
                    </div>
                    {!this.state.isValid && <h6 style={{color:"red"}}>Invalid Username Aur Password*</h6>}
                    <form onSubmit={this.handleSubmit}>
                    <div className="container">
                        <label htmlFor="username"><b style={{color:"white"}}>Username</b></label>
                        <input 
                         type="text" 
                         placeholder="Enter Username" 
                         name="username" 
                         value={this.state.username}
                         onChange={this.handleChange}
                         />

                        <label htmlFor="password"><b style={{color:"white"}}>Password</b></label>
                        <input 
                         type="password" 
                         placeholder="Enter Password" 
                         name="password" 
                         value={this.state.password}
                         onChange={this.handleChange}
                        />
                        <button type="submit">Login</button>
                        
                        <div>
                        <label style={{color:"white"}}>  
                            <input type="checkbox" defaultChecked name="remember"/> Remember me
                        </label>
                        </div>
                        <span className="psw" style={{color:"white"}}>Forgot <a href="/reset">Password?</a></span>
                    </div>
                </form>
            </div>
            </div>
        );
    }
}
export default Signin;