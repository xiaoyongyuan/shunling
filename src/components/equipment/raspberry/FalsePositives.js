import React, { Component } from "react";
import {Button} from "antd";
import axios from "../../../axios/index";
import {message} from "antd";
import "../../../style/ztt/css/FalsePositives.less";
class FalsePositives extends Component {
    state={
        clicknum:0,//点击数
        present:[],//临时的误报对象数组
        areaList:[],//所有的误报对象
        everyRegion:[],//每个误报对象
        btnvis:true,//清除画布按钮是否可用 true不可用 false可用
        deleteif:true,//是否是删除误报对象操作
        multipleShow:[]
    };
    componentDidMount() {
        if(this.props.camerdat.equipData.eid){
            let params={};
            params.specialfield={};
            params.devid=this.props.camerdat.equipData.eid;
            params.type=2;
            this.PositivesMultiple(params);
        }
    }

    //误报对象提交 type=1  提交点位  type=2 查看点位
    hanlePositives=()=>{
        if(this.state.areaList.length!==0){
            if(this.props.camerdat.equipData.eid){
                let field={};
                if(this.state.multipleShow){
                    field.specialfield=JSON.stringify({"areaList":[...this.state.multipleShow,...this.state.areaList]});
                }else{
                    field.specialfield=JSON.stringify({"areaList":this.state.areaList});
                }
                field.devid=this.props.camerdat.equipData.eid;
                field.type=1;
                this.setState({deleteif:false});
                this.PositivesMultiple(field);
            }
        }else{
            message.info("请您在左边的图片上画误报对象");
        }
    };
    //误报删除
    hanlePositivesDelete=()=>{
        if(this.props.camerdat.equipData.eid){
            let params={};
            params.specialfield=JSON.stringify({});
            params.devid=this.props.camerdat.equipData.eid;
            params.type=1;
            this.setState({deleteif:true});
            if(this.state.multipleShow && this.state.multipleShow.length !==0 || this.state.areaList.length!==0){
                this.PositivesMultiple(params);
            }else{
                message.info('暂无误报点位')
            }
        }
    };
    //查看点位
    PositivesMultiple =(field)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/camera/specialpoint",
            data:field
        }).then((res)=>{
            if(res.success){
                if(res.msg && res.msg !=='请求成功！'){
                    let multipleList=JSON.parse(res.msg);
                    this.setState({
                        multipleShow:multipleList.areaList
                    },()=>{
                        this.MultipleDraw();
                    })
                }
                if(field.type===1){
                    this.setState({btnvis:true});
                    if(this.state.deleteif){
                        message.success("误报点位删除成功！");
                        this.setState({
                            multipleShow:[],
                            areaList:[]
                        },()=>{
                            let ele = document.getElementById("falseCanvas");
                            let area = ele.getContext("2d");
                            area.clearRect(0,0,704,576);//清除之前的绘图
                        })
                    }else{
                        message.success("误报点位添加成功！");
                        message.info("请设置布防时间！");
                    }

                }
            }
        })
    };
    //绘制误报点位
    MultipleDraw=()=>{
        let ele = document.getElementById("falseCanvas");
        let area = ele.getContext("2d");
        area.strokeStyle='#447cff';
        area.lineWidth=3;
        area.beginPath();
        let multipleShow=this.state.multipleShow;
        if(multipleShow && multipleShow.length!==0){
            for(let i=0;i<multipleShow.length;i++){
                area.moveTo(multipleShow[i][0][0],multipleShow[i][0][1]);
                for(let y=0;y<multipleShow[i].length;y++){
                    if(y>0){
                        area.lineTo(multipleShow[i][y][0],multipleShow[i][y][1]);
                        if(y===3){
                            area.lineTo(multipleShow[i][0][0],multipleShow[i][0][1]);
                        }
                    }
                    area.stroke();
                }
            }
        }
    };
    //获取鼠标在画布的坐标
    getcoord = (coords) => {
        let ele = document.getElementById("falseCanvas");
        let canvsclent = ele.getBoundingClientRect();
        let x= coords.clientX - canvsclent.left * (ele.width / canvsclent.width);
        let y= coords.clientY - canvsclent.top * (ele.height / canvsclent.height);
        let pre=[x,y];
        return pre
    };
    //绘制区域
    draw = () => {
        let item=this.state.present;//当前画的误报对象
        let ele = document.getElementById("falseCanvas");
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
          });
    };
    //绘制多个误报对象区域
    Multiple=()=>{
        let ele = document.getElementById("falseCanvas");
        let area = ele.getContext("2d");
        area.strokeStyle='#ff0';
        area.lineWidth=3;
        area.beginPath();
        let positivesList=this.state.areaList;//多个误报对象三维数组
        if(positivesList.length!==0){
           for(let i=0;i<positivesList.length;i++){
                area.moveTo(positivesList[i][0][0],positivesList[i][0][1]);
                for(let y=0;y<positivesList[i].length;y++){
                    if(y>0){
                        area.lineTo(positivesList[i][y][0],positivesList[i][y][1]);
                        if(y===3){
                            area.lineTo(positivesList[i][0][0],positivesList[i][0][1]);
                        }
                    }
                    area.stroke();
                }
            }
        }
    };
    //当松开鼠标按钮时添加误报对象
    handleDrawUp=()=>{
        if(this.state.present.length===3 && this.state.clicknum===3){
            let areaList=this.state.areaList;
            areaList.push(this.state.present);
            this.setState({
                areaList,
                btnvis:false
            });
        }
    };
    //点击获取鼠标坐标点
    clickgetcorrd=(e)=>{
        if(this.state.present.length===4){
            this.draw();
        }else {
            let getcord = this.getcoord(e); //获取点击的坐标
            let precorrd = this.state.present;
            precorrd.push(getcord);
            this.setState({
                clicknum: this.state.clicknum + 1,
                present: precorrd
            });
        }
    };
    drawmove =(e)=>{ //移动
        if(this.state.clicknum!==0){
            let ele = document.getElementById("falseCanvas");
            let area = ele.getContext("2d");
            let item=this.state.present;
            let getcord=this.getcoord(e);
            area.clearRect(0,0,704,576);//清除之前的绘图
            if(this.state.clicknum===4){//区域完成
                this.Multiple();//绘制多个误报对象
                this.draw();//绘制临时的误报对象
                this.MultipleDraw();
                this.setState({
                    clicknum: 0,
                    present:[]
                })
            }else{
                this.Multiple();
                this.draw();
                this.MultipleDraw();
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
    //清除画布
    clearCanvas=()=>{
        if(this.state.areaList.length !==0){
            let ele = document.getElementById("falseCanvas");
            let area = ele.getContext("2d");
            area.clearRect(0,0,704,576);//清除之前的绘图
            this.setState({
                areaList:[],
                btnvis:true
            },()=>{
                this.MultipleDraw();
            })
        }
    };

    render() {
        return(
            <div className="positives">
                <canvas
                    width="704px"
                    height="576px"
                    id="falseCanvas"
                    style={{
                        backgroundImage: "url(" + `${window.g.imgUrl+this.props.camerdat.equipData.basemap}` + ")",
                        backgroundSize: "100% 100%"
                    }}
                    onClick={this.clickgetcorrd}
                    onMouseMove={this.drawmove}
                    onMouseUp={this.handleDrawUp}
                />
                <div className="falseBtns">
                    <div className="falseOper">
                        <p>操作说明：</p>
                        <p>1、误报添加：请先在左边图片上，鼠标点击并移动绘制误报对象区域，形成矩形后点击右下方"误报添加"按钮。</p>
                        <p>2、误报删除：直接点击右下方"误报删除"按钮，即可删除左边图片上所有的误报对象区域。</p>
                        <p>3、清除画布：当左边图片上无暂未提交的误报对象区域（黄色线条区域）时，"清除画布"按钮不可点击；点击"清除画布"按钮后会清除当前左边图片上暂未提交的误报对象区域，不会清除已提交的误报对象区域。</p>
                    </div>
                    <div>
                        <Button type="primary" disabled={this.state.btnvis} onClick={this.clearCanvas}>清除画布</Button>
                        <Button type="primary" className="falseAdd" onClick={this.hanlePositives}>误报添加</Button>
                        <Button type="danger" onClick={this.hanlePositivesDelete}>误报删除</Button>
                    </div>
                </div>
            </div>
        )
    }
}
export default FalsePositives;