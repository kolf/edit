import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs";
import TableBox          from "app/components/common/table";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {channelCfg, scrollList, picList}      from "app/action_creators/cms_action_creator";
import {Steps}          from "app/containers/cms/steps";

// import {TableBox} 		  	  from "app/containers/cms/TableBox";
import {ExThumbnailBox}          from "app/containers/cms/exThumbnail";

import FocusPic          from "app/containers/cms/channelManage/focusPic"
import Recommend          from "app/containers/cms/channelManage/recommend"
import Hotpot          from "app/containers/cms/channelManage/hotpot"
import Advertisement    from "app/containers/cms/channelManage/advertisement"

import {Upload, Tabs, Switch, Select, DatePicker, Icon, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;

const select = (state) => ({
  "error": state.cms.error,
  "channelInfo": state.cms.channelInfo
});
@connect(select)

export default class ChannelConfig extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首頁"}
        //{"path": "/cms/channelManage", "text": '内容运营平台：' + "频道编辑"}
      ],
      "params": {},
      "alert": {
        "show": false,
        "isButton": true,
        "bsSize": "small",
        "onHide": this.closeAlert.bind(this),
        "title": null,
        "body": null,
        "submitAlert": null
      },
      "channelInfo": {
        "idField": "channelInfo",
        "head": [
          {
            "field": "title_cn",
            "text": "中文标题",
            "type": "customize",
            customize (text) {
              return <input style={{width: '100%'}} defaultValue={text}/>
            }
          },
          {
            "field": "keyword",
            "text": "KEYWORDS",
            "type": "customize",
            customize (text) {
              return <input style={{width: '100%'}} defaultValue={text}/>
            }
          },
          {
            "field": "desc",
            "type": "customize",
            "text": "描述",
            customize (text) {
              return <textarea style={{width: '100%'}} defaultValue={text}/>
            }
          }
        ],
        list: []
      },
      "picList": {
        list: []
      },
      "scrollList": {
        "idField": "scrollList",
        "head": [
          {
            "field": "scrollList",
            "text": "选择",
            "type": "checkbox"
          },
          {
            "field": "sequence",
            "text": "顺序",
            "type": "customize",
            customize (text) {
              return <input style={{width: 50}} defaultValue={text}/>
            }
          },
          {
            "field": "name",
            "text": "名称",
            "type": "customize",
            customize (text) {
              return <input style={{width: '100%'}} defaultValue={text}/>
            }
          },
          {
            "field": "link",
            "text": "链接",
            "type": "customize",
            customize (text) {
              return <input style={{width: '100%'}} defaultValue={text}/>
            }
          },
          {
            "field": "date",
            "text": "发布日期"
          },
          {},
          {
            "field": "operate",
            "type": "operate",
            "text": "位置操作",
            "value": [
              {"operate": "delete", "icon": "fa-minus-square", "text": "删除"}
            ]
          }
        ],
        list: []
      }
    };
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentDidMount() {
    this.init();
  };
  
  render() {
    const {crumbs, topicInfo, banner} = this.state;
    const alert = this.state.alert;
    const _this = this;
    return (
      <div className="main-content-inner">
        <CrumbsBox crumbs={crumbs}/>
        <Steps goPreview={this.goPreview.bind(this)} className="alignRight"/>
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
        <Tabs type="card">
          <Tabpane tab="SEO设置" key="1">
            <TableBox {...this.state.channelInfo}/>
          </Tabpane>
        </Tabs>
        <Tabs type="card" onChange={this.tabChange.bind(this)}>
          <Tabpane tab="焦点图设置" key="1">
            <FocusPic {...this.state.picList}/>
          </Tabpane>
          <Tabpane tab="滚动页设置" key="2">
            <TableBox {...this.state.scrollList} onTable={this.operateScrollList.bind(this)}/>
            <button onClick={this.addScrollItem.bind(this)}><i className="menu-icon fa fa-plus-circle"></i>新建标签</button>
          </Tabpane>
          <Tabpane tab="内容推荐" key="3">
            <Recommend {...this.state.picList}/>
          </Tabpane>
          <Tabpane tab="标签管理" key="4">
            <TableBox {...this.state.scrollList} onTable={this.operateScrollList.bind(this)}/>
            <button onClick={this.addScrollItem.bind(this)}><i className="menu-icon fa fa-plus-circle"></i>新建标签</button>
          </Tabpane>
          <Tabpane tab="订阅管理" key="5">
            <TableBox {...this.state.scrollList} onTable={this.operateScrollList.bind(this)}/>
            <button onClick={this.addScrollItem.bind(this)}><i className="menu-icon fa fa-plus-circle"></i>新建标签</button>
          </Tabpane>
          <Tabpane tab="热点活动" key="6">
            <Hotpot {...this.state.picList}/>
          </Tabpane>
          <Tabpane tab="按钮广告位" key="7">
            <Advertisement {...this.state.picList}/>
          </Tabpane>
          <Tabpane tab="编辑热点" key="8">
            <button onClick={this.gotoContentPage.bind(this)}>前去管理</button>
          </Tabpane>
        </Tabs>
        <Steps goPreview={this.goPreview.bind(this)} className="alignCenter"/>
      </div>
    )
  };
  
  init() {
    const {dispatch, params} = this.props;
    dispatch(channelCfg(params)).then((result) => {
      if (result.apiError) return false;
      Object.assign(this.state.channelInfo, result.apiResponse.channelInfo);
      Object.assign(this.state.picList, result.apiResponse.picList);
      this.forceUpdate();
    });
  };
  
  handleOnTable() {
  
  };
  
  closeAlert() {
    const alert = Object.assign(this.state.alert, {"show": false});
    this.setState({"alert": alert});
  };
  
  openAlert(config) {
    const alert = Object.assign(this.state.alert, {"show": true}, config);
    this.setState({"alert": alert});
  };
  
  tabChange(tabKey) {
    switch (tabKey) {
      case "1":
      case "3":
      case "6":
      case "7":
      case "8":
        this.getPicList();
        break;
      case "2":
        this.state.scrollList.head.splice(5, 1, {
          "field": "markKeyWord",
          "type": "customize",
          "text": "关键词标红",
          customize (text) {
            return <label><input type="checkbox" defaultChecked={text}/>标红</label>
          }
        });
        this.getScrollList();
        break;
      case "4":
      case "5":
        this.state.scrollList.head.splice(5, 1, {
          "field": "operator",
          "text": "操作人"
        });
        this.getScrollList();
        break;
      default:
        break;
    }
  };
  
  getPicList() {
    const {dispatch, params} = this.props;
    dispatch(picList(params)).then((result) => {
      if (result.apiError) return false;
      Object.assign(this.state.picList, result.apiResponse.picList);
      this.forceUpdate();
    });
  }
  
  getScrollList() {
    const {dispatch, params} = this.props;
    dispatch(scrollList(params)).then((result) => {
      if (result.apiError) return false;
      Object.assign(this.state.scrollList, result.apiResponse.scrollList);
      this.forceUpdate();
    });
  }
  
  operateScrollList(cfg) {
    const {operate, rowIndex} = cfg;
    switch (operate) {
      case "delete":
        let list = this.state.scrollList.list.concat();
        list.splice(rowIndex, 1);
        this.state.scrollList.list = [];
        this.forceUpdate();
        setTimeout(() => {
          this.state.scrollList.list = list;
          this.forceUpdate()
        }, 0);
        break;
      default:
        break;
    }
  }
  
  addScrollItem() {
    const d = new Date;
    const formatD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.state.scrollList.list.push({
      "sequence": "",
      "name": "",
      "link": "",
      "date": formatD,
      "markKeyWord": false
    });
    this.forceUpdate();
  }
  
  goPreview() {
    const {history} = this.props;
    this.context.router.push("/cms/channelManage/channelPreview");
  }
  
  gotoContentPage() {
    // const {history} = this.props;
    // this.context.router.push("/cms/topicManage/contentCfg");
    
  }
}