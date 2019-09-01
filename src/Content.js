import React,{ Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import MyBooks from "./MyBooks";
import PreviewWords from "./PreviewWords";

import styles from './Content.module.less'

class Content extends Component{
    render() {
        return(
            <div className={styles.content}>
                <Switch>
                    <Route path={`/mybooks`} component={MyBooks}/>
                    <Route path={`/previewwords`} component={PreviewWords}/>
                    <Route path={`/testing`} component={PreviewWords}/>
                </Switch>
            </div>
        )
    }
}

export default Content;