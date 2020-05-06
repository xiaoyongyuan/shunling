import React, { Component } from 'react';
import { Layout } from 'antd';
import LayerHeader from './../layout/LayerHeader';
import './index.less';
import MenuRoutes from '../../routes/MenuRoutes';

const {Header, Content} = Layout;
class Pandect extends Component {
  render() {
    return (
      <div className="pandect">
        <Layout>
          {/*<Header><LayerHeader /></Header>*/}
        	<Content className='Content'>
            <MenuRoutes />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Pandect;
