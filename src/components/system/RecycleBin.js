import React, { Component } from 'react';
import "../../style/ztt/css/recyclebin.less";
import {Row,Col,message,Modal,Pagination} from "antd";
import alarmBg from "../../style/ztt/imgs/alarmBg.png";
import axios from "../../axios/index";
import nodata from "../../style/imgs/nodata.png";
import moment from "moment";
const confirm = Modal.confirm;
class RecycleBin extends Component{
    constructor(props){
        super(props);
        this.state= {
            page:1,
            pagesize:10,
            recycList:[],
        };
    }
    componentDidMount() {
        this.getList();
    }
    getList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/camera/getlist",
            data:{
                ifdel:1,
                pagesize:this.state.pagesize,
                pageindex:this.state.page
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    recycList:res.data,
                    totalcount:res.totalcount
                })
            }
        })
    };
    //恢复
    hanleRecovery=(recovery)=>{
        const _this=this;
        confirm({
            content: '确认恢复该设备吗？',
            onOk() {
                axios.ajax({
                    method:"put",
                    url:window.g.loginURL+"/api/camera/update",
                    data:{
                        ifdel:0,
                        code:recovery.code,
                        groupid:recovery.groupid
                    }
                }).then((res)=>{
                    if(res.success){
                        message.info(res.msg);
                        _this.getList();
                    }
                })
            }
        });
    };
    hanleEliminate=(time)=>{
        let beforeTime = moment(time).format('YYYY-MM-DD ');
        let mydate = moment(moment(new Date()).format('YYYY-MM-DD '));
        let days=mydate.diff(beforeTime, 'day');
        return 7-days;
    };
    hanlePage=(page)=>{
        this.setState({page},()=>{
            this.getList();
        })
    };
    render() {
        return (
            <div className="recycleBin">
                <div className="rec-title">回收站内设备配置7天内会清除</div>
                <div className="gutter-example">
                    <Row gutter={16}>
                        {
                            this.state.recycList.length>0?this.state.recycList.map((v,i)=>(
                                <Col xxl={4} xl={6} className="gutter-row" key={i}>
                                    <div className="gutter-box">
                                        <img src={v.basemap?v.basemap:alarmBg} className="basemap" alt=""/>
                                        <div className="recycleBg">
                                            <span className="recycleCircle"/>
                                            <span className="recycleFont">{v.name}</span>
                                        </div>
                                    </div>
                                    <div className="recycleBinBtn">
                                        <span onClick={()=>this.hanleRecovery(v,i)}>恢复</span>
                                        <span>{this.hanleEliminate(v.deltime)}天后清除</span>
                                    </div>
                                </Col>
                            )):<div className="nodata"><img src={nodata} alt="" /></div>
                        }
                    </Row>
                    <Pagination hideOnSinglePage={true}  defaultCurrent={this.state.page} current={this.state.page} total={this.state.totalcount} pageSize={this.state.pagesize} onChange={this.hanlePage} total={this.state.totalcount} className="pagination" style={{display:this.state.recycList.length>0?"block":"none"}} />
                </div>
            </div>
        );
    }
}
export default RecycleBin;
