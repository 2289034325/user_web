import React,{ Component } from "react";

import './Header.css'
import logo from './logo.png'
import {Link} from "react-router-dom";

class Header extends Component{
    constructor(props){
        super(props);
    }
    render() {
        const{user} = this.props;
        return(
            <div className="header-wrapper">
                <div className="header">
                    <a className="logo" href="/">
                        <img src={logo} alt="logo"/>
                    </a>
                    {user &&
                    <div className="user-info">
                        <span>hello </span><span>{user.username}</span>
                    </div>}
                </div>
            </div>
        )
    }
}

export default Header;