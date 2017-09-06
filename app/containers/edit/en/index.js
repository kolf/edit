import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import TableBox from "app/components/editor/table";
import SearchBox from "app/components/searchBox/index";
import ThumbnailBox from "app/components/provider/thumbnail";
import EditModal from "app/components/edit/editModal";
import EditRecord from "app/components/modal/editRecord";
import AddToTopic from "app/components/modal/addtoTopic";
//import CopyToClipboard from 'react-copy-to-clipboard';

import { Spin, Radio, Dropdown, Icon, Menu, Affix, Pagination, Button, Select, message, Input } from "antd";

const RadioGroup = Radio.Group;

const radioStyle = {
    display: 'block',
    height: '24px',
    lineHeight: '24px'
};

const descs = ['上传时间倒序', '上传时间正序', '编审时间倒序', '编审时间正序', '更新时间倒序', '更新时间正序'];

import { getStorage } from "app/api/auth_token";
import filterData from "app/components/searchBox/filterData";

import {
    isEdit,
    getStorageFilter,
    getStorageData,
    groupAddToTopic,
    groupViewEditHistory,
    groupViewPostilHistory,
    groupOnline,
    groupOffline,
    groupAddToNoEditor,
    groupAddToTheEditor,
    groupCopyOrMerge,
    photosNewOrAdd,
    groupCreate,
    refreshImage,
    oss176View
} from "app/action_creators/editor_action_creator";

import { favoriteQuery, favoriteItemAdd, favoriteSave } from "app/action_creators/person_action_creator";
// const topicIdArr = ['9462', '5999', '6182', '745', '10494', '11482', '14953'];

import storage from "app/utils/localStorage";
import { isElite, decode } from "app/utils/utils";
import $ from "app/utils/dom";
import { categoryQuery } from "app/action_creators/common_action_creator";
import { queryReason } from "app/action_creators/edit_action_creator";

