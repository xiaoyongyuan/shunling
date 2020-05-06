import React from "react";
import {
  Input,
  Select,
  Form,
  Button,
  Checkbox,
  Radio,
  DatePicker,
  Upload,
  Icon,
  InputNumber,
  message
} from "antd";
import moment from "moment";
import axios from "../../axios";
import ofterajax from "../../axios/ofter";

import "./index.less";
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class FilterForm extends React.Component {
  state = {
    monitoring: [],
    equipment: []
  };
  handleFilterSubmit = () => {
    //查询提交
    let fieldsValue = this.props.form.getFieldsValue();
    this.props.filterSubmit(fieldsValue);
  };
  layerSubmit = () => {
    //弹窗提交
    const _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var data = values;
        if (values.upload) data.fileurl = _this.state.fileurl;
        console.log("提交前", this.state.fileurl, data);
        _this.props.filterSubmit(data);
        _this.props.form.resetFields();
      }
    });
  };
  reset = fafuns => {
    this.props.form.resetFields();
    if (fafuns) this.props[fafuns]();
  };
  selectChange = (key, val, type) => {
    this.props.form.setFieldsValue({ [key]: val });
    if (type) {
      this.setState({ dotint: val }, () => this.equipment());
    }
  };
  equipment = () => {
    //获取监测点下的设备
    if (this.state.dotint) {
      ofterajax.equipment({ dot: this.state.dot }).then(res => {
        this.setState({ equipment: res });
      });
    }
  };
  uploadchange = info => {
    //上传文件
    if (info.file.status === "uploading") {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      const resp = info.file.response;
      if (resp.success) {
        this.setState({ fileurl: resp.data.url }, () => {
          console.log("上传成功", this.state.fileurl);
        });
      } else {
        message.error(resp.msg);
      }
    }
  };
  dot = (initialValue, own) => {
    ofterajax.dot().then(res => {
      if (res.length) {
        var dotint;
        if (initialValue) {
          dotint = initialValue;
        } else {
          own ? (dotint = "") : (dotint = res[0].pointid);
        }
        this.setState({
          monitoring: res,
          dotint: dotint
        });
      }
    });
  };
  initFormList = () => {
    const _this = this;
    const { getFieldDecorator } = this.props.form;
    const formList = this.props.formList;
    const formItemList = [];
    if (formList.item && formList.item.length > 0) {
      formList.item.forEach((item, i) => {
        if (item.type === "RANGPICKER") {
          //双日期
          const RANGPICKER = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                initialValue: item.initialValue
                  ? [moment(item.initialValue[0]), moment(item.initialValue[1])]
                  : null
              })(
                <RangePicker
                  showTime={item.showTime || false}
                  format={item.format || "YYYY-MM-DD"}
                />
              )}
            </FormItem>
          );
          formItemList.push(RANGPICKER);
        } else if (item.type === "datePicker") {
          const datePicker = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                initialValue: moment(item.initialValue)
              })(
                <DatePicker
                  showTime={item.showTime || false}
                  format={item.format || "YYYY-MM-DD"}
                />
              )}
            </FormItem>
          );
          formItemList.push(datePicker);
        } else if (item.type === "INPUT") {
          const INPUT = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                initialValue: item.initialValue
              })(<Input key={item.field} />)}
            </FormItem>
          );
          formItemList.push(INPUT);
        } else if (item.type === "SELECT") {
          const SELECT = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                initialValue: item.initialValue
              })(
                <Select
                  style={{ width: item.width }}
                  placeholder={item.placeholder}
                >
                  {item.list.map(city => (
                    <Option key={city.code} value={city.code}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          );
          formItemList.push(SELECT);
        } else if (item.type === "CHECKBOX") {
          const CHECKBOX = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                valuePropName: "checked",
                initialValue: item.initialValue //true | false
              })(<Checkbox>{item.label}</Checkbox>)}
            </FormItem>
          );
          formItemList.push(CHECKBOX);
        } else if (item.type === "InputNumber") {
          const inputNumber = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                initialValue: item.initialValue //true | false
              })(
                <InputNumber
                  formatter={value =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={value => value.replace(/\$\s?|(,*)/g, "")}
                />
              )}
            </FormItem>
          );
          formItemList.push(inputNumber);
        } else if (item.type === "Radiobut") {
          const Radiobut = (
            <FormItem label={item.label} key={item.field}>
              {getFieldDecorator(`${item.field}`, {
                rules: item.rules,
                initialValue: item.initialValue //true | false
              })(
                <Radio.Group buttonStyle="solid">
                  {item.list.map(city => (
                    <Radio.Button key={"item.field" + city.id} value={city.id}>
                      {city.text}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
            </FormItem>
          );
          formItemList.push(Radiobut);
        } else if (item.type === "monitoring") {
          //监测点列表
          if (!this.state.monitoring.length) {
            this.dot(item.initialValue, item.own);
          }
          const selectdot = (
            <FormItem label={item.label} key={item.field || "dot"}>
              {getFieldDecorator(`${item.field}` || "dot", {
                rules: item.rules,
                initialValue: _this.state.dotint
              })(
                <Select
                  key="dots"
                  style={{ minWidth: "100px" }}
                  placeholder={item.placeholder}
                  onChange={value =>
                    this.selectChange(item.field || "dot", value, "monitoring")
                  }
                >
                  {item.own ? (
                    <Option key="dotq1" value="">
                      所有
                    </Option>
                  ) : null}
                  {this.state.monitoring.map(city => (
                    <Option key={city.pointid} value={city.pointid}>
                      {city.checkname}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          );
          formItemList.push(selectdot);
        } else if (item.type === "equipment") {
          //设备列表
          if (!this.state.equipment) this.equipment();
          const selectdot = (
            <FormItem label={item.label} key={item.field || "eqipe"}>
              {getFieldDecorator(`${item.field}` || "equipment", {
                rules: item.rules,
                initialValue: item.initialValue
              })(
                <Select
                  key="equip"
                  style={{ minWidth: "100px" }}
                  placeholder={item.placeholder}
                  onChange={value =>
                    this.selectChange(item.field || "equipment", value)
                  }
                >
                  {item.own ? (
                    <Option key="equipment1" value="">
                      所有
                    </Option>
                  ) : null}
                  {this.state.equipment.map(city => (
                    <Option
                      key={"equipment" + city.pointid}
                      value={city.pointid}
                    >
                      {city.ename}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          );
          formItemList.push(selectdot);
        } else if (item.type === "upload") {
          //上传
          const uploade = (
            <Form.Item label={item.label} key="upload">
              {getFieldDecorator("upload", {
                rules: item.rules
              })(
                <Upload {...item.property} onChange={this.uploadchange}>
                  <Button>
                    <Icon type="upload" /> 选择文件
                  </Button>
                </Upload>
              )}
            </Form.Item>
          );
          formItemList.push(uploade);
        } else if (item.type === "button") {
          //button
          const Buttons = (
            <FormItem key="buts">
              {item.button.map((el, ind) => (
                <Button
                  key={"but" + ind}
                  type={el.type}
                  style={{ margin: "0 10px" }}
                  onClick={() => this[el.click](el.fafuns)}
                >
                  {el.label}
                </Button>
              ))}
            </FormItem>
          );
          formItemList.push(Buttons);
        } else {
        }
      });
    }
    return formItemList;
  };
  render() {
    const formList = this.props.formList;
      const formItemLayout = {
          labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
          },
          wrapperCol: {
              xs: { span: 24 },
              sm: { span: 10 },
          },
      };
    return (
      <div>
        {formList.type ? (
          <Form className="baseform" layout="inline">
            {this.initFormList()}
          </Form>
        ) : (
          <Form className="baseform" {...formItemLayout}>
            {this.initFormList()}
          </Form>
        )}
      </div>
    );
  }
}
export default Form.create({})(FilterForm);
