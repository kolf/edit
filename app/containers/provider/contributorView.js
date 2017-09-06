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
      "width": 40
    },
    {
      "field": "nameCn",
      "text": "姓名"
    },
    {
      "field": "mobile",
      "text": "手机号"
    },
    {
      "field": "email",
      "text": "邮箱"
    },
    {
      "field": "company",
      "text": "所属公司"
    },
    {
      "field": "jobType",
      "text": "从业类型",
      "type": "status",
      "isFun": "callbackJobType"
    },
    {
      "field": "country",
      "text": "地区"
    },
    {
      "field": "sex",
      "text": "性别",
      "type": "status",
      "isFun": "callbackSex"
    },
    {
      "field": "qualityRank",
      "text": "等级",
      "type": "status",
      "isFun": "callbackQualityRank"
    },
    {
      "field": "assetFamily",
      "text": "供应商类型",
      "type": "status",
      "isFun": "callbackAssetFamily"
    },
    {
      "field": "status",
      "text": "状态",
      "type": "status",
      "isFun": "callbackStatus"
    }, {
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
      "keywordType": [{label: '姓名或者ID', key: 1, multiple: false}, {label: '邮箱', key: 2, multiple: false}, {
        label: '手机号',
        key: 3,
        multiple: false
      }, {label: '备注', key: 4, multiple: false}],
      "filterInit": {},
      "dataFilter": filterData.list(35, 36, 37, 38),
      "filterParams": {
        "total": 0,
        "pageNum": 1,
        "pageSize": 60,
        "agentType": 2	// 1机构 2个人
        //"asseFamily":1, // 1创意类 2编辑类
      }
    };
  };
  
  componentWillMount() {
    document.title = '供稿人信息 - 供应商信息查询 - 内容管理系统 - VCG © 视觉中国';
  };
  
  render() {
    return (
      <ProviderBaseContainer inputLeft={470} state={this.state} tableInit={tableInit}/>
    );
  };
}
