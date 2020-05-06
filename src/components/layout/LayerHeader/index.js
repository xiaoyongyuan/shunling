import React, {Component} from 'react';
import {Icon, Modal, notification, Popover, Form, Input,message,Badge} from "antd";
import './index.less';
import {withRouter} from 'react-router-dom';
//reudux
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {postReducer} from '../../../action/sckoetAction';
import voice from "../../../style/ztt/voice/audio.mp3";
 import axios from "../../../axios/index";

const confirm = Modal.confirm;

class LayerHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alarmNum: '',
            voiceModel: false,
            updatepass: false,//修改密码
            newsVis:false,//消息提示
        };
    }

    componentDidMount() {
        this.setState({
            account: localStorage.getItem("account"),
        });
        this.props.postReducer();
        setInterval(()=>{
            notification.destroy();
            this.setState({
                newsVis:true
            });
        },600000);
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.alarNums && JSON.parse(nextProps.alarNums).msgInfo) {
            this.state.alarmNum = JSON.parse(nextProps.alarNums).count;
            let cameraName = JSON.parse(nextProps.alarNums).cameraName;//设备名称
            let msgInfo = JSON.parse(JSON.parse(nextProps.alarNums).msgInfo);
            let alarmImg =msgInfo.videopath?window.g.imgUrl + msgInfo.videopath.match(/znwj(\S*)/)[1]:"";//设备图片
            let alarmTime = msgInfo.starttime_ymd + " " + msgInfo.starttime_hms;//报警时间
            let alarmType = "";//报警类型
            msgInfo.info.map((v) => {
                if (v.tag === 0) {
                    alarmType = "人员报警";
                } else {
                    alarmType = "车辆报警";
                }
            });
            if(localStorage.getItem("token")){
                this.setState({
                    cameraName:cameraName,
                    alarmImg:alarmImg,
                    alarmType:alarmType,
                    alarmTime:alarmTime
                },()=>{
                   this.openNotification()
                });
            }
            var audioDom = document.getElementById("audio");
            let voiceBack = localStorage.getItem("voiceBack");
            if (this.state.alarmNum && voiceBack) {
                if (this.state.alarmNum === 0) {
                    audioDom.pause();
                    localStorage.setItem("voiceBack", "false");
                } else if (this.state.alarmNum > 0 && JSON.parse(voiceBack)) {
                    audioDom.play();
                    this.voive();
                    localStorage.setItem("voiceBack", "true");
                } else {
                    audioDom.pause();
                    localStorage.setItem("voiceBack", "false");
                }
            }
        }
    }

    hanlevoice = () => {
        this.setState({
            voiceModel: true
        })
    };
    hanleVioceOk = () => {
        let voiceShow = localStorage.getItem("voiceBack");
        if (JSON.parse(voiceShow)) {
            localStorage.setItem("voiceBack", "false");
        } else {
            localStorage.setItem("voiceBack", "true");
        }
        this.setState({
            voiceModel: false
        });
    };
    hanleVioceCancel = () => {
        this.setState({
            voiceModel: false
        })
    };
    voive = () => {
        let voiceShow = localStorage.getItem("voiceBack");
        if (JSON.parse(voiceShow)) {
            return "equImg6 alarMargin";
        } else {
            return "equImg7 alarMargin";
        }
    };
    hanleClose = () => {
        const _this = this;
        confirm({
            title: '退出',
            content: '确认退出吗？',
            onOk() {
                localStorage.removeItem('account');
                localStorage.removeItem('companycode');
                localStorage.removeItem('ifsys');
                localStorage.removeItem('utype');
                localStorage.removeItem('token');
                localStorage.removeItem('elemapinfo');
                _this.props.history.push('/login')
            }
        });
    };
    //通知消息
    openNotification = () => {
        notification.open({
            message: <div style={{color: "#f00"}}><Icon type="alert"/>&nbsp;最新报警</div>,
            description:
                <div className="newAlarm">
                    <img className="newImg" src={this.state.alarmImg} alt=""/>
                    <div className="newContext">
                        <span>设备名称:{this.state.cameraName}</span>
                        <span>报警类型:{this.state.alarmType}</span>
                        <span>报警时间:{this.state.alarmTime}</span>
                    </div>
                </div>,
            style:{
                position: "absolute",
                left: "-221%",
                bottom: "28%",
                width: "145%",
                height: "54vh",
                transitionDelay:"300ms"
            },
            duration: 0,
        });
    };
    checkPsd2(rule, value, callback) {
        let password = this.props.form.getFieldValue('newpassword');
        if (password && password !== value) {
            callback(new Error('两次密码输入不一致'));
        } else {
            callback();
        }
    }
    //修改密码
    hanleUpdatePass = () => {
        this.setState({
            updatepass: true
        })
    };
    handlePassOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.ajax({
                    method:"post",
                    url:window.g.loginURL+"/api/system/updateuserpwd",
                    data:{
                        account:localStorage.getItem("account"),
                        oldpassword:values.oldpassword,
                        newpassword:values.newpassword
                    }
                }).then((res)=>{
                    if(res.success){
                        this.setState({
                            updatepass: false
                        });
                        message.success("密码修改成功，请重新登录!");
                        this.props.history.push('/login');
                    }else{
                        message.error(res.msg);
                    }
                    this.props.form.resetFields();
                })
            }
        });
    };
    handlePassCancel = () => {
        this.props.form.resetFields();
        this.setState({
            updatepass: false
        })
    };

    render() {
        let voiceShow = JSON.parse(localStorage.getItem("voiceBack"));
        const content = (
            <div className="backout">
                <p onClick={this.hanleUpdatePass}>修改密码</p>
                <p onClick={this.hanleClose}>退出</p>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        return (
            <div className="LayerHeader">
                <div className="headerLeft">
                    <div className="logo"/>
                    <div className="secant"/>
                    <div className="logo-title">A.I.视频警戒系统</div>
                </div>
                <div className="headerRight">
                    <div className="alarmNum">
                       {/* <Badge count={this.props.policeList} style={{display:this.state.newsVis?"block":"none"}}>
                            <span className={this.voive()} onClick={this.hanlevoice}/>&nbsp;&nbsp;
                        </Badge>*/}
                        <Badge count={this.props.policeList}>
                            <Icon type="bell" />
                        </Badge>
                        {/*<span className="alarmfont">今日未处理主报警数：{this.state.alarmNum}</span>*/}
                        <audio id="audio" loop src={voice} type="audio/mp3"/>
                    </div>
                    <div className="alarmRight">
                        <div className="header-right"/>
                        <span>{this.state.account}</span>
                        <Popover placement="bottomRight" content={content} title="用户中心">
                            <Icon type="caret-down" className="signout"/>
                        </Popover>
                    </div>
                </div>
                <Modal
                    title="提示"
                    visible={this.state.voiceModel}
                    onOk={this.hanleVioceOk}
                    onCancel={this.hanleVioceCancel}
                    okText="确认"
                    cancelText="取消"
                    width={350}
                >
                    <div><span>{voiceShow ? '确定关闭声音吗?' : '确定开启声音吗?'}</span></div>
                </Modal>
                <Modal
                    title="修改密码"
                    visible={this.state.updatepass}
                    onOk={this.handlePassOk}
                    onCancel={this.handlePassCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="旧密码">
                            {getFieldDecorator('oldpassword', {
                                rules: [
                                    {required: true, message: '请输入旧密码!'},
                                    {min:6,message:"旧密码最小长度为6位！"},
                                    {max:8,message:"旧密码最大长度为8位！"}
                                    ],
                            })(
                                <Input.Password  placeholder="请输入旧密码"/>
                            )}
                        </Form.Item>
                        <Form.Item label="新密码">
                            {getFieldDecorator('newpassword', {
                                rules: [
                                    {required: true, message: '请输入新密码!'},
                                    {min:6,message:"新密码最小长度为6位！"},
                                    {max:8,message:"新密码最大长度为8位！"}
                                    ],
                            })(
                                <Input.Password  placeholder="请输入新密码"/>
                            )}
                        </Form.Item>
                        <Form.Item label="确认密码">
                            {getFieldDecorator('restpass', {
                                rules: [
                                    {required: true, message: '请输入确认密码!'},
                                    { validator: (rule, value, callback) => { this.checkPsd2(rule, value, callback) } },
                                    {min:6,message:"确认密码最小长度为6位！"},
                                    {max:8,message:"确认密码最大长度为8位！"}
                                    ],
                            })(
                                <Input.Password  placeholder="请输入确认密码"/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    alarNums: state.postReducer.num,
    policeList: state.postReducer.policeList,
});
LayerHeader.propTypes = {
    postReducer: PropTypes.func.isRequired,
};
export default withRouter(connect(mapStateToProps, {postReducer})(Form.create()(LayerHeader)));
