import React, {Component} from "react";
import {connect} from "react-redux";


import SearchBox from "app/components/searchBox/index";
import filterData from "app/components/searchBox/filterData";

import {Modal, message, Affix, Select, Pagination, Button} from "antd";

import {getStorageFilter, downloadCountQuery, queryUserAccount} from "app/action_creators/editor_action_creator";
import TableBox from "app/components/editor/table";
import ThumbnailBox from "app/components/provider/thumbnail";
import $ from "app/utils/dom";
import {decode} from "app/utils/utils";

// input:{Lists}
// output: components

const tableInit = {
    "idField": "id",
    "isTitle": "title",
    "noTitle": true,
    "wrapClassName": 'downloadTable',
    "head": [
        {
          "field": "index",
          "text": "序号",
          "type": "num",
          "width": 40
        },
        {
            "text": "下载ID",
            "field": "downId",
        },
        {
            "text": "图片",
            "field": "picUrl",
            "type": "image",
            "width": 210
        },
        {
            "text": "图片ID",
            "field": "resId",
        },
        {
            "text": "图片说明/标题",
            "field": "caption",
            "width": 210,
            "textLeng": 200
        },
        {
            "text": "署名",
            "field": "penName"
        },
        {
            "text": "供应商",
            "field": "providerName"
        },
        {
            "text": "客户",
            "field": "accountName"
        },
        {
            "text": "用户",
            "field": "vcgUserName",
            "isFun": 'enterText',
            type: 'status',
            "width": 160
        },
        {
            "text": "下载/发送时间",
            "field": "downloadTime",
            "width": 100
        },
        {
            "text": "确认时间",
            "field": "confirmTime"
        },
        {
            "text": "生效时间",
            "field": "effectiveTime"
        },
        {
            "text": "下载次数",
            "field": "downloadNum"
        },
        {
            "text": "下载IP",
            "field": "ip"
        }
    ],
    "list": null,
    "pages": 1,
    "params": null
};


const getKeywordType = (assetFamily) => {
    return assetFamily == 1 ? [{label: '组照ID', key: 1}, {label: '图片ID', key: 2}] : [{label: '图片ID', key: 2}]
}

const select = (state) => ({
    "editorDoing": state.editor.doing,
    "editorError": state.editor.error,
    "editorQueryData": state.editor.queryData,
    "editorSaveData": state.editor.saveData
});
@connect(select)
export default class ZhEditDownloadContainer extends Component {

    constructor(props) {
        super(props);
        const assetFamily = props.params.type == 'edit' ? '1' : '2';

        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "/zh/download", "text": "网站下载记录"}
            ],
            "defaultParams": {
                assetFamily
            },
            "dataFilter": filterData.list(54, 49, 59, 52, 53, 50, 51),
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
            keywordTypes: getKeywordType(assetFamily)
        };
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {
        const {type} = this.props.params;
        document.title= '网站下载记录 - '+(type=='edit'?'编辑类':'创意类')+' - 内容管理系统 - VCG © 视觉中国';
        // this.refresh();
    };

    componentDidMount(){
        // $.get('.main-content')[0].style.height = (document.documentElement.clientHeight - 80) + 'px'
    }

    render() {
        const target = this;
        const {filterParams, maskLoading, listData, dataFilter, defaultParams, keywordTypes} = this.state;

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

        tableInit.list = listData.list;
        return (
            <div className="main-content-inner">

                <div className="page-content">
                    <SearchBox
                        assetFamily={defaultParams.assetFamily}
                        comboboxSearch={getStorageFilter}
                        showRss={false}
                        keywordTypes={[{label: '组照ID', key: 1}, {label: '图片ID', key: 2}, {label: '专题ID', key: 3}]}
                        showSearchBar={true}
                        defaultParams={defaultParams}
                        filterInit={dataFilter.slice()}
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

                            <Button title={"刷新"} shape="circle" icon={"reload"} onClick={this.refresh.bind(this) }/>
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
                    {listData.listDisplay == 2 && <TableBox maskLoading={maskLoading} types={"push"} tableInit={tableInit}/>}

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
        this.setState({maskLoading: true});
        const {dispatch} = this.props;
        dispatch(downloadCountQuery(params)).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                this.setState({maskLoading: false});
                return false;
            }

            const {list, total} = result.apiResponse;
            const {listData, filterParams} = this.state;
            listData.list = list;
            filterParams.total = total;
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

    handleOnSearch(params, dataFilter, type) {
        let {assetFamily, accountId} = params;
        if(!assetFamily){
            assetFamily = this.props.params.type == 'edit' ? 1 : 2
        }

        const joinName = (item) => {
            return `${item.userName}/${item.email}/${item.mobile}/${item.realName}`.replace(/\/null/g, '').replace(/null\//g, '')
        };

        if(accountId){
            const {dispatch} = this.props;
            const [id, ucId] = accountId.split('*');
            dispatch(queryUserAccount({ucId})).then(res => {
                if (res.apiError) {
                    message.error(res.apiError.errorMessage);
                    return false;
                }
                dataFilter[2].options = res.apiResponse.map(item => ({
                    key: item.userId,
                    label: joinName(item)
                }));

            });

            params.accountId = id
        }else if(dataFilter){
            dataFilter[2].options = []
        }

        this.refresh("filter", params);
    };

    listDisplay(value) {
        const {listData} = this.state;
        listData.listDisplay = value;
        //console.log(listData.listDisplay, value);
        this.setState({listData});
    };
}
