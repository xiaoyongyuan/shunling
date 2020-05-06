import React, { Component } from 'react';
import { Calendar, Button, message, Tabs, TimePicker, Result } from 'antd';
import { Link } from "react-router-dom";
import './historymovies.css'
import axios from "../../axios/index";
import Live from "./Live";
import moment from 'moment';
import videojs from "video.js";
var resultCount=0;
var videoCount=0;
class Historymovies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starttime: {},//开始时间
            endtime: {},//结束时间
            filelist: [],//播放列表
            sessionid: "",//会话ID，一组唯一随机字符串
            taskid: "",//任务ID，同一会话中唯一随机字符串
            type: 0,//消息类型，1代表连接会话
            filename: "",//当前播放的  filename
            urlHistory: "",//播放url
            datachange: "",//改变url时
            names: "",//消息类型
            timeVis:true
        };
        this.resultClear="";
    };
    //   日期改变
    onPanelChange(value, mode) {
        let newtime = value.format("YYYY-MM-DD");
        newtime = newtime.split("-")
        let starttime = this.state.starttime;
        let endtime = this.state.endtime;
        starttime.year = parseInt(newtime[0]);
        starttime.month = parseInt(newtime[1]);
        starttime.day = parseInt(newtime[2]);
        endtime.year = parseInt(newtime[0]);
        endtime.month = parseInt(newtime[1]);
        endtime.day = parseInt(newtime[2]);
        this.setState({
            starttime,
            endtime,
        })
    }
    // 开始时间变化
    starttimeChange(val) {
        let newtime = val.format("HH:mm:ss");
        newtime = newtime.split(":")
        let starttime = this.state.starttime;
        starttime.hour = parseInt(newtime[0]);
        starttime.minute = parseInt(newtime[1]);
        starttime.second = parseInt(newtime[2]);
        this.setState({
            starttime,
        })
    }
    // 结束时间变化
    endtimeChange(val) {
        let newtime = val.format("HH:mm:ss");
        newtime = newtime.split(":");
        let endtime = this.state.endtime;
        endtime.hour = parseInt(newtime[0]);
        endtime.minute = parseInt(newtime[1]);
        endtime.second = parseInt(newtime[2]);
        this.setState({
            endtime,
        })
    }
    // 搜索
    timeChange() {
        this.RequestList();
    }

    componentDidMount = () => {
        let todaytime = moment().format("YYYY-MM-DD");
        todaytime = todaytime.split("-");
        this.setState({
            starttime: {
                year: parseInt(todaytime[0]),
                month: parseInt(todaytime[1]),
                day: parseInt(todaytime[2]),
                hour: 0,
                minute: 0,
                second: 0
            },
            endtime: {
                year: parseInt(todaytime[0]),
                month: parseInt(todaytime[1]),
                day: parseInt(todaytime[2]),
                hour: 23,
                minute: 59,
                second: 59
            }
        }, () => {
            this.RequestList();
        })
    };
    // 请求指定时间的视频播放段
    // 查看摄像头下历史视频【连接】- 1
    RequestList() {
        let memo={};
        if(this.props.query.memo){
            memo=JSON.parse(this.props.query.memo);
        }else{
            memo={};
        }
        axios.ajax({
            method: "post",
            url: window.g.loginURL + "/api/rasp/camerahistoryvideo",
            data: {
                ip:memo.nvrip,
                user:memo.nvruser,
                pwd:memo.nvrpwd,
                channel:parseInt(memo.nvrchannel),
                starttime: this.state.starttime,
                endtime: this.state.endtime,
            }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    names: res.data.name,
                    sessionid: res.data.sessionid,
                }, () => {
                  this.resultClear=setInterval(()=>this.hanleVideoResult(res.data.sessionid,res.data.taskid),2000);
                })
            }
        })
    }
    //播放历史视频的返回结果
    hanleVideoResult=(sessionid,taskid)=>{
        resultCount++;
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/rasp/historyvideoresult",
            data: {
                sessionid:sessionid,
                taskid:taskid,
            }
        }).then((res) => {
            if (res.success && res.data!==null) {
                clearInterval(this.resultClear);
                this.setState({
                    filelist: res.data.filelist ? res.data.filelist : [],
                    type: res.data.type,
                    taskid: res.data.taskid,
                    urlHistory:res.data.url
                })
            }else{
                if(resultCount>7){
                    clearInterval(this.resultClear);
                }else{
                    message.error(res.msg)
                }
            }
        })
    };
    // 播放历史视频发送时间【播放】
    videoplayback() {
        axios.ajax({
            method: "post",
            url: window.g.loginURL + "/api/rasp/playhistoryvideo",
            data: {
                uuid: this.state.sessionid,
                filename: this.state.filename,
                starttime: this.state.starttime,
                endtime: this.state.endtime,
            }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    names: res.data.name,
                },()=>{
                    this.VideoHis=setInterval(()=>this.hanleVideoHis(res.data.sessionid,res.data.taskid),2000);
                })
            }
        })
    }
    hanleVideoHis=(sessionid,taskid)=>{
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/rasp/historyvideoresult",
            data: {
                sessionid:sessionid,
                taskid:taskid,
            }
        }).then((res) => {
            if (res.success && res.data!==null) {
                videoCount++;
                if(res.data.url){
                    clearInterval(this.VideoHis);
                    this.setState({
                        urlHistory:res.data.url,
                        datachange:"urlchange"
                    })
                }else{
                    if(videoCount>4){
                        clearInterval(this.VideoHis);
                    }
                }
            }else{
                if(videoCount>4){
                    clearInterval(this.VideoHis);
                }
            }
        })
    };
    // 选择时间
    tabschange(val) {
        axios.ajax({
            method: "post",
            url: window.g.loginURL + "/api/rasp/stophistoryvideo",
            data: {
                cmd: "stop",
                uuid: this.state.sessionid,
            }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    filename: val.filename,
                    starttime: val.starttime,
                    endtime: val.endtime,
                    datachange:"",
                    timeVis:false
                }, () => {
                    this.videoplayback();
                })
            }
        })
    }
    componentWillUnmount() {
        axios.ajax({
            method: "post",
            url: window.g.loginURL + "/api/rasp/closehistoryvideo",
            data: {
                cmd: "close",
                uuid: this.state.sessionid,
            }
        }).then((res) => {
            if (res.success) {}
        })
        clearInterval(this.resultClear);
        clearInterval(this.VideoHis);
    }
    resetDatachange =(player,url,videojs) =>{
        if(player){
            videojs.options.flash.swf = require('videojs-swf/dist/video-js.swf');
            player.src({type:'rtmp/flv',src:url});
            player.load(url);
            player.play();
        }
    };
    hanleliveProgress=()=>{

    };
    render() {
        return (
            <div className='history-component'>
                <div className='history-show'>
                    <div className="history-title" style={{ display: "flex", justifyContent: "space-between",alignItems:"center" }}>
                        <div style={{width:"100%",textAlign:"center"}}>
                            <span>历史视频</span>
                        </div>
                        {
                            this.state.filename? <Link to={"/main/empty?path=/main/historyVideo&memo="+this.props.query.memo}>
                                <Button type="primary" >关闭</Button>
                            </Link>:""
                        }
                    </div>
                    <div className="history-movies" id="historyMovies">
                        {this.state.filename ?
                            <div style={{
                                width: "90%", height: "100%", position: "absolute", left: 0, right: 0, top: 0,
                                bottom: 0, marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto"
                            }}>
                                <Live eid={this.state.urlHistory} liveProgress={this.hanleliveProgress} datachange={this.state.datachange} resetDatachange={(player,url,videojs)=>this.resetDatachange(player,url,videojs)}/>
                            </div>
                            :
                            <Result
                                title="请选择播放时间"
                                extra={
                                    <Link to="/main/index"><Button type="primary">返回首页</Button></Link>
                                }
                            />
                        }
                    </div>
                    {
                        this.state.filelist.length > 0?
                            <div>
                                <span className="alarmList">时间列表</span>
                                <div className="timeLine" style={{display:this.state.timeVis?"block":"none"}}>
                                    {
                                        this.state.filelist.map((v,i)=>(
                                            <span className="times" key={i} onClick={()=>this.tabschange(v)}>{`${v.starttime.hour}:${v.starttime.minute}-${v.endtime.hour}:${v.endtime.minute}`}</span>
                                        ))
                                    }
                                </div>
                            </div>:<span />
                    }
                </div>
               {/* <div className='history-calendar'>
                    <Calendar fullscreen={false} onChange={this.onPanelChange.bind(this)} />
                    <div style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "5px" }}>
                            <div>开始时间：</div>
                            <TimePicker style={{ width: "180px" }} onChange={this.starttimeChange.bind(this)} defaultValue={moment('00:00:00', 'HH:mm:ss')} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", margin: "5px" }}>
                            <div>结束时间：</div>
                            <TimePicker style={{ width: "180px" }} onChange={this.endtimeChange.bind(this)} defaultValue={moment('23:59:59', 'HH:mm:ss')} />
                        </div>
                        <Button style={{ margin: "8px" }} type="primary" onClick={this.timeChange.bind(this)}>搜索</Button>
                    </div>
                </div>*/}
            </div>
        );
    }
}

export default Historymovies;
