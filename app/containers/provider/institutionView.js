import React, {Component} from "react";
import {connect} from "react-redux";
import Affix from "antd/lib/affix";
import Select from "antd/lib/select";
import Pagination from "antd/lib/pagination";
import Button from "antd/lib/button";
import SearchBox from "app/components/searchBox/index";
import filterData from "app/components/searchBox/filterData";
import {Modal} from "antd";
import TableBox from "app/components/editor/table";
import ThumbnailBox from "app/components/provider/thumbnail";

import ProviderBaseContainer from "app/containers/provider/providerBase";


// input:{Lists}
// output: components

const tableInit = {
  "idField": "id",
  "noTitle": true,
  "head": [
    {
      "field": "index",
      "text": "序号",
      "type": "num",
      width: 40
    },
    {
      "field": "id",
      "text": "ID"
    },
    {
      "field": "nameCn",
      "text": "供应商全称",
      "type": "field"
    },
    {
      "field": "shortName",
      "text": "供应商简称"
    },
    {
      "field": "assetFamily",
      "text": "供应商类型",
      "type": "status",
      "isFun": "callbackAssetFamily"
    },
    {
      "field": "country",
      "text": "国家"
    },
    {
      "field": "qualityRank",
      "text": "等级",
      "type": "status",
      "isFun": "callbackQualityRank"
    },
    {
      "field": "status",
      "text": "状态",
      "type": "status",
      "isFun": "callbackStatus"
    },
    {
      "field": "comment",
      "text": "备注",
    }
  ],
  "list": null,
  "pages": 1,
  "params": null
};

export default class ContributorViewContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": "/editor/pushRecord", "text": "组照推送记录"}
      ],
      "keywordType": [{label: '供应商名称', key: 1, multiple: false}],
      "filterInit": {},
      "dataFilter": filterData.list(35, 36, 37, 38, 60),
      "filterParams": {
        "total": 0,
        "pageNum": 1,
        "pageSize": 60,
        "agentType": 1, // 1机构 2个人
        "assetFamily": 1
      }
    };
  };
  
  componentWillMount() {
    document.title = '机构信息 - 供应商信息查询 - 内容管理系统 - VCG © 视觉中国';
  };
  
  render() {
    return (
      <ProviderBaseContainer inputLeft={453} state={this.state} tableInit={tableInit}/>
    );
  };
  
}
