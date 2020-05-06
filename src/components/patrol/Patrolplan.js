import React from 'react';
import {Row, Col, Button, Icon, Card, Modal, Form, Input, TimePicker, Checkbox, message} from 'antd';
import "../../style/ztt/css/patrolplan.less";
import axios from "../../axios/index"
import moment from "moment";

const CheckboxGroup = Checkbox.Group;

class PatrolPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            operType: 0,
            plainOptions: [],
            patrolList: []
        };
    }

    componentDidMount() {
        this.hanleEqument();//巡更列表
        this.hanlePatrolList(); //巡更设备
    }

    //巡更列表
    hanlePatrolList = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/rasp/patrollist",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    patrolList: res.data
                })
            }
        })
    };
    //巡更设备
    hanleEqument = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/camera/getlistSelect",
            data: {}
        }).then((res) => {
            let equList = [];
            if (res.success) {
                res.data.map((v) => {
                    equList.push({value: v.code, label: v.name});
                });
                this.setState({
                    plainOptions: equList
                })
            }
        })
    };
   //新增1 编辑2
    hanlePlan = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errs, values) => {
            let params = {
                pteam: values.pteam,
                pbdate: values.pbdate.format("HH"),
                pedate: values.pedate.format("HH"),
                clist: values.clist.join(","),
            };
            if (!errs) {
                if (this.state.operType === "1") {
                    axios.ajax({
                        method: "post",
                        url: window.g.loginURL + "/api/rasp/patroladd",
                        data: params
                    }).then((res) => {
                        if (res.success) {
                            this.hanlePatrolList();
                            this.setState({
                                visible: false,
                            });
                            message.success("添加巡更班次成功！");
                            this.props.form.resetFields();
                        }
                    })
                } else if (this.state.operType === "2") {
                    axios.ajax({
                        method: "put",
                        url: window.g.loginURL + "/api/rasp/patrolupdate",
                        data: {
                            code:this.state.editCode,
                            pteam: values.pteam,
                            pbdate: values.pbdate.format("HH"),
                            pedate: values.pedate.format("HH"),
                            clist: values.clist.join(","),
                        }
                    }).then((res) => {
                        if (res.success) {
                            this.props.form.resetFields();
                            message.success("编辑巡更班次成功！");
                            this.setState({
                                visible: false,
                            },()=>{
                                this.hanlePatrolList();
                            });
                        }
                    })
                }
            }
        });
    };
    //新增弹窗、编辑回填
    hanleAddEdit = (type, values,i) => {
        if(type==="1"){
            if (this.state.patrolList.length >= 6) {
                message.warning("最多可以新增六个巡更");
            } else {
                this.setState({
                    visible: true,
                    operType: type
                });
            }
        }else if(type==="2"){
            axios.ajax({
                method: "get",
                url: window.g.loginURL + "/api/rasp/patrolgetone",
                data: {code: values.code}
            }).then((res) => {
                if (res.success) {
                    this.setState({
                        visible: true,
                        operType: type,
                        index:i,
                        editCode:values.code
                    });
                    this.props.form.setFieldsValue({
                        pteam: res.data.pteam,
                        pbdate: moment(`${res.data.pbdate}`, 'HH'),
                        pedate: moment(`${res.data.pedate}`, 'HH'),
                        clist: res.data.clist.toString().split(",").map(Number),
                    });
                }
            })
        }
    };
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false
        })
    };
    //删除
    hanlePlanDel = (values, i) => {
        const _this = this;
        Modal.confirm({
            title: '提示信息',
            content: '确认删除该信息吗？',
            onOk() {
                axios.ajax({
                    method: "delete",
                    url: window.g.loginURL + "/api/rasp/patroldel",
                    data: {
                        code: values.code
                    }
                }).then((res) => {
                    if (res.success) {
                        let patrolList = _this.state.patrolList;
                        patrolList.splice(i, 1);
                        _this.setState({patrolList});
                        message.success("删除巡更班次成功！");
                    }
                })
            }
        });
    };
    //巡更计划
    hanleMission=()=>{
        axios.ajax({
            method:"post",
            url:window.g.loginURL+"/api/rasp/patrolresultadd",
            data:{}
        }).then((res)=>{
            if(res.success){
                message.success("巡更计划成功！");
            }else{
                message.error("巡更计划失败！");
            }
        })
    };
    bgcolor = (i) => {
        if (i === 0) {
            return 'bg1'
        } else if (i === 1) {
            return 'bg2'
        } else if (i === 2) {
            return 'bg3'
        } else if (i === 3) {
            return 'bg4'
        } else if (i === 4) {
            return 'bg5'
        } else if (i === 5) {
            return 'bg6'
        }
    };
    hanleStart = (time, timeString) => {
        this.setState({
            timeList: time,
            timeString: timeString
        });
    };
    hanleEnd = (time, timeString) => {
        this.setState({
            timeList2: time,
            timeString: timeString
        });
    };
    newArray = (start, end) => {
        let result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    disabledHours = () => {
        let times = moment(this.state.timeList).format("HH");
        let hours = this.newArray(0, 60);
        if (times === '00') {
            hours.splice(times, 24 - times);
        } else {
            hours.splice(parseInt(times) + 1, 24 - times);
        }
        return hours;
    };
    cameralist=(values)=>{
        let arr=JSON.parse(values);
        return  arr.join(',');
    };
    render() {
        const format = 'HH';
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 16},
        };
        return (
            <div className="patrolPlan">
                <Card className="card-center"
                      title="最多可以新增六个巡更"
                      extra={<div className="card-planBtn">
                          <Button type="primary" style={{marginRight:"20px"}} onClick={() => this.hanleAddEdit("1")}><Icon type="plus" />添加</Button>
                          <Button type="primary" onClick={this.hanleMission}>生成巡更计划</Button>
                      </div>}
                >
                    <div className="gutter-example">
                        <Row gutter={[32, 32]}>
                            {
                                this.state.patrolList.map((v, i) => {
                                    return (
                                        <Col key={i} xxl={6} xl={12} className="gutter-row plan-card">
                                            <div className="gutter-box plan-context">
                                                <div className="plan-circle">
                                                    <span
                                                        className={"plan-title " + this.bgcolor(i)}>{v.pteam.substring(0, 2)}</span>
                                                </div>
                                                <div className="plan-time">
                                                    <p className="planTime-nike">{v.pbdate}:00--{v.pedate}:00</p>
                                                    <p className="planTime-nike">{this.cameralist(v.cameralist)}</p>
                                                </div>
                                                <div className="plan-oper">
                                                    <span className="plan-icon plan-edit"
                                                          onClick={() => this.hanleAddEdit("2", v,i)}><Icon
                                                        type="edit"/>&nbsp;编辑</span>
                                                    <span className="plan-icon plan-delete"
                                                          onClick={() => this.hanlePlanDel(v, i)}><Icon
                                                        type="delete"/>&nbsp;删除</span>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </Card>
                <Modal
                    title={this.state.operType === "1" ? "新增" : "编辑"}
                    visible={this.state.visible}
                    footer={<Button type="primary" onClick={this.hanlePlan}>保存</Button>}
                    maskClosable={false}
                    onCancel={this.handleCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="班次名称">
                            {
                                getFieldDecorator("pteam", {
                                    rules: [{required: true, message: '班次名称不能为空!'}],
                                })(
                                    <Input/>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="开始时间">
                            {getFieldDecorator('pbdate', {
                                rules: [{required: true, message: '开始时间不能为空!'}],
                            })(
                                <TimePicker
                                    defaultOpenValue={moment('00', format)}
                                    onChange={this.hanleStart}
                                    format={format}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="结束时间">
                            {getFieldDecorator('pedate', {
                                rules: [{required: true, message: '结束时间不能为空!'}],
                            })(
                                <TimePicker
                                    defaultOpenValue={moment('00', format)}
                                    onChange={this.hanleEnd}
                                    disabledHours={this.disabledHours}
                                    format={format}
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="巡更设备">
                            {getFieldDecorator('clist', {
                                rules: [{required: true, message: '请选择巡更设备!'}],
                            })(
                                <CheckboxGroup options={this.state.plainOptions}/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default PatrolPlan = Form.create()(PatrolPlan);
