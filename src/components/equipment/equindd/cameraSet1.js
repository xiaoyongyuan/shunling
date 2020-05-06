import {Col,Row,List,Button,Checkbox, Radio, message,} from "antd";
import React, { Component } from "react";
import axios from "../../../axios/index";
import "../../../style/jhy/less/equipset.less";
const rencolor = ["#ff0" ,"#0467fb" ,"#ED2F2F" ,"#ffaf02"]  //0为初始化颜色，1为防区1颜色，2为防区2颜色
const maskcol = "rgba(204, 204, 204, 0.1)";
var open = false;
let dianjixy = {} //点击时的坐标
let dianjipd = {} //点击时的判断
let lastxy = []  //移动时上次的
let xinzb = [] //更新时点的坐标
export default class EquipSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oneTypeSelect: [0], //检测类型 :人员类型 ,车辆类型
      twoTypeSelect: [0],
      threeTypeSelect: [0],
      defOneAddBtn: true, //添加，删除 ，提交是否可用
      defTwoAddBtn: true,
      defThreeAddBtn: true,
      defOneDelBtn: true,
      defTwoDelBtn: true,
      defThreeDelBtn: true,
      defOneSubBtn: true,
      defTwoSubBtn: true,
      defThreeSubBtn: true ,
      initareaMove: false,
      defSelect: "zero",
      newinitarea: [],
      areaOne: [], //防区一 防区图形的坐标
      areaTwo: [],
      areaThree: [],
      camerdat:{},
      initarea: [
        [174, 380],
        [174, 200],
        [365, 200],
        [550, 200],
        [550, 380],
        [365, 380]
      ] //默认防区图形坐标
    }
  }


  componentDidMount() {
      if (this.props.code) {
        this.props.getOne();
      }
    document.body.onmouseup = () => {
      dianjipd = {
        one: false,
        many: false,
        ind: 999
      }
    };
    this.ctx()
    this.handleTabChange()
    this.oneTypeSelectFun(this.props.camerdat.equipData)
  }
  ctx = () => {
    const ggty = document.getElementById("cavcontainer");
    this.domctx = ggty
    this.areaAll = ggty.getContext("2d")
  }
  oneTypeSelectFun = (resDat) => {
    var backType = { } ;
    if (resDat.field) {
      const datFile =  resDat.field
      for(let i in datFile){
        if (datFile[i].type === "0") {
          backType[i] = [0];
        } else if (datFile[i].type === "1") {
          backType[i] = [1];
        } else if (
          datFile[i].type === "0,1" ||
          datFile[i].type === "1,0"
        ) {
          backType[i] = [0, 1];
        }
      }
    }
    this.setState({
      oneTypeSelect: backType[1] ?
        backType[1] :
        this.state.oneTypeSelect,
      twoTypeSelect: backType[2] ?
        backType[2] :
        this.state.twoTypeSelect,
      threeTypeSelect: backType[3] ?
        backType[3] :
        this.state.threeTypeSelect
    })
  }

  mousedown = e => {
    //鼠标按下，判断是需要单点还是整体拖动
    e.preventDefault();
    if (!open) return;
    dianjixy = this.getxy(e)
    dianjipd = this.ifOneor(e, xinzb)
    lastxy = [] //每次点击时把上次的坐标设为空，初始赋值时为点击坐标
  };
  mouseup = () => {
    dianjipd = {
      one: false,
      many: false,
      ind: 999
    }
  };
  mousemove = e => {
    e.preventDefault();
    if (!open) {
      return;
    }
    let ssd = [this.getxy(e).x, this.getxy(e).y] //当前鼠标的坐标
    if (dianjipd.one) {
      let ind = dianjipd.ind
      if (this.ifout("one", ssd)) {
        xinzb.splice(ind, 1, ssd)
        this.clear(this.areaAll)
        this.draw(this.areaAll ,xinzb)
      }
    } else if (dianjipd.many) {
      //当前坐标  点击坐标  实时坐标 每次重新绘制后记录坐标  再次移动时，图形坐标整体改变，
      if (lastxy.length === 0) {
        //每次点击时把上次的坐标设为空，初始赋值时为点击坐标
        lastxy = [dianjixy["x"], dianjixy["y"]]
      }
      let cha = [ssd[0] - lastxy[0], ssd[1] - lastxy[1]]
      let willxin = this.copyarrTwo(xinzb)
      willxin.forEach((a, b) => {
        a[0] += cha[0]
        a[1] += cha[1]
      })
      if (this.ifout("quan", willxin)) {
        xinzb = this.copyarrTwo(willxin)
        this.clear(this.areaAll)
        this.draw(this.areaAll, xinzb)
      }
      lastxy = [...ssd]
    }
  };
  getblo = (arr) => {
    //获取方框范围,返回对象，4个值，xy方向的最大最小值
    let blockx = []
    let blocky = []
    arr.forEach(a => {
      blockx.push(a[0])
      blocky.push(a[1])
    })
    blockx.sort((a, b) => a - b)
    blocky.sort((a, b) => a - b)
    return {
      minx: blockx[0],
      maxx: blockx[blockx.length - 1],
      miny: blocky[0],
      maxy: blocky[blocky.length - 1],
    }
  }
  ifout = (oneor, changes) => {
    let minx = 0 // x方向最小值为小圆半径
    let maxx = 704 //
    let miny = 0 //
    let maxy = 576 //
    let ifrend = true
    if (oneor === "one") {
      //如果是单点移动，传入的changes为当前点移动的坐标
      if (!this.ifoutpdone(changes[0], minx, maxx) || !this.ifoutpdone(changes[1], miny, maxy)) {
        ifrend = false
      }


    } else if (oneor === "quan") {
      //如果是整体移动，传入的changes就是六个点的坐标，二维数组
      changes.forEach((a, b) => {
        if (!this.ifoutpdone(a[0], minx, maxx)) {
          ifrend = false
        }
        if (!this.ifoutpdone(a[1], miny, maxy)) {
          ifrend = false
        }
      })
    }
    return ifrend
  }

  ifoutpdone = (xy, minxy, maxxy) => {
    let pusha = true;
    if (xy < minxy) {
      pusha = false
    } else if (xy > maxxy) {
      pusha = false
    } else {
      pusha = true
    }
    return pusha
  }

  ifOneor = (e, arr) => {
    //判断点击鼠标时，整体移动还是单点移动，那个点
    let zuobiao = this.getxy(e) //点击是坐标
    let fanwei = this.getblo(arr) //图案当时的范围
    let pd = {
      one: false,
      many: false,
      ind: 999
    }
    let banj = 10 // 半径长度
    arr.some((a, b) => {
      //判断是否点在点上，
      let xmi = a[0] - banj
      let xmx = a[0] + banj
      let ymi = a[1] - banj
      let ymx = a[1] + banj
      if (zuobiao.x >= xmi && zuobiao.x <= xmx && zuobiao.y >= ymi && zuobiao.y <= ymx) {
        pd.one = true
        pd.ind = b
        return true
      }
    })
    if (!pd.one) {
      if (zuobiao.x >= fanwei.minx && zuobiao.x <= fanwei.maxx && zuobiao.y >= fanwei.miny && zuobiao.y <= fanwei.maxy) {
        pd.many = true
      }
    }
    return pd
  }

  //获取坐标
  getxy = (e) => {
    let cav = this.domctx
    let ccc = cav.getBoundingClientRect()
    return {
      x: e.clientX - ccc.left * (cav.width / ccc.width),
      y: e.clientY - ccc.top * (cav.height / ccc.height)
    }
  }

  clear = (ctx) => {
    ctx.clearRect(0, 0, 704, 576);
  }

  //绘制图形
  draw = (ctx, ivb ,color = rencolor[0]) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = maskcol;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ivb.forEach((a, b) => {
      if (b === 0) {
        ctx.moveTo(a[0], a[1]);
      } else {
        ctx.lineTo(a[0], a[1]);
      }
    })
    ctx.closePath();
    ctx.stroke();
    ivb.forEach(val => {
      ctx.beginPath();
      ctx.fillStyle = "#8064a2";
      ctx.arc(val[0], val[1], 10, 0, 2 * Math.PI);
      ctx.fill();
    })
  }
  copyarrTwo = (arr) => {
    //简单二维数组深拷贝
    let aaa = []
    arr.forEach(a => {
      aaa.push([...a])
    })
    return aaa
  }
  opendraw = () => {
    //开始绘制，打开开关
    open = true;
    xinzb = this.copyarrTwo(this.state.initarea)
    this.draw(this.areaAll ,xinzb);
  };
  handleTypeChange = (cv, num) => {
    if (num === 1) {
      this.setState(
        {
          oneTypeSelect: cv
        },
        () => {}
      );
    } else if (num === 2) {
      this.setState(
        {
          twoTypeSelect: cv
        },
        () => {}
      );
    } else if (num === 3) {
      this.setState(
        {
          threeTypeSelect: cv
        },
        () => {}
      );
    }
  };
  handleDefAdd = (e, num) => {
    const ev = e || window.event;
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
    switch (num) {
      case 1:
        this.setState({
          defOneSubBtn: false
        });
        break;
      case 2:
        this.setState({
          defTwoSubBtn: false
        });
        break;
      case 3:
        this.setState({
          defThreeSubBtn: false
        });
        break;

      default:
        break;
    }
    e.stopPropagation();
    this.opendraw();
  };

  delaxj = (key,callback) => {
      let syspiName="";
      this.props.camerdat.subNode.map((v)=>{
          if(this.props.camerdat.equipData.groupid===v.code){
              syspiName=v.sysip
          }
      })
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/camera/fielddel",
        data: {
          code: this.props.camerdat.addBackCode || this.props.camerdat.equipData.code,
          keys: key,
          groupip:this.props.camerdat.equipData.groupid,
          sysip:syspiName
        }
      })
      .then(res => {
        if (res.success) {
          message.success(key + "号防区删除成功");
          this.clear(this.areaAll);
          callback()
        }
      });
  }
  handleDefDelete = num => {
    switch (num) {
      case 1:
        if (this.props.camerdat.equipData.field && this.props.camerdat.equipData.field[1]) {
          this.delaxj(1 , () =>{
            this.setState(
              {
                defOneAddBtn: false,
                defOneDelBtn: true,
                defOneSubBtn: true,
                areaOne: []
              },
              () => {
                this.props.getOne();
              }
            );
          })
        }
        break;
      case 2:
        if (this.props.camerdat.equipData.field && this.props.camerdat.equipData.field[2]) {
          this.delaxj(2 , () =>{
            this.setState(
              {
                defTwoAddBtn: false,
                defTwoDelBtn: true,
                defTwoSubBtn: true,
                areaTwo: []
              },
              () => {
                this.props.getOne();
              }
            );
          })
        }

        break;
      case 3:
        if (this.props.camerdat.equipData.field && this.props.camerdat.equipData.field[3]) {
          this.delaxj(3 , () =>{
            this.setState(
              {
                defThreeAddBtn: false,
                defThreeDelBtn: true,
                defThreeSubBtn: true,
                areaThree: []
              },
              () => {
                this.props.getOne();
              }
            );
          })
        }
        break;
      default:
        break;
    }
  };
  submitajax = (key=1 , callback) => {
    var oneType , ststetype;
    if(key == 1){
      ststetype = "oneTypeSelect"
    }else if(key == 2) {
      ststetype = "twoTypeSelect"
    }
    else if(key == 3) {
      ststetype = "threeTypeSelect"
    }
    if (this.state[ststetype] == `${[]}`) {
      message.info("请选择检测类型");
      return;
    } else if (this.state[ststetype] == `${[0]}`) {
      oneType = 0;
    } else if (this.state[ststetype] == `${[1]}`) {
      oneType = 1;
    } else if (
      this.state[ststetype] == `${[0, 1]}` ||
      this.state[ststetype] == `${[1, 0]}`
    ) {
      oneType = 2;
    }

    let syspiName="";
      this.props.camerdat.subNode.map((v)=>{
          if(this.props.camerdat.equipData.groupid===v.code){
              syspiName=v.sysip
          }
      })
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/camera/fieldadd",
        data: {
          code: this.props.camerdat.addBackCode || this.props.code,
          keys: key,
          field: JSON.stringify(xinzb) ,
          type: oneType,
          groupip:this.props.camerdat.equipData.groupid,
          sysip:syspiName
        }
      })
      .then(res => {
        if (res.success) {
          open = false;
          message.success(key + "号防区添加成功");
          callback()
          this.props.getOne();
        } else {
          message.error(res.msg);
        }
      });
  }
  handleDefSubmit = num => {
    switch (num) {
      case 1:
        this.submitajax(1, () => {
          this.setState(
            {
              defOneAddBtn: true,
              defOneDelBtn: false,
              defOneSubBtn: true
            },
            () => {
              this.state.areaOne = xinzb
              this.boundarydraw("one");
            }
          );
        })
        break;
      case 2:

        this.submitajax(2, () => {
          this.setState(
            {
              defTwoAddBtn: true,
              defTwoDelBtn: false,
              defTwoSubBtn: true
            },
            () => {
              this.state.areaTwo = xinzb
              this.boundarydraw("two");
            }
          );
        })
        break;
      case 3:
        this.submitajax(3, () => {
          this.setState(
            {
              defThreeAddBtn: true,
              defThreeDelBtn: false,
              defThreeSubBtn: true
            },
            () => {
              this.state.areaThree = xinzb
              this.boundarydraw("three");
            }
          );
        })
        break;

      default:
        break;
    }
  };
  getBaseMapAnew = () => {
    axios
      .ajax({
        method: "get",
        url: window.g.loginURL + "/api/camera/getbasemap",
        data: {
          code: this.props.camerdat.addBackCode || this.props.camerdat.equipData.code,
          groupid:this.props.camerdat.equipData.groupid
        }
      })
      .then(res => {
        if (res.success) {
          message.info(
            "重新获取底图请求已发送，稍后请刷新页面，如未获取请重新发送请求"
          );
        }
      });
  };
  handleDefSelect = num => {
    switch (num) {
      case 0:
        this.setState({
          defSelect: "zero",
          defOneAddBtn: true,
          defTwoAddBtn: true,
          defThreeAddBtn: true,
          defOneDelBtn: true,
          defTwoDelBtn: true,
          defThreeDelBtn: true,
          defOneSubBtn: true,
          defTwoSubBtn: true,
          defThreeSubBtn: true
        });
        this.boundarydraw();

        break;
      case 1:
        this.setState({
          defSelect: "one",
          defTwoAddBtn: true,
          defThreeAddBtn: true,
          defTwoDelBtn: true,
          defThreeDelBtn: true,
          defTwoSubBtn: true,
          defThreeSubBtn: true
        });
        if (this.props.camerdat.equipData.field && this.props.camerdat.equipData.field[1]) {
          this.setState({
            defOneDelBtn: false
          });
        } else {
          this.setState({
            defOneAddBtn: false,
            defOneSubBtn: false
          });
        }
        this.boundarydraw("one");

        break;
      case 2:
        this.setState({
          defSelect: "two",
          defOneAddBtn: true,
          defThreeAddBtn: true,
          defOneDelBtn: true,
          defThreeDelBtn: true,
          defOneSubBtn: true,
          defThreeSubBtn: true
        });
        if (this.props.camerdat.equipData.field && this.props.camerdat.equipData.field[2]) {
          this.setState({
            defTwoDelBtn: false
          });
        } else {
          this.setState({
            defTwoAddBtn: false,
            defTwoSubBtn: false
          });
        }
        this.boundarydraw("two");

        break;
      case 3:
        this.setState({
          defSelect: "three",
          defOneAddBtn: true,
          defTwoAddBtn: true,
          defOneDelBtn: true,
          defTwoDelBtn: true,
          defOneSubBtn: true,
          defTwoSubBtn: true
        });
        if (this.props.camerdat.equipData.field && this.props.camerdat.equipData.field[3]) {
          this.setState({
            defThreeDelBtn: false
          });
        } else {
          this.setState({
            defThreeAddBtn: false,
            defThreeSubBtn: false
          });
        }
        this.boundarydraw("three");

        break;

      default:
        break;
    }
  };
  handleTabChange = ()=> {
      const equipData = this.props.camerdat.equipData;
      if (equipData.field ) {
          this.setState(
            {
              areaOne: equipData.field[1] == undefined ? [] : equipData.field[1].pointList,
              areaTwo: equipData.field[2] == undefined ? [] : equipData.field[2].pointList,
              areaThree: equipData.field[3] == undefined ? [] : equipData.field[3].pointList
            },
            () => {
              this.boundarydraw();
            }
          );
        }
  }
  boundarydraw = type => {
    let area = this.areaAll;
    area.clearRect(0, 0, 704, 576);
    if (type === "one") {
      if (this.state.areaOne.length > 0) {
        let areaOne = this.state.areaOne;
        this.draw(area , areaOne  ,rencolor[1])
      }
    } else if (type === "two") {
      if (this.state.areaTwo.length > 0) {
        let areaTwo = this.state.areaTwo;
        this.draw(area , areaTwo ,rencolor[2])
      }
    } else if (type === "three") {
      if (this.state.areaThree.length > 0) {
        let areaThree = this.state.areaThree;
        this.draw(area , areaThree,rencolor[3])
      }
    } else {
      if (this.state.areaOne.length > 0) {
        let areaOne = this.state.areaOne;
        this.draw(area , areaOne,rencolor[1])
      }
      if (this.state.areaTwo.length > 0) {
        let areaTwo = this.state.areaTwo;
        this.draw(area , areaTwo,rencolor[2])
      }
      if (this.state.areaThree.length > 0) {
        let areaThree = this.state.areaThree;
        this.draw(area , areaThree,rencolor[3])
      }
    }
  };

  render(){
    const checkType = [
      { label: "人员类型", value: 0 },
      { label: "车辆类型", value: 1 }
    ];
    const defopt = [
      <div
        onClick={() => {
          this.handleDefSelect(0);
        }}
        className="listItemWrap"
      >
        <Radio value="zero" checked={this.state.defSelect === "zero"}>
          总览
        </Radio>
        <span style={{ marginLeft: "30px" }}>
          提示:未添加防区为黄色
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              background: "#ff0",
              borderRadius: "5px",
              marginLeft: "5px"
            }}
          />
        </span>
      </div>,
      <div className="listItemWrap">
        <div
          className="optlabel"
          onClick={() => {
            this.handleDefSelect(1);
          }}
        >
          <Radio
            value="one"
            checked={this.state.defSelect === "one"}
            style={{ color: `${rencolor[1]}` }}
          >
            一号防区
          </Radio>
        </div>
        <div className="optlabel" style={{ width: "100%" }}>
          <span>检测类型</span>
          <span style={{ marginLeft: "40px" }}>
            <Checkbox.Group
              options={checkType}
              defaultValue={this.state.oneTypeSelect}
              value={this.state.oneTypeSelect}
              onChange={cv => this.handleTypeChange(cv, 1)}
            />
          </span>
        </div>

        <div className="optbtn">
          <Button
            onClick={e => {
              this.handleDefAdd(e, 1);
            }}
            disabled={this.state.defOneAddBtn}
          >
            添加
          </Button>
          <Button
            onClick={() => {
              this.handleDefDelete(1);
            }}
            type="danger"
            disabled={this.state.defOneDelBtn}
          >
            删除
          </Button>
          <Button
            onClick={() => {
              this.handleDefSubmit(1);
            }}
            type="primary"
            disabled={this.state.defOneSubBtn}
          >
            提交
          </Button>
        </div>
      </div>,
      <div className="listItemWrap">
        <div
          className="optlabel"
          onClick={() => {
            this.handleDefSelect(2);
          }}
        >
          <Radio
            value="two"
            checked={this.state.defSelect === "two"}
            style={{ color: `${rencolor[2]}` }}
          >
            二号防区
          </Radio>
        </div>
        <div className="optlabel" style={{ width: "100%" }}>
          <span>检测类型</span>
          <span style={{ marginLeft: "40px" }}>
            <Checkbox.Group
              options={checkType}
              defaultValue={this.state.twoTypeSelect}
              value={this.state.twoTypeSelect}
              onChange={cv => this.handleTypeChange(cv, 2)}
            />
          </span>
        </div>

        <div className="optbtn">
          <Button
            onClick={e => {
              this.handleDefAdd(e, 2);
            }}
            disabled={this.state.defTwoAddBtn}
          >
            添加
          </Button>
          <Button
            onClick={() => {
              this.handleDefDelete(2);
            }}
            type="danger"
            disabled={this.state.defTwoDelBtn}
          >
            删除
          </Button>
          <Button
            onClick={() => {
              this.handleDefSubmit(2);
            }}
            type="primary"
            disabled={this.state.defTwoSubBtn}
          >
            提交
          </Button>
        </div>
      </div>,
      <div className="listItemWrap">
        <div
          className="optlabel"
          onClick={() => {
            this.handleDefSelect(3);
          }}
        >
          <Radio
            value="three"
            checked={this.state.defSelect === "three"}
            style={{ color: `${rencolor[3]}` }}
          >
            三号防区
          </Radio>
        </div>
        <div className="optlabel" style={{ width: "100%" }}>
          <span>检测类型</span>
          <span style={{ marginLeft: "40px" }}>
            <Checkbox.Group
              options={checkType}
              defaultValue={this.state.threeTypeSelect}
              value={this.state.threeTypeSelect}
              onChange={cv => this.handleTypeChange(cv, 3)}
            />
          </span>
        </div>

        <div className="optbtn">
          <Button
            onClick={e => {
              this.handleDefAdd(e, 3);
            }}
            disabled={this.state.defThreeAddBtn}
          >
            添加
          </Button>
          <Button
            onClick={() => {
              this.handleDefDelete(3);
            }}
            type="danger"
            disabled={this.state.defThreeDelBtn}
          >
            删除
          </Button>
          <Button
            onClick={() => {
              this.handleDefSubmit(3);
            }}
            type="primary"
            disabled={this.state.defThreeSubBtn}
          >
            提交
          </Button>
        </div>
      </div>,
      <div className="listItemWrap">
          <Button type="dashed" className="again" onClick={this.getBaseMapAnew}>
            重新获取底图
          </Button>
      </div>
    ];
    return(
      <Row className="filed">
          <canvas
            width="704px"
            height="576px"
            id="cavcontainer"
            style={{
              backgroundImage: "url(" + `${this.props.camerdat.equipData.basemap}` + ")",
              backgroundSize: "100% 100%"
            }}
            onMouseDown={e => this.mousedown(e)}
            onMouseUp={e => this.mouseup(e)}
            onMouseMove={e => this.mousemove(e)}
          />
        <Col
          xl={{ span: 7 }}
          xxl={{ span: 6 }}
          style={{ marginLeft: "20px" }}
        >
          <List
            className="defopt"
            bordered
            dataSource={defopt}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </Col>
      </Row>
    )
  }
}
