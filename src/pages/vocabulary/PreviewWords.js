import React, {Component, Fragment} from "react";
import {Card, Icon, List} from "antd";

import WordExplain from "./WordExplain";

import styles from './PreviewWords.module.less';

class PreviewWords extends Component {
    constructor(props) {
        super(props);
        this.state = {
            words: [],
            currentIndex: 0,
            lang: 0
        }
    }

    componentDidMount() {
        const {words, lang} = this.props.location.state;

        this.setState({words, lang});

        window.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress = event => {
        const key = event.key;

        if (key == "ArrowLeft") {
            this.previous();
        } else if (key == "ArrowRight") {
            this.next();
        }
    };

    previous = ()=>{
        const {words, currentIndex} = this.state;
        if (currentIndex > 0) {
            const i = currentIndex - 1;

            this.wpanel.className=`${styles.wwrapper} ${styles.left}`;
            setTimeout(()=>{
                this.setState({currentIndex: i});
                this.wpanel.className=`${styles.wwrapper} ${styles.back}`;
            },300);

        }
    };

    next = ()=>{
        const {words, currentIndex} = this.state;
        if (currentIndex < words.length - 1) {
            const i = currentIndex + 1;

            this.wpanel.className=`${styles.wwrapper} ${styles.right}`;
            setTimeout(()=>{
                this.setState({currentIndex: i});
                this.wpanel.className=`${styles.wwrapper} ${styles.back}`;
            },300);
        }
    };

    startTest = () => {
        const {words, lang} = this.state;
        this.props.history.push(`/vocabulary/testing`, {words: words, lang: lang});
    };

    render() {
        const {words, currentIndex} = this.state;
        return (
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.count}><span>{`${currentIndex + 1}/${words.length}`}</span></div>
                    <div className={styles.btns}>
                        <a onClick={() => this.previous()}>上一个</a>
                        <a onClick={() => this.next()}>下一个</a>
                        <a onClick={() => this.startTest()}>开始测试</a>
                    </div>
                </div>
                <div ref={wpanel => this.wpanel = wpanel} className={styles.wwrapper}>
                    <div className={styles.word}>
                        <div>
                            <span className={styles.wordSpell}>{words.length && words[currentIndex].spell}</span>
                        </div>
                        {words.length && words[currentIndex].pronounce && (
                            <div>
                                <span className={styles.pronounce}>[{words[currentIndex].pronounce}]</span>
                                <span style={{marginLeft: 10}}>
                            <a>
                              <Icon type="sound"/>
                            </a>
                            </span>
                            </div>
                        )}
                        <br/>
                        {words.length && words[currentIndex].meaning && (
                            <div>
                            <span className={styles.meaning}
                                  dangerouslySetInnerHTML={{__html: words[currentIndex].meaning}}/>
                            </div>
                        )}
                    </div>
                    <div className={styles.sts}>
                        <List
                            size="large"
                            rowKey="id"
                            itemLayout="vertical"
                            dataSource={words.length ? words[currentIndex].explains : []}
                            renderItem={item => (
                                <List.Item key={item.id} extra={<div className={styles.listItemExtra}/>}>
                                    <WordExplain item={item}/>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PreviewWords;