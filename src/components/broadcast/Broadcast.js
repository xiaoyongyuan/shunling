import React, { Component } from 'react';
import {Row,Col,Modal} from "antd";
import defenceImg from "../../style/ztt/imgs/defenceImg.png";
import nodata from "../../style/imgs/nodata.png";
import "./broadcast.less";
import axios from "../../axios/index";
import playBtn from "../../style/ztt/imgs/playBtn.png";
import Live from "../live/Live";
class Broadcast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            liveModel: false,
            liveList: []
        };
    }
    componentDidMount() {
      this.getList();
      this.setState({
          nowTime:Date.parse(new Date())
      })
    }
    getList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/camera/getlistforvideo",
            data:{}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    liveList:res.data
                });
            }
        })
    };
    hanleLive=(eid)=>{
        // this.props.history.push({pathname:"/main/live",state:{eid}});
        this.setState({
            liveModel:true,
            eid
        });
    };
    hanleLiveCancel=()=>{
        this.setState({
            liveModel:false
        })
    };
    componentWillUnmount() {
         if (this.player) {
             this.player.dispose();
         }
    }

    render() {
        return(
            <div className="broadcast">
                <Row className="title-broad">
                    <Col span={14}>视频直播</Col>
                </Row>
                <Row gutter={16} className="broContext">
                {
                    this.state.liveList.length>0?
                        [this.state.liveList.map((v,i)=>(
                        <Col key={i} xxl={4} xl={8} className="gutter-row">
                            <div className="gutter-box borderBot">
                                <img className="videoImg" src={v.basemap?window.g.imgUrl+v.basemap+"?t="+this.state.nowTime:defenceImg} alt="" />
                                <img className="videoBtn" src={playBtn} alt="" onClick={()=>this.hanleLive(v.eid)} />
                                <div className="broadcastBott">
                                    <span className="broCircle"/><span className="broFont">{v.name}</span>
                                </div>
                            </div>
                        </Col>
                    ))]:<div className="nodata"><img src={nodata} alt="" /></div>
                }
                </Row>
                <Modal
                    title="直播"
                    visible={this.state.liveModel}
                    width={850}
                    footer={null}
                    onCancel={this.hanleLiveCancel}
                    destroyOnClose={true}
                    centered={true}
                    maskClosable={false}
                >
                    <Live liveModel={this.state.liveModel} eid={this.state.eid} />
                </Modal>
            </div>
        );
    }
}

export default Broadcast;
