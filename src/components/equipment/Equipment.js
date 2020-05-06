/**
 * @copyright mikeJang
 */
import {Col, Icon, Row, Form, Select, Button, message} from "antd";
import React, { Component } from "react";
import "../../style/jhy/less/equiplist.less";
import "../../style/jhy/less/reset.less";
import axios from "../../axios";
const { Option } = Select;
class Equipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipList: [],
      pageindex: 1,
      pagesize: 36,
      total: 0,
      subNode:[],//所属节点
    };
  }
  componentDidMount() {
    this.getList();
    this.hanleSubordinate();
    this.setState({
        account:localStorage.getItem("account")
    })
  }

  getList = () => {
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/camera/getlist",
        data: {
          sysip:this.state.sysip
        }
      })
      .then(res => {
        if (res.success) {
          this.setState({
            equipList: res.data
          });
        }
      });
  };
  addEquip = () => {
    window.location.href = "#/main/equipset:add";
  };
  setEquip = code => {
    window.location.href = `#/main/equipset?code=${code}`;
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
                })
            }
        })
    };
  handleSubmitSelect=(e)=>{
      e.preventDefault();
      this.props.form.validateFields((err,values)=>{
          if(!err){
              this.setState({
                  sysip:values.sysip,
              },()=>{
                  this.getList();
              });
          }
      });
  };
  render() {
    const {getFieldDecorator}=this.props.form;
    return (
      <div className="equip">
          <div className="equimentTitle">
              <Form layout="inline" className="equimentSelect" onSubmit={this.handleSubmitSelect}>
                  <Form.Item label="所属节点">
                      {getFieldDecorator('sysip', {
                          initialValue:""
                      })(
                          <Select style={{ width: 200 }}>
                              <Option value="">请选择</Option>
                              {
                                  this.state.subNode.map((v)=>(
                                      <Option key={v.code} value={v.sysip}>{v.sysip}</Option>
                                  ))
                              }
                          </Select>,
                      )}
                  </Form.Item>
                  <Form.Item>
                      <Button type="primary" htmlType="submit" className="sureBtn">查询</Button>
                  </Form.Item>
              </Form>
              <Button type="primary" onClick={()=>this.addEquip()} style={{display:this.state.account==="admin"?"block":"none"}}><Icon type="plus" />添加摄像头</Button>
          </div>
        <Row gutter={16}>
          {this.state.equipList.length > 0
            ? this.state.equipList.map((val, inx) => (
                <Col
                  md={6}
                  style={{
                    marginBottom: "16px",
                    height: "25vh"
                  }}
                  key={inx}
                  className="equipWrap"
                >
                  <div className="equipEle" style={{ background: "#fff" }}>
                    <div
                      onClick={() => {
                        this.setEquip(val.code);
                      }}
                      style={{
                        cursor: "pointer",
                        height: "82%",
                        background: val.basemap
                          ? "url(" +
                            `${val.basemap}`.split(".jpg")[0] +
                            `.jpg?t=${Date.parse(new Date())}` +
                            ")  no-repeat center center / 100% 100% "
                          : "#efefef",
                        position: "relative",
                        border: "1px solid #efefef"
                      }}
                    >
                      <p className="elli tit">
                        <span className="titpoint" />
                        {val.name}
                      </p>
                    </div>
                    <ul className="extraWrap">
                      <li className="extra">
                        <span className="expic" />
                        <span>在线</span>
                      </li>
                      <li className="extra">
                        <span className="expic" />
                        <span className="elli">
                          {val.workingstatus === 1
                            ? "布防中"
                            : val.workingstatus === 0
                            ? "休息中"
                            : val.workingstatus === -1
                            ? "未启用"
                            : val.workingstatus === -2
                            ? "未设置"
                            : null}
                        </span>
                      </li>
                      <li
                        className="extra elli"
                        onClick={() => {
                          this.setEquip(val.code);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="expic" />
                        <span>设置</span>
                      </li>
                    </ul>
                  </div>
                </Col>
              ))
            : null}
        </Row>
        <div className="paginationWrap">
          {/* <Pagination
            // total={73}
            total={this.state.total}
            current={this.state.pageindex}
            pageSize={this.state.pageSize || 10}
            // pageSize={36}
            showTotal={() => {
              return `共${this.state.total}条`;
            }}
            onChange={current => this.handlePageChange(current)}
            showQuickJumper
            // hideOnSinglePage={true}
            className="pagination"
          /> */}
        </div>
      </div>
    );
  }
}

export default Equipment=Form.create({})(Equipment);
