import React, {Component} from "react";
import {getStorage} from "app/api/auth_token";
import CrumbsBox from "app/components/common/crumbs";
import CreativeBaseContainer from "app/containers/creative/CreativeBase";
import filterData from "app/components/searchBox/filterData";

export default class CreativeNoEditorContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": "/creative/noEditor", "text": "创意类：图片审核（未发布）"}
      ],
      "dataFilter": filterData.list(24, 18, 15, 23, 61, 5, 6, 13)
    };
  };
  
  componentWillMount() {
    document.title = '未发布图片 - 图片审核 - 创意类 - 内容管理系统 - VCG © 视觉中国';
  };
  
  render() {
    
    const {crumbs, dataFilter} = this.state;
    let filterParamsInit = {
      "filterInit": {},
      "filterParams": {
        "pageType": 20,
        "userId": getStorage('userId'),
        "role": 2, // role 1 销售 2 财务 3 运营
        "keywordType": 1,
        "keyword": "",
        "assetFamily": 2, // 1 编辑 2 创意
        // "imageState": 1, // '1待编审 2已编审/创意类关键词审核 3 不通过 4 图片审核通过',
        "onlineState": "1,2",
        "resGroup": 2,
        "desc": 2,
        "pageNum": 1,  // 当前页数
        "pageSize": 60 // 每页条数
      }
    };
    return (
      <div className="main-content-inner">
        <CreativeBaseContainer
          filterParamsInit={filterParamsInit}
          dataFilter={dataFilter}
          pageId={20}
          pageType={"creativeNoEdit"}
        />
      </div>
    );
  };
}
