import React from 'react';
import dva from 'dva';
import './index.css';
import {createBrowserHistory} from "history";
import createLoading from "dva-loading";

// ReactDOM.render(<App />, document.getElementById('root'));
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

const app = dva({
    history:createBrowserHistory()
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/auth').default);
app.model(require('./models/vocabulary').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
