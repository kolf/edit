import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import TableBox          from "app/components/common/table";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {channelCfg, scrollList, picList}      from "app/action_creators/cms_action_creator";

import {Tabs, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;

const select = (state) => ({
  "error": state.cms.error
});
@connect(select)

export default class ScrollPage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "scrollList": {
        "idField": "sequence",
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
              return <input style={{width: 50}} value={text} onChange={() => {
              }}/>
            }
          },
          {
            "field": "name",
            "text": "名称",
            "type": "customize",
            customize (text) {
              return <input style={{width: '100%'}} value={text} onChange={() => {
              }}/>
            }
          },
          {
            "field": "link",
            "text": "链接",
            "type": "customize",
            customize (text) {
              return <input style={{width: '100%'}} value={text} onChange={() => {
              }}/>
            }
          },
          {
            "field": "date",
            "text": "发布日期"
          },
          {
            "field": "markKeyWord",
            "type": "customize",
            "text": "关键词标红",
            customize (text) {
              return <label><input type="checkbox" checked={text} onChange={() => {
              }}/>标红</label>
            }
          },
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
  
  componentDidMount() {
    this.getScrollList();
  };
  
  render() {
    return (
      <Tabs type="card" onChange={this.tabChange.bind(this)}>
        <Tabpane tab="滚动页设置" key="2">
          <TableBox {...this.state.scrollList} onTable={this.operateScrollList.bind(this)}/>
          <button onClick={this.addScrollItem.bind(this)}><i className="menu-icon fa fa-plus-circle"></i>新建标签</button>
        </Tabpane>
      </Tabs>
    )
  };
  
  handleOnTable() {
    //console.log(arguments)
  };
  
  tabChange(tabKey) {
  
  };
  
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
        this.state.scrollList.list.splice(rowIndex, 1);
        this.forceUpdate();
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
}