import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {topicCfg, feFilter, saveFilter,cmsGetChildFilter,cmsSaveLinkageFilter,cmsDeleteLinkageFilter,cmsSaveLinkageFilterTag} 		  from "app/action_creators/cms_action_creator";

import {Steps} 		  	  from "app/containers/cms/steps";
import {InfoTable} 		  	  from "app/containers/cms/infoTable";
import {LinkageInfoTable}  from "app/containers/cms/linkageInfoTable";
import moment from 'moment';
import { Upload, Tabs, Switch, Select, DatePicker, Icon, Button, Input } 			  from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;
const currentDate = (()=>{
	const d = new Date();
	const formatD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
	return formatD;
})()

const MultiSelect = React.createClass({
	getInitialState () {
		let o = {};
		this.props.selectedItems.map((item)=>{
			o[item.id || item] = true;
		})
	    return {"selectedItems": o};
	},
	render (){
		const {list, disabled} = this.props;
		const {selectedItems} = this.state;
		return (
			<ul className="filterSelect">
				{[...list].map((item, i) => {
					let checked='', key = item.id || item, text = item.name || item;
					if(selectedItems[key]){
						checked = "true";
					}
					return <li key={i}><label><input type="checkbox" defaultChecked={checked} disabled={disabled} onClick={this.setActive.bind(this, key)}/>{text}</label></li>;
				})}
			</ul>
		)
	},
	setActive (item){
		const {selectedItems} = this.state;
		let a = [];
		if(selectedItems[item]){
			delete selectedItems[item];
		}else{
			selectedItems[item] = true;
		}

		for(let o in selectedItems){
			a.push(o);
		}

		this.props.handleMultiSelect(a);
	}
});

const select = (state) => ({
	"error": state.cms.error
});
@connect(select)

