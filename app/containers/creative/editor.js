import React, {Component} from "react";
import {getStorage} from "app/api/auth_token";
import CrumbsBox from "app/components/common/crumbs";
import CreativeBaseContainer from "app/containers/creative/CreativeBase";
import filterData from "app/components/searchBox/filterData";

export default class CreativeEditorContainer extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": props.location.pathname, "text": "创意类：已发布图片"}
      ],
      "dataFilter": filterData.list(19, 18, 23, 61, 5, 33, 7, 12, 13, 41)
    };
  };
  
  componentWillMount() {
    document.title = '已发布图片 - 图片审核 - 创意类 - 内容管理系统 - VCG © 视觉中国';
  };
  
  render() {
    
    const {crumbs, dataFilter} = this.state;
    
    let filterParamsInit = {
      "filterInit": {},
      "filterParams": {
        "pageType": 21,
        "userId": getStorage('userId'),
        "role": 2, // role 1 销售 2 财务 3 运营
        "keywordType": 1,
        "keyword": "",
        "assetFamily": 2, // 1 编辑 2 创意
        "resGroup": 2,
        "onlineState": "", //  1 已上线 2 未上线 3 撤图 4 冻结
        "imageState": "2,3,4,5",
        "desc": 3,
        "pageNum": 1,
        "pageSize": 60
      }
    };
    
    return (
      <div className="main-content-inner">
        <CreativeBaseContainer
          filterParamsInit={filterParamsInit}
          dataFilter={dataFilter}
          pageId={21}
          pageType={"creativeEdit"}
        />
      </div>
    );
  };
  
}