const select = (state) => ({
    "error": state.editor.error,
    "dataFavorite": state.person.dataFavorite,
    "dataFavoriteItem": state.person.dataList,
    "dataList": state.editor.dataList,
    "reasonData": state.edit.reasonData
});
@connect(select)
export default class EditAllContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                { "path": "/home", "text": "首页" },
                { "path": "/en/edit/all", "text": "编辑类：全部资源" }
            ],
            "typeDoc": {
                1: { "typeName": "组照", "type": "group", "edit": "编审", "push": "推送", "copy": "复制并新建组", "merge": "合并并新建组" },
                2: {
                    "typeName": "单张",
                    "type": "photos",
                    "copyAndNew": "复制并新建组",
                    "copyAndAdd": "复制并加入组",
                    "splitAndNew": "拆分并新建组",
                    "splitAndAdd": "拆分并加入组"
                }
            },
            "tooltip": {
                "show": false,
                "target": null,
                "text": "更新中...",
                "placement": "right"
            },
            "doing": "doing",
            "alert": {},
            "filterInit": {},
            "dataFilter": filterData.list(44, 3, 4, 45, 47, 5, 6, 7, 8, 9),
            "filterParams": {
                "userId": getStorage('userId'), // userId 用户ID
                "role": 2,        // role 1 销售 2 财务 3 运营
                "keywordType": 1,
                "keyword": "",
                "resGroup": 1,    // resGroup 1 组照 2 单张
                "assetFamily": 1, // assetFamily 1 编辑 2 创意
                "groupState": "",  // groupState '1 未编审、2待编审、3二审,4已编审',
                "pageNum": 1,     // pageNum 当前页数
                "pageSize": 60,    // pageSize 每页条数
                "pageType": 10,
                "desc": 1
            },
            'selectStatus': [],
            'maskLoading': true,     // loading
            "listData": {            // 图片数据
                "listDisplay": 1,     // 列表展示方式
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
            "refreshTimer": null,
            hasRss: false
        };
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {
        document.title = '全部资源 - 编辑类 - 内容管理系统 - VCG © 视觉中国';
        const { dataFilter } = this.state;
        if (dataFilter == null || dataFilter.length == 0) this.refresh("pagination", { "pageNum": 1 });
        this.queryReason();
    };

    openAlert(alert) {
        Object.assign(alert, { "maskClosable": false, "dragable": true });
        this.setState({ alert, "doing": "openAlert" })
    };

    closeAlert() {
        this.setState({ "doing": "closeAlert" });
    };

    alertHandle(alert) {
        if (alert) {
            this.openAlert(alert);
        } else {
            this.closeAlert();
        }
    };

    messageAlert(params) {
        let alert = "";
        if (_.isString(params)) {
            alert = {
                "title": "编审系统问候：",
                "content": params
            };
            this.setState({ alert, doing: "alertError" });
        } else if (_.isObject(params)) {
            const { title, body, type } = params;
            alert = {
                "title": title ? title : "编审系统问候：",
                "content": body ? body : ""
            };
            let doing = "";
            if (type == "info") doing = "alertInfo";
            if (type == "success") doing = "alertSuccess";
            if (type == "error") doing = "alertError";
            if (type == "warning") doing = "alertWarning";
            this.setState({ alert, doing });
        }
    };

    setSelectStatus(type, selectStatus) {
        if (type == "all") this.setState({ "doing": "selectAll" });
        if (type == "cancel") this.setState({ "doing": "selectCancel" });
        if (type == "invert") this.setState({ "doing": "selectInvert" });
        if (type == "selectAppointed") this.setState({ "doing": "selectAppointed", selectStatus });
    };

    updateData({ doing, alert, selectStatus, listData, listSelectData }) { // set value
        if (listData) this.state.listData.list = listData;
        if (listSelectData) this.state.listSelectData = listSelectData;
        if (doing) this.state.doing = doing;
        if (alert) this.state.alert = alert;
        if (selectStatus) this.state.selectStatus = selectStatus;
    };

    setFixed = (rss) => {
        this.setState({
            hasRss: (rss && rss.length > 0)
        })
    }

    render() {
        const self = this;
        const { crumbs, alert, typeDoc, filterParams, dataFilter, doing, selectStatus, maskLoading, listData, hasRss } = this.state;
        const thumbnailConfig = {
            types: typeDoc[filterParams.resGroup].type,
            doing,
            selectStatus,
            maskLoading,
            lists: listData.list,
            dispatch: this.props.dispatch,
            onThumbnail: this.handleOnThumbnail.bind(this),
            updateData: this.updateData.bind(this)
        };
        //分页组件模块化
        const paginationInit = {
            "current": filterParams.pageNum,
            "pageSize": filterParams.pageSize,
            "total": listData.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal() {
                return '共 ' + listData.total + ' 条';
            },
            onShowSizeChange(pageSize) {
                self.refresh("pagination", { "pageNum": 1, "pageSize": pageSize });
            },
            onChange(current) {
                self.refresh("pagination", { "pageNum": current });
            }
        };
        return (
            <div className="main-content-inner">
                <div className="page-content">
                    <EditModal
                        doing={doing}
                        alert={alert}
                        updateData={this.updateData.bind(this)}
                    />

                    <SearchBox
                        modal={this.alertHandle.bind(this)}
                        resGroup={1}
                        hotSearchs={[]}
                        pageId={110}
                        keywordTypes={[{ label: '关键词', key: 1 }, { label: 'id', key: 0 }]}
                        showSearchBar={true}
                        assetFamily={filterParams.assetFamily}
                        comboboxSearch={getStorageFilter}
                        filterInit={dataFilter.slice()}
                        dataFilter={dataFilter}
                        onRss={this.setFixed}
                        onSearch={this.handleOnSearch.bind(this)}
                        searchError={this.props.error}
                    />

                    <Affix offsetTop={hasRss ? 22 : 0} className="row operate">
                        <div className="col-xs-7">
                            <a onClick={this.setSelectStatus.bind(this, 'all')}>全选</a>
                            <samp>|</samp>
                            <a onClick={this.setSelectStatus.bind(this, 'invert')}>反选</a>
                            <samp>|</samp>
                            <a onClick={this.setSelectStatus.bind(this, 'cancel')}>取消</a>
                            {/*已下线没有列表显示风格 推送记录没有卡片显示风格*/}
                            <Button type={listData.listDisplay == 1 ? "primary" : ""} size="large" icon="appstore" className="ml-10"
                                onClick={this.listDisplay.bind(this, 1)}></Button>
                            <Button disabled={filterParams.resGroup == 2} type={listData.listDisplay == 2 ? "primary" : ""} size="large" icon="bars"
                                onClick={this.listDisplay.bind(this, 2)}></Button>
                            {filterParams.resGroup == 1 && <span className="ml-10">
                                <Button title="复制并新建组" size="large" shape="circle" icon="addfolder"
                                    onClick={this.operateGroup.bind(this, { operate: "copy" })}></Button>
                                <Button title="合并并新建组" size="large" shape="circle" icon="folder"
                                    onClick={this.operateGroup.bind(this, { operate: "merge" })}></Button>
                                {/* <Button title="添加到待编审" size="large" shape="circle" icon="addfile" className="ml-10"
                                        onClick={this.addToNoEdit.bind(this) }></Button> */}
                                {/* <Button title="加入专题" size="large" shape="circle" icon="select"
                                        onClick={this.addToTopic.bind(this) }></Button> */}
                            </span>}
                            {filterParams.resGroup == 2 && <span className="ml-10">
                                <Button title="新建组照" size="large" shape="circle" icon={"switcher"} onClick={this.operateGroup.bind(this, { operate: "new" })}></Button>
                            </span>}
                            {/* <Button
                                title="收藏"
                                size="large"
                                shape="circle"
                                icon="star-o"
                                className="ml-10"
                                onClick={this.addToFavorite.bind(this) }></Button> */}

                            <Button
                                title="刷新"
                                size="large"
                                shape="circle"
                                icon="reload" onClick={this.refresh.bind(this)}></Button>

                            <Dropdown overlay={<Menu>{descs.map((label, index) => <Menu.Item><a onClick={this.orderByDate.bind(this, index + 1)} href="javascript:;">{label}</a>
                            </Menu.Item>)}</Menu>} placement="bottomCenter">
                                <Button size="large">{descs[filterParams.desc - 1]} <Icon type="down" /></Button>
                            </Dropdown>
                        </div>
                        {/*分页组件引用*/}
                        <div className="col-xs-5">
                            <div className="dataTables_paginate pull-right">
                                <Select value={filterParams.pageSize + '条/页'} onChange={e => { paginationInit.onShowSizeChange(e) }}>
                                    <Option value={60}>60条/页</Option>
                                    <Option value={100}>100条/页</Option>
                                    <Option value={200}>200条/页</Option>
                                </Select>
                                <Pagination simple {...paginationInit} />
                                <div className="total-page"> {paginationInit.showTotal()} </div>
                            </div>
                        </div>

                    </Affix>

                    <div className="row">
                        <div className="space-8"></div>
                    </div>

                    {listData.listDisplay == 1 && <ThumbnailBox  {...thumbnailConfig} />}
                    {listData.listDisplay == 2 && <TableBox
                        resGroup={filterParams.resGroup}
                        types="editorBase"
                        doing={doing}
                        maskLoading={maskLoading}
                        onTable={this.handleOnThumbnail.bind(this)}
                        updateData={this.updateData.bind(this)}
                        {...listData}
                    />}

                    {/*分页组件引用*/}
                    <div className="row">
                        <div className="col-xs-7"></div>
                        <div className="col-xs-5">
                            <div className="dataTables_paginate pull-right">
                                <Select value={filterParams.pageSize + '条/页'} onChange={e => { paginationInit.onShowSizeChange(e) }}>
                                    <Option value="60">60条/页</Option>
                                    <Option value="100">100条/页</Option>
                                    <Option value="200">200条/页</Option>
                                </Select>
                                <Pagination simple {...paginationInit} />
                                <div className="total-page"> {paginationInit.showTotal()} </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    queryReason() {
        const { dispatch } = this.props;
        dispatch(queryReason('cfp')).then((res) => { //查询不通过原因/下线原因
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return false;
            }
        })
    };

    queryList(params) {
        const { dispatch } = this.props;

        let { listData, listSelectData } = this.state;
        listData = {            // 图片数据
            "listDisplay": params.resGroup == 2 ? 1 : listData.listDisplay,     // 列表展示方式
            "list": null,        // 提交数据
            "listInit": null,    // 原始数据
            "selectStatus": [],  // 选择状态
            "timeByOrder": false,// 创建时间排序
            "total": 0           // 数据总数
        };
        listSelectData = {      // 选择列表数据
            "ids": [],           // id []
            "keys": [],          // key []
            "list": [],          // 选择数据 item []
            "listInit": []       // 选择原始数据 item []
        };
        this.setState({ listData, listSelectData, maskLoading: true });

        dispatch(getStorageData(params)).then((result) => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false;
            }
            result.apiResponse.list.forEach((item, index) => {
                item.key = index;
            });
            this.setState({ listData: Object.assign(listData, result.apiResponse), doing: "refresh", maskLoading: false, selectStatus: [] });
        });
    };

    refresh(type, dataParams) {
        const { filterParams } = this.state;

        //console.error(type, dataParams,filterParams);
        if (type == "pagination") { // pagination
            window.scrollTo(0, $.offset('.filter-container').height + 50);
            Object.assign(filterParams, dataParams);
        }
        if (type == "filter") { // filter
            Object.assign(filterParams, dataParams, { "pageNum": 1 });
        }
        if (type == "pagination") {
            this.setState({ filterParams });
        }
        this.queryList(filterParams);
    };

    handleOnThumbnail({ operate, key, id, resId, groupId, value, groupIds }) {
        switch (operate) {
            case "edit": // 编审
                if (groupIds) { // 单张
                    if (groupIds.length == 1) {
                        id = groupIds[0].id;
                        groupId = groupIds[0].groupId || groupIds[0].groupid;
                        resId = groupIds[0].resImageId
                    } else {
                        this.openAlert({
                            "width": 800,
                            "title": "请选择进入组照",
                            "contentShow": "selectGroupModal",
                            "params": {
                                comefrom: "edit",
                                groupIds
                            },
                            "isFooter": false
                        });
                        return;
                    }
                }

                let url = "/en/doing/group/edit/" + id + "?groupId=" + groupId
                if (resId) url += '&resId=' + resId
                if (id && groupId) window.open(url);
                break;
            case "addToNoEdit": // 添加到待编审
                this.addToNoEdit({ key, id, groupId });
                break;
            case "addToTheEdit": // 添加到未编审
                this.addToTheEdit({ key, id, groupId });
                break;
            case "push": // 推送
                if (id && groupId) window.open("/en/doing/group/push/" + id + "?groupId=" + groupId);
                break;
            case "viewGroup":
                if (id && groupId) window.open('/en/group/' + id + '?groupId=' + groupId);
                break;
            case "addToTopic": // 加入专题
                this.addToTopic({ key, id, groupId });
                break;
            case "addToFavorite": // 添加至收藏夹
                this.addToFavorite({ key, id, resId, groupId });
                break;
            case "viewEditHistory": // 查看编审记录
                this.viewEditHistory({ key, id, groupId, resId });
                break;
            case "viewPostilHistory": // 查看批注记录
                this.viewPostilHistory({ key, id, groupId });
                break;
            case "online":
                this.onlineGroup({ key, id, groupId, resId });
                break;
            case "offline":
                this.offlineGroup({ key, id, groupId, resId });
                break;
            case "accessLink": // 前台链接
                window.open("https://www.vcg.com/" + (resId ? 'editorial' : 'group') + "/" + id);
                break;
            case "refreshImage": // 前台链接
                this.refreshImage({ groupId });
                break;
            case "share": // 推荐
                this.share({ key, id, resId });
                break;
            default:
            //console.log(operate, key, id, value);
        }
    };

    refreshImage({ groupId }) {
        const submit = () => {
            const { dispatch } = this.props;
            dispatch(refreshImage({ groupId })).then(res => {
                if (res.apiError) {
                    message.error(res.apiError.errorMessage);
                    this.closeAlert();
                    return;
                }

                message.success('更新上线时间成功！');
                this.closeAlert();
            })
        };

        this.openAlert({
            "title": "更新上线时间",
            "contentShow": "body",
            params: {},
            "body": <p className="alert alert-info text-center mt-15"><i className="ace-icon fa fa-hand-o-right bigger-120"></i> 确定更新上线时间？</p>,
            "onOk": submit,
            "isFooter": true
        });

    }

    handleOnSearch(params, dataFilter, type) {
        const { onlineState, resGroup, agency, onlineTime } = params;

        if (!type && type !== 'rss') {
            filterData.remove([33, 34], dataFilter);
            if (onlineState) {
                const index = filterData.index('6', dataFilter);
                if (onlineState.indexOf('1') != -1 && onlineState.indexOf('3') != -1) {
                    filterData.add([33, 34], index, dataFilter);
                } else if (onlineState.indexOf('1') != -1) { //33
                    filterData.add([33], index, dataFilter);
                } else if (onlineState.indexOf('3') != -1) { //34
                    filterData.add([34], index, dataFilter);
                }
            } else if (onlineTime) {
                params.onlineTime = ''
            }
        }

        if (agency && type !== 'rss') {
            params.collectionId = '';
            const agencyIndex = filterData.index('3', dataFilter), collectioArr = [], agencyArr = [];

            if (dataFilter[agencyIndex].options.filter(item => item.id != -1).length > 0) {
                dataFilter[agencyIndex].options.forEach(option => {
                    if (agency.split(',').indexOf(option.id + '') != -1) {
                        if (option.agencyType == 0) {
                            agencyArr.push(option.id + '')
                        } else if (option.agencyType == 1) {
                            collectioArr.push(option.id + '')
                        }
                    }
                });
                //
                // if(agency.indexOf('319241,332505')!=-1){
                //     agencyArr.push('319241,332505')
                // }

                params.agency = agencyArr.join(',');
                params.collectionId = collectioArr.join(',');
            }
        }


        const providerIdIndex = filterData.index('4', dataFilter) + 1;
        if (resGroup == 1) {
            dataFilter[providerIdIndex] = filterData.get(39)
        } else if (resGroup == 2) {
            dataFilter[providerIdIndex] = filterData.get(42)
        }


        if (params.agency && (params.agency + '').indexOf('&') != -1) {
            params.agency = params.agency.replace('&', ',');
        }

        if (params.collectionId && (params.collectionId + '').indexOf('&') != -1) {
            params.collectionId = params.collectionId.replace('&', ',');
        }

        this.refresh("filter", params);
    };

    // 1.组照：复制、合并并新建组 2单张：新建、加入组
    operateGroup({ operate, key, id }) {
        const { dispatch } = this.props;
        const { typeDoc, filterParams, listSelectData } = this.state;

        // 判断是否有选择精选组照
        const flag = listSelectData.list.some(item => {
            if (item.topicIds) {
                return isElite(_.pluck(item.topicIds, 'id'));
            } else {
                return false;
            }
        });

        if (flag) {
            message.error('每日精选组照不能新建、合并、复制、拆分，请取消选择！');
            return;
        }

        const type = typeDoc[filterParams.resGroup].type;
        const typeName = typeDoc[filterParams.resGroup].typeName;
        //const operateName = typeDoc[filterParams.resGroup][operate];
        let paramsAlert = { type, operate }, title = '';
        const ids = id ? [id] : listSelectData.ids.map(id => id * 1);

        if (!ids.length) {
            this.messageAlert({ title, "body": "请选择" + typeName, "type": "info" });
            return false;
        }

        const operateObj = {
            new: `新建组照`,
            copy: `复制${typeName}并新建组`,
            merge: `合并${typeName}并新建组`,
            copyAndNew: `复制${typeName}并新建组`,
            copyAndAdd: `复制${typeName}并加入组`,
            splitAndNew: `拆分${typeName}并新建组`,
            splitAndAdd: `拆分${typeName}并加入组`,
            addToOverseas: `添加${typeName}加到海外`
        };

        if (type == 'group') {
            paramsAlert.groupIds = ids.join(',');
        } else if (type == 'photos') {
            paramsAlert.groupId = 0;
            paramsAlert.photoIds = ids.join(',');
        }

        paramsAlert.text = "已选组照新建后，将生成新组照，原组照中依然显示";

        this.openAlert({
            title: operateObj[operate],
            "params": paramsAlert,
            "contentShow": "loading",
            "isFooter": true,
            "onOk3": this.submitOperateGroup.bind(this, 'submitAndEdit'),
            "okText3": "确认并编审新组",
            "onOk2": this.submitOperateGroup.bind(this, 'submit'),
            "okText2": "确认"
        });

        dispatch(categoryQuery({ parentId: 0 })).then(res => {
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return;
            }

            let { alert } = this.state;

            alert.params.categorys = res.apiResponse;
            alert.contentShow = "newGroupModal";
            this.setState({ alert });
        })
    };

    submitOperateGroup(submitType) {
        const { alert } = this.state;
        const { dispatch } = this.props;
        alert.params = alert.params || {};
        const { oneCategory, groupId, operate, groupIds, photoIds, list } = alert.params;

        const callback = (id, groupId) => {
            if (submitType == "submitAndEdit") {
                // const {id, groupId} = result.apiResponse;
                window.open("/en/doing/group/edit/" + id + "?groupId=" + groupId);
            }

            // const {alert} = this.state;
            alert.params.groupId = '';
            this.closeAlert();

            const timer = setTimeout(() => {
                clearTimeout(timer);
                this.refresh();
            }, 300)
        }

        if (/groupCopy|groupMerge|imageCopyGroup|imageSplitMerge/.test(operate)) {
            if (!groupId) {
                alert.params.submitMsg = "请输入组ID!";
                this.setState({ alert });
                return false;
            }
        } else if (!oneCategory) {
            alert.params.submitMsg = "请选择分类！";
            this.setState({ alert });
            return false;
        }

        // {
        //     imageCopyNew: '复制并新建组',
        //     imageSplitNew: '拆分并新建组',
        //     imageCopyGroup: '复制并加入组照',
        //     imageSplitMerge: '拆分并加入组照',
        // }
        //console.log(operate);
        // //console.log(/groupCopy|groupMerge|imageCopyGroup|imageSplitMerge/.test(operate))

        if (/imageCopyNew|imageSplitNew|imageCopyGroup|imageSplitMerge/.test(operate)) {
            let params = {
                // type: 'photos',
                list,
                targetGroupId: groupId || 0,
                oneCategory
            };
            const operateObj = {
                imageCopyNew: {
                    url: 'copyImageListAdd2NewGroupOrAttach',
                    operate: 'copyAndNew'
                },
                imageCopyGroup: {
                    url: 'copyImageListAdd2NewGroupOrAttach',
                    operate: 'copyAndAdd'
                },
                imageSplitNew: {
                    url: 'splitImageListAddOrNew',
                    operate: 'splitAndNew'
                },
                imageSplitMerge: {
                    url: 'splitImageListAddOrNew',
                    operate: 'splitAndAdd'
                },
            };

            if (operateObj[operate].operate) params.operate = operateObj[operate].operate;

            dispatch(group(params, operateObj[operate].url)).then(res => {
                if (res.apiError) {
                    this.messageAlert(res.apiError.errorMessage);
                    alert.params.submitMsg = "服务器出错！";
                    this.setState({ alert });
                    return false
                }

                //console.log(res.apiResponse)

                const { data, message } = res.apiResponse || {};

                if (!data) {
                    message.error(message);
                } else {
                    const { id, groupId } = data;
                    callback(id, groupId)
                }
            })
        } if (operate == 'groupCopy' || operate == 'groupMerge') {
            const operateObj = {
                groupCopy: 'copy',
                groupMerge: 'merge'
            };

            dispatch(copyOrMerge2Attach({
                operate: operateObj[operate],
                groupIds,
                tarGroupId: groupId
            })).then(res => {
                if (res.apiError) {
                    this.messageAlert(res.apiError.errorMessage);
                    return false
                }

                const { id, groupId } = res.apiResponse;
                callback(id, groupId)
            })
        } else if (alert.params.operate == "new") { // 新建组
            alert.confirmLoading = true;
            this.setState({ alert });
            const { photoIds } = alert.params;

            dispatch(groupCreate({ photoIds, oneCategory })).then(result => {
                if (result.apiError) {
                    this.messageAlert(result.apiError.errorMessage);
                    return false
                }

                const { id, groupId } = result.apiResponse;
                callback(id, groupId)
            });
        } else if (alert.params.operate == "copy" || alert.params.operate == "merge") { // 复制、合并组
            alert.confirmLoading = true;
            this.setState({ alert });
            const { type, groupIds, operate } = alert.params;
            dispatch(groupCopyOrMerge({ type, groupIds, oneCategory, operate })).then(result => {
                if (result.apiError) {
                    this.messageAlert(result.apiError.errorMessage);
                    return false
                }

                const { id, groupId } = result.apiResponse;
                callback(id, groupId)
            });
        } else if (alert.params.operate == "addToOverseas") { // 添加到海外
            alert.confirmLoading = true;
            this.setState({ alert });
            const { filterParams, groupData, listData, listSelectData } = this.state;
            dispatch(groupAddToOverseas({
                "groupId": filterParams.ids,
                "group": groupData,
                "resourcs": listData.list,
                "selectIds": listSelectData.ids
            })).then(result => {
                if (result.apiError) {
                    message.error(result.apiError.errorMessage, 3);
                    return false;
                }
                message.success("发布成功！3秒后自动关闭窗口。");
                setTimeout(() => {
                    window.close();
                }, 3000);
            });
        }
    };

    // 收藏
    addToFavorite({ key, id, resId, groupId }) {
        const { typeDoc, filterParams } = this.state;
        const type = typeDoc[filterParams.resGroup].type;
        const typeName = typeDoc[filterParams.resGroup].typeName;
        let ids = [], title = "";
        if (id) {
            title = "收藏" + typeName + "：ID-" + ((type == "group") ? groupId : resId);
            ids.push(id);
        } else {
            title = "收藏多个" + typeName;
            ids = this.state.listSelectData.ids;
            if (ids.length == 0) {
                this.messageAlert({ title: title, body: "请选择" + typeName, type: "info" });
                return false;
            }
        }
        this.openAlert({
            "title": title,
            "contentShow": "loading",
            "params": {
                "userId": filterParams.userId,
                "type": type,   // group photos
                "ids": ids.join(','),     // groupIds photoIds
                "status": true, // 已有 - 新的
                "id": "",       // 已有 收藏夹 id
                "name": ""      // 新的 收藏夹 name
            },
            "onOk": this.submitAddToFavorite.bind(this),
            "isFooter": true
        });
        const { dispatch } = this.props;
        dispatch(favoriteQuery({ userId: filterParams.userId })).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }
            let { alert } = this.state;
            alert.contentShow = "favorite";
            alert.params.favoriteOption = result.apiResponse.list || [];
            this.setState({ alert });
        });
    };

    submitAddToFavorite() {
        const { dispatch } = this.props;
        const { alert, filterParams } = this.state;
        const { favId, ids, favName, status } = alert.params;

        let param = {
            ids,
            "isGroup": filterParams.resGroup == 1 ? 1 : 0
        };

        if (status) {
            if (!favId) {
                alert.params.submitMsg = "请选择已有收藏夹";
                this.setState({ alert });
                return false;
            }

            param.favId = favId;
            param.isNew = 0;
        } else {
            if (!favName) {
                alert.params.submitMsg = "请输入新的收藏夹名";
                this.setState({ alert });
                return false;
            }

            param.name = favName;
            param.isNew = 1;
        }
        alert.confirmLoading = true;
        this.setState({ alert });

        delete alert.params.favoriteOption;
        delete alert.params.submitMsg;
        dispatch(favoriteItemAdd(param)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }
            this.refresh();
            this.closeAlert();
        });
    };

    // 添加到未编审
    addToTheEdit({ key, id, groupId }) {
        const { listSelectData, selectStatus } = this.state;
        const ids = id ? [id] : listSelectData.list.filter(item => {
            if (item.groupState != 2) {
                selectStatus[item.key] = false;
                this.setState({ 'doing': 'selectAppointed', selectStatus });
            }
            return item.groupState == 2;
        }).map(item => item.id);
        if (ids.length == 0) {
            // this.messageAlert({title: '添加到未编审', body: "请选择待编审组照", type: "info"});
            message.info('请选择待编审组照!');
            return false;
        }
        this.openAlert({
            "title": "添加到未编审",
            "contentShow": "body",
            "params": {},
            "body": <p className="alert alert-info text-center mt-15"><i className="ace-icon fa fa-hand-o-right bigger-120"></i> 确定添加到未编审？</p>,
            "onOk": () => {
                const { dispatch } = this.props;
                dispatch(groupAddToTheEditor({ "groupIds": ids.join(',') })).then(result => {
                    if (result.apiError) {
                        this.messageAlert(result.apiError.errorMessage);
                        return false
                    }

                    let { listData } = this.state;
                    listData.list.forEach(item => {
                        if (ids.indexOf(item.id) != -1) {
                            item.groupState = 1
                        }
                    });

                    this.setState({ listData, doing: 'selectCancel' });

                    setTimeout(() => {
                        this.closeAlert();
                    }, 300)
                });
            },
            "isFooter": true
        });
    };

    // 添加到待编审
    addToNoEdit({ key, id, groupId }) {
        const { dispatch } = this.props;
        const { listSelectData, selectStatus } = this.state;
        const ids = id ? [id] : listSelectData.list.filter(item => {
            if (item.groupState != 1) {
                selectStatus[item.key] = false;
                this.setState({ 'doing': 'selectAppointed', selectStatus });
            }
            return item.groupState == 1;
        }).map(item => item.id);
        if (ids.length == 0) {
            // this.messageAlert({title: '添加到待编审', body: "请选择未编审组照", type: "info"});
            message.info('请选择未编审组照!');
            return false;
        }

        const flag = listSelectData.list.some(item => {
            if (item.topicIds) {
                return isElite(_.pluck(item.topicIds, 'id'));
            } else {
                return false;
            }
        });

        if (flag) {
            message.error('每日精选组照不能加入到待编审，请取消选择！');
            return;
        }

        const addToNoEditor = (submitType) => {
            const { oneCategory } = this.state.alert.params;
            dispatch(groupAddToNoEditor({ "groupIds": ids.join(','), oneCategory })).then(result => {
                if (result.apiError) {
                    this.messageAlert(result.apiError.errorMessage);
                    return false
                }

                if (submitType == "submitAndEdit" && ids.length == 1) {
                    window.open("/en/doing/group/edit/" + ids[0] + "?groupId=" + ids[0]);
                }

                let { listData } = this.state;
                listData.list.forEach(item => {
                    if (ids.indexOf(item.id) != -1) {
                        item.groupState = 2
                    }
                });

                this.setState({ listData, doing: 'selectCancel' });

                setTimeout(() => {
                    this.closeAlert();
                }, 300)

            });
        };

        this.openAlert({
            "title": "添加到待编审",
            "params": {
                text: '请选择主分类',
                type: 'group',
                operate: 'addToNoEditor'
            },
            "contentShow": "loading",
            "isFooter": true,
            "onOk3": (ids.length > 1 ? null : addToNoEditor.bind(this, 'submitAndEdit')),
            "okText3": "确认并编审新组",
            "onOk2": addToNoEditor.bind(this, 'submit'),
            "okText2": "确认"
        });

        dispatch(categoryQuery({ parentId: 0 })).then(res => {
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return;
            }

            let { alert, listData } = this.state;

            if (id) {
                alert.params.oneCategory = listData.list[key].oneCategory * 1;
            } else {
                let allOneCategory = listSelectData.list.reduce((result, item) => {
                    const { oneCategory } = item;
                    if (result.indexOf(oneCategory) == -1) {
                        result.push(oneCategory)
                    };
                    return result;
                }, []);

                if (allOneCategory[0] && allOneCategory.length == 1) {
                    alert.params.oneCategory = allOneCategory[0] * 1
                }
            }

            alert.params.categorys = res.apiResponse;
            alert.contentShow = "newGroupModal";
            this.setState({ alert });
        })
    };

    // 加入专题
    addToTopic({ key, id, groupId }) {
        let ids = [], title = "";
        if (id) {
            title = "加入组照到专题：ID-" + groupId;
            ids.push(id);
        } else {
            title = "加入多个组照到专题";
            ids = this.state.listSelectData.ids;
            if (ids.length == 0) {
                this.messageAlert({ title: title, body: "请选择组照", type: "info" });
                return false;
            }
        }
        this.openAlert({
            title,
            "width": 800,
            "contentShow": "body",
            "isFooter": false,
            "body": <AddToTopic groupId={ids} returnTopicId={id => { this.state.topicId = id; }}
                closeAlert={this.closeAlert.bind(this)} />,
            afterClose: () => {
                this.setState({ 'doing': 'selectCancel' })
            }
        });
    };

    //上线
    onlineGroup({ key, id, groupId, resId }) {
        // 确定上线此"+(resId?'单张':'组照')+"？
        this.openAlert({
            "title": "上线" + (resId ? '单张' : '组照') + "：ID-" + id,
            "contentShow": "body",
            "body": <p className="alert alert-info text-center mt-15"><i
                className="ace-icon fa fa-hand-o-right bigger-120"></i>{'确定上线此' + (resId ? '单张' : '组照')}</p>,
            "params": { id, resId },
            "onOk": this.submitOnlineGroup.bind(this),
            "isFooter": true
        });
    };

    submitOnlineGroup() {
        const self = this;
        const { alert } = this.state;
        alert.confirmLoading = true;
        this.setState({ alert });
        const { dispatch } = this.props;
        dispatch(groupOnline(alert.params)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }
            self.state.refreshTimer = setTimeout(() => {
                clearTimeout(self.state.refreshTimer);
                self.state.refreshTimer = null;
                self.refresh();
                self.closeAlert();
            }, 3000);
        });
    };

    //下线
    offlineGroup({ key, id, resId }) {
        const { reasonData } = this.props;

        let params = this.state.alert.params || {};

        this.openAlert({
            "bsSize": "small",
            "title": "下线原因",
            "contentShow": "body",
            params,
            "body": <RadioGroup value={params.offlineReason} onChange={e => {
                params.offlineReason = e.target.value;
                params.submitMsg = '';
                this.offlineGroup({ key, id, resId });
            }}>{[...reasonData].map(item => <Radio style={radioStyle} value={item.value}>{item.label}</Radio>)}</RadioGroup>,
            "onOk": this.submitOfflineGroup.bind(this, { id, resId, offlineReason: params.offlineReason }),
            "isFooter": true
        });

    };

    submitOfflineGroup({ id, resId, offlineReason }) {
        const { alert } = this.state;

        if (!offlineReason) {
            alert.params.submitMsg = "请选择下线原因";
            this.setState({ alert });
            return false;
        }

        alert.confirmLoading = true;
        this.setState({ alert });
        const { dispatch } = this.props;
        dispatch(groupOffline({ id, resId, offlineReason })).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }
            alert.params.offlineReason = '';
            this.refresh();
            this.closeAlert();
        });
    };

    // 查看编审记录
    viewEditHistory({ key, id, groupId, resId }) {
        //console.log({key, id, groupId, resId});
        const { dispatch } = this.props;
        let params = groupId ? { "type": 1, "groupId": id } : { "type": 1, "imageId": id };

        dispatch(groupViewEditHistory(params, groupId ? null : true)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }

            //console.log(result.apiResponse);
            this.openAlert({
                "contentShow": "body",
                "width": 800,
                "title": "编审记录：ID-" + (groupId ? groupId : resId),
                "body": <EditRecord head={[{ "field": "createdTime", "text": "编审时间" }, { "field": "userName", "text": "编审人" }, { "field": "message", "text": "编审内容" }]} Lists={result.apiResponse.reverse().slice(0, 20)} /> //记录太多倒序取20个
            });
        });
    };

    // 查看批注记录
    viewPostilHistory({ key, id, groupId }) {
        const item = this.state.listData.list[key];
        const title = "批注记录：ID-" + groupId;
        if (item && item.isPostil == "1") {
            const { dispatch } = this.props;
            dispatch(groupViewPostilHistory({ "type": 1, "groupId": id })).then(result => {
                if (result.apiError) {
                    this.messageAlert(result.apiError.errorMessage);
                    return false
                }
                this.openAlert({
                    "width": 800,
                    "title": title,
                    "contentShow": "body",
                    "body": <EditRecord head={[{ "field": "createdTime", "text": "批注时间" }, { "field": "userName", "text": "批注人" }, { "field": "message", "text": "批注内容" }]} Lists={result.apiResponse} />
                });
            });
        } else {
            this.messageAlert({ "title": title, "body": "还没有被批注过哦~", "type": "info" });
        }
    };

    // 推荐
    share({ key }) {
        const { id, resId, oss176, title, caption } = this.state.listData.list[key];
        const { dispatch } = this.props;
        dispatch(oss176View(oss176)).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                return false
            }
            this.openAlert({
                "title": "推荐" + (resId ? '单张' : '组照') + "：ID-" + id,
                "contentShow": "body",
                "body": <div>
                    <div className="mb-5"><b>{resId ? caption : title}</b></div>
                    <div className="mb-5">{"https://www.vcg.com/" + (resId ? 'editorial' : 'group') + "/" + id}</div>
                    <div className="mb-5"><img src={result.apiResponse} alt={resId ? caption : title} /></div>
                </div>,
                isFooter: false
            });
        });
    };

    // 时间排序
    orderByDate(val) {
        // const {filterParams} = this.state;
        this.state.filterParams.desc = val;
        this.refresh("pagination", { "pageNum": 1 });
    };

    listDisplay(value) {
        const { listData } = this.state;
        const oldDisplay = listData.listDisplay;

        setTimeout(() => {
            const rowsMap = {
                xs: 2,
                sm: 3,
                md: 4,
                xlg: 6
            };

            const rowSize = rowsMap[getDevice()];
            const scaleH = 436 / rowSize / 246;
            const translateY = $.offset('.filter-container').height + 46 + 96;
            const { scrollTop } = document.body;
            let top = translateY;
            if (oldDisplay === 1) {
                top = (scrollTop - top) / scaleH + translateY + 48
            } else {
                top = (scrollTop - top) * scaleH + translateY
            }

            window.scrollTo(0, top)
        }, 30)

        listData.listDisplay = value;
        this.setState({ listData, doing: "refresh" });
    }
}
