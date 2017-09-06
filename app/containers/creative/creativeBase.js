import React, { Component } from "react";

import { connect } from "react-redux";
import moment from "moment";
import storage from 'app/utils/localStorage';
import { getStorage } from "app/api/auth_token";
import SearchBox from "app/components/searchBox/index";
import ThumbnailBox from "app/components/provider/thumbnail";
import EditModal from "app/components/edit/editModal";
import EditRecord from "app/components/modal/editRecord";
import NoPassReasonBox from "app/components/creative/noPassReasonBox";
import { message, Menu, Dropdown, Button, Icon, Pagination, Select, Checkbox, Affix } from "antd";
import { decode } from 'app/utils/utils';

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

import filterData from "components/searchBox/filterData";

import $ from "app/utils/dom";

import {
    getNopassFilter,
    createSearch,
    postCreativeState,
    setImageOfflineTag,
    setImagePublish,
    setImageLicenseType,
    setImageQualityLevel,
    listByResId
} from "app/action_creators/create_action_creator";

import { queryReason } from "app/action_creators/edit_action_creator";

import { favoriteQuery, favoriteItemAdd } from "app/action_creators/person_action_creator";

const descs = ['上传时间倒序', '上传时间正序', '编审时间倒序', '编审时间正序'];

const select = (state) => ({
    "error": state.create.error,
    "dataList": state.create.data,
    "doing": state.create.doing
});

@connect(select)

