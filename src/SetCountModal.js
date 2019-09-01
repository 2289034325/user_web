import React, {Component} from 'react';
import {Form, InputNumber, Modal} from 'antd';

const FormItem = Form.Item;

@Form.create()
class SetCountModal extends Component {

    render() {
        const {visible, visibleHandler, okHandler, form } = this.props;

        const okHandle = () => {
            form.validateFields((err, fieldsValue) => {
                if (err) return;
                okHandler(fieldsValue.count);
            });
        };
        return (
            <Modal
                destroyOnClose
                title="单词数量"
                visible={visible}
                onOk={okHandle}
                onCancel={() => visibleHandler()}
                width={200}
            >
                <FormItem>
                    {form.getFieldDecorator('count', {
                        initialValue: 5,
                        rules: [{required: true, message: '请输入单词数量！'}],
                    })(<InputNumber placeholder="请输入单词数量" min={5} max={50} style={{width: '100%'}}/>)}
                </FormItem>
            </Modal>
        );
    }
}

export default SetCountModal;