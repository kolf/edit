/***************
 *关键词审核组件
 *****************/
import React, {Component} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {setStorage,getStorage} from "app/api/auth_token";
import SearchBox from "app/components/searchBox/index";
import ThumbnailBox from "app/components/provider/thumbnail";
import EditModal from "app/components/edit/editModal";
import EditRecord   from "app/components/modal/editRecord";
import {getToeditFilter} from "app/action_creators/editor_action_creator";
import storage from 'app/utils/localStorage';


import {Dropdown, Icon, Menu, Affix, Pagination, Button, Checkbox, Select, message} from "antd";
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

import {
    findlocaltion,
    findKeyword,
    addKeyword,
    modifyKeyword,
    getKeywordById
} from "app/action_creators/edit_action_creator";
import {createSearch, keywordPublish, keywordSave, listByResId} from "app/action_creators/create_action_creator";
import {dataCache, cachedData} from "app/action_creators/common_action_creator";
import {favoriteQuery, favoriteItemAdd} from "app/action_creators/person_action_creator";

// keywordsAudit字段分割的正则
// const keywordsAuditReg = /[^,\|]+\|[^|]*\|\d+/g, keywordsSplitReg = /,|::/;
const keywordsAuditReg = /[^,\|\s].*?\|[^|]*?\|[0-9\.]+\|\d+/g, keywordsSplitReg = /,|::/;
// 开头不是逗号也不是竖线也不是空格 *可能为空 | 不是竖线的多个任意字符 | 多个数字
// 关键词 男人|4165|1 或者 how old are you|4165|1
import {decode} from 'app/utils/utils';
import $ from "app/utils/dom";

const descs = ['上传时间倒序','上传时间正序','编审时间倒序', '编审时间正序'];

