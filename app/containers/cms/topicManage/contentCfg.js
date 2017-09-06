import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"

import {picList} 		  from "app/action_creators/cms_action_creator";

import { Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";

import Pagination from "antd/lib/pagination";
import {ExThumbnailBox}   from "app/containers/cms/exThumbnail";
import {Steps} 		  	  from "app/containers/cms/steps";

let recommendCount = 0;
const maxRecommendCount = 5;

const select = (state) => ({
	"error": state.cms.error
});
@connect(select)

export default class ContentCfg extends Component {
	constructor (props) {
		super(props);

		this.state = {
			"crumbs": [
				{"path": "/home", "text": "首頁"},
				{"path": "/cms/topicManage", "text": "内容运营平台：专题管理"},
				{"path": "/cms/topicManage/contentCfg", "text": "内容管理"}
			],
			"activePage": 1,
			"pageSize": 5,
			"params" : this.props.params,
			"dataList" : {
				"addition": [
					{
						"type" : "recommend"
					},
					{
						"type" : "input",
						"field" : "describe",
						"label" : "标题："
					},
					{
						"type" : "input",
						"field" : "link",
						"label" : {
							"type" : "select",
							"value" : ["链接", "组照", "专题"]
						}
					}
				],
				"list" : []
			}
		}
	};

	static contextTypes = {
		"router": React.PropTypes.object.isRequired
	};

	render () {
		const {crumbs,activePage,loadingShow,loadingTarget,dataList} = this.state;
		//console.log("数据结果",dataList);
		//分页组件模块化
		const paginationInit = {
			"current": activePage,
			"pageSize": pageSize,
			"total": dataList.total,
			"showSizeChanger": true,
			"showQuickJumper": true,
			showTotal () {
				return '共 '+dataList.total+' 条';
			},
			onShowSizeChange (current,pageSize) {
				self.refresh("pagination",{"pageNum":current,"pageSize":pageSize});
			},
			onChange(current) {
				self.refresh("pagination",{"pageNum":current});
			}
		};

		const pages = this.state.dataList.pages || activePage;
		return <div className="main-content-inner">
				<CrumbsBox crumbs={crumbs} />
				<div className="row">
					{/*分页组件引用*/}
					<div className="dataTables_paginate pull-right">
						<Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger showQuickJumper showTotal={paginationInit.showTotal} onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}  />
					</div>

				</div>
				<ExThumbnailBox {...this.state.dataList} recommend={this.handleRecommend.bind(this)} contentChange={this.contentChange.bind(this)}/>
				
				{/*分页组件引用*/}
				<div className="dataTables_paginate pull-right">
					<Pagination {...paginationInit} /></div>
				<Steps goPreview={this.goPreview.bind(this)} className="alignCenter"/>
			</div>
	}

	componentDidMount () {
		this.init();
	};

	init () {
		const {dispatch, params} = this.props;
		this.queryList(params);
	}

	queryList (params) {
		const {dispatch} = this.props;
		dispatch(picList(params)).then((result) => {
			if (result.apiError) return false;
			Object.assign(this.state.dataList, result.apiResponse.picList);
			for(let i = 0, list = result.apiResponse.picList.list, len = list.length;i < maxRecommendCount;i++){
				if(!list[i].recommend){
					recommendCount = i + 1;
					break;
				}
			}
			this.forceUpdate();
		});
	}

	handleOnPagination (current,pageSize) {
		this.setState({activePage: current,pageSize: pageSize});
		const {params} = this.props.dataList;
		const paramsData = Object.assign({}, params, {"pageNum": current,"pageSize":pageSize});
		this.queryList(paramsData);
	}

	handleRecommend (index, operate) {
		let list = this.state.dataList.list;
		const targetPic = list.splice(index, 1)[0];
		if(operate){
			targetPic.recommend = true;
			list.unshift(targetPic);
			if(list[maxRecommendCount].recommend){
				list[maxRecommendCount].recommend = false;
			}
			recommendCount++;
		}else{
			targetPic.recommend = false;

			list.splice(recommendCount - 2, 0, targetPic);
			recommendCount--;
		}

		this.updateLocal();
	}

	goPreview () {
		this.context.router.push("/cms/channelManage/channelPreview");
	}

	contentChange (index, field, value) {
		this.state.dataList.list[index][field] = value;
		this.forceUpdate();
	}

	updateLocal () {
		const list = this.state.dataList.list.concat();
		this.state.dataList.list = [];
		this.forceUpdate();

		setTimeout(()=>{
			this.state.dataList.list = list;
			this.forceUpdate();
		}, 0)
	}
}