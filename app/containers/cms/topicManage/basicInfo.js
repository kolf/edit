import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {getBasicInfo, saveBasicInfo,cmsFilter} 		  from "app/action_creators/cms_action_creator";
import {Steps} 		  	  from "app/containers/cms/steps";
import {InfoTable} 		  	  from "app/containers/cms/infoTable";
import moment from 'moment';
import { Input, Upload, Tabs, Switch, Select, DatePicker, Icon, Button } 			  from "antd"

import "../cms.css"

import {cmsAdUrl}        from "app/api/api_config"

const uploadURL = '/api/zh' + cmsAdUrl + '/v1/upload';
const uploadPrefix = 'http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com';
const topicLinkPrefix = 'http://editorial.vcg.com/index/';
const Tabpane = Tabs.TabPane;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Dragger = Upload.Dragger;
const currentDate = (()=>{
	const d = new Date();
	const formatD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	return formatD;
})()

const select = (state) => ({
	"error": state.cms.error
});
@connect(select)

export default class BasicInfo extends Component {
	constructor (props) {
		super(props);
		let children = [];
		for (let i = 10; i < 36; i++) {
		  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
		}
		const _this = this;
		this.state = {
			"thumbnail": {
			  "idField": "topicInfo",
			  "head": [
			    {
			    	 
			      	"field": "live",
			      	"text": "专题类型",
			      	"width" : "10%",
			      	"type": "customize",
			      	customize (text) {
			      		
			        	return  <Select defaultValue={text} className="col-sm-12" onSelect={(v)=>{_this.state.thumbnail.list[0].live = v}}>
			                    	<Option value={1}>手动专题</Option>
			                    	<Option value={2}>自动专题</Option>
			                    	<Option value={3}>直播专题</Option>
			                    	
			                	</Select>
			      
			    	},
			      	/*"field": "live",
			      	"text": "是否直播",
			      	"width" : "10%",
			      	"type": "customize",
			      	customize (text) {
			        	return <div><Switch checked={text} onChange={(enable)=>{
			        		_this.state.thumbnail.list[0].live = Number(enable);
			        		_this.forceUpdate();
			        	}}/></div>
			      	}*/
			    },
			    {
			      	"field": "onlineTime",
			      	"text": "上线时间",
			      	"width" : "20%",
			      	"type": "customize",
			      	customize (text) {
			      		if(!text){
	          				text = currentDate;
			      		}
			      		if(text.length < 11){
			      			text += ' 00:00:00';
			      		}
			        	return <DatePicker  defaultValue={moment(text, 'YYYY-MM-DD HH:mm:ss')} showTime format="YYYY-MM-DD HH:mm:ss" placeholder="Select Time" onChange={(dateStrCTM, dateStr)=>{
	        					_this.state.thumbnail.list[0].onlineTime = dateStr;
			        			_this.forceUpdate();
			        	}} />
			      	}
			    },
			    {
			      "field": "title_cn",
			      "text": "中文标题",
			      "width" : "20%",
			      "type": "customize",
			      customize (text) {
			        return <input defaultValue={text} className="col-sm-8" onChange={(e)=>{
			        	_this.state.thumbnail.list[0].title_cn = e.target.value;
			        }}/>
			      }
			    },
			    {
			      "field": "keyword",
			      "text": "关键词",
			      "type": "customize",
			      customize (text) {
			        return <input defaultValue={text} className="col-sm-8" onChange={(e)=>{
			        	_this.state.thumbnail.list[0].keyword = e.target.value;
			        }}/>
			      }
			    }
			  ],
			  list: []
			},
			"coverPic": {
				"idField": "coverPic",
				"head": [
				    {
				      	"field": "column",
				      	"text": "栏目",
				      	"width" : "10%",
				      	"type": "customize",
				      	customize (text) {
				      		
				        	return  <Select labelInValue defaultValue={{ key: text }} className="col-sm-8" onSelect={(v)=>{_this.state.coverPic.list[0].column = v.key}}>
				                    	<Option value='1'>编辑</Option>
				                    	<Option value='2'>创意</Option>
				                    	<Option value='3'>视频</Option>
				                    	<Option value='4'>音乐</Option>
				                	</Select>
				      }
				    },
				    {
				      	"field": "categories",
				      	"text": "分类",
				      	"width" : "20%",
				      	"type": "customize",
				      	customize (text) {
				      		let {categories} = _this.props;
				      		if(categories instanceof Array){
				      			let optionArr = [];
				      			categories.forEach((item, i)=>{
				      				optionArr.push(<Option value={item.id.toString()} key={i}>{item.name}</Option>)
				      			});
				      			return <Select labelInValue defaultValue={{ key: text }} className="col-sm-8" onSelect={(v)=>{_this.state.coverPic.list[0].categories = v.key}}>
				      					{optionArr}
				                	</Select>
				      		}
				        	
				      	}
				    },
				    {
				      	"field": "coverPic",
				      	"text": "封面图",
				      	"width" : "20%",
				      	"type": "customize",
				      	customize (text) {
				      		const props = {
							  	name: 'cmsPicFile',
							  	showUploadList: false,
							  	action: uploadURL,
							  	listType: 'picture',
							  	multiple:false,
							  	data:{
							  		width:500,
							  		height:500
							  	}
							};

				        	return <div><Upload {...props} onChange={_this.handleOnUpload.bind(_this, 'coverPic', 0, 'coverPic')}>
				        		<img src={text} />
						      	<Button type="ghost" >
						        	<Icon type="upload" /> 点击上传
						      	</Button>

						    </Upload>	<span style={{color:"red"}}>尺寸限制为宽高都不能超过170</span></div>
				      	}
				    }/*,
				    {
				      	"field": "url",
				      	"type": "customize",
				      	"text": "网页地址",
				      	customize (text) {
				        	return <Input addonBefore={<label>{topicLinkPrefix}</label>} defaultValue={text && text.replace(topicLinkPrefix, '')}
				        		onChange={(e)=>{
				        			_this.state.coverPic.list[0].url = e.target.value;
				        	}}/>
				      	}
				    }*/
				],
			  	list: []
			},
			"banner": {
			  	"idField": "banner",
			  	"head": [
			    {
			      	"field": "banner",
			      	"text": "缩略图",
			      	"width" : "20%",
			      	"type": "customize",
			      	customize (text) {
			        	const props = {
						  	name: 'cmsPicFile',
						  	showUploadList: false,
						  	action: uploadURL,
						  	listType: 'picture',
						  	multiple:false,
						  	data:{
						  		width:1920,
						  		height:150
						  	}
						};

			        	return <div><Upload {...props} onChange={_this.handleOnUpload.bind(_this, 'banner', 0, 'banner')}>
			        		<img src={text} style={{height:"50px"}}/>
					      	<Button type="ghost" >
					        	<Icon type="upload" /> 点击上传
					      	</Button>

					    </Upload>	<span style={{color:"red"}}>尺寸限制为高度150px,宽度最少尺寸1366px</span></div>
			      	}
			    },
			    {
			      	"field": "title",
			      	"text": "标题",
			      	"width" : "30%",
			      	"type": "customize",
			      	customize (text) {
			        	return  <input defaultValue={text} className="col-sm-10" onChange={(e)=>{
				        			_this.state.banner.list[0].title = e.target.value;
				        	}}/>
			      	}
			    },
			    {
			      	"field": "link",
			      	"text": "链接",
			      	"type": "customize",
			      	customize (text) {
			        	return <input defaultValue={text} className="col-sm-10" onChange={(e)=>{
				        			_this.state.banner.list[0].link = e.target.value;
				        	}}/>
			      	}
			    }
			  ],
			  	list: []
			},
			"manualTopic" : {
				"idField" : "manualTopic",
				"head" : [
					{
						"field" : "sequence",
			      		"text" : "序号",
			      		"width" : "5%"
					},
					{
						"field" : "pic",
			      		"text" : "缩略图",
			      		"width" : "15%",
				      	"type": "customize",
				      	customize (text, index) {
				        	const props = {
							  	name: 'cmsPicFile',
							  	showUploadList: false,
							  	action: uploadURL,
							  	listType: 'picture',
							  	multiple:false,
							  	data:{
							  		width:294,
							  		height:180
							  	}
							};

				        	return <Upload {...props} onChange={_this.handleOnUpload.bind(_this, 'manualTopic', index, 'pic')}>
				        		<img src={text} />
						      	<Button type="ghost" >
						        	<Icon type="upload" /> 点击上传
						      	</Button>

						    </Upload>
				      	}
					},
				    {
				      	"field": "title",
				      	"text": "标题",
				      	"width" : "30%",
				      	"type": "customize",
				      	customize (text, index) {
				        	return <div><input defaultValue={text} className="col-sm-6" onChange={(e)=>{
				        		_this.state.manualTopic.list[index].title = e.target.value;
				        	}}/><label><i>最多字数不能超过24个字</i></label></div>
				      	}
				    },
				    {
				      	"field": "link",
				      	"text": "链接",
				      	"type": "customize",
				      	customize (text, index) {
				        	return <Input addonBefore={<label>http://</label>} defaultValue={text && text.slice(7)} onChange={(e)=>{
				        		_this.state.manualTopic.list[index].link = 'http://' + e.target.value;
				        	}}/>
				      	}
				    }
				],
				"list" : []
			},
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

		this.currentTopic = props.params.topicId;
	};

