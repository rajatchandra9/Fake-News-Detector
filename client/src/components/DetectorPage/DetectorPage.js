import React,{ Component } from 'react';
import Navigation from '../Navigation/Navigation';
import Logo from "../Logo/Logo";
import ImageLinkForm from '../ImageLinkForm/ImageLinkForm';

class DetectorPage extends Component{
    render(){
        return(
            <div>
                <Navigation changeCurrentUser={this.props.changeCurrentUser} changeSuccess={this.props.changeSuccess}/>
                <h1 style={{color:"white"}}>Hi,{this.props.currentUser},We Thank You For Being A Part Of Our Community </h1>
                <Logo />
                <ImageLinkForm />
            </div>
        );
    }
}
export default DetectorPage;