import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";

import {Steps}          from "app/containers/cms/steps";
import BasicInfo      from "app/containers/cms/topicManage/basicInfo"
import BsFetch          from "app/containers/cms/topicManage/bsFetchConfig"
import FeFilter          from "app/containers/cms/topicManage/feFilterConfig"
import ContentManage      from "app/containers/cms/topicManage/contentManage"
import {cmsFilter, cmsTopicStatus, publicTopic}      from "app/action_creators/cms_action_creator";

import {Upload, Tabs, Switch, Select, DatePicker, Icon, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;

@connect((state) => ({
  "error": state.cms.error,
  "categories": state.cms.categories
}))

export default class TopicConfig extends Component {
  constructor(props) {
    super(props);
    
    const _this = this;
    //console.log("props.params.tabIndex",props.params.tabIndex)
    
    this.topicStatus = '';
    this.topicType = '';
    let stepArr = [];
    if (props.params.tabIndex == "1" || props.params.tabIndex == "2") {
      stepArr = [{
        "className": "btn-success",
        "icon": "fa-save",
        "handler": this.submit.bind(this),
        "text": "保存并下一步"
      }]
    }
    else if (props.params.tabIndex == "3") {
      stepArr = [{
        "className": "btn-danger",
        "icon": "fa-save",
        "handler": this.submit.bind(this),
        "text": "发布"
      }]
    }
    
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首頁"},
        {"path": "/cms", "text": "专题管理"},
        {"path": "/cms", "text": "编辑专题"}
      ],
      "params": {
        activeTab: props.params.tabIndex || 1
      },
      operate: {},
      "alert": {
        "show": false,
        "isButton": true,
        "bsSize": "small",
        "onHide": this.closeAlert.bind(this),
        "title": null,
        "body": null,
        "submitAlert": null
      },
      "stepButtons": stepArr
    };
    
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentDidMount() {
    this.init();
  };
  
  componentWillReceiveProps(props) {
    this.state.operate = {};
    this.state.params.activeTab = this.state.params.activeTab || props.params.tabIndex;
    let activeKey = this.state.params.activeTab;
    if (activeKey == 3) {
      
      this.state.stepButtons = [{
        "className": "btn-danger",
        "icon": "fa-save",
        "handler": this.submit.bind(this),
        "text": "发布"
      }]
    }
    else if (activeKey == 4) {
      this.state.stepButtons = []
    }
    else {
      this.state.stepButtons = [{
        "className": "btn-success",
        "icon": "fa-save",
        "handler": this.submit.bind(this),
        "text": "保存并下一步"
      }]
    }
  };
  
  render() {
    const {crumbs, alert, operate, params: {activeTab}} = this.state;
    
    // const {params:{tabIndex}} = this.props;
    return (
      <div className="main-content-inner">
        <CrumbsBox crumbs={crumbs}/>
        <Steps className="topSteps" stepButtons={this.state.stepButtons}/>
        <Modal {...alert}>
          <Modal.Header closeButton>
            <Modal.Title>{alert.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{"overflow": "hidden"}}>{alert.body}</Modal.Body>
          {alert.isButton &&
          <Modal.Footer>
            <Button bsClass="btn btn-sm btn-info btn-round" onClick={alert.submitAlert}>确认</Button>
            <Button bsClass="btn btn-sm btn-light btn-round" onClick={alert.onHide}>取消</Button>
          </Modal.Footer>
          }
        </Modal>
        
        <Tabs type="card" activeKey={activeTab} onChange={this.tabChange.bind(this)}>
          <Tabpane tab="1、基本信息" key="1">
            <div id="basicInfoContainer"><BasicInfo {...this.props} operate={operate}/></div>
          </Tabpane>
          <Tabpane tab="2、抓取条件" key="2">
            <div id="fetchContainer"><BsFetch {...this.props} operate={operate}/></div>
          </Tabpane>
          <Tabpane tab="3、筛选条件" key="3">
            <div id="filterContainer"><FeFilter {...this.props} operate={operate}/></div>
          </Tabpane>
          <Tabpane tab="4、内容管理" key="4">
            <ContentManage {...this.props} alertMsg={this.alertMsg.bind(this)}/>
          </Tabpane>
        </Tabs>
        {activeTab == "3" ? "" : <Steps className="bottomSteps" stepButtons={this.state.stepButtons}/>}
      </div>
    )
  };
  
  init() {
    
    const {dispatch, params} = this.props;
    
    dispatch(cmsFilter(params)).then((result) => {
      if (result.apiError) return false;
    });
    
    if (params.topicId != 0) {
      this.getTopicStatus();
    }
  };
  
  getTopicStatus() {
    /*const {dispatch, params} = this.props;
     
     dispatch(cmsTopicStatus(params)).then((result) => {
     if (result.apiError) {
     this.alertMsg('get topic status error: ' + result.apiError.errorMessage);
     return false;
     }
     
     this.topicStatus = result.apiResponse.status;
     //this.topicType=result.apiResponse.type;
     if(this.topicStatus >= 1 && this.topicStatus < 5){
     this.state.stepButtons[1].text = '发布';
     this.forceUpdate();
     }
     });*/
  };
  
  //专题状态.5.未生效.1.已上线.2已下线.3.未发布.4.已上线未发布.6.未生效第二步.7.未生效第三步
  tabChange(activeKey) {
    const {topicStatus} = this;
    
    switch (activeKey) {
      case "1":
        break;
      case "2":
        if (!topicStatus || topicStatus == 5) {
          if (!this.props.params.topicId || this.props.params.topicId == "0")//新增的时候
          {
            this.submit();
            return;
          }
          
        }
        break;
      case "3":
        if (!topicStatus || topicStatus == 6) {//未生效第二部
          if (!this.props.params.topicId || this.props.params.topicId == "0")//新增的时候
          {
            this.submit();
            return;
          }
          
        }
        break;
      case "4":
        // if(!topicStatus || topicStatus <= 6){
        // 	this.submit();
        // 	return;
        // }
        break;
      default:
        break;
    }
    
    this.state.params.activeTab = activeKey;
    //console.log("activeTabBefore",this.state.params.activeTab );
    if (activeKey == 3) {
      this.state.stepButtons = [{
        "className": "btn-danger",
        "icon": "fa-save",
        "handler": this.submit.bind(this),
        "text": "发布"
      }]
    }
    else if (activeKey == 4) {
      this.state.stepButtons = []
    }
    else {
      this.state.stepButtons = [{
        "className": "btn-success",
        "icon": "fa-save",
        "handler": this.submit.bind(this),
        "text": "保存并下一步"
      }]
    }
    
    /*this.state.stepButtons=
     "stepButtons" : [{
     "className" : "btn-success",
     "icon" : "fa-save",
     "handler" : this.save.bind(this),
     "text" : "保存"
     },{
     "className" : "btn-danger",
     "icon" : "fa-save",
     "handler" : this.submit.bind(this),
     "text" : "保存并下一步"
     }]*/
    this.forceUpdate();
  };
  
  closeAlert() {
    const alert = Object.assign(this.state.alert, {"show": false});
    this.setState({"alert": alert});
  };
  
  openAlert(config) {
    const alert = Object.assign(this.state.alert, {"show": true}, config);
    this.setState({"alert": alert});
  };
  
  alertMsg(msg) {
    this.setState({operate: {}});
    this.openAlert({
      "bsSize": "small",
      "title": <samll style={{"fontSize": "14px"}}>提示：</samll>,
      "body": <p className="bolder center grey"><i
        className="ace-icon fa fa-exclamation-triangle blue bigger-120">{msg}</i></p>,
      "isButton": false
    });
  }
  
  submitAlert() {
    this.closeAlert();
  };
  
  goPreview() {
    this.context.router.push("/cms/topicManage/topicPreview");
  }
  
  save() {
    this.setState({
      operate: {
        type: 'save',
        index: this.state.params.activeTab,
        
      }
    })
  }
  
  submit() {
    debugger;
    if (this.state.params.activeTab == 3) {
      
      this.publicTopic();
    } else {
      this.setState({
        operate: {
          type: 'submit',
          index: this.state.params.activeTab,
          
        }
      })
    }
  }
  
  publicTopic() {
    debugger;
    const {dispatch, history} = this.props;
    dispatch(publicTopic({
      topicId: this.props.params.topicId,
      next: true
    })).then((result) => {
      //console.log("result",result);
      if (result.apiError) {
        this.alertMsg(result.apiError.errorMessage);
        return false;
      }
      this.alertMsg('操作成功');
    });
  }
}