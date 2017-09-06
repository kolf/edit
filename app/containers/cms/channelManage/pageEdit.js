import React, {Component} from "react";
import ReactDOM           from "react-dom";

import CrumbsBox          from "app/components/common/crumbs";
import TableBox          from "app/components/common/table";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {channelCfg, scrollList, picList}      from "app/action_creators/cms_action_creator";
import {Steps}          from "app/containers/cms/steps";

import SeoConfig      from "app/containers/cms/channelManage/seoConfig"
import FontPage          from "app/containers/cms/channelManage/mainFontPage"
import CreativeFontpage    from "app/containers/cms/channelManage/creativeFontpage"
import NologFontPage    from "app/containers/cms/channelManage/notLogged"
import ChannelPage    from "app/containers/cms/channelManage/ChannelPage"
import ScrollPage    from "app/containers/cms/channelManage/scrollPage"


import {Upload, Tabs, Switch, Select, DatePicker, Icon, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;


let Content = FontPage;
let currentPath = "网站首页";
let parentPath = "";
let childPath = "";

export default class ChannelConfig extends Component {
	constructor (props) {
		super(props);
		const {params,location} = props;
		const currentTitle = (location.state && location.state.title)?location.state.title:'';
		switch(params.id){
			case "139":
				Content = FontPage;
				parentPath = "VCG首页";
				currentPath = '';
				childPath = "/cms/channelManage/config/139";
				break;
			case "138":
				Content = CreativeFontpage;
				parentPath = "创意图片首页";
				currentPath = '';
				childPath = "/cms/channelManage/config/138";
				break;
			case "137":
				Content = NologFontPage;
				parentPath = "页面管理";
				currentPath = currentTitle;
				childPath ="page";
				break;
			case "34":
				Content = ScrollPage;
				currentPath = "滚动";
				break;
			default:
				Content = ChannelPage;
				parentPath = "编辑频道页";
				currentPath = currentTitle;
				childPath = "/cms/channelManage/channel";
				break;
		}
		this.state = {
			"crumbs": [
				//{"path":"/home", "text":"首頁"},
				//{"path":"cms/channelManage/"+childPath,"text":"内容运营平台"},
				{"path":childPath, "text":parentPath},
				{"path": "", "text": currentPath}
			],
			"tabIndex":props.params.tabIndex,
			"params": {},
			"operate":'',
			"alert":{
				"show": false,
				"isButton": true,
				"bsSize": "small",
				"onHide": this.closeAlert.bind(this),
				"title": null,
				"body": null,
				"submitAlert": null
			},
			"stepButtons" : [{
				"className" : "btn-success",
				"icon" : "fa-save",
				"text" : "保存",
				"handler" : this.save.bind(this)
			},/*{
				"className" : "btn-search",
				"icon" : "fa-eye",
				"text" : "预览",
				"handler" : this.goPreview.bind(this)
			},
			{
				"className" : "btn-danger",
				"icon" : "fa-send",
				"text" : "发布",
				"handler" : this.submit.bind(this)
			}*/
			]
		};
	};

	static contextTypes = {
		"router": React.PropTypes.object.isRequired
	};

	componentDidMount () {
		this.init();
	};

	render () {
		const {crumbs, topicInfo, banner, operate} = this.state;
		const alert = this.state.alert;
		const {params,location} = this.props;
		let crumbsHtml = '';
		if(params.id==139){
			crumbsHtml = <div className="breadcrumbs">
				<ul className="breadcrumb">
					<li><i className="ace-icon fa fa-home home-icon"></i>VCG首页</li>
				</ul>
			</div>
		}else if(params.id==138){
			crumbsHtml = <div className="breadcrumbs">
				<ul className="breadcrumb">
					<li><i className="ace-icon fa fa-home home-icon"></i>创意图片首页</li>
				</ul>
			</div>
		}else{
			crumbsHtml = <CrumbsBox crumbs={crumbs} />
		}
		return (
			<div className="main-content-inner">

				{crumbsHtml}

				<Modal {...alert}>
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
				</Modal>
				<div style={{position:"absolute",right:"20px",zIndex:"2",top:"60px"}}>
					<Steps className="text-right" stepButtons={this.state.stepButtons}/>
				</div>
				<div id="tabs" style={{padding:'20px'}}><Content tabIndex={this.props.params.tabIndex} id={this.props.params.id} operate={operate} resetOperate={this.resetOperate.bind(this)}/></div>
			</div>
		)
	};

	init () {

	};

	handleOnTable () {

	};

	closeAlert () {
		const alert = Object.assign(this.state.alert, {"show":false});
		this.setState({"alert": alert});
	};

	openAlert(config) {
		const alert = Object.assign(this.state.alert, {"show":true}, config);
		this.setState({"alert": alert});
	};

	save(){
		this.setState({
			operate:'save'
		});
	}

	submit(){
		//console.log("submit=======555======")
		this.setState({
			operate:'submit'
		});
	}

	resetOperate(){
		this.setState({
			operate:''
		});
	}

	goPreview () {
		this.context.router.push("/cms/channelManage/channelPreview");
	}
}
