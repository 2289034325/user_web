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
            bookId: 0,
            userBookId: 0
        }
    }

    componentDidMount() {
        const {words, bookId, userBookId} = this.props.location.state;

        this.setState({words, bookId, userBookId});

        window.addEventListener("keydown", this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress = event => {
        const key = event.key;
        const {words, currentIndex} = this.state;

        if (key == "ArrowLeft") {
            if (currentIndex > 0) {
                const i = currentIndex - 1;

                this.wpanel.className=styles.left;
                setTimeout(()=>{
                    this.setState({currentIndex: i});
                    this.wpanel.className=styles.back;
                },300);

            }
        } else if (key == "ArrowRight") {
            if (currentIndex < words.length - 1) {
                const i = currentIndex + 1;

                this.wpanel.className=styles.right;
                setTimeout(()=>{
                    this.setState({currentIndex: i});
                    this.wpanel.className=styles.back;
                },300);
            }
        }
    };

    startTest = () => {
        const {words, bookId, userBookId} = this.state;
        this.props.history.push(`/testing`, {words: words, bookId, userBookId});
    };

    render() {
        const {user} = this.props;
        const {words, currentIndex} = this.state;
        return (
            <div className={styles.wrapper}>
                <Card bordered={false}
                      bodyStyle={{padding: '8px 32px 8px 32px'}}
                >
                    <div className={styles.header}>
                        <div className={styles.count}><span>{`${currentIndex + 1}/${words.length}`}</span></div>
                        <div className={styles.test}><a onClick={() => this.startTest()}>测试</a></div>
                    </div>
                </Card>
                <div ref={wpanel => this.wpanel = wpanel}>
                    <Card
                        style={{marginTop: 24}}
                        bordered={false}
                        bodyStyle={{padding: '8px 32px 20px 32px'}}
                    >
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
                    </Card>

                    <Card
                        style={{marginTop: 5}}
                        bordered={false}
                        bodyStyle={{padding: '8px 32px 20px 32px'}}
                    >
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
                    </Card>
                </div>
            </div>
        )
    }
}

export default PreviewWords;