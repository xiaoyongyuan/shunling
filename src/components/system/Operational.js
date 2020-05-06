import React, { Component } from 'react'
import { Form, Button, Input, Select, DatePicker, message } from 'antd'
import '../../style/ztt/css/operational.css'
import Etable from '../common/Etable'
import axios from '../../axios/index'
import moment from 'moment'
const { Option } = Select
const { RangePicker } = DatePicker
class Operational extends Component {
	constructor(props) {
		super(props)
		this.state = {
			operationList: [],
			operationTypeList: []
		}
	}
	param = {
		pagesize: 10,
		pageindex: 1
	}
	componentDidMount() {
		this.getList()
		this.operationType()
	}
	getList = () => {
		axios
			.ajax({
				method: 'get',
				url: window.g.loginURL + '/api/logs/getlist',
				data: this.param
			})
			.then((res) => {
				this.setState({
					operationList: res.data,
					totalcount: res.totalcount
				})
			})
	}
	operationType = () => {
		axios
			.ajax({
				method: 'get',
				url: window.g.loginURL + '/api/logs/gettypelist',
				data: {}
			})
			.then((res) => {
				let TypeList = []
				for (var a in res.data) {
					TypeList.push({ code: a, name: res.data[a] })
				}
				this.setState({
					operationTypeList: TypeList
				})
			})
	}
	disabledDate = (current) => {
		return current > moment().endOf('day')
	}
	handleSubmit = (e) => {
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (values.times && values.times.length) {
				let beforeTime = moment(values.times[0]).format('YYYY-MM-DD HH:mm:ss')
				let mydate = moment(moment(values.times[1]).format('YYYY-MM-DD HH:mm:ss'))
				let days = mydate.diff(beforeTime, 'day')
				if (days <= 1) {
					this.param.bdate =
						values.times && values.times.length ? values.times[0].format('YYYY-MM-DD HH:mm:ss') : null
					this.param.edate =
						values.times && values.times.length ? values.times[1].format('YYYY-MM-DD HH:mm:ss') : null
				} else {
					message.info('请选择24小时以内的时间')
				}
			} else {
				this.param.bdate =
					values.times && values.times.length ? values.times[0].format('YYYY-MM-DD HH:mm:ss') : null
				this.param.edate =
					values.times && values.times.length ? values.times[1].format('YYYY-MM-DD HH:mm:ss') : null
			}
			this.param.handletype = values.handletype
			this.param.realname = values.realname
			this.param.pageindex = 1
			this.getList()
		})
	}
	handleType = (type) => {
		let name = ''
		this.state.operationTypeList.map((v) => {
			if (v.code === type) {
				name = v.name
			}
		})
		return name
	}
	changePage = (page) => {
		this.param.pageindex = page
		this.getList()
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const columns = [
			{
				title: 'ID',
				dataIndex: 'code',
				render: (text, record, index) => index + 1,
				sorter: (a, b) => a.age - b.age,
				align: 'center'
			},
			{
				title: '用户名',
				dataIndex: 'uid',
				render: (record, text) => {
					return (
						<div>
							{text.uid}&nbsp;&nbsp;/&nbsp;&nbsp;{text.realname}
						</div>
					)
				},
				align: 'center'
			},
			{
				title: '操作时间',
				dataIndex: 'createon',
				render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
				align: 'center'
			},
			{
				title: '操作类型',
				dataIndex: 'handletype',
				render: (record, text) => {
					return <div>{this.handleType(text.handletype)}</div>
				},
				align: 'center'
			},
			{
				title: '操作信息',
				dataIndex: 'handlememo',
				align: 'center'
			}
		]
		return (
			<div className="operational">
				<div className="formLin">
					<Form layout="inline" onSubmit={this.handleSubmit}>
						<Form.Item label="操作类型">
							{getFieldDecorator('handletype', {
								rules: [ { required: false, message: 'Please input your username!' } ],
								initialValue: 'all'
							})(
								<Select style={{ width: 120 }}>
									<Option value="all">全部</Option>
									{this.state.operationTypeList.map((v) => (
										<Option key={v.code} value={v.code}>
											{v.name}
										</Option>
									))}
								</Select>
							)}
						</Form.Item>
						<Form.Item label="用户名">{getFieldDecorator('realname')(<Input />)}</Form.Item>
						<Form.Item label="操作时间">
							{getFieldDecorator('times')(
								<RangePicker
									disabledDate={this.disabledDate}
									showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
									format="YYYY-MM-DD HH:mm:ss"
								/>
							)}
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								查询
							</Button>
						</Form.Item>
					</Form>
				</div>
				<Etable
					bordered
					columns={columns}
					dataSource={this.state.operationList}
					pagination={{
						defaultPageSize: this.param.pagesize,
						current: this.param.pageindex,
						total: this.state.totalcount,
						onChange: this.changePage,
						hideOnSinglePage: true
					}}
				/>
			</div>
		)
	}
}
export default (Operational = Form.create({})(Operational))
