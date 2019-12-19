import React, {Component} from "react";
import {Table} from "antd";
// 文件名必须是*.module.less的格式，否则module模式不生效!!!
import styles from "./ArticleList.module.less"
import {request} from "../../utils/request";
import SelectLangInForm from "../../components/SelectLangInForm";

class ArticleList extends Component {
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
        request(`/api/writing/article/list`, 'GET').then(res=>{
            if(res !== undefined){
                this.setState({speechList:res});
            }
        });
    };

    columns = [
        {
            title: '来源',
            width: 200,
            dataIndex: 'source'
        },
        {
            title: '语言',
            width: 100,
            dataIndex: 'lang',
            render: val => SelectLangInForm.getLangName(val),
        },
        {
            title: '名称',
            dataIndex: 'title',
            render: (text,record) => <a onClick={() => this.props.history.push(`/writing/recite/${record.id}`)}>{text}</a>,
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

export default ArticleList;