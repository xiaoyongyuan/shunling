import React, { Component } from 'react';
import ReactDOM from "react-dom";
import axios from "../../../axios/index";
import "../../../style/jhy/less/equipset.less";
import "../../../style/jhy/less/reset.less";
import {
  Col,
  Row,
  Button,
  Select,
  Form,
  Input,
  Slider,
  Switch,
  message,
} from "antd";

const { Option } = Select;


class Onlyadd extends Component{
  constructor(props){
    super(props) ;
    this.state = {
      subNode:[]
    };
  }
  componentDidMount() {
    this.hanleSubordinate();
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
              subNode:res.data,
              selectp:res.data?res.data[0].code:''
          })
      }
    })
  }
  handleAdd = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;

    validateFields((err, fields) => {
      {
        if (err) {
          message.error(err);
        } else {
          axios
            .ajax({
              method: "post",
              url: window.g.loginURL + "/api/camera/add",
              data: {
                name: fields.name,
                ip: fields.ip,
                fielddistance: fields.fielddistance,
                scene: fields.scene,
                authport: fields.authport,
                ausername: fields.ausername,
                apassword: fields.apassword,
                vender: fields.vender,
                streamport: fields.streamport,
                threshold: fields.threshold,
                frozentime: fields.frozentime,
                alarmtype: fields.alarmtype ? 1 : 0,
                ipctype: fields.ipctype,
                groupid:fields.groupid
              }
            })
            .then(res => {
              if (res.success) {
                this.props.handonlyadd(res.data.code);
                window.location.href = `#/main/equipset?code=${res.data.code}`;
                message.success("添加成功");
                this.setInitInfo();
              }
            });
        }
      }
    });
  };
    //系统初始化
  setInitInfo = () => {
      axios.ajax({
              method: "get",
              url: window.g.loginURL + "/api/redisinfo/setinfo",
              data: {}
          })
          .then(res => {});
    };
  handleCamaraType(val) {
    if (val === "other") {
      ReactDOM.findDOMNode(this.videoAdd).style.visibility = "visible";
    } else {
      ReactDOM.findDOMNode(this.videoAdd).style.visibility = "hidden";
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 7 }
      },
      wrapperCol: {
        sm: { span: 12 }
      }
    };
    return(
      <div className="onlyadd">
        <div className="baseInfo">基本信息</div>
        <Form
          {...formItemLayout}
          key="changeform"
          onSubmit={this.handleAdd}
          className="formInfo"
        >
          <Row>
            <Col span={10}>
              <Row>
                  <Form.Item label="摄像头名称">
                      {getFieldDecorator("name", {
                          rules: [
                              {
                                  required: true,
                                  message: "请输入摄像头名称!"
                              },{
                                  pattern: new RegExp("^[0-9\u4e00-\u9fa5]+$","g"),
                                  message: "请输入10位以内汉字、数字!"
                              }
                          ]
                      })(<Input placeholder="请输入10位以内汉字、数字" maxLength={10} />)}
                  </Form.Item>
                <Form.Item label="IP地址">
                  {getFieldDecorator("ip", {
                    rules: [
                      {
                        required: true,
                        pattern: /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g,
                        message: "请输入正确的IP地址!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="摄像头类型">
                  {getFieldDecorator("ipctype", {
                    initialValue: "hikvision"
                  })(
                    <Select onChange={val => this.handleCamaraType(val)}>
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
                <Form.Item label="管理端口">
                  {getFieldDecorator("authport", {
                    rules: [
                      {
                        required: true,
                        message: "请输入管理端口!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="管理用户名">
                  {getFieldDecorator("ausername", {
                    rules: [
                      {
                        required: true,
                        message: "请输入管理用户名!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="管理密码">
                  {getFieldDecorator("apassword", {
                    rules: [
                      {
                        required: true,
                        message: "请输入管理密码!"
                      }
                    ]
                  })(<Input />)}
                </Form.Item>
              </Row>
              <Row style={{ marginTop: "20px" }}>
                <Form.Item label="视频传输协议">
                  {getFieldDecorator("protocol", {
                    initialValue: "rtsp"
                  })(
                    <Select>
                      <Option key="1" value="rtsp">
                        rtsp
                      </Option>
                      <Option key="2" value="其它">
                        其它
                      </Option>
                    </Select>
                  )}
                </Form.Item>
                <Form.Item
                  label="视频流地址"
                  ref={videoAdd => {
                    this.videoAdd = videoAdd;
                  }}
                  style={{ visibility: "hidden" }}
                >
                  {getFieldDecorator("streamport", {})(<Input />)}
                </Form.Item>
              </Row>
            </Col>
            <Col span={10}>
              <Row style={{ marginBottom: "20px" }}>
                  <Form.Item label="所属节点">
                      {getFieldDecorator("groupid", {
                          initialValue:this.state.selectp
                      })(
                          <Select>
                              {
                                this.state.subNode.map((v,i)=>(
                                    <Option key={i} value={v.code}>{v.sysip}</Option>
                                ))
                              }
                          </Select>
                      )}
                  </Form.Item>
                <Form.Item label="视频用户名">
                  {getFieldDecorator("vusername", {})(<Input />)}
                </Form.Item>
                <Form.Item label="视频密码">
                  {getFieldDecorator("vpassword", {})(<Input />)}
                </Form.Item>
              </Row>
              <Form.Item label="场景">
                {getFieldDecorator("scene", {
                  initialValue: "室外"
                })(
                  <Select>
                    <Option key="1" value="室外">
                      室外
                    </Option>
                    <Option key="2" value="室内">
                      室内
                    </Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="场距">
                {getFieldDecorator("fielddistance", {
                  initialValue: "10~20米"
                })(
                  <Select>
                    <Option key="1" value="10~20米">
                      10~20米
                    </Option>
                    <Option key="2" value="20~40米">
                      20~40米
                    </Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="报警间隔时间" className="sliderWrap">
                {getFieldDecorator("frozentime", {
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
                    tooltipVisible={false}
                    className="frozentime"
                    onChange={value => this.props.handleFrozenChange(value)}
                  />
                )}
                <span className="sliderVal">{this.props.statda.frozentime}秒</span>
              </Form.Item>
              <Form.Item label=" 是否强制报警">
                {getFieldDecorator("alarmtype", {
                  initialValue: 0
                })(<Switch />)}
              </Form.Item>
              <Form.Item label="设备智能分析阈值" className="sliderWrap">
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
                    // tooltipVisible={false}
                    className="thresholdset"
                    onChange={value => this.props.handleThresholdChange(value)}
                  />
                )}
                <span className="sliderVal">
                  {`${this.props.statda.threshold * 10}%`}
                </span>
              </Form.Item>
              <Form.Item
                label=" "
                colon={false}
                style={{ textAlign: "center" }}
              >
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}



export default Form.create({})(Onlyadd);
