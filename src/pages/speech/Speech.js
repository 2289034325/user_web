import React, {Fragment, PureComponent} from 'react';
import {Button, Dropdown, Menu,} from 'antd';
import ReactPlayer from 'react-player';

import styles from './Speech.module.less';
import {request} from "../../utils/request";
import {MediaUsage} from "../../utils/utils";

const ButtonGroup = Button.Group;

class Speech extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      speech:{paragraphs: [], medias: []},
      selectedS:null,
      selected:null,
      playing:false,
      playerSize:'small',
      mode:'listen',
      mediaUsage: MediaUsage.ORIGIN.value,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;

    if (params && params.id) {
      this.getSpeech(params.id);
    }
  }

  getSpeech = (id) => {
    request(`/api/speech/article/${id}`, 'GET').then(res=>{
      if(res !== undefined){
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
        this.setState({speech:res});
      }
    });
  };

  getMediaWrapperClass = (mediaType) => {
    if (mediaType && mediaType.toLowerCase() == 'mp3') {
      return styles.audioWrapper;
    }

    if (mediaType && mediaType.toLowerCase() == 'mp4') {
      const {playerSize} = this.state
      if(playerSize == 'big'){
        return styles.videoWrapperBig;
      }
      return styles.videoWrapperSmall;
    }

    return styles.audioWrapper;
  };

  playParagraph = p => {
    clearTimeout(this.playerTimer);
    const firstS = p.splits[0];
    const lastS = p.splits[p.splits.length-1];
    const playTime = (lastS.end_time - firstS.start_time)*1000;
    this.player.seekTo(firstS.start_time);
    this.setState({ playing: true });
    this.playerTimer = setTimeout(()=>{this.setState({playing:false})},playTime);
  };

  playSplit = s => {
    clearTimeout(this.playerTimer);
    const playTime = (s.end_time - s.start_time)*1000;
    this.player.seekTo(s.start_time);
    this.setState({ playing: true });
    this.playerTimer = setTimeout(()=>{this.setState({playing:false})},playTime);
  };

  performerClicked = p => {
    const {mode} = this.state;
    if(mode == "read"){
      return;
    }

    const firstS = p.splits[0];
    this.setState({selectedP:p,selectedS:firstS},()=>{
      this.playParagraph(p);
    });
  };

  splitClicked = s => {
    const {mode} = this.state;
    if(mode == "read"){
      this.setState({selectedP:s.paragraph,selectedS:s});
    }
    else {
      this.setState({selectedP: s.paragraph, selectedS: s}, () => {
        this.playSplit(s);
      });
    }
  };

  render() {
    const { speech, selectedP, selectedS, playing, playerSize,mode,mediaUsage } = this.state;

    let mediaId = '';
    let mediaType = '';
    let mediaUrl = '';

    speech.medias.forEach(m => {
      if (m.usage == mediaUsage) {
        mediaId = m.id;
        const mediaName = m.name;
        mediaType = mediaName.substr(mediaName.lastIndexOf('.') + 1);
        mediaUrl = m.url;
      }
    });

    const selectVideoMenu = (
        <Menu>
          <Menu.Item>
            <a onClick={() => {
              this.setState({ mediaUsage: MediaUsage.ORIGIN.value });
            }}
            >
              原声
            </a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => {
              this.setState({ mediaUsage: MediaUsage.EXPLAIN.value });
            }}
            >
              讲解
            </a>
          </Menu.Item>
        </Menu>
    );

    return (
      <div className={styles.container}>
        <div className={this.getMediaWrapperClass(mediaType)}>
          <ReactPlayer
            ref={player => this.player = player}
            url={mediaUrl}
            onPlay={this.onPlay}
            onPause={this.onPause}
            onEnded={this.onPause}
            playing={playing}
            width="100%"
            height="100%"
            controls
          />
        </div>
        <div className={styles.title}>
          <span>{speech.title}</span>
        </div>
        <div className={styles.toolMenu}>
          <ButtonGroup className={styles.ButtonGroup}>
            <Button
                size="small"
                icon={mode == 'listen' ? 'font-colors' : 'sound'}
                title={mode == 'listen' ? '切换到阅读模式' : '切换到播放模式'}
                onClick={()=>{
                  if(mode == 'listen'){
                    this.setState({mode:'read'});
                  }
                  else{
                    this.setState({mode:'listen'});
                  }
                }}
            />
            <Button
                size="small"
                icon={playerSize == 'big' ? 'fullscreen-exit' : 'fullscreen'}
                title={playerSize == 'big' ? '缩小视频' : '放大视频'}
                onClick={()=>{
                  if(playerSize == 'big'){
                    this.setState({playerSize:'small'});
                  }
                  else{
                    this.setState({playerSize:'big'});
                  }
                }}
            />
            <Dropdown overlay={selectVideoMenu} placement="bottomCenter">
              <Button size="small" icon="select" title="选择观看视频" />
            </Dropdown>
          </ButtonGroup>
        </div>
        <div className={styles.paragraphs}>
          {speech &&
          speech.paragraphs &&
          speech.paragraphs.map(p => {
            return (
              <div
                key={p.id}
                className={`${styles.paragraph} ${  selectedP && (selectedP.id === p.id ? styles.paragraphSelected : '')}`}
              >
                <div
                  className={`${styles.performer} ${mode == "read"?"":styles.performerListen}`}
                  onClick={() => this.performerClicked(p)}
                >
                  <u>{p.performer}</u>:
                </div>
                <div className={styles.splitContainer}>
                  {p.splits.map(s => {
                    return (
                      <span
                        key={s.id}
                        className={mode == "read"?"":(`${styles.split} ${selectedS && (selectedS.id === s.id ? styles.selected : '')}`)}
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
      </div>
    );
  }
}

export default Speech;
