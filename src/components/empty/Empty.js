import React from 'react'
import { withRouter } from 'react-router-dom'

class Blank extends React.Component {
    // 此组件用于刷新当前页面使用
    componentWillMount = () => {
        this.props.history.push(`${this.props.query.path}?memo=${this.props.query.memo}`);
    }
    render() {
        return (
            <div></div>
        )
    }
}
export default withRouter(Blank)