import React, {Component, Fragment} from "react";
import {connect} from "dva";
import {Table, Divider, message} from "antd";
import moment from "moment";
import SetCountModal from "./SetCountModal";

// 文件名必须是*.module.less的格式，否则module模式不生效!!!
import styles from "./MyWords.module.less"
import SelectLangInForm from "../../components/SelectLangInForm";

@connect(({vocabulary, loading}) => ({
    myWords: vocabulary.myWords,
    loading: loading
}))
class MyWords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myWords: [],
            loading: null,
            countModalVisible: false,
            countOKHandler: null,
            lang: null
        };
    }

    componentDidMount() {
        this.getMyWords();
    }

    // 初始化的时候不会触发该函数!!!
    componentWillReceiveProps(nextProps, nextContext) {
        const {myWords, loading} = nextProps;
        this.setState({myWords, loading});
    }

    getMyWords = () => {
        const {dispatch} = this.props;
        dispatch({
            type: 'vocabulary/getMyWords'
        });
    };

    learnNew = (lang) => {
        this.setState({countModalVisible: true, lang, countOKHandler: this.learnNewHandler});
    };

    reviewOld = (lang) => {
        this.setState({countModalVisible: true, lang, countOKHandler: this.reviewOldHandler});
    };

    columns = [
        {
            title: '语言',
            width: 60,
            dataIndex: 'lang',
            render: val => SelectLangInForm.getLangName(val),
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
                    return moment(record.last_learn_time).format('MM月DD日') + "/" + record.last_learn_count;
                } else {
                    return "";
                }
            }
        },
        {
            title: '待复习',
            dataIndex: 'needreview_count'
        },
        {
            title: '',
            width: 120,
            render: (text, record) => (
                <Fragment>
                    <a onClick={() => this.learnNew(record.lang)}>学习</a>
                    <Divider type="vertical"/>
                    <a onClick={() => this.reviewOld(record.lang)}>复习</a>
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
        const {lang} = this.state;
        const param = {
            lang: lang,
            count: count
        };

        dispatch({
            type: 'vocabulary/getNewWords',
            payload: param,
            callback: (words) => {
                if(!words.length)
                {
                    message.warn("没有需要学习的单词");
                    return;
                }
                this.props.history.push(`/vocabulary/previewwords`, {words: words,lang: lang});
            }
        });

    };
    reviewOldHandler = (count) => {
        const {dispatch} = this.props;
        const {lang} = this.state;
        const param = {
            lang: lang,
            count: count
        };
        dispatch({
            type: 'vocabulary/reviewOldWords',
            payload: param,
            callback: (words) => {
                console.log(words);
                if(!words.length)
                {
                    message.warn("没有需要复习的单词");
                    return;
                }
                this.props.history.push(`/vocabulary/testing`, {words: words,lang: lang});
            }
        });
    };

    render() {
        const {myWords, loading, countModalVisible, countOKHandler} = this.state;

        const dataLoading = !!(loading && loading.global);
        return (
            <div className={styles.wrapper}>
                <Table
                    size="middle"
                    rowKey="id"
                    pagination={false}
                    loading={dataLoading}
                    dataSource={myWords}
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

export default MyWords;