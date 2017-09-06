/***************
 *关键词审核界面
 *****************/

import React, {Component} from "react";
import CrumbsBox from "app/components/common/crumbs";
import TagAuditContainer from "./tagAudit";
import filterData from "app/components/searchBox/filterData";

export default class TagNoEditorContainer extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": props.location.pathname, "text": "创意类：关键词审核（未发布）"}
      ],
      "dataFilter": filterData.list(25, 18, 15, 23, 61, 5, 12, 13)
    };
    
    this.keywordTypes = [{label: '关键词', key: 1}, {label: '图片ID', key: 2}, {label: '待确认关键词', key: 3, multiple: false}]
  };
  
  componentWillMount() {
    document.title = '未发布图片 - 图片关键词审核 - 创意类 - 内容管理系统 - VCG © 视觉中国';
  };
  
  render() {
    const {crumbs, dataFilter} = this.state;
    return (
      <div className="main-content-inner">
        <div className="page-content">
          <TagAuditContainer keywordTypes={this.keywordTypes} imageState={""} dataFilter={dataFilter} pageId={22}
                             pageType="creativeTagNoEditor"/>
        </div>
      </div>
    );
  };
  
  
}
