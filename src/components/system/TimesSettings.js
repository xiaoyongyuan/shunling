/**
 * @copyright mikeJang
 */
import React, { Component } from "react";
import {
  Row,
  Col,
  Form,
  Radio,
  Button,
  DatePicker,
  TimePicker,
  message
} from "antd";
import moment from "moment";
import axios from "../../axios/index";
import "../../style/jhy/less/timeset.less";

const dateFormat = "YYYY-MM-DD";
const timeFormat = "HH:mm:ss";

class TimesSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDisable: true,
      type: 0
    };
  }
  handleReset() {
    const { resetFields } = this.props.form;
    resetFields();
  }
  handleSub = e => {
    e.preventDefault();
    if (this.state.type) {
      const { validateFields } = this.props.form;
      validateFields((err, values) => {
        if (!err) {
          console.log(values);
          axios
            .ajax({
              method: "get",
              url: window.g.loginURL + "/api/system/timeset",
              data: {
                type: 1,
                date: moment(values.date).format(dateFormat),
                time: moment(values.time).format(timeFormat)
              }
            })
            .then(res => {
              if (res.success) {
                message.success("手动时间设置成功");
              } else {
                message.error(res.msg);
              }
            });
        } else {
          message.error(err);
          return;
        }
      });
    } else {
      axios
        .ajax({
          method: "get",
          url: window.g.loginURL + "/api/system/timeset",
          data: {
            type: 0
          }
        })
        .then(res => {
          if (res.success) {
            message.success("自动时间设置成功" + res.msg);
          } else {
            message.error(res.msg);
          }
        });
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        xl: {
          span: 10
        },
        xxl: {
          span: 8
        }
      }
    };
    return (
      <div className="timeset">
        <Row>
          <Col span={12}>
            <Form {...formItemLayout} colon={false} onSubmit={this.handleSub}>
              <Form.Item>
                <Radio
                  value="0"
                  checked={this.state.isDisable}
                  onClick={() => {
                    this.setState({ type: 0, isDisable: true });
                    this.handleReset();
                  }}
                  className="radios"
                >
                  自动时间设置
                </Radio>
              </Form.Item>
              <Form.Item>
                <Radio
                  value="1"
                  checked={!this.state.isDisable}
                  onClick={() => this.setState({ type: 1, isDisable: false })}
                  className="radios"
                >
                  手动时间设置
                </Radio>
              </Form.Item>
              <Form.Item label="日期">
                {getFieldDecorator("date", {
                  initialValue: moment(
                    new Date().toLocaleDateString(),
                    dateFormat
                  )
                })(
                  <DatePicker
                    format={dateFormat}
                    disabled={this.state.isDisable}
                    style={{ width: "80%" }}
                  />
                )}
              </Form.Item>
              <Form.Item label="时间">
                {getFieldDecorator("time", {
                  initialValue: moment(new Date().toTimeString(), timeFormat)
                })(
                  <TimePicker
                    disabled={this.state.isDisable}
                    format={timeFormat}
                    style={{ width: "80%" }}
                  />
                )}
              </Form.Item>
              <Form.Item
                style={{ marginTop: "20px" }}
                wrapperCol={{ span: 10 }}
              >
                <div className="optwrap">
                  <Button htmlType="submit" type="primary" className="submit">
                    确认
                  </Button>
                  <Button className="cancle">取消</Button>
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Form.create({})(TimesSettings);
