import React, { Component } from 'react';
import {Form,Input,Modal} from "antd";
import axios from "../../axios/index";
let vis=false;
class GroupModel extends Component{
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
               },()=>{
                   this.hanlebackfill();
               })
           }
       }
   }

    hanlebackfill=()=>{
        if(this.state.code){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/system/nodeOne",
                data:{
                    code:this.state.code
                }
            }).then((res)=>{
                if(res.success){
                    this.props.form.setFieldsValue({
                        sysname:res.data.sysname,//项目名称
                        sysip:res.data.sysip,//名称
                    });
                }
            })
        }
    }
    handleFilterSubmit = ()=>{//查询提交
        const _this=this;
        this.props.form.validateFields((err,values) => {
            if (!err) {
                var data={};
                data.sysname=values.sysname;
                data.sysip=values.sysip;
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
                title={this.props.groupType===0?"新增分组":"编辑分组"}
                visible={this.props.visible}
                onCancel={this.reset}
                onOk={this.handleFilterSubmit}
            >
                <Form {...formItemLayout}>
                    <Form.Item label="分组名称">
                        {getFieldDecorator('sysname', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入分组名称！',
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    {
                        this.props.groupType===0?[
                            <Form.Item label="IP">
                                {getFieldDecorator('sysip', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入IP！',
                                        }
                                    ],
                                })(<Input />)}
                            </Form.Item>
                        ]:[]
                    }
                </Form>
            </Modal>
        );
    }
}
export default GroupModel=Form.create({})(GroupModel);