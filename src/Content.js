import React,{ Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";

import './Content.less'
import MyBooks from "./MyBooks";
import PreviewWords from "./PreviewWords";

class Content extends Component{
    render() {
        return(
            <div className="content">
                <Switch>
                    <Route path={`/mybooks`} component={MyBooks}/>
                    <Route path={`/previewwords`} component={PreviewWords}/>
                </Switch>
            </div>
        )
    }
}

export default Content;