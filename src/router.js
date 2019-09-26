import React from 'react';
import App from './pages/layout/App'
import { BrowserRouter as Router, Route } from "react-router-dom";

function RouterConfig({ history, app }) {
    return (
        <Router>
            <Route path="/" component={App} />
        </Router>
    );
}

export default RouterConfig;