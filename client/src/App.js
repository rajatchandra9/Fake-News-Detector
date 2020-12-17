import React,{ Component } from 'react';
import './App.css';
import NewsApiConnector from './components/NewsApiConnector/NewsApiConnector';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import NavigationHome from './components/NavigationHome/NavigationHome';
import { Redirect, Route, Switch } from "react-router-dom";
import DetectorPage from './components/DetectorPage/DetectorPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from "./components/ResetPassword";
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loginsuccess:false,
      signedInAs:{
        name:"",
        id:""
      }
    };
  }
  componentDidMount(){
    fetch("/")
    .then(response=>response.json())
    .then(console.log);
    if(window.location.pathname==="/"){
      window.location.replace("https://fakenewsdetectorbyhra.herokuapp.com/signin");
    }
  }
  
  changeLoginSucces=(t)=>{
    this.setState({loginsuccess:t})
  }
  changeCurrentUser=(name,id)=>{
    this.setState({
      signedInAs:{
        name:name,
        id:id
      }
    });
  }
  render(){
    return (
      <div style={{display: "flex",flexDirection: "column"}} className="App">
        <NavigationHome/>
        {this.state.loginsuccess && this.state.signedInAs.name!=="" ? <DetectorPage currentUser={this.state.signedInAs.name} changeCurrentUser={this.changeCurrentUser} changeSuccess={this.changeLoginSucces}/> :
        <div style={{alignContent:"center"}}>
        <Switch>
          <Route exact path="/signin" render={()=><Signin changeSuccess={this.changeLoginSucces} changeCurrentUser={this.changeCurrentUser}/>}/>
          <Route exact path="/register" component={Register}/>
          <Route exact path="/newsfeed" component={NewsApiConnector}/>
          <Route exact path="/reset/:id" component={ResetPassword}/>
          <Route exact path="/reset" component={ForgotPassword}/>
          <Route render={()=><Redirect to="https://fakenewsdetectorbyhra.herokuapp.com/signin"/>}/>
        </Switch>
        </div>
        }
        {/*<NewsApiConnector/>*/}
      </div>
    );
  }
}
export default App;