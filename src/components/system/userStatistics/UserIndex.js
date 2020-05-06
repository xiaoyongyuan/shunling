import React, { Component } from 'react';
import "../../../style/ztt/css/userIndex.less";
import ReactEcharts from 'echarts-for-react';
import {Link} from "react-router-dom";
import echarts from 'echarts';
import { DatePicker,Button,Modal } from 'antd';
import axios from "../../../axios/index";
import moment from "moment";
const { MonthPicker } = DatePicker;
class UserIndex extends Component{
    constructor(props) {
        super(props);
        this.state = {
            currentDay: '',
            currentMonth: '',
            currentYear: '',
            dayList: [],
            alarmList:[],
            sameMonth:false,
            option:{},
        };
        this.initCalendar = this.initCalendar.bind(this);
    }
    componentDidMount() {
        this.initCalendar();
    }
    hanleCalendar=(nowDate)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/report/monthalacount",
            data:{
                month:moment(nowDate).format("MM")
            }
        }).then((res)=>{
            if(res.success){
                let datasLine=[];
                let lineData=[];
                res.data.map((v)=>{
                    datasLine.push(moment(v.Dayly).format("DD"));
                    lineData.push(v.Totalcount);
                    this.setState({datasLine,lineData})
                });
                this.setState({
                    alarmList:res.data
                })
            }
        })
    };
    // 初始化日历
    initCalendar(currentDate) {
        let nowDate = currentDate ? currentDate : new Date();
        this.setState({nowDate});
        this.hanleCalendar(nowDate);
    }
    sameMonthShow=()=>{
        this.hanleEverDay();
        this.setState({
            sameMonth:true
        })
    };
    sameMonthCancel=()=>{
        this.setState({
            sameMonth:false
        })
    };
    //每天报警总数的折线图表
    hanleEverDay=()=>{
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                name:"日",
                type: 'category',
                boundaryGap: false,
                data: this.state.datasLine
            },
            yAxis: {
                name:"报警次数",
                type: 'value'
            },
            series: [{
                data:this.state.lineData,
                type: 'line',
                lineStyle:{
                    color:"#006ee2"
                },
                symbol:'none',
                smooth:true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#006ee2'
                            },
                                {
                                    offset: 1,
                                    color: '#006ee2'
                                }
                            ])
                    }
                }
            }]
        };
        this.setState({option})
    };
    onChangeTime=(date)=>{
        this.initCalendar(date._d)
    };
    render() {
        return(
            <div className="userIndex">
                <div className="todayTime">{moment(this.state.nowDate).format("YYYY")}年{moment(this.state.nowDate).format("MM")}月</div>
                <div className="calendar-body">
                    <div className = 'calendar-header'>
                        <div className = 'calendar-header-left'>
                            <MonthPicker onChange={this.onChangeTime} />
                        </div>
                        <div className = 'calendar-header-right'>
                            <Button className="chart" onClick={this.sameMonthShow}>图表展示</Button>
                            <Button type="primary" ><a href={window.g.loginURL+"/api/report/monthalacountdownload?month="+moment(this.state.nowDate).format("MM")}>数据导出</a></Button>
                        </div>
                    </div>
                    <div className = 'day-container'>
                        {
                            this.state.alarmList.map( (dayObject, index) => {
                            return (
                                <Link to={"/main/userEquipment?dayTime="+dayObject.Dayly}
                                          key = {index} className = {`day`}>
                                    <div className="dayTime">
                                        <span className="dayNumber">{moment(dayObject.Dayly).format("DD")}</span>
                                        <span className="dayFont">日</span>
                                    </div>
                                    {
                                        dayObject.Totalcount==0 && dayObject.Unhandle==0  && dayObject.Confirm==0?"":
                                            <div className="dayAlarm">
                                                <p className="dayAlarm-item confirm overflow" title={dayObject.Totalcount+"次总报警"}><span className="alarmNum" >{dayObject.Totalcount}</span><span className="alarmFont">次总报警</span></p>
                                                <p className="dayAlarm-item untreated overflow" title={dayObject.Unhandle+"次未处理报警"}><span className="alarmNum" >{dayObject.Unhandle}</span><span className="alarmFont">次未处理报警</span></p>
                                                <p className="dayAlarm-item total overflow" title={dayObject.Confirm+"次确认报警"}><span className="alarmNum" >{dayObject.Confirm}</span><span className="alarmFont">次确认报警</span></p>
                                                <p className="dayAlarm-item neglect overflow" title={dayObject.Neglect+"次虚警报警"}><span className="alarmNum" >{dayObject.Neglect}</span><span className="alarmFont">次虚警报警</span></p>
                                            </div>
                                        
                                    }
                                </Link>
                            )
                        })}
                    </div>
                </div>
                <Modal
                    title={`${moment(this.state.nowDate).format("YYYY")}年${moment(this.state.nowDate).format("MM")}月每天报警总数曲线图`}
                    visible={this.state.sameMonth}
                    onCancel={this.sameMonthCancel}
                    footer={null}
                    maskClosable={false}
                    width={650}
                >
                    <ReactEcharts
                        option={this.state.option}
                        style={{width:"100%",height:"350px"}}
                    />
                </Modal>
            </div>
        )
    }
}
export default UserIndex;
