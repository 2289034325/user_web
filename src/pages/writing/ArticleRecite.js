import React, {PureComponent} from 'react';
import {Button, Icon, Input, message, Rate} from 'antd';

import styles from './ArticleRecite.module.less';
import {request} from "../../utils/request";
import moment from "moment";
import * as JsDiff from "diff";

const uuidv4 = require('uuid/v4');
const ButtonGroup = Button.Group;

class ArticleRecite extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            article: {paragraphs: []},
            selectedS: null,
            selected: null,
            showAnswer: false,
            histories: [],
            newId: uuidv4()
        };
    }

    componentDidMount() {
        const {match} = this.props;
        const {params} = match;

        if (params && params.id) {
            this.getSpeech(params.id);
        }
    }

    getSpeech = (id) => {
        request(`/api/writing/article/${id}`, 'GET').then(res => {
            if (res !== undefined) {
                const ps = res.paragraphs;
                ps.sort((a, b) => a.index - b.index);

                // 为了让每个split也能引用到paragraph
                ps.forEach(p => {
                    if (p.splits) {
                        p.splits.forEach(s => {
                            s.paragraph = p;
                        });

                        // 按照index排序
                        p.splits.sort((a, b) => a.index - b.index);
                    }
                });
                this.setState({article: res});
            }
        });
    };

    getReciteHistory = (split) => {
        request(`/api/writing/article/recite/${split.id}`, 'GET').then(res => {
            if (res !== undefined) {
                //按照提交时间倒序排序
                res = res.sort((a, b) => {
                    return new Date(b.submit_time).getTime() - new Date(a.submit_time).getTime();
                });
                split.histories = res;
                split.history_loaded = true;
                this.setState({histories: res});
            }
        });
    };

    splitClicked = s => {
        this.setState({selectedP: s.paragraph, selectedS: s}, () => {
            if (!s.history_loaded) {
                this.getReciteHistory(s);
            }
        });
    };

    submitRecite = () => {
        const {article, selectedP, selectedS, newId} = this.state;
        const text = this.textArea.textAreaRef.value;

        if (!text) {
            return;
        }

        // 已改为在后台计算
        // //计算分数
        // let originText = selectedP.text.substring(selectedS.start_index, selectedS.end_index + 1);
        // let diffs = JsDiff.diffWords(originText, text, {ignoreCase: true});
        // let wrong_count = 0;
        // diffs.forEach(d => {
        //     if (d.removed) {
        //         //空格和符号不算错误
        //         // if (!/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/.test(d.value)) {
        //         //     wrong_count++;
        //         // }
        //         let match = d.value.match(/[a-zA-Z]+\b/g);
        //         if (match) {
        //             // 如果错的是短语扣2分，句子扣5分
        //             if (match.length == 1) {
        //                 wrong_count += 1;
        //             }
        //             // 3个词之内算短语
        //             else if (match.length > 1 && match.length <= 3) {
        //                 wrong_count += 2;
        //             }
        //             // 超过3个词算句子
        //             else {
        //                 wrong_count += 5;
        //             }
        //         }
        //     }
        // });
        //
        // // 一共10分，错一个减一分
        // let score = 10 - wrong_count;
        // if (score < 0) {
        //     score = 0;
        // }

        const param = {
            id: newId,
            article_id: article.id,
            paragraph_id: selectedP.id,
            split_id: selectedS.id,
            content: text,
            score: 0
        };
        request(`/api/writing/article/recite`, 'POST', param).then(res => {
            if (res !== undefined) {
                message.success('提交成功');
                this.textArea.textAreaRef.value = '';
                //新增的记录默认展开状态
                res.expend = true;
                //unshift添加到数组开头!!!
                selectedS.histories.unshift(res);
                // concat后生成一个新对象，否则setState不生效!!!
                this.setState({histories: selectedS.histories.concat([]), newId: uuidv4()});
            }
        });
    };

    setScore = (h, score) => {
        const param = {
            id: h.id,
            score: score
        };
        request(`/api/writing/article/recite`, 'PUT', param).then(res => {
            if (res !== undefined) {
                message.success('操作成功');
                h.score = score;
            }
        });
    };

    render() {
        const {article, selectedP, selectedS, showAnswer} = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.title}>
                    <span>{article.title}</span>
                </div>
                <div className={styles.paragraphs}>
                    {article &&
                    article.paragraphs &&
                    article.paragraphs.map(p => {
                        return (
                            <div
                                key={p.id}
                                className={`${styles.paragraph} ${selectedP && (selectedP.id === p.id ? styles.paragraphSelected : '')}`}
                            >
                                <div className={styles.splitContainer}>
                                    {p.splits.map(s => {
                                        return (
                                            <span
                                                key={s.id}
                                                className={`${(selectedS && selectedS.id === s.id) ? styles.splitSelected : styles.split} ${showAnswer ? styles.show : ""}`}
                                                onClick={() => this.splitClicked(s)}
                                            >
                        {p.text.substring(s.start_index, s.end_index + 1)}
                      </span>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.writingContainer}>
                    <div className={styles.toolbar}>
                        <ButtonGroup className={styles.left}>
                            <Button
                                size="small"
                                icon={showAnswer ? 'eye-invisible' : 'eye'}
                                disabled={!selectedS}
                                onClick={() => {
                                    if (showAnswer) {
                                        this.setState({showAnswer: false});
                                    } else {
                                        this.setState({showAnswer: true});
                                    }
                                }}
                            />
                            <Button className={styles.right}
                                    size="small"
                                    icon="save"
                                    disabled={!selectedS}
                                    onClick={this.submitRecite}
                            />
                        </ButtonGroup>
                    </div>
                    <Input.TextArea
                        ref={ta => this.textArea = ta}
                        className={styles.textArea}
                        autosize={{minRows: 5, maxRows: 20}}/>
                    <div className={styles.history}>
                        {selectedS && selectedS.histories &&
                        selectedS.histories.map(h => {
                            let originText = selectedP.text.substring(selectedS.start_index, selectedS.end_index + 1);
                            // let diff = JsDiff.diffWords(originText, h.content);
                            let diff = h.diffs;
                            let diffText = diff.map((d, i) => {
                                return (
                                    <span key={i}
                                          className={`${(d.operation == "INSERT" ? styles.added : (d.operation == "DELETE" ? styles.removed : styles.origin))}`}>{d.text}
                                    </span>
                                );
                            });

                            return (
                                <div key={h.id}
                                     className={styles.item}>
                                    <div className={styles.infoOuter}
                                         onClick={() => {
                                             if (h.expend) {
                                                 h.expend = false;
                                             } else {
                                                 h.expend = true;
                                             }
                                             let {histories} = this.state;
                                             histories = histories.concat([]);
                                             this.setState({histories});
                                         }}>
                                        <div className={styles.info} onClick={(e) => {
                                            // 阻止rate组件触发的事件传播到上层，导致触发收起和展开
                                            e.stopPropagation();
                                        }}>
                                            <span>
                                                {`${moment(h.submit_time).format('MM/DD HH:mm:ss')}`}
                                            </span>
                                            <Rate allowHalf defaultValue={h.score} onChange={(value) => {
                                                this.setScore(h, value);
                                            }}/>
                                        </div>
                                        <Icon className={styles.handle}
                                              size="small"
                                              type={h.expend ? "down" : "right"}
                                        />
                                    </div>
                                    <div className={`${styles.content} ${!h.expend ? styles.fold : ""}`}>
                                        {diffText}
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ArticleRecite;
