import React, {Component} from "react";

import logo from '../../resources/logo.png'

import styles from './Header.module.less'
import {Button, Form, Icon, Modal, Switch} from "antd";
import Settings from "../global/Settings";
import {Link} from "react-router-dom";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSetting: false,
            settings:{}
        }
    }

    settingOK = ()=>{

    };

    render() {
        const {user} = this.props;
        const {showSetting} = this.state;
        const currentPath = window.location.pathname;
        return (
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    <a className={styles.logo} href="/">
                        <img src={logo} alt="logo"/>
                    </a>
                    <div className={styles.menuItems}>
                        <Link to="/vocabulary/mybooks" className={`${styles.menuItem} ${currentPath.startsWith("/vocabulary")?styles.menuItemSelected:""}`}>词汇</Link>
                        <Link to="/speech/list" className={`${styles.menuItem} ${currentPath.startsWith("/speech")?styles.menuItemSelected:""}`}>会话</Link>
                        <Link to="/writing/list" className={`${styles.menuItem} ${currentPath.startsWith("/writing")?styles.menuItemSelected:""}`}>范文</Link>
                    </div>
                    <div className={styles.headerRight}>
                        {user &&
                        <div className={styles.userInfo}>
                            <span>hello </span><span>{user.name}</span>
                        </div>}
                        <div className={styles.setting}>
                            <Button type={"link"} onClick={()=>this.setState({showSetting:true})}><Icon type="setting"/></Button>
                        </div>
                    </div>
                </div>
                <Settings visible={showSetting} okHandler={()=>this.setState({showSetting:false})} cancelHandler={()=>this.setState({showSetting:false})}/>
            </div>
        )
    }
}

export default Header;