import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";
import TableBox           from "app/components/common/table";
import LoadingBox         from "app/components/common/loading";
import ThumbnailBox       from "app/components/provider/thumbnail";

import {Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";
import Pagination from "antd/lib/pagination";
import {cmsFilter, cmsSearch} from "app/action_creators/cms_action_creator";

import {
  Grid,
  Row,
  Col,
  Thumbnail
} from "react-bootstrap/lib";

const select = (state) => ({
  "error": state.cms.error,
  "dataFilter": state.cms.dataFilter,
  "dataList": state.cms.dataList
});
@connect(select)

export default class PreviewContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首頁"},
        {"path": "/cms/topicManage", "text": "内容运营平台：专题管理"},
        {"path": "/cms/topicManage/topicPreview", "text": "编辑专题预览"}
      ],
      "activePage": 1,
      "pageSize": 5,
      "params": {},
      "loadingShow": false,
      "loadingTarget": "",
      "selectStatus": []
    };
    this.paramsInit = {pageNum: 1, groupState: 4};
  }
  
  componentDidMount() {
    this.filterForm();
  };
  
  componentWillUnmount() {
    const list = document.getElementById('j_table');
    ReactDOM.render(<div></div>, list);
  };
  
  render() {
    const {dataList} = this.props;
    const {crumbs, maxButtons, activePage, loadingShow, loadingTarget} = this.state;
    const toolTipLoading = <Tooltip id="j_loading"><i className="ace-icon fa fa-spinner fa-spin orange bigger-100"></i>
      更新中...</Tooltip>;
    
    //分页组件模块化
    const paginationInit = {
      pageSize: pageSize,
      current: activePage,
      onShowSizeChange: (current, pageSize) => {
        this.refresh("pagination", {"activePage": current, "pageSize": pageSize});
      },
      onChange: this.handleOnPagination.bind(this)
    }
    return (
      <div className="main-content-inner">
        <CrumbsBox crumbs={crumbs}/>
        <div className="page-content">
          
          <Overlay show={loadingShow}
                   target={() => ReactDOM.findDOMNode(loadingTarget)}
                   placement="right">
            {toolTipLoading}
          </Overlay>
          
          <div className="row">
            <div className="col-xs-12">
              
              <div className="widget-box transparent ui-sortable-handle">
                
                <div className="widget-body">
                  <div id="j_filter" className="widget-main padding-6 no-padding-left no-padding-right"></div>
                </div>
              </div>
            
            </div>
          </div>
          
          <div className="row">
            <div className="space-8"></div>
          </div>
          
          {/*分页组件引用*/}
          <div className="dataTables_paginate pull-right">
            <Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger
                        showQuickJumper showTotal={paginationInit.showTotal}
                        onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}/>
          </div>
          
          <div className="row">
            <div className="space-8"></div>
          </div>
          
          <div className="row">
            <div id="j_table" className="col-xs-12">{this.props.children}</div>
          </div>
          
          {/*分页组件引用*/}
          <div className="dataTables_paginate pull-right">
            <Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger
                        showQuickJumper showTotal={paginationInit.showTotal}
                        onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}/>
          </div>
        
        </div>
      </div>
    );
  };
  
  filterForm() {
    const {dispatch} = this.props;
    const container = document.getElementById('j_filter');
    ReactDOM.render(<LoadingBox />, container);
    dispatch(cmsFilter()).then((result) => {
      if (result.apiError) return false;
      ReactDOM.render(<FilterBox dataFilter={this.props.dataFilter} onSearch={this.handleOnSearch.bind(this)}
                                 searchError={this.props.error}/>, container);
      
      if (!this.props.filterInit) {
        this.queryList(this.paramsInit);
      }
    });
  };
  
  refresh() {
    const {params} = this.props.dataList;
    this.queryList(params);
  };
  
  queryList(params) {
    const {dispatch} = this.props;
    const container = document.getElementById('j_table');
    ReactDOM.render(<LoadingBox />, container);
    
    dispatch(cmsSearch(params)).then((result) => {
      if (result.apiError) return false;
      let len = this.props.dataList.list.length;
      this.state.selectStatus = _.fill(new Array(len), false);
      this.thumbnailRender();
    });
  };
  
  thumbnailRender() {
    const {dataList} = this.props;
    const container = document.getElementById('j_table');
    
    const config = {
      
      //即时状态
      "searchParams": this.state.params,
      "dispatch": this.props.dispatch,
      "getStatus": this.getStatus.bind(this),
      "renderself": this.queryList.bind(this),
      
      //选择
      "selectStatus": this.state.selectStatus,
      "setSelectStatus": this.setSelectStatus.bind(this)
    };
    
    ReactDOM.render(
      <ThumbnailBox
        maskLoading={false}
        types="group"
        lists={this.props.dataList.list}
        onThumbnail={this.handleOnThumbnail.bind(this)}
        {...config}/>, container
    );
  };
  
  setSelectStatus(params) {
    this.setState({selectStatus: params});
  };
  
  getStatus() {
    return this.props.dataList.status;
  };
  
  selectAll() {
    const {selectStatus} = this.state;
    let len = this.props.dataList.list.length;
    this.state.selectStatus = _.fill(new Array(len), true);
    this.thumbnailRender();
  };
  
  selectToggle() {
    const {selectStatus} = this.state;
    this.state.selectStatus = [...selectStatus].map((val, i) => {
      return !val
    });
    this.thumbnailRender();
  };
  
  handleOnThumbnail({operate, key}) {
    Object.assign(this.state.params, key);
    switch (operate) {
      case "expand":
        this.expandContract();
        break;
      default:
      
    }
    //this.state.tableParams = Object.assign(this.state.tableParams, params);
  };
  
  handleOnSearch(params) {
    let dataParams = {};
    params.map((item) => {
      dataParams[item.field] = item.id
    });
    this.setState({"activePage": 1});
    Object.assign(dataParams, this.paramsInit);
    this.queryList(dataParams);
  };
  
  handleOnPagination(eventKey) {
    this.setState({activePage: eventKey});
    const {params} = this.props.dataList;
    const paramsData = Object.assign({}, params, {"pageNum": eventKey});
    this.queryList(paramsData);
  };
  
  closeAlert() {
    const alert = Object.assign(this.state.alert, {"show": false});
    this.setState({"alert": alert});
  };
  
  openAlert(config) {
    const alert = Object.assign(this.state.alert, {"show": true}, config);
    this.setState({"alert": alert});
  };
  
  
}
