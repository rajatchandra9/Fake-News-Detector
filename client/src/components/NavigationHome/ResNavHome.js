import React,{Component} from "react";
import {ReactNavbar} from "react-responsive-animate-navbar";
import logo from "./logo.png";

class NavHome extends Component {
  render() {
    return (
      <div style={{alignSelf:"left"}}>
      <ReactNavbar
        color="rgb(0, 0, 100)"
        logo={logo}
        menu={[
          { name: "LOGIN", to: "/signin" },
          { name: "REGISTER", to: "/register" },
          { name: "NEWS FEED", to: "/newsfeed" }
        ]}
        social={[
          {
            name: "Linkedin",
            url: "https://www.linkedin.com/in/nazeh-taha/",
            icon: ["fab", "linkedin-in"],
          },
          {
            name: "Facebook",
            url: "https://www.facebook.com/nazeh200/",
            icon: ["fab", "facebook-f"],
          },
          {
            name: "Instagram",
            url: "https://www.instagram.com/nazeh_taha/",
            icon: ["fab", "instagram"],
          },
          {
            name: "Twitter",
            url: "http://nazehtaha.herokuapp.com/",
            icon: ["fab", "twitter"],
          },
        ]}
      />
      </div>

    );
  }
}
export default NavHome;