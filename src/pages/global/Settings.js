import React, {Component} from "react";
import {Input, Modal, Form, Button, Switch} from "antd";

import styles from "./Settings.module.less"
const FormItem = Form.Item;

class Settings extends Component {
    constructor(props) {
        super(props);
        let settings = {};
        const settingsStr = localStorage.getItem('settings') || '';

        if (settingsStr) {
            settings = JSON.parse(settingsStr);
        }
        this.state = {
            settings: settings
        }
    }

    render() {
        const {settings} = this.state;
        const {visible, form, okHandler, cancelHandler} = this.props;
        const {getFieldDecorator} = form;
        const onOK = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;

                const settings = {
                    fm: fieldsValue.fm,
                    sentence: fieldsValue.sentence
                };
                localStorage.setItem('settings', JSON.stringify(settings));
                okHandler();
                this.setState({settings});
            });
        };

        return (
            <Modal
                destroyOnClose
                title="设置"
                visible={visible}
                width={400}
                onOk={onOK}
                onCancel={cancelHandler}
                className={styles.modalBody}
            >
                <Form labelCol={{span: 6}} wrapperCol={{span: 14}}>
                    <Form.Item label="F->M">
                        {getFieldDecorator('fm', {valuePropName: 'checked', initialValue: !!settings.fm})(<Switch size={"small"}/>)}
                    </Form.Item>
                    <Form.Item label="Sentence">
                        {getFieldDecorator('sentence', {valuePropName: 'checked', initialValue: !!settings.sentence})(<Switch size={"small"}/>)}
                    </Form.Item>
                </Form>
            </Modal>);
    }
}

export default Form.create()(Settings);