	static contextTypes = {
		"router": React.PropTypes.object.isRequired
	};

	componentDidMount () {
		this.init();
	};

	componentWillReceiveProps(props){
		const {operate} = props;

		//console.log(props)
		if(operate.index == 1){
			this[operate.type]({});
		}else if(props.params.topicId != this.currentTopic){
			this.init();
		}
	}

	render () {
		const {alert} = this.state;
		return (<div>
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
				<Tabs type="card">
					<Tabpane tab="专题信息" key="1">
						<div id="thumbnailTable"><InfoTable {...this.state.thumbnail}/></div>
						<div id="coverPicTable"><InfoTable {...this.state.coverPic} /></div>
					</Tabpane>
				</Tabs>
				<Tabs type="card">
					<Tabpane tab="banner图" key="1"><div id="bannerTable"><InfoTable {...this.state.banner} /></div></Tabpane>
				</Tabs>
				
		</div>)
	};

	init () {
		const {dispatch, params} = this.props;
		//console.log("topicId",params.topicId);
		
		if(params.topicId == 0){
			Object.assign(this.state.thumbnail.list, [{onlineTime:currentDate}]);
			Object.assign(this.state.coverPic.list, [{}]);
			Object.assign(this.state.banner.list, [{}]);
			Object.assign(this.state.manualTopic.list, [{sequence:1},{sequence:2},{sequence:3},{sequence:4}]);
			this.forceUpdate();
			return;
		}
		dispatch(getBasicInfo(params)).then((result) => {
			//console.log("result.apiResponse",result);
			if (result.apiError) return false;

			
			this.state.thumbnail.list[0]=result.apiResponse.thumbnail.list;
			this.state.coverPic.list[0]=result.apiResponse.coverPic.list;
			//topicInfo

			const banner = result.apiResponse.banner;
			const manualTopic = result.apiResponse.manualTopic;
			if(banner.list){
				Object.assign(this.state.banner, banner);
			}else{
				this.state.banner.list = [{}];
			}
			if(manualTopic.list){
				Object.assign(this.state.manualTopic, manualTopic);
			}else{
				this.state.manualTopic.list = [{sequence:1},{sequence:2},{sequence:3},{sequence:4}];
			}
			this.forceUpdate();
		});
		// dispatch(cmsFilter(params)).then((result) => {
		// 	if (result.apiError) return false;
		// 	this.setState({
		// 		categories : result.apiResponse
		// 	});
		// });
	};
	saveInit () {
		const {dispatch, params} = this.props;
	
		dispatch(getBasicInfo(params)).then((result) => {
			if (result.apiError) return false;

			//console.log("result.apiResponse",result.apiResponse);
			this.state.thumbnail.list[0]=result.apiResponse.thumbnail.list;
			this.state.coverPic.list[0]=result.apiResponse.coverPic.list;
			//topicInfo

			const banner = result.apiResponse.banner;
			const manualTopic = result.apiResponse.manualTopic;
			if(banner.list){
				Object.assign(this.state.banner, banner);
			}else{
				this.state.banner.list = [{}];
			}
			
			this.forceUpdate();
		});
		// dispatch(cmsFilter(params)).then((result) => {
		// 	if (result.apiError) return false;
		// 	this.setState({
		// 		categories : result.apiResponse
		// 	});
		// });
	};

