import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";
import TableBox           from "app/components/editor/table";
import LoadingBox         from "app/components/common/loading";

import {Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";
import Pagination from "antd/lib/pagination";
import {topicsView, topicsDelete} from "app/action_creators/topics_action_creator";


const select = (state) => ({
	"error": state.topics.error,
	"dataList": state.topics.dataList
});
@connect(select)
export default class topicsViewContainer extends Component {

	constructor (props) {
		super(props);
		this.state = {
			"crumbs": [
				{"path": "/home", "text": "首頁"},
				{"path": "/topics", "text": "专题列表"}
			],
			"activePage": 1,
			"pageSize": 5,
			"maxButtons": 5,
			"params":{},
			"loadingShow": false,
			"loadingTarget": "",
			"alert":{
				"show": false,
				"isButton": true,
				"bsSize": "small",
				"onHide": this.closeAlert.bind(this),
				"title": null,
				"body": null,
				"submitAlert": null
			}
		};
		this.topicsInit = {
			"title":"",
			"topicsId":"",
			"parentTopicsId":"",
			"category":"",
			"createdTime":"",
			"addTime":""
		};
	}

	componentDidMount () {
		this.queryList();
	};

	render () {
		const {crumbs,maxButtons,pageSize,activePage,loadingShow,loadingTarget} = this.state;
		const toolTipLoading = <Tooltip id="j_loading"><i className="ace-icon fa fa-spinner fa-spin orange bigger-100"></i> 更新中...</Tooltip>;
		const {alert} = this.state;
		const alertBox = (<Modal {...alert}>
			<Modal.Header closeButton>
				<Modal.Title>{alert.title}</Modal.Title>
			</Modal.Header>
			<Modal.Body style={{"overflow":"hidden"}}>{alert.body}</Modal.Body>
			{alert.isButton &&
			<Modal.Footer>
				<Button bsClass="btn btn-sm btn-info btn-round" onClick={alert.submitAlert}>确认</Button>
				<Button bsClass="btn btn-sm btn-light btn-round" onClick={alert.onHide}>取消</Button>
			</Modal.Footer>
			}
		</Modal>);

		const renderGroup = (value, label) =>
			<div className="form-group">
				<label className="text-muted col-xs-12 col-sm-3 control-label no-padding-right" style={{"fontSize":"12px"}}>
					{label}：</label>
				<div className="text-muted col-xs-12 col-sm-9"><p className="form-control-static">
					{value}</p></div>
			</div>;
		const {pages,topics} = this.props.dataList;
		const topicsInit = topics ?  topics : this.topicsInit;
		//分页组件模块化
		const paginationInit ={
			pageSize : pageSize,
			current : activePage,
			onShowSizeChange : (current,pageSize) => { 
                this.refresh("pagination",{"activePage":current,"pageSize":pageSize});
			} ,
			onChange : this.handleOnPagination.bind(this)
		} 
		return (
			<div className="main-content-inner">
				<CrumbsBox crumbs={crumbs} />
				<div className="page-content">

					{alertBox}

					<Overlay show={loadingShow}
							 target={()=> ReactDOM.findDOMNode(loadingTarget)}
							 placement="right">
						{toolTipLoading}
					</Overlay>

					<div className="row form-horizontal">
						<div className="col-sm-6">
							{renderGroup(topicsInit.title,"专题名")}
							{renderGroup(topicsInit.topicsId,"专题 ID")}
							{renderGroup(topicsInit.parentTopicsId,"父专题 ID")}
						</div>
						<div className="col-sm-6">
							{renderGroup(topicsInit.category,"分类")}
							{renderGroup(topicsInit.createdTime,"创建时间")}
							{renderGroup(topicsInit.addTime,"加入专题时间")}
						</div>
					</div>

					<div className="row operate">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.onDeleteGroupAll.bind(this)}>
								<i className="ace-icon fa fa-file-o"></i>删除
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh"></i>刷新
							</button>
						</div>
						{/*分页组件引用*/}
						<div className="dataTables_paginate pull-right">
							<Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger showQuickJumper showTotal={paginationInit.showTotal} onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}  />
						</div>
					</div>

					<div className="row"><div className="space-8"></div></div>

					<div className="row">
						<div id="j_table" className="col-xs-12"></div>
					</div>

					<div className="row operate">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.onDeleteGroupAll.bind(this)}>
								<i className="ace-icon fa fa-file-o"></i>删除
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh"></i>刷新
							</button>
						</div>
						{/*分页组件引用*/}
						<div className="dataTables_paginate pull-right">
							<Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger showQuickJumper showTotal={paginationInit.showTotal} onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}  />
						</div>
					</div>

				</div>
			</div>
		);
	};

	refresh () {
		const {params} = this.props.dataList;
		this.queryList(params);
	};

	queryList () {
		const {dispatch,params,dataList} = this.props;
		const container = document.getElementById('j_table');
		ReactDOM.render(<LoadingBox />, container);
		dispatch(topicsView(params)).then((result) => {
			if (result.apiError) return false;

			const {topicsId,title} = result.apiResponse.topics;
			this.setState({
				"crumbs": [
					{"path": "/home", "text": "首頁"},
					{"path": "/topics", "text": "专题列表"},
					{"path": "/topics/" + topicsId, "text": title}
				]
			});

			ReactDOM.render(<TableBox onTable={this.handleOnTable.bind(this)} {...this.props.dataList} />, container);
		});
	};

	handleOnTable ({operate, data}) {
		Object.assign(this.state.params, data);
		switch (operate) {
			case "deleteGroupId":
				this.deleteGroupId();
				break;
			default:
				//console.log(operate);
				//console.log(data);
		}
		//this.state.tableParams = Object.assign(this.state.tableParams, params);
	};

	handleOnPagination (eventKey) {
		this.setState({activePage: eventKey});
		const {params} = this.props.dataList;
		const paramsData = Object.assign({}, params, {"pageNum": eventKey});
		this.queryList(paramsData);
	};

	closeAlert () {
		const alert = Object.assign(this.state.alert, {"show":false});
		this.setState({"alert": alert});
	};

	openAlert(config) {
		const alert = Object.assign(this.state.alert, {"show":true}, config);
		this.setState({"alert": alert});
	};

	deleteGroupIdCom (params) {
		const {dispatch, dataList} = this.props;
		dispatch(topicsDelete(params)).then((result) => {
			if (result.apiError) return false;
			this.closeAlert();
			this.queryList(dataList.params);
		});
	};

	submitDeleteGroupId(){
		const data = this.state.params;
		const idField = data.idField;
		const id      = data.item[idField];
		const params  = {};
		params[idField] = id;
		this.deleteGroupIdCom(params);
	};

	submitDeleteGroupAllId(){
		const data = this.state.params;
		const idField = data.idField;
		const ids     = data.ids;
		const params  = {};
		params[idField] = ids;
		this.deleteGroupIdCom(params);
	};

	onDeleteGroupAll () {
		const data = this.state.params;
		const ids = data.ids;
		const title  = "删除多个组图:";
		let body,isButton;
		if(ids&&ids.length>0){
			const len = ids.length;
			body = "确定要删除这"+len+"个组图？";
			isButton = true;
		}else{
			body = "请选择组图。";
			isButton = false;
		}
		const config = {
			"bsSize": "small",
			"title": <samll style={{"fontSize":"14px"}}>{title}</samll>,
			"body": <p className="bolder center grey"><i className="ace-icon fa fa-hand-o-right blue bigger-120"></i>{body}</p>,
			"submitAlert": this.submitDeleteGroupAllId.bind(this),
			"isButton": isButton
		};
		this.openAlert(config);
	};

	deleteGroupId () {
		const data = this.state.params;
		const idField = data.idField;
		const id    = data.item[idField];
		const msg   = {"title": "删除组照：", "body": "确定要删除此组照？","cite":"ID-"};
		this.openAlert({
			"bsSize": "small",
			"title": <samll style={{"fontSize":"14px"}}>{msg.title + msg.cite + id}</samll>,
			"contentShow": "body",
			"body": <p className="bolder center grey"><i className="ace-icon fa fa-hand-o-right blue bigger-120"></i>{msg.body}</p>,
			"submitAlert": this.submitDeleteGroupId.bind(this),
			"isButton": true
		});
	}

}