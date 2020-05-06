import React from 'react';
import { Result, Button } from 'antd';
import {Link} from "react-router-dom";

class Notfound extends React.Component {
    state = {
        animated: ''
    };
    enter = () => {
        this.setState({animated: 'hinge'})
    };
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="对不起，您访问的页面不存在。"
                extra={<Button type="primary"><Link to="/main/index">返回首页</Link></Button>}
            />
        )
    }
}

export default Notfound;