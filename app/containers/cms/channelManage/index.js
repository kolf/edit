import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";
import TableBox           from "app/components/common/table";
import LoadingBox         from "app/components/common/loading";

import {Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";
import {cmsChannelList} 		  from "app/action_creators/cms_action_creator";

import Pagination from "antd/lib/pagination";
const pageTexts = {
	'page' : '图片首页',
	'channel' : '编辑频道页'
};

const select = (state) => ({
	"error": state.cms.error,
	"dataList": state.cms.dataList
});
@connect(select)

export default class ChannelList extends Component {
	constructor (props) {
		super(props);

		const pageClass = props.params.pageClass;
		this.state = {
			"crumbs": [
				//{"path": "/home", "text": "首頁"},
				{"path": "/cms/channelManage/" + pageClass, "text": pageTexts[pageClass]}
			],
			"filterParams": {
				"role": 2, // role 1 销售 2 财务 3 运营
				"pageNum": 1,
				"pageSize": 20
			},
			"params":{},
			"tooltip": {
				"show": false,
				"target": null,
				"text": "更新中...",
				"placement": "right"
			},
			"alert": {
				"show": false,
				"isButton": true,
				"bsSize": "small",
				"onHide": this.closeAlert.bind(this),
				"title": null,
				"body": null,
				"submitAlert": null,
				"msg": "",
				"param": {},
				"isLoading": false
			},
			"lastPage":pageClass
		};

		this.callbackTable = {
			"callbackTitle": this.callbackTitle.bind(this)
		};

	};

	static contextTypes = {
		"router": React.PropTypes.object.isRequired
	};

	componentDidMount () {
		this.refresh();
	};

	componentWillReceiveProps(props){
		if(props.params.pageClass != this.state.lastPage){
			const pageClass = props.params.pageClass;
			//this.state.crumbs[1] = {"path": "/cms/channelManage/" + pageClass, "text": '内容运营平台：' + pageTexts[pageClass]};
			this.queryList({});
		}
	};

	render () {
		const {dataList} = this.props;
		const {crumbs, tooltip, alert, filterParams, timeByOrder} = this.state;
		//分页组件模块化
		const paginationInit={
			pageSize : filterParams.pageSize,
			current : filterParams.pageNum,
			total : dataList.list!=null? dataList.list.length:0,
			showTotal : ()=>{return `共 ${dataList.list!=null? dataList.list.length:0} 条`; },
			onShowSizeChange : (current,pageSize) => { 
                this.refresh("pagination",{"pageNum":current,"pageSize":pageSize});
			} ,
			onChange : this.handleOnPagination.bind(this)
		};
		return (
			<div className="main-content-inner">
				<CrumbsBox crumbs={crumbs} />
				<div className="page-content">

					<Modal {...alert}>
						<Modal.Header closeButton={true}>
							<Modal.Title>{alert.title}</Modal.Title>
						</Modal.Header>
						<Modal.Body style={{ "overflow": "hidden" }}>{alert.body}</Modal.Body>
						{alert.isButton &&
						<Modal.Footer>
							{alert.msg && <span className="orange pr-10"><i className="ace-icon fa fa-hand-o-right"></i> {alert.msg}</span>}
							{alert.submitAlert &&
							<Button bsClass="btn btn-sm btn-info btn-round" disabled={alert.isLoading} onClick={!alert.isLoading ? alert.submitAlert : null}>
								{alert.isLoading ? 'Loading...' : '确认'}
							</Button>
							}
							<Button bsClass="btn btn-sm btn-light btn-round" onClick={alert.onHide}>取消</Button>
						</Modal.Footer>
						}
					</Modal>

					<Overlay show={tooltip.show} target={() => ReactDOM.findDOMNode(tooltip.target) } placement={tooltip.placement}>
						<Tooltip id="j_tooltip_loading"><i className="ace-icon fa fa-spinner fa-spin orange bigger-100"></i> {tooltip.text}</Tooltip>
					</Overlay>

					<div className="row"><div className="space-8"></div></div>

					<div className="row operate">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh bigger-120"></i>刷新
							</button>
						</div>
						{/*分页组件引用*/}
						<div className="dataTables_paginate pull-right">
							<Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} total={paginationInit.total}  showQuickJumper showTotal={paginationInit.showTotal} onChange={paginationInit.onChange}  />
						</div>
					</div>

					<div className="row"><div className="space-8"></div></div>

					<div className="row">
						<div id="j_table" className="col-xs-12"></div>
					</div>

					<div className="row">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh bigger-120"></i>刷新
							</button>
						</div>
						{/*分页组件引用*/}
						<div className="dataTables_paginate pull-right">
							<Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} total={paginationInit.total}  showQuickJumper showTotal={paginationInit.showTotal} onChange={paginationInit.onChange}  />
						</div>
					</div>
				</div>
			</div>
		);
	};

	queryList (params) {
		const {dispatch, params:{pageClass}} = this.props;
		params.pageClass = pageClass;
		this.state.lastPage = pageClass;
		const container = document.getElementById('j_table');
		ReactDOM.render(<LoadingBox />, container);
		dispatch(cmsChannelList(params)).then((result) => {
			if (result.apiError) {
				this.message(result.apiError.errorMessage);
				return false
			}
			ReactDOM.render(<TableBox onTable={this.handleOnTable.bind(this)} {...this.callbackTable} {...this.props.dataList} />, container);
		});
	};

	refresh(type, dataParams) {
		const {filterParams} = this.state;
		//console.error(type, dataParams,filterParams);
		if (type == "pagination") { // pagination
			Object.assign(filterParams, dataParams);
		}
		if (type == "filter") { // filter
			Object.assign(filterParams, dataParams, { "pageNum": 1 });
		}
		if(type == "pagination"||type == "filter"){
			this.setState({ filterParams });
		}
		this.queryList(filterParams);
	};

	handleOnPagination(pageNum) {
		this.refresh("pagination", { "pageNum": pageNum });
	};

	closeAlert() {
		const alert = Object.assign(this.state.alert, { "show": false, "isLoading": false, "param": {} });
		this.setState({ "alert": alert });
	};

	openAlert(config) {
		const alert = Object.assign(this.state.alert, { "show": true, "isLoading": false, "msg": "" }, config);
		this.setState({ "alert": alert });
	};

	errorAlert(msg) {
		const alert = Object.assign(this.state.alert, { "msg": msg });
		this.setState({ "alert": alert });
	};

	loadingAlert() {
		const config = {};
		config.body = <div className="text-center"><Spin /></div>;
		config.isLoading = true;
		this.openAlert(config);
	};

	message(msg) {
		const config = {
			"bsSize": "small",
			"title": <samll style={{ "fontSize": "14px" }}>{"提示信息"}</samll>,
			"body": <p className="bolder center grey">{msg}</p>,
			"isButton": false
		};
		this.openAlert(config);
	};

	callbackTitle (item, valueMap) {
		const title = item.title, id = item.id;
		return (<span className="hand blue" onClick={()=>{
			this.context.router.push({
				pathname: "/cms/channelManage/config/" + id,
				state: { id, title}
			});
		}} title={title}>{title}</span>);
	};

	configPage (){
		const data = this.state.params;
		const idField = data.idField;
		const id    = data.item[idField];
		this.context.router.push("/cms/channelManage/config/" + id);
	};

	handleOnTable ({operate, data}) {
		Object.assign(this.state.params, data);
		switch (operate) {
			case "configPage":
				this.configPage();
				break;
			default:
				break;
		}
	};
}