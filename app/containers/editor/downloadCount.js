import React, {Component} from "react";
import {connect} from "react-redux";
import Affix from "antd/lib/affix";
import Select from "antd/lib/select";
import Pagination from "antd/lib/pagination";
import Button from "antd/lib/button";
import SearchBox from "app/components/searchBox/index";
import filterData from "app/components/searchBox/filterData";
import {Modal} from "antd";
import {getStorageFilter, downloadCountQuery} from "app/action_creators/editor_action_creator";
import TableBox from "app/components/editor/table";
import ThumbnailBox from "app/components/provider/thumbnail";

// input:{Lists}
// output: components

const tableInit = {
  "idField": "id",
  "onTitle": true,
  "isTitle": "title",
  "head": [
    {
      "text": "下载ID",
      "field": "downId",
    }, {
      "text": "图片",
      "field": "picUrl"
    }, {
      "text": "图片ID",
      "field": "resId"
    }, {
      "text": "署名",
      "field": "penName"
    }, {
      "text": "供应商",
      "field": "providerName"
    }, {
      "text": "客户名称",
      "field": "accountName"
    }, {
      "text": "下载时间",
      "field": "downloadTime"
    }, {
      "text": "下载次数",
      "field": "downloadNum"
    }, {
      "text": "下载IP",
      "field": "ip"
    }, {
      "text": "确认时间",
      "field": "time1"
    }, {
      "text": "生效时间",
      "field": "time2"
    }
  ],
  "list": null,
  "pages": 1,
  "params": null
};


const select = (state) => ({
  "editorDoing": state.editor.doing,
  "editorError": state.editor.error,
  "editorQueryData": state.editor.queryData,
  "editorSaveData": state.editor.saveData
});
@connect(select)
export default class DownloadCountContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": "/editor/pushRecord", "text": "组照推送记录"}
      ],
      "filterInit": {},
      "dataFilter": filterData.list(29, 30),
      "filterParams": {
        "role": 2, // role 1 销售 2 财务 3 运营
        "pageNum": 1,
        "pageSize": 60
      },
      "loading": false,
      "modal": {
        "title": "",
        "visible": false,
        "confirmLoading": false,
        "okText": "确定",
        "cancelText": "取消",
        "body": "",
        "params": {}
      },
      "listData": {            // 图片数据
        "listDisplay": 2,     // 列表展示方式
        "list": null,        // 提交数据
        "listInit": null,    // 原始数据
        "selectStatus": [],  // 选择状态
        "timeByOrder": false,// 创建时间排序
        "total": 0           // 数据总数
      },
      "listSelectData": {      // 选择列表数据
        "ids": [],           // id []
        "keys": [],          // key []
        "list": [],          // 选择数据 item []
        "listInit": []       // 选择原始数据 item []
      },
    };
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentWillMount() {
  };
  
  onRowClick(record, index) {
    this.context.router.push("/editor/pushRecord/topicId=" + record.topId + "&groupId=" + record.id);
  };
  
  render() {
    const target = this;
    const {crumbs, modal, filterInit, dataFilter, filterParams, columns, dataSource, loading, listData} = this.state;
    
    //分页组件模块化
    const paginationInit = {
      "current": filterParams.pageNum,
      "pageSize": filterParams.pageSize,
      "total": filterParams.total,
      "showSizeChanger": true,
      "showQuickJumper": true,
      showTotal () {
        return '共 ' + filterParams.total + ' 条';
      },
      onShowSizeChange (pageSize) {
        this.refresh("pagination", {"pageNum": 1, "pageSize": pageSize});
      },
      onChange(current) {
        target.refresh("pagination", {"pageNum": current});
      }
    };
    
    tableInit.list = listData.list.map(item => {
      item.picUrl = `http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com/${item.picUrl}`;
      return item;
    });
    
    //console.log(tableInit.list);
    
    return (
      <div className="main-content-inner">
        
        <div className="page-content">
          <SearchBox
            resGroup={1}
            hotSearchs={[]}
            showRss={false}
            dataFilter={dataFilter}
            onSearch={this.handleOnSearch.bind(this) }
          />
          
          
          <Affix className="row operate">
            <div className="col-xs-6 col-xlg-8">
              
              {/*<Button type={listData.listDisplay==1 ? "primary":""} onClick={this.listDisplay.bind(this, 1) }>
               <i className = {"fa fa-th-large  fa-lg"} />
               </Button>
               <Button type={listData.listDisplay==2 ? "primary":""} onClick={this.listDisplay.bind(this, 2) }>
               <i className = {"fa fa-bars  fa-lg"} />
               </Button>*/}
              
              <Button title={"刷新"} shape="circle" icon={"reload"} onClick={this.refresh.bind(this) }/>
            </div>
            {/*分页组件引用*/}
            <div className="col-xs-6 col-xlg-4">
              <div className="dataTables_paginate pull-right">
                <Select defaultValue="60" onChange={paginationInit.onShowSizeChange.bind(this)}>
                  <Option value="60">60条/页</Option>
                  <Option value="100">100条/页</Option>
                  <Option value="200">200条/页</Option>
                </Select>
                <Pagination simple {...paginationInit}  />
                <div className="total-page"> {paginationInit.showTotal.call(this)} </div>
              </div>
            </div>
          </Affix>
          
          <div className="row">
            <div className="space-8"></div>
          </div>
          
          {listData.listDisplay == 2 && <TableBox types={"push"} tableInit={tableInit}/>}
        
        </div>
      </div>
    );
  };
  
  queryList(params) {
    const {dispatch} = this.props;
    const {listData} = this.state;
    this.setState({loading: true});
    dispatch(downloadCountQuery(params)).then((result) => {
      if (result.apiError) {
        Modal.error({
          title: '系统提示：',
          content: (
            <p>{result.apiError.errorMessage}</p>
          )
        });
        return false;
      }
      
      
      const {filterParams} = this.state;
      const dataSource = result.apiResponse.list;
      dataSource.forEach((item, i) => {
        item.topId = this.getTopicNameById(item.topId);
      });
      
      filterParams.total = result.apiResponse.total;
      listData.list = dataSource;
      
      this.setState({loading: false, dataSource, "filterParams": filterParams})
    });
  };
  
  refresh(type, dataParams) {
    const {filterParams} = this.state;
    if (type == "pagination") { // pagination
      Object.assign(filterParams, dataParams);
    }
    if (type == "filter") { // filter
      Object.assign(filterParams, dataParams, {"pageNum": 1});
    }
    if (type == "pagination" || type == "filter") {
      this.setState({filterParams});
    }
    this.queryList(filterParams);
  };
  
  handleOnSearch(params, current, tags) {
    this.refresh("filter", params);
  };
  
  deletePush(record) {
    this.openModal({
      "title": "撤销推送：ID-" + record.id,
      "body": <p className="orange">
        <i className="ace-icon fa fa-hand-o-right"></i> {"确定撤销此推送！"}
      </p>,
      "params": {
        "id": record.id
      },
      "onOk": this.submitDeletePush.bind(this)
    });
  }
  
  submitDeletePush() {
    const {params} = this.state.modal;
    const {dispatch} = this.props;
    dispatch(pushDelete(params)).then((result) => {
      if (result.apiError) {
        Modal.error({
          title: '系统提示：',
          content: (
            <p>{result.apiError.errorMessage}</p>
          )
        });
        return false;
      }
      this.closeModal();
      this.refresh();
    });
  };
  
  listDisplay(value) {
    const {listData} = this.state;
    listData.listDisplay = value;
    //console.log(listData.listDisplay, value);
    this.setState({listData});
  };
  
  getTopicNameById(id) {
    return {
      "100059": "【今日头条：图播快报】",
      "100060": "【今日头条：最星动】",
      "100061": "【今日头条：图说赛事】",
      "100062": "【今日头条：图话历史】",
      "100063": "【今日头条：智游12301】",
      "100064": "【人民日报】",
      "100065": "【百度】"
    }[id]
  }
  
}

/*
 * <Tooltip title="撤销">
 <i className="ace-icon fa hand blue bigger-110 fa-trash-o" onClick={this.deletePush.bind(this,record)}></i>
 </Tooltip>
 * */
