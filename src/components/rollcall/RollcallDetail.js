import React, { Component } from 'react';
import {Button,Input,Form} from "antd";
import {Link} from "react-router-dom";
import axios from "../../axios/index";
import "../../style/ztt/css/rollcallDetail.less";
class RollcallDetail extends Component{
    constructor(props) {
        super(props);
        this.state={
            name:"",
            rname:"",
            rpic:"",
            backPath:""
        };
    }
    componentDidMount() {
        if(this.props.query.rollcalldetailcode){
            this.hanleRollDtail(this.props.query.rollcalldetailcode);//点名详情
        }
        if(this.props.query.devid){
            this.hanleBaseMap(this.props.query.devid);//获取底图
        }
    }
    //获取底图
    hanleBaseMap=(devid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/getbackgroundpath",
            data:{devid:devid}
        }).then((res)=>{
            if(res.success){
                if(res.msg){
                    this.setState({
                        backPath:window.g.imgUrl+res.msg
                    })
                }
            }
        })
    };
    //点名详情
    hanleRollDtail=(detailcode)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rollcallgetOne",
            data:{code:detailcode}
        }).then((res)=>{
            if(res.success){
                if(res.data){
                    this.setState({
                        name:res.data.name,//设备名称
                        rname:res.data.rname,//对象名称
                        rpic:res.data.rpic?window.g.imgUrl+res.data.rpic.split("/var/www/html/znwj")[1]:"",//对象图
                        rzone:res.data.rzone,
                    },()=>{
                        this.hanleDraw();
                    });
                }
            }
        })
    };
    hanleDraw=()=>{
        const xi=404/704,
              yi=376/576;
        let item=JSON.parse(this.state.rzone);
        let ele = document.getElementById("rollcallObj");
        let area = ele.getContext("2d");
        area.clearRect(0, 0, 404, 376);
        area.strokeStyle='#fffd0a';
        area.lineWidth=1;
        area.beginPath();
        area.moveTo(parseInt(item[0][0]*xi),parseInt(item[0][1]*yi));
        area.lineTo(parseInt(item[1][0]*xi),parseInt(item[1][1]*yi));
        area.lineTo(parseInt(item[2][0]*xi),parseInt(item[2][1]*yi));
        area.lineTo(parseInt(item[3][0]*xi),parseInt(item[3][1]*yi));
        area.lineTo(parseInt(item[0][0]*xi),parseInt(item[0][1]*yi));
        area.stroke();
    };
    render() {
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 7}
        };
        return (
            <div className="rollcallDetail">
                <div className="taskTitle">
                    <span className="addObj">点名任务详情</span>
                    <Button type="primary"><Link to={"/main/rollcalltask"}>返回</Link></Button>
                </div>
                <div className="rollcallContext">
                    <Form {...formItemLayout}>
                        <Form.Item label="设备名称">
                            <Input value={this.state.name} disabled />
                        </Form.Item>
                        <Form.Item label="对象名称">
                            <Input value={this.state.rname} disabled />
                        </Form.Item>
                        <Form.Item label="区域">
                            <canvas id="rollcallObj" width="404px" height="376px" style={{backgroundImage:'url('+this.state.backPath+')',backgroundSize:'100% 100%'}} />
                        </Form.Item>
                        <Form.Item label="对象图">
                            <img className="objrpic" src={this.state.rpic} />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}
export default RollcallDetail;