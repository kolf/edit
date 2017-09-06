import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs";
import TableBox          from "app/components/common/table";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {channelCfg, adPicList, recommendPicList, deleteAdPic, publicAd, picInfo, publicRecommend} 		  from "app/action_creators/cms_action_creator";
import {Steps} 		  	  from "app/containers/cms/steps";

// import {TableBox} 		  	  from "app/containers/cms/TableBox";
import {ExThumbnailBox} 		  	  from "app/containers/cms/exThumbnail";

import Recommend		  	  from "app/containers/cms/channelManage/recommend"
import Advertisement	  from "app/containers/cms/channelManage/advertisement"
import {UpdateImgData}	  from "app/containers/cms/UpdateImgData"
import { Upload, Tabs, Switch, Select, DatePicker, Icon, Button } 			  from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;

const select = (state) => ({
	"error": state.cms.error
});
@connect(select)

export default class ChannelPage extends Component {
	constructor (props) {
		super(props);
		this.state = {
			"picListData": {
			  	list: []
			},
			"activedTab" : props.tabIndex || 4,
			"filterParams": {
				"role": 2 // role 1 销售 2 财务 3 运营
			},
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
			}
		};
	};

	componentDidMount () {
		let tabIndex = this.props.tabIndex||"4";
		this.tabChange(tabIndex);
	};

	componentWillReceiveProps(props){
		const {operate} = props;
		if(operate){
			this[operate]({});
		}
	};

	render () {
		const {picListData, alert,activedTab} = this.state;
		return (
			<div>
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
			<Tabs type="card" onChange={this.tabChange.bind(this)} activeKey={activedTab}>
				<Tabpane tab="编辑推荐" key="4">
					<Recommend {...picListData}
						onUpdateData={this.updateData.bind(this,0,0)}
						updatePicInfo={this.onUpdatePicInfo.bind(this)}
						addData={this.addData.bind(this)}
						deleteData={this.deleteData.bind(this)}
						sortAble={true}/>
				</Tabpane>
				<Tabpane tab="按钮广告位" key="1">
					<Advertisement {...picListData} tipMessage={{isSame:1,message:["请上传最小尺寸为290/150的图"]}}
						onUpdateData={this.updateData.bind(this,290,150)}
						addData={this.addData.bind(this)}
						deleteData={this.deleteData.bind(this)}
						sortAble={true}/>
				</Tabpane>
			</Tabs>
			</div>
		)
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

	alertMsg(msg){
		const config = {
			"bsSize": "small",
			"title": <samll style={{ "fontSize": "14px" }}>{"提示信息"}</samll>,
			"body": <p className="bolder center grey">{msg}</p>,
			"isButton": false
		};
		this.openAlert(config);
	}

	tabChange (tabKey) {
		this.state.activedTab = tabKey;
		switch (tabKey) {
			case "1": case "4":
				this.getPicList({});
				break;
			default:
				break;
		}

	};

	getPicList (params) {
		const {dispatch, id} = this.props;
		let api = adPicList;
		let {activedTab} = this.state;
		activedTab = activedTab||this.props.tabIndex;
		if(activedTab == 4){
			api = recommendPicList;
		}
		dispatch(api({
			...params,
			id,
			type : activedTab
		})).then((result) => {
			if (result.apiError) return false;
			this.state.picListData.list = result.apiResponse.list || [];
			this.forceUpdate();
		});
	}

	updateData(width,height,index, field, value){

		let _this=this;
		if(width!=0&&height!=0&&field=="src")
		{
			UpdateImgData(width,height,index, field, value,_this);
		}
		else
		{
			_this.state.picListData.list[index][field] = value;
			_this.forceUpdate();
		}
	}

	onUpdatePicInfo(index){
		const {picListData:{list}} = this.state;
		const {dispatch} = this.props;

		dispatch(picInfo({ ...list[index] })).then((result) => {
			if (result.apiError) {
				this.message('获取图片信息失败：' + result.apiError.errorMessage);
			}else{
				Object.assign(this.state.picListData.list[index], result.apiResponse);
				this.forceUpdate();
			}
		});
	}

	addData(){
		this.state.picListData.list.push({});
		this.forceUpdate();
	}

	deleteData(index){
		const data = this.state.picListData.list[index];

		if(data.id){
			const {dispatch} = this.props;
			dispatch(deleteAdPic({
				id : data.id
			})).then((result) => {
				this.getPicList({});
			});
		}else{
			this.state.picListData.list.splice(index, 1);
			this.forceUpdate();
		}
	}

	save(params){
		const {dispatch, id, resetOperate} = this.props,
			  {activedTab, picListData} = this.state;
		let api = adPicList;
		let _this=this;
		if(activedTab == 4){
			api = recommendPicList;
		}

		dispatch(api({
			...params,
			id,
			method:'post',
			dataList:picListData.list
		})).then((result) => {
			let msg = '标签保存成功';
			if (result.apiError){
				msg = result.apiError.errorMessage;
			}

			_this.message(msg);

			_this.getPicList();
			if (result.apiError) return false;
		});
	}

	submit(){
		const {dispatch, id, resetOperate} = this.props,
			  {activedTab, picListData} = this.state;
		let api = publicAd;
		let picListLength = picListData.list.length;

		//console.log(activedTab);

		if(activedTab == 4){
			if(!picListLength%6){
				this.message("请发布12张图片！");
				return;
			}
			api = publicRecommend;
		}
		if(activedTab==1){
			if(picListLength!=4){
				this.message("请发布4张广告图片！");
				return;
			}
		}

		// if(picListData.list.length != 4){
		// 	this.message('发布的广告个数必须为4个');
		// 	return;
		// }
		dispatch(api({
			id,
			dataList:picListData.list
		})).then((result) => {
			//console.log(result)
			// this.props.resetOperate();
			if (result.apiError) {
				this.message(result.apiError.errorMessage||"发布出错！");
				return false;
			}else{
				this.message("发布成功！");
			}
		});
	}
}
