import React, {Component} from 'react';
import {Form, Input, Row, Col, Select, Button, Checkbox, Radio, Slider} from 'antd';
import axios from "../../../axios/index";
const {Option} = Select;

class ConfigureRas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subNode: [],
            equmentList: [],
            address: "rtsp",
            nvrvalue:1
        };
    }

    componentDidMount() {
        this.hanleSubordinate();
        this.props.form.setFieldsValue({streamport: 'rtsp'});
        this.props.form.setFieldsValue({devid: this.props.ecode});
        this.hanleEqument();
    }
    //设备
    hanleEqument=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/equ/getlist",
            data:{
                pagesize:30,
                estatus:-1
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    equmentList:res.data
                })
            }
        })
    };
    //所属节点
    hanleSubordinate = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/system/nodelist",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    subNode: res.data,
                    selectp: res.data ? res.data[0].code : ''
                })
            }
        })
    };
    //编辑
   /*
       外接设备的参数
       1.警灯  2.警铃 3.音响，
         1+2  4       1+3  5     2+3  6         1+2+3  7
       4.警灯+警铃  5.警灯+ 音响。 6.警铃+音响。 7.警灯+警铃+音响
    */
    handleConfigure = () => {
        const _this = this;
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                let data = {};
                let msg={};//nvr对象
                let ifvoiceValue="";//外接设备
                let ifvoice=values.ifvoice;
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
                        nvrip:values.nvrip,
                        nvruser:values.nvruser,
                        nvrpwd:values.nvrpwd,
                        nvrchannel:values.memo
                    };
                }
                data.name = values.name;
                data.devid = values.devid;
                data.ip = values.ip;
                data.authport = values.authport;
                data.ipctype = values.ipctype;
                data.ausername = values.ausername;
                data.apassword = values.apassword;
                data.groupid = values.groupid;
                data.streamport = values.streamport;
                data.memo = JSON.stringify(msg);
                data.location = values.location;
                data.maindevid=values.maindevid;
                data.ifvoice=ifvoiceValue.toString();
                _this.props.configureSubmit(data);
                _this.props.form.resetFields();
                _this.reset();
            }
        });
    };
    hanleTpctype = (value) => {
        if (value === "hikvision") {
            this.props.form.setFieldsValue({streamport: 'rtsp'});
        } else {
            this.props.form.setFieldsValue({streamport: ''});
        }
    };
    hanleonChangenvr = e => {
        this.setState({
            nvrvalue: e.target.value,
        });
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const formlayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 16
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 10,
                },
            },
        };
        return (
            <div className="configureRas">
                <Form {...formlayout} onSubmit={this.handleConfigure}>
                    <Row>
                        <Col span={9}>
                            <Form.Item label="树莓派名称">
                                {getFieldDecorator("name", {
                                    rules: [{required: true, message: "请输入树莓派名称!"}]
                                })(<Input/>)}
                            </Form.Item>
                            <Form.Item label="设备编码">
                                {getFieldDecorator("devid", {
                                    rules: [{required: true, message: "请输入设备编码!"}],
                                })(
                                    <Input disabled/>
                                )}
                            </Form.Item>
                            <Form.Item label="摄像头IP地址">
                                {getFieldDecorator('ip', {
                                    rules: [
                                        {required: true, message: '请输入摄像头IP地址!'},
                                        {
                                            required: false,
                                            pattern: new RegExp("^\\s*((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4})|:))|(([0-9A-Fa-f]{1,4}:){6}(:|((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})|(:[0-9A-Fa-f]{1,4})))|(([0-9A-Fa-f]{1,4}:){5}((:((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){4}(:[0-9A-Fa-f]{1,4}){0,1}((:((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){3}(:[0-9A-Fa-f]{1,4}){0,2}((:((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:){2}(:[0-9A-Fa-f]{1,4}){0,3}((:((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(([0-9A-Fa-f]{1,4}:)(:[0-9A-Fa-f]{1,4}){0,4}((:((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(:(:[0-9A-Fa-f]{1,4}){0,5}((:((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})?)|((:[0-9A-Fa-f]{1,4}){1,2})))|(((25[0-5]|2[0-4]\\d|[01]?\\d{1,2})(\\.(25[0-5]|2[0-4]\\d|[01]?\\d{1,2})){3})))(%.+)?\\s*$", "g"),
                                            message: '请输入正确的IP地址'
                                        }
                                    ],
                                })(
                                    <Input placeholder="列如：192.168.0.1"/>,
                                )}
                            </Form.Item>
                            <Form.Item label="所属节点">
                                {getFieldDecorator("groupid", {
                                    initialValue: this.state.selectp
                                })(
                                    <Select>
                                        {
                                            this.state.subNode.map((v, i) => (
                                                <Option key={i} value={v.code}>{v.sysip}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="摄像头类型">
                                {getFieldDecorator('ipctype', {
                                    initialValue: "hikvision"
                                })(
                                    <Select onChange={this.hanleTpctype}>
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
                            <Form.Item label="管理员用户名">
                                {getFieldDecorator("ausername", {
                                    rules: [{
                                        required: true,
                                        message: "请输入管理员用户名!"
                                    }]
                                })(<Input/>)}
                            </Form.Item>
                            <Form.Item label="管理员密码">
                                {getFieldDecorator("apassword", {
                                    rules: [{
                                        required: true,
                                        message: "请输入管理员密码!"
                                    }]
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="管理端口">
                                {getFieldDecorator('authport', {
                                    rules: [
                                        {required: true, message: '请输入管理端口!'},
                                        {
                                            required: false,
                                            pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                            message: '请输入正确的管理端口,只能输入1-9数字'
                                        }
                                    ],
                                })(
                                    <Input placeholder="只能输入数字，例如：8080"/>
                                )}
                            </Form.Item>
                            <Form.Item label="视频流地址">
                                {getFieldDecorator('streamport', {
                                    rules: [{required: true, message: '请输入视频流地址!'}],
                                })(
                                    <Input/>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={9}>
                            <Form.Item label="所在位置">
                                {getFieldDecorator('location', {
                                    rules: [{required: true, message: '请输入所在位置!'}],
                                })(
                                    <Input/>
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
                            <Form.Item label="主设备号">
                                {getFieldDecorator('maindevid', {
                                    rules: [{required: true, message: '请输入主设备号!'}],
                                    initialValue:""
                                })(
                                    <Select>
                                        <Option value="">请选择主设备号</Option>
                                        {
                                            this.state.equmentList.map((v,i)=>(
                                                <Option key={i} value={v.ecode}>{v.ecode}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="接入NVR">
                                {getFieldDecorator('nvrvalue', {
                                    initialValue:this.state.nvrvalue,
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
                        </Col>
                    </Row>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default ConfigureRas = Form.create({})(ConfigureRas);
