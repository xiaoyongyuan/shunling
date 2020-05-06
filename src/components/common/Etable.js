import React, { Component } from "react";
import { Table } from "antd";
import "./index.less";
class Etable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 10,
      total: 42
    };
  }
  changePage = (page, pageSize) => {
    this.setState({
      page
    });
    return page;
  };
  getOptions = () => {
    const pagination = {
      showQuickJumper: true,
      defaultPageSize: 10,
      onChange: this.changePage
      // hideOnSinglePage:true
    };
    return (
      <Table
        bordered
        dataSource={[]}
        rowKey={record => record.code}
        pagination={pagination}
        size="middle"
        {...this.props}
      />
    );
  };

  render() {
    return <div className="Etable">{this.getOptions()}</div>;
  }
}

export default Etable;
