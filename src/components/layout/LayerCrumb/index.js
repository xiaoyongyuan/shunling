import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumb  } from 'antd';
import './index.less';

class LayerCrumb extends Component {
	constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount(){

  }

  render() {
    console.log(document.referrer)
    return (
      <div className="LayerCrumb">
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">Application Center</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href="">Application List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    );
  }
}

export default LayerCrumb;
