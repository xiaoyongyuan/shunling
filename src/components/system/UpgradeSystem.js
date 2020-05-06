import React, { Component } from 'react';
import "../../style/ztt/css/upgradeSystem.less";
import { Upload, Icon,Button } from 'antd';
class UpgradeSystem extends Component{
    constructor(props){
        super(props);
        this.state={
            loading: false,
        };
    }
    render() {
        return (
            <div className="upgradeSystem">
                <div className="upLoadCon">
                    <span className="upgrdeTitle">上传更新包</span>
                    <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" directory>
                        <Button>
                            <Icon type="upload" /> 请选择文件
                        </Button>
                    </Upload>
                    <Button type="primary" className="upBtn">确认</Button>
                </div>
            </div>
        );
    }
}
export default UpgradeSystem;