import React, { Component } from "react";

class ImageMagnifier extends Component {
    constructor(props) {
        super(props);
        this.state = {
            /**
             * 图片放大镜参数列表
             * 组件宽高必须大于鼠标悬停小方块 ！！！
             */
            params: {
                // 放大倍数
                scale: 4,
                // 组件宽
                width: "",
                // 组件高
                height: ""
            },

            // 缩略图
            minImg: "",
            // 大图
            maxImg: "",

            // 开关
            magnifierOff: false,
            // 图片加载情况
            imgLoad: false,
            /**
             * 样式
             */
            cssStyle: {
                // 图片容器样式
                imgContainer: {
                    border: "1px solid #ccc",
                    cursor: "move",
                    position: "absolute",
                    top:"0",
                    left:"0"
                },
                // 鼠标悬停小方块样式
                mouseBlock: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100px",
                    height: "100px",
                    background: "rgba(0,111,227,0.4)",
                    zIndex: 99
                },
                // 鼠标悬停遮罩层样式
                maskBlock: {
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    background: "rgba(0,0,0,0)",
                    zIndex: 100
                },

                //  放大镜容器样式
                magnifierContainer: {
                    position: "absolute",
                    left: "0",
                    top: "0",
                    border: "1px solid #ccc",
                    overflow: "hidden",
                    zIndex: 98,
                    marginLeft:"20px"
                },
                // 图片样式
                imgStyle: {
                    width: "100%",
                    height: "100%"
                },
                // 图片放大样式
                // 此处图片宽高不能设置为百分比，在scale的作用下，放大的只是图片初始的宽高 ！！！
                imgStyle2: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: "scale(4)",
                    transformOrigin: "top left"
                }
            }
        };
    }

    /**
     * 生命周期函数
     */
    // 组件初始化
    componentWillMount() {
        this.initParam();
        this.updataImg(this.props);
        this.setState({
            mouseWidth:this.props.widthEnlarge*0.24,
            mouseHeight:this.props.heightNarrow*0.25
        })
    }

    // props 变化时更新
    componentWillReceiveProps(nextProps) {
        this.updataImg(nextProps);
    }
    /**
     * 方法
     */
        // 鼠标移入
    mouseEnter = () => {
        this.setState({
            magnifierOff: true
        });
    };
    // 鼠标移动
    mouseMove = event => {
        // console.log(event);
        let e = event.nativeEvent;
        this.calculationBlock(e.offsetX, e.offsetY);
    };

    // 计算相关参数
    calculationBlock(offsetX, offsetY) {
        let cssStyle = JSON.parse(JSON.stringify(this.state.cssStyle));
        let mousex=this.props.widthEnlarge*0.24/2;
        let mousey=this.props.heightNarrow*0.25/2;
        /* 小方块位置 */
        // 防止鼠标移动过快导致计算失误，只要小于或者大于对应值，直接设置偏移量等于最小值或者最大值
        if (offsetX < mousex) {
            offsetX = mousex;
        }
        if (offsetX > this.props.widthEnlarge-mousex) {
            offsetX = this.props.widthEnlarge-mousex;
        }
        if (offsetY < mousey) {
            offsetY = mousey;
        }
        if (offsetY > this.props.heightNarrow-mousey) {
            offsetY = this.props.heightNarrow-mousey;
        }
        cssStyle.mouseBlock.left = parseFloat(offsetX - mousex) + "px";
        cssStyle.mouseBlock.top = parseFloat(offsetY - mousey) + "px";

        /* 计算图片放大位置 */
        cssStyle.imgStyle2.left = parseFloat(-(offsetX - mousex) * 4) + "px";
        cssStyle.imgStyle2.top = parseFloat(-(offsetY - mousey) * 4) + "px";

        this.setState({
            cssStyle: cssStyle
        });
    }

    // 初始化静态参数
    initParam() {
        let cssStyle = JSON.parse(JSON.stringify(this.state.cssStyle));
        let params = JSON.parse(JSON.stringify(this.state.params));

        cssStyle.imgContainer.width = this.props.widthEnlarge + "px";
        cssStyle.imgContainer.height = this.props.heightNarrow + "px";
        cssStyle.magnifierContainer.width = this.props.widthEnlarge-30+ "px";
        cssStyle.magnifierContainer.height =this.props.heightNarrow+ "px";
        cssStyle.magnifierContainer.left = this.props.widthEnlarge+"px";
        cssStyle.mouseBlock.width =this.props.widthEnlarge*0.24 + "px";
        cssStyle.mouseBlock.height =this.props.heightNarrow*0.25 + "px";
        cssStyle.imgStyle2.width = this.props.widthEnlarge + "px";
        cssStyle.imgStyle2.height = this.props.heightNarrow + "px";
        cssStyle.imgStyle2.transform = "scale(" + params.scale + ")";

        this.setState({
            cssStyle: cssStyle
        });
    }

    // 更新图片
    updataImg(props) {
        this.setState({
            minImg: props.minImg,
            maxImg: props.maxImg
        });
    }

    // 图片加载情况
    handleImageLoaded(e) {
        // console.log(e);
        this.setState({ imgLoad: true });
    }

    // 图片加载中
    handleImageErrored() {
        this.setState({ imgLoad: false });
    }

    render() {
        const { cssStyle, magnifierOff, minImg, maxImg, imgLoad } = this.state;
        return (
            <div>
                <div style={cssStyle.imgContainer}>
                    <img style={cssStyle.imgStyle} src={minImg} alt="" />
                    <div
                        style={cssStyle.maskBlock}
                        onMouseEnter={this.mouseEnter}
                        onMouseLeave={this.props.mouseLeave}
                        onMouseMove={this.mouseMove}
                    />
                    {magnifierOff && <div style={cssStyle.mouseBlock} />}
                </div>
                {magnifierOff && (
                    <div style={cssStyle.magnifierContainer}>
                        <img
                            style={cssStyle.imgStyle2}
                            src={maxImg}
                            onLoad={this.handleImageLoaded.bind(this)}
                            onError={this.handleImageErrored.bind(this)}
                            alt=""
                        />
                        {!imgLoad && "failed to load"}
                    </div>
                )}
            </div>
        );
    }
}

export default ImageMagnifier;

