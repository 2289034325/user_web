import React, {Component, Fragment} from "react";
import {connect} from "dva";
import {Table,Divider} from "antd";
import moment from "moment";

@connect(({vocabulary, loading}) => ({
    myBooks: vocabulary.myBooks,
    loading:loading
}))
class MyBooks extends Component{
    constructor(props){
        super(props);
        this.state = {
            myBooks: [],
            loading:null
        };
    }

    componentDidMount() {
        this.getMyBooks();
    }

    // 初始化的时候不会触发该函数!!!
    componentWillReceiveProps(nextProps, nextContext) {
        const {myBooks,loading} = nextProps;
        this.setState({myBooks,loading});
    }

    getMyBooks = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'vocabulary/getMyBooks'
        });
    };

    columns = [
        {
            title: '名称',
            width: 80,
            dataIndex: 'name'
        },
        {
            title: '未开始',
            width: 60,
            dataIndex: 'notstart_count'
        },
        {
            title: '学习中',
            width: 60,
            dataIndex: 'learning_count'
        },
        {
            title: '已完成',
            width: 60,
            dataIndex: 'finished_count'
        },
        {
            title: '上次学习',
            width: 100,
            dataIndex: 'last_learn_time',
            render: (text, record) => {
                if(record.last_learn_time) {
                    return moment(record.last_learn_time).format('MMDD') + "/" + record.last_learn_count;
                }
                else{
                    return "New Book!"
                }
            }
        },
        {
            title: '待复习',
            width: 60,
            dataIndex: 'today_need_review_count'
        },
        {
            title: '操作',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <a>学习</a>
                    <Divider type="vertical" />
                    <a>复习</a>
                </Fragment>
            ),
        },
    ];

    render() {
        const {myBooks,loading} = this.state;
        const dataLoading = !!(loading && loading.effects['vocabulary/getMyBooks']);
        return(
            <Table
                size="middle"
                rowKey="id"
                pagination={false}
                loading={dataLoading}
                dataSource={myBooks}
                columns={this.columns}
            />
        )
    }
}

export default MyBooks;