import React, { Component } from 'react';
import Etable from "../common/Etable";
import GroupModel from "./GroupModel";
import axios from "../../axios/index";
import Utils from "../../utils/utils";
import "../../style/ztt/css/groupManagement.less";
import {Button, Col, Icon, Row, Modal,message} from "antd";
const confirm = Modal.confirm;
class GroupManagement extends Component{
    constructor(props){
        super(props);
        this.state={
            visible:false,
            tabList:[],
        };
    }
    params={
        pageindex:1,
    };

    componentDidMount() {
       this.hanleTabList();
    }
    hanleTabList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/system/nodelist",
            data:{
                pageindex:this.params.pageindex
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    tabList:res.data,
                    pagination:Utils.pagination(res,(current)=>{
                        this.params.pageindex=current;
                        this.hanleTabList();
                    })
                })
            }
        })
    };
    // 新增、编辑
    uploadOk=(params)=>{
        this.setState({visible:false});
        const _this=this;
        if(_this.state.groupType===0){
            //新增
            axios.ajax({
                method:"post",
                url:window.g.loginURL+"/api/system/addnode",
                data:params
            }).then((res)=>{
                if(res.success){
                    message.success(res.msg);
                    this.hanleTabList();
                }else{
                    message.warning(res.msg);
                }
            })
        }else{
            //编辑
            params.code=this.state.codetype;
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/system/updatenode",
                data:params
            }).then((res)=>{
                if(res.success){
                    message.success(res.msg);
                    this.hanleTabList();
                }
            })
        }
    };
    hanleGroupDel=(delcode)=>{
      const _this=this;
        confirm({
            title: '确认删除吗？',
            onOk() {
                axios.ajax({
                    method:"get",
                    url:window.g.loginURL+"/api/system/nodedel",
                    data:{
                        code:delcode.code,
                    }
                }).then((res)=>{
                    if(res.success){
                        message.success(res.msg);
                        _this.hanleTabList();
                    }
                })
            }
        });
    };
    changeState=(key,val,record,groupType,typecode)=>{
        this.setState(
            {
                [key]:val,
                codetype:record.code,
                [groupType]:typecode,
            }
        )
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
                title: "分组名称",
                dataIndex: "sysname",
                align: "center"
            },
            {
                title: "最小磁盘空间",
                dataIndex: "disk_min",
                align: "center",
            },
            {
                title: "是否同步",
                dataIndex: "ifsync",
                align: "center",
                render:(text,record)=>{
                    if(record.ifsync===1){
                        return(
                            <span>同步</span>
                        )
                    }else if(record.ifsync===-1){
                        return(
                            <span>同步失败</span>
                        )
                    }else if(record.ifsync===0){
                        return(
                            <span>否</span>
                        )
                    }
                }
            },
            {
                title: "IP",
                dataIndex: "sysip",
                align: "center"
            },
            {
                title: "备注",
                dataIndex: "memo",
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
        return (
            <div className="groupManagement">
                <Button type="primary" className="addGroup" onClick={()=>this.changeState('visible',true,'','groupType',0)}>
                    <Icon type="plus" />
                    添加分组
                </Button>
                <Row>
                    <Col span={24}>
                        <Etable
                            columns={userlist}
                            dataSource={this.state.tabList}
                            pagination={this.state.pagination}
                            style={{ marginTop: "20px"}}
                        />
                    </Col>
                </Row>
                    <GroupModel
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
export default GroupManagement;