export default class CreativeBaseContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                { "path": "/home", "text": "首页" },
                { "path": "/creative/editor", "text": "创意类：图片已编审" }
            ],
            "params": {},
            "alert": {
                "show": false,
                "isButton": true,
                "bsSize": "small",
                "onHide": this.closeAlert.bind(this),
                "title": null,
                "contentShow": "body",
                "inputReason": false,
                "body": null,
                "params": {},
                "submitAlert": null,
                "isLoading": false
            },
            "listData": {            // 图片数据
                "list": null,        // 提交数据
                "listInit": null,    // 原始数据
                "selectStatus": [],  // 选择状态
                "total": 0           // 数据总数
            },
            "listSelectData": {      // 选择列表数据
                "ids": [],           // id []
                "keys": [],          // key []
                "list": null,        // 选择数据 item []
                "listInit": null     // 选择原始数据 item []
            },
            'maskLoading': true,     // loading
            "dataFilter": props.dataFilter,
            'otherReason': '',
            'hasRss': false
        };

        Object.assign(this.state, this.props.filterParamsInit);

        // {label: '敏感内容', value: '敏感内容'},
        // {label: '陈旧内容', value: '陈旧内容'},
        // {label: '版权不合作', value: '版权不合作'},
        // {label: '法律法规问题', value: '法律法规问题'},
        // {label: '画质不佳', value: '画质不佳'},
        // {label: '买断下线', value: '买断下线'}

        this.offlineOptions = [];   // 下线原因 在弹框的时候请求一次
        this.noPassOptions = [];    // 不通过原因 在弹框的时候请求一次

    };

    componentDidMount() {

        let { dataFilter } = this.state;

        if (dataFilter == null || dataFilter.length == 0) {
            this.refresh("pagination", { "pageNum": 1 });
        }

        const { dispatch } = this.props;
        dispatch(queryReason("gc_image")).then(result => {
            this.noPassOptions = result.apiResponse[0].childNodes;
        });
        dispatch(queryReason("gc_offline")).then(result => {
            this.offlineOptions = result.apiResponse[0].childNodes;
        });

    };

    openAlert(alert) {
        // 添加可拖动
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
                "title": title || "编审系统问候：",
                "content": body || ""
            };
            let doing = "";
            if (type == "info") doing = "alertInfo";
            if (type == "success") doing = "alertSuccess";
            if (type == "error") doing = "alertError";
            if (type == "warning") doing = "alertWarning";
            this.setState({ alert, doing });
        }
    };

    setSelectStatus(type) {
        if (type == "all") this.setState({ "doing": "selectAll" });
        if (type == "cancel") this.setState({ "doing": "selectCancel" });
        if (type == "invert") this.setState({ "doing": "selectInvert" });
    };


    updateData({ doing, listData, listSelectData, imageRejectReason }) { // set value
        if (listData) this.state.listData.list = listData;
        if (listSelectData) this.state.listSelectData = listSelectData;
        if (doing) this.state.doing = doing;
        if (imageRejectReason) this.state.alert.params.imageRejectReason = imageRejectReason;
    };

    setFixed = (rss) => {
        this.setState({
            hasRss: (rss && rss.length > 0)
        })
    }

    render() {
        const { dataList } = this.props;
        const { hasRss, crumbs, alert, filterParams: { onlineState, pageNum, pageSize, resGroup, pageType, desc }, doing, listData, dataFilter, maskLoading } = this.state;

        //分页组件模块化
        const paginationInit = {
            "current": pageNum,
            pageSize,
            "total": listData.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal() {
                return '共 ' + listData.total + ' 条';
            },
            onShowSizeChange: (pageSize) => {
                this.refresh("pagination", { "pageNum": 1, pageSize });
            },
            onChange: (pageNum) => {
                this.refresh("pagination", { pageNum });
            }
        };

        return (
            <div className="page-content">
                <EditModal doing={doing} alert={alert} updateData={this.updateData.bind(this)} />

                <SearchBox
                    modal={this.alertHandle.bind(this)}
                    showSearchBar
                    hotSearchs={[]}
                    pageId={this.props.pageId}
                    assetFamily={2}
                    resGroup={2}
                    onRss={this.setFixed}
                    comboboxSearch={getNopassFilter}
                    filterInit={dataFilter.slice()}
                    dataFilter={this.state.dataFilter}
                    onSearch={this.handleOnSearch.bind(this)}
                    searchError={this.props.error}
                />

                <Affix offsetTop={hasRss ? 22 : 0} className="row operate">
                    <div className="col-xs-12 col-sm-8">
                        <a onClick={this.setSelectStatus.bind(this, 'all')}>全选</a>
                        <samp>|</samp>
                        <a onClick={this.setSelectStatus.bind(this, 'invert')}>反选</a>
                        <samp>|</samp>
                        <a onClick={this.setSelectStatus.bind(this, 'cancel')}>取消</a>

                        {(pageType == 20) &&
                            <span>
                                <Button type="button" size="large" title="通过" icon="check" className="ml-10"
                                    onClick={this.setPassAndNoPass.bind(this, { operate: "imageState", value: 4 })}>

                                </Button>
                                <Button type="button" className="mr-10" size="large" title="不通过" icon="close"
                                    onClick={this.setPassAndNoPass.bind(this, { operate: "imageState", value: 3 })}>

                                </Button>
                            </span>
                        }

                        {(pageType == 21 && onlineState == 1) && <span>
                            <Button type="button" size="large" icon="tag-o" title="标记下线" className="ml-10"
                                onClick={this.setOffline.bind(this, { operate: "offlineMark", value: 1 })}>
                            </Button>
                        </span>}
                        {(pageType == 21 && onlineState == 2) && <span>
                            <Button type="button" icon="check-square" size="large" title="确认下线" className="ml-10"
                                onClick={this.setOffline.bind(this, { operate: "offlineMark", value: 2 })}>
                            </Button>
                            <Button type="button" icon="close-square" size="large" title="取消标记下线"
                                onClick={this.setOffline.bind(this, { operate: "offlineMark", value: 3 })}>
                            </Button>
                        </span>}

                        {(pageType == 21 && onlineState == 3) &&
                            <Button type="button" className="ml-10" icon="to-top" size="large" title="上线"
                                onClick={this.setPassAndNoPass.bind(this, { operate: "imageState", value: 4 })}>
                            </Button>
                        }

                        {['A', 'B', 'C', 'D'].map((item, i) => <Button style={{ marginLeft: i == 0 ? 10 : 0 }} type="button" size="large" onClick={this.setQualityRank.bind(this, ({ operate: "qualityRank", key: i, value: i + 1 }))}>{item}</Button>)}

                        <Button type="button" className="ml-10" size="large"
                            onClick={this.setLicenseType.bind(this, { operate: "licenseType", value: 2 }, false)}>RF</Button>
                        <Button type="button" size="large"
                            onClick={this.setLicenseType.bind(this, { operate: "licenseType", value: 1 }, false)}>RM</Button>

                        {/* <Select style={{width: 120, marginRight: 5}} placeholder="供稿人信息授权信息" size="large" onChange={this.setLicenseType.bind(this)}>
                            {['Sino Imges RF','Sino Imges RM'].map((label, index) => <Option value={index+1}>{label}</Option>)}
                        </Select> */}

                        <Button title="收藏" size="large" shape="circle" icon="star-o" className="ml-10" onClick={this.addToFavorite.bind(this)}></Button>

                        <Button type="button" icon="reload" title="刷新" size="large" onClick={this.refresh.bind(this)}></Button>

                        <Dropdown overlay={<Menu>{descs.map((label, index) => <Menu.Item><a onClick={this.orderByDate.bind(this, index + 1)} href="javascript:;">{label}</a>
                        </Menu.Item>)}</Menu>} placement="bottomCenter">
                            <Button size="large">{descs[desc - 1]} <Icon type="down" /></Button>
                        </Dropdown>
                    </div>

                    {/*分页组件引用*/}
                    <div className="col-xs-12 col-sm-4">
                        <div className="dataTables_paginate pull-right">
                            <Select value={pageSize + '条/页'} onChange={e => { paginationInit.onShowSizeChange(e) }}>
                                <Option value="60">60条/页</Option>
                                <Option value="100">100条/页</Option>
                                <Option value="200">200条/页</Option>
                            </Select>
                            <Pagination simple {...paginationInit} />
                            <div className="total-page"> {paginationInit.showTotal()} </div>
                        </div>
                    </div>
                </Affix>

                <div className="row">
                    <div className="space-8"></div>
                </div>
                <ThumbnailBox
                    maskLoading={maskLoading}
                    doing={doing}
                    types={this.props.pageType}
                    lists={listData.list}
                    dispatch={this.props.dispatch}
                    alertHandle={this.alertHandle.bind(this)}
                    onThumbnail={this.handleOnThumbnail.bind(this)}
                    updateData={this.updateData.bind(this)} />

                {/*分页组件引用*/}
                <div className="row">
                    <div className="col-xs-12 col-sm-8"></div>
                    <div className="col-xs-12 col-sm-4">
                        <div className="dataTables_paginate pull-right">
                            <Select value={pageSize + '条/页'} onChange={e => { paginationInit.onShowSizeChange(e) }}>
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
        );
    };

    queryList(params) {
        this.setState({ maskLoading: true });
        const { dispatch } = this.props;
        dispatch(createSearch(params)).then((result) => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }

            let { listData } = this.state;
            const { total, list } = this.props.dataList;
            listData.total = total;
            listData.list = [];
            listData.selectStatus = [];
            [...list].forEach((item, i) => {
                let tmp = { ...item };
                _.mapKeys(item, (val, key) => {
                    tmp[key] = val;
                });
                tmp.key = i;
                listData.list.push(tmp);
            })


            // //console.log(dataList);
            //
            // let {listData} = this.state, _dataList = [];
            // [...dataList.list].map((item, i) => {
            //     let tmp = {...item};
            //     if(item.caption) tmp.caption= decode(item.caption);
            //     if(item.title) tmp.title= decode(item.title);
            //     //_.mapKeys(item, (val, key) => {
            //     //  tmp[key] = val;
            //     //});
            //     tmp.key = i;
            //     _dataList.push(tmp);
            // });
            // Object.assign(listData, dataList);
            // this.state.listData.list = _dataList;
            // this.state.listData.selectStatus = [];
            this.setState({
                listData, "doing": "refresh", 'maskLoading': false, 'listSelectData': {      // 选择列表数据
                    "ids": [],           // id []
                    "keys": [],          // key []
                    "list": null,        // 选择数据 item []
                    "listInit": null     // 选择原始数据 item []
                }
            });
        });
    };

    refresh(type, dataParams) {
        const { filterParams, listData } = this.state;
        //console.error(type, dataParams,filterParams);
        if (type == "pagination") { // pagination
            Object.assign(filterParams, dataParams);
        }
        if (type == "filter") { // filter
            Object.assign(filterParams, dataParams, { "pageNum": 1 });
        }
        if (type == "pagination") {
            window.scrollTo(0, $.offset('.filter-container').height + 50);
            this.setState({ filterParams });
        }
        this.queryList(filterParams);

        storage.remove('imageRejectReason');
        storage.remove('offlineReason')
    };

    handleOnThumbnail(params) {
        //console.log('handleOnThumbnail', params);
        const { operate, key, id, value, resId } = params;
        switch (operate) {
            case "collectionId":
                this.setLicenseType({ operate, key, id, value });
                break;
            case "licenseType":
                this.setLicenseType({ operate, key, id, value });
                break;
            case "qualityRank":
                this.setQualityRank({ operate, key, id, value });
                break;
            case "imageState":
                this.setPassAndNoPass({ operate, key, id, value });
                break;
            case "offlineMark":
                this.setOffline({ operate, key, id, value });
                break;
            case "addToFavorite":
                this.addToFavorite({ operate, key, id, resId, value });
                break;
            case "viewEditHistory":
                this.viewEditHistory({ id });
                break;
            default:
            // //console.log(key);
        }
    };

    handleOnSearch(params, dataFilter) {
        const { pageId } = this.props;

        //console.log(pageId);

        if (pageId == 21) {
            const index = filterData.index('21', dataFilter);
            const offlineItem = filterData.get(21);
            offlineItem.options = this.offlineOptions ? this.offlineOptions.map(item => { return { id: item.value, text: item.label } }) : offlineItem.options;

            switch (params.onlineState) {
                case "1":
                    if (index >= 0) dataFilter.splice(1, 1);
                    params.offlineReason = '';
                    params.offlineTime = '';
                    params.editTime = '';

                    dataFilter[5] = filterData.get(33); // 上线时间
                    break;
                case "2":
                    if (index < 0) dataFilter.splice(1, 0, offlineItem);
                    // dataFilter[6].text = '编审时间';
                    dataFilter[6] = filterData.get(6);
                    break;
                case "3":
                    if (index < 0) dataFilter.splice(1, 0, offlineItem);
                    // dataFilter[6].text = '下线时间';
                    dataFilter[6] = filterData.get(34);
                    params.onlineTime = '';
                    break;
                default:
                    if (index >= 0) dataFilter.splice(1, 1);
                    params.offlineReason = '';
                    params.offlineTime = '';
                    // dataFilter[5].text = '编审时间';
                    dataFilter[5] = filterData.get(6);
            }
        }

        this.refresh("filter", params);
    };

    handleOnPagination(pageNum) {
        this.refresh("pagination", { "pageNum": pageNum });
    };


    // 打开下线原因选择弹框
    openOfflineAlert({ operate, key, id, value }) {
        let offlineReason = storage.get('offlineReason') || '', defaultValue = [];
        let params = this.state.alert.params || {};

        if (offlineReason && offlineReason != 'undefined') {
            defaultValue = params.imageRejectReason = offlineReason.match(/\d+/g) || [];
        }

        //console.log('-------------', value);
        params.offlineMark = value;

        const open = (val) => {
            this.openAlert({
                "width": 600,
                "title": "标记下线原因",
                "contentShow": "body",
                params,
                "body": <CheckboxGroup value={val} options={this.offlineOptions} onChange={checkedValue => {
                    params.imageRejectReason = checkedValue;
                    params.submitMsg = '';
                    open(checkedValue)
                }} />,
                "onOk": this.submitOffline.bind(this, { operate, key, id, value }),
                "isFooter": true
            });
        }

        open(defaultValue)
    }

    /**
     * 标记下线事件 点击图片下方标记下线和图片列表上方批量标记下线触发
     *
     * @param {String} options.operate 操作类型 被操作对象的属性
     * @param {Number} options.key     被操作图片的索引
     * @param {Number} options.id      被操作图片的ID 空值表示是批量操作
     * @param {Number} options.value   被操作对象的属性的值
     */
    setOffline({ operate, key, id, value }) {
        //console.log('---',operate, key, id, value);
        const { listSelectData } = this.state;
        if (!id && listSelectData.ids.length === 0) {
            this.messageAlert({ "title": "操作提示", "body": "请选择单张", "type": "info" });
            return false;
        }
        if (value != 1) {
            if (id) {
                Object.assign(this.state.alert, {
                    params: {
                        offlineMark: value
                    }
                });
                this.submitOffline({ operate, key, id, value });
            } else {
                this.openAlert({
                    "width": 416,
                    "title": value == 2 ? '下线' : '取消标记下线',
                    "contentShow": "body",
                    "body": value == 2 ? '确定下线?' : '确定取消标记下线?',
                    "params": {
                        "offlineMark": value
                    },
                    "onOk": this.submitOffline.bind(this, { operate, key, id, value }),
                    "isFooter": true
                });
            }
            return false;
        }

        //if(this.offlineOptions.length == 0){
        //    this.props.dispatch(queryReason("gc_offline")).then(result=>{
        //        //console.log(result);
        //
        //        this.offlineOptions = result.apiResponse[0].childNodes;
        //
        //        this.openOfflineAlert( {operate, key, id, value} );
        //    });
        //    return;
        //}

        this.openOfflineAlert({ operate, key, id, value });
    };

    //设置标记下线事件
    submitOffline({ operate, key, id, value }) {
        const { alert, listData, listSelectData } = this.state;
        let param = [], imageRejectReasonResult;

        let { imageRejectReason } = alert.params;
        imageRejectReason = imageRejectReason || [];

        if (alert.params.offlineMark == 1) {
            if (!alert.params || imageRejectReason.length == 0) {
                alert.params.submitMsg = "请选择下线原因";
                this.setState({ alert });
                return false;
            }

            imageRejectReasonResult = imageRejectReason.sort().join(",");

            //设置提交中状态
            alert.confirmLoading = true;
            if (alert.params.submitMsg) alert.params.submitMsg = "";
            this.setState({ alert });

            storage.set('offlineReason', imageRejectReason.join(','));
        }
        if (id) {
            param.push({
                id: id,
                passState: alert.params[operate],
                offlineReason: imageRejectReasonResult
            });
        } else {
            listSelectData.list.map((item, i) => {
                param.push({
                    id: item.id,
                    passState: alert.params[operate],
                    offlineReason: imageRejectReasonResult
                });
            });
        }

        const { dispatch } = this.props;

        dispatch(setImageOfflineTag(param)).then(result => {
            if (result.apiError) {
                if (value == 1) {
                    alert.isLoading = false;
                    alert.params.submitMsg = result.apiError.errorMessage;
                    this.setState({ alert });
                    return false;
                }
                this.messageAlert(result.apiError.errorMessage);
            }

            if (!id) {
                listSelectData.keys.forEach((key) => {
                    listData.list[key].offlineMark = value;
                    //标记下线 改变下线原因
                    if (value == 1) {
                        listData.list[key].offlineReason = result.apiResponse;
                        listData.list[key].imageState = "2";
                    }
                    //确认下线 改变上线方式
                    if (value == 2) {
                        listData.list[key].onlineState = "3";
                    }
                });
                // this.setState({listData});
            } else {
                if (value != 3) {
                    listData.list[key][operate] = value;
                    //标记下线 改变下线原因
                    if (value == 1) {
                        listData.list[key].offlineReason = result.apiResponse;
                        listData.list[key].imageState = "2";
                    }
                    //确认下线 改变上线方式
                    if (value == 2) {
                        listData.list[key].onlineState = "3";
                    }
                    // this.setState({listData});
                }
            }

            // alert.params.imageRejectReason = '';
            this.setState({ listData, doing: 'selectCancel' });
            //

            setTimeout(() => {
                this.closeAlert();
            }, 300)
        });

    };

    // 打开不通过原因弹框
    // 操作参数、图片类型
    openNoPassAlert(params, graphicalStyle) {
        let imageRejectReasonTemp = storage.get('imageRejectReason');
        let imageRejectReason = {};
        // //console.log(imageRejectReason);

        if (imageRejectReasonTemp && imageRejectReasonTemp != 'undefined') {
            const data = JSON.parse(imageRejectReasonTemp);
            imageRejectReason.other = data.other || '';
        } else {
            imageRejectReason.other = ''
        }

        this.openAlert({
            "width": 800,
            height: 600,
            "title": "请选择不通过原因",
            wrapClassName: '',
            "contentShow": "body",
            "body": (
                <NoPassReasonBox
                    value={imageRejectReason}
                    noPassOptions={this.noPassOptions}
                    updateData={this.updateData.bind(this)}
                    graphicalStyle={graphicalStyle}
                />
            ),
            "params": {
                imageRejectReason
            },
            "onOk": this.submitSetPassAndNoPass.bind(this, params),
            "isFooter": true
        });
    }

    //显示通过不通过操作框 操作类型/批量操作/被操作的ID
    setPassAndNoPass({ operate, key, id, value }) {
        const { listData, listSelectData, filterParams: { pageType } } = this.state;
        let itemArr = [];
        if (id) {
            itemArr.push(listData.list[key]);
        } else {
            itemArr = listSelectData.list || [];
            if (itemArr.length === 0) {
                this.messageAlert({ "title": "操作提示", "body": "请选择单张", "type": "info" });
                return false;
            }
        }
        if (value == 4) {	// 设置通过的处理逻辑
            //检查要通过的图片是否满足需求 图片必须设置授权和等级 等级不允许为E
            for (var item of itemArr) {
                if (!item.ossYuantu) {
                    message.error('没有原图的图片不能上线！')
                    return;
                }
                if (!item.licenseType) {
                    this.messageAlert("请设置授权");
                    return;
                }
                if (!item.qualityRank) {
                    this.messageAlert("请设置图片等级");
                    return;
                }
                if (item.qualityRank == 5) {
                    this.messageAlert("请设置图片等级");
                    return;
                }
            }
            //不提示直接通过图片
            if (id) {
                this.state.alert.params = {};
                this.submitSetPassAndNoPass({ operate, key, id, value });
            } else {
                this.openAlert({
                    "width": 416,
                    "title": pageType == 20 ? '通过' : '上线',
                    "contentShow": "body",
                    "body": pageType == 20 ? '确定通过?' : '确定上线?',
                    "params": {
                        //"offlineMark": value
                    },
                    "onOk": this.submitSetPassAndNoPass.bind(this, { operate, key, id, value }),
                    "isFooter": true
                });
            }
            return false;
        }

        // 有一项，弹框默认展开该图片类型
        let graphicalStyle = itemArr.length == 1 ? itemArr[0].graphicalStyle : "";

        // 第一次不存在不通过原因 异步取值然后弹框
        //if(this.noPassOptions.length == 0){
        //    this.props.dispatch(queryReason("gc_image")).then(result=>{
        //        this.noPassOptions = result.apiResponse[0].childNodes;
        //        this.openNoPassAlert( {operate, key, id, value}, graphicalStyle );
        //    });
        //    return;
        //}

        this.openNoPassAlert({ operate, key, id, value }, graphicalStyle);

    };

    //设置图片状态通过/不通过 已优化
    submitSetPassAndNoPass({ operate, key, id, value }) {
        const { alert, listData, listSelectData } = this.state;
        const { imageRejectReason } = alert.params || {};
        let reasonVal = '', otherVal = '';

        const isEmpty = (obj) => {
            let flag = true;
            for (let name in obj) {
                if (obj[name]) {
                    flag = false
                }
            }
            return flag
        };

        if (!isEmpty(imageRejectReason)) {
            reasonVal = Object.keys(imageRejectReason).reduce((prev, cur) => {
                if (cur != 'other' && cur != 'value') {
                    prev = prev.concat(imageRejectReason[cur]);
                    // prev.push(cur)
                }
                return prev;
            }, []);

            otherVal = imageRejectReason.other || '';
        }


        if (value == 3) {
            storage.set('imageRejectReason', JSON.stringify(imageRejectReason));

            if (isEmpty(imageRejectReason)) {
                alert.params.submitMsg = "请选择不通过原因";
                this.setState({ alert });
                return false;
            }
            alert.confirmLoading = true;
            if (alert.params.submitMsg) alert.params.submitMsg = "";
            this.setState({ alert });
        }

        // // 收集提交的项
        let itemArr = id ? [{ id, key }] : listSelectData.list.map((item) => {
            return { id: item.id, key: item.key };
        });

        const param = itemArr.map(item => {
            // item.
            return {
                keywords: listData.list[item.key].keywords,
                collectionId: listData.list[item.key].collectionId,
                rotate: listData.list[item.key].rotate,
                keywords: listData.list[item.key].keywords,
                id: item.id,
                passState: value == 4 && listData.list[item.key].offlineMark == 2 ? 2 : value, // 手动下线图片 特殊处理
                imageRejectReason: (reasonVal || otherVal) ? `${reasonVal}|${otherVal}` : ''
            }
        });

        //执行请求
        const { dispatch } = this.props;
        dispatch(setImagePublish(param)).then(result => {
            if (result.apiError) {
                // 失败分情况 一种是不通过原因弹框的不通过 错误提示直接显示在弹框上
                // 另一种是直接通过弹出错误信息
                if (value == 3) {	// 不通过
                    alert.isLoading = false;
                    alert.params.submitMsg = result.apiError.errorMessage;
                    this.setState({ alert });
                    return false;
                }
                this.messageAlert(result.apiError.errorMessage);
                return;
            }

            // //console.log(this.noPassOptions);
            // 前端生成不通过原因
            // imageRejectReasonFormat = imageRejectReasonFormat.map(item=>{
            //     if(/^\d+$/.test(item)){   // 三位数数字 417
            //         return this.noPassOptions[item[0]].childNodes[item[1]].childNodes[item[2]].label;
            //     }else{
            //         return item;
            //     }
            // });

            // 显示设置后的状态到页面上
            itemArr.forEach(arrItem => {
                const item = listData.list[arrItem.key];
                //手动下线的图片不需要设置imageState
                //console.log('offlineMark---',operate);
                if (!(item.onlineState == 3 && item.offlineMark == 2)) item[operate] = value;
                if (value == 3) {   //批量不通过
                    item.imageRejectReason = result.apiResponse;
                    //console.log('--imageRejectReason---',result.apiResponse);
                    if (item.onlineState == "1") item.onlineState = "2";
                } else {
                    //console.log('------1111',item);
                    //通过之前手动下线的图片 直接设置上线
                    if (item.onlineState == 3 && item.offlineMark == 2) item.onlineState = 1;
                }
            });
            // this.setState({listData});
            //console.log(param[0]);

            // if(param[0].imageRejectReason) storage.set('imageRejectReason', param[0].imageRejectReason);
            this.setState({ listData, "doing": "selectCancel" });
            this.closeAlert();
        });
    }

    // 设置等级 operate操作的属性、key数据序号、id数据ID、value设置值 confirm：是否是弹框中的确定提交
    setQualityRank({ operate, key, id, value }, confirm = false) {
        const { listData, listSelectData } = this.state;
        const { dispatch, pageType } = this.props;

        //拼接参数
        let param = [];
        if (id) {
            param.push({
                id: id,
                qualityRank: value
            });

        } else { // 批量操作

            if (listSelectData.ids.length === 0) {
                this.messageAlert({ "title": "操作提示", "body": "请选择单张", "type": "info" });
                return false;
            }

            listSelectData.list.map((item, i) => {
                param.push({
                    id: item.id,
                    qualityRank: value
                });
            });
        }

        // 已上线 未确认 设置等级弹出需要提示
        if (confirm == false) {
            this.openAlert({
                "title": "操作提示",
                "body": <p className="alert alert-info text-center mt-15"><i
                    className="ace-icon fa fa-hand-o-right bigger-120"></i> 确定设置等级吗？</p>,
                "contentShow": "body",
                "isFooter": true,
                "onOk": this.setQualityRank.bind(this, { operate, key, id, value }, true)
            });

            return;
        } else if (confirm) { //用户操作确认 关闭确认框
            this.closeAlert();
        }

        dispatch(setImageQualityLevel(param)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return;
            }
            //批量操作
            if (!id) {
                listSelectData.keys.forEach((key) => {
                    listData.list[key][operate] = value;
                });
            } else {
                listData.list[key][operate] = value;
            }

            //更新state
            this.setState({ listData });
        });
    };

    // 提交授权 operate操作的属性、key数据序号、id数据ID、value设置值 confirm：是否是弹框中的确定提交
    setLicenseType({ operate, key, id, value }, confirm = false) {
        const { listData, listSelectData } = this.state;
        const { dispatch, pageType } = this.props;

        let ids = id ? [id] : listSelectData.ids;

        if (!ids.length) {
            message.error('请选择要操作的图片');
            return false;
        }

        //console.log(confirm);

        if (!confirm) { // 单个
            this.openAlert({
                "title": "操作提示",
                "body": <p className="alert alert-info text-center mt-15"><i
                    className="ace-icon fa fa-hand-o-right bigger-120"></i> 确定设置授权类型吗？</p>,
                "contentShow": "body",
                "isFooter": true,
                "onOk": this.setLicenseType.bind(this, { operate, key, id, value }, true)
            });

            return;
        } else if (confirm) { //用户操作确认 关闭确认框
            this.closeAlert();
        };

        // const filterIds =
        ids = listData.list.filter(item => ids.indexOf(item.id) != -1 && (item.providerAgentType == 1 || item.providerAgentType == 2) && item.collections.map(col => col.licenseType).indexOf(value)!==-1).map(item => item.id);

        if (!ids.length) return;

        dispatch(setImageLicenseType({
            ids,
            licenseType: value
        })).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                return;
            }

            listData.list.forEach(item => {
                if (ids.indexOf(item.id) != -1) {
                    item.licenseType = value;
                }
            });
            //更新state
            this.setState({ listData });
        });
    };

    // 添加到收藏
    addToFavorite({ key, id, resId, groupId }) {
        const { filterParams, listSelectData } = this.state;
        const ids = id ? [id] : listSelectData.ids, title = "";

        if (!ids.length) {
            message.error('请选择图片！');
            return false;
        }

        this.openAlert({
            "title": '收藏图片',
            "contentShow": "loading",
            "params": {
                "userId": filterParams.userId,
                "type": "photos",   // group photos
                "ids": ids.join(','),     // groupIds photoIds
                "status": true, // 已有 - 新的
                "id": "",       // 已有 收藏夹 id
                "name": ""      // 新的 收藏夹 name
            },
            "onOk": this.submitAddToFavorite.bind(this),
            "isFooter": true
        });
        const { dispatch } = this.props;
        dispatch(favoriteQuery({ userId: filterParams.userId, "pageNumber": 1, "pageSize": 10000 })).then(result => {
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
        const { alert } = this.state;
        const { favId, ids, favName, name, status } = alert.params;
        let param = {
            ids,
            "isGroup": 0
        };
        // //console.log(alert.params);
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

        const { dispatch } = this.props;
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

    // 时间排序
    orderByDate(val) {
        // const {filterParams} = this.state;
        this.state.filterParams.desc = val;
        this.refresh("pagination", { "pageNum": 1 });
    };

    //查看编审记录
    viewEditHistory({ id }) {
        const { dispatch } = this.props;

        dispatch(listByResId({ resId: id })).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }

            //console.log(result.apiResponse);

            this.openAlert({
                "width": 800,
                "title": "编审记录：ID-" + id,
                "contentShow": "body",
                "body": <EditRecord head={[{ "field": "createdTime", "text": "编审时间" }, { "field": "userName", "text": "编审人" }, { "field": "message", "text": "编审内容" }]} Lists={result.apiResponse} /> //记录太多倒序取20个
            });
        });
    };
}
