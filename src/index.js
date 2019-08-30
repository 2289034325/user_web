import React from 'react';
import dva from 'dva';
import './index.css';


// ReactDOM.render(<App />, document.getElementById('root'));
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

const app = dva({

});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/auth').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
