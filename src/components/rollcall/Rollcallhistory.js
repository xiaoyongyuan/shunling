import React,{Component} from "react";
import {Form,DatePicker,Input,Select,Button,Row,Col,Pagination,Empty,Modal} from "antd";
import "../../style/ztt/css/rollcallHistory.less";
import errs from "../../style/ztt/imgs/errs.png";
import axios from "../../axios/index";
import HistoryModel from "./HistoryModel";
const {RangePicker} = DatePicker;
const {Option}=Select;
class Rollcallhistory extends Component{
    constructor(props) {
        super(props);
        this.state={
            rollhistoryList:[],
            plainOptions:[],
            totalcount:0,
            visible:false
        };
    }
    params={
        pbdate:'',
        pedate:'',
        rname:"",
        cid:"",
        pageindex:1,
        pagesize:12
    };
    componentDidMount() {
        this.getList({});
        this.hanleEqument();
    }
    //点名列表
    getList=()=>{
        if( this.params.pbdate === '' &&  this.params.pedate === ''){
            delete this.params.pbdate;
            delete this.params.pedate;
        }
      axios.ajax({
          method:"get",
          url:window.g.loginURL+"/api/rasp/rollcallresultlist",
          data:this.params
      }).then((res)=>{
          if(res.success){
              this.params.pagesize=res.pagesize;
              this.setState({
                  rollhistoryList:res.data,
                  totalcount:res.totalcount,
              })
          }
      })
    };
    hanlePageSize = (page) => { //翻页
        this.params.pageindex=page;
        this.getList();
    };
    hanleHistory=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.params.pbdate=values.date && values.date.length?values.date[0].format("YYYY/MM/DD HH:mm:ss"):'';
                this.params.pedate=values.date && values.date.length?values.date[1].format("YYYY/MM/DD HH:mm:ss"):'';
                this.params.rname=values.rname;
                this.params.cid=values.cid;
                if( this.params.pbdate === '' &&  this.params.pedate === ''){
                    delete this.params.pbdate;
                    delete this.params.pedate;
                }
                this.getList();
            }
        });
    };
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
    rdinal=(type)=>{
        if(type === 0){
            return <span className="untreated">未识别出结果</span>;
        }else if(type === -1){
            return <span className="warning">待处理</span>;
        }else if(type === 1){
            return <span className="normal">正常</span>;
        }else if(type === 2){
            return <span className="alarm">报警</span>;
        }
    };
    //点名记录详情
    hanleHistoryDetail=(params)=>{
        this.setState({
            historyCode:params,
            visible:true
        })
    };

    handleCancel=()=>{
        this.setState({
            visible:false
        })
    };
    render() {
        const { getFieldDecorator} = this.props.form;
        return(
            <div className="rollcallhistory">
                <Form layout="inline" onSubmit={this.hanleHistory}>
                    <Form.Item label="日期">
                        {
                            getFieldDecorator("date")(
                                <RangePicker
                                    placeholder={['开始时间', '结束时间']}
                                    format="YYYY/MM/DD HH:mm:ss"
                                    showTime
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item label="对象名称">
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
                        <Button type="primary" htmlType="submit">确定</Button>
                    </Form.Item>
                </Form>
                <div className="gutter-example">
                    <Row gutter={[32,32]}>
                        {
                            this.state.rollhistoryList.length>0?
                                [this.state.rollhistoryList.map((v,i)=>(
                                <Col xxl={8} xl={12} lg={24}  key={i} className="gutter-row">
                                    <div className="gutter-box" onClick={()=>this.hanleHistoryDetail(v.code)}>
                                        <div className="rollHist-img"><img src={v.rpic?window.g.imgUrl+v.rpic.split("/var/www/html/znwj")[1]:errs} alt=""/></div>
                                        <div className="rollHist-con">
                                            <p className="roll-context">{v.rname==undefined ||v.rname==null?" ":v.rname}</p>
                                            <p className="roll-context">{v.eid==undefined ||v.eid==null?" ":v.eid}</p>
                                            <p className="roll-context">{v.resultdate==undefined ||v.resultdate==null?" ":v.resultdate}</p>
                                            <p className="roll-context">{this.rdinal(v.rfinal)}</p>
                                        </div>
                                    </div>
                                </Col>
                            ))]:<div className="empty"><Empty /></div>
                        }
                    </Row>
                    <Pagination
                        hideOnSinglePage={true}
                        defaultCurrent={this.params.pageindex}
                        current={this.params.pageindex}
                        total={this.state.totalcount}
                        pageSize={this.params.pagesize}
                        onChange={this.hanlePageSize}
                        className="rollPage"
                        style={{display:this.state.rollhistoryList.length>0?"block":"none"}}
                    />
                </div>
                <Modal
                    title="点名记录详情"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    footer={null}
                    width={650}
                    className="historyModel"
                    destroyOnClose={true}
                >
                    <HistoryModel historyCode={this.state.historyCode} />
                </Modal>
            </div>
        )
    }
}
export default Rollcallhistory=Form.create()(Rollcallhistory);
