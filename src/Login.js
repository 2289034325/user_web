import React, {Component} from "react";
import {Input, Modal, Form, Button} from "antd";
import md5 from 'md5';

import './Login.css'
import {connect} from "dva";

const FormItem = Form.Item;

@connect(({auth, loading}) => ({
    kaptcha: auth.kaptcha
}))
@Form.create()
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kaptcha: null
        };
    }

    componentDidMount() {
        this.getKaptcha();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {kaptcha} = nextProps;
        if (kaptcha) {
            this.setState({kaptcha});
        }
    }

    okHandler = () => {
        const{kaptcha}=this.state;
        const {dispatch, form} = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const params = {
                username:fieldsValue.username,
                password: md5(fieldsValue.password),
                vcode:fieldsValue.vcode,
                ticket: kaptcha.ticket
            };

            dispatch({
                type: 'auth/login',
                payload: params,
            });

        });
    };

    getKaptcha = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'auth/kaptcha'
        });
    };

    render() {
        const {visible, form} = this.props;
        const {kaptcha} = this.state;

        return (
            <Modal
                destroyOnClose
                title="登录"
                visible={visible}
                className="login"
                width={300}
                closable={false}
                footer={[<Button type="primary" onClick={()=>this.okHandler()}>登录</Button>]}
            >
                <FormItem>
                    {form.getFieldDecorator('username', {
                        rules: [{required: true, message: '请输入用户名！'}],
                    })(<Input placeholder="用户名"/>)}
                </FormItem>
                <FormItem>
                    {form.getFieldDecorator('password', {
                        rules: [{required: true, message: '请输入用密码！'}],
                    })(<Input.Password placeholder="密码"/>)}
                </FormItem>
                <FormItem>
                    {form.getFieldDecorator('vcode', {
                        rules: [{required: true, message: '请输入验证码！'}],
                    })(<Input placeholder="验证码" className="vcode_input"/>)}
                    {kaptcha && <img className="vcode_img" onClick={()=>this.getKaptcha()} src={`data:image/jpg;base64,${kaptcha.img}`}/>}
                </FormItem>

            </Modal>
        )
    }
}

export default Login;