	handleOnTable () {

	};

	handleOnUpload(field, index, key, fileInfo){
		let _this=this;
		if(fileInfo.file.response){
			let isUpload=true;
			let img=new Image();
	        img.src=uploadPrefix + fileInfo.file.response.data.fileSrc;
	        img.onload = function() {
	  
	            if(field=="coverPic"&&(img.width>170||img.height>170))
	            {
					_this.alertMsg("尺寸限制为宽高都不能超过170");
					isUpload=false;

	            }
	            else if(field=="banner"&&(img.width<1366||img.height!=150))
	            {
	            	_this.alertMsg("尺寸限制为高度150,宽度最少尺寸1366");
					isUpload=false;
	            }
	            if(isUpload)
		        {
		        	_this.state[field].list[index][key] = uploadPrefix + fileInfo.file.response.data.fileSrc;
					_this.forceUpdate();
		        }
	        }
	        
			
		}
	};

	changeLiveState (enable) {
		if(enable){

		}
	}

	setLiveTime () {
		
	}

	save({param, callBack}){
		debugger;
		//console.log("save");
		const {dispatch, params:{topicId}} = this.props;
		const {thumbnail, coverPic, banner, manualTopic} = this.state;

		let params = {
			topicId:topicId,
			baseIsLive:thumbnail.list[0].live,
			basePublicTime:thumbnail.list[0].onlineTime,
			baseTitle:thumbnail.list[0].title_cn,
			baseKeywords:thumbnail.list[0].keyword,
			baseLanmuType:coverPic.list[0].column,
			baseCategory:coverPic.list[0].categories,
			baseCover:coverPic.list[0].coverPic,
			baseLink:topicLinkPrefix + coverPic.list[0].url,
			baseBannerUrl: banner.list[0].banner,
			baseBannerTitle: banner.list[0].title,
			baseBannerLink: banner.list[0].link
			//baseManualTopic:manualTopic.list
		};
		//console.log("param",params);

		if(param){
			Object.assign(params, param);
		}

		
		dispatch(saveBasicInfo(params)).then((result) => {
			if (result.apiError) {
				this.alertMsg("操作失败");
				return false;
			}
			this.alertMsg("操作成功");
			if(callBack){
				callBack(result.apiResponse.topicId);
			}
		});
	}

