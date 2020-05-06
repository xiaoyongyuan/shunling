import React, { Component } from 'react'
import { Form, Input, Button, message, Icon, Checkbox } from 'antd'
import axios from '../../axios/index'
import logo from '../../style/imgs/logoCricle.png'
import './index.less'
import transfo1 from '../../style/imgs/transfout.png'
import transfo2 from '../../style/imgs/transmind2.png'
import transfo3 from '../../style/imgs/transmind3.png'
import transfo4 from '../../style/imgs/transfl.png';
import md5 from "js-md5";
class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	hanleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				axios
					.login({
						data: {
							account: values.account,
							password: md5(values.password)
						}
					})
					.then((res) => {
						if (res.success && res.data) {
							localStorage.setItem('account', res.data.datainfo.account);
							localStorage.setItem('companycode', res.data.datainfo.companycode);
							localStorage.setItem('ifsys', res.data.datainfo.ifsys);
							localStorage.setItem('utype', res.data.datainfo.utype);
							localStorage.setItem('token', res.data.token);
							localStorage.setItem('elemapinfo', res.data.elemapinfo);
							this.props.history.push('/main/index')
						} else {
							message.warn('用户名或密码错误！')
						}
					})
			}
		})
	}
    addspan = (tt) => {
     
		return <span key={tt} className="spanlit" style={{ animation: `xs linear 1.6s infinite ${tt}s` }} />
	}
	rendiv = () => {
      
		return <div key={new Date()}  className="spnifdiv">{this.creanumar(15).map((a) => this.addspan(0.48 + a * 0.12))}</div>
	}
	rendivshe = (to, le, yc = 0, cln = 'dottty', ds = '5S') => {
	
		return (
            <div
                key={new Date()}
				className={cln}
				style={{
					top: to,
					left: le,
					animation: `${cln === 'dottty' ? 'dot' : 'doc'} ${ds} ${yc} infinite step-start both`
				}}
			/>
		)
	}
	creanumar = (num) => {
		let arr = []
		for (let i = 0; i < num; i++) {
			arr.push(i)
		}
		return arr
	}

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<div className="Login">
				<div className="login_title">
					<img src={logo} alt="" />
				</div>

				<div className="logoBor">
					<div className="logoBg">
						{
							this.rendivshe('93%', '-3%'),
							this.rendivshe('89%', '-2%'),
							this.rendivshe('83%', '4%'),
							this.rendivshe('51%', '-1%'),
							this.rendivshe('55%', '-1.1%'),
							this.rendivshe('1%', '90%', '2s', 'dotting', '6s'),
							this.rendivshe('5%', '85%', '2s', 'dotting', '6s'),
							this.rendivshe('70%', '102%', '2s', 'dotting', '6s'),
							this.rendivshe('75%', '102.5%', '2s', 'dotting', '6s')
						}
						{[ this.rendiv() ]}
						{/* 动画图片  */}
						<div className="tranfpro">
							<div className="tranf4">
								<img src={transfo1} className="imgtran4" />
								<div className="tranf3">
									<img src={transfo2} className="imgtran3" />
									<div className="tranf2">
										<img src={transfo3} className="imgtran2" />
										<div className="tranf1">
											<img src={transfo4} className="imgtran1" />
										</div>
									</div>
								</div>
							</div>{' '}
							{/* 动画结束  */}
						</div>
						<div className="login_pro">
							<div className="logtittop">
								<p className="gztitle">AI视频警戒系统</p>
								<p className="gztitleeng">security analytics syatem</p>
							</div>
							{/* 登录表单 */}
							<div className="loginFrame">
								{/* 四个边角 */}
								<div className="logbeforel" />
								<div className="logbeforer" />

								<p className="uselogtitle">用户登录</p>
								<Form className="logoForm" onSubmit={this.hanleSubmit}>
									<Form.Item>
										{getFieldDecorator('account', {
											rules: [ { required: true, message: '请输入用户名!', help: '' } ]
										})(
											<Input
												className="iphoneInput"
												placeholder="用户名"
												prefix={<Icon type="user" />}
											/>
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('password', {
											rules: [ { required: true, message: '请输入密码!', help: '' } ]
										})(
											<Input
												className="iphoneInput"
												type="password"
												placeholder="密码"
												prefix={<Icon type="lock" />}
											/>
										)}
									</Form.Item>
									<Form.Item>
										<Button type="primary" htmlType="submit" className="logoBtn">
											登录
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Form.create()(Login)
