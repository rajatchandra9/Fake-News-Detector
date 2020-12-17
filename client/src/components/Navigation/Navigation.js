import React, { Component } from "react";

class Navigation extends Component {
    handleClick=(evt)=>{
        window.history.replaceState("/signin");
        this.props.changeCurrentUser("","");
        this.props.changeSuccess(false);
    }
    render(){
        return (
            <nav style={{display: "flex", justifyContent:"flex-end"}}>
                <h3 onClick={this.handleClick} style={{cursor:"pointer",color:"green"}}><a href="/signin">Sign Out</a></h3>
            </nav>
        );
    }
}
export default Navigation;