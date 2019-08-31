import React,{ Component } from "react";

class PreviewWords extends Component{
    constructor(props){
        super(props);
    }
    render() {
        const{user} = this.props;
        return(
            <div>
                Preview!
            </div>
        )
    }
}

export default PreviewWords;