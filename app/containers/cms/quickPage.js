import React, {Component} 											from "react";
import ReactDOM           											from "react-dom";
import {Pagination, Modal, Tooltip, Overlay} 						from "react-bootstrap/lib";
import { Upload, Tabs, Switch, Select, DatePicker, Icon, Button , Popover,Card,Row, Col } 	from "antd"
import FontPage		  	  from "app/containers/cms/channelManage/mainFontPage"
import { Router, Route, hashHistory, Link, IndexRoute } from 'react-router';
export default class QuickPage extends Component{
	constructor(props){
		super(props)
		this.state ={
			"quickBtn":{
				"content":"",
				"url":"",
				"name":"老后台",
				"childBtn":[
					{
						"url":"",
						"name":"专题管理",
						"handler":this.topicManage.bind(this)
					},{
						"url":"",
						"name":"创意首页",
						"handler":this.channelManage.bind(this)
					}
				]
			}
		}
	}

	linkUrl(url,name){
		return (<Link to={url} title={name}>{name}</Link>)
	}

	render(){
		const {quickBtn} = this.state;
		const {childBtn,content} = quickBtn;
		
		return(
			<div>
				<Card title="老后台" style={{ width: "60%",marginTop: "0px",marginLeft: "15%",marginRight:"15%"}}>
					<Row type="flex">
				      <Col span={6} order={1}><a href="http://adm.cfp.cn/index/topic" target="_bank">专题管理</a></Col>
				      <Col span={6} order={2}><a href="http://adm.cfp.cn/projects/userinfo.php" target="_bank">查询摄影师</a></Col>
				    </Row>
			  	</Card>
			  	<Card title="焦点图" style={{ width: "60%",marginTop: "-15px",marginLeft: "15%",marginRight:"15%"}}>
					<Card title="首页" style={{ width: "100%"}}>
						<Row type="flex">
					      	<Col span={6} order={1}>
					      		{this.linkUrl("/cms/channelManage/config/139/1","焦点图设置")}
	                      	</Col>
					       
					      	<Col span={6} order={2}>
	                            {this.linkUrl("/cms/channelManage/config/139/3","内容推荐")}
					      	</Col>
					    </Row>
				  	</Card>
				  	<Card title="创意首页" style={{ width: "100%"}}>
						<Row type="flex">
					      	<Col span={6} order={1}>
					      		{this.linkUrl("/cms/channelManage/config/138/1","焦点图设置")}
					      	</Col>
					      	<Col span={6} order={2}>
					      		{this.linkUrl("/cms/channelManage/config/138/4","标签管理")}
					      	</Col>
					      	<Col span={6} order={3}>
					      		{this.linkUrl("/cms/channelManage/config/138/2","标签图片管理")}
					      	</Col>
					      	<Col span={6} order={4}>
					      		{this.linkUrl("/cms/channelManage/config/138/5","热点活动")}
					      	</Col>
					    </Row>
				  	</Card>
				  	<Card title="编辑未登录首页" style={{ width: "100%"}}>
						<Row type="flex">
					     	<Col span={6} order={1}>
					     		{this.linkUrl("/cms/channelManage/config/137/1","焦点图设置")}
					      	</Col>
					      	<Col span={6} order={2}>
					      		{this.linkUrl("/cms/channelManage/config/137/4","热点活动")}
					      	</Col>
					    </Row>
				  	</Card>
				  	<Card title="编辑已登录首页" style={{ width: "100%"}}>
						<Row type="flex">
						    <Col span={6} order={2}>
						    	{this.linkUrl("/cms/channelManage/config/1/1","按钮广告位")}
						    </Col>
						    <Col span={6} order={1}>
						    	{this.linkUrl("/cms/channelManage/config/1/4","编辑推荐")}
						    </Col>
					    </Row>
				  	</Card>
			  	</Card>
			  	<Card title="频道推荐" style={{ width: "60%",marginTop: "-15px",marginLeft: "15%",marginRight:"15%"}}>
					<Row type="flex">
				      	<Col span={6} order={1}>
				      		{this.linkUrl("/cms/channelManage/config/2/4","国内推荐")}
				      		{this.linkUrl("/cms/channelManage/config/2/4","国内推荐")}
				      	</Col>
				      	<Col span={6} order={2}>
				      		{this.linkUrl("/cms/channelManage/config/3/4","国际推荐")}
				      		{this.linkUrl("/cms/channelManage/config/3/4","国际推荐")}
				      	</Col>
				      	<Col span={6} order={3}>
							{this.linkUrl("/cms/channelManage/config/4/4","财经推荐")}
							{this.linkUrl("/cms/channelManage/config/4/4","财经推荐")}
						</Col>
				      	<Col span={6} order={4}>
				      		{this.linkUrl("/cms/channelManage/config/5/4","体育推荐")}
				      		{this.linkUrl("/cms/channelManage/config/5/4","体育推荐")}
				      	</Col>
				      	<Col span={6} order={5}>
				      		{this.linkUrl("/cms/channelManage/config/6/4","娱乐推荐")}
				      		{this.linkUrl("/cms/channelManage/config/6/4","娱乐推荐")}
				      	</Col>
				      	<Col span={6} order={6}>
				      		{this.linkUrl("/cms/channelManage/config/7/4","时尚推荐")}
				      		{this.linkUrl("/cms/channelManage/config/7/4","时尚推荐")}
				      	</Col>
				      	<Col span={6} order={7}>
				      		{this.linkUrl("/cms/channelManage/config/278/4","肖像推荐")}
				      		{this.linkUrl("/cms/channelManage/config/278/4","肖像推荐")}
				      	</Col>
				      	<Col span={6} order={8}>
				      		{this.linkUrl("/cms/channelManage/config/279/4","历史推荐")}
				      		{this.linkUrl("/cms/channelManage/config/279/4","历史推荐")}
				      	</Col>
				      	<Col span={6} order={9}>
				      		{this.linkUrl("/cms/channelManage/config/280/4","故事推荐")}
				      		{this.linkUrl("/cms/channelManage/config/280/4","故事推荐")}
				      	</Col>
				      	<Col span={6} order={10}>
				      		{this.linkUrl("/cms/channelManage/config/281/4","旅游推荐")}
				      		{this.linkUrl("/cms/channelManage/config/281/4","旅游推荐")}
				      	</Col>
				      	<Col span={6} order={11}>
				      		{this.linkUrl("/cms/channelManage/config/282/4","图表推荐")}
				      		{this.linkUrl("/cms/channelManage/config/282/4","图表推荐")}
				      	</Col>
				      	<Col span={6} order={12}>
				      		{this.linkUrl("/cms/channelManage/config/283/4","插图推荐")}
				      		{this.linkUrl("/cms/channelManage/config/283/4","插图推荐")}
				      	</Col>
				      	<Col span={6} order={13}>
				      		{this.linkUrl("/cms/channelManage/config/434/4","漫画推荐")}
				      		{this.linkUrl("/cms/channelManage/config/434/4","漫画推荐")}
				      	</Col>
				    </Row>
			  	</Card>
			  	<Card title="频道管理" style={{ width: "60%",marginTop: "-15px",marginLeft: "15%",marginRight:"15%"}}>
					<Row type="flex">
				     <Col span={6} order={1}>
				      		{this.linkUrl("/cms/channelManage/config/2/1","国内管理")}
				      		{this.linkUrl("/cms/channelManage/config/2/1","国内管理")}
				      	</Col>
				      	<Col span={6} order={2}>
				      		{this.linkUrl("/cms/channelManage/config/3/1","国际管理")}
				      		{this.linkUrl("/cms/channelManage/config/3/1","国际管理")}
				      	</Col>
				      	<Col span={6} order={3}>
							{this.linkUrl("/cms/channelManage/config/4/1","财经管理")}
							{this.linkUrl("/cms/channelManage/config/4/1","财经管理")}
						</Col>
				      	<Col span={6} order={4}>
				      		{this.linkUrl("/cms/channelManage/config/5/1","体育管理")}
				      		{this.linkUrl("/cms/channelManage/config/5/1","体育管理")}
				      	</Col>
				      	<Col span={6} order={5}>
				      		{this.linkUrl("/cms/channelManage/config/6/1","娱乐管理")}
				      		{this.linkUrl("/cms/channelManage/config/6/1","娱乐管理")}
				      	</Col>
				      	<Col span={6} order={6}>
				      		{this.linkUrl("/cms/channelManage/config/7/1","时尚管理")}
				      		{this.linkUrl("/cms/channelManage/config/7/1","时尚管理")}
				      	</Col>
				      	<Col span={6} order={7}>
				      		{this.linkUrl("/cms/channelManage/config/278/1","肖像管理")}
				      		{this.linkUrl("/cms/channelManage/config/278/1","肖像管理")}
				      	</Col>
				      	<Col span={6} order={8}>
				      		{this.linkUrl("/cms/channelManage/config/279/1","历史管理")}
				      		{this.linkUrl("/cms/channelManage/config/279/1","历史管理")}
				      	</Col>
				      	<Col span={6} order={9}>
				      		{this.linkUrl("/cms/channelManage/config/280/1","故事管理")}
				      		{this.linkUrl("/cms/channelManage/config/280/1","故事管理")}
				      	</Col>
				      	<Col span={6} order={10}>
				      		{this.linkUrl("/cms/channelManage/config/281/1","旅游管理")}
				      		{this.linkUrl("/cms/channelManage/config/281/1","旅游管理")}
				      	</Col>
				      	<Col span={6} order={11}>
				      		{this.linkUrl("/cms/channelManage/config/282/1","图表管理")}
				      		{this.linkUrl("/cms/channelManage/config/282/1","图表管理")}
				      	</Col>
				      	<Col span={6} order={12}>
				      		{this.linkUrl("/cms/channelManage/config/283/1","插图管理")}
				      		{this.linkUrl("/cms/channelManage/config/283/1","插图管理")}
				      	</Col>
				      	<Col span={6} order={13}>
				      		{this.linkUrl("/cms/channelManage/config/434/1","漫画管理")}
				      		{this.linkUrl("/cms/channelManage/config/434/1","漫画管理")}
				      	</Col>
				    </Row>
			  	</Card>
			</div>
		)
	}



	topicManage(){
			//console.log(props.location.query)
	}

	channelManage(){

	}
}