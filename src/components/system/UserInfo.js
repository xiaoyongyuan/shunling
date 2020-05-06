/**
 * @copyright mikeJang
 */
import React, { Component } from "react";
import {
  Row,
  Icon,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Divider,
  message
} from "antd";
import Etable from "../common/Etable";
import axios from "axios";
import axiosW from "../../axios/index";
import moment from "moment";
import Utils from "../../utils/utils";
import "../../style/jhy/less/userinfo.less";
const { Option } = Select;
const { confirm } = Modal;

const FormModal = Form.create({ name: "form_in_modal" })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, title } = this.props;
      const { getFieldDecorator } = form;
      const formlayout = {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 16
        }
      };
      return (
        <Modal
          visible={visible}
          title={`${title}用户`}
          okText="确定"
          canCelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formlayout}>
            <Form.Item label="账号" key="account">
              {getFieldDecorator("account", {
                rules: [
                  {
                    required: true,
                    message: "请输入账号!"
                  }
                ]
              })(<Input maxLength={10} disabled={title === "编辑"} />)}
            </Form.Item>
            <Form.Item label="用户名" key="realname">
              {getFieldDecorator("realname", {
                rules: [
                  {
                    required: true,
                    message: "请输入账号!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="邮箱地址" key="emailaddress">
              {getFieldDecorator("emailaddress", {
                rules: [
                  {
                    required: false,
                    pattern: new RegExp(
                      "^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
                      "g"
                    ),
                    message: "请输入正确的邮箱号!"
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="角色权限" key="role">
              {getFieldDecorator("utype", {
                initialValue: 1
              })(
                <Select>
                  <Option value={0} key="0">
                    管理员
                  </Option>
                  <Option value={1} key="1">
                    普通用户
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userdata: [],
      visible: false,
      type: "",
      title: "",
      currentRecordData: {},
      pagination: {}
    };
  }
  params = {
    pageindex: 1,
    pagesize: 10
  };

  componentDidMount() {
    this.getUserData();
  }
  getUserData = () => {
    axiosW
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/system/userlist",
        data: {
          pagesize: 10,
          code: this.props.query.code,
          pageindex: this.params.pageindex
        }
      })
      .then(res => {
        if (res.success) {
          this.setState({
            userdata: res.data,
            pagination: Utils.pagination(res, current => {
              this.params.pageindex = current;
              this.getUserData();
            })
          });
        }
      });
  };
  showModel = opt => {
    if (opt === "add") {
      this.setState({
        visible: true,
        title: "新增"
      });
    } else {
      this.setState({
        title: "编辑",
        currentRecordData: opt,
        visible: true
      });
      axiosW
        .ajax({
          method: "get",
          url: window.g.loginURL + "/api/system/userlist",
          data: {
            code: opt.code
          }
        })
        .then(res => {
          if(res.success){
            const { form } = this.formRef.props;
            form.setFieldsValue({
              account: res.data.userinfo.account,
              realname: res.data.userinfo.realname,
              emailaddress: res.data.userinfo.emailaddress,
              utype: res.data.userinfo.utype
            });
          }
        });
    }
  };
  handleCancel = () => {
    const { form } = this.formRef.props;
    form.resetFields();
    this.setState({
      visible: false
    });
  };
  handleForm = () => {
    const { form } = this.formRef.props;

    if (this.state.title === "新增") {
      form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            visible: false
          });
          axios({
            method: "post",
            url: window.g.loginURL + "/api/autocode/auto",
            headers: {
              AUTHORIZATION: "Bearer " + localStorage.getItem("token")
            },
            data: {
              account: values.account,
              emailaddress: values.emailaddress,
              realname: values.realname,
              utype: values.utype,
              ifsys: values.account === "admin" ? 1 : 0,
              companycode: localStorage.getItem("companycode")
            }
          }).then(res => {
            if (res.data.success) {
              message.success("添加用户成功");
              this.getUserData();
              form.resetFields();
            } else {
              form.resetFields();
              message.error(res.data.msg);
            }
          });
        } else {
          message.error(err);
          form.resetFields();
          return;
        }
      });
    } else {
      form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            visible: false
          });
          console.log(values);
          axios({
            method: "post",
            url: window.g.loginURL + "/api/system/setuser",
            headers: {
              AUTHORIZATION: "Bearer " + localStorage.getItem("token")
            },
            data: {
              code: this.state.currentRecordData.code,
              account: values.account,
              emailaddress: values.emailaddress,
              realname: values.realname,
              utype: values.utype,
              ifsys: values.account === "admin" ? 1 : 0,
              companycode: localStorage.getItem("companycode")
            }
          }).then(res => {
            if (res.data.success) {
              message.success("编辑用户成功");
              this.getUserData();
              form.resetFields();
            } else {
              message.error(res.data.msg);
            }
          });
        } else {
          message.error(err);
          return;
        }
      });
    }
  };

  delUser = record => {
    const _this = this;
    confirm({
      title: "确认删除该用户吗?",
      onOk() {
        axios({
          method: "post",
          url: window.g.loginURL + "/api/system/setuser",
          headers: {
            AUTHORIZATION: "Bearer " + localStorage.getItem("token")
          },
          data: {
            code: record.code,
            account: record.account,
            ifdel: 1
          }
        }).then(res => {
          if (res.data.success) {
            message.success("删除用户成功");
            _this.getUserData();
          } else {
            message.error(res.data.msg);
          }
        });
      }
    });
  };
  render() {
    const ifsys = localStorage.getItem("ifsys");
    const utype = localStorage.getItem("utype");
    const account = localStorage.getItem("account");
    const userlist = [
      {
        title: "序号",
        align: "center",
        key: "num",
        width: "8%",
        render: (text, record, index) => index + 1
      },
      {
        title: "账号",
        dataIndex: "account",
        width: "10%",
        align: "center"
      },
      {
        title: "用户名",
        dataIndex: "realname",
        width: "10%",
        align: "center"
      },
      {
        title: "邮箱",
        dataIndex: "emailaddress",
        width: "14%",
        align: "center"
      },
      {
        title: "最近登录时间",
        dataIndex: "lastlogin",
        align: "center",
        width: "14%",
        render: text => {
          if (text) {
            return moment(text).format("YYYY-MM-DD HH:mm:ss");
          } else {
            return null;
          }
        }
      },
      {
        title: "角色权限",
        dataIndex: "utype",
        key: "role",
        align: "center",
        width: "12%",
        render: (text, record) =>
          text === 0 && record.ifsys === 1
            ? "超级管理员"
            : text === 0 && record.ifsys === 0
            ? "管理员"
            : "普通用户"
      },
      {
        title: "操作",
        dataIndex: "utype",
        key: "opt",
        align: "center",
        width: "16%",
        render: (text, record) => {
          if (ifsys === "1") {
            if (account === record.account) {
              return null;
            } else {
              return (
                <span>
                  <Button
                    type="primary"
                    onClick={() => {
                      this.showModel(record);
                    }}
                  >
                    编辑
                  </Button>
                  <Divider type="vertical" />
                  <Button
                    type="primary"
                    onClick={() => {
                      this.delUser(record);
                    }}
                  >
                    删除
                  </Button>
                </span>
              );
            }
          } else {
            if (utype === "0") {
              if (account === record.account) {
                return (
                  <span>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.showModel(record);
                      }}
                    >
                      编辑
                    </Button>
                  </span>
                );
              } else if (record.ifsys === 1) {
                return null;
              } else {
                return (
                  <span>
                    <Button
                      type="primary"
                      onClick={() => {
                        this.showModel(record);
                      }}
                    >
                      编辑
                    </Button>
                    <Divider type="vertical" />
                    <Button
                      type="primary"
                      onClick={() => {
                        this.delUser(record);
                      }}
                    >
                      删除
                    </Button>
                  </span>
                );
              }
            } else {
              return null;
            }
          }
        }
      }
    ];

    return (
      <div className="userInfo">
           <Button
               type="primary"
               onClick={() => {
                   this.showModel("add");
               }}
               style={{float:"right",zIndex:999,display:account==="admin"?"block":"none"}}
           >
               <Icon type="plus" />
               添加用户
           </Button>
        <FormModal
          wrappedComponentRef={formRef => (this.formRef = formRef)}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleForm}
          title={this.state.title}
          currentRecordData={this.state.currentRecordData}
        />
          <Row>
              <Col span={24}>
                  <Etable
                      dataSource={this.state.userdata}
                      columns={userlist}
                      pagination={this.state.pagination}
                      style={{ marginTop: "20px" }}
                  />
              </Col>
          </Row>
      </div>
    );
  }
}
export default Form.create({})(UserInfo);
