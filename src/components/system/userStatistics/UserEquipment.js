import React, { Component } from 'react';
import "../../../style/ztt/css/userEquipment.less";
import {Link} from "react-router-dom";
import axios from "../../../axios/index";
import {Button, Row, Col, Modal,Empty} from 'antd';
import ReactEcharts from "echarts-for-react";
import moment from "moment";
class UserEquipment extends Component{
    constructor(props){
        super(props);
        this.state={
            option:{},//总设备柱形图
            detailsOption:{},//设备详情图标
            cylindrical:false,
            details:false,
            equipment:[],
            equList:[],//设备x轴的值
            equTotal:[]
        };
    }
    componentWillMount() {
        this.setState({
            currentTime:moment(this.props.query.dayTime).format("YYYY/MM/DD"),
        })
    }

    componentDidMount() {
        this.hnaleDeviceAlarm();
    }
    hnaleDeviceAlarm=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/report/cidalacount",
            data:{date:this.state.currentTime}
        }).then((res)=>{
            if(res.success){
                let equList=[];
                let equTotal=[];
                res.data.map((v)=>{
                    if(v.Cname!=null){
                        equList.push(v.Cname);
                        equTotal.push(v.Totalcount);
                    }
                });
                this.setState({
                    equipment:res.data,
                    equList,
                    equTotal
                })
            }
        })
    };
    //24小时折线
    handleHours=(cid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/report/cidhouralacount",
            data:{
                cid:cid,
                date:this.state.currentTime
            }
        }).then((res)=>{
            if(res.success){
                let linexData=[];
                let lineyData=[];
                res.data.map((v)=>{
                    linexData.push(v.Hour);
                    lineyData.push(v.Totalcount);
                });
                this.setState({
                    linexData,
                    lineyData
                },()=>{
                    this.handleEquStatistics();
                })
            }
        })
    };
    //柱形图
    hanleEquStatistics=()=>{
        let option = {
            title: {
                // text: '异常航班原因统计',
                bottom: 10,
                left: 'center',
                textStyle: {
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '8%',
                right: '16%',
                bottom: '5%',
                containLabel: true
            },
            xAxis: [{
                name:"摄像头编码",
                type: 'category',
                axisTick: {
                    show: false,
                    color: '#707070'
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 14,
                        color: '#4D4D4D'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#707070'
                    }
                },
                data: this.state.equList,
            }],
            yAxis: {
                type: 'value',
                name: '报警次数',
                nameTextStyle: {
                    fontSize: 14,
                    color: '#4D4D4D'
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 12,
                        color: '#4D4D4D'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#707070'
                    }
                }
            },
            series: [{
                name: '报警总数',
                type: 'bar',
                barWidth: '25',
                itemStyle: {
                    color: '#1e93f6'
                },
                data:this.state.equTotal
            }]
        };
        this.setState({option})
    };
    //折线
    handleEquStatistics=()=>{
        let uploadedDataURL = "/asset/get/s/data-1547533200844-7eBMgp66l.png";
        let detailsOption = {
            grid: {
                top: '9%',
                bottom: '10%',
                left: '12%',
                right: '8%'
            },
            tooltip: {
                trigger: 'axis',
                label: {
                    show: true
                }
            },
            xAxis: {
                name:"小时",
                boundaryGap: true, //默认，坐标轴留白策略
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false,
                    alignWithLabel: true
                },
                data:this.state.linexData
            },
            yAxis: {
                name:"报警次数",
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(33,148,246,0.2)'
                    }
                },
                axisTick: {
                    show: false
                },
                splitArea: {
                    show: true,
                    areaStyle: {
                        color: 'rgb(245,250,254)'
                    }
                }
            },
            series: [{
                type: 'line',
                symbol: 'circle',
                symbolSize: 7,
                lineStyle: {
                    color: 'rgb(33,148,246)',
                    shadowBlur: 12,
                    shadowColor: 'rgb(33,148,246,0.9)',
                    shadowOffsetX: 1,
                    shadowOffsetY: 1
                },
                itemStyle: {
                    color: 'rgb(33,148,246)',
                    borderWidth: 1,
                    borderColor: '#FFF'
                },
                label: {
                    show: false,
                    distance: 1,
                    emphasis: {
                        show: true,
                        offset: [25, -2],
                        //borderWidth:1,
                        // borderColor:'rgb(33,148,246)',
                        //formatter:'{bg|{b}\n数据量:{c}}',
                        backgroundColor: {
                            image: uploadedDataURL
                        },
                        color: '#FFF',
                        padding: [8, 20, 8, 6],
                        //width:60,
                        height: 36,
                        formatter: function(params) {
                            var name = params.name;
                            var value = params.data;
                            var str = name + '\n数据量：' + value;
                            return str;
                        },
                        rich: {
                            bg: {
                                backgroundColor: {
                                    image: uploadedDataURL
                                },
                                width: 78,
                                //height:42,
                                color: '#FFF',
                                padding: [20, 0, 20, 10]
                            },
                            br: {
                                width: '100%',
                                height: '100%'
                            }

                        }
                    }
                },
                data: this.state.lineyData
            }]
        };
        this.setState({detailsOption})
    };
    hanleLookEqu=()=>{
        this.hanleEquStatistics();
        this.setState({
            cylindrical:true
        })
    };
    cylindricalCancel=()=>{
        this.setState({
            cylindrical:false
        })
    };
    hanleDetails=(cid,cname)=>{
        this.handleHours(cid);
        this.setState({
            details:true,
            cname
        })
    };
    detailsCancel=()=>{
        this.setState({
            details:false
        })
    };
    render() {
        return (
            <div className="userEquipment">
                <Link to={"/main/userIndex"}><Button type="primary">返回</Button></Link>
                <div className="equTitle">{moment(this.state.currentTime).format("YYYY")}年{moment(this.state.currentTime).format("MM")}月{moment(this.state.currentTime).format("DD")}日</div>
                <div className="equBtn" style={{display:this.state.equipment.length>0?"block":"none"}}>
                    <Button onClick={this.hanleLookEqu} className="lookecharts">查看摄像头图表</Button>
                    <Button type="primary"><a href={window.g.loginURL+"/api/report/cidalacountdownload?date="+moment(this.state.currentTime).format("YYYY/MM/DD")}>数据导出</a></Button>
                </div>
                <Row gutter={12} className="equ-body">
                    {
                        this.state.equipment.length>0?[this.state.equipment.map((v,i)=>(
                            <Col xxl={4} xl={6} lg={8} md={10} sm={10} xs={10} key={v.code}>
                                <div className="equ-item" >
                                    <div className="equ-conTop">
                                        <span className="equTop-title">{v.Cname==null?"设备已解绑":v.Cname}</span>
                                        <span className="equTop-img"/>
                                    </div>
                                    <div className="equ-conCenter">
                                        <div className="con-item alarm">当天报警数</div>
                                        <div className="con-num3 alarm"><span className="conNum">{v.Totalcount}</span><span>次</span></div>
                                        <div className="con-item alarm">未处理报警数</div>
                                        <div className="con-num2 alarm"><span className="conNum">{v.Unhandle}</span><span>次</span></div>
                                        <div className="con-item alarm">确认报警数</div>
                                        <div className="con-num1 alarm"><span className="conNum">{v.Confirm}</span><span>次</span></div>
                                        <div className="con-item alarm">虚警报警数</div>
                                        <div className="con-num4 alarm"><span className="conNum">{v.Neglect}</span><span>次</span></div>
                                    </div>
                                    <div className="equ-conBottom" style={{display:v.Cname==null?"none":"inlineFlex"}}>
                                        <a className="equ-export" href={window.g.loginURL+"/api/report/cidalalistdownload?cid="+v.Cid+"&date="+moment(this.state.currentTime).format("YYYY/MM/DD")}>详情导出</a>
                                        <span className="equ-export" onClick={()=>this.hanleDetails(v.Cid,v.Cname)}>图表详情</span>
                                    </div>
                                </div>
                            </Col>
                        ))]:<Empty />
                    }
                </Row>
                <Modal
                    title={`${moment(this.state.currentTime).format("YYYY")}年${moment(this.state.currentTime).format("MM")}月${moment(this.state.currentTime).format("DD")}日设备报警总数曲线图`}
                    visible={this.state.cylindrical }
                    onCancel={this.cylindricalCancel}
                    footer={null}
                    width={650}
                    maskClosable={false}
                >
                    <ReactEcharts
                        option={this.state.option}
                        style={{width:"100%",height:"350px"}}
                    />
                </Modal>
                <Modal
                    title={`${this.state.cname}——24小时报警总数曲线图`}
                    visible={this.state.details }
                    onCancel={this.detailsCancel}
                    footer={null}
                    width={650}
                    maskClosable={false}
                >
                    <ReactEcharts
                        option={this.state.detailsOption}
                        style={{width:"100%",height:"350px"}}
                    />
                </Modal>
            </div>
        );
    }
}
export default UserEquipment;
