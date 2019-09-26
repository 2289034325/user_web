import React, {Component, Fragment} from "react";
import {connect} from "dva";
import {Table, Divider, message} from "antd";
import moment from "moment";
import SetCountModal from "./SetCountModal";

// 文件名必须是*.module.less的格式，否则module模式不生效!!!
import styles from "./MyBooks.module.less"

@connect(({vocabulary, loading}) => ({
    myBooks: vocabulary.myBooks,
    loading: loading
}))
class MyBooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myBooks: [],
            loading: null,
            countModalVisible: false,
            countOKHandler: null,
            userBookId: null
        };
    }

    componentDidMount() {
        this.getMyBooks();
    }

    // 初始化的时候不会触发该函数!!!
    componentWillReceiveProps(nextProps, nextContext) {
        const {myBooks, loading} = nextProps;
        this.setState({myBooks, loading});
    }

    getMyBooks = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'vocabulary/getMyBooks'
        });
    };

    learnNew = (userBookId,bookId) => {
        this.setState({countModalVisible: true, bookId, userBookId, countOKHandler: this.learnNewHandler});
    };

    reviewOld = (userBookId,bookId) => {
        this.setState({countModalVisible: true, bookId, userBookId: userBookId, countOKHandler: this.reviewOldHandler});
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
                if (record.last_learn_time) {
                    return moment(record.last_learn_time).format('MMDD') + "/" + record.last_learn_count;
                } else {
                    return "New Book!"
                }
            }
        },
        {
            title: '待复习',
            dataIndex: 'today_need_review_count'
        },
        {
            title: '',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.learnNew(record.id,record.book_id)}>学习</a>
                    <Divider type="vertical"/>
                    <a onClick={() => this.reviewOld(record.id,record.book_id)}>复习</a>
                </Fragment>
            ),
        },
    ];

    countModalVisibleHandler = () => {
        const {countModalVisible} = this.state;
        this.setState({countModalVisible: !countModalVisible});
    };

    learnNewHandler = (count) => {
        const {dispatch} = this.props;
        const {bookId,userBookId} = this.state;
        const param = {
            userBookId: userBookId,
            count: count
        };

        console.log(param);

        dispatch({
            type: 'vocabulary/getNewWords',
            payload: param,
            callback: (words) => {
                if(!words.length)
                {
                    message.warn("没有需要学习的单词");
                    return;
                }
                this.props.history.push(`/vocabulary/previewwords`, {words: words,bookId:bookId,userBookId:userBookId});
            }
        });

    };
    reviewOldHandler = (count) => {
        const {dispatch} = this.props;
        const {bookId,userBookId} = this.state;
        const param = {
            userBookId: userBookId,
            count: count
        };
        dispatch({
            type: 'vocabulary/reviewOldWords',
            payload: param,
            callback: (words) => {
                if(!words.length)
                {
                    message.warn("没有需要复习的单词");
                    return;
                }
                this.props.history.push(`/vocabulary/testing`, {words: words,bookId:bookId,userBookId:userBookId});
            }
        });
    };

    render() {
        const {myBooks, loading, countModalVisible, countOKHandler} = this.state;

        const dataLoading = !!(loading && loading.global);
        return (
            <div className={styles.wrapper}>
                <Table
                    size="middle"
                    rowKey="id"
                    pagination={false}
                    loading={dataLoading}
                    dataSource={myBooks}
                    columns={this.columns}
                />
                <SetCountModal
                    visible={countModalVisible}
                    visibleHandler={this.countModalVisibleHandler}
                    okHandler={countOKHandler}/>
            </div>
        )
    }
}

export default MyBooks;