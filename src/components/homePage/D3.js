import React, { Component } from 'react';
import * as d3 from "d3";
import "../../style/ztt/css/d3.less";
import shunImg from "../../style/ztt/imgs/slamera.png";
import sEqument from "../../style/ztt/imgs/sEqument.png";
class D3 extends Component {
	constructor(props) {
		super(props);
		this.state={
			raspberryList:[]
		};
		this.equment={};
		this.svg="";
		this.initX=2;
	}
	componentDidMount() {
		this.drawChart();
    }
    componentWillReceiveProps(nextProps, nextContext) {
		if(nextProps.raspberryList !== this.props.raspberryList){
			const {raspberryList}=nextProps;
			this.setState({
				raspberryList:raspberryList
			},()=>{
				this.hanleEqument();
			});
		}
	}
	drawChart() {
        let width = "120%";	//画布的宽度
		let height = 500;	//画布的高度
		let initY=28;
		this.svg= d3.select("#body")				//选择文档中的body元素
					.append("svg")				//添加一个svg元素
					.attr("width", width)		//设定宽度
					.attr("height", height);	//设定高度

		this.svg.append("rect")  //粉红色大矩形
			.attr("x",this.initX+"%")
			.attr("y",initY+"%")
			.attr("width","56%")
			.attr("height","28%")
			.attr("fill","#F486AE");

		this.svg.append("rect")  //绿红色小矩形，在粉色大矩形上面
				.attr("x",this.initX+"%")
				.attr("y",`${initY+7}%`)
				.attr("width","56%")
				.attr("height","12%")
				.attr("fill","#A5C935");
/*
		this.svg.append("image")
				.attr("xlink:href",sEqument)
				.attr("width",30)
				.attr("height",30)
				.attr("x","16%")
				.attr("y","44%");*/

		this.svg.append("rect")  //粉色小矩形，在左上侧
				.attr("x","16%")
				.attr("y","22%")
				.attr("width","10%")
				.attr("height","6%")
				.attr("fill","#F486AE");

		this.svg.append("rect")  //绿色大矩形
				.attr("x",`${this.initX+56}%`)
				.attr("y","22%")
				.attr("width","20%")
				.attr("height","40%")
				.attr("fill","#A5C935");

		this.svg.append("rect")  //绿色小矩形
				.attr("x",`${this.initX+56+20}%`)
				.attr("y","32%")
				.attr("width","6%")
				.attr("height","18%")
				.attr("fill","#A5C935");
	}
    hanleEqument=()=>{
		if(this.state.raspberryList){
			/*this.state.raspberryList.map((v,i)=>{
				this.equment=this.svg.append("image")
					.attr("xlink:href",shunImg)
					.attr("width",24)
					.attr("height",24)
					.attr("x",`${i*10+6}%`)
					.attr("y","36%");
					this.props.showHide(this.equment,v.cid);
				});*/

			this.state.raspberryList.map((v,i)=>{
				if(v.ecode=="JTJL00033"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+6}%`)
						.attr("y","26%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00284"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+20}%`)
						.attr("y","30%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00289"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+18}%`)
						.attr("y","44%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00282"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+22}%`)
						.attr("y","44%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00287"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+36}%`)
						.attr("y","48%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00051"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+36}%`)
						.attr("y","28%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00288"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+52}%`)
						.attr("y","42%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00342"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+52}%`)
						.attr("y","30%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00285"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+64}%`)
						.attr("y","36%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00044"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+74}%`)
						.attr("y","32%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00049"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+74}%`)
						.attr("y","38%");
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00040"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+58}%`)
						.attr("y","42%")
					this.props.showHide(this.equment,v.cid);
				}else if(v.ecode=="JTJL00344"){
					this.equment=this.svg.append("image")
						.attr("xlink:href",shunImg)
						.attr("width",24)
						.attr("height",24)
						.attr("x",`${this.initX+58}%`)
						.attr("y","30%")
					this.props.showHide(this.equment,v.cid);
				}
			});
		}
	};
    render() {
        return(
            <div className="d3Body">
                <div id="body" />
            </div>
        )
    }
}
export default D3;
