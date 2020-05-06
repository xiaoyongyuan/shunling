import React, { Component } from 'react';
import nodata from "../../style/imgs/nodata.png";
import "./homeModel.less";
import axios from "../../axios/index";
import {Button, message, Switch,Empty} from "antd";
class HomePageModel extends Component{
    constructor(props){
        super(props);
        this.state={
            homeDatail:[],
            field:true, //是否显示围界信息
            obj:true, //是否显示报警对象
        };
    }
    componentWillMount() {
        this.setState({
            listCode:this.props.listCode
        });
    }

    componentDidMount() {
        this.setState({
            listCode:this.props.listCode
        },()=>{
            this.getOne();
        });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.visible){
            this.setState({
                listCode:nextProps.listCode
            },()=>{
                this.getOne();
            });
        }
    }
    getOne=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/index/alarmvideolist",
            data:{
                acode:this.state.listCode
            }
        }).then((res)=>{
            if(res.success){
                if(res.data.length>0){
                    res.data[0].fieldresult.map((v)=>{
                        this.setState({
                            tagType:v.tag
                        });
                    });
                    this.setState({
                        homeDatail:res.data,
                        fields:res.data[0].field,
                        picpathImg:res.data[0].picpath,
                        fieldresult:res.data[0].fieldresult,
                        pic_width:res.data[0].pic_width,
                        pic_height:res.data[0].pic_height,
                        policeStatus:res.data[0].status,
                        policeCode:res.data[0].code,
                    },()=>{
                        this.draw();
                    })
                }
            }
        })
    };
    //画围界
    draw=()=>{
        let ele = document.getElementById("homeCanvas");
        let area = ele.getContext("2d");
        area.clearRect(0,0,704,576);//清除之前的绘图
        area.lineWidth=1;
        if(this.state.picpathImg){
            const datafield=this.state.fields;
            if(this.state.field && datafield.length){
                const xi=400/704, yi=300/576;
                let areafield = ele.getContext("2d");
                for(let i=0;i<datafield.length;i++){
                    let list=datafield[i].pointList;
                    for(let a=0;a<list.length;a++){
                        areafield.lineWidth = 1;
                        areafield.strokeStyle = '#f00';
                        areafield.beginPath();
                        areafield.moveTo(parseInt(list[0][0] * xi), parseInt(list[0][1] * yi));
                        areafield.lineTo(parseInt(list[1][0] * xi), parseInt(list[1][1] * yi));
                        areafield.lineTo(parseInt(list[2][0] * xi), parseInt(list[2][1] * yi));
                        areafield.lineTo(parseInt(list[3][0] * xi), parseInt(list[3][1] * yi));
                        areafield.lineTo(parseInt(list[4][0] * xi), parseInt(list[4][1] * yi));
                        areafield.lineTo(parseInt(list[5][0] * xi), parseInt(list[5][1] * yi));
                        areafield.lineTo(parseInt(list[0][0] * xi), parseInt(list[0][1] * yi));
                        areafield.stroke();
                        areafield.closePath();
                    }
                }
            }
            const objs=this.state.fieldresult;
            if(this.state.obj && objs.length){
                //计算缩放比例
                const x=400/this.state.pic_width, y=300/this.state.pic_height;
                objs.map((el,i)=>{
                    area.strokeStyle='#ff0';
                    area.beginPath();
                    area.rect(parseInt(el.x*x),parseInt(el.y*y),parseInt(el.w*x),parseInt(el.h*y));
                    area.stroke();
                    area.closePath();
                    return '';
                })
            }
        }
    };
    handleStatus=(status)=>{
        switch (status) {
            case 0:
                return "未处理";
            case 1:
                return "警情";
            case 3:
                return "虚警";
            default:
                return "未处理";
        }
    };
    //控制显示围界与对象
    onChangeCumference=(checked,text)=>{
        this.setState({
            [text]: checked,
        },()=>{
            this.draw();
        });
    };
    //修改报警状态
    hanlePoliceStatus=(status)=>{
        if(this.state.policeCode){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/alarm/setalastatus",
                data:{
                    acode:this.state.policeCode,
                    status:status
                }
            }).then((res)=>{
                if(res.success){
                    let oldAlarm=this.state.homeDatail;
                    oldAlarm[0].status=res.data.status;
                    this.setState({oldAlarm});
                    message.info("操作成功!");
                }
            })
        }
    };
    render() {
        return(
            this.state.homeDatail.length>0?this.state.homeDatail.map((v,i)=>(
                    <div className="homePageModel" key={i}>
                        <div className="homePageModelLeft">
                            <div className="homeageImg">
                                <div className="homeImg">
                                    <canvas id="homeCanvas" width="400px" height="300px" style={{backgroundImage:'url('+window.g.imgUrl+v.picpath+')',backgroundSize:"100% 100%"}} alt=""/>
                                    <img className="nodata" src={nodata} alt="" style={{display:window.g.imgUrl+v.picpath?"none":"block"}} />
                                </div>
                                <div className="homeImg">
                                    <video src={window.g.imgUrl+v.videopath} autoplay="autoplay" controls="controls" alt=""/>
                                </div>
                            </div>
                            {/*<div className="nextHome">
                                <span className="nextUp">上一个 </span>
                                <span className="arrLeft"><Icon type="arrow-left" className="cicrle-icon" onClick={()=>this.looknew('prev')} /></span>
                                <span className="arrRight"><Icon type="arrow-right" className="cicrle-icon" onClick={()=>this.looknew('next')} /></span>
                                <span className="nextUp">下一个</span>
                            </div>*/}
                        </div>
                        <div className="homePageModelRight">
                            <div className="deviceContext">
                                <p className="devicetitle">
                                    <span className="deviceBg" />&nbsp;
                                    <span className="deviceFont">报警信息</span>
                                </p>
                                <div className="nameDevice"><span className="equName">设备名称</span><span className="equTimes">{v.name}</span></div>
                                <div className="nameDevice"><span className="equName">报警类型</span><span className="equTimes">{this.state.tagType===0?"人员报警":"车辆报警"}</span></div>
                                <div className="nameDevice"><span className="equName">报警时间</span><span className="equTimes">{v.atime}</span></div>
                                <div className="nameDevice"><span className="equName">报警状态</span><span className="equTimes">{this.handleStatus(v.status)}</span></div>
                                <div className="nameDevice">
                                    <span className="sector" style={{display:this.state.picpathImg?"inlineBlock":"none"}}>防区显示&nbsp;&nbsp;<Switch size="small" checked={this.state.field} onChange={(checked)=>this.onChangeCumference(checked,'field')} /></span>
                                    <span className="sector" style={{display:this.state.picpathImg?"inlineBlock":"none"}}>目标显示&nbsp;&nbsp;<Switch size="small" checked={this.state.obj} onChange={(checked)=>this.onChangeCumference(checked,'obj')} /></span>
                                </div>

                            </div>
                            <div className="alarmImg">
                                <p className="alarmSatus">
                                    <span className="alarmSatusBg" />&nbsp;
                                    <span className="alarmSatusFont">报警状态</span>
                                </p>
                                <div className="policeBtn">
                                    <Button type="primary" onClick={()=>this.hanlePoliceStatus("1")} >警情</Button>
                                    <Button type="primary" onClick={()=>this.hanlePoliceStatus("3")} >虚警</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )):<Empty />
        );
    }
}
export default HomePageModel;
