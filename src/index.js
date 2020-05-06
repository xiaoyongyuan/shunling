import React from 'react';
import ReactDOM from 'react-dom';
import './style/css/common.less';
import Routes from './Routes';
import * as serviceWorker from './serviceWorker';
import { ConfigProvider  } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import "babel-polyfill";
import 'moment/locale/zh-cn';
moment.locale('zh-cn');


ReactDOM.render(<ConfigProvider locale={zh_CN}><Routes /></ConfigProvider>, document.getElementById('root'));
serviceWorker.unregister();
