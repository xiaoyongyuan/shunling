import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from './App'
import Login from './components/login'
import Main from './components/main'
import Notfound from './components/pages/notfound'
import { Provider } from 'react-redux';
import store from './store';

//页面样式：登录，总览（大数据），main
class Routes extends Component {
  render() {
    return (
        <Provider store={store}>
          <HashRouter>
          <App>
            <Switch>
              <Route exact path="/" render={()=> <Redirect to="/main/index" push />}/>
                <Route path="/login" component={Login}/>
                <Route path="/main" component={Main}/>
               <Route path="/404" component={Notfound} />
              <Route component={Notfound} />/
            </Switch>
          </App>
          </HashRouter>
        </Provider>
    );
  }
}

export default Routes;
