import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";
import TableBox           from "app/components/editor/table";
import LoadingBox         from "app/components/common/loading";

import {Modal, Button, Tooltip, Overlay} from "react-bootstrap/lib";
import Pagination from "antd/lib/pagination";
import {
  topicsFilter,
  topicsSearch,
  topicsMerge,
  topicsUpdate,
  topicsDelete
} from "app/action_creators/topics_action_creator";


const select = (state) => ({
  "error": state.topics.error,
  "dataFilter": state.topics.dataFilter,
  "dataList": state.topics.dataList
});
@connect(select)
export default class topicsContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首頁"},
        {"path": "/topics", "text": "专题列表"}
      ],
      "activePage": 1,
      "pageSize": 5,
      "maxButtons": 5,
      "params": {},
      "loadingShow": false,
      "loadingTarget": "",
      "alert": {
        "show": false,
        "isButton": true,
        "bsSize": "small",
        "onHide": this.closeAlert.bind(this),
        "title": null,
        "body": null,
        "submitAlert": null
      }
    };
    this.paramsInit = {pageNum: 1, groupState: 5};
  }
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentDidMount() {
    this.filterForm();
  };
  
  render() {
    const {dataList} = this.props;
    const {crumbs, maxButtons, activePage, pageSize, loadingShow, loadingTarget} = this.state;
    const toolTipLoading = <Tooltip id="j_loading"><i className="ace-icon fa fa-spinner fa-spin orange bigger-100"></i>
      更新中...</Tooltip>;
    const {alert} = this.state;
    const alertBox = (<Modal {...alert}>
      <Modal.Header closeButton>
        <Modal.Title>{alert.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{"overflow": "hidden"}}>{alert.body}</Modal.Body>
      {alert.isButton &&
      <Modal.Footer>
        <Button bsClass="btn btn-sm btn-info btn-round" onClick={alert.submitAlert}>确认</Button>
        <Button bsClass="btn btn-sm btn-light btn-round" onClick={alert.onHide}>取消</Button>
      </Modal.Footer>
      }
    </Modal>);
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
          
          {alertBox}
          
          <Overlay show={loadingShow}
                   target={() => ReactDOM.findDOMNode(loadingTarget)}
                   placement="right">
            {toolTipLoading}
          </Overlay>
          
          <div className="row">
            <div id="j_filter" className="col-xs-12"></div>
          </div>
          
          <div className="row operate">
            <div className="col-xs-6">
              <button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
                <i className="ace-icon fa fa-refresh"></i>刷新
              </button>
            </div>
            {/*分页组件引用*/}
            <div className="dataTables_paginate pull-right">
              <Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger
                          showQuickJumper showTotal={paginationInit.showTotal}
                          onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}/>
            </div>
          </div>
          
          <div className="row">
            <div className="space-8"></div>
          </div>
          
          <div className="row">
            <div id="j_table" className="col-xs-12"></div>
          </div>
          
          <div className="row operate">
            <div className="col-xs-6">
              <button className="btn btn-sm btn-info" onClick={this.refresh.bind(this)}>
                <i className="ace-icon fa fa-refresh"></i>刷新
              </button>
            </div>
            {/*分页组件引用*/}
            <div className="dataTables_paginate pull-right">
              <Pagination defaultPageSize={paginationInit.pageSize} current={paginationInit.current} showSizeChanger
                          showQuickJumper showTotal={paginationInit.showTotal}
                          onShowSizeChange={paginationInit.onShowSizeChange} onChange={paginationInit.onChange}/>
            </div>
          </div>
        
        </div>
      </div>
    );
  };
  
  filterForm() {
    const {dispatch} = this.props;
    const container = document.getElementById('j_filter');
    ReactDOM.render(<LoadingBox />, container);
    dispatch(topicsFilter()).then((result) => {
      if (result.apiError) return false;
      //console.log(this.props.dataFilter);
      ReactDOM.render(<FilterBox dataFilter={this.props.dataFilter} onSearch={this.handleOnSearch.bind(this)}
                                 searchError={this.props.error}/>, container);
      
      if (!this.props.filterInit) {
        this.queryList(this.paramsInit);
      }
    });
  }
  
  refresh() {
    const {params} = this.props.dataList;
    this.queryList(params);
  };
  
  queryList(params) {
    const {dispatch} = this.props;
    const container = document.getElementById('j_table');
    ReactDOM.render(<LoadingBox />, container);
    dispatch(topicsSearch(params)).then((result) => {
      if (result.apiError) return false;
      ReactDOM.render(<TableBox onTable={this.handleOnTable.bind(this)} {...this.props.dataList} />, container);
    });
  };
  
  handleOnTable({operate, data}) {
    Object.assign(this.state.params, data);
    switch (operate) {
      case "viewTopicsId":
        this.viewTopicsId();
        break;
      default:
      //console.log(operate);
      //console.log(data);
    }
    //this.state.tableParams = Object.assign(this.state.tableParams, params);
  };
  
  viewTopicsId() {
    const data = this.state.params;
    const idField = data.idField;
    const id = data.item[idField];
    this.context.router.push("/topics/" + id);
  }
  
  handleOnSearch(params) {
    //console.log(params);
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
  
  submitMergeGroupt() {
    const data = this.state.params;
    const idField = data.idField;
    const ids = data.ids;
    const params = {};
    params[idField] = ids;
    //console.log(params);
    const {dispatch, dataList} = this.props;
    dispatch(topicsMerge(params)).then((result) => {
      if (result.apiError) return false;
      this.closeAlert();
      this.queryList(dataList.params);
    });
  };
  
  mergeGroup() {
    const data = this.state.params;
    const ids = data.ids;
    const title = "合并多个组照:";
    let body, isButton;
    if (ids && ids.length > 0) {
      const len = ids.length;
      body = "确定要合并这" + len + "个组照？";
      isButton = true;
    } else {
      body = "请选择组照。";
      isButton = false;
    }
    const config = {
      "bsSize": "small",
      "title": <samll style={{"fontSize": "14px"}}>{title}</samll>,
      "contentShow": "body",
      "body": <p className="bolder center grey"><i className="ace-icon fa fa-hand-o-right blue bigger-120"></i>{body}
      </p>,
      "submitAlert": this.submitMergeGroupt.bind(this),
      "isButton": isButton
    };
    this.openAlert(config);
  }
  
}