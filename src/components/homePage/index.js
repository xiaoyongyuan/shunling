import React, { Component } from 'react';
import "./index.less";
import {Modal,Icon,message,Row,Col} from "antd";
import {Link} from "react-router-dom";
import defenceImg from "../../style/ztt/imgs/defenceImg.png";
import HomePageModel from "./HomePageModel";
import axios from "../../axios/index";
import nodata from "../../style/imgs/nodata.png";
import Swiper from "swiper/dist/js/swiper";
import "swiper/dist/css/swiper.min.css";
import playBtn from "../../style/ztt/imgs/playBtn.png";
import moment from "moment";
import Live from "../live/Live";
import D3 from "./D3";
//redux
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {postReducer,setpoliceList} from "../../action/sckoetAction";
class Index extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fortification:"已布防",
        visible:false,
        policeList:[],
        closeBtn:false,
        cameraList:[],
        liveList:[],
        alarmWeb:"",
        raspberryList:[],
        
        nvrip: "",//历史视频需要字段
        nvrusername: "",//历史视频需要字段
        nvrpwd: "",//历史视频需要字段
        memo: 0,//历史视频需要字段
      };
      this.memonvr={};
    };
    componentDidMount() {
        this.hanleBgColor1();
        this.hanleBgColor2();
        this.getList();
        this.equipmentCount();
        this.policeCount();
        this.cameraList();
        this.hanleEqument();
        this.setState({
            nowTime:Date.parse(new Date())
        });
        this.props.postReducer();
        new Swiper(".swiper-container", {
            loop: false, //循环
            autoplay: {
                //滑动后继续播放（不写官方默认暂停）
                disableOnInteraction: false
            }, //可选选项，自动滑动
            slidesPerView: 5,
            spaceBetween: 10,
            observer: true,
            observeParents: true,
            observeSlideChildren: true
        });
    };

    /*componentWillUpdate (nextProps,nextState) {
        let msgInfo=JSON.parse(nextProps.alarNums).msgInfo;
        if(msgInfo){
            let jsonMsg=JSON.parse(msgInfo);
           this.state.alarmWeb=jsonMsg.cameracode;
        }
    }*/
    //树莓派设备列表
	hanleEqument=()=>{
		axios.ajax({
			method:"get",
			url:window.g.loginURL+"/api/equ/getlist",
			data:{
                estatus:-1,
                pagesize:12
            },
		}).then((res)=>{
            if(res.success){
                this.setState({
                    raspberryList:res.data
                })
            }
		})
	};
    hanleLiveCancel=()=>{
        this.setState({
            liveModel:false
        })
    };
    //设备数量
    equipmentCount=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/index/equipmenttotal",
            data:{}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    cameraTotals:res.data.cameraTotals,
                    onlineCameras:res.data.onlineCameras,
                    downCameras:res.data.downCameras
                })
            }
        })
    };
    policeCount=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/index/alarmtotal",
            data:{}
        }).then((res)=>{
            if(res.success){
                if(res.data.unDealCount){
                    this.props.setpoliceList(res.data.unDealCount);
                }
                this.setState({
                    totalCount:res.data.totalCount,
                    hasDealCount:res.data.hasDealCount,
                    unDealCount:res.data.unDealCount
                })
            }
        })
    };
    //报警信息
    getList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/index/alarmvideolist",
            data:{}
        }).then((res)=>{
            this.setState({
                policeList:res.data
            })
        })
    };
    hanleBgColor1=(params)=>{
        if(this.state.fortification===params){
            return "defended-name defendedBorder1Color";
        }else{
            return "defended-name defendedBorder2Color";
        }
    };
    //已布防、已撤防样式
    hanleBgColor2=(params)=>{
        if(this.state.fortification===params){
            return "defendedBorder1 defendedBorder1bg defendedBorder1Color";
        }else{
            return "defendedBorder2 defendedBorder2bg defendedBorder2Color";
        }
    };
    hanleWithdrawal=(listCode)=>{
        this.setState({
            visible:true,
            listCode:listCode
        });
    };
    handleOk=()=>{
        this.setState({
            visible:true
        })
    };
    //直播窗口
    handleCancel=()=>{
        this.setState({
            visible:false
        });
        this.getList();
    };
    //报警背景颜色
    hanlePoliceBg=(ststus)=>{
        switch (ststus) {
            case 0:
                return "policeStatus unhanle";
            case 1:
                return "policeStatus policebg";
            case 3:
                return "policeStatus falsePolicebg";
            default:
                return;
        }
    };
    //报警状态
    hanleStatus=(ststus)=>{
        switch (ststus) {
            case 0:
                return "未处理";
            case 1:
                return "警情";
            case 3:
                return "虚警";
            default:
                return;
        }
    };
    hanleClose=()=>{
        this.setState({
            closeBtn:false
        })
    };
    //直播设备列表
    cameraList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/camera/getlistforvideo",
            data:{}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    liveList:res.data
                });
            }
        })
    };
    hanleVideoBor=(code)=>{
        if(this.state.policeCode===code){
            return "videBor";
        }
    };
    hanleWeb=(code)=>{
        if(this.state.alarmWeb==code){
            return "videoChange";
        }
    };

    hanleLive=(videostreaming)=>{
        this.setState({
            liveModel:true,
            videoAdd:videostreaming
        });
    };
    hanleDetails=(videoCode)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/camera/getone",
            data:{code:videoCode}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    closeBtn:true,
                    camName:res.data.name,
                    camIp:res.data.ip,
                    camImg:res.data.fileip+res.data.picpath,
                    camVideo:res.data.fileip+res.data.videopath,
                    camFieldnum:res.data.setuptime?moment(res.data.setuptime).format('YYYY-MM-DD hh:mm:ss'):"无",
                    policeCode:res.data.code,
                    /*设防情况 0已撤防 1已布防*/
                    fortification:res.data.workingstatus,
                    /*设防情况的按钮 0布防中 1一键布防 2一键撤防*/
                    deployment:res.data.if_cancel,
                    groupid:res.data.groupid
                })
            }else{
                message.warning(res.msg);
            }
        })
    }
    hanleLiveCancel=()=>{
        this.setState({
            liveModel:false
        })
    };
    hanleShow=(equment,cid)=>{
        const _this=this;
        if(cid){
            equment.on("click",function () {
                axios.ajax({
                    method:"get",
                    url:window.g.loginURL+"/api/index/lastalarmmsg",
                    data:{cid:cid}
                }).then((res)=>{
                    if(res.success){
                        if(res.data){
                            let policeType="";
                            if(res.data.status==0){
                                policeType="未处理";
                            }else if(res.data.status==1){
                                policeType="警情";
                            }else if(res.data.status==3){
                                policeType="虚警";
                            }
                            if(res.data.memo){
                                this.memonvr=res.data.memo;
                            }else{
                                this.memonvr={};
                            }
                            _this.setState({
                                memo: this.memonvr,
                                closeBtn:true,
                                camName:res.data.eid,
                                camname:res.data.name,
                                policeType:policeType,
                                camFieldnum:res.data.atime,
                                camImg:window.g.imgUrl+res.data.picpath,
                                camVideo:window.g.imgUrl+res.data.videopath
                            });
                        }else{
                            message.info(res.msg);
                        }
                    }else{
                        message.error(res.msg);
                    }
                });
            })
        }
    };
    render() {
        return(
            <div className="homePage">
                <div className="equNum">
                    {/* <div className="equ equ-right">
                        <span className="equImg1" />
                        <div className="equContext equColor1">
                            <span className="equipName">接入设备</span>
                            <span className="equipTotal"><span className="equBer">{this.state.cameraTotals?this.state.cameraTotals:0}</span>部</span>
                        </div>
                    </div> */}
                    <div className="equ equBorder">
                        <span className="equImg2" />
                        <div className="equContext equColor2">
                            <span className="equipName">在线设备</span>
                            <span className="equipTotal"><span className="equBer">{this.state.onlineCameras?this.state.onlineCameras:0}</span>部</span>
                        </div>
                    </div>
                    <div className="equ equBorder">
                        <span className="equImg3" />
                        <div className="equContext equColor3">
                            <span className="equipName">离线设备</span>
                            <span className="equipTotal"><span className="equBer">{this.state.downCameras?this.state.downCameras:0}</span>部</span>
                        </div>
                    </div>
                    <div className="equ equBorder">
                        <span className="equImg4" />
                        <div className="equContext equColor4">
                            <span className="equipName">已处理报警</span>
                            <span className="equipTotal-Handle"><span className="equBer">{this.state.hasDealCount?this.state.hasDealCount:0}</span>条</span>
                        </div>
                    </div>
                    <div className="equ equBorder">
                        <span className="equImg5" />
                        <div className="equContext equColor5">
                            <span className="equipName">未处理报警</span>
                            <span className="equipTotal-UHandle"><span className="equBer">{this.state.unDealCount?this.state.unDealCount:0}</span>条</span>
                        </div>
                    </div>
                    <div className="equ1 equ-left">
                        <span className="equImg8" />
                        <div className="equContext">
                            <span className="equipName">今天报警总数</span>
                            <span className="equipTotal-today"><span className="equBer">{this.state.totalCount?this.state.totalCount:0}</span>条</span>
                        </div>
                    </div>
                </div>
                {/* 顺陵 */}
                <div className="computerRoom" >
                    <div className="cameraList">
                        <p className="cameraList-title">顺陵景区导览图</p>
                        <div className="sketchMap">
                            <D3 showHide={this.hanleShow} raspberryList={this.state.raspberryList} />
                            <div className="roadImg"/>
                            <span className="roadName">陵区</span>
                        </div>
                    </div>
                    <div className="computerRoom-camera" style={{display:this.state.closeBtn?"block":"none"}}>
                        <div className="video-camera">
                            <span className="videoCameraName"><span className="videoImg"/><span className="videoName">{this.state.camName}</span></span><Icon type="close" onClick={this.hanleClose} className="close"/>
                        </div>
                        <div className="eqiIp">
                            <div className="eqiIp-context">
                                <span>设备名称</span>
                                <span>{this.state.camname}</span>
                            </div>
                            <div className="eqiIp-UHanld">
                                <Link to={"/main/historyVideo?&memo="+this.state.memo}>历史视频</Link>
                            </div>
                        </div>
                        <div className="eqiIp">
                            <div className="eqiIp-context">
                                <span>处理状态</span>
                                <span className="unwork">{this.state.policeType}</span>
                            </div>
                            <div className="eqiIp-UHanld">
                               {/* <span>报警时间</span>*/}
                                <span>{this.state.camFieldnum}</span>
                            </div>
                        </div>
                       {/* <div className="eqiIp">
                            <div className="eqiIp-context1">
                                <span>报警处理状态</span>
                                <span className="unwork">{this.state.policeType}</span>
                            </div>
                            <div className="eqiIp-UHanld">
                                <Link to={"/main/historyVideo?&memo="+this.state.memo}>历史视频</Link>
                            </div>
                        </div>*/}
                        <div className="fortification">
                        </div>
                        <div className="lastAlarm">
                            <div className="alarm-title"><span className="videoImg" /><span className="videoName">最新一次报警情况</span></div>
                            <div className="alarmImg">
                                <div className="alarmVideo"><img
                                    src={this.state.camImg ? this.state.camImg : defenceImg} alt=""/>
                                    <div className="alarmVideoBottom">
                                        <span className="alarmVideoCircle"/><span
                                        className="alarmVideoName">{this.state.camName}</span>
                                    </div>
                                </div>
                                <div className="alarmVideo">
                                    <video controls="controls" loop="loop" autoPlay="autoplay" src={this.state.camVideo ? this.state.camVideo : defenceImg}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

               {/*广州公安局 警戒设备布防图*/}
               {/* <div className="computerRoom" >
                    <div className="cameraList">
                        <p className="cameraTitle"><span className="cameraLogin"/><span className="cameraFont">视频直播</span></p>
                        <Row gutter={16} className="videstyle">
                            {
                                this.state.liveList.length>0?
                                    this.state.liveList.map((v,i)=>(
                                        <Col xxl={6} xl={12} key={i} className={"videoMore "+this.hanleVideoBor(v.code)}>
                                            <div className={"gutter-box borderBot "+this.hanleWeb(v.code)}>
                                                <img className="videoImg" src={v.basemap?window.g.imgUrl+v.basemap+"?t="+this.state.nowTime:defenceImg} alt="" />
                                                <img className="videoBtn" src={playBtn} alt="" onClick={()=>this.hanleLive(v.eid,v.code)} />
                                                <div className="broadcastBott">
                                                    <span><span className="broCircle"/><span className="broFont">{v.name}</span></span>
                                                    <span className="dateil" onClick={()=>this.hanleDetails(v.code)}>查看详情</span>
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                    :<div className="nodata"><img src={nodata} alt="" /></div>
                            }
                        </Row>
                    </div>
                    <div className="computerRoom-camera" style={{display:this.state.closeBtn?"block":"none"}}>
                        <div className="video-camera">
                            <span className="videoCameraName"><span className="videoImg"/><span className="videoName">{this.state.camName}</span></span><Icon type="close" onClick={this.hanleClose} className="close"/>
                        </div>
                        <div className="eqiIp">
                            <div className="eqiIp-context">
                                <span>设备IP</span>
                                <span>{this.state.camIp}</span>
                            </div>
                            <div className="eqiIp-UHanld">
                                <span>设防情况</span>
                                <span className={this.hanleBg()}>{this.state.fortification===1?"工作中":"休息中"}</span>
                            </div>
                        </div>
                        <div className="eqiIp">
                            <div className="eqiIp-context1">
                                <span>设备创建时间</span>
                                <span>{this.state.camFieldnum}</span>
                            </div>
                        </div>
                        <div className="lastAlarm">
                            <div className="alarm-title"><span className="videoImg" /><span className="videoName">最新一次报警情况</span></div>
                            <div className="alarmImg">
                                <div className="alarmVideo"><img
                                    src={this.state.camImg ? this.state.camImg : defenceImg} alt=""/>
                                    <div className="alarmVideoBottom">
                                        <span className="alarmVideoCircle"/><span
                                        className="alarmVideoName">{this.state.camName}</span>
                                    </div>
                                </div>
                                <div className="alarmVideo">
                                    <video controls="controls" loop="loop" autoPlay="autoplay" src={this.state.camVideo ? this.state.camVideo : defenceImg}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}
                <div className="alarminfor">
                    <div className="swiper-container ">
                        <div className="swiper-wrapper">
                                {
                                    this.state.policeList.map((v,i)=>(
                                        <div className="swiper-slide" onClick={()=>this.hanleWithdrawal(v.code)} key={i}>
                                            <img src={v.picpath?window.g.imgUrl+v.picpath:defenceImg} alt="" className="defence"/>
                                            <div className="alarminforBg">
                                                <span className="alarminforFont">{v.atime}</span>
                                                <span className="alarminforVideo"/>
                                            </div>
                                            <div className={this.hanlePoliceBg(v.status)}><span className="policeStatusCicle"/><span className="policeStatusFont">{this.hanleStatus(v.status)}</span></div>
                                            <div className="alarmTitle">
                                                <span className="alarminforCirle"/>
                                                <span className="policeTimes">{v.name}</span>
                                            </div>
                                        </div>
                                    ))
                                }
                        </div>
                        <a href="#/main/policeInformation" className="morePolice">
                            <p className="policeMore">更</p>
                            <p className="policeMore">多</p>
                            <p className="policeMore">报</p>
                            <p className="policeMore">警</p>
                            <p className="policeMore">信</p>
                            <p className="policeMore">息</p>
                            <Icon className="iconRight" type="double-right" />
                        </a>
                    </div>
                </div>
                <div className="nodata"><img src={nodata} alt="" style={{width:"80px",height:"78px",display:this.state.policeList.length>0?"none":"block"}} /></div>
                <Modal
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    centered
                    onCancel={this.handleCancel}
                    width={1200}
                    footer={null}
                    destroyOnClose={true}
                >
                    <HomePageModel visible={this.state.visible} listCode={this.state.listCode} />
                </Modal>
                <Modal
                    title="直播"
                    visible={this.state.liveModel}
                    width={850}
                    footer={null}
                    onCancel={this.hanleLiveCancel}
                    destroyOnClose={true}
                    maskClosable={false}
                >
                    <Live liveModel={this.state.liveModel} eid={this.state.videoAdd} />
                </Modal>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    alarNums:state.postReducer.num,
    policeList: state.policeList,
});
Index.propTypes = {
    postReducer: PropTypes.func.isRequired,
    setpoliceList: PropTypes.func.isRequired,
};
export default connect(mapStateToProps,{postReducer,setpoliceList})(Index);
