import React, {Component} from "react";

import logo from './logo.png'

import styles from './Header.module.less'

class Header extends Component{
    constructor(props){
        super(props);
    }
    render() {
        const{user} = this.props;
        return(
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    <a className={styles.logo} href="/">
                        <img src={logo} alt="logo"/>
                    </a>
                    {user &&
                    <div className={styles.userInfo}>
                        <span>hello </span><span>{user.username}</span>
                    </div>}
                </div>
            </div>
        )
    }
}

export default Header;