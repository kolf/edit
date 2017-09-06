import React, {Component} from "react";
import {connect}          from "react-redux";
import moment             from "moment";
import {getStorage}       from "app/api/auth_token";

import CrumbsBox from "app/components/common/crumbs";
import ThumbnailBox from "app/components/provider/thumbnail";
import CreativeBaseContainer from "app/containers/creative/CreativeBase";
import filterData from "app/components/searchBox/filterData";
import EditorBase from "app/containers/editor/editorBase";
import TagAuditContainer from "app/containers/creative/tagAudit"

import Spin from 'antd/lib/spin';
import Collapse from 'antd/lib/collapse';
import message from 'antd/lib/message';

import {providerView} from "app/action_creators/provider_action_creator";

const Panel = Collapse.Panel;

const select = (state) => ({
  // "infoData": state.provider.infoData
});
@connect(select)
export default class ProviderViewContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": props.location.pathname, "text": "供应商信息图库"}
      ],
      infoData: {}
    };
  };
  
  componentWillMount() {
    document.title = '供应商ID：' + this.props.params.id + ' - 信息图库 - 内容管理系统 - VCG © 视觉中国';
    this.queryProviderInfo();
  }
  
  render() {
    
    const {params} = this.props;
    const {crumbs, infoData: {provider, contacts}} = this.state;
    const {pageType, id} = params;
    
    // 根据不同页面来源 拼接不同的筛选参数
    let filterParamsInit = {};
    switch (pageType) {
      case "creativeEdit":
        filterParamsInit = {
          "dataFilter": [],
          "filterInit": {},
          "filterParams": {
            "providerId": id,
            "pageType": 21,
            "userId": getStorage('userId'),
            "role": 2, // role 1 销售 2 财务 3 运营
            "assetFamily": 2, // 1 编辑 2 创意
            "resGroup": 2,
            "onlineState": "", //  1 已上线 2 未上线 3 撤图 4 冻结
            "imageState": "2,3,4,5",
            "desc": 4,
            "pageNum": 1,
            "pageSize": 60
          }
        };
        break;
      case "creativeNoEdit":
        filterParamsInit = {
          "filterInit": {},
          "dataFilter": [],
          "filterParams": {
            "providerId": id,
            "pageType": 20,
            "userId": getStorage('userId'),
            "role": 2, // role 1 销售 2 财务 3 运营
            "assetFamily": 2, // 1 编辑 2 创意
            // "imageState": 1, // '1待编审 2已编审/创意类关键词审核 3 不通过 4 图片审核通过',
            "onlineState": "1,2",
            "resGroup": 2,
            "desc": 4,
            "pageNum": 1,  // 当前页数
            "pageSize": 60 // 每页条数
          }
        };
        break;
      case "creativeTagNoEditor":
        filterParamsInit = {
          "dataFilter": [],
          "filterParams": {
            "userId": getStorage('userId'),
            "providerId": id,
            "pageType": 22,
            "pageNum": 1,
            "pageSize": 60,
            "total": 0,
            "imageState": "",
            "resGroup": 2,
            "desc": 4
          }
        };
        break;
      case "creativeTagEditor":
        filterParamsInit = {
          "dataFilter": [],
          "filterParams": {
            "userId": getStorage('userId'),
            "providerId": id,
            "pageType": 23,
            "pageNum": 1,
            "pageSize": 60,
            "total": 0,
            "imageState": "2,5",
            "resGroup": 2,
            "desc": 3
          }
        };
        break;
      case "edit": // 编审页面
        filterParamsInit = {
          "dataFilter": [],
          "filterInit": {},
          "filterParams": {
            "userId": getStorage('userId'), // userId 用户ID
            "providerId": id,
            "role": 2,        // role 1 销售 2 财务 3 运营
            "keywordType": 1,
            "keyword": "",
            "resGroup": 1,    // resGroup 1 组照 2 单张
            "assetFamily": 1, // assetFamily 1 编辑 2 创意
            "groupState": "",  // groupState '1 未编审、2待编审、3二审,4已编审',
            "pageNum": 1,     // pageNum 当前页数
            "pageSize": 60,    // pageSize 每页条数
            "pageType": 10,
            "desc": 4
          }
        };
        break;
    }
    
    // 创意类已编审和待编审组件包装
    let creativeBaseContainer;
    if (pageType == "creativeEdit" || pageType == "creativeNoEdit") {
      creativeBaseContainer = <CreativeBaseContainer filterParamsInit={filterParamsInit} pageType={pageType}/>;
    }
    
    // 创意类关键词组件包装
    if (pageType == "creativeTagEditor" || pageType == "creativeTagNoEditor") {
      creativeBaseContainer = <TagAuditContainer filterParamsInit={filterParamsInit} pageType={pageType}/>;
    }
    
    let editorBaseContainer;
    if (pageType == "edit") {
      editorBaseContainer =
        <EditorBase filterParamsInit={filterParamsInit} showSearchBar={false} pageId={10} pageType={"editorStorage"}/>
    }
    
    const sex = {'1': '男性', '2': '女性'};
    const assetFamily = {'1': '编辑类', '2': '创意类', '3': '编辑类&创意类', '4': '公关'};
    const qualityRank = {'1': 'A+', '2': 'A', '3': 'B', '4': 'C', '5': 'D'};
    const status = {'3': '有效', '5': '冻结', '6': '关闭'};
    const jobType = {'1': '媒体', '2': '非媒体'};
    
    return (
      <div className="main-content-inner">
        <CrumbsBox crumbs={crumbs}/>
        <div className="page-content">
          <div className="row">
            <div className="space-6"></div>
          </div>
          {!provider && <Spin />}
          {provider && <Collapse defaultActiveKey={"1"}><Panel header={"供应商ID：" + id} key={"1"}>
            {
              provider.agentType == 2 && <div>
                <h4>基本信息</h4>
                <div className="ant-row">
                  <ul className="ant-col-12">
                    <li className="mt-10 clearfix"><span className="ant-col-4">供稿人ID：</span>{id}</li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">姓名：</span>{provider.nameCn || ""}</li>
                    {/* <li className="mt-10 clearfix"><span className="ant-col-4">笔名：</span>{infoData.creditLine || ""}</li> */}
                    <li className="mt-10 clearfix"><span className="ant-col-4">手机号：</span>{contacts[0].mobile || ""}
                    </li>
                    {/* <li className="mt-10 clearfix"><span className="ant-col-4">联系电话：</span>{infoData.workTel || ""}</li> */}
                    <li className="mt-10 clearfix"><span className="ant-col-4">Email：</span>{contacts[0].email || ""}
                    </li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">通讯地址：</span>{provider.city || ""}</li>
                    <li className="mt-10 clearfix"><span
                      className="ant-col-4">从业类型：</span>{jobType[provider.jobType] || ""}</li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">申请时间：</span>{provider.createdTime || ""}
                    </li>
                    <li className="mt-10 clearfix"><span
                      className="ant-col-4">维护等级：</span>{qualityRank[provider.qualityRank] || ""}</li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">状态：</span>{status[provider.status] || ""}
                    </li>
                  </ul>
                  <ul className="ant-col-12">
                    <li className="mt-10 clearfix"><span
                      className="ant-col-4">供稿人类型：</span>{assetFamily[provider.assetFamily] || ""}</li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">署名：</span>{provider.qualityRank || ""}
                    </li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">性别：</span>{sex[contacts[0].sex] || '无'}
                    </li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">所属公司：</span>{provider.company || ""}</li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">具体地址：</span>{provider.location || ""}
                    </li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">QQ：</span>{contacts[0].qq || ""}</li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">开通时间：</span>{provider.updatedTime || ""}
                    </li>
                    <li className="mt-10 clearfix"><span className="ant-col-4">备注：</span>{provider.comment || ""}</li>
                  </ul>
                </div>
              </div>}
            
            {provider.agentType == 1 && <div>
              <h4>基本信息</h4>
              <div className="ant-row">
                <ul className="ant-col-12">
                  <li className="mt-10 clearfix"><span className="ant-col-4">机构ID：</span>{provider.id}</li>
                  <li className="mt-10 clearfix"><span className="ant-col-4">机构全称：</span>{provider.nameCn || ""}</li>
                  <li className="mt-10 clearfix"><span className="ant-col-4">注册地：</span>{provider.createdTime || ""}
                  </li>
                  <li className="mt-10 clearfix"><span className="ant-col-4">创建时间：</span>{provider.email || ""}</li>
                  <li className="mt-10 clearfix"><span
                    className="ant-col-4">维护等级：</span>{qualityRank[provider.qualityRank] || ""}</li>
                </ul>
                <ul className="ant-col-12">
                  <li className="mt-10 clearfix"><span
                    className="ant-col-4">机构类型：</span>{assetFamily[provider.assetFamily] || ''}</li>
                  <li className="mt-10 clearfix"><span className="ant-col-4">机构简称：</span>{provider.shortName || ""}</li>
                  <li className="mt-10 clearfix"><span className="ant-col-4">所属区域：</span>{provider.city || ""}</li>
                  <li className="mt-10 clearfix"><span className="ant-col-4">状态：</span>{status[provider.status] || ""}
                  </li>
                </ul>
              </div>
              <table className="table table-striped table-bordered table-hover table-condensed mt-10">
                <thead>
                <tr>
                  <th width="">姓名</th>
                  <th width="">职位</th>
                  <th width="">手机</th>
                  <th width="">邮箱</th>
                  <th width="">办公电话</th>
                  <th width="">QQ</th>
                  <th width="">Skype</th>
                  <th width="">联系地址</th>
                  <th width="">其他</th>
                  <th width="">主联系人</th>
                </tr>
                </thead>
                <tbody class="table-editor">
                {contacts.length == 0 && <tr>
                  <td colSpan="10">暂无信息</td>
                </tr>}
                {contacts.length > 0 && contacts.map(item => {
                  return <tr class="">
                    <td>{item.name}</td>
                    <td>{item.jobTitle}</td>
                    <td>{item.mobile}</td>
                    <td>{item.email}</td>
                    <td>{item.workTel}</td>
                    <td>{item.qq}</td>
                    <td>{item.skype}</td>
                    <td>{item.address}</td>
                    <td>{item.other}</td>
                    <td>{item.name}</td>
                  </tr>
                })}
                </tbody>
              </table>
            </div>}
          </Panel></Collapse>}
          {pageType == "edit" && editorBaseContainer}
          {pageType != "edit" && creativeBaseContainer}
        
        </div>
      </div>
    );
  };
  
  queryProviderInfo() {
    const {dispatch, params} = this.props;
    dispatch(providerView({"providerId": params.id})).then(result => {
      if (result.apiError) {
        message.error(result.apiError, 3);
        return false;
      }
      
      this.setState({
        infoData: result.apiResponse
      })
    });
  }
  
  
}
