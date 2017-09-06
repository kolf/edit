/***************
 *关键词审核界面
 *****************/

import React, {Component} from "react";
import CrumbsBox from "app/components/common/crumbs";
import TagAuditContainer from "./tagAudit";
import filterData from "app/components/searchBox/filterData";

export default class TagEditorContainer extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": props.location.pathname, "text": "创意类：关键词审核（已发布）"}
      ],
      "dataFilter": filterData.list(18, 23, 61, 5, 6, 7, 12, 13)
    };
    this.keywordTypes = [{label: '关键词', key: 1}, {label: '图片ID', key: 2}]
  };
  
  componentWillMount() {
    document.title = '已发布图片 - 图片关键词审核 - 创意类 - 内容管理系统 - VCG © 视觉中国';
  };
  
  render() {
    const {crumbs, dataFilter} = this.state;
    
    return (
      <div className="main-content-inner">
        <div className="page-content">
          <TagAuditContainer keywordTypes={this.keywordTypes} dataFilter={dataFilter} imageState={"2,5"} pageId={23}
                             pageType="creativeTagEditor"/>
        </div>
      </div>
    );
  };
}
