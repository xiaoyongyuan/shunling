import React, { Component } from 'react';
import Etable from "../../common/Etable";
import axios from "../../../axios/index";
import {Button, Icon, message, Modal,Form,Input,Select} from "antd";
import "../../../style/ztt/css/security.less";
import SecurityModel from "./SecurityModel";
const confirm = Modal.confirm;
const Option=Select.Option;
class Security extends Component{
    constructor(props) {
        super(props);
        this.state={
            securList:[],
            visible:false
        };
    }
    componentDidMount() {
        this.securityList();
    }
    //安保人员列表
    securityList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/security/getlist",
            data:{
                realname:this.state.realname,
                gender:this.state.gender
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    securList:res.data
                })
            }
        })
    };
    //查询安保人员姓名、性别
    handleSecuritySubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    realname:values.realname,
                    gender:values.gender
                },()=>{
                    this.securityList();
                })
            }
        });
    }
    changeState=(key,val,record,groupType,typecode)=>{
        this.setState(
            {
                [key]:val,
                codetype:record.code,
                [groupType]:typecode,
            }
        )
    };
    uploadOk=(params)=>{
        this.setState({visible:false});
        const _this=this;
        if(_this.state.groupType===0){
            //新增
            axios.ajax({
                method:"post",
                url:window.g.loginURL+"/api/security/add",
                data:params
            }).then((res)=>{
                if(res.success){
                    this.securityList();
                }else{
                    message.warning(res.msg);
                }
            })
        }else{
            //编辑
            params.code=this.state.codetype;
            axios.ajax({
                method:"put",
                url:window.g.loginURL+"/api/security/update",
                data:params
            }).then((res)=>{
                if(res.success){
                    message.success(res.msg);
                    this.securityList();
                }
            })
        }
    };
    //删除
    hanleGroupDel=(delcode)=>{
        const _this=this;
        confirm({
            title: '确认删除吗？',
            onOk() {
                axios.ajax({
                    method:"put",
                    url:window.g.loginURL+"/api/security/update",
                    data:{
                        code:delcode.code,
                        ifdel:1
                    }
                }).then((res)=>{
                    if(res.success){
                        message.success(res.msg);
                        _this.securityList();
                    }
                })
            }
        });
    };
    render() {
        const userlist = [
            {
                title: "序号",
                align: "center",
                key: "code",
                render: (text, record, index) => index + 1
            },
            {
                title: "安保人员账号",
                dataIndex: "securityaccount",
                align: "center"
            },
            {
                title: "姓名",
                dataIndex: "realname",
                align: "center",
            },
            {
                title: "性别",
                dataIndex: "gender",
                align: "center",
            },
            {
                title: "联系电话",
                dataIndex: "linktel",
                align: "center"
            },
            {
                title: "紧急联系人",
                dataIndex: "linkmen",
                align: "center"
            },{
                title: "紧急联系人电话",
                dataIndex: "linktel1",
                align: "center"
            },
            {
                title: "操作",
                dataIndex: "oper",
                width:"20%",
                align: "center",
                render:(text,record)=>{
                    return(
                        <div >
                            <Button type="primary" className="operationBtn" onClick={()=>this.changeState('visible',true,record,'groupType',1)}>编辑</Button>
                            <Button type="primary" className="operationBtn" onClick={()=>this.hanleGroupDel(record)}>删除</Button>
                        </div>
                    )
                }
            }
        ];
        const { getFieldDecorator} = this.props.form;
        return (
            <div className="security">
                <Form layout="inline" onSubmit={this.handleSecuritySubmit}>
                    <Form.Item label="姓名">
                        {getFieldDecorator('realname')(<Input />)}
                    </Form.Item>
                    <Form.Item label="性别">
                        {getFieldDecorator('gender',{
                            initialValue:""
                        })(
                            <Select style={{width:120}}>
                                <Option value="">请选择</Option>
                                <Option value="男">男</Option>
                                <Option value="女">女</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                           查询
                        </Button>
                    </Form.Item>
                </Form>
                <Button type="primary" className="addGroup" onClick={()=>this.changeState('visible',true,'','groupType',0)}>
                    <Icon type="plus" />
                    添加安保人员
                </Button>
                <div className="securityTab">
                    <Etable
                        columns={userlist}
                        dataSource={this.state.securList}
                    />
                </div>
                <SecurityModel
                    visible={this.state.visible}
                    filterSubmit={this.uploadOk}
                    code={this.state.codetype}
                    groupType={this.state.groupType}
                    uploadreset={()=>this.changeState('visible',false,'','groupType',1)}
                />
            </div>
        );
    }
}
export default Security=Form.create({})(Security);