import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";
import moment			  from "moment";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";
import TableBox           from "app/components/common/table";
import LoadingBox         from "app/components/common/loading";
import ThumbnailBox       from "app/components/provider/thumbnail";

import Pagination from "antd/lib/pagination";
import {Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";
import {cmsContentFilter, cmsContentSearch, publicTopic} from "app/action_creators/cms_action_creator";
import { Input, Upload, Tabs, Switch, Select, DatePicker, Icon } 			  from "antd"
import {
	Grid,
	Row,
	Col,
	Thumbnail
} from "react-bootstrap/lib";


const select = (state) => ({
	"error": state.cms.error,
	"dataFilter": state.cms.dataFilter,
	"dataList": state.cms.dataList
});
@connect(select)

export default class ContentManage extends Component {

	constructor (props) {
		super(props);
		this.state = {
			"pageNum": 1,
			"pageSize": 20,
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
			},
			"filterInit":{
				"picType": {
					"tagIsClosed": false,
					"field": "picType",
					"fieldText": "照片类型：",
					"text": "单张",
					"id": 1
				},
				"contentType": {
					"tagIsClosed": false,
					"field": "contentType",
					"fieldText": "内容类型：",
					"text": "全部",
					"id": 0
				}
			},
			"dataFilter": {},
			"filterParams": {
				contentType:0,
				picType:1,
				pageNum:1,
				groupState:4		
			},
			"selectStatus": [],
			"isSingle": true,
			"orderByDate": false,
			
		};

		const {params} = this.props;

		Object.assign(this.state.filterParams, params);

	}

	static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

	componentDidMount () {
		 this.filterForm();
	};
	
	componentWillUnmount () {
		const list = document.getElementById('j_table');
		ReactDOM.render(<div></div>,list);
	};

	render () {
		
		const _this=this;
		const {dataList} = this.props;
		const {alert,crumbs,loadingShow,loadingTarget,orderByDate, keyword, isSingle,pageSize} = this.state;
		const toolTipLoading = <Tooltip id="j_loading"><i className="ace-icon fa fa-spinner fa-spin orange bigger-100"></i> 更新中...</Tooltip>;
		let {pageNum} = this.state;
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

		const btnAfter = <Button bsStyle="info" style={{ padding: "7px 35px" }} onClick={this.keywordSearch.bind(this) }> 搜 索</Button>;

		//分页组件模块化
		const paginationInit = {
			"current": pageNum,
			"pageSize": pageSize,
			"total": dataList.pages==null?0:dataList.pages*pageSize,
			onChange(current) {
				_this.refresh("pagination",{"pageNum":current});
			}
		};

		return (
			<div>
				<div className="page-content">

					{alertBox}

					<Overlay show={loadingShow}
							 target={()=> ReactDOM.findDOMNode(loadingTarget)}
							 placement="right">
						{toolTipLoading}
					</Overlay>

					<div className="row"><div className="col-xs-12">
						<div className="searchbox">
							<div style={{ marginTop: 8, width: "60%" }}>
								<Input addonAfter={btnAfter} value={this.state.keyword} style={{ height: "37px", paddingLeft: "15px" }} onChange={e => { this.setState({ keyword: e.target.value }) } }/>
							</div>
						</div>
					
							
						<div className="widget-box transparent ui-sortable-handle">
							
							<div className="widget-body">
								<div id="j_filter" className="widget-main padding-6 no-padding-left no-padding-right">
									<FilterBox
										filterInit={this.state.filterInit}
										dataFilter={this.state.dataFilter}
										onSearch={this.handleOnSearch.bind(this) }
										searchError={this.props.error}/>
								</div>
							</div>
						</div>

					</div></div>

					<div className="row"><div className="space-8"></div></div>

					<div className="row operate">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.selectAll.bind(this)}>
								<i className="ace-icon fa fa-file-o"></i>全选
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.selectToggle.bind(this)}>
								<i className="ace-icon fa fa-file-o"></i>反选
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.newGroup.bind(this)} style={{display:(isSingle ? '' : 'none')}}>
								<i className="ace-icon fa fa-file-o"></i>新建组照
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.joinGroup.bind(this)} style={{display:'none'}}>
								<i className="ace-icon fa fa-file-o"></i>加入组照
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.mergeGroup.bind(this)} style={{display:'none'}}>
								<i className="ace-icon fa fa-file-o"></i>合并组照
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.orderByDate.bind(this)}>
								上传时间<i className={ orderByDate ? "ace-icon fa fa-long-arrow-up":"ace-icon fa fa-long-arrow-down"}></i>
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh"></i>刷新
							</button>
						</div>
						{/*分页组件引用*/}
						<div className="dataTables_paginate pull-right">
						
								<Pagination {...paginationInit} />
						</div>
					</div>

					<div className="row"><div className="space-8"></div></div>
					
					<div className="row">
						<div id="j_table" className="col-xs-12">{this.props.children}</div>
					</div>

					<div className="row">
						<div className="col-xs-6">
							<button className="btn btn-sm btn-info" onClick={this.selectAll.bind(this)}>
								<i className="ace-icon fa fa-file-o"></i>全选
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.selectToggle.bind(this)}>
								<i className="ace-icon fa fa-file-o"></i>反选
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.newGroup.bind(this)} style={{display:(this.state.isSingle ? '' : 'none')}}>
								<i className="ace-icon fa fa-file-o"></i>新建组照
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.joinGroup.bind(this)} style={{display:'none'}}>
								<i className="ace-icon fa fa-file-o"></i>加入组照
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.mergeGroup.bind(this)} style={{display:'none'}}>
								<i className="ace-icon fa fa-file-o"></i>合并组照
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.orderByDate.bind(this)}>
								上传时间<i className={ orderByDate ? "ace-icon fa fa-long-arrow-up":"ace-icon fa fa-long-arrow-down"}></i>
							</button>{' '}
							<button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
								<i className="ace-icon fa fa-refresh"></i>刷新
							</button>
						</div>
						<div className="dataTables_paginate">
						
								<Pagination {...paginationInit} />	
						</div>
					</div>

				</div>
			</div>
		);
	};

	filterForm () {
		const {dispatch} = this.props;
		const {filterParams,filterInit} = this.state;
		let {dataFilter} = this.state;
		
		//console.log("filterParams.topicId");

		dispatch(cmsContentFilter({
			topicId:filterParams.topicId
		})).then((result) => {

			if (result.apiError) return false;

			dataFilter = this.props.dataFilter;

			this.setState({dataFilter});
			
		});
	};

	/*refresh () {
		const {params} = this.props;
		Object.assign(params, {"pageNum": this.state.activePage});
		this.queryList(params);
	};*/

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

		this.state.pageNum=filterParams.pageNum;
		this.queryList(filterParams);
	};

	orderByDate () {
		const {Lists, orderByDate} = this.state;
		let newLists = _.sortByOrder(Lists, ["timeByOrder"], [orderByDate ? "asc":"desc"]);

		this.setState({orderByDate: !orderByDate});
		this.state.Lists = newLists;
		this.thumbnailRender();
	}

	/*
	queryList (params) {
		const {dispatch} = this.props;

		const container = document.getElementById('j_table');
		ReactDOM.render(<LoadingBox />, container);

		this.setState({selectStatus: []});

		dispatch(cmsContentSearch(params)).then((result) => {
			if (result.apiError) {
				this.alertMsg(result.apiError.errorMessage);
				return false;
			}
			let len = this.props.dataList.list.length;
			this.state.selectStatus = _.fill(new Array(len) , false);

			const {dataList} = this.props;
			let _dataList = [];
			[...dataList.list].map((item,i) => {
				let tmp = {};
				_.mapKeys(item,(val, key)=>{
					tmp[key] = val;
				});
				tmp.timeByOrder = moment(item.createTime).unix();
				_dataList.push(tmp);
			});
			this.state.Lists = _dataList;


			this.thumbnailRender();
		});
	};*/
	
	queryList(params) {
		const {dispatch,dataList} = this.props;
		dispatch(cmsContentSearch(params)).then((result) => {
		
			if (result.apiError) {
				this.alertMsg(result.apiError.errorMessage);
				return false
			}

			let {listData} = this.state,_dataList = [];
			[...dataList.list].map((item, i) => {
				let tmp = {...item};
				//_.mapKeys(item, (val, key) => {
				//	tmp[key] = val;
				//});
				tmp.timeByOrder = moment(item.createTime).unix();
				_dataList.push(tmp);
			});
			this.state.Lists = _dataList;
			this.thumbnailRender();
		});
	};

	thumbnailRender() {
		const {dataList} = this.props;
		const container = document.getElementById('j_table');
		
		const config = {
			//选择
			"selectStatus": this.state.selectStatus,
			"setSelectStatus": this.setSelectStatus.bind(this)
		};
		ReactDOM.render(
			<ThumbnailBox
				maskLoading={false}
				types={this.state.filterParams.picType == 2 ? 'cmsTopicGrp' : 'cmsTopicSingle'}
				lists={this.props.dataList.list} 
				onThumbnail={this.handleOnThumbnail.bind(this)}
				{...config}/>, container
		);	
	};
	
	setSelectStatus(params) {
		this.setState({selectStatus: params});
	};
	
	getStatus() {
		return this.props.dataList.status;	
	};
	
	selectAll() {
		const {selectStatus} = this.state;
		let len = this.props.dataList.list.length;
		this.state.selectStatus = _.fill(new Array(len) , true);
		this.thumbnailRender();
	};
	
	selectToggle() {
		const {selectStatus} = this.state;
		this.state.selectStatus = [...selectStatus].map((val,i)=>{return !val});
		this.thumbnailRender();
	};
	
	getSelectId() {
		const {selectStatus} = this.state;
		const list = this.props.dataList.list;
		let selectIdList = [];
		[...selectStatus].map((item, i) => {
			if(item) selectIdList.push(list[i].id);
		})
		
		return selectIdList;
	};
	
	handleOnThumbnail (param) {
		//console.log(param)
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
		this.refresh("filter", dataParams);
	};
	

	closeAlert () {
		const alert = Object.assign(this.state.alert, {"show":false});
		this.setState({"alert": alert});
	};

	openAlert(config) {
		const alert = Object.assign(this.state.alert, {"show":true}, config);
		this.setState({"alert": alert});
	};

	alertMsg(msg){
		this.setState({operate:{}});
		this.openAlert({
			"bsSize": "small",
			"title": <samll style={{"fontSize":"14px"}}>提示：</samll>,
			"body": <p className="bolder center grey"><i className="ace-icon fa fa-exclamation-triangle blue bigger-120">{msg}</i></p>,
			"isButton": false
		});
	};

	keywordSearch(){
		const {params} = this.props.dataList;
		this.queryList({
			...params,
			keyword:this.state.keyword
		});
	}
	
	searchListRule(word) {
		if(word.match(/^HT[A-Z]+[a-z]+\d+/g)){
			return {
				"title": "单张合同",
				"type": "constract",
				"area": word.match(/[A-Z]+/g)[0].substr(2),
				"name": word.match(/[a-z]+/g)[0],
				"date": word.match(/\d+/g)[0].substr(0,8),
				"id": word.match(/\d+/g)[0].substr(9)
			}
		}
		if(word.match(/^HT\d+/g)){
			return {
				"title": "合同ID",
				"type": "constractId",
				"id": word.match(/\d+/g)[0]
			}
		}
		if(word.match(/^DD\d+/g)){
			return {
				"title": "订单ID",
				"type": "orderId",
				"id": word.match(/\d+/g)[0]
			}
		}
		if(word.match(/^DZD\d+/g)){
			return {
				"title": "对账单ID",
				"type": "balanceId",
				"id": word.match(/\d+/g)[0]
			}
		}
		if(word.match(/^HK\d+/g)){
			return {
				"title": "回款ID",
				"type": "paymentId",
				"id": word.match(/\d+/g)[0]
			}
		}
		if(word.match(/^XZ\d+/g)){
			return {
				"title": "下载明细",
				"type": "paymentId",
				"id": word.match(/\d+/g)[0]
			}
		}
		return {
			"title": "关键词查询",
			"type": "keyword",
			"keyword": word
		}
	};
	
	submitMergeGroup(){
		
	};

	newGroup () {
		const {selectStatus} = this.state, {dataList:{list}} = this.props;
		let selectedIDS = [];

		[...selectStatus].map((item, i)=>{
			if(item && list[i].onlineState == 1){
				selectedIDS.push(list[i].resId);
			}
		});

		if(selectedIDS.length < 2){
			this.alertMsg('请选择2个以上【已上线】的图片');
			return;
		}

		window.open('/doing/group/new/' + selectedIDS.join('&'));
	}

	joinGroup () {

	}
	
	// 合并组照
	mergeGroup () {
		
	}

}
