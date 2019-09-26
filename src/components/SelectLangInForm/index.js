import React, { PureComponent } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default class SelectLangInForm extends PureComponent {
  static getLangName(val) {
    switch (val) {
      case 1:
        return 'English';
      case 2:
        return '日本語';
      case 3:
        return '韩语';
      case 4:
        return 'France';
      default:
        return '';
    }
  }

  render() {
    const {showOptionAll} = this.props;
    return (
      <Select {...this.props}>
        {showOptionAll && <Option value={undefined}>全部</Option>}
        <Option value="1">English</Option>
        <Option value="2">日本語</Option>
        <Option value="3">韩语</Option>
        <Option value="4">France</Option>
      </Select>
    );
  }
}
