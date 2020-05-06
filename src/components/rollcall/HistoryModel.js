import React,{Component} from "react";
import axios from "../../axios";
class HistoryModel extends Component{
    constructor(props) {
        super(props);
        this.state={
            historyName:""
        }
    }
    componentDidMount() {
      if(this.props.historyCode){
          this.hanleHistoryDetail(this.props.historyCode);
      }
    }
    //点名记录详情
    hanleHistoryDetail=(params)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rollcallresultgetone",
            data:{
                code:params
            }
        }).then((res)=>{
            if(res.success){
                if(res.data.rzone){
                    this.hanleDraw(res.data.rzone);
                }
                this.setState({
                    historyName:res.data.rname==undefined ||res.data.rname==null?" ":res.data.rname,
                    historyeid:res.data.eid==undefined ||res.data.eid==null?" ":res.data.eid,
                    resultdate:res.data.resultdate==undefined ||res.data.resultdate==null?" ":res.data.resultdate,
                    historyImg:res.data.rpic?window.g.imgUrl+res.data.rpic.split("/var/www/html/znwj")[1]:"",
                    historyRfinal:res.data.rfinal
                })
            }
        });
    };
    //绘制防区
    hanleDraw=(params)=>{
        let ele = document.getElementById('historyCan');
        let area = ele.getContext('2d');
        area.clearRect(0, 0, 604, 476); //清除之前的绘图
        const xi = 604 / 704,
            yi = 476 / 576;
        area.lineWidth = 1;
        if (params) {
            let list=JSON.parse(params);
            area.strokeStyle='#ff0';
            area.beginPath();
            area.moveTo(parseInt(list[0][0] * xi), parseInt(list[0][1] * yi));
            area.lineTo(parseInt(list[1][0] * xi), parseInt(list[1][1] * yi));
            area.lineTo(parseInt(list[2][0] * xi), parseInt(list[2][1] * yi));
            area.lineTo(parseInt(list[3][0] * xi), parseInt(list[3][1] * yi));
            area.lineTo(parseInt(list[0][0] * xi), parseInt(list[0][1] * yi));
            area.stroke();
            area.closePath();
        }
    };
    rdinal=(type)=>{
        if(type === 0){
            return <span className="untreated">未点名</span>;
        }else if(type === -1){
            return <span className="warning">待处理</span>;
        }else if(type === 1){
            return <span className="normal">正常</span>;
        }else if(type === 2){
            return <span className="alarm">报警</span>;
        }
    };
    render() {
        return (
            <div className="historyModel">
                <p className="historyTitle"><span>{this.state.historyName}</span><span>{this.state.historyeid}</span></p>
                <canvas id="historyCan" width="604px" height="476px" style={{backgroundImage:'url('+this.state.historyImg+')',backgroundSize:"100% 100%"}} />
                <p className="historyTime"><span>{this.state.resultdate}</span><span>{this.rdinal(this.state.historyRfinal)}</span></p>
            </div>
        );
    }
}
export default HistoryModel;