import React, {Component} from "react";

import logo from './logo.png'

import styles from './Header.module.less'
import {Button, Form, Icon, Modal, Switch} from "antd";
import Settings from "./Settings";

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

        return (
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    <a className={styles.logo} href="/">
                        <img src={logo} alt="logo"/>
                    </a>
                    <div className={styles.headerRight}>
                        {user &&
                        <div className={styles.userInfo}>
                            <span>hello </span><span>{user.username}</span>
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