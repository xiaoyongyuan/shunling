import React, { Component } from 'react';
import {Button, Form, Input,Select,message} from "antd";
import {Link} from "react-router-dom";
import "../../style/ztt/css/addTask.less";
import nopic from "../../style/imgs/nopic.png";
import axios from "../../axios/index";
const Option=Select.Option;
class AddRollcallTask extends Component {
    constructor(props) {
        super(props);
        this.state={
            plainOptions:[],
            imgsrc:nopic,
            present:[], //绘制的区域
            clicknum:0,
        };
    }
    componentDidMount() {
        this.hanleEqument();
    }
    //巡更
    hanleEqument = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/camera/getlistSelect",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    plainOptions: res.data
                })
            }
        })
    };
    handleChange=(value)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/getbackgroundpath",
            data:{devid:value}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    imgsrc:window.g.imgUrl+res.msg,
                    cid: value,
                })
            }
        })
    };
    draw = () => { //绘制区域
        let item=this.state.present;
        let ele = document.getElementById("time_graph_canvas");
        let area = ele.getContext("2d");
        area.strokeStyle='#ff0';
        area.lineWidth=3;
        area.beginPath();
        area.moveTo(item[0][0],item[0][1]);
        item.map((elx,i)=>{
            if(i>0){
                area.lineTo(item[i][0],item[i][1]);
                if(i===3){
                    area.lineTo(item[0][0],item[0][1]);
                }
                area.stroke();
            }
            return '';
        })
    };
    getcoord = (coords) => { //获取坐标
        let ele = document.getElementById("time_graph_canvas");
        let canvsclent = ele.getBoundingClientRect();
        let x= parseInt(coords.clientX - canvsclent.left * (ele.width / canvsclent.width));
        let y= parseInt(coords.clientY - canvsclent.top * (ele.height / canvsclent.height));
        let pre=[x,y];
        return pre
    };
    hanleTask=(e)=>{
        e.preventDefault();
        if(this.state.present.length<4){
            message.warn('请绘制点名区域！');
            return;
        }
        this.props.form.validateFields((errs,values)=>{
            if(!errs){
                let code="";
                this.state.plainOptions.map((v)=>{
                    if(values.cid === v.eid){
                        code=v.code;
                    }
                });
                axios.ajax({
                    method:"post",
                    url:window.g.loginURL+"/api/rasp/rollcalladd",
                    data:{
                        rname:values.rname,
                        cid:code,
                        rzone:JSON.stringify(this.state.present)
                    }
                }).then((res)=>{
                    if(res.success){
                        message.success("点名对象添加成功！")
                    }
                });
            }
        })
    };
    clickgetcorrd =(e)=>{ //点击画围界
        if(this.state.present.length<4 && this.state.imgsrc && this.state.cid){
            if(this.state.present.length !==4){
                let getcord=this.getcoord(e); //获取点击的坐标
                let precorrd=this.state.present;
                precorrd.push(getcord);
                this.setState({
                    clicknum: this.state.clicknum+1,
                    present:precorrd
                });
            }
        }else{
            if(!this.state.present.length && !this.state.cid){
                message.warn('请先选择摄像头');
            }
        }
    };
    drawmove =(e)=>{ //移动
        if(this.state.clicknum){
            let ele = document.getElementById("time_graph_canvas");
            let area = ele.getContext("2d");
            let item=this.state.present;
            let getcord=this.getcoord(e);
            area.clearRect(0,0,704,576);//清除之前的绘图
            if(this.state.clicknum===4){//区域完成
                this.draw();
                this.setState({
                    clicknum: 0
                });
            }else{
                this.draw();
                area.strokeStyle='#ff0';
                area.lineWidth=3;
                area.beginPath();
                area.moveTo(item[item.length-1][0],item[item.length-1][1]);
                area.lineTo(getcord[0],getcord[1]);
                area.stroke();
                area.closePath();
            }

        }

    };
    cancelarea =()=>{ //重绘围界
        let ele = document.getElementById("time_graph_canvas");
        let area = ele.getContext("2d");
        area.clearRect(0,0,704,576);
        this.setState({
            clicknum: 0,
            present:[]
        });
    };
    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 7}
        };
        const formItemLayout1 = {
            wrapperCol: { offset: 5,span: 6}
        };
        return (
            <div className="addRollcallTask">
                <div className="taskTitle">
                    <span className="addObj">添加点名对象</span>
                    <Link to="/main/rollcalltask"><Button type="primary">返回</Button></Link>
                </div>
                <Form {...formItemLayout} className="taskForm" onSubmit={this.hanleTask}>
                    <Form.Item label="对象名称">
                        {getFieldDecorator('rname', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入对象名称！',
                                }
                            ],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="摄像头">
                        {getFieldDecorator('cid', {
                            rules: [{required: true, message: '请选择摄像头！',}],
                        })(
                            <Select onChange={this.handleChange}  placeholder="请选择摄像头">
                                {
                                    this.state.plainOptions.map((v)=>{
                                        return(
                                            <Option key={v.code} value={v.eid}>{v.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                            )}
                    </Form.Item>
                    <Form.Item label="区域">
                       <canvas id="time_graph_canvas" width="704px" height="576px" style={{backgroundImage:'url('+this.state.imgsrc+')',backgroundSize:'100% 100%'}} onClick={this.clickgetcorrd} onMouseMove={this.drawmove}  />
                    </Form.Item>
                    <Form.Item {...formItemLayout1}>
                        <Button type="primary" htmlType="submit" className="taskBtn">确认</Button>
                        <Button  className="taskBtn" onClick={this.cancelarea}>重绘</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
export default AddRollcallTask=Form.create()(AddRollcallTask);