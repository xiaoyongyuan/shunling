/**
 * @copyright mikeJang
 */
import React, { Component } from "react";
import { Row, Col, Form, Radio, Button, Input, message } from "antd";
import axios from "../../axios/index";
import "../../style/jhy/less/netset.less";

const NetOneForm = Form.create({})(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isDisable: false,
        type: 0
      };
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      const formItemLayout = {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 16
        }
      };
      return (
        <Form {...formItemLayout} colon={false} onSubmit={this.props.onSub}>
          <Form.Item>
            <Radio
              value="1"
              checked={this.state.isDisable}
              onClick={() => {
                this.setState({ type: 1, isDisable: true });
                this.props.onReset();
              }}
            >
              自动获取IP地址
            </Radio>
          </Form.Item>
          <Form.Item>
            <Radio
              value="0"
              checked={!this.state.isDisable}
              onClick={() => this.setState({ type: 0, isDisable: false })}
            >
              使用下面的IP地址
            </Radio>
          </Form.Item>
          <Form.Item label="IP号">
            {getFieldDecorator("ip", {})(
              <Input disabled={this.state.isDisable} />
            )}
          </Form.Item>
          <Form.Item label="子网编码">
            {getFieldDecorator("zwym", {})(
              <Input disabled={this.state.isDisable} />
            )}
          </Form.Item>
          <Form.Item label="默认网关">
            {getFieldDecorator("mrwg", {})(
              <Input disabled={this.state.isDisable} />
            )}
          </Form.Item>
          <Form.Item label="DNS1">
            {getFieldDecorator("dns1", {})(
              <Input disabled={this.state.isDisable} />
            )}
          </Form.Item>
          <Form.Item label="DNS2">
            {getFieldDecorator("dns2", {})(
              <Input disabled={this.state.isDisable} />
            )}
          </Form.Item>
          <Form.Item label=" ">
            <div className="optwrap">
              <Button type="primary" className="submit" htmlType="submit">
                确认
              </Button>
              <Button className="cancle" onClick={this.props.onReset}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      );
    }
  }
);
const NetTwoForm = Form.create({})(
  class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isDisableTwo: false,
        type: 0
      };
    }
    render() {
      const { getFieldDecorator } = this.props.form;

      const formItemLayout = {
        labelCol: {
          span: 5
        },
        wrapperCol: {
          span: 16
        }
      };
      return (
        <Form {...formItemLayout} colon={false} onSubmit={this.props.onSub}>
          <Form.Item>
            <Radio
              value="1"
              checked={this.state.isDisableTwo}
              onClick={() => {
                this.setState({ type: 1, isDisableTwo: true });
                this.props.onReset();
              }}
            >
              自动获取IP地址
            </Radio>
          </Form.Item>
          <Form.Item>
            <Radio
              value="0"
              checked={!this.state.isDisableTwo}
              onClick={() => this.setState({ type: 0, isDisableTwo: false })}
            >
              使用下面的IP地址
            </Radio>
          </Form.Item>
          <Form.Item label="IP号">
            {getFieldDecorator("ip", {})(
              <Input disabled={this.state.isDisableTwo} />
            )}
          </Form.Item>
          <Form.Item label="子网编码">
            {getFieldDecorator("zwym", {})(
              <Input disabled={this.state.isDisableTwo} />
            )}
          </Form.Item>
          <Form.Item label="默认网关">
            {getFieldDecorator("mrwg", {})(
              <Input disabled={this.state.isDisableTwo} />
            )}
          </Form.Item>
          <Form.Item label="DNS1">
            {getFieldDecorator("dns1", {})(
              <Input disabled={this.state.isDisableTwo} />
            )}
          </Form.Item>
          <Form.Item label="DNS2">
            {getFieldDecorator("dns2", {})(
              <Input disabled={this.state.isDisableTwo} />
            )}
          </Form.Item>
          <Form.Item label=" ">
            <div className="optwrap">
              <Button className="submit" type="primary" htmlType="submit">
                确认
              </Button>
              <Button className="cancle" onClick={this.props.onReset}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      );
    }
  }
);

class NetworkSettings extends Component {
  handleSub(type) {
    if (type === "one") {
      const { validateFields, resetFields } = this.form1.props.form;
      validateFields((err, values) => {
        if (!err) {
          axios
            .ajax({
              method: "get",
              url: window.g.loginURL + "/api/system/ipset",
              data: {
                id: 1,
                type: this.form1.state.type,
                ip: values.ip,
                zwym: values.zwym,
                mrwg: values.mrwg,
                dns: values.dns1
              }
            })
            .then(res => {
              if (res.success) {
                message.success("网卡一配置成功");
                // resetFields();
              }
            });
        } else {
          message.error(err);
          return;
        }
      });
    } else {
      const { validateFields, resetFields } = this.form2.props.form;
      validateFields((err, values) => {
        if (!err) {
          axios
            .ajax({
              method: "get",
              url: window.g.loginURL + "/api/system/ipset",
              data: {
                id: 0,
                type: this.form2.state.type,
                ip: values.ip,
                zwym: values.zwym,
                mrwg: values.mrwg,
                dns: values.dns1
              }
            })
            .then(res => {
              if (res.success) {
                message.success("网卡二配置成功");
                // resetFields();
              }
            });
        } else {
          message.error(err);
          return;
        }
      });
    }
  }
  handleReset(type) {
    if (type === "one") {
      const { resetFields } = this.form1.props.form;
      resetFields();
    } else {
      const { resetFields } = this.form2.props.form;
      resetFields();
    }
  }
  render() {
    return (
      <div className="netset">
        <Row>
          <Row>
            <span className="netcard">网卡一配置</span>
          </Row>
          <Col span={12}>
            <NetOneForm
              wrappedComponentRef={form => (this.form1 = form)}
              onSub={() => this.handleSub("one")}
              onReset={() => this.handleReset("one")}
            />
          </Col>
        </Row>
        <Row className="cardtwo">
          <Row>
            <span className="netcard">网卡二配置</span>
          </Row>
          <Col span={12}>
            <NetTwoForm
              wrappedComponentRef={form => (this.form2 = form)}
              onSub={() => this.handleSub("two")}
              onReset={() => this.handleReset("two")}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Form.create({})(NetworkSettings);
