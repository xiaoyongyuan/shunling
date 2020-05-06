import React, { Component } from 'react';
import { Row, Col, Select,DatePicker,Button,Icon } from 'antd';
import "./AlarmTracking.less";
const { Option } = Select;
const { RangePicker } = DatePicker;
class AlarmTracking extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    handleChange = (value) =>{
        console.log(`selected ${value}`);
    };
    onChange = (value,dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };
    onOk = (value) => {
        console.log('onOk: ', value);
    };
    render() {
        return(
            <div className="AlarmTracking">
                <Row className="AlarmTracking-query">
                    <Col span={12}>
                        <span className="select-camera">选择设备</span>
                        <Select className="select-form" defaultValue="lucy" onChange={this.handleChange}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    </Col>
                    <Col span={12} className="select-time-col">
                        <span className="select-time">选择时间</span>
                        <RangePicker
                            className="select-time-form"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                            onChange={this.onChange}
                            onOk={this.onOk}
                        />
                        <Button className="query-btn" type="primary">搜索</Button>
                    </Col>
                </Row>
                <Row className="AlarmTracking-main">
                    <Col className="AlarmTracking-main-col" span={4}>
                        <div className="ploceinfomation-bottom-item">
                            <div className="ploceinfomation-bottom-item-inner">
                                <div className="ploceinfomation-bottom-item-img">
                                    <div className="up">
                                        <div className="mark">
                                            <div className="cicler">
                                            </div>
                                            <span className="word">警情</span>
                                        </div>
                                        <div className="time">
                                            <span className="tiem-word">2019-10-10 12:12:12</span>
                                        </div>
                                    </div>
                                    <div className="down">
                                        <div className="img-up-fu-word">
                                            <div className="circle">
                                            </div>
                                            <span className="img-up-fu-word-span">新风机房2号门</span>
                                            <Icon className="icondian" type="ellipsis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="AlarmTracking-main-col" span={4}>
                        <div className="ploceinfomation-bottom-item">
                            <div className="ploceinfomation-bottom-item-inner">
                                <div className="ploceinfomation-bottom-item-img">
                                    <div className="up">
                                        <div className="mark">
                                            <div className="cicler">
                                            </div>
                                            <span className="word">警情</span>
                                        </div>
                                        <div className="time">
                                            <span className="tiem-word">2019-10-10 12:12:12</span>
                                        </div>
                                    </div>
                                    <div className="down">
                                        <div className="img-up-fu-word">
                                            <div className="circle">
                                            </div>
                                            <span className="img-up-fu-word-span">新风机房2号门</span>
                                            <Icon className="icondian" type="ellipsis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="AlarmTracking-main-col" span={4}>
                        <div className="ploceinfomation-bottom-item">
                            <div className="ploceinfomation-bottom-item-inner">
                                <div className="ploceinfomation-bottom-item-img">
                                    <div className="up">
                                        <div className="mark">
                                            <div className="cicler">
                                            </div>
                                            <span className="word">警情</span>
                                        </div>
                                        <div className="time">
                                            <span className="tiem-word">2019-10-10 12:12:12</span>
                                        </div>
                                    </div>
                                    <div className="down">
                                        <div className="img-up-fu-word">
                                            <div className="circle">
                                            </div>
                                            <span className="img-up-fu-word-span">新风机房2号门</span>
                                            <Icon className="icondian" type="ellipsis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="AlarmTracking-main-col" span={4}>
                        <div className="ploceinfomation-bottom-item">
                            <div className="ploceinfomation-bottom-item-inner">
                                <div className="ploceinfomation-bottom-item-img">
                                    <div className="up">
                                        <div className="mark">
                                            <div className="cicler">
                                            </div>
                                            <span className="word">警情</span>
                                        </div>
                                        <div className="time">
                                            <span className="tiem-word">2019-10-10 12:12:12</span>
                                        </div>
                                    </div>
                                    <div className="down">
                                        <div className="img-up-fu-word">
                                            <div className="circle">
                                            </div>
                                            <span className="img-up-fu-word-span">新风机房2号门</span>
                                            <Icon className="icondian" type="ellipsis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="AlarmTracking-main-col" span={4}>
                        <div className="ploceinfomation-bottom-item">
                            <div className="ploceinfomation-bottom-item-inner">
                                <div className="ploceinfomation-bottom-item-img">
                                    <div className="up">
                                        <div className="mark">
                                            <div className="cicler">
                                            </div>
                                            <span className="word">警情</span>
                                        </div>
                                        <div className="time">
                                            <span className="tiem-word">2019-10-10 12:12:12</span>
                                        </div>
                                    </div>
                                    <div className="down">
                                        <div className="img-up-fu-word">
                                            <div className="circle">
                                            </div>
                                            <span className="img-up-fu-word-span">新风机房2号门</span>
                                            <Icon className="icondian" type="ellipsis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col className="AlarmTracking-main-col" span={4}>
                        <div className="ploceinfomation-bottom-item">
                            <div className="ploceinfomation-bottom-item-inner">
                                <div className="ploceinfomation-bottom-item-img">
                                    <div className="up">
                                        <div className="mark">
                                            <div className="cicler">
                                            </div>
                                            <span className="word">警情</span>
                                        </div>
                                        <div className="time">
                                            <span className="tiem-word">2019-10-10 12:12:12</span>
                                        </div>
                                    </div>
                                    <div className="down">
                                        <div className="img-up-fu-word">
                                            <div className="circle">
                                            </div>
                                            <span className="img-up-fu-word-span">新风机房2号门</span>
                                            <Icon className="icondian" type="ellipsis" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default AlarmTracking;
