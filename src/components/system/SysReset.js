/**
 * @copyright mikeJang
 */
import React, { Component } from "react";
import ReactEcharts from "echarts-for-react";
import {
  Row,
  Col,
  Card,
  Progress,
  Descriptions,
  List,
  Radio,
  Button,
  message
} from "antd";
import axios from "../../axios";
import "../../style/jhy/less/overview.less";

class SysReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datalist: {},
      syscheck: false,
      servcheck: false,
      playcheck: false
    };
  }

  componentDidMount() {
    this.getData();
  }
  getData = () => {
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/system/overview",
        data: {}
      })
      .then(res => {
        if (res.success) {
          this.setState({
            datalist: res.data
          });
        }
      });
  };
  reset = () => {
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/redisinfo/setinfo",
        data: {}
      })
      .then(res => {
        if (res.success) {
          message.success("重置系统成功,请重启服务器");
        } else {
          message.error("重置系统失败,请联系管理员");
        }
      });
  };
  render() {
    const funconfig = [
      <Radio
        checked={this.state.syscheck}
        onClick={() => {
          this.setState({ syscheck: !this.state.syscheck });
        }}
      >
        云端同步服务器是否运行
      </Radio>,
      <Radio
        checked={this.state.servcheck}
        onClick={() => {
          this.setState({ servcheck: !this.state.servcheck });
        }}
      >
        删除服务器是否运行
      </Radio>,
      <Radio
        checked={this.state.playcheck}
        onClick={() => {
          this.setState({ playcheck: !this.state.playcheck });
        }}
      >
        直播服务器是否运行
      </Radio>
    ];
    const datalist = this.state.datalist;
    const cpupie = {
      tooltip: {},
      series: [
        {
          type: "pie",
          label: [],
          radius: ["50%", "80%"],
          data: [{ value: datalist.cpuUsed }, { value: datalist.cpuUnused }]
        }
      ],
      color: ["#006cff", "#dcdbe0"]
    };
    const physpie = {
      title: {
        text: `${datalist.totalMemories}GB`,
        left: "center",
        top: "36%",
        padding: [24, 0],
        textStyle: {
          color: "#006cff",
          fontSize: 18,
          align: "center"
        }
      },
      tooltip: {
        formatter: "{c}GB"
      },
      series: [
        {
          type: "pie",
          radius: ["50%", "80%"],
          label: [],
          data: [
            { value: datalist.surplusMemories },
            { value: datalist.usedMemories }
          ]
        }
      ],
      color: ["#ff7200", "#32e8fe"]
    };
    const diskpie = {
      title: {
        text: `${datalist.MaxDisksMemories}GB`,
        left: "center",
        top: "36%",
        padding: [24, 0],
        textStyle: {
          color: "#32e8fe",
          fontSize: 18,
          align: "center"
        }
      },
      tooltip: {
        formatter: "{c}MB"
      },
      series: [
        {
          type: "pie",
          radius: ["50%", "80%"],
          label: [],
          data: [
            {
              value: datalist.surplusDisksMemories / datalist.MaxDisksMemories
            },
            { value: datalist.couldUseMemories / datalist.MaxDisksMemories }
          ]
        }
      ],
      color: ["#006cff", "#ff7200"]
    };
    return (
      <div className="overview">
        <div className="topwrap">
          <Row gutter={48}>
            <Col span={8}>
              <Card title="CPU" bordered={false} className="cpu">
                <Row>
                  <Col span={16}>
                    <div className="pie">
                      <ReactEcharts
                        id="cpuech"
                        option={cpupie}
                        style={{ height: "190px" }}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <p className="desc elli">
                      <span className="dot bluedot" />
                      CPU使用率
                    </p>
                    <p className="desc elli">
                      <span className="dot graydot" />
                      CPU空闲率
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="物理内存" bordered={false} className="physics">
                <Row>
                  <Col span={16}>
                    <div className="pie">
                      <ReactEcharts
                        option={physpie}
                        style={{ height: "190px" }}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <p className="desc elli">
                      <span className="dot bluedot" />
                      总物理内存
                    </p>
                    <p className="desc elli">
                      <span className="dot orangedot" />
                      剩余物理内存
                    </p>
                    <p className="desc elli">
                      <span className="dot lightbluedot" />
                      已使用物理内存
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="磁盘内存" bordered={false} className="disk">
                <Row>
                  <Col span={16}>
                    <div className="pie">
                      <ReactEcharts
                        option={diskpie}
                        style={{ height: "190px" }}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <p className="desc elli">
                      <span className="dot bluedot" />
                      可使用磁盘
                    </p>
                    <p className="desc elli">
                      <span className="dot orangedot" />
                      剩余磁盘
                    </p>
                    <p className="desc elli">
                      <span className="dot lightbluedot" />
                      最大可使用磁盘
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <Row className="midwrap">
          <Card title="操作系统" bordered={false} className="ossys">
            <Row>
              <Col span={6} className="vjcenter">
                <span className="syslabel">总线程数</span>
                <span className="prog">{datalist.TotalthreadNum}</span>
              </Col>
              <Col span={6} className="vjcenter">
                <span className="syslabel">CPU使用率</span>
                <Progress
                  percent={parseInt(datalist.cpuUsed)}
                  format={percent => {
                    return percent;
                  }}
                  className="cpuval"
                />
              </Col>
              <Col span={5} className="vjcenter">
                <span style={{ width: "20%" }}>显存</span>
                <span className="prog" style={{ width: "50%" }}>
                  {datalist.videoRam}
                </span>
              </Col>
              <Col span={6} className="vjcenter">
                <span className="syslabel">空闲显存</span>
                <span className="prog">{datalist.freeVideoRam}</span>
              </Col>
            </Row>
          </Card>
        </Row>
        <Row className="botwrap">
          <Card title="功能设置" className="funset">
            <Row>
              <Button
                onClick={() => this.reset()}
                className="reset"
                type="primary"
                style={{ float: "right", marginRight: "20px" }}
              >
                系统初始化
              </Button>
            </Row>
            <Row gutter={16} style={{ marginTop: "20px" }}>
              <Col span={6}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="系统持续运营时间">
                    {datalist.Runningtime}
                  </Descriptions.Item>
                  <Descriptions.Item label="一次算法处理警报数量">
                    {datalist.firstCalculationNum}
                  </Descriptions.Item>
                  <Descriptions.Item label="二次算法处理警报数量">
                    {datalist.secondCalculationNum}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={6}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="软件版本">
                    {datalist.softVersion}
                  </Descriptions.Item>
                  <Descriptions.Item label="一次算法版本">
                    {datalist.firstCalculationVersion}
                  </Descriptions.Item>
                  <Descriptions.Item label="二次算法版本">
                    {datalist.secondCalculationVersion}
                  </Descriptions.Item>
                  <Descriptions.Item label="SERVER版本">
                    {datalist.SERVERVersion}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={5}>
                <List
                  // style={{ width: "90%" }}
                  dataSource={funconfig}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
              </Col>
            </Row>
          </Card>
        </Row>
      </div>
    );
  }
}
export default SysReset;
