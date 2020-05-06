import {Col, Row, Button, Select, Form, Input, Slider, Switch, Radio ,Checkbox,message } from "antd";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "../../../axios/index";
import "../../../style/jhy/less/equipset.less";
import "../../../style/jhy/less/reset.less";
const { Option } = Select;
class RaspEdit extends Component {
    constructor(props){
        super(props) ;
        this.state = {
            dfrtg:1,
            subNode:[],
            nvrvalue:1
        };
        this.nvrip="";
        this.nvruser="";
        this.nvrpwd="";
        this.memo="";
    }
    componentWillReceiveProps(nextProps){
        if(this.props.equipData !== nextProps.equipData){
            this.getbaseinfodate(nextProps.equipData)
        }
    }
    //系统初始化
    setInitInfo = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/redisinfo/setinfo",
            data: {}
        }).then(res => {});
    };
    getbaseinfodate = (equipData) =>{
        let nvrvalue=0;
        if(equipData.memo){
            nvrvalue=1;
            let memo=JSON.parse(equipData.memo);
            this.nvrip=memo.nvrip;
            this.nvruser=memo.nvruser;
            this.nvrpwd=memo.nvrpwd;
            this.memo=memo.nvrchannel
        }else{
            nvrvalue=2
        }
        let ifvoiceValue="";//外接设备
        let ifvoice=equipData.ifvoice;//equipData.ifvoice
        if(equipData.ifvoice){
            if(ifvoice==1){
                ifvoiceValue=["1"];
            }else if(ifvoice==2){
                ifvoiceValue=["2"];
            }else if(ifvoice==3){
                ifvoiceValue=["3"];
            }else if(ifvoice==4){
                ifvoiceValue=["1","2"];
            }else if(ifvoice==5){
                ifvoiceValue=["1","3"];
            }else if(ifvoice==6){
                ifvoiceValue=["2","3"];
            }else if(ifvoice==7){
                ifvoiceValue=["1","2","3"];
            }
        }
        this.setState({
            ifvoiceBack:ifvoiceValue,
            outEid:equipData.eid
        });
        console.log(equipData.name)
        this.props.form.setFieldsValue({
            name: equipData.name || "",
            ipctype: equipData.ipctype || "hikvision",
            fielddistance: equipData.fielddistance || "10~20米",
            scene: equipData.scene || "室外",
            ip: equipData.ip || "",
            authport: equipData.authport || "",
            ausername: equipData.ausername || "",
            apassword: equipData.apassword || "",
            streamport: equipData.streamport || "",
            vusername: equipData.vusername || "",
            vpassword: equipData.vpassword || "",
            Protocol: equipData.Protocol || "",
            threshold: equipData.threshold || 5,
            frozentime: equipData.frozentime || 5,
            alarmtype: equipData.alarmtype || 0,
            groupid:equipData.groupid,
            nvrip:this.nvrip,
            nvruser:this.nvruser,
            nvrpwd:this.nvrpwd,
            memo:this.memo,
            ifvoice:ifvoiceValue,
            nvrvalue:nvrvalue
        });
    };
    //编辑外接设备时调用
    hanleInternet=(ifvoice)=>{
        if(this.state.outEid && ifvoice){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/rasp/iotequ",
                data:{
                    iotequ:ifvoice,
                    devid:this.state.outEid
                }
            }).then((res)=>{if(res.success){}})
        }
    };
    //编辑报警识别阀门
    Identification=(threshold)=>{
        if(this.state.outEid){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/camera/thresholdset",
                data:{
                    type:1,
                    devid:this.state.outEid,
                    threshold:threshold
                }
            }).then((res)=>{if(res.success){}})
        }
    };
    handleChangeInfo = e => {
        e.preventDefault();
        this.props.form.validateFields((err, fields) => {
            if (err) {
                message.error(err);
            } else {
                let msg={};//nvr对象
                let ifvoiceValue="";//外接设备
                let ifvoice=fields.ifvoice;
                if(ifvoice.length==1){
                    ifvoiceValue=ifvoice[0];
                }else if(ifvoice.length==2){
                    if(ifvoice[0]=="1" && ifvoice[1]=="2" ||ifvoice[0]=="2" && ifvoice[1]=="1"){
                       ifvoiceValue=4;
                    }else if(ifvoice[0]=="1" && ifvoice[1]=="3" ||ifvoice[0]=="3" && ifvoice[1]=="1"){
                       ifvoiceValue=5;
                    }else if(ifvoice[0]=="2" && ifvoice[1]=="3" || ifvoice[0]=="3" && ifvoice[1]=="2"){
                        ifvoiceValue=6;
                    }
                }else if(ifvoice.length==3){
                    ifvoiceValue=7;
                }
                 if(this.state.nvrvalue===2){
                    msg={};//nvrvalue  2是否传{}
                }else{
                    //选择是传参数
                    msg={
                        nvrip:fields.nvrip,//nvrip
                        nvruser:fields.nvruser,//nvr用户名
                        nvrpwd:fields.nvrpwd,//nvr密码
                        nvrchannel:fields.memo//nvr通道号
                    };
                }
                axios.ajax({
                    method: "put",
                    url: window.g.loginURL + "/api/camera/update",
                    data: {
                        code: this.props.ststIn.addBackCode || this.props.formcode,
                        name: fields.name,//摄像头名称
                        ip: fields.ip,//IP地址
                        authport: fields.authport,//管理端口号
                        ausername: fields.ausername,//管理用户名
                        apassword: fields.apassword,//管理密码
                        vender: fields.vender,
                        streamport: fields.streamport,//视频流地址
                        threshold: fields.threshold,//报警识别阀门
                        ipctype: fields.ipctype,//摄像头类型
                        groupid:fields.groupid,//所属节点
                        ifvoice:ifvoiceValue,//外接设备
                        memo:JSON.stringify(msg)//nvr
                        //fielddistance: fields.fielddistance,//场距
                        //scene: fields.scene,//场景
                        //frozentime: fields.frozentime,//报警间隔时间
                        //alarmtype: fields.alarmtype ? 1 : 0,//是否强制报警
                    }
                }).then(res => {
                    if(res.success){
                        if(this.state.ifvoiceBack!=ifvoiceValue){
                            this.hanleInternet(ifvoiceValue);
                        }
                        this.Identification(fields.threshold);
                        this.props.getOne();
                        message.success("信息更新成功");
                        this.setInitInfo();
                    }
                });
            }
        });
    };

    handleCamaraType(val) {
        if (val === "other") {
            ReactDOM.findDOMNode(this.videoAdd).style.visibility = "visible";
        } else {
            ReactDOM.findDOMNode(this.videoAdd).style.visibility = "hidden";
        }
    };
    hanleonChangenvr = e => {
        this.setState({
            nvrvalue: e.target.value,
        });
    };
    render(){
        const formItemLayout = {
            labelCol: {
                sm: { span: 7 }
            },
            wrapperCol: {
                sm: { span: 12 }
            }
        };
        const  {getFieldDecorator}  = this.props.form ;
        return(
            <Form
                {...formItemLayout}
                key="changeform"
                onSubmit={this.handleChangeInfo}
                className="formInfo"
            >
                <Row>
                    <Col span={10}>
                        <Form.Item label="摄像头名称">
                            {getFieldDecorator("name", {
                                /*rules: [
                                   {
                                        pattern: new RegExp("^[0-9\u4e00-\u9fa5]+$","g"),
                                        message: "请输入10位以内汉字、数字!"
                                    }
                                ]*/
                            })(<Input  maxLength={10} disabled />)}
                        </Form.Item>
                        <Form.Item label="IP地址">
                            {getFieldDecorator("ip", {
                                rules: [
                                    {
                                        pattern: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g,
                                        required: true,
                                        message: "请输入正确的IP地址!"
                                    }
                                ]
                            })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item label="管理端口">
                            {getFieldDecorator("authport", {
                                rules: [{
                                        required: true,
                                        message: "请输入管理端口!"
                                    }]
                            })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item label="管理用户名">
                            {getFieldDecorator("ausername", {
                                rules: [{
                                        required: true,
                                        message: "请输入管理用户名!"
                                    }]
                            })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item label="管理密码">
                            {getFieldDecorator("apassword", {
                                rules: [{
                                        required: true,
                                        message: "请输入管理密码!"
                                    }]
                            })(<Input disabled />)}
                        </Form.Item>
                        <Form.Item label="摄像头类型">
                            {getFieldDecorator("ipctype", {
                                initialValue: "hikvision"
                            })(
                                <Select onChange={val => this.props.handleCamaraType(val)} disabled>
                                    <Option key="1" value="hikvision">
                                        海康威视
                                    </Option>
                                    <Option key="2" value="dahua">
                                        浙江大华
                                    </Option>
                                    <Option key="3" value="tiandy">
                                        天地伟业
                                    </Option>
                                    <Option key="4" value="uniview">
                                        浙江宇视
                                    </Option>
                                    <Option key="5" value="aebell">
                                        美电贝尔
                                    </Option>
                                    <Option key="6" value="other">
                                        其他
                                    </Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="所属节点">
                            {getFieldDecorator("groupid", {
                                initialValue:""
                            })(
                                <Select disabled>
                                    {
                                        this.props.subNode.map((v,i)=>(
                                            <Option key={i} value={v.code}>{v.sysip}</Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item label="外接设备">
                            {getFieldDecorator('ifvoice', {
                                rules: [{required: true, message: '请选择外接设备!'}],
                            })(
                                <Checkbox.Group>
                                    <Checkbox value="1">警灯</Checkbox>
                                    <Checkbox value="2">警铃</Checkbox>
                                    <Checkbox value="3">音响</Checkbox>
                                </Checkbox.Group>
                            )}
                        </Form.Item>
                        <Form.Item
                            label="视频流地址"
                            ref={videoAdd => {
                                this.videoAdd = videoAdd;
                            }}
                            style={{ visibility: "hidden" }}
                        >
                            {getFieldDecorator("streamport", {})(
                                <Input disabled />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label="接入NVR">
                            {getFieldDecorator('nvrvalue', {
                                rules: [{required: true, message: '请选择!'}],
                            })(
                                <Radio.Group onChange={this.hanleonChangenvr}>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <span style={{display:this.state.nvrvalue===1?"block":"none"}}>
                             <Form.Item label="nvrIp">
                            {getFieldDecorator('nvrip', {
                                rules: [{required:this.state.nvrvalue===1?true:false, message: '请输入nvrIp!'}],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                            <Form.Item label="nvr用户名">
                                {getFieldDecorator('nvruser', {
                                    rules: [{required:this.state.nvrvalue===1?true:false, message: '请输入nvr用户名!'}],
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item label="nvr密码">
                                {getFieldDecorator('nvrpwd', {
                                    rules: [{required:this.state.nvrvalue===1?true:false, message: '请输入nvr密码!'}],
                                })(
                                    <Input.Password />
                                )}
                            </Form.Item>
                            <Form.Item label="nvr通道号">
                                {getFieldDecorator('memo', {
                                    rules: [{required:this.state.nvrvalue===1?true:false, message: '请输入nvr通道号!'}],
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </span>
                        <Form.Item
                            label="报警识别阀值"
                            className="sliderWrap"
                        >
                            {getFieldDecorator("threshold", {
                                initialValue: 5
                            })(
                                <Slider
                                    step={1}
                                    min={1}
                                    max={10}
                                    marks={{
                                        1: "1",
                                        10: "10"
                                    }}
                                    className="thresholdset"
                                />
                            )}
                        </Form.Item>
                        <Form.Item
                            label=" "
                            colon={false}
                            style={{ textAlign: "center" }}
                        >
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={2} offset={10}><Button type="primary" htmlType="submit">确定</Button></Col>
                </Row>
            </Form>
        )
    }
}


export default Form.create({})(RaspEdit);
