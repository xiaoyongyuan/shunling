import React, { Component } from 'react';
import flash from "../../style/ztt/imgs/flash.png";
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';
var ActiveXObject=window.ActiveXObject;
class Live extends Component {
  /*  componentWillReceiveProps(nextProps) {
        if (nextProps.datachange == "urlchange") {
           this.openVideo(nextProps.eid);
        }
    }
    openVideo=(eid)=>{
        var videoElement = document.getElementById('videoElement');
        var flvPlayer = window.flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            autoplay: true,
            hasAudio: false,
            hasVideo: true,
            autoDisable: true,
            enableStashBuffer: true,
            url:eid
            //url:'http://47.94.252.115:8080/live?port=1935&app=live&stream=test'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    };*/
  componentDidMount() {
      var isIE = false;
      if (window.ActiveXObject) {
          isIE = true;
      }
      var has_flash = false;
      try {
          if (isIE) {
              var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
              has_flash = true;
          } else {
              var flash = navigator.plugins["Shockwave Flash"];
              if (flash) {
                  has_flash = true;
              }
          }
      } catch (e) {
          console.log(e);
      }
      if (has_flash) {
          videojs.options.flash.swf = require('videojs-swf/dist/video-js.swf');
          this.player = videojs('myvideo', {
              preload: 'auto',// 预加载
              bigPlayButton: {},// 大按钮
              controls: true,// 是否开启控制栏
              playbackRates: [1, 1.5, 2],
              width:800,
              height:600,
              muted: true, //是否循环播放
              loop: true, //是否静音
              autoplay: true, //是否自动播放
              // fluid: true
          });
      } else {
          this.player = videojs('myvideo', {
              preload: 'none',// 预加载
              playbackRates: [1, 1.5, 2],
          });
      }
  }
    componentWillReceiveProps(nextProps) {
        if (nextProps.datachange == "urlchange") {
            if(this.player){
                this.props.resetDatachange(this.player,nextProps.eid,videojs);
            }
        }
    }
    hanleProgress=()=>{
      this.props.liveProgress();
    };
    componentWillUnmount() {
        this.player.dispose();
    }
    render() {
        return (
            <div>
               {this.hanleProgress()}
                <div data-vjs-player>
                    <video ref={ node => this.videoNode = node } data-setup='{"aspectRatio":"16:9"}' className="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" id="myvideo" poster={flash}></video>
                </div>
            </div>
        );
    }
}
export default Live;
