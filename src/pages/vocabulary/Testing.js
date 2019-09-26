import React, {Component, Fragment} from "react";
import styles from "./Testing.module.less";
import {Card, Icon, Input, message, Popover, Modal} from "antd";
import {connect} from "dva";
import Animate from "rc-animate";

const uuidv4 = require('uuid/v4');

class Testing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            words: [],
            questions: [],
            currentQuestion: null,
            learnRecord: null,
            leftCount: 0,
            totalCount: 0,
            showAnswer: false,
            // 父控件render时，input型子控件不会recreate，value和focus状态，始终会保持住!!!
            // 如果在render的时候，子控件设置了不同的key，就会recreate，也就能清空之前的状态!!!
            // 但是这个key如果放在input控件上，而且如果这个控件是唯一子控件，key似乎不生效
            // 所以需要设置在input控件的父控件上!!!
            fillKey: uuidv4()
        }
    }

    componentDidMount() {
        const {bookId, userBookId, words} = this.props.location.state;
        this.createStatInfo(bookId, userBookId, words);

        window.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress = event => {
        if (event.target.tagName == "INPUT") {
            return;
        }

        const key = event.key;
        const {questions, currentQuestion} = this.state;
        // 答对
        if (key == "ArrowLeft") {
            currentQuestion.pass = true;

            this.qpanel.className=styles.right;
            setTimeout(() => {
                // 这里需要判断是否测试已经结束，发生页面跳转，否则直接处理动画效果可能会出错
                if(!this.handleNext()){
                this.qpanel.className=styles.r_normal;}
            }, 300);
        }
        // 答错
        else if (key == "ArrowRight") {
            currentQuestion.stat.wrong_times += 1;

            this.qpanel.className=styles.wrong;
            setTimeout(() => {
                // 这里需要判断是否测试已经结束，发生页面跳转，否则直接处理动画效果可能会出错
                if(!this.handleNext()){
                this.qpanel.className=styles.w_normal;}
            }, 300);
        }
        // 查看答案
        else if (key == "Enter") {
            currentQuestion.stat.wrong_times += 1;
            this.setState({showAnswer: true});
        }
    };

    checkFill = (e) => {
        const {showAnswer} = this.state;
        if (showAnswer) {
            return;
        }

        const {currentQuestion} = this.state;
        if (e.target.value == currentQuestion.sentence.word) {
            currentQuestion.pass = true;
            this.handleNext();
        } else {
            const dom = e.currentTarget;
            this.setState({showAnswer: true}, () => {
                // 让输入框失去焦点，以便让body处理左右方向键事件
                dom.blur();
            });
        }

    };

    handleNext = () => {
        const {questions, currentQuestion} = this.state;
        const {dispatch} = this.props;
        const left_qs = questions.filter(q => {
            return !(q.pass || q.stat.finished);
        });

        if (currentQuestion.pass || currentQuestion.stat.finished) {
            if (left_qs.length > 0) {
                const cq = left_qs[Math.floor(Math.random() * left_qs.length)];
                cq.stat.answer_times += 1;
                this.setState({currentQuestion: cq, showAnswer: false, fillKey: uuidv4()});
            } else {
                // 提交测试结果
                dispatch({
                    type: 'vocabulary/saveRecord',
                    payload: this.state.learnRecord,
                    callback: () => {
                        // 跳转到book页面
                        this.props.history.push(`/vocabulary/mybooks`);
                    }
                });

                // 让调用方知道测试结束了，以便正确处理动画效果
                return true;
            }
        } else {
            //如果只剩最后一题
            if (left_qs.length == 1) {
                // 10秒钟后再回答
                this.setState({showAnswer: false}, () => {
                    this.countDown();
                });
            } else {
                const cq = left_qs[Math.floor(Math.random() * left_qs.length)];
                cq.stat.answer_times += 1;
                this.setState({currentQuestion: cq, showAnswer: false, fillKey: uuidv4()});
            }
        }
    };

    countDown = () => {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: '回答错误',
            content: `将在 ${secondsToGo} 秒钟后重新回答.`,
            okButtonProps: {disabled: true}
        });
        const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
                content: `将在 ${secondsToGo} 秒钟后重新回答.`,
            });
        }, 1000);
        setTimeout(() => {
            clearInterval(timer);
            modal.destroy();
        }, secondsToGo * 1000);
    };

    createStatInfo = (bookId, userBookId, words) => {
        const lrId = uuidv4();
        const learnRecord = {
            id: lrId,
            book_id: bookId,
            user_book_id: userBookId,
            word_count: words.length,
            answer_times: 0,
            wrong_times: 0,
            start_time: new Date(),
            end_time: new Date(),
            detail: []
        };

        const stats = [];
        const questions = [];
        words.forEach(w => {
            const stat = {
                learn_record_id: lrId,
                book_id: bookId,
                user_book_id: userBookId,
                word_id: w.id,
                answer_times: 0,
                wrong_times: 0,
                learn_time: new Date(),
                learn_phase: w.learn_phase,
                finished: false
            };
            stats.push(stat);

            // M->F
            const question1 = this.createQuestion(w, 1);
            question1.stat = stat;
            question1.word = w;
            questions.push(question1);
            // F->m
            const question2 = this.createQuestion(w, 2);
            question2.stat = stat;
            question2.word = w;
            questions.push(question2);
            // SENTENCE
            const question3 = this.createQuestion(w, 3);
            if (question3) {
                question3.stat = stat;
                question3.word = w;
                questions.push(question3);
            }
        });

        learnRecord.detail = stats;
        const currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        currentQuestion.stat.answer_times += 1;

        this.setState({words, questions, learnRecord, currentQuestion});
    };

    createQuestion = (word, type) => {
        const question = {
            type: type
        };
        let sentence = null;
        // TODO 添加例句的 标准化 属性
        //随机选择一个例句
        if (word.explains.length > 0) {

            const exps = word.explains.filter((e) => {
                return e.sentences.length > 0;
            });
            if (exps.length > 0) {
                const exp = exps[Math.floor(Math.random() * exps.length)];
                sentence = exp.sentences[Math.floor(Math.random() * exp.sentences.length)];
            }
        }
        if (sentence) {
            const split_index = sentence.sentence.indexOf(sentence.word);
            sentence.text1 = sentence.sentence.substr(0, split_index - 1);
            sentence.text2 = sentence.sentence.substr(split_index + sentence.word.length, sentence.sentence.length - 1);
        }
        question.sentence = sentence;


        if (type == 3 && sentence == null) {
            return null;
        }

        return question;
    };

    setFinished = () => {
        const {currentQuestion} = this.state;
        currentQuestion.stat.finished = true;

        this.handleNext();
    };

    render() {
        const {questions, currentQuestion, showAnswer, fillKey} = this.state;

        const leftCount = questions.filter(q => {
            return !(q.pass || q.stat.finished);
        }).length;
        const totalCount = questions.length;

        if (!currentQuestion) {
            return (<span></span>);
        }

        return (
            <div className={styles.wrapper}>
                <Card bordered={false}
                      bodyStyle={{padding: '8px 32px 8px 32px'}}
                >
                    <div className={styles.header}>
                        <div className={styles.count}><span>{`${leftCount}/${totalCount}`}</span></div>
                        <div className={styles.finished}><a onClick={() => this.setFinished()}>已掌握</a></div>
                    </div>
                </Card>
<div ref={qpanel => this.qpanel = qpanel} >
                <Card
                    style={{marginTop: 24}}
                    bordered={false}
                    bodyStyle={{padding: '8px 32px 20px 32px'}}
                >

                    <Fragment>
                        <div
                            style={{visibility: (currentQuestion.type == 1 || (currentQuestion.type != 1 && showAnswer)) ? 'visible' : 'hidden'}}>
                            <div>
                                <span className={styles.wordSpell}>{currentQuestion.word.spell}</span>
                            </div>
                            <div>
                                <span className={styles.pronounce}>[{currentQuestion.word.pronounce}]</span>
                                <span style={{marginLeft: 10}}>
                            <a>
                              <Icon type="sound"/>
                            </a>
                            </span>
                            </div>
                        </div>
                        <div
                            style={{visibility: (currentQuestion.type == 2 || (currentQuestion.type != 2 && showAnswer)) ? 'visible' : 'hidden'}}>
                            <span className={styles.meaning}
                                  dangerouslySetInnerHTML={{__html: currentQuestion.word.meaning}}/>
                        </div>
                        {currentQuestion.type == 3 &&
                        <Fragment>
                            <div key={fillKey}
                                 style={{visibility: (currentQuestion.type == 3) ? 'visible' : 'hidden'}}>
                                    <span className={styles.meaning}
                                          dangerouslySetInnerHTML={{__html: currentQuestion.sentence.text1}}/>
                                <Popover content={currentQuestion.sentence.word}
                                         visible={showAnswer}
                                         trigger="click">
                                    <Input
                                        className={styles.fill}
                                        autoFocus={true}
                                        onPressEnter={(e) => this.checkFill(e)}></Input>
                                </Popover>
                                <span className={styles.meaning}
                                      dangerouslySetInnerHTML={{__html: currentQuestion.sentence.text2}}/>
                            </div>
                            <div style={{visibility: (currentQuestion.type == 3) ? 'visible' : 'hidden'}}>
                                    <span className={styles.meaning}
                                          dangerouslySetInnerHTML={{__html: currentQuestion.sentence.translation}}/>
                            </div>
                        </Fragment>}

                    </Fragment>

                </Card>
</div>
            </div>)
    }
}

export default connect()(Testing);