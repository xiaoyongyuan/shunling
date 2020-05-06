import React, { Component } from 'react';
import {Form,Input,Modal,Select} from "antd";
import axios from "../../../axios";
const Option=Select.Option;
let vis=false;
class SecurityModel extends Component{
    reset=()=>{
        this.props.form.resetFields();
        this.props.uploadreset()
    };
    componentWillReceiveProps(nextProps) {
        if(nextProps.visible !== vis){
            vis=nextProps.visible;
            if(nextProps.visible){
                this.setState({
                    code:nextProps.code
                },(()=>{
                    this.hanlebackfill();
                }))
            }
        }
    }
    hanlebackfill=()=>{
        if(this.state.code){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/security/getone",
                data:{
                    code:this.state.code
                }
            }).then((res)=>{
                if(res.success){
                    this.props.form.setFieldsValue({
                        securityaccount:res.data.securityaccount,//安保人员账号
                        realname:res.data.realname,//姓名
                        gender:res.data.gender,//性别
                        linktel:res.data.linktel,//联系电话
                        linkmen:res.data.linkmen,//紧急联系人
                        linktel1:res.data.linktel1,//紧急联系人电话
                    });
                }
            })
        }
    };
    handleFilterSubmit = ()=>{//查询提交
        const _this=this;
        this.props.form.validateFields((err,values) => {
            if (!err) {
                var data={};
                data.securityaccount=values.securityaccount;
                data.realname=values.realname;
                data.gender=values.gender;
                data.linktel=values.linktel;
                data.linktel1=values.linktel1;
                data.linkmen=values.linkmen;
                _this.props.filterSubmit(data);
                _this.props.form.resetFields();
                _this.reset();
            }
        });
    };
    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 16
            }
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                title={this.props.groupType===0?"添加安保人员":"编辑安保人员"}
                visible={this.props.visible}
                onCancel={this.reset}
                onOk={this.handleFilterSubmit}
                maskClosable={false}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="安保人员账号">
                        {getFieldDecorator('securityaccount', {
                            rules: [
                                {
                                    required: false,
                                    message: '请输入安保人员账号！',
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="姓名">
                        {getFieldDecorator('realname', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入姓名！',
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="性别">
                        {getFieldDecorator('gender', {
                            initialValue:"男",
                            rules: [
                                {
                                    required: true,
                                    message: '请选择性别！',
                                }
                            ],
                        })(
                            <Select >
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item label="联系电话">
                        {getFieldDecorator('linktel', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入联系电话！',
                                },
                                {
                                    pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                                    message: "请输入正确的手机号！"
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="紧急联系人">
                        {getFieldDecorator('linkmen', {
                            rules: [
                                {
                                    required: false,
                                    message: '请输入紧急联系人！',
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="紧急联系电话">
                        {getFieldDecorator('linktel1', {
                            rules: [
                                {
                                    required: false,
                                    message: '请输入紧急联系电话！',
                                },
                                {
                                    pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, "g"),
                                    message: "请输入正确的手机号！"
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}
export default SecurityModel=Form.create({})(SecurityModel);