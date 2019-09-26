import React, {PureComponent} from 'react';
import moment from 'moment';
import {Avatar, Divider, Icon, Popconfirm} from 'antd';

import styles from './WordExplain.module.less';

export default class WordExplain extends PureComponent {
    state = {};

    render() {
        const {
            item
        } = this.props;

        return (
            <div className={styles.listContent} key={item.id}>
                <div className={styles.description}>
                    <span className={styles.explain} dangerouslySetInnerHTML={{__html: item.explain}}/>
                </div>
                <div className={styles.divSentences}>
                    {item.sentences && item.sentences.map(s => (
                        <div key={s.id} className={styles.divSentences}>
                            <div>
                                <span className={styles.sentence}>{s.sentence}</span>
                            </div>
                            <span className={styles.translation}>{s.translation}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}