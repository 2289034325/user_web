import React,{ Component } from "react";
import './App.css';
import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import {getUerInfo, saveToken} from "./utils/authority";
import Login from "./Login";
import {connect} from "dva";
import {Route} from "react-router-dom";


@connect(({ auth, loading }) => ({
    token:auth.token
}))
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:null,
            showLogin:false
        };
    }

    componentDidMount() {
        //检查是否登录
        let user = getUerInfo();
        // todo 或者token过期
        if(!user){
            this.setState({showLogin:true})
        }
        else{
            this.setState({user,showLogin:false})
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const{token} = nextProps;
        if(token){
            saveToken(token.token);
        }
        let user = getUerInfo();
        // todo 或者token过期
        if(!user){
            this.setState({showLogin:true})
        }
        else{
            this.setState({user,showLogin:false})
        }
    }

    render(){
        const{token} = this.props;
        const{showLogin,user} = this.state;
        return (
            <div className="App">
                <Header user={user} />
                <Route component={Content} />
                <Footer />
                <Login visible={showLogin} />
            </div>
        );
    }
}

export default App;
