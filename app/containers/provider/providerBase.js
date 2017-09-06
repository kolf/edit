import React, { Component } from "react";
import { connect }          from "react-redux";

import SearchBox            from "app/components/searchBox/index";
import filterData           from "app/components/searchBox/filterData";
import TableBox             from "app/components/editor/table";
import ProviderContacts　　　from "app/components/modal/providerContacts";
import EditModal            from "app/components/edit/editModal";

import { searchProvider, providerView } from "app/action_creators/provider_action_creator";

import { Modal, Affix, Select, Pagination, Button } from "antd";
import $ from "app/utils/dom";


const select = (state) => ({
    "editorDoing": state.editor.doing,
    "editorError": state.editor.error,
    "editorQueryData": state.editor.queryData,
    "editorSaveData": state.editor.saveData
});
@connect(select)
export default class ProviderBaseContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "filterInit": {},
            "loading": false,
            "listData": { // 图片数据
                "listDisplay": 2, // 列表展示方式
                "list": null, // 提交数据
                "listInit": null, // 原始数据
                "selectStatus": [], // 选择状态
                "timeByOrder": false, // 创建时间排序
                "total": 0 // 数据总数
            },
            "listSelectData": { // 选择列表数据
                "ids": [], // id []
                "keys": [], // key []
                "list": [], // 选择数据 item []
                "listInit": [] // 选择原始数据 item []
            },
            maskLoading: false
        };
        Object.assign(this.state, props.state);
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {};

    openAlert(alert) {
        Object.assign(alert, {"maskClosable": false, "dragable": true});
        this.setState({alert, "doing": "openAlert"})
    };

    closeAlert() {
        this.setState({"doing": "closeAlert"});
    };

    updateData({doing, alert, listData, listSelectData}) { // set value
        if (listData) this.state.listData.list = listData;
        if (listSelectData) this.state.listSelectData = listSelectData;
        if (doing) this.state.doing = doing;
        if (alert) this.state.alert = alert;
    };

    render() {
        const target = this;
        const {
            crumbs,
            modal,
            filterInit,
            dataFilter,
            filterParams,
            columns,
            dataSource,
            loading,
            listData,
            alert,
            doing,
            maskLoading
        } = this.state;

        //分页组件模块化
        const paginationInit = {
            "current": filterParams.pageNum,
            "pageSize": filterParams.pageSize,
            "total": filterParams.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal() {
                return '共 ' + filterParams.total + ' 条';
            },
            onShowSizeChange(pageSize) {
                target.refresh("pagination", {
                    "pageNum": 1,
                    "pageSize": pageSize
                });
            },
            onChange(current) {
                target.refresh("pagination", {
                    "pageNum": current
                });
            }
        };

        this.props.tableInit.list = listData.list;

        return (
            <div className="main-content-inner">
                <div className="page-content">

                    <EditModal
                        doing={doing}
                        alert={alert}
                        updateData={this.updateData.bind(this) }
                    />

                    <SearchBox
                        inputLeft = {this.props.inputLeft}
                        resGroup={1}
                        hotSearchs={[]}
						showSearchBar={true}
                        showRss={false}
						keywordTypes={this.state.keywordType}
                        dataFilter={dataFilter}
                        onSearch={this.handleOnSearch.bind(this) }
                    />


                    <Affix className="row operate">
                        <div className="col-xs-6 col-xlg-8">
                            <Button title={"刷新"} shape="circle" icon={"reload"} onClick={this.refresh.bind(this) }/>
                        </div>
                        {/*分页组件引用*/}
                        <div className="col-xs-6 col-xlg-4">
                            <div className="dataTables_paginate pull-right">
                                <Select value={filterParams.pageSize+'条/页'} onChange={paginationInit.onShowSizeChange.bind(this)}>
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

                    <TableBox
                        maskLoading={maskLoading}
                        types={"push"}
                        onTable={this.handleOnThumbnail.bind(this) }
                        tableInit={this.props.tableInit}
                    />

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
                                <Pagination simple {...paginationInit}  />
                                <div className="total-page"> {paginationInit.showTotal()} </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    queryList(params) {
        const {
            dispatch
        } = this.props;

        let {
			listData,
			filterParams,
        } = this.state;

        this.setState({maskLoading: true});
        dispatch(searchProvider(filterParams)).then((result) => {
            if (result.apiError) {
                Modal.error({
                    title: '系统提示：',
                    content: (
                        <p>{result.apiError.errorMessage}</p>
                    )
                });
                return false;
            }

            listData = result.apiResponse;
            filterParams.total=result.apiResponse.total;

            this.setState({
				filterParams,
				listData,
                maskLoading: false
            })
        });
    };

    refresh(type, dataParams) {
        const {
            filterParams
        } = this.state;
        if (type == "pagination") { // pagination
            window.scrollTo(0, $.offset('.filter-container').height + 50);
            Object.assign(filterParams, dataParams);
        }
        if (type == "filter") { // filter
            Object.assign(filterParams, dataParams, {
                "pageNum": 1
            });
        }
        if (type == "pagination" || type == "filter") {
            this.setState({
                filterParams
            });
        }
        this.queryList(filterParams);
    };

    handleOnSearch(params, current, tags) {
        let param = params || {};

        param.searchType=param.keywordType || 1;
        param.searchName=param.keyword || '';

        const countryNames = ['country', 'province', 'city'];

        countryNames.forEach(name => {
            param[name] = '';
        });

        //console.log(params);

        if(param.address){
            const countryArr = param.address.split('*');
            const names = ['country', 'province', 'city'];

            names.forEach((name, i) => {
                param[name] = countryArr[i] || ''
            });

            param.address = ''
        }

        this.refresh("filter", param);
    };

    handleOnThumbnail({operate, key, id}) {
        switch (operate) {
            case "nameCn": // 编审
                this.viewContacts({ providerId: id });
                break;
            default:
                //console.log(operate, key, id);
        }
    };

    viewContacts ({providerId}) {
        //console.log('providerId',providerId);
        const {dispatch} = this.props;
        dispatch(providerView({providerId})).then(result => {
            if (result.apiError) {
                //this.messageAlert(result.apiError.errorMessage);
                Modal.error({
                    title: '系统提示：',
                    content: (
                        <p>{result.apiError.errorMessage}</p>
                    )
                });
                return false
            }
            this.openAlert({
                "width": 800,
                "contentShow": "body",
                "title": "机构联系人信息：ID-" + providerId,
                "body": <ProviderContacts Lists={result.apiResponse.contacts} />
            });
        });
    };
}
