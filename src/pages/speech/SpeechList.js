import React, {Component, Fragment} from "react";
import {connect} from "dva";
import {Table, Divider, message} from "antd";
import moment from "moment";

// 文件名必须是*.module.less的格式，否则module模式不生效!!!
import styles from "./SpeechList.module.less"
import {request} from "../../utils/request";
import SelectLangInForm from "../../components/SelectLangInForm";

class SpeechList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speechList: [],
            loading: false
        };
    }

    componentDidMount() {
        this.getSpeechList();
    }

    getSpeechList = () => {
        request(`/api/speech/article/list`, 'GET').then(res=>{
            if(res !== undefined){
                this.setState({speechList:res});
            }
        });
    };

    columns = [
        {
            title: '名称',
            width: 300,
            dataIndex: 'title',
            render: (text,record) => <a onClick={() => this.props.history.push(`/speech/${record.id}`)}>{text}</a>,
        },
        {
            title: '语言',
            width: 60,
            dataIndex: 'lang',
            render: val => SelectLangInForm.getLangName(val),
        },
        {
            title: 'Performer',
            width: 200,
            dataIndex: 'performer'
        },
        {
            title: '描述',
            dataIndex: 'description',
            render: text => <div title={text} style={{whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden"}}>{text}</div>
        },
        {
            title: 'Recite',
            width: 100,
            render: (text,record) => <a onClick={() => this.props.history.push(`/speech/recite/${record.id}`)}>go</a>,
        }
    ];

    countModalVisibleHandler = () => {
        const {countModalVisible} = this.state;
        this.setState({countModalVisible: !countModalVisible});
    };

    render() {
        const {speechList, loading} = this.state;

        const dataLoading = !!(loading && loading.global);
        return (
            <div className={styles.wrapper}>
                <Table
                    size="middle"
                    rowKey="id"
                    pagination={false}
                    loading={dataLoading}
                    dataSource={speechList}
                    columns={this.columns}
                />
            </div>
        )
    }
}

export default SpeechList;