const select = (state) => ({
    "dataList": state.create.data,
    "doing": state.create.doing
});
@connect(select)
export default class TagAuditContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "dataFilter": props.dataFilter || [],
            "filterParams": {
                "pageType": props.pageId,
                "userId": getStorage('userId'), // userId 用户ID
                "keywordType": 1,
                "keyword": "",
                "desc": props.pageId == 23 ? 3 : 1,
                "pageNum": 1,
                "pageSize": 60,
                "total": 0,
                "imageState": props.imageState,
                "resGroup": 2
            },
            "params": {},
            "alert": {},
            "doing": "doing",
            "listData": {            // 图片数据
                "list": null,        // 提交数据
                "listDisplay": 1,    // 图片展示方式 1 单个框 2 多个框
                "listInit": null,    // 原始数据
                "selectStatus": [],  // 选择状态
                "total": 0,          // 数据总数
                "pageNum": 1,           // 当前步进器针对页码
                "step": 1,           // 当前步进器补数
                "perStepSize":1000     // 每步多少条数据
            },
            "selectStatus":[],
            'maskLoading': true,     // loading
            "listSelectData": {      // 选择列表数据
                "ids": [],           // id []
                "keys": [],          // key []
                "list": [],        // 选择数据 item []
                "listInit": []     // 选择原始数据 item []
            },
            "keywordsDic": null,
            "cacheParams": {},
            'hasRss': false
        };

        //拼接供稿人ID到筛选组件中
        Object.assign(this.state, this.props.filterParamsInit);

        this.onScrollHandle = this.onScrollHandle.bind(this);
        this.operatingFloor = this.operatingFloor.bind(this);
        this.openAlert = this.openAlert.bind(this);
        this.synchronizeTagDataAfter = this.synchronizeTagDataAfter.bind(this);
    };

    componentWillMount(){

    }

    componentDidMount() {
        let {dataFilter} = this.state;
        //没有搜索组件 触发显示数据
        if (dataFilter == null || dataFilter.length == 0) {
            this.refresh("pagination", {"pageNum": 1});
        }

        // 添加滚动监听 步进器
        document.addEventListener("scroll", this.onScrollHandle);
    };

    componentWillUnmount() {
        // 移除滚动监听 步进器
        document.removeEventListener("scroll", this.onScrollHandle);
    }

    // setState以后 判断页码是否改变 步进器是否要更新
    shouldComponentUpdate(nextProps, nextState) {
        const {listData} = this.state;
        if(listData.pageNum != nextState.filterParams.pageNum){
            listData.pageNum = nextState.filterParams.pageNum;
            listData.step = 1;
        }

        return true;
    }

    onScrollHandle(){
        const {listData} = this.state;
		// //console.log(document.body.innerHeight,document.boy.clientHeight,document.scrollHeight);
		// //console.log(document.body.clientHeight + Math.ceil(document.body.scrollTop),document.body.scrollHeight);
        if ((document.body.clientHeight + Math.ceil(document.body.scrollTop||document.documentElement.scrollTop)) >= document.body.scrollHeight) {

            // 数据为空 或者之前已经加载完所有数据
            //console.log("长度", listData.list.length);
            if(!listData.list || listData.list.length < listData.step*listData.perStepSize ){
                return;
            }

            listData.step += 1;

            this.setState({listData, doing: "selectAppointed"});
        }

    }

    openAlert(alert) {
        // 添加可拖动
        Object.assign(alert,{"maskClosable": false, "dragable" : true});
        this.setState({alert, "doing": "openAlert"})
    };

    closeAlert() {
        this.setState({"doing": "closeAlert", "footer": false});
    };

    // 子组件弹框代理 传参数表示打开 否则为关闭
    alertHandle(alert) {
        if(alert){
            this.openAlert(alert);
        }else{
            if(this.state.alert.params && _.isBoolean(this.state.alert.params.isPublish)) {
                this.synchronizeTagData(this.synchronizeTagDataAfter);
            }else {
                this.closeAlert();
            }
        }
    }

    messageAlert(params) {
        let alert = "";
        if (_.isString(params)) {
            alert = {
                "title": "编审系统问候：",
                "content": params
            };
            this.setState({alert, doing: "alertError"});
        } else if (_.isObject(params)) {
            const {title, body, type} = params;
            alert = {
                "title": title || "编审系统问候：",
                "content": body || ""
            };
            let doing = "";
            if (type == "info") doing = "alertInfo";
            if (type == "success") doing = "alertSuccess";
            if (type == "error") doing = "alertError";
            if (type == "warning") doing = "alertWarning";
            this.setState({alert, doing});
        }
    };

    setSelectStatus(type,selectStatus) {
        if (type == "all") this.setState({"doing": "selectAll"});
        if (type == "cancel") this.setState({"doing": "selectCancel"});
        if (type == "invert") this.setState({"doing": "selectInvert"});
        if (type == "selectAppointed") this.setState({"doing": "selectAppointed", selectStatus});
    };

    //查看编审记录
    viewEditHistory({id}) {
        const {dispatch} = this.props;

        dispatch(listByResId({resId: id})).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }

            //console.log(result.apiResponse);

            this.openAlert({
                "width": 800,
                "title": "编审记录：ID-" + id,
                "contentShow": "body",
                "body": <EditRecord head={[{"field": "createdTime","text": "编审时间"},{"field": "userName","text": "编审人"},{"field": "message","text": "编审内容"}]} Lists={result.apiResponse}/> //记录太多倒序取20个
            });
        });
    };

    updateData({doing, alert, selectStatus, listData, listSelectData, operate, key}) { // set value
        //console.log('updateData-----', doing, alert, selectStatus, listData, listSelectData, operate, key);
        // listData只是部分数据 不能完全合并 本来就是一份数据
        if (listData)  {
            this.state.listData.list = listData;
            //console.log('----',this.state.listSelectData.keys,key);
            if(_.indexOf(this.state.listSelectData.keys,key)>=0) {
                this.state.listSelectData.list[key] = listData[key];
                this.synchronizeTagData(this.synchronizeTagDataAfter);
            }
        }
        //if (listData) {
        //    if(this.state.listData.list.length == listData.length){
        //        this.state.listData.list = listData;
        //    }else{
        //        // 只把显示的图片合并到原数据中
        //        // 替换的数据不能是数组 参数2失败
        //        // this.state.listData.list.splice(0, listData.length, listData);
        //        //
        //        // 采用如下方式进行前面多少项的替换
        //        this.state.listData.list =listData.concat(this.state.listData.list.slice(listData.length));
        //    }
        //}
        if (listSelectData) { // doing getSelectList
            this.state.listSelectData = listSelectData;

            // 选择同步 keywordsDic 是稳定的
            this.synchronizeTagData(this.synchronizeTagDataAfter);
        }
        if(selectStatus) this.state.selectStatus = selectStatus;
        if (doing) this.state.doing = doing;
        if (alert) this.state.alert = alert;
        if (doing == "handleOnUpdateTags") {
            const item = listData[key];
            if (item.keywordsArr) {
                this.state.cacheParams[item.id] = {
                    keywordsArr: item.keywordsArr
                };
                setStorage({"key": this.state.filterParams.userId + "-creativeTagCache", "value": JSON.stringify(this.state.cacheParams)});
            }
            if (item.keywordsAuditArr) {
                this.state.cacheParams[item.id] = {
                    keywordsAuditArr: item.keywordsAuditArr
                };
                setStorage({"key": this.state.filterParams.userId + "-creativeTagCache", "value": JSON.stringify(this.state.cacheParams)});
            }
        }
        if (doing == "setFieldValue") {
            const item = listData[key];
            if (item.title) {
                this.state.cacheParams[item.id] = {
                    title: item.title
                };
                setStorage({"key": this.state.filterParams.userId + "-creativeTagCache", "value": JSON.stringify(this.state.cacheParams)});
            }
        }

    };

    updateKeywordDic(data) {
        let {keywordsDic,alert} = this.state;
        if(data) {
            if (_.isArray(data)) {
                data.map((item)=> {
                    keywordsDic[item.id] = item;
                })
            } else {
                keywordsDic[data.id] = data;
            }
            this.setState({keywordsDic});
        }
        //console.log('updateKeywordDic---alert',alert);
        if(alert.params && _.isBoolean(alert.params.isPublish)) this.synchronizeTagData(this.synchronizeTagDataAfter);
    };

    setFixed = (rss) => {
        this.setState({
            hasRss: (rss && rss.length>0)
        })
      }

    render() {
        const self = this;
        const {dataList, dispatch, pageType} = this.props;
        const {alert, filterParams, doing, listData, keywordsDic, selectStatus,maskLoading, dataFilter, hasRss} = this.state;

        let lists = [];
        if(listData.list && listData.list.length > 0) {
            lists = listData.list.filter((item,i)=>i < listData.perStepSize*listData.step);
        }else{
            lists = listData.list;
        }

        const thumbnailConfig = {
            dispatch: this.props.dispatch,
            updateKeywordDic: this.updateKeywordDic.bind(this),
            updateData: this.updateData.bind(this),
            onThumbnail: this.handleOnThumbnail.bind(this),
            selectStatus,
            maskLoading,
            doing,
            types: pageType,
            lists,
            listDisplay: listData.listDisplay,
            keywordsDic: keywordsDic,
            alertHandle: this.alertHandle.bind(this)
        };
        // 分页组件模块化
        const paginationInit = {
            "current": filterParams.pageNum,
            "pageSize": filterParams.pageSize,
            "total": listData.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal () {
                return '共 ' + listData.total + ' 条';
            },
            onShowSizeChange (pageSize) {
                self.refresh("pagination", {"pageNum": 1, pageSize});
            },
            onChange(pageNum) {
                self.refresh("pagination", {pageNum});
            }
        };

        //console.log(this.props);

        return (
            <div>
                <EditModal
                    doing={doing}
                    alert={alert}
                    updateData={this.updateData.bind(this)} />

                <SearchBox
                    onRss={this.setFixed}
                    inputLeft={445}
                    keywordTypes={this.props.keywordTypes}
                    modal= {this.alertHandle.bind(this)}
                    showSearchBar
                    hotSearchs={[]}
                    pageId={this.props.pageId}
                    assetFamily={2}
                    resGroup={2}
                    comboboxSearch={getToeditFilter}
                    filterInit={dataFilter.slice()}
                    dataFilter={this.state.dataFilter}
                    onSearch={this.handleOnSearch.bind(this) }
                    searchError={this.props.error}/>

                <Affix offsetTop={hasRss ? 22 : 0} className="row operate">
                    <div className="col-xs-12 col-sm-7">
                        <a onClick={this.setSelectStatus.bind(this,'all') }>全选</a>
                        <samp>|</samp>
                        <a onClick={this.setSelectStatus.bind(this,'invert') }>反选</a>
                        <samp>|</samp>
                        <a onClick={this.setSelectStatus.bind(this,'cancel') }>取消</a>
                        <Button type={listData.listDisplay==2 ? "primary":""} size="large" icon="bars" className="ml-10" onClick={this.listDisplay.bind(this, 2) }>
                        </Button>
                        <Button type={listData.listDisplay==1 ? "primary":""} size="large" icon="minus" onClick={this.listDisplay.bind(this, 1) }>
                        </Button>
                        <Button size="large" className="ml-10" title="上线" icon="to-top" onClick={this.batchPublish.bind(this, true) }>
                        </Button>
                        {pageType == "creativeTagNoEditor" &&
                            <Button size="large" title="不通过" icon="close" onClick={this.setNotPass.bind(this) }>
                            </Button>
                        }
                        <Button size="large" title="编辑关键词" icon="edit" onClick={this.batchPublish.bind(this, false) }>
                        </Button>
                        <Button title="收藏" size="large" shape="circle" icon="star-o" className="ml-10" onClick={this.addToFavorite.bind(this) }></Button>
                        <Button size="large" title="刷新" icon="reload" onClick={this.refresh.bind(this) }>
                        </Button>
                        {/*<button className="btn btn-sm btn-info" onClick={this.batchOperateKeywords.bind(this, 'add') }>
                         批量添加关键词
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.batchOperateKeywords.bind(this, "delete") }>
                         批量删除关键词
                         </button>*/}
                         <Dropdown overlay={<Menu>{descs.map((label, index) => <Menu.Item><a onClick={this.orderByDate.bind(this, index+1)} href="javascript:;">{label}</a>
     </Menu.Item>)}</Menu>} placement="bottomCenter">
                           <Button size="large">{descs[filterParams.desc-1]} <Icon type="down"/></Button>
                         </Dropdown>
                    </div>

                    {/*分页组件引用*/}
                    <div className="col-xs-12 col-sm-5">
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
                </Affix>

                <div className="row">
                    <div className="space-8"></div>
                </div>

                <ThumbnailBox {...thumbnailConfig} />

                {/*分页组件引用*/}
                <div className="row">
                    <div className="col-xs-12 col-sm-7"></div>
                    <div className="col-xs-12 col-sm-5">
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
        );
    };

    queryList(params) {
        this.setState({maskLoading: true,"keywordsDic": null});
        const {dispatch} = this.props;
        dispatch(createSearch(params)).then((result) => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return;
            }
            const {dataList} = this.props;
            let {listData} = this.state,_dataList = [],keywordsTagArr = [];
            [...dataList.list].map((item, i) => {
                let tmp = {...item};

                if(item.title) tmp.title = decode(item.title);
                if(item.caption) tmp.caption = decode(item.caption);

                tmp.rotate = 0;
                tmp.key = i;
                tmp.keywordsArr = [];
                tmp.keywordsAuditArr = [];
                if (tmp.keywords) {
                    const keywordsArr = _.uniq(tmp.keywords.split(keywordsSplitReg));
                    tmp.keywordsArr = _.compact(keywordsArr);
                    keywordsTagArr = keywordsTagArr.concat(keywordsArr);
                }
                if (tmp.keywordsAudit) {
                    const auditMatchResult = tmp.keywordsAudit.match(keywordsAuditReg);
                    let keywordsAuditArr = [];
                    auditMatchResult.map((auditItem)=> {
                        //console.log(auditItem);
                        const auditSplitResult = auditItem.split('|');
                        keywordsTagArr = keywordsTagArr.concat(auditSplitResult[1].split(keywordsSplitReg));

                        //console.log(auditSplitResult);

                        keywordsAuditArr.push({
                            label: auditSplitResult[0],
                            id: auditSplitResult[1],
                            type: auditSplitResult[2],
                            source: auditItem
                        });
                    });
                    tmp.keywordsAuditArr = _.uniq(keywordsAuditArr, 'source');
                }

                // 操作痕迹
                // let cacheParams = getStorage(this.state.filterParams.userId + "-creativeTagCache");
                // if(!_.isEmpty(cacheParams)) {
                //     cacheParams = JSON.parse(cacheParams);
                //     if (cacheParams[tmp.id] && cacheParams[tmp.id].caption) {
                //         tmp.caption = cacheParams[tmp.id].caption;
                //     }
                //     if (cacheParams[tmp.id] && cacheParams[tmp.id].keywordsArr) {
                //         if(cacheParams[tmp.id].keywordsArr.length>0){
                //             tmp.keywordsArr = cacheParams[tmp.id].keywordsArr;
                //             keywordsTagArr.concat(tmp.keywordsArr);
                //         }
                //     }
                //     if (cacheParams[tmp.id] && cacheParams[tmp.id].keywordsAuditArr) {
                //         if(cacheParams[tmp.id].keywordsAuditArr.length > 0){
                //             tmp.keywordsAuditArr = cacheParams[tmp.id].keywordsAuditArr;
                //             [...tmp.keywordsAuditArr].map(item=>{
                //                 if(item.id) keywordsTagArr.push(item.id);
                //             });
                //         }
                //     }
                // }

                _dataList.push(tmp);
            });

            Object.assign(listData, dataList);
            listData.list = _dataList;
            //console.log("listData.list", listData.list);
            this.setState({ listData, doing: "selectAppointed", 'maskLoading': false, selectStatus: []});

            this.initKeywordDic({keywordsTagArr});
        })
    };

    //生成字典&初始化生成字段
    initKeywordDic({keywordsTagArr}) {
        keywordsTagArr = _.compact(_.uniq(keywordsTagArr));
	    if(keywordsTagArr.length == 0){
		    this.setState({"keywordsDic": {}});
		    return;
	    }
        const {dispatch} = this.props;
        dispatch(getKeywordById({ 'data': keywordsTagArr.join(',') }, 'creative')).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false;
            }

            //创建字典
            let keywordsDic = {},keywordsArr=[];
            [...result.apiResponse].forEach(item => {
                keywordsDic[item.id] = item;
                keywordsArr.push(item.id+"");
            });
            const keywordsAuditArr = _.difference(keywordsTagArr,keywordsArr);
            if(keywordsAuditArr.length>0) {
                //console.error("初始化处理新词：",keywordsAuditArr);
                this.recoveryKeywords(keywordsAuditArr);
            }

            //console.log(keywordsDic);
            this.setState({ keywordsDic });

        });

    };

    recoveryKeywords(keywordsAuditArr) {
        this.state.listData.list.map((item,i)=>{
            //console.log('item.keywordsArr---1',item.keywordsArr,item.keywordsArr.length);
            _.remove(item.keywordsArr,(keyword)=>{
                return _.indexOf(keywordsAuditArr, keyword+'')!=-1;
            });
            //console.log('item.keywordsArr---2',item.keywordsArr,item.keywordsArr.length);
        });
        //console.log('keywordsAuditArr',keywordsAuditArr);
    };

    refresh(type, dataParams) {
        const {filterParams, listData} = this.state;
        if (type == "pagination") { // pagination

            // 添加图片组件加载中状态
            // listData.list = null;
            // this.setState({listData});

            Object.assign(filterParams, dataParams);
        }
        if (type == "filter") { // filter
            Object.assign(filterParams, dataParams, {"pageNum": 1});
        }
        if (type == "pagination") {
            window.scrollTo(0, $.offset('.filter-container').height + 50);
            this.setState({filterParams});
        }
        this.queryList(filterParams);
    };

    handleOnSearch(params, current, tags) {
        this.refresh("filter", params);
    };

    handleOnPagination(pageNum) {
        this.refresh("pagination", {"pageNum": pageNum});
    };

    handleOnThumbnail({operate, key, id, resId, groupId, value, selectedOptions}) {
        //console.log('handleOnThumbnail---',operate, key, id, resId, groupId, value, selectedOptions);
        switch (operate) {
            case 'publish':
                this.batchPublish(true, id);
                break;
            case "addToFavorite":
                this.addToFavorite({operate, key, id, resId, value});
                break;
            case 'setNotPass':
                this.setNotPass({key, id, resId});
                break;
            case "viewEditHistory":
                this.viewEditHistory({id});
                break;
        }
    };

    // isPublish 发布/编辑
    batchPublish(isPublish) {
        const {listSelectData} = this.state;
        if(!listSelectData.ids.length) {
            this.messageAlert({ title: isPublish ? "上线单张" : "编辑关键词", "body": "请选择单张", "type": "info"});
            return false;
        }else if(isPublish){
            // console.log(listSelectData)
            for(const item of listSelectData.list){
                if(!item.ossYuantu){
                    message.error('没有原图的图片不可以上线！')
                    return;
                }
            }
        }

        Object.assign(this.state.alert, {
            params: {isPublish}
        });

        this.synchronizeTagData(()=>{
            const {params} = this.state.alert;
            //console.log('batchPublish---synchronizeTagData',params);
            // if(params.submitMsg||params.unconfirmedTags.length>0) this.operatingFloor(params);
            this.operatingFloor(params);
            params.isPublish && this.submitPublish(false,()=>{
                //if(params.confirmedTags.length>=5&&params.submitMsg==""&&params.unconfirmedTags.length==0) {
                //    this.closeAlert();
                //    this.messageAlert({"title": "上线", "body": "操作成功!", "type": "success"});
                //}
                message.success('操作成功!');

                const {listSelectData,selectStatus} = this.state;
                listSelectData.list.map(item=>{
                    if(item.isAuto) {
                        selectStatus[item.key] = false;
                        this.setSelectStatus('selectAppointed',selectStatus);
                    }
                });
            });
        });
    };

    /**
     * 更新关键词 编辑关键词界面走这个流程
     *
     * @param  {Boolean} isPublish  是否是上线
     * @param  {array} options 新增项
     * @param  {object} tag 删除项
     *
     */
    updateTags({ keywordsArr, keywordsAuditArr, newDic }, tag) {
        //console.log(tag);
        //console.log('----updateTags',this.state.listSelectData.list,{ keywordsArr, keywordsAuditArr, newDic }, tag);
        this.state.listSelectData.list.map((item, i)=> {
            //console.log('----updateTags--1',item.keywordsArr,keywordsArr);
            //console.log('----updateTags--2',item.keywordsAuditArr,keywordsAuditArr);
            //if (keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
            //if (keywordsAuditArr) item.keywordsAuditArr = _.uniq(item.keywordsAuditArr.concat(keywordsAuditArr), 'source');
            //console.log(tag);
            //根据用户输入的多个关键词 批量删除关键词
            if(_.isArray(tag)){

                // 从新词和多义词中删除 label存在就删除
                // _.remove(item.keywordsAuditArr, (v)=> {
                //     const flag = (tag.indexOf(v.label) != -1);
                //     if (flag && keywordsAuditArr) item.keywordsAuditArr = _.uniq(item.keywordsAuditArr.concat(keywordsAuditArr), 'source');
                //     if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                //     return flag;
                // });
                item.keywordsAuditArr.forEach((v)=> {
                    const flag = (tag.indexOf(v.label) != -1);
                    if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                    if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                    if(flag){
                        v.type = 1;
                        v.source = updateTag(v.source, tag.curId)
                    }
                });

                const {keywordsDic} = this.state;

                // 从字典中取到用户输入的已确定关键词对象
                // tag: 用户输入的关键词中文数组
                let inputKeywordsDic = Object.values(keywordsDic).filter((item,i) => {
                    const flag = (tag.indexOf(item.cnname) > -1);
                    if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                    if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                    return flag;
                });

                // 取到用户输入的关键词ID数组
                let inputKeywordsDicIdArray = inputKeywordsDic.map(v => v.id.toString());

                // 从已匹配词的id中删除
                _.remove(item.keywordsArr, (v)=> {
                    const flag = (inputKeywordsDicIdArray.indexOf(v) > -1);
                    if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                    if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                    return flag;
                });

            }else if(_.isObject(tag)){

                // 删除新词和多义词的情况
                if (tag && tag.type != undefined && item.keywordsAuditArr.length) {
                    // _.remove(item.keywordsAuditArr, (v)=> {
                    //     const flag = (v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type)));
                    //     if (flag && keywordsAuditArr) item.keywordsAuditArr = _.uniq(item.keywordsAuditArr.concat(keywordsAuditArr), 'source');
                    //     if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                    //     return  flag;
                    // });

                    item.keywordsAuditArr.forEach((v)=> {
                        const flag = v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type + '|' + v.source.split('|')[3]));
                        if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                        if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                        if(flag){
                            v.type = 1;
                            v.source = updateTag(v.source, tag.curId)
                        }
                    });

                }

                // 删除已匹配词
                if (tag && tag.type == undefined && item.keywordsArr.length) {
                    _.remove(item.keywordsArr, (v)=> {
                        const flag = (v == tag.id);
                        if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                        if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                        return flag;
                    });
                }

            }else{
                if (keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                if (keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
            }

            // if (item.keywordsArr) {
            //     this.state.cacheParams[item.id] = {keywordsArr: item.keywordsArr};
            // }
            // if (item.keywordsAuditArr) {
            //     this.state.cacheParams[item.id] = {keywordsAuditArr: item.keywordsAuditArr};
            // }
        });

        //this.setState({listSelectData});

        //console.log('newDic---newDic',newDic,this.state.listSelectData.list);

        this.updateKeywordDic(newDic);

        //this.setDataCache();
        function updateTag(source, id){
            const arr = source.split('|');
            if(id) arr[1] = id+'';
            arr[2]=1;
            return arr.join('|')
        }
    };

    synchronizeTagDataAfter(callback) {
        const {params} = this.state.alert;
        //console.log('synchronizeTagDataAfter-------',params);
        this.operatingFloor(params);
        // delete this.state.alert.params.isPublish;
        if(_.isFunction(callback)) callback();
    }

    // listSelectData 同步/收集/验证/删除 keywordsAuditArr/keywordsArr
    synchronizeTagData(callback) {
        const {listSelectData,alert} = this.state;
        const isPublish = alert.params && alert.params.isPublish;
        if(isPublish==undefined)  return false;
        let keywordsArr = [], auditArr = [[], null, []],
            captionIsNull = [],  keywordsIsFive=[], ossYuantuIsNull=[], submitMsg = '',
            unconfirmedTags = [];
        listSelectData.list.map((item, i)=> {
            //console.log('item.ossYuantu', item.ossYuantu);
            if(item.keywordsArr) keywordsArr = _.union(keywordsArr, item.keywordsArr);
            if(alert.params && alert.params.deleteAuditWordsWhenPublish) item.keywordsAuditArr = [];
            item.isAuto = false;
            if(_.isEmpty(item.title)) {
                captionIsNull.push(item.resId);
            }else if(item.keywordsArr.length<5) {
                keywordsIsFive.push(item.resId);
            }else if(!item.ossYuantu){
                ossYuantuIsNull.push(item.resId);
            }else{
                item.isAuto = true;
            }
            item.keywordsAuditArr && item.keywordsAuditArr.map((tag)=> {
                if(auditArr[tag.type]) {
                    auditArr[tag.type].push({...tag});
                    item.isAuto = false;
                }
            });
        });

        if(captionIsNull.length>0) submitMsg += '单张ID：' + captionIsNull.join(' / ') + '；标题不能为空！';
        if(keywordsIsFive.length>0) submitMsg += '单张ID：' + keywordsIsFive.join(' / ') + '；关键词不能少于五个！';
        if(ossYuantuIsNull.length>0) submitMsg += '单张ID：' + ossYuantuIsNull.join(' / ') + '；原图不存在！';

        const {newWords, polysemicWords, confirmedTags} = this.validateKeywords(
            _.uniq(keywordsArr),
            _.uniq(auditArr[0], 'source'),
            _.uniq(auditArr[2], 'source')
        );

        if(alert.params && !alert.params.deleteAuditWordsWhenPublish)　unconfirmedTags = [...newWords, ...polysemicWords];

        //console.log('keywordsArr',keywordsArr);
        //console.log('listSelectData',listSelectData.list[0].keywordsArr);
        //console.log('returnData', {unconfirmedTags, confirmedTags, submitMsg});

        Object.assign(this.state.alert,{
            params: {
                isPublish,
                unconfirmedTags,
                confirmedTags,
                submitMsg
            }
        });

        //console.log('this.state.alert',this.state.alert);

        if(_.isFunction(callback)) callback();

    };

    //  新词/多义词/确认词
    validateKeywords(keywords, newWords, polysemicWords) {
        const keywordsDic = this.state.keywordsDic || {};
        let confirmedTags = [];
        // console.log(keywordsDic)
        keywords && keywords.map((keywordId)=> {
            let keyword = keywordsDic[keywordId];
            if (!keyword) return false;
            let kind = keyword.kind;
            let label = keyword.cnname;
            confirmedTags.push({
                key: label + "  (" + keywordId + ")",
                label: <span className="ant-select-selection__choice__content" data-id={keywordId}>{label}</span>,
                id: keywordId,
                title: label,
                kind: kind
            });
        });
        newWords && newWords.map((item)=> {
            item.key = item.label + ' (' + item.id + ')';
            item.title = item.label;
            item.label = <span className="hand ant-select-selection__choice__content label label-danger"
                               data-type={item.type} data-id={item.id}>{item.label}</span>;
        });
        polysemicWords && polysemicWords.map((item)=> {
            item.key = item.label + ' (' + item.id + ')';
            item.title = item.label;
            item.label = <span className="hand ant-select-selection__choice__content label label-success"
                               data-type={item.type} data-id={item.id}>{item.label}</span>;
        });
        return { newWords, polysemicWords, confirmedTags };
    };

    operatingFloor({isPublish,unconfirmedTags,confirmedTags,submitMsg}) {
        this.openAlert({
            "width": 800,
            "title": isPublish ? "上线单张" : "编辑关键词",
            "contentShow": "validateKeywords",
            "params": {
                isPublish,
                unconfirmedTags,
                confirmedTags,
                submitMsg,
                "deleteAuditWordsWhenPublish": false,
                "tagAreaConfigs": {
                    dispatch: this.props.dispatch,
                    type: "creative",
                    keywordsDic: this.state.keywordsDic,
                    size: "large",
                    className: "mb-10",
                    tagContainerStyle: {height: 'auto', maxHeight: '300px'},
                    updateTags: this.updateTags.bind(this),
                    // noWrap: true,
                    alertHandle:this.alertHandle.bind(this)
                },
                "handleOnPublish": this.handleOnPublish.bind(this)
            },
            "isFooter": false,
            "maskClosable": false,
            "dragable" : true
        });
    }

    /**
     * 弹框提交
     *
     * @param  {Boolean} deleteAuditWordsWhenPublish 删除不确定的词 unconfirmedTags
     */
    handleOnPublish() {
        this.synchronizeTagData(()=>{
            this.synchronizeTagDataAfter(()=>{
                const {params} = this.state.alert;
                //console.log('handleOnPublish---synchronizeTagData',params);
                params.isPublish && this.submitPublish(false,()=>{
                    message.success('操作成功!');
                    this.closeAlert();
                    const {listSelectData,selectStatus} = this.state;
                    listSelectData.list.map(item=>{
                        if(item.isAuto) {
                            selectStatus[item.key] = false;
                            this.setSelectStatus('selectAppointed',selectStatus);
                        }
                    });
                });
            });
        });
    };

    // needValidate 是否需要进行关键词验证; 不通过的提交不需要验证。
    submitPublish(isPass,callback) {
        const {alert,listData,listSelectData,selectStatus} = this.state;
        let params = [];
        if(isPass){ //不通过
            listSelectData.list.forEach(item => {
                // if(item.caption) item.caption = encodeURIComponent(item.caption);
                // if(item.item) item.caption = encodeURIComponent(item.item);

                item.keywords = item.keywordsArr.join(',');
                item.keywordsAudit = joinKeywordsAuditArr(item.keywordsAuditArr);
                item.imageState = 5;
                if(this.state.cacheParams[item.id]) delete this.state.cacheParams[item.id];
            });
            params = listSelectData.list;
        }else{ //通过
            let isAutoNum = 0;
            listSelectData.list.forEach(item => {
                if(item.isAuto&&alert.params&&alert.params.isPublish) item.keywordsRejectReason = "";
                if(item.isAuto) {
                    // if(item.caption) item.caption = encodeURIComponent(item.caption);
                    // if(item.item) item.caption = encodeURIComponent(item.item);

                    item.passState = 1;
                    item.onlineState = 1;
                    item.imageState = 2;
                    item.keywords = item.keywordsArr.join(',');
                    item.keywordsAudit = joinKeywordsAuditArr(item.keywordsAuditArr);
                    params.push(item);
                    isAutoNum++;
                }
            });
            if(isAutoNum==listSelectData.list.length) this.closeAlert();
        }
        this.setState({listData});
        if(params.length==0) return false;
        const {dispatch} = this.props;
        dispatch(keywordPublish(params)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false;
            }
            //if(this.state.alert.visible) {
            //    this.closeAlert();
            //    this.messageAlert({"title": isPass?"不通过":"上线", "body": "操作成功!", "type": "success"});
            //}
            //setTimeout(this.refresh.bind(this), 500);
            if(_.isFunction(callback)) callback();
        });

        function joinKeywordsAuditArr(arr){
            // "电缆|39144|1|0,计算机实验室|36320|1|0,电缆|39144|1|0,数据|39121|1|0,通信|9129|1|0,线|36848|1|0,网络科技||0|0,
            return (arr && arr.length) ? arr.map(item => item.source).join(',') : ''
        }
    };

    setNotPass({key, id, resId}) {
        const {listSelectData, alert} = this.state;

        if (!id && listSelectData.ids.length === 0) {
            this.messageAlert({"title": "操作提示", "body": "请选择单张", "type": "info"});
            return false;
        }

        for(var item of listSelectData.list){
            // 已上线不允许设置不通过
            if(item.onlineState == 1){
                this.messageAlert({"title": "操作提示", "body": "已上线的图片不允许设置不通过", "type": "info"});
                return false;
            }
        }

        // const {content} = alert.params || {};
        const content = storage.get('tagRejectReason') || '';

        this.openAlert({
            "title": resId ? "请设置不通过原因" : "批量设置不通过原因",
            "contentShow": "textarea",
            "params": {
                key,
                "placeholder": "请输入不通过原因",
                content
            },
            "onOk": this.submitSetNotPass.bind(this),
            "isFooter": true
        });
    };

    submitSetNotPass() {
        let {listData, alert, listSelectData} = this.state;
        const keywordsRejectReason = alert.params.content;
        if (!keywordsRejectReason) {
            alert.isLoading = false;
            alert.params.submitMsg = "请输入不通过原因";
            this.setState({alert});
            return;
        }

        storage.set('tagRejectReason', keywordsRejectReason);
        //console.log(listSelectData);
        //console.log(listData);

        //imageState 5不通过
        if(alert.params.key){
            listData.list[alert.params.key].keywordsRejectReason = keywordsRejectReason;
        }else{
            listSelectData.list.map((item, i) => {
                // 通过不通过根据这个字段是否为空判断
                //listSelectData.list[i].rest = alert.params.content;
                listSelectData.list[i].keywordsRejectReason = alert.params.content;
                listSelectData.list[i].keywords = listSelectData.list[i].keywordsArr.join(',');
            });
        }

        // 第二个参数true表示是否需要验证关键词数和标题
        this.submitPublish(true,()=>{
            this.closeAlert();
            this.messageAlert({"title": "不通过", "body": "操作成功!", "type": "success"});
        });

        this.setState({listData, doing: 'selectCancel'})
    };

    // 时间排序
    orderByDate(val) {
        // const {filterParams} = this.state;
        this.state.filterParams.desc = val;
        this.refresh("pagination", {"pageNum": 1});
    };

    batchAddKeywords(keywordsArr, picItem) {
        //console.log(keywordsArr, picItem);

        const {dispatch} = this.props;
        let newKeywords = [], newAudit = [];

        //输入多个词且以逗号分隔时，传参为name:['a', 'b', 'c']  返回格式{a: [{xxx}], b:[{xx}, {oo}], c:[]}
        dispatch(findKeyword({name: keywordsArr, type: 'creative'})).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false;
            }
            const res = result.apiResponse;

            keywordsArr.map((label)=> {
                let matchedKeywords = res[label];

                if (!matchedKeywords || !matchedKeywords.length) {//新词按照格式加入keywordsAuditArr
                    newAudit.push({
                        label: label,
                        id: '',
                        type: 0,
                        source: label + '||0|0'
                    });
                } else if (matchedKeywords.length > 1) {//多义词按照格式加入keywordsAuditArr
                    let ids = [], idStr = '';
                    matchedKeywords.map((item)=> {
                        ids.push(item.id);
                    });
                    idStr = ids.join('::');
                    newAudit.push({
                        label: label,
                        id: idStr,
                        type: 2,
                        source: label + '|' + idStr + '|2|0'
                    });
                } else {//匹配到一个直接加入keywordsArr中
                    let matchedId = matchedKeywords[0].id;
                    newKeywords.push(matchedId);
                }
            });

            if (newKeywords.length) {
                picItem.keywordsArr = _.union(picItem.keywordsArr, newKeywords);
            }
            if (newAudit.length) {
                picItem.keywordsAuditArr = _.union(picItem.keywordsAuditArr, newAudit);
            }

            this.forceUpdate();
        });
    };

    batchDeleteKeywords(keywordsArr, picItem) {
        picItem.keywordsArr = _.difference(picItem.keywordsArr, keywordsArr);
        _.remove(picItem.keywordsAuditArr, (auditTag)=> {
            return _.indexOf(keywordsArr, auditTag.label) != -1;
        });
        this.setState({listData});
    };

    // 添加到收藏
    addToFavorite({key, id, resId, groupId}) {
        const {filterParams, listSelectData} = this.state;
        const ids = id ? [id] : listSelectData.ids;

        if(!ids.length){
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
        const {dispatch} = this.props;
        dispatch(favoriteQuery({userId: filterParams.userId, "pageNumber": 1, "pageSize": 10000})).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }
            let {alert} = this.state;
            alert.contentShow = "favorite";
            alert.params.favoriteOption = result.apiResponse.list || [];
            this.setState({alert});
        });
    };

    submitAddToFavorite() {
        const {alert} = this.state;
        const {favId, ids, favName, name, status} = alert.params;
        let param = {
            ids,
            "isGroup": 0
        };
        // //console.log(alert.params);
        if (status) {
            if (!favId) {
                alert.params.submitMsg = "请选择已有收藏夹";
                this.setState({alert});
                return false;
            }

            param.favId = favId;
            param.isNew = 0;
        } else {
            if (!favName) {
                alert.params.submitMsg = "请输入新的收藏夹名";
                this.setState({alert});
                return false;
            }

            param.name = favName;
            param.isNew = 1;
        }
        alert.confirmLoading = true;
        this.setState({alert});

        const {dispatch} = this.props;
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

    // //缓存修改结果
    // setDataCache() {
    //     const {cacheParams, filterParams} = this.state;
    //     if (filterParams.userId) {
    //         const {dispatch} = this.props;
    //         dispatch(dataCache({
    //             key: filterParams.userId + '_creativeTagCache',
    //             value: JSON.stringify(cacheParams)
    //         })).then(result => {
    //             if (result.apiError) {
    //                 this.messageAlert(result.apiError.errorMessage);
    //                 return false;
    //             }
    //         });
    //     }
    // };

    // 关键词展示方式方法
    // value的值：
    // 1 单框 2 按照关键词分类多个框
    listDisplay(value){
        const {listData} = this.state;
        listData.listDisplay = value;
        this.setState({listData});
    }
}
