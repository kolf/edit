import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import TableBox          from "app/components/common/table";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {channelCfg}      from "app/action_creators/cms_action_creator";

import {Tabs, Switch, Select, DatePicker, Icon, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;

const select = (state) => ({
  "error": state.cms.error
});
@connect(select)

export default class SeoConfig extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "seoInfo": {
        "idField": "seoInfo",
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
        ]
      }
    };
  };
  
  componentDidMount() {
    this.init();
  };
  
  render() {
    return <Tabs type="card">
      <Tabpane tab="SEO设置" key="1">
        <TableBox {...this.state.seoInfo}/>
      </Tabpane>
    </Tabs>
  };
  
  init() {
    const {dispatch, params} = this.props;
    dispatch(channelCfg(params)).then((result) => {
      if (result.apiError) return false;
      Object.assign(this.state.seoInfo, result.apiResponse.channelInfo);
      this.forceUpdate();
    });
  };
  
  handleOnTable() {
  
  };
}