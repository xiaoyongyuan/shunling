import React,{Component} from "react";
import {Button,Icon,Modal,Form,Input,DatePicker,message} from "antd";
import Etable from "../../common/Etable";
import axios from "../../../axios/index";
import moment from "moment";
import "../../../style/ztt/css/scheduling.less";
import Utils from "../../../utils/utils";
const { confirm } = Modal;
class SchedulingIndex extends Component{
    constructor(props){
        super(props);
        this.state={
            schedulingList:[],//安保排班列表
            visible:false,//安保排班添加
            securityVis:false,//安保每日排班详情
            startValue: null,
            endValue: null,
            endOpen: false,
        };
        this.id=[];
    }
    componentDidMount() {
        this.getList();
    }
    getList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/scheduling/getlist",
            data:{
                status:-1,
                ondutyaccount:this.state.ondutyUser
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    schedulingList:res.data
                })
            }
        })
    };
    //值班人员
    hanleonduty=(e)=>{
        this.setState({
            ondutyUser:e.target.value
        });
    };
    //值班人员模糊查询
    hanleOndutySelect=()=>{
        this.getList();
    };
    //安保排班打开弹窗
    hanleSchedAdd=()=>{
      this.setState({
          visible:true
      })
    };
    //安保排班新增
    handleSchdulingSubmit=()=>{
        this.props.form.validateFields((err,values)=>{
            if(!err){
                let dutyInfor=[];//排班人员的数组
                dutyInfor.push({num:values.num,name:values.name});
                let names=values.name1,nums=values.num1;
                if(names && nums){
                    for(let i=0;i<names.length;i++){
                        for(let y=0;y<nums.length;y++){
                            if(i==y){
                                dutyInfor.push({num:nums[y],name:names[i]});
                            }
                        }
                    }
                }
                let params={
                    classes:values.classes,
                    bdate:moment(values.bdate).format('YYYY-MM-DD HH:mm:ss'),
                    edate:moment(values.edate).format('YYYY-MM-DD HH:mm:ss'),
                    userlist:dutyInfor
                };
                axios.ajax({
                    method:"post",
                    url:window.g.loginURL+"/api/scheduling/add",
                    data:params
                }).then((res)=>{
                    if(res.success){
                        message.success("添加成功！");
                        this.props.form.resetFields();
                        this.id=0;
                        this.setState({
                            visible:false
                        },()=>{
                            this.getList();
                        });
                    }
                });
            }
        })
    };
    hanleClose=()=>{
        this.props.form.resetFields();
        this.id=0;
        this.setState({
            visible:false
        })
    };
    //编辑到岗状态
    hanleArrivalState=(values)=>{
        let _this=this;
        confirm({
            title: '确认是否到岗打卡吗?',
            onOk() {
                axios.ajax({
                    method:"put",
                    url:window.g.loginURL+"/api/scheduling/update",
                    data:{
                        code:values.code,
                        status:1,
                    }
                }).then((res)=>{
                    if(res.success){
                        message.success("打卡成功！");
                        _this.getList();
                    }
                });
            }
        });
    };
    //安保每日排班详情
    hanleDutyDetail=(value)=> {
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/scheduling/getone",
            data:{code:value.code}
        }).then((res)=>{
            if(res.success){
                if(res.data){
                    let ondutyaccount=res.data.onduty.ondutyaccount;
                    this.setState({
                        securityVis:true,
                        shiftsSched:res.data.onduty.classes,
                        name:JSON.parse(ondutyaccount).name,
                        num:JSON.parse(ondutyaccount).num,
                        arrivalState:res.data.onduty.status,
                        bdate:res.data.Scheduling.bdate,
                        edate:res.data.Scheduling.edate,
                    });
                }
            }
        });
    };
    hanleDetailClose=()=>{
        this.setState({securityVis:false});
    };
    //日期范围选择
    disabledStartDate = startValue => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = endValue => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
    };

    onEndChange = value => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
    };
    //动态添加排班人员
    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { startValue, endValue, endOpen } = this.state;
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 16
            }
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <span>
               <Form.Item
                   label={`排班人员${k+1}`}
                   key={k}
                   {...formItemLayout}
               >
                {getFieldDecorator(`name1[${k}]`, {
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: "请输入排班人员名称！",
                    }]
                })(<Input placeholder="排班人员名称" />)}
            </Form.Item>
            <Form.Item label="    ">
                {getFieldDecorator(`num1[${k}]`, {
                    rules: [{
                        required: true,
                        whitespace: true,
                        message: "请输入排班人员手机号！",
                    }]
                })(<Input placeholder="排班人员手机号" />)}
                {<Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    style={{color:"red",position:"absolute",top:"10%",right:"-9%",zIndex:999}}
                    onClick={() => this.remove(k)}
                />}
            </Form.Item>
            </span>

        ));
        const userlist = [
            {
                title: "序号",
                align: "center",
                key: "code",
                render: (text, record, index) => index + 1
            },
            {
                title: "值班人员",
                dataIndex: "ondutyaccount",
                align: "center",
                render:(text)=>{
                    if(text){
                        return(JSON.parse(text).name)
                    }
                }
            },
            {
                title: "班次",
                dataIndex: "classes",
                align: "center"
            },
            {
                title: "开始时间",
                dataIndex: "bdate",
                align: "center",
            },{
                title: "结束时间",
                dataIndex: "edate",
                align: "center",
            }, {
                title: "联系电话",
                dataIndex: "iphone",
                align: "center",
                render:(text,record)=>{
                    if(record.ondutyaccount){
                        return(JSON.parse(record.ondutyaccount).num)
                    }
                }
            },
            {
                title: "操作",
                dataIndex: "oper",
                width:"20%",
                align: "center",
                render:(text,record)=>{
                    return(
                        <div >
                            <Button  onClick={()=>this.hanleDutyDetail(record)}>值班详情</Button>
                            {/*<Button type="primary" className="operationBtn" disabled={record.status===0?false:true}  onClick={()=>this.hanleArrivalState(record)}>到岗打卡</Button>*/}
                        </div>
                    )
                }
            }
        ];
        return(
            <div className="schedulingIndex">
                <div className="schedTop">
                    <Button type="primary" className="addGroup" onClick={this.hanleSchedAdd}>
                        <Icon type="plus" />
                        添加安保排班
                    </Button>
                    <Button type="primary" className="addGroup"><a href={window.g.loginURL+"/api/report/ondutyexport?companycode="+localStorage.getItem("companycode")}>排班记录导出</a></Button>
                    <Form layout="inline">
                        <Form.Item label="值班人员">
                           <Input onChange={this.hanleonduty} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.hanleOndutySelect}>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Etable
                    columns={userlist}
                    dataSource={this.state.schedulingList}
                />
                <Modal
                    title="添加安保排班"
                    visible={this.state.visible}
                    onCancel={this.hanleClose}
                    onOk={this.handleSchdulingSubmit}
                    maskClosable={false}
                >
                    <Form {...formItemLayout} style={{position:"relative"}}>
                        <Form.Item label="班次">
                            {getFieldDecorator('classes', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入班次！',
                                    }
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="排班人员">
                            {getFieldDecorator('name', {
                                rules: [{
                                        required: true,
                                        message: '请输入排班人员名称！',
                                    }]
                            })(<Input placeholder="排班人员名称" />)}
                        </Form.Item>
                        <Form.Item label="    ">
                            {getFieldDecorator('num', {
                                rules: [{
                                    required: true,
                                    message: '请输入排班人员手机号！',
                                }]
                            })(<Input placeholder="排班人员手机号" />)}
                            {
                                <Icon type="plus-circle"  style={{display:this.id<=5?"block":"none",color:"#1BA160",position:"absolute",top:"18%",right:"-13%",zIndex:999}} onClick={this.add} />
                            }
                        </Form.Item>
                        {formItems}
                        <Form.Item label="开始时间">
                            {getFieldDecorator('bdate', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择开始时间！',
                                    }
                                ],
                            })(
                                <DatePicker
                                    disabledDate={this.disabledStartDate}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    onChange={this.onStartChange}
                                    value={startValue}
                                    onOpenChange={this.handleStartOpenChange}
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="结束时间">
                            {getFieldDecorator('edate', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择结束时间！',
                                    }
                                ],
                            })(
                                <DatePicker
                                    disabledDate={this.disabledEndDate}
                                    format="YYYY-MM-DD HH:mm:ss"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    value={endValue}
                                    onOpenChange={this.handleEndOpenChange}
                                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="安保值班详情"
                    visible={this.state.securityVis}
                    onCancel={this.hanleDetailClose}
                    maskClosable={false}
                    width={340}
                    footer={null}
                >
                    <p><span>班次：</span>{this.state.shiftsSched}</p>
                    <p><span>值班人员：</span>{this.state.name}</p>
                    <p><span>开始时间：</span>{this.state.bdate}</p>
                    <p><span>结束时间：</span>{this.state.edate}</p>
                    <p><span>联系电话：</span>{this.state.num}</p>
                    <p><span>到岗状态：</span>{this.state.arrivalState===0?"未到岗":"到岗"}</p>
                </Modal>
            </div>
        )
    }
}
export default SchedulingIndex=Form.create({})(SchedulingIndex);