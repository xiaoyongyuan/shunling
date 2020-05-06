/**
 * @copyright mikeJang
 */
import {Tabs, Button,message, Modal} from "antd";
import React, { Component, Fragment } from "react";
import DefTime from "./DefendTime";
import axios from "../../axios/index";
import "../../style/jhy/less/equipset.less";
import "../../style/jhy/less/reset.less";
import Onlyadd from "./equindd/onlyadd"
import BaseInf from "./equindd/baseInf"
import CameraSet from "./equindd/cameraSet1"

const { TabPane } = Tabs;
const blue = "#5063ee";
const red = "#ED2F2F";
const green = "#4ec9b0";
const maskcol = "rgba(204, 204, 204, 0.1)";
const { confirm } = Modal;
export default class EquipSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addOnly: true,
      addBackCode: "",
      activeKey: "0",
      equipData: {},
      disabledStopSer: true,
      disabled24: true,
      disabledRecover: true,
      sliderChange: false,
      threshold: 5,
      frozentime: 5,
      subNode:[],
      groupcode:""
    };
  }
  componentDidMount() {
    if (this.props.query.code) {
      this.getOne();
      this.hanleSubordinate();
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
  hanleSubordinate=()=> {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/system/nodelist",
            data: {}
        }).then((res) => {
            if(res.success){
                this.setState({
                    subNode: res.data,
                    selectp: res.data ? res.data[0].sysip : ''
                })
            }
        })
    }
  getOne = () => {
    axios
      .ajax({
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

        }
      });
  };
  handleBack = () => {
    window.location.href = "#/main/equipment";
  };
  handleStop = () => {
    axios
      .ajax({
        method: "put",
        url: window.g.loginURL + "/api/camera/update",
        data: {
          code: this.state.addBackCode || this.props.query.code,
          if_cancel: 2,
          groupid:this.state.equipData.groupid
        }
      })
      .then(res => {
        if (res.success) {
          message.success("已停止服务");
          this.getOne();
        }else{
          message.error(res.msg);
        }
      });
  };
  handleTwentyFour = () => {
    axios
      .ajax({
        method: "put",
        url: window.g.loginURL + "/api/camera/update",
        data: {
          code: this.state.addBackCode || this.props.query.code,
          if_cancel: 1,
          groupid:this.state.equipData.groupid
        }
      })
      .then(res => {
        if (res.success) {
          message.success("24小时设防中");
          this.getOne();
        }else{
            message.error(res.msg);
        }
      });
  };
  handleRecover = () => {
    axios
      .ajax({
        method: "put",
        url: window.g.loginURL + "/api/camera/update",
        data: {
          code: this.state.addBackCode || this.props.query.code,
          if_cancel: 0,
          groupid:this.state.equipData.groupid
        }
      })
      .then(res => {
        if (res.success) {
          message.success("已恢复");
          this.getOne();
        }else{
            message.error(res.msg);
        }
      });
  };
  handleDeviceDel = () => {
    const _this = this;
    confirm({
      title: "确认删除该设备吗?",
      onOk() {
        axios
          .ajax({
            method: "put",
            url: window.g.loginURL + "/api/camera/update",
            data: {
              code: _this.state.addBackCode || _this.props.query.code,
              ifdel: 1,
              groupid:_this.state.equipData.groupid
            }
          })
          .then(res => {
            if (res.success) {
              _this.setInitInfo();
              message.success("已删除");
              window.location.href = "#/main/equipment";
            } else {
              message.error(res.msg);
            }
          });
      }
    });
  };
  handleThresholdChange = val => {
    this.setState({ sliderChange: true, threshold: val });
  };
  handleFrozenChange = val => {
    this.setState({ sliderChange: true, frozentime: val });
  };
  handonlyadd =  val => {
    this.setState({
      addOnly: false,
      addBackCode: val
    })
  };
  render() {
    return (
      <div className="equipset">
        {this.props.match.params.add === ":add" && this.state.addOnly === true && (
        <Onlyadd  statda = {this.state}
          handleThresholdChange = {this.handleThresholdChange}
          handleFrozenChange = {this.handleFrozenChange}
          handonlyadd = {this.handonlyadd}
          ref = { onlyaddform => this.onlyaddform = onlyaddform}
         />
        )}

        {(this.state.addOnly === false || this.props.query.code) && this.state.equipData !== {} && (
          <Fragment>
            <div className="topbtn">
              <Button type="primary" onClick={() => this.handleBack()}>
                返回
              </Button>
              <Button
                type="danger"
                disabled={this.state.disabledStopSer}
                onClick={() => this.handleStop()}
              >
                停止服务
              </Button>
              <Button
                type="primary"
                disabled={this.state.disabled24}
                onClick={() => this.handleTwentyFour()}
              >
                24小时设防
              </Button>
              <Button
                type="primary"
                disabled={this.state.disabledRecover}
                onClick={() => this.handleRecover()}
              >
                恢复
              </Button>

              <Button type="danger" onClick={() => this.handleDeviceDel()}>
                删除
              </Button>
            </div>
            <Tabs
              defaultActiveKey="0"
              // activeKey={this.state.activeKey}
              type="card"
              // onChange={activekey => {
              //   this.handleTabChange(activekey);
              // }}
            >
              <TabPane
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
                    <span className="baseInfo">基本信息</span>
                  </span>
                }
                key="0"
              >
                <BaseInf
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
                    <span className="camera">防区设置</span>
                  </span>
                }
                key="1"
              >
                <CameraSet
                  camerdat = {this.state}
                  code={this.props.query.code}
                  getOne = {this.getOne}
                />
              </TabPane>
              <TabPane
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
                    <span className="deftime">布防时间</span>
                  </span>
                }
                key="2"
              >
                <DefTime
                  code={this.props.query.code}
                  addBackCode={this.state.addBackCode}
                  equipData={this.state.equipData}
                  getOne={this.getOne}
                />
              </TabPane>
            </Tabs>
          </Fragment>
        )}
      </div>
    );
  }
}

