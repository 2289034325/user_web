import React,{ Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import MyBooks from "../vocabulary/MyBooks";
import PreviewWords from "../vocabulary/PreviewWords";

import styles from './Content.module.less'
import Testing from "../vocabulary/Testing";
import SpeechList from "../speech/SpeechList";
import Speech from "../speech/Speech";
import SpeechRecite from "../speech/SpeechRecite";

class Content extends Component{
    render() {
        return(
            <div className={styles.content}>
                <Switch>
                    <Redirect exact from={`/`} to={`/vocabulary/mybooks`} />
                    <Route path={`/vocabulary/mybooks`} component={MyBooks}/>
                    <Route path={`/vocabulary/previewwords`} component={PreviewWords}/>
                    <Route path={`/vocabulary/testing`} component={Testing}/>
                    <Route path={`/speech/list`} component={SpeechList}/>
                    <Route exact path={`/speech/:id`} component={Speech}/>
                    <Route path={`/speech/recite/:id`} component={SpeechRecite}/>
                </Switch>
            </div>
        )
    }
}

export default Content;