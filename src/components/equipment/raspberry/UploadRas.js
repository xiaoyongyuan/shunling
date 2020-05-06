import React, { Component } from 'react';
import {Button,Form,Row,Col } from 'antd';
import { Upload, message, Icon } from 'antd';
import "../../../style/ztt/css/uploadRas.less";
import reqwest from "reqwest";
class UploadRas extends Component{
    constructor(props){
        super(props);
        this.state={
            fileList: []
        };
    }
    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('excelFile', file);
        });
        reqwest({
            url: window.g.loginURL+"/api/excelFile",
            method: 'post',
            processData: false,
            data: formData,
            success: (res) => {
                if(res.success){
                    this.setState({
                        fileList: [],
                    });
                   message.success(res.msg);
                   window.location.href="#/main/raspberry";
                }else{
                    message.error(res.msg)
                }
            },
            error: () => {
                message.error("上传失败");
            },
        });
    };
    render() {
        const { fileList } = this.state;
        const props = {
            showUploadList:true,
            multiple:false,
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <div className="uploadRas">
                <Row>
                    <Col span={5}>
                        <Upload {...props} accept='.xlsx,.xls'>
                            <Button>
                                <Icon type="upload" /> 请选择Excel文件
                            </Button>
                        </Upload>
                        <Button
                            type="primary"
                            onClick={this.handleUpload}
                            disabled={fileList.length === 0}
                            style={{ marginTop: 16 }}
                        >
                           确定
                        </Button>
                    </Col>
                    <Col span={8}>
                       <a href={window.g.loginURL+"/api/ExcelDownload"}>点击此处下载模板</a>
                       <p className="reminder">温馨提示：上传文件前，请先下载文件模板，避免文件上传失败</p>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default UploadRas=Form.create({})(UploadRas);
