import React,{ Component } from "react";

class Testing extends Component{
    constructor(props){
        super(props);
    }
    render() {
        const{user} = this.props;
        return(
            <div>
                测试！
            </div>
        )
    }
}

export default Testing;