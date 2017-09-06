import React, {Component} from "react";
import {connect} from "react-redux";

import SearchBox from "app/components/searchBox/index";
import filterData from "app/components/searchBox/filterData";

import {Modal, Radio, message, Affix, Select, Pagination, Button} from "antd";

import {pushQuery, pushDelete, pushDetail, getStorageFilter} from "app/action_creators/editor_action_creator";
import TableBox from "app/components/editor/table";
import ThumbnailBox from "app/components/provider/thumbnail";
import $ from "app/utils/dom";
import {decode} from "app/utils/utils";

const pushState = {
    '-1': '已删除',
    '1': '推送成功',
    '0': '未推送成功'
}

const select = (state) => ({

});
@connect(select)
export default class EditorPushRecordContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "/editor/pushRecord", "text": "组照推送记录"}
            ],
            "filterInit": {},
            "dataFilter": filterData.list(29, 30, 43, 55),
            "filterParams": {
                "role": 2, // role 1 销售 2 财务 3 运营
                "pageNum": 1,
                "pageSize": 60
            },
            "maskLoading": false,
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
                "listDisplay":2,     // 列表展示方式
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
            }
        };
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {
        document.title= '组照推送记录 - 编辑类 - 内容管理系统 - VCG © 视觉中国';
    };

    render() {
        const target = this;
        const {dataFilter, filterParams, maskLoading, listData} = this.state;

        const tableInit = {
            "idField": "id",
            "isTitle": "gtitle",
            "head": [
                        {
                          "field": "index",
                          "text": "序号",
                          "type": "num",
                          width: 40
                        },
                        {
                            "text": "组照",
                            "type": "image",
                            "field": "oss176",
                            "width":210
                        },
                        {
                            "text": "组照ID",
                            "field": "gid"
                        },
                        {
                            "text": "供应商",
                            "field": "providerName"
                        },
                        {
                            "text": "推送时间",
                            "field": "createdate"
                        },
                        {
                            "text": "推送专题",
                            "field": "type_name"
                        },
                        {
                            "text": "推送人",
                            "field": "editorname"
                        },
                        {
                           "text": "推送结果",
                           "field": "ifsend",
                           "render": (text, record, tr) => {
                               if(tr.ifsend==-1){
                                   return <span>{pushState[tr.ifsend]}</span>
                               }else {
                                   return <a onClick={this.openPush.bind(this, tr.ttgid)}>{pushState[tr.ifsend]}</a>
                               }

                           }
                        },
                        {
                           "text": "抓取时间",
                           "field": "senddate"
                       },
                        {
                           "text": "操作",
                           "field": "operation",
                           "render": (text, record, tr) => <Button disabled={tr.ifsend!=0} onClick={this.deletePush.bind(this, tr.ttgid)}>删除</Button>
                        }
                    ],
            "list": listData.list,
            "pages": 1,
            "params": null
        };

        //分页组件模块化
        const paginationInit = {
            "simple": true,
            "current": filterParams.pageNum,
            "pageSize": filterParams.pageSize,
            "total": filterParams.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal () {
                return '共 ' + (filterParams.total || 0) + ' 条';
            },
            onShowSizeChange (pageSize) {
                target.refresh("pagination", {"pageNum": 1, "pageSize": pageSize*1});
            },
            onChange(current) {
                target.refresh("pagination", {"pageNum": current});
            }
        };

        const thumbnailConfig = {
            types: "push",
            lists: listData.list,
            maskLoading
            // dispatch: this.props.dispatch,
            // onThumbnail: this.handleOnThumbnail.bind(this),
            // updateData: this.updateData.bind(this)
        };

        return (
            <div className="main-content-inner">
                <div className="page-content">
                    <SearchBox
                        comboboxSearch={getStorageFilter}
                        resGroup={1}
                        hotSearchs={[]}
                        showRss={false}
                        dataFilter={dataFilter}
                        onSearch={this.handleOnSearch.bind(this) }
                    />

                    <Affix className="row operate">
                        <div className="col-xs-7">

                            {/*<Button type={listData.listDisplay==1 ? "primary":""} onClick={this.listDisplay.bind(this, 1) }>
                                <i className = {"fa fa-th-large  fa-lg"} />
                            </Button>
                            <Button type={listData.listDisplay==2 ? "primary":""} onClick={this.listDisplay.bind(this, 2) }>
                                <i className = {"fa fa-bars  fa-lg"} />
                            </Button>*/}

                            <Button title="刷新" shape="circle" icon="reload" onClick={this.refresh.bind(this) } />
                        </div>
                        {/*分页组件引用*/}
                        <div className="col-xs-5">
                            <div className="dataTables_paginate pull-right">
                                <Select value={filterParams.pageSize+'条/页'} onChange={paginationInit.onShowSizeChange.bind(this)}>
                                    <Option value="60">60条/页</Option>
                                    <Option value="100">100条/页</Option>
                                    <Option value="200">200条/页</Option>
                                </Select>
                                <Pagination {...paginationInit}  />
                                <div className="total-page"> {paginationInit.showTotal.call(this)} </div>
                              </div>
                          </div>
                    </Affix>

                    <div className="row">
                        <div className="space-8"></div>
                    </div>

                    {listData.listDisplay == 1 && <ThumbnailBox  {...thumbnailConfig} />}
                    {listData.listDisplay == 2 && <TableBox maskLoading={maskLoading} types = {"push"} tableInit = {tableInit} />}

                    {/*分页组件引用*/}
                    <div className="row">
                        <div className="col-xs-7"></div>
                        <div className="col-xs-5">
                            <div className="dataTables_paginate pull-right">
                                <Select value={filterParams.pageSize+'条/页'} onChange={e=>{paginationInit.onShowSizeChange(e)}}>
                                    <Option value="60">60条/页</Option>
                                    <Option value="100">100条/页</Option>
                                    <Option value="200">200条/页</Option>
                                </Select>
                                <Pagination {...paginationInit}  />
                                <div className="total-page"> {paginationInit.showTotal()} </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    queryList(params) {
        // const resultObj = ['未推送成功','推送成功'];
        this.setState({maskLoading: true});
        delete params.bestDay;
        delete params.isShehua;
        delete params.keyword;
        delete params.keywordType;
        const {dispatch} = this.props;
        dispatch(pushQuery(params)).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                return false;
            }

            // //console.log(result.apiResponse);
            const {list, total} = result.apiResponse.data;
            let {filterParams,listData} = this.state;
            filterParams.total = total;
            listData.list= list;
            this.setState({maskLoading: false, listData, filterParams})
        });
    };

    refresh(type, dataParams) {
        const {filterParams} = this.state;
        if (type == "pagination") { // pagination
            window.scrollTo(0, $.offset('.filter-container').height + 50);
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

    openPush(ttgid){
        const {dispatch} = this.props;

        dispatch(pushDetail({ttgid})).then(res => {
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return false
            }
            window.open(res.apiResponse);
        })

    };

    deletePush(ttgid) {
        const {dispatch} = this.props;
        Modal.confirm({
            mask: false,
            title: '确定删除',
            content: '是否删除此推送?',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                dispatch(pushDelete({ttgid})).then((result) => {
                    if (result.apiError) {
                        message.error(result.apiError.errorMessage);
                        return false;
                    };

                    message.success('删除成功！');

                    setTimeout(() => {
                        this.refresh();
                    }, 1000)
                });
            }
        });
    }

    listDisplay(value){
        const {listData} = this.state;
        listData.listDisplay = value;
        this.setState({listData});
    };
}
