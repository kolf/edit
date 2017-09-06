import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";
import TableBox           from "app/components/common/table";
import LoadingBox         from "app/components/common/loading";
import SearchBox		  from "app/components/provider/searchBox";

import {Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";
import {cmsFilter, cmsSearch, topicFrequency} 		 from "app/action_creators/cms_action_creator";

import {Radio, Select, Input, Pagination} from "antd"

const RadioGroup = Radio.Group;
const Option = Select.Option;

class OnlineStateConfiger extends Component {
	constructor (props) {
		super(props);

		this.state = {
			selectDisplay : (this.props.onlineState == '在线' ? 'none' : '')
		}
	};

	render () {
		return (<table><tbody>
					<tr><td colSpan="2"><p>说明：专题下线后将不在被搜索引擎搜到，请谨慎操作</p></td></tr>
					<tr><td>目前状态：</td><td>{this.props.onlineState}</td></tr>
					<tr><td>状态操作：</td>
						<td><RadioGroup onChange={this.lineStateChange.bind(this)} defaultValue={this.props.onlineState}>
					        <Radio key="online" value="在线">上线</Radio>
					        <Radio key="offline" value="下线">下线</Radio>
					     </RadioGroup></td>
					</tr>
			      	<tr style={{display:this.state.selectDisplay}}><td>下线原因：</td>
			      		<td><Select size="large" defaultValue="1" style={{ width: 200 }}>
				      	<Option value="1">专题图片不合规范</Option>
				      	<Option value="2">内容包含色情</Option>
				      	<Option value="3">包含未申</Option>
				    	</Select></td>
				    </tr>
				</tbody></table>);
	}

	lineStateChange (e) {
		if(e.target.value == '下线'){
			this.setState({
				selectDisplay : ''
			})
		}else{
			this.setState({
				selectDisplay : 'none'
			})
		}
	}
};

const select = (state) => ({
	"error": state.cms.error,
	"dataFilter": state.cms.dataFilter,
	"dataList": state.cms.dataList
});
@connect(select)

export default class CmsContainer extends Component {
	constructor (props) {
		super(props);
		this.state = {
			"crumbs": [
				{"path": "/home", "text": "首頁"},
				{"path": "/cms/topicManage", "text": "内容运营平台：专题管理"}
			],
			"filterParams": {
				"role": 2, // role 1 销售 2 财务 3 运营
				"pageNum": 1,
				"pageSize": 20,	//不支持自定义pageSize
				"total": 0
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
			"keyword": ""
		};

		this.callbackTable = {
			"callbackTitle": this.callbackTitle.bind(this),
			"callbackOnlineState": this.callbackOnlineState.bind(this),
			"callbackUsingState": this.callbackUsingState.bind(this)
		};
	};

	static contextTypes = {
		"router": React.PropTypes.object.isRequired
	};

	componentDidMount () {
		
		this.refresh();
		this.filterForm();
	};

	render () {
		var self=this;
		const {dataList} = this.props;
		const {crumbs, tooltip, alert, filterParams, timeByOrder} = this.state;
		//分页组件模块化
		const paginationInit = {
			"current": filterParams.pageNum,
			"pageSize": filterParams.pageSize,
			"total": filterParams.total,
			"showSizeChanger": true,
			"showQuickJumper": true,
			showTotal () {
				return '共 '+filterParams.total+' 条';
			},
			onShowSizeChange (current,pageSize) {
				self.refresh("pagination",{"pageNum":current,"pageSize":pageSize});
			},
			onChange(current) {
				self.refresh("pagination",{"pageNum":current});
			}
		};

		// //console.log("pageSize,current",paginationInit.pageSize,paginationInit.current);
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

					<div className="row"><div className="col-xs-12">
						<div className="searchbox">
							<div style={{ marginTop: 8, width: "60%" }}>
								<Input addonAfter={
									<Button bsStyle="info" style={{ padding: "7px 35px" }} onClick={this.keywordSearch.bind(this) }> 搜 索</Button>
								} value={this.state.keyword} style={{ height: "37px", paddingLeft: "15px" }} onChange={e => { this.setState({ keyword: e.target.value }) } }/>
							</div>
						</div>
					</div></div>

					<div className="row"><div className="space-8"></div></div>

					<div className="row operate">
						<div className="col-xs-12 col-sm-5">
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh bigger-120"></i>刷新
							</button>
							<span className="line-c"></span>
							<button className="btn btn-sm btn-info" onClick={this.configPage.bind(this,"0")}>
								<i className="ace-icon fa fa-plus bigger-120"></i>创建专题
							</button>
						</div>
						
						{/*分页组件引用*/}
						<div className="col-xs-12 col-sm-7">
							<div className="dataTables_paginate pull-right">
								<Pagination {...paginationInit} />
							</div>
						</div>
					</div>
					<div className="row"><div id="j_filter" className="col-xs-12"></div></div>
					<div className="row"><div className="space-8"></div></div>

					<div className="row">
						<div id="j_table" className="col-xs-12"></div>
					</div>

					<div className="row">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh bigger-120"></i>刷新
							</button>
							<span className="line-c"></span>
							<button className="btn btn-sm btn-info" onClick={this.configPage.bind(this,"0")}>
								<i className="ace-icon fa fa-plus bigger-120"></i>创建专题
							</button>
						</div>
						{/*分页组件引用*/}
						<div className="dataTables_paginate pull-right">
							<Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} total={paginationInit.total} showQuickJumper showTotal={paginationInit.showTotal} onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}  />
						</div>
					</div>
				</div>
			</div>
		);
	};
	filterForm () {
		const {dispatch} = this.props;
		const container = document.getElementById('j_filter');
		ReactDOM.render(<LoadingBox />, container);
		let _this=this;
		
		let filterArr=this.state.filterInit?this.state.filterInit:[];
		dispatch(cmsFilter()).then((result) => {
			
			if (result.apiError) return false;
			ReactDOM.render(<FilterBox dataFilter={_this.props.dataFilter} filterInit={filterArr} onSearch={_this.handleOnSearch.bind(this)} searchError={_this.props.error} />, container);
		}); 
	};
	queryList (params) {
		const {dispatch} = this.props;
		const {filterParams} =this.state;
		const container = document.getElementById('j_table');
		ReactDOM.render(<LoadingBox />, container);
		dispatch(cmsSearch(params)).then((result) => {
			if (result.apiError) {
				this.message(result.apiError.errorMessage);
				return false
			}
			filterParams.total=result.apiResponse.total?result.apiResponse.total:0;
			this.setState({filterParams});
			//console.log(this.props.dataList);
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
		let title = item.title,
			id = item.topicId;
		return (<span className="hand blue" title="点击进入基本信息编辑" onClick={()=>{this.context.router.push("/cms/topicManage/" + id+"/1");}}>{title}</span>);
	};

	callbackOnlineState (item, valueMap) {
		let id = item.onlineState, text_tag = '';
		const text = valueMap[id];
		if(id==0) {
			text_tag = (<span className="pink">{text}</span>);
		}else if(id==1){
			text_tag = (<span className="green">{text}</span>);
		}else if(id==2){
			text_tag = (<span className="orange">{text}</span>);
		}else if(id==3||id==4){
			text_tag = (<span className="grey">{text}</span>);
		}else{
			text_tag = (<span>{text}</span>);
		}
		return text_tag;
	};

	callbackUsingState (item, valueMap) {
		let id = item.usingState, text_tag = '';
		const text = valueMap[id];
		if(id==1) {
			text_tag = (<button className="btn" onClick={this.changeUsingState.bind(this,item)}>{ text }</button>);
		}else if(id==2){
			text_tag = (<button className="btn btn-warning" onClick={this.changeUsingState.bind(this,item)}>{ text }</button>);
		}
		return text_tag;
	};

	configPage (topicState){
		const data = this.state.params;
		const idField = data.idField;
		const id    = idField && data.item[idField] || '0';
		let tabId="1";
		if(topicState=="6")
		{
			tabId="2";
		}
		else if(topicState=="7")
		{
			tabId="3";
		}
		this.context.router.push("/cms/topicManage/" + id+"/"+tabId);
	};

	handleOnTable ({operate, data, rowIndex}) {
		let topicState=data.item.onlineState;
		Object.assign(this.state.params, data);
		switch (operate) {
			case "configPage":
				this.configPage(topicState);
				break;
			// case "moveTo":
			// 	this.moveTo();
			// 	break;
			// case "createLink":
			// 	this.createLink();
			// 	break;
			// case "onlineStateConfig":
			// 	this.onlineStateConfig(data);
			// 	break;
			case "manageContent":
				this.manageContent();
				break;
			case "changeUsingState":
				this.changeUsingState(data);
				break;
			default:
				break;
		}
	};

	

	handleOnSearch(params,current,tags) {
		//console.log('handleOnSearch',params,current,tags);
		if(tags){
			this.setState({"filterInit":tags});
		}
		let dataParams = {};
		params.map((item) => {
			dataParams[item.field] = item.id;
		});
		if(current){
			this.filterForm(current, dataParams);
		}else{
			this.refresh("filter", dataParams);
		}
	};

	manageContent () {
		const data = this.state.params;
		const idField = data.idField;
		const id    = idField && data.item[idField] || '0';
		
		this.context.router.push("/cms/topicManage/" + id + '/4');
	}

	changeUsingState (data) {
		const {dispatch, params:{topicId}} = this.props;
		dispatch(topicFrequency({ "topicId": data.topicId, "focus": 3 - data.usingState})).then((result) => {
			if (result.apiError) {
				this.message(result.apiError.errorMessage);
				return false
			}
			this.refresh();
		});
	};

	keywordSearch(){
		const {params} = this.props.dataList;
		this.queryList({
			...params,
			keyword:this.state.keyword
		});
	}
}