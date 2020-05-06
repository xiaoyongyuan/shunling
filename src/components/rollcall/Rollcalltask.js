import React,{Component} from "react";
import {Card, Icon, Form, Input, Button, Select,Empty} from "antd";
import "../../style/ztt/css/rolltack.less";
import scan from "../../style/imgs/scan.gif";
import axios from "../../axios/index";
import {Link} from "react-router-dom";
const Option = Select.Option;
class Rollcalltask extends Component{
    constructor(props) {
        super(props);
        this.state={
            taskList:[],
            plainOptions:[],
            rollBtn:false
        };
    }
    params={
        imgUrl:[]
    };
    componentDidMount() {
        this.getListRollcall();
        this.hanleEqument();
        this.hanleCallTask();
    }
    //设备
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
    //点名任务
    hanleCallTask=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rollcalloverview",
            data:{}
        }).then((res)=>{
            if(res.success){
                if(res.data){
                    this.setState({
                        lastrollcalltime:res.data.lastrollcalltime,
                        todayrollcallnum:res.data.todayrollcallnum,
                        rfinal:res.data.rfinal
                    })
                }
            }
        })
    };
    //点名状态
    hanleTaskState=()=>{
        if(this.state.rfinal===0){
            return "未点名";
        }else if(this.state.rfinal===-1){
            return "待处理";
        }else if(this.state.rfinal===1){
            return "正常";
        }else if(this.state.rfinal===2){
            return "报警";
        }
    };
    //点名任务
    getListRollcall=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rollcalllist",
            data:{
                rname:this.state.rnameTask,
                cid:this.state.cidTask
            },
        }).then((res)=>{
            if(res.success){
                res.data.dataInfo.map((v)=>{
                    if(v.rpic){
                        this.params.imgUrl.push(window.g.imgUrl+v.rpic.split("/var/www/html/znwj")[1]);
                    }else{
                        this.params.imgUrl.push("");
                    }
                });
                this.setState({
                    taskList:res.data.dataInfo
                },()=>{
                    this.draw();
                })
            }
        })
    };
    draw = () => { //画对象区域
        let ele = document.getElementsByTagName("canvas");
        const xi = 270 / 704,
            yi = 221 / 576;
        if(ele.length){
            for (let x = 0; x < ele.length; x++) {
                let item=JSON.parse(this.state.taskList[x].rzone);
                let that=ele[x];
                let area = that.getContext("2d");
                area.strokeStyle='#f00';
                area.lineWidth=1;
                area.beginPath();
                area.moveTo(parseInt(item[0][0]*xi),parseInt(item[0][1]*yi));
                item.map((elx,i)=>{
                    if(i>0){
                        area.lineTo(parseInt(item[i][0]*xi),parseInt(item[i][1]*yi));
                        if(i===3){
                            area.lineTo(parseInt(item[0][0]*xi),parseInt(item[0][1]*yi));
                        }
                        area.stroke();
                    }
                    return '';
                })
            }
        }
    };
    //点名搜索
    hanleTask=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    rnameTask:values.rname,
                    cidTask:values.cid,
                },()=>{
                    this.getListRollcall();
                })
            }
        });
    };
    //点名
    hanleRollCall=(params,i)=>{
        let taskList=this.state.taskList;
        taskList[i].scan=true;
        this.setState({
            taskList,
            rollcallcid:params.cid
        });
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rollcallsend",
            data:{
                eid:params.devid,
                rollcallid:params.rollcallcode,
                rollcallresultid:params.rhandle
            }
        }).then((res)=>{
            if(res.success){
              setTimeout(()=>{
                  this.hanleResult();
                  let taskList=this.state.taskList;
                  taskList[i].scan=false;
                  this.setState({
                      taskList
                  });
              },5000)
            }
        })
    };
    //树莓派 返回消息
    hanleResult=()=>{
      axios.ajax({
          method:"get",
          url:window.g.loginURL+"/api/rasp/rollcallresultlist",
          data:{
              cid:this.state.rollcallcid
          }
      }).then((res)=>{
          if(res){

          }
      })
    };
    render() {
        const {getFieldDecorator}=this.props.form;
        return(
            <div className="rolltack">
               {/* <Card title="点名任务">
                    <p className="task-title">今日自动点名次数：<span>{this.state.todayrollcallnum}次</span><span className="task-status">执行中</span></p>
                    <p className="task-title"> 上一次点名时间：<span>{this.state.lastrollcalltime}</span><span className="task-status">{this.hanleTaskState()}</span></p>
                </Card>*/}
                <div className="task-form">
                    <Form layout="inline" onSubmit={this.hanleTask}>
                        <Form.Item label="对象名">
                            {
                                getFieldDecorator("rname")(
                                    <Input />
                                )
                            }
                        </Form.Item>
                        <Form.Item label="设备">
                            {
                                getFieldDecorator("cid",{
                                    initialValue:""
                                })(
                                    <Select style={{ width: 120 }}>
                                        <Option value="" >所有</Option>
                                        {
                                            this.state.plainOptions.map((v)=>(
                                                <Option key={v.code} value={v.code} >{v.name}</Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" className="task-formBtn"><Link to="/main/addRollcallTask">新增</Link></Button>
                </div>
                   <div className="task-context">
                       {
                           this.state.taskList.length>0?
                           [this.state.taskList.map((v,i)=>(
                               <div className="task-border" key={i}>
                                   <p className="task-title"><span>{v.cameraname+"-"+v.cname}</span></p>
                                   <div className="task-img">
                                       <a href={"#/main/rollcallDetail?rollcalldetailcode="+v.rollcallcode+"&devid="+v.devid}><canvas id={"canvas"+(i+1)} width="270px" height="221px" style={{backgroundImage:'url('+this.params.imgUrl[i]+')',backgroundSize:"100% 100%"}} /></a>
                                       <img src={scan} className={v.scan?"scangif":"scanno"} alt="" />
                                   </div>
                                   <p className="rollcallTime"><span style={{color:v.rstatus ===1?"#545456":"red"}}>{v.rstatus ===1?"正常":"报警"}</span></p>
                                   <p className="rollcallBtn" onClick={()=>this.hanleRollCall(v,i)}><span>点名</span></p>
                               </div>
                           ))]:<div className="empty"><Empty /></div>
                       }
                   </div>
            </div>
        )
    }
}
export default Rollcalltask=Form.create()(Rollcalltask);