	submit(){
		const validationMsg = this.validate();
		
		let _this=this;
		this.props.params.topicId;
		if(validationMsg){
			this.alertMsg('进入下一步之前，' + validationMsg);
			return;
		}

		const {dispatch, params:{topicId}, history} = this.props;
		const {thumbnail, coverPic, banner, manualTopic} = this.state;

		this.save({
			param : {
				next : true
			},
			callBack : (topicId)=>{
				// window.location.reload();
				this.props.params.topicId=topicId;
				this.saveInit();
				this.context.router.push("/cms/topicManage/" + topicId + "/2");
			}
		});
	};

	validate(){
		const {
			thumbnail,
			coverPic,
			banner,
			manualTopic
		} = this.state;

		const tData = thumbnail.list[0],
			  cData = coverPic.list[0],
			  bData = banner.list[0],
			  mData = manualTopic.list;

		let errorMsg = '';

		if(!tData.title_cn){
			errorMsg = '请输入专题信息的中文标题';
		}else if(!tData.keyword){
			errorMsg = '请输入专题信息的关键词';
		}else if(!cData.column){
			errorMsg = '请选择专题信息的栏目';
		}else if(!cData.categories){
			errorMsg = '请选择专题信息的分类';
		}else if(!cData.coverPic){
			errorMsg = '请上传专题信息的封面图';
		}else if(!bData.banner){
			errorMsg = '请上传banner图的缩略图';
		}else if(!bData.title){
			errorMsg = '请输入banner图的标题';
		}else if(!bData.link){
			errorMsg = '请输入banner图的链接';
		}/*else{
			mData.map((item, i)=>{
				if(!item.pic){
					errorMsg = '请上传手动专题位'+(i+1)+'的缩略图';
				}else if(!item.title){
					errorMsg = '请输入手动专题位'+(i+1)+'的标题';
				}else if(!item.link){
					errorMsg = '请输入手动专题位'+(i+1)+'的链接';
				}
			});
		}*/

		return errorMsg;
	}

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
	}
}