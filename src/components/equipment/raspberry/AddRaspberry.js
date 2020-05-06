import React, { Component } from 'react';
import '../../../style/ztt/css/AddRaspberry.less';
import { Tabs,Button,message} from 'antd';
import {Link} from 'react-router-dom'
import UploadRas from "./UploadRas";
import axios from "../../../axios/index";
import ConfigureRas from "./ConfigureRas";
import CameraSet from "./cameraSetRas"
import DefTime from "./DefendTimeRas";
import RaspEdit from "./RaspEdit";
import FalsePositives from "./FalsePositives";
const { TabPane } = Tabs;
class AddRaspberry extends Component{
    constructor(props){
        super(props);
        this.state={
            activeKeys:"",
            disabledStopSer: true,
            disabled24: true,
            disabledRecover: true,
            equipData:{},
            subNode:[]
        };
    }
    componentWillMount() {
        this.setState({
            activeKeys:this.props.query.activeKeys,
        })
    }
    componentDidMount(){
        if (this.props.query.code) {
            if(this.state.activeKeys==3 || this.state.activeKeys ==4 || this.state.activeKeys ==5){
                this.getOne();
                this.hanleSubordinate();
            }
        }
    }
    //所属节点
    hanleSubordinate=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/system/nodelist",
            data:{}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    subNode:res.data
                })
            }
        })
    };
    getOne = () => {
        axios.ajax({
                method: "get",
                url: window.g.loginURL + "/api/camera/getone",
                data: {
                    code: this.props.query.code
                }
            })
            .then(res => {
                if (res.success) {
                    if (res.data.cstatus === 0) {
                        this.setState({
                            disabledStopSer: true,
                            disabled24: true,
                            disabledRecover: true
                        });
                    } else if (res.data.cstatus === 1) {
                        if (res.data.if_cancel === 1) {
                            this.setState({
                                disabledStopSer: false,
                                disabled24: true,
                                disabledRecover: false
                            });
                        } else if (res.data.if_cancel === 0) {
                            this.setState({
                                disabledStopSer: false,
                                disabled24: false,
                                disabledRecover: true
                            });
                        } else if (res.data.if_cancel === 2) {
                            this.setState({
                                disabledStopSer: true,
                                disabledRecover: false,
                                disabled24: false
                            });
                        }
                    }
                    this.setState({
                        equipData: res.data,
                    });
                }else{
                    message.error(res.msg)
                }
            });
    };
    //设备配置摄像头
    hanleConfigure=(param)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/initproperties",
            data:param
        }).then((res)=>{
            if(res.success){
                setTimeout(()=>this.hanleReault(res.data),3000);
            }
        })
    };
   //任务结果返回
    hanleReault=(taskid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rasptaskrst",
            data:{taskid:taskid}
        }).then((res)=>{
            if(res.success){
                if(res.data.taskresult){
                    let taskresult=JSON.parse(res.data.taskresult);
                    if(taskresult.initstatus=="200"){
                        window.location.href="#/main/raspberry";
                        message.success("配置成功！");
                    }else{
                        message.error("配置失败！");
                    }
                }else{
                    console.log("配置失败！")
                }
            }
        })
    }
    hanleShowTab=()=>{
        if(this.state.activeKeys == 1){
            return(
                <Tabs defaultActiveKey={this.state.activeKeys} className="setting">
                    <TabPane
                        key="1"
                        tab={
                            <span
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <span className="upload"/>上传设备
                            </span>
                        }
                       >
                        <UploadRas />
                    </TabPane>
                </Tabs>
            )
        }else if(this.state.activeKeys == 2){
            return(
                <Tabs defaultActiveKey={this.state.activeKeys} className="setting">
                    <TabPane
                        key="2"
                        tab={
                            <span
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <span className="binding"/>配置
                            </span>
                        }
                    >
                        <ConfigureRas
                            configureSubmit={this.hanleConfigure}
                            ecode={this.props.query.ecode}
                        />
                    </TabPane>
                </Tabs>
            )
        }else if(this.state.activeKeys == 3 || this.state.activeKeys == 4 ||this.state.activeKeys == 5 ||this.state.activeKeys == 6){
            return(
                <Tabs defaultActiveKey={this.state.activeKeys} className="setting">
                    <TabPane
                        key="5"
                        tab={
                            <span
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <span className="baseinfo"/>基本信息
                            </span>
                        }
                    >
                        <RaspEdit
                            ststIn = {this.state}
                            equipData = {this.state.equipData}
                            getOne = {this.getOne}
                            subNode={this.state.subNode}
                            formcode = {this.props.query.code}
                            handleThresholdChange = {this.handleThresholdChange}
                            handleFrozenChange = {this.handleFrozenChange}
                        />
                    </TabPane>
                    <TabPane
                        key="3"
                        tab={
                            <span
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <span className="camera"/>防区设置
                            </span>
                        }
                       >
                        <CameraSet
                            camerdat = {this.state}
                            code={this.props.query.code}
                            getOne = {this.getOne}
                            ecode={this.props.query.ecode}
                        />
                    </TabPane>
                    <TabPane
                        key="6"
                        tab={
                            <span
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <span className="positives"/>误报设置
                            </span>
                        }
                    >
                        <FalsePositives
                            camerdat = {this.state}
                        />
                    </TabPane>
                    <TabPane
                        key="4"
                        tab={
                            <div
                                style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <span className="deftime"/>布防时间
                            </div>
                        }
                        >
                        <DefTime
                            code={this.props.query.code}
                            equipData={this.state.equipData}
                            getOne={this.getOne}
                            ecode={this.props.query.ecode}
                        />
                    </TabPane>
                </Tabs>
            )
        }
    }
    render() {
        return (
            <div className="addRaspberry">
                <Button type="primary"><Link to="/main/raspberry">返回</Link></Button>
                {this.hanleShowTab()}
            </div>
        );
    }
}

export default AddRaspberry;