export default class FeFilter extends Component {
	constructor (props) {
		super(props);
		const _this = this;
		this.state = {
			stepButtons:[{
				"className" : "btn-success",
				"icon" : "fa-save",
				"handler" : this.save.bind(this),
				"text" : "保存筛选项"
			}],
			stepLinkageButtons:[{
				"className" : "btn-success",
				"icon" : "fa-save",
				"handler" : this.saveLinkage.bind(this),
				"text" : "保存联动项"
			}],
			"categories" : [],
			"feFilter" : {
			  "idField": "feFilter",
			  "template": "sports",
			  "head": [
			    {
			      	"field": "name",
			      	"text": "筛选条件名称",
			      	"width": "15%",
			      	"type": "customize",
			      	customize (text, index) {
			        	if(index < 6){
			          		return text;
			        }else{
			          	return <div><Button className="btn-danger fr" shape="circle" icon="cross" onClick={_this.delFilter.bind(_this, index)} /><label>标签：</label><input value={text} onChange={_this.handleInputChange.bind(_this, "feFilter", index)}/></div>;
			        }
			      }
			    },
			    {
			      "field": "content",
			      "text": "筛选项",
			      "width" : "60%",
			      "type": "customize",
			      customize (contentArr, index) {
			        if(index >= 4 || index == 0){
			          return (<div>
			            {[...contentArr].map((item, i) => {
			              return <span key={i}><input style={{width:80}}  value={item} onChange={_this.handleInputChange.bind(_this, "feFilter", index, i)}/>
			              		<Button shape="circle" size="small" icon="minus" className="btn-danger" onClick={_this.delFilterContent.bind(_this, index, i)}></Button></span>;
			            })}
			          	<Button size="small" shape="circle" type="primary" icon="plus" onClick={_this.addFilterItem.bind(_this, index)}></Button></div>)
			        // }else if(index == 4){
			        //   return <MultiSelect list={contentArr} selectedItems={contentArr || []}/>
			        }else if(index == 3){
			          const levels = [{id:1,name:'A'}, {id:2,name:'B'}, {id:3,name:'C'},{id:4,name:'D'},{id:5,name:'E'}];
			          return <MultiSelect list={levels} selectedItems={contentArr || []} handleMultiSelect={_this.handleMultiSelect.bind(_this, index)}/>
			        }else if(index == 2){
			          return <MultiSelect list={_this.state.categories} selectedItems={contentArr || []} handleMultiSelect={_this.handleMultiSelect.bind(_this, index)}/>
			        }else{
			        	contentArr[0] = contentArr[0] || currentDate;
			        	contentArr[1] = contentArr[1] || currentDate;
			        	if(contentArr[0].length < 11){
				      		contentArr[0] += ' 00:00:00';
				      	}
				      	if(contentArr[1].length < 11){
				      		contentArr[1] += ' 00:00:00';
				      	}
			          	return <div><DatePicker style={{width:200}} defaultValue={moment(contentArr[0], 'YYYY-MM-DD HH:mm:ss')} format="YYYY-MM-DD HH:mm:ss" showTime={true} onChange={_this.handleTimeChange.bind(_this, 0)}/>-
			          				<DatePicker style={{width:200}} defaultValue={moment(contentArr[0], 'YYYY-MM-DD HH:mm:ss')} format="YYYY-MM-DD HH:mm:ss" showTime={true} onChange={_this.handleTimeChange.bind(_this, 1)}/></div>
			        }
			      }
			    },
			    {
			      	"field": "sequence",
			      	"text": "筛选次序",
			      	"width": "15%",
			      	"type": "customize",
			      	customize (text, index) {
			        	return <Input defaultValue={text} onChange={(e)=>{_this.state.feFilter.list[index].sequence=e.target.value}}/>
			      }
			    },
			    {
			      "field": "fetch",
			      "text": "前台是否显示",
			      "type": "customize",
			      customize (text, index) {
			        return <Switch defaultChecked={text} onChange={(v)=>{_this.state.feFilter.list[index].fetch=v}}/>
			      }

			    }
			  ],
			  	list: []
			},
			"linkageFilterList" :{} ,
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
	};

	static contextTypes = {
		"router": React.PropTypes.object.isRequired
	};

	componentDidMount () {
		this.init();
		this.initLinkageFilter("","","");
	};

	componentWillReceiveProps(props){
		const {operate} = props;

		if(operate.index == 3){
			this[operate.type]();
		}
	};

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
			<InfoTable {...this.state.feFilter} />
			<Button className="addTagBtn" size="large" type="primary" onClick={this.addFilter.bind(this)}>+ 新建标签</Button>
			<Steps className="bottomSteps" stepButtons={this.state.stepButtons}/>
			<div style={{margin:"10px 10px",fontSize:"16px" }}>联动筛选项设置：</div>
			<LinkageInfoTable handleSaveTag={this.saveTagClick.bind(this)} handleDeleteFilterClick={this.deleteFilterClick.bind(this)} handleGetLinkageFilter={this.getLinkageFilter.bind(this)} handleSaveLinkageFilter={this.saveLinkageFilter.bind(this)} linkageFilterList={this.state.linkageFilterList} />
			
			
		</div>);
	};

	init () {
		const {dispatch, params} = this.props;

		dispatch(feFilter(params)).then((result) => {
			if (result.apiError) return false;
			// const feFilter = Object.assign(this.state.feFilter, result.apiResponse.feFilter);
			let list = [];
			result.apiResponse.feFilter.list.map((item, i)=>{
				let o = item[Object.keys(item)[0]];
				o.fetch = o.fetch || false;
				list.push(item[Object.keys(item)[0]]);
			});
			this.state.feFilter.list = list;
			this.setState({
				categories : result.apiResponse.categories.list
			});
		});
	};

	initLinkageFilter(level,pid,id){
		//console.log("level",level);
		/* let data={"levelOne":{name:"时间",content:[{id:"1",name:"5月10号"},{id:"2",name:"5月11号"}],selected:"1"},
                  "levelTwo":{name:"地点",content:[{id:"3",name:"T台"},{id:"4",name:"红毯"}],selected:"3"},
                  "levelThree":{name:"人物",content:[{id:"5",name:"范冰冰"},{id:"6",name:"成龙"}],selected:""} }         
*/


		
		
		const {dispatch, params} = this.props;
		if(level&&id)
		{
			params.level=level;
			params.filterId=id;
			params.pid=pid;
		}
		
		dispatch(cmsGetChildFilter(params)).then((result) => {
			if (result.apiError) return false;
			//console.log("filterdataq",result.apiResponse);
			this.setState({
				linkageFilterList : result.apiResponse
			});
			
		});
	}
	//标签点击联动事件
	getLinkageFilter(level,pid,id){
		this.initLinkageFilter(level,pid,id);
	};
	//保存筛选项信息
	saveLinkageFilter(level,id,pid,ppid,name,callBack)
	{
		let _this=this;
		if(!name)
		{
			_this.alertMsg("请输入筛选条件内容");
			return;
		}
		const {dispatch, params} = this.props;
		
		
		params.id=id;
		params.name=name;
		params.pid=pid;
		params.level=level;
		dispatch(cmsSaveLinkageFilter(params)).then((result) => {
			
			if (result.apiError) {
				this.alertMsg(result.apiError.errorMessage);
				return false;
			}
			else
			{
				_this.alertMsg("操作成功");
				let resId=result.apiResponse.id;
				let resPId="";
				if(level==1)
				{
					_this.initLinkageFilter(level,pid,resId);
				}
				else if(level=="2")//操作的二级
				{
					_this.initLinkageFilter(level,pid,resId);
				}
				else if(level=="3")//操作的三级
				{
					_this.initLinkageFilter("2",ppid,pid);
				}
				
			}
			if(callBack){
				
				callBack(result);
			}
		});
	}
	//保存标签
	saveTagClick(param)
	{
		const {dispatch, params} = this.props;
		let _this=this;
		param.topicId=params.topicId;
		if(!param.topicId)
		{
			_this.alertMsg("操作失败");
			return ;
		}
		dispatch(cmsSaveLinkageFilterTag(param)).then((result) => {
			
			if (result.apiError) {
				this.alertMsg(result.apiError.errorMessage);
				return false;
			}
			else{
				_this.initLinkageFilter("","","");
				_this.alertMsg("操作成功");	
			}
			
		});

	}
	deleteFilterClick(id)
	{
		let _this=this;
		const {dispatch, params} = this.props;		
		
		params.id=id;
		
		dispatch(cmsDeleteLinkageFilter(params)).then((result) => {
			
			if (result.apiError) {
				this.alertMsg(result.apiError.errorMessage);
				return false;
			}
			else
			{
				_this.alertMsg("操作成功");
				/*let resId=result.apiResponse.id;
				let resLevel=level=="3"?"2":level;*/
				
				_this.initLinkageFilter("","","");
			}
			
		});
	}
	handleOnTable () {

	};

	handleInputChange (stateIndex, row, i, e) {
		if(e){
			this.state[stateIndex].list[row].content[i] = e.target.value;
		}else{
			this.state[stateIndex].list[row].name = i.target.value;
		}
		
		this.forceUpdate();
	}

	handleTimeChange (index, dateStrCTM, dateStr) {
		this.state.feFilter.list[1].content[index] = dateStr;
		this.forceUpdate();
	}

	handleMultiSelect (index, content) {
		this.state.feFilter.list[index].content = content;
		this.forceUpdate();
	}

	addFilter () {
		this.state.feFilter.list.push({
          "name" : "",
          "content": [],
          "fetch": true
        });
		this.forceUpdate();
	}

	delFilter (i) {
		this.state.feFilter.list.splice(i, 1);
		this.forceUpdate();
	}

	addFilterItem (index) {
		this.state.feFilter.list[index].content.push("");
		this.forceUpdate();
	}

	delFilterContent (rowIndex, i) {
		this.state.feFilter.list[rowIndex].content.splice(i, 1);
		this.forceUpdate();
	}

	save(callBack){

		const {dispatch, params:{topicId}} = this.props;
		const {feFilter:{list}} = this.state;

		let alters = [];
		list.slice(6).map((item, i)=>{
			alters.push({
				name:item.name,
				content:item.content,
				sequence:item.sequence,
				fetch:item.fetch
			});
		})

		let params = {
			topicId:topicId,
			filterMasterCate:{
				name:list[0].name,
				content:list[0].content,
				sequence:list[0].sequence,
				fetch:list[0].fetch
			},
			filterInDate:{
				name:list[1].name,
				content:list[1].content,
				sequence:list[1].sequence,
				fetch:list[1].fetch
			},
			filterCategory:{
				name:list[2].name,
				content:list[2].content,
				sequence:list[2].sequence,
				fetch:list[2].fetch
			},
			filterLevel:{
				name:list[3].name,
				content:list[3].content,
				sequence:list[3].sequence,
				fetch:list[3].fetch
			},
			// filterBrand:list[4].content,
			filterLocation:{
				name:list[4].name,
				content:list[4].content,
				sequence:list[4].sequence,
				fetch:list[4].fetch
			},
			filterName:{
				name:list[5].name,
				content:list[5].content,
				sequence:list[5].sequence,
				fetch:list[5].fetch
			},
			filterOther:alters
		};
		if(alters.length == 0){
			delete params.filterOther
		}

		if(callBack){
			params.next = true;
		}

		
		
		dispatch(saveFilter(params)).then((result) => {
			//console.log("result",result.apiError);
			if (result.apiError) {
				this.alertMsg(result.apiError.errorMessage);
				return false;
			}
			else
			{
				this.alertMsg("操作成功");
			}
			if(callBack){
				
				callBack(result.apiResponse.topicId);
			}
		});
	}
	//保存联动筛选项
	saveLinkage(){

	}
	submit(){
		this.save((topicId)=>{
			this.context.router.push("/cms/topicManage/" + topicId + "/4");
		});
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