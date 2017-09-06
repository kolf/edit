import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import moment from "moment";
import { getStorage } from "app/api/auth_token";
import { editorUrl } from "app/api/api_config.js";
import ThumbnailBox from "app/components/provider/thumbnail";
import AddToTopic from "app/components/modal/addtoTopic";
import EditModal from "app/components/edit/editModal";
import Step1_1 from "app/components/edit/Step1_1";
import EditStep2_1 from "app/components/edit/Step2_1";
import ListEditBox from "app/components/edit/ListEditTemp";
import TextEditorModal from "app/components/edit/TextEditorModal";
import SelectProvider from "app/components/modal/selectProvider";
import { PushToStep3 } from "app/components/edit/pushto_step3";
import TextReplace from "app/components/edit/textReplaceTemp";
import { Row, Col, Nav, NavItem, Tab } from "react-bootstrap/lib";
import { Affix, Form, Collapse, Button, message } from "antd";
import {
    getEditData,
    publishPushto,
    findKeyword,
    getKeywordById,
    queryReason,
    findDiscTag
} from "app/action_creators/edit_action_creator";
import { setImageQualityLevel } from "app/action_creators/create_action_creator";
import {
    pushView,
    groupAddToOverseas,
    groupCopyOrMerge,
    photosNewOrAdd,
    photosSplitOrAdd
} from "app/action_creators/editor_action_creator";
import { regionQuery, dataCache, cachedData, categoryQuery } from "app/action_creators/common_action_creator";

import storage from "app/utils/localStorage";
import { isElite, getStrLength, queryUrl, getDevice } from "app/utils/utils";

const createForm = Form.create;
const Panel = Collapse.Panel;
const Step2_1 = createForm()(EditStep2_1);
const ListEditTemp = createForm()(ListEditBox);

let sortTag = {};

//keywordsAudit字段分割的正则
const keywordsAuditReg = /[^,\|\s].*?\|[^|]*?\|[0-9\.]+\|\d+/g, keywordsSplitReg = /,|::/;

@connect((state) => ({
    "error": state.edit.error,
    "groupData": state.edit.groupData,
    "listData": state.edit.listData,
    "keywordsData": state.edit.keywordsData,
    "reasonData": state.edit.reasonData
}))

export default class EditorEditContainer extends Component {

    constructor(props) {
        super(props);
        const {type, operate, ids} = props.params;

        this.state = {
            "typeDoc": {
                1: {"typeName": "组照", "type": "group", "edit": "编审", "push": "推送", "copy": "复制并新建组", "merge": "合并并新建组"},
                2: {
                    "typeName": "单张",
                    "type": "photos",
                    "copyAndNew": "复制并新建组",
                    "copyAndAdd": "复制并加入组",
                    "splitAndNew": "拆分并新建组",
                    "splitAndAdd": "拆分并加入组"
                }
            },
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "editor/:type/:operate/:ids", "text": "组照" + (operate == "edit" ? "编审" : "推送") + "：ID-" + ids}
            ],
            "filterParams": {
                "userId": getStorage('userId'), // userId 用户ID
                "token": getStorage('token'),
                "role": 2,            // role 1 销售 2 财务 3 运营
                "step": 1,            // 1 图片审核 2 文字编辑
                type,                 // group 组照 photos 单张
                operate,              // edit 编审 push 推送 editen 海外编审 editpush 海外推送
                ids,                  // groupId photoId
                "resGroup": 2,        // resGroup 1 组照 2 单张
                "pageNum": 1,         // pageNum 当前页数
                "pageSize": 60,      // pageSize 每页条数
                "perStepSize": 1000  // 每步多少条数据
            },
            "groupData": null,       // 组图数据
            "listData": null,        // 图片数据
            'maskLoading': true,     // loading
            "listDisplay": 1,        // 图片展示方式 1 单个框 2 多个框
            "selectStatus": [],      // 选择状态
            "listSelectData": {       // 选择图片数据
                "ids": [],            // id []
                "keys": [],           // key []
                "list": []           // 选择数据 item []
            },
            "keywordsDic": {},       // 关键词字典
            "cacheParams": {         // 修改暂存数据
                "group": {},
                "list": []
            },
            "pushData": [],  // 推送数据
            "alert": {},
            "tooltip": {
                "show": false,
                "target": null,
                "text": "更新中...",
                "placement": "right"
            },
            "doing": "doing",
            "saveTemp": false,
	    "fatchIng": false,
	    "hidePensonTag": false
        };
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {
        const {filterParams}= this.state;
        const operateObj={
            edit: '编审',
            push: '推送',
            editen: '海外编审',
            editpush: '海外推送',
        };
        document.title = operateObj[filterParams.operate] + '组 ID-' + filterParams.ids + ' - 编辑类 - 内容管理系统 - VCG © 视觉中国';
        this.queryList(filterParams, (list) => {
            this.scrollImage(list)
        });
        this.queryReason();
    };

    queryReason(){
        const {dispatch} = this.props;
        dispatch(queryReason('cfp')).then((res) => { //查询不通过原因/下线原因
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return false;
            }
        })
    };

    scrollImage(list){
        const imageId = queryUrl('resId')

        const rowsMap = {
            xs: 2,
            sm: 3,
            md: 4,
            xlg: 6
        };

        const rowSize = rowsMap[getDevice()]

        console.log(imageId && list && list.length)

        if (imageId && list && list.length){
            const { selectStatus} = this.state
            const { key } = list.find((item, i) => item.id == imageId)

            setTimeout(() => {
                console.log(list.length / rowSize)
                window.scrollTo(0, Math.floor(key / rowSize)*418 - 40)
                selectStatus[key] = true
                this.setState({
                    doing: "selectAppointed",
                    selectStatus
                })
            }, 900)
        }
    }

    queryList(params, callback) {
        const { dispatch } = this.props;
        dispatch(getEditData(params)).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                this.setState({ keywordsDic: {}, groupData: {}, listData: [], 'maskLoading': false });
                document.title= result.apiError.errorMessage + ' - 内容管理系统 - VCG © 视觉中国';
                return false;
            }
            let {group,list} = result.apiResponse,keywordsTagArr=[], categoryArr=[], keywordsArr=[];
            if(group.title) document.title= _.trunc(group.title,100) + ' - 内容管理系统 - VCG © 视觉中国';
            group.isElite = group.topicIds ? isElite(group.topicIds.split(',')) : false; // 添加是否是精选
            list.map((item, i) => {
                //if(item.id == group.firstResId) { //置顶首图
                //    list.unshift(item);
                //    list.splice(i+1, 1);
                //}
                item.rotate = 0;
                item.key = i;
                if (!item.qualityRank) {
                    item.qualityRank = 1;
                    item.imageRejectReason = "";
                }else if ((Number(item.qualityRank) != 5) && item.imageRejectReason) {
                    item.imageRejectReason = "";
                }

                item.region = [];
                if (item.country) item.region.push(item.country);
                if (item.province) item.region.push(item.province);
                if (item.city) item.region.push(item.city);

                item.keywordsArr = [];
                if (item.keywords) {
                    item.keywordsArr = item.keywordsArr.concat(item.keywords.split(keywordsSplitReg));
                    keywordsTagArr = keywordsTagArr.concat(item.keywordsArr);
                }
                if (item.category) {
                    item.keywordsArr = item.keywordsArr.concat(item.category.split(keywordsSplitReg));
                    keywordsTagArr = keywordsTagArr.concat(item.keywordsArr);
                }
                item.keywordsArr = _.compact(_.uniq(item.keywordsArr));

                /*
                 *  keywordsAudit为后台自动审计后的关键字，格式为 tag|id|type

                 *  其中type=0表示新词，type=1表示正常，type=2表示多义词，type=3表示不检测

                 *  多义词的多个id以逗号分隔.目前数据库中存在错误数据，大量id之间包含双冒号，这里也需要处理
                 */
                item.keywordsAuditArr = [];
                if (item.keywordsAudit) {
                    const auditMatchResult = item.keywordsAudit.match(keywordsAuditReg) || [];

                    let keywordsAuditArr = [];
                    auditMatchResult.map((auditItem)=> {

                        const auditSplitResult = auditItem.split('|');
                        keywordsTagArr = keywordsTagArr.concat(auditSplitResult[1].split(keywordsSplitReg));

                        if(auditSplitResult[1]){
                            keywordsAuditArr.push({
                                label: auditSplitResult[0],
                                id: auditSplitResult[1],
                                type: auditSplitResult[2],
                                source: auditItem
                            });
                        }

                    });
                    item.keywordsAuditArr = _.uniq(keywordsAuditArr, 'source');
                }

                item.saveTemp = {
                    qualityRank: item.qualityRank,
                    offlineReason: item.offlineReason,
                    offlineMark: item.offlineMark,
                    imageState: item.imageState,
                    onlineState: item.onlineState,
                    imageRejectReason: item.imageRejectReason
                };
            });

            if(group.category) { // keywords -> category -> oneCategory 组包含关系
                categoryArr = group.category.replace(/\,$/, '').split(keywordsSplitReg);
                keywordsTagArr = keywordsTagArr.concat(categoryArr);
            }
            group.categoryArr = categoryArr;
            if(group.keywords) { // keywords -> category -> oneCategory 组包含关系
                keywordsArr = group.keywords.split(keywordsSplitReg);
                keywordsTagArr = keywordsTagArr.concat(keywordsArr);
            }
            group.keywordsArr = keywordsArr;
            group.keywordsAuditArr = [];

            //this.setState({ groupData: group, listData: list, doing: "selectCancel", 'maskLoading': false });
            callback && callback(list)

            this.initKeywordDic({ keywordsTagArr, groupData: group, listData: list });

        });
    };

    //生成字典&初始化生成字段
    initKeywordDic({keywordsTagArr, groupData, listData}) {
        keywordsTagArr = _.compact(_.uniq(keywordsTagArr));
        const {dispatch} = this.props;
        dispatch(getKeywordById({'data': keywordsTagArr.join(',')})).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }
            //const {keywordsData} = this.props;
            //创建字典
            let keywordsDic = {}, keywordsArr = [];
            [...result.apiResponse].forEach(item => {
                keywordsDic[item.id] = item;
                keywordsArr.push(item.id + "");
            });

            //console.error("初始化处理新词：", keywordsAuditArr);
            const keywordsAuditArr = _.difference(keywordsTagArr, keywordsArr);
            if(keywordsAuditArr.length>0) {
                listData.map((item)=>{
                    _.remove(item.keywordsArr,(keyword)=>{
                        return _.indexOf(keywordsAuditArr, keyword)!=-1;
                    });
                });
            }

            //console.log('keywordsDic', keywordsDic);
            this.setState({ keywordsDic, groupData, listData, doing: "selectCancel", 'maskLoading': false});

            //this.forceUpdate();

        });
    };

    componentDidMount() {

    };

    componentWillUnmount() {

    };

    openAlert(alert) {
        this.setState({alert, "doing": "openAlert"})
    };

    closeAlert() {
        this.setState({"doing": "closeAlert"});
    };

    // 子组件弹框代理 传参数表示打开 否则为关闭
    alertHandle(alert) {
        if(alert){
            this.openAlert(alert);
        }else{
            if(this.state.alert.params && _.isBoolean(this.state.alert.params.isPublish)) {
                return
            }
            this.closeAlert();
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
                "title": title ? title : "编审系统问候：",
                "content": body ? body : ""
            };
            let doing = "";
            if (type == "info") doing = "alertInfo";
            if (type == "success") doing = "alertSuccess";
            if (type == "error") doing = "alertError";
            if (type == "warning") doing = "alertWarning";
            this.setState({alert, doing});
        }
    };

    getReasonData() {
        const {reasonData} = this.props;
        let reasonList = [];
        [...reasonData].map(item=>{
            reasonList.push({...item});
        });
        return reasonList;
    };

    //
    setStep(step) {
        let {filterParams, groupData, listData, listSelectData} = this.state;
        if (!groupData||!groupData.id) {
            message.info("此组照不存在");
            return false;
        }
        if(!listData) {
            message.info("此组照暂无单张");
            return false;
        }

        const operate = filterParams.operate;
        const ids = listSelectData.ids;

        let hasPass = false, hasNoPush= false;
        listData.forEach(item => {
            item.hide = !item.ossYuantu;
            if (ids.indexOf(item.id) != -1 && item.qualityRank == 5 && item.offlineMark != 1 && !item.ossYuantu) {
                hasPass = true;
            }
            if (ids.indexOf(item.id) != -1 && item.noPush === 1 && item.offlineMark!=1 && item.ossYuantu) {
                hasNoPush = true;
            }
        });

        // if (step == 2 && listSelectData.ids.length == 0) {
        //     this.setState({"doing": "selectAll"});
        // }
        //
        // 点击下一步 获取可以通过的图片为选中
        if (step == 2) {
            groupData.timeliness = groupData.timeliness || 0;

            listData.forEach(item => {
                // //console.log(item) 8/1
                // item.region = [item.country, item.province, item.city].filter(item => item)
            });

            if (operate === 'push') {
                if (!ids.length) {
                    message.info("请选择要推送的图片!");
                    return false;
                }

                if (hasPass) {
                    message.info("不通过的图片不能推送，请取消选择!");
                    this.state.doing ="selectAppointed";
                    return false
                }

                if (hasNoPush) {
                    message.info("该供应商下图片不能推送，请取消选择!");
                    this.state.doing ="selectAppointed";
                    return false
                }

                listData.forEach(item => {
                    if (ids.indexOf(item.id) == -1) { // 没选的，隐藏
                        item.hide = true;
                    }
                })
            } else if (operate === 'edit') {
                if (listData.every(item => {
                        return (item.qualityRank==5 && item.imageRejectReason) || item.onlineState == 3
                    })) { //如果所有图片都已设置不通过原因，直接发布
                    this.submit({publishType: 7});
                    return false;
                }

                if (!listData.filter(item => item.qualityRank != 5).length) {
                    const reasonList = this.getReasonData();
                    this.openAlert({
                        "show": true,
                        "isLoading": false,
                        "params": { reasonList },
                        "maskClosable": false,
                        "dragable": true,
                        "bsSize": "small",
                        "title": "设置不通过原因",
                        "contentShow": "imageRejectReason",
                        "onOk": this.submitSetRejectReason.bind(this, {"key": 10, "value": "其他原因"})
                    });
                    return false;
                }

                this.setState({maskLoading: false});
            }
        }

        window.scroll(0, 0);

        filterParams.step = step;
        this.setState({filterParams, doing: 'selectCancel'});

        this.state.refreshTimer = setTimeout(() => {
            clearTimeout(this.state.refreshTimer);
            this.state.refreshTimer = null;
            this.closeAlert();
        }, 1000);
    };

    submitSetRejectReason() {
        const {alert, listData, saveTemp} = this.state;

        if (!alert.params || !alert.params.value) {
            alert.params.submitMsg = "请设置选择项";
            this.openAlert(alert);
            return false;
        }

        this.closeAlert();

        listData.forEach(item => {
            // item.imageState = 3;
            item.imageRejectReason = alert.params.value;
            if (item.onlineState == 1) {
                item.onlineState = 3;
            }
        });

        this.state.saveTemp = true;

        this.submit({publishType: 7});
        // this.closeAlert();
    };
    //批量设置
    setSelectedList({key, direction, value, position}) {
        const {listSelectData, listData, alert, groupData} = this.state;
        const {dispatch} = this.props;

        [...listSelectData.list].map((item, i) => {
            if (position === "sync") {
                if (key == "qualityRank") {
                    // //console.log(item);
                    // // 清空下线原因
                    // item.offlineReason = '';
                    // item.offlineMark = 0;
                    //
                    // //清空不通过原因
                    // item.imageRejectReason = '';
                    //
                    // //console.log(item.imageRejectReason);

                    // 设置等级为E
                    if (value == 5) {
                        // item.imageState = 3;
                        if (item.onlineState == 1) {
                            item.onlineState = 3;
                        }

                    } else {
                        // 图片状态修改为非E级
                        // if (item.imageState == 3) {
                        //     item.imageState = 2;
                        // }

                        // if (groupData.onlineState == 1) {
                        //     item.onlineState = 1;
                        // }

                    }

                }

                if (key == "rotate") value = this.setSwing(item[key], direction);
                if (key == "imageRejectReason") {
                    // 清空下线原因
                    // item.offlineReason = '';
                    // item.offlineMark = 0;

                    // 等级置为5
                    item.qualityRank = 5;
                    // item.imageState = 3;
                    if (item.onlineState == 1) {
                        item.onlineState = 3;
                    }
                }
                item[key] = value;
            }

        });

        this.setState({listData});
    };

    step2setList(data, position, update = true) {  //文字编辑多个设置
        const {listSelectData, listData} = this.state;

        //console.log(data, position);

        const list = (listSelectData.list && listSelectData.list.length) ? listSelectData.list : listData;

        list.forEach(item => {
            if (item.hide || item.qualityRank == 5 || item.offlineMark == 2) return;

            for (let name in data) {
                this.step2setItem(item, {[name]: data[name]}, position)
            }
        });

        update && this.setState({listData});
    }

    step2setItem(item, data, position) {  //文字编辑单个设置
        for (let name in data) {
            let value = data[name];
            let initValue = item[name];
            // //console.log(value, _.isString(initValue));

            if (_.isString(value)) {
                initValue = initValue || ''
            } else if (_.isArray(value)) {
                initValue = initValue || []
            }

            if (position === "before" && value && value.length) {
                if (_.isString(value)) {
                    item[name] = value + initValue;
                } else if (_.isArray(value)) {
                    initValue = _.isString(initValue) ? initValue.split(',') : initValue;
                    item[name] = _.uniq(value.concat(initValue), name).join(',');
                }
            } else if (position === "after" && value && value.length) {
                if (_.isString(value)) {
                    item[name] = initValue + value;
                } else if (_.isArray(value)) {
                    initValue = _.isString(initValue) ? initValue.split(',') : initValue;
                    item[name] = _.uniq(initValue.concat(value), name).join(',');
                }
            } else if (position === "sync") {
                item[name] = value;
            }
        }
    };

    clearListPeopleTag() {
        const {keywordsDic, listSelectData, listData}= this.state;
        const peopleTags = [];

        Object.values(keywordsDic).forEach(item => {
            if (item.kind == 3) {
                peopleTags.push(item.id + '');
            }
        });

        const list = (listSelectData.list && listSelectData.list.length) ? listSelectData.list : listData;

        list.forEach(item => {
            if (item.hide || item.qualityRank == 5 || item.offlineMark == 2) return;
            this.step2setItem(item, {
                keywordsArr: _.difference(item.keywordsArr, peopleTags),
                keywordsAuditArr: item.keywordsAuditArr.filter(item => item.kind != 3)
            }, 'sync');
        });

        this.setState({listData});
    };

    // 批量设置关键词
    setKeywords(keywordsText, i) {
        //以中英文逗号分割关键词字符串
        const tagSplitReg = /,|，|\n/;

        //去掉空格和false 去掉每个关键词前后空格
        const labelArr = _.compact(_.map(keywordsText.split(tagSplitReg), _.trim));

        // 覆盖前清空关键词逻辑
        if (i == 0) { // 0覆盖1追加2替换
            this.step2setList({
                keywordsArr: [],
                keywordsAuditArr: []
            }, 'sync', false)
        }

        this.autoMatchKeywords(labelArr);
    };

    // 更新关键词字典
    updateKeywordDic(data) {
        if (Object.prototype.toString.call(data) == '[object Array]') {
            data.map((item)=> {
                this.state.keywordsDic[item.id] = item;
            })
        } else {
            this.state.keywordsDic[data.id] = data;
        }
        this.forceUpdate();
    };

    updateData({doing, alert, groupData, listData, selectStatus, listSelectData, keywordsDic, update}) {

        //console.log('edit---updateData',doing,selectStatus);

        if (doing) this.state.doing = doing;
        if (groupData) this.state.groupData = groupData;
        if (listData) this.state.listData = listData;
        if (listSelectData) this.state.listSelectData = listSelectData;
        if (selectStatus) this.state.selectStatus = selectStatus;
        if (keywordsDic) this.state.keywordsDic = keywordsDic;
        if (alert) this.state.alert = alert;

        if (update) this.forceUpdate();
    };

  render() {
      const {selectStatus, alert, doing, groupData, filterParams, listData, listSelectData, keywordsDic, fatchIng, maskLoading, listDisplay, hidePensonTag} = this.state;
        const operate = filterParams.operate;

        const step1_1Config = {
            selectStatus,
            doing,
            groupData,
            filterParams,
            listData,
            listSelectData,
            maskLoading,
            keywordsDic,
            onThumbnail: this.handleOnThumbnail.bind(this),
            updateData: this.updateData.bind(this),
            setSelectedList: this.setSelectedList.bind(this),
            refresh: this.refresh.bind(this),
            alertHandle: this.alertHandle.bind(this),
            step2setItem: this.step2setItem.bind(this)
        };
        const step2_1Config = {
            groupData,
            keywordsDic,
            dispatch: this.props.dispatch,
            addListTags: this.addListTags.bind(this),
            updateData: this.updateData.bind(this),
            updateKeywordDic: this.updateKeywordDic.bind(this),
            updateTags: this.updateTags.bind(this),
            alertHandle: this.alertHandle.bind(this),
            step2setList: this.step2setList.bind(this),
        };
        const step2_3Config = {
            doing,
            operate,
            lists: listData && listData.length && listData.filter(item => item.qualityRank < 5 && !item.offlineReason),
            keywordsDic,
            listDisplay,
            types: "editStepTwo",
            maskLoading: false,
            dispatch: this.props.dispatch,
            updateKeywordDic: this.updateKeywordDic.bind(this),
            onThumbnail: this.handleOnThumbnail.bind(this),
            updateData: this.updateData.bind(this),
            alertHandle: this.alertHandle.bind(this)
        };
        const tagAreaConfigs = {
            dispatch: this.props.dispatch,
            type: 'edit',
            keywordsDic: keywordsDic,
            size: "large",
            className: "mb-10",
            tagContainerStyle: {height: 'auto', maxHeight: '300px'},
            updateTags: this.updateTags.bind(this),
            //handleOnPublish: this.handleOnPublish.bind(this),
            updateData: this.updateData.bind(this),
            alert,
            doing
        };

        return (
            <div className="main-content-inner">
                <div className="page-content">

                    <EditModal {...tagAreaConfigs} />

                    <Tab.Container
                        id="j-tabs-step"
                        activeKey={filterParams.step}
                        onSelect={(activeKey)=>{
                            this.setStep(activeKey);
                        }}>
                        <Row>
                            <Affix className="affix_tab">
                                <Col sm={12} style={{"backgroundColor":"#fff","paddingTop":"10px"}}>
                                    <Col sm={4} style={{padding:0}}>
                                        <Nav bsStyle="tabs">
                                            <NavItem eventKey={1} title="第一步：图片审核" disabled={filterParams.step==1}>
                                                第一步：图片审核
                                            </NavItem>
                                            <NavItem eventKey={2} title="第二步：文字编辑" disabled={filterParams.step==2}>
                                                第二步：文字编辑
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                    <Col sm={8} className="text-right">
                                        {((operate, step) => {
                                            if (step == 1) {
                                                if (operate === 'edit' || operate === 'editen') {
                                                    return <span>
                                                                <Button className={"ml-5"}
                                                                        onClick={this.operateGroup.bind(this,{ operate: "copyAndNew" }) }>
                                                                    复制并新建组
                                                                </Button>
                                                                <Button className={"ml-5"}
                                                                        onClick={this.operateGroup.bind(this,{ operate: "copyAndAdd" }) }>
                                                                    复制并加入组
                                                                </Button>
                                                                <Button className={"ml-20"}
                                                                        onClick={this.operateGroup.bind(this,{ operate: "splitAndNew" }) }>
                                                                    拆分并新建组
                                                                </Button>
                                                                <Button className={"ml-5"}
                                                                        onClick={this.operateGroup.bind(this,{ operate: "splitAndAdd" }) }>
                                                                    拆分并加入组
                                                                </Button>
                                                                <Button className={"ml-20"} type={"primary"}
                                                                        onClick={this.setStep.bind(this,2)}>下一步 <i
                                                                    className="ace-icon fa fa-arrow-right icon-on-right"></i></Button>
                                                            </span>
                                                } else if (operate === 'push') {
                                                    return <Button className={"ml-20"} type={"primary"}
                                                                   onClick={this.setStep.bind(this,2)}>下一步 <i
                                                        className={"ace-icon fa fa-arrow-right icon-on-right"}></i>
                                                    </Button>
                                                }
                                            } else if (step == 2) {
                                                if (operate === 'push') {
                                                    return <span>
                                                            <button className="btn btn-sm ml-5"
                                                                    onClick={this.setStep.bind(this,1) }><i
                                                                className="ace-icon fa fa-arrow-left"></i> 上一步</button>
                                                            <button loading={fatchIng} className="btn btn-sm btn-danger ml-5"
                                                                    onClick={this.showPushBox.bind(this)}>推送 <i
                                                                className="ace-icon fa fa-arrow-right icon-on-right"></i></button>
                                                        </span>
                                                } else if (operate === 'edit') {
                                                    return <span>
                                                             <Button className={"ml-5"}
                                                                     onClick={this.setStep.bind(this,1) }><i
                                                                 className="ace-icon fa fa-arrow-left"></i>上一步</Button>
                                                             <Button loading={fatchIng} disabled={groupData.isElite} className={"ml-5"}
                                                                     onClick={this.release.bind(this,{"publishType":4}) }>二审 <i
                                                                 className="ace-icon fa fa-arrow-right icon-on-right"></i></Button>
                                                             <Button loading={fatchIng} disabled={groupData.isElite} className={"ml-5"}
                                                                     onClick={this.addToTopic.bind(this,{"id":groupData.id,groupId:groupData.groupId}) }>发布并加入专题 <i
                                                                 className="ace-icon fa fa-arrow-right icon-on-right"></i></Button>
                                                             <Button loading={fatchIng} disabled={groupData.isElite} type={"primary"} className={"ml-5"}
                                                                     onClick={()=>{
                                                                    this.state.saveTemp = false;
                                                                    this.release({"publishType":5})
                                                                }}>发布 <i
                                                                 className="ace-icon fa fa-arrow-right icon-on-right"></i></Button>
                                                        </span>
                                                }
                                            }
                                        })(filterParams.operate, filterParams.step)}

                                    </Col>
                                </Col>
                            </Affix>
                            <Col sm={12}>
                                <Tab.Content animation>
                                    <Tab.Pane eventKey={1}>
                                        {filterParams.step == 1 && <Step1_1 {...step1_1Config} />}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey={2}>
                                        {filterParams.step == 2 && <div>
                                            <Affix offsetTop={45} className="affix_edit">
                                                <div style={{paddingBottom: 10}}>
                                                    <span className="operate mr-10">
                                                        <a onClick={this.setSelectStatus.bind(this,'all') }>全选</a>
                                                        <samp>|</samp>
                                                        <a onClick={this.setSelectStatus.bind(this,'invert') }>反选</a>
                                                        <samp>|</samp>
                                                        <a onClick={this.setSelectStatus.bind(this,'cancel') }>取消</a>
                                                    </span>

                                                    <Button icon="bars" type={listDisplay==2 ? "primary":""}
                                                            onClick={()=>{ this.setState({listDisplay: 2})} }>
                                                    </Button>
                                                    <Button icon="minus" className="ml-5"
                                                            type={listDisplay==1 ? "primary":""}
                                                            onClick={()=>{ this.setState({listDisplay: 1})} }>
                                                    </Button>

                                                    <Button className={"ml-20"}
                                                        onClick={this.setListPeopleTag.bind(this)}>抓取人物关键词</Button>
                                                    <Button style={{ marginLeft: 5 }}
                                                        onClick={this.showListEditBox.bind(this)}>图片批量文字编辑</Button>
                                                    <Button style={{ marginLeft: 5 }}
                                                        onClick={this.showReplaceBox.bind(this)}>图片批量查找替换</Button>
                          <Button className={"ml-20"} type={hidePensonTag ? 'primary' : ''}
                                  onClick={this.showHideListEdit.bind(this)}>{hidePensonTag ? '显示人名关键词' : '隐藏人名关键词'}</Button>
                                                    {operate !== 'push' && <Button style={{ marginLeft: 5 }} onClick={() => {
                                                        this.state.saveTemp = true;
                                                        this.save({"publishType":8})
                                                    }
                                                }>保存</Button>}
                                                {operate == 'push' && <Button className="ml-5" onClick={this.pushPreview.bind(this) }>预览</Button>}
                                                </div>
                                            </Affix>
                                            <Collapse defaultActiveKey={['1']}>
                                                <Panel header={"组照编辑（ID："+groupData.groupId+"）"} key="1">
                                                    <Step2_1 {...step2_1Config} />
                                                </Panel>
                                            </Collapse>
                                            <div className="row">
                                                <div className="space-8"></div>
                                            </div>
                                            <ThumbnailBox {...step2_3Config} />
                                        </div>}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </div>
        );
    };

    setSelectStatus(type) {
        if (type == "all") this.setState({"doing": "selectAll"});
        if (type == "cancel") this.setState({"doing": "selectCancel"});
        if (type == "invert") this.setState({"doing": "selectInvert"});
        if (type == "appointed") this.setState({"doing": "selectAppointed"});
    };

    refresh() {
        // this.setState({"doing": "selectCancel"});
        // this.setState({"doing": "closeAlert"});
        this.queryList(this.state.filterParams);
    };

    handleOnThumbnail({operate, key, id, resId, groupId, value, selectedOptions}) { // 第二步 修改数据
        switch (operate) {
            case "qualityRank": // 设置图片等级和不通过原因
                const {listData} = this.state;
                listData.forEach(item => {
                    if(item.id == id){
                        item.qualityRank = value;
                        //
                        // item.offlineReason = '';
                        // item.offlineMark = 0;
                        // item.imageRejectReason = '';

                        if(value == 5){
                            // item.imageState = 3;
                            if (item.onlineState == 1) {
                                item.onlineState = 3;
                            }
                        }else{
                            // if (item.imageState == 3) {
                            //     item.imageState = 2;
                            //
                            //     if (groupData.onlineState == 1) {
                            //         item.onlineState = 1;
                            //     }
                            // }
                        }
                    }
                });

                this.setState({listData});
                break;
            case "editProvider": // 修改供应商
                const {dispatch} = this.props;
                this.openAlert({
                    "width": 600,
                    "title": "选择供应商",
                    "contentShow": "body",
                    "body": <SelectProvider dispatch={dispatch} updateSelectProviderId={this.updateSelectProviderId.bind(this)}/>,
                    "params": {},
                    "onOk": this.editProvider.bind(this, key),
                    "isFooter": true,
                    "maskClosable": false,
                    "dragable": true
                });
                break;
            default:
        }
    };

    updateSelectProviderId(value, text) {
        const {alert} = this.state;
        alert.params.providerId = value;
        alert.params.providerName = text;
        this.setState({alert});
        // this.state.alert.params.providerId = value;
    }

    pushPreview(){
        const {dispatch} = this.props;
        const {groupData, listData, pushData} = this.state;

        let selectIds = [];

        // listData.forEach((item, i) => {
        //     item.sortNumber = i;
        // });

        listData.filter(item => item.qualityRank < 5 && !item.hide && !item.offlineReason).forEach(item => {
            item.keywordsArr = _.uniq(item.keywordsArr.concat(groupData.categoryArr));
            item.keywords = item.keywordsArr.join(',');
            selectIds.push(item.id + '');

            item.keywordsAuditArr = [];
            item.keywordsAudit = '';
        });

        groupData.keywords = groupData.keywordsArr.join(',');
        groupData.category = groupData.categoryArr.join(',');

        const params = {
            group: groupData,
            images: listData,
            selectIds,
            topicId: 1
        };

        dispatch(pushView(params)).then(res => {
            //console.log(res);
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return false
            }

            window.open(res.apiResponse);
        });
    };

    editProvider(key, text) {
        const {alert, listData} = this.state;
        if (!alert.params.providerId) {
            alert.params.submitMsg = "请选择供应商";
            this.setState({alert});
            return false;
        }

        listData[key].providerId = alert.params.providerId;
        listData[key].providerName = alert.params.providerName;
        this.closeAlert();
    }

    // 1.组照：复制、合并并新建组 2单张：新建、加入组
    operateGroup({operate, key, id}) {
        const {dispatch} = this.props;
        const {typeDoc, filterParams, listSelectData} = this.state;
        const type = typeDoc[filterParams.resGroup].type;
        const typeName = typeDoc[filterParams.resGroup].typeName;
        //const operateName = typeDoc[filterParams.resGroup][operate];
        let paramsAlert = {type, operate}, title = '';
        const ids = id ? [id] : listSelectData.ids.map(id => id*1);

        if(!ids.length){
            this.messageAlert({title, "body": "请选择" + typeName, "type": "info"});
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

        if (type == 'photos') {
            paramsAlert.groupId = 0;
        }

        paramsAlert.photoIds = ids.join(',');
        paramsAlert.text = `已选${typeName}新建后，将生成新组照，原组照中依然显示`;

        if (operate == 'splitAndAdd' || operate == 'splitAndNew') {
            paramsAlert.text = `已选${typeName}新建后，将生成新组照，原组照中将不再显示该图`;
        }

        const alertProps = {
            "title": operateObj[operate],
            "params": paramsAlert,
            "contentShow": "loading",
            // "body": 'contentShow',
            "isFooter": true,
            "onOk3": this.submitOperateGroup.bind(this, 'submitAndEdit'),
            "okText3": "确认并编审新组",
            "onOk2": this.submitOperateGroup.bind(this, 'submit'),
            "okText2": "确认"
        };

        if(operate === 'copyAndNew' || operate === 'splitAndNew'){
            this.openAlert(alertProps);

            dispatch(categoryQuery({parentId: 0})).then(res => {
                if(res.apiError){
                    message.error(res.apiError.errorMessage);
                    return;
                }

                let {alert, groupData} = this.state;

                alert.params.categorys = res.apiResponse;
                if(groupData.oneCategory) alert.params.oneCategory = groupData.oneCategory;
                alert.contentShow = "newGroupModal";
                this.setState({alert});
            })
        }else if(operate === 'copyAndAdd' || operate === 'splitAndAdd'){
            this.openAlert(Object.assign(alertProps, {
                contentShow: 'body',
                body: <p className="alert alert-info text-center mt-15"><i className="ace-icon fa fa-hand-o-right bigger-120"></i> {paramsAlert.text}</p>
            }));
        }else if(operate === 'addToOverseas'){
            this.props.dispatch(categoryQuery({parentId: 0}, 'en')).then(res => {
                if(res.apiError){
                    message.error(res.apiError.errorMessage);
                    return;
                }

                alertProps.contentShow = "newGroupModal";

                Object.assign(alertProps.params, {
                    text: '确定添加图片到海外？生效后，显示在海外待编审列表中。',
                    categorys: res.apiResponse
                });

                this.openAlert(alertProps);
            });
        }
    };

    submitOperateGroup(operate) {
        let {alert, filterParams, listSelectData, listData} = this.state;
        const {dispatch} = this.props;

        alert.confirmLoading = true;
        this.setState({alert});

        if (alert.params.operate == "copy" || alert.params.operate == "merge") {
            // alert.confirmLoading = true;
            this.closeAlert({alert});

            dispatch(groupCopyOrMerge(alert.params)).then(result => {
                if (result.apiError) {
                    message.error(result.apiError.errorMessage);
                    return false
                }
                if (operate == "submitAndEdit") {
                    const {id, groupId} = result.apiResponse;
                    window.open("/en/doing/group/edit/" + id + "?groupId=" + groupId);
                }
                this.refresh();
            });
        }

        if (alert.params.operate == "copyAndNew" || alert.params.operate == "copyAndAdd") {
            let errorMsg = '';
            if (alert.params.operate == "copyAndNew" && !alert.params.oneCategory) {
                errorMsg = "请选择主分类";
            }else if(alert.params.operate == "copyAndAdd" && !alert.params.groupId){
                errorMsg = "请输入组照ID";
            }

            if(errorMsg){
                alert.params.submitMsg = errorMsg;
                this.setState({alert});
                return false;
            }
            // alert.confirmLoading = true;
            // this.setState({alert});
            alert.params.srcGroupId = filterParams.ids;
            alert.params.tarGroupId = alert.params.groupId;
            delete alert.params.groupId;
            dispatch(photosNewOrAdd(alert.params)).then(result => {
                if (result.apiError) {
                    this.closeAlert();
                    this.messageAlert(result.apiError.errorMessage);
                    return false
                }
                if (operate == "submitAndEdit") {
                    const {id, groupId} = result.apiResponse;
                    window.open("/en/doing/group/edit/" + id + "?groupId=" + groupId);
                }
                this.closeAlert();
                this.refresh();
            });
        }
        if (alert.params.operate == "splitAndNew" || alert.params.operate == "splitAndAdd") {
            let errorMsg = '';
            if (alert.params.operate == "splitAndNew" && !alert.params.oneCategory) {
                errorMsg = "请选择主分类";
            }else if(alert.params.operate == "splitAndAdd" && !alert.params.groupId){
                errorMsg = "请输入组照ID";
            }

            if(errorMsg){
                alert.params.submitMsg = errorMsg;
                this.setState({alert});
                return false;
            }
            // alert.confirmLoading = true;
            // this.setState({alert});
            alert.params.srcGroupId = filterParams.ids;
            dispatch(photosSplitOrAdd(alert.params)).then(result => {
                if (result.apiError) {
                    message.error(result.apiError.errorMessage);
                    return false
                }
                if (operate == "submitAndEdit") {
                    const {id, groupId} = result.apiResponse;
                    window.open("/en/doing/group/edit/" + id + "?groupId=" + groupId);
                }
                this.setState({listData: listSelectData.list, doing: 'selectCancel'});
                this.closeAlert();
                this.refresh();
            });
        }
        if (alert.params.operate == "addToOverseas") {
            const {oneCategory} = alert.params;
            if(!oneCategory){
                alert.params.submitMsg = "请选择分类！";
                this.setState({alert});
                return false;
            }

            dispatch(groupAddToOverseas({
                oneCategory,
                "groupId": filterParams.ids,
                "selectIds": listSelectData.ids
            })).then(result => {
                if (result.apiError) {
                    message.error(result.apiError.errorMessage);
                    return false;
                }
                if (operate == "submitAndEdit") {
                    const {id, groupId} = result.apiResponse;
                    window.open("/en/doing/group/edit/" + id + "?groupId=" + groupId);
                }

                this.state.refreshTimer = setTimeout(() => {
                    clearTimeout(this.state.refreshTimer);
                    this.state.refreshTimer = null;
                    this.refresh();
                    this.closeAlert();
                }, 1000);
            });
        }
    };

    addListTags() {
        const {groupData, listSelectData, listData} = this.state;
        let lists = listSelectData.list;

        if (!lists || !lists.length) {
            lists = listData.filter(item=> item.qualityRank < 5 && !item.offlineReason);
        }

        lists.forEach(item => {
            groupData.keywordsArr = _.union(groupData.keywordsArr, _.clone(item.keywordsArr, true));
            groupData.keywordsAuditArr = _.union(groupData.keywordsAuditArr, _.clone(item.keywordsAuditArr, true));
        });

        groupData.keywordsArr = _.compact(groupData.keywordsArr);
        groupData.keywordsAuditArr = _.compact(groupData.keywordsAuditArr);

        this.setState({groupData});
    };

    //更新关键词数据，第一个参数为新增项，第二个参数为删除项
    updateTags({keywordsArr, keywordsAuditArr, newDic}, tag, isPublish = true) {
        const {groupData, listSelectData, listData} = this.state;
        let lists = listSelectData.list;
        if (!lists || !lists.length) {
            lists = listData.filter(item=> item.qualityRank < 5 && !item.offlineReason);
        }

        const updateTag = (source, id) => {
            const arr = source.split('|');
            if(id) arr[1] = id+'';
            arr[2]=1;
            return arr.join('|')
        };

        const getTagId = (tagName) => {
            const {keywordsDic} = this.state;
            return Object.values(keywordsDic).find(tag => tag.cnname == tagName).id
        }

        if(tag && tag.length && (keywordsArr.length || keywordsAuditArr.length)){ //替换
            lists.forEach((item, i) => {
                let replace = null;

                item.keywordsAuditArr.forEach((keyword, j) => {  // 删除不确定的词
                    if(keyword.label == tag[0]){
                        replace = {
                            index: j,
                            type: 'keywordsAuditArr',
                            keyword
                        };
                    }
                });

                item.keywordsArr.forEach((keyword, j) => { // 删除确定的词
                    if(keyword == getTagId(tag[0])){
                        replace = {
                            index: j,
                            type: 'keywordsArr',
                            keyword
                        }
                    }
                });

                if(replace){
                    if(keywordsArr.length){ //添加已确定的词
                        if(replace.type == 'keywordsArr'){
                            item.keywordsArr[replace.index] = keywordsArr[0]
                        }else if(replace.type == 'keywordsAuditArr'){
                            item.keywordsArr[item.keywordsArr.length] = keywordsArr[0];
                            let replaceTag = item.keywordsAuditArr[replace.index];
                            replaceTag.type = 1;
                            replaceTag.source = updateTag(replaceTag.source);
                        }
                    }else if(keywordsAuditArr.length){ //添加不确定的词
                        if(replace.type == 'keywordsArr'){
                            item.keywordsAuditArr[item.keywordsAuditArr.length] = keywordsAuditArr[0];
                            item.keywordsArr.splice(replace.index, 1);
                        }else if(replace.type == 'keywordsAuditArr'){
                            let replaceTag = item.keywordsAuditArr[replace.index];
                            replaceTag.type = 1;
                            replaceTag.source = updateTag(replaceTag.source);
                            item.keywordsAuditArr.splice(replace.index, 0, keywordsAuditArr[0]);
                        }
                    }
                }
            });

        }else if(Array.isArray(tag) && tag.length>0){ // 批量删词
            const {keywordsDic} = this.state;
            const removeIds = Object.values(keywordsDic).reduce((result, keyword) => {
                if(tag.indexOf(keyword.cnname)!=-1){
                    result.push(keyword.id+'')
                }
                return result
            }, []);

            lists.forEach((item, i) => {
                item.keywordsAuditArr.forEach((v)=> { //删除不确定的关键词
                    const flag = (tag.indexOf(v.label) != -1);
                    if(flag){
                        v.type = 1;
                        v.source = updateTag(v.source, tag.curId)
                    }
                });

                _.remove(item.keywordsArr, (v)=> removeIds.indexOf(v)!=-1); // 删除确定的词
            });

            groupData.keywordsAuditArr.forEach((v)=> { //删除组照不确定的关键词
                const flag = (tag.indexOf(v.label) != -1);
                if(flag){
                    v.type = 1;
                    v.source = updateTag(v.source, tag.curId)
                }
            });

            _.remove(groupData.keywordsArr, (v)=> removeIds.indexOf(v)!=-1); // 删除组照确定的词
        }else{
            lists.forEach((item, i)=> {
                if (tag && (tag.type == 0 || tag.type == 2) && item.keywordsAuditArr.length) {
                    item.keywordsAuditArr.forEach((v)=> {
                        if(!v) return;
                        const flag = v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type + '|' + v.source.split('|')[3]));
                        if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                        if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));

                        if(flag){
                            v.type = 1;
                            v.source = updateTag(v.source, tag.curId)
                        }
                    });
                }

                if (tag && tag.type == undefined && item.keywordsArr.length) {
                    _.remove(item.keywordsArr, (v)=> {
                        const flag = (v == tag.id);
                        if (flag && keywordsArr) item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                        if (flag && keywordsAuditArr) item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true));
                        return flag;
                    });
                }

                if(keywordsArr && keywordsArr.length==1 && tag && tag.curId == keywordsArr[0]){ //把不确定的词变成确定的词, 改词的时候已添加过，现在不需要添加

                }else{
                    item.keywordsArr = _.union(item.keywordsArr, keywordsArr);
                }

                if (item.keywordsAuditArr) {
                    item.keywordsAuditArr = _.union(item.keywordsAuditArr, _.clone(keywordsAuditArr, true))
                }

            });

            if (tag && (tag.type == 0 || tag.type == 2) && groupData.keywordsAuditArr.length) {
                groupData.keywordsAuditArr.forEach((v)=> {
                    if(!v) return;

                    if(v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type + '|' + v.source.split('|')[3]))){
                        v.type = 1;
                        v.source = updateTag(v.source, tag.curId);

                        if(groupData.keywordsArr){
                            groupData.keywordsArr.push(tag.curId+'');
                        }
                    }
                });
            }

            //删除组照关键词中已确认关键词
            if (tag && tag.type == undefined && groupData.keywordsArr.length) {
                _.remove(groupData.keywordsArr, (v)=> {
                    return v == tag.id;
                });
            }
        }

        this.setState({listData, groupData});

        if (newDic) {
            this.updateKeywordDic(newDic);
        }

        //  发布关键词验证流程
        if (isPublish) {
            this.synchronizeTagData(true);
        }
    };

    //发布时，弹出的框中的关键词数据修改时通过这里进行同步处理
    //如果验证通过直接发布，否则弹出关键词框，编辑关键词完成以后也不自动提交
    //isPublish 是为了和创意类共用组件，必须。isSubmit 是点击发布直接过来
    synchronizeTagData(isPublish, isSubmit) {
        //console.log("isPublish", isPublish, isSubmit);
        const {groupData, listData, listSelectData, alert} = this.state;
        let keywordsArr = [], auditArr = [[], null, []], flag = false;
        const list = (listSelectData.list && listSelectData.list.length) ? listSelectData.list : listData.filter(item=> item.qualityRank < 5 && !item.offlineReason);

        list.forEach((item, i)=> {
            if (!_.isEmpty(item.keywordsArr)) keywordsArr = _.union(keywordsArr, item.keywordsArr);
            if (!_.isEmpty(item.keywordsAuditArr)) {
                item.keywordsAuditArr.map((item)=> {
                    if(item&&_.isArray(auditArr[item.type])) auditArr[item.type].push({...item});
                });
            }
        });

        if (!_.isEmpty(groupData.keywordsArr)) keywordsArr = _.union(keywordsArr, groupData.keywordsArr);

        if (!_.isEmpty(groupData.keywordsAuditArr)) {
            groupData.keywordsAuditArr.map((item)=> {
                if(item&&_.isArray(auditArr[item.type])) auditArr[item.type].push({...item});
            });
        }

        keywordsArr = _.uniq(keywordsArr);
        auditArr[0] = _.uniq(auditArr[0], 'source');
        auditArr[2] = _.uniq(auditArr[2], 'source');

        // if(!auditArr[0].length && !auditArr[2].length){
        //     if (!groupData.keywordsArr || groupData.keywordsArr.length == 0){
        //          message.error('请添加组照关键词');
        //          this.closeAlert();
        //          return false;
        //     }else{
        //         this.submit({"publishType": 5});
        //         return true
        //     }
        // }
        // 非发布按钮操作 关键词不管存在不存在都要弹出关键词框
        if (auditArr[0].length || auditArr[2].length || !isSubmit) {
            this.validateKeywords(keywordsArr, auditArr[0], auditArr[2], false);
        } else {
            flag = true;
        }

        return flag;
    };

    checkGroupForm() {
        let {groupData: {keywordsArr, keywordsAuditArr, categoryArr, caption}} = this.state;

        // //console.log(keywordsArr);
        // //console.log(categoryArr);

        keywordsArr = keywordsArr.filter(item => item*1);
        categoryArr = categoryArr.filter(item => item*1);

        let flag = true;
        if (!keywordsArr.length && !keywordsAuditArr.length) {
            this.messageAlert('请添加组照关键词！');
            flag = false;
        }
        if (!categoryArr.length) {
            this.messageAlert('请选择分类!');
            flag = false;
        }
        if (!title) {
            this.messageAlert('请填写组照标题!');
            flag = false;
        }
        // if (!caption) {
        //     this.messageAlert('请填写组照说明!');
        //     flag = false;
        // }
        return flag;
    }

    validateKeywords(keywords, newWords, polysemicWords, isPublish) {
        const {dispatch} = this.props, {keywordsDic, alert} = this.state;
        let keywordsArr = [], isPublishAble = !((newWords && newWords.length) || (polysemicWords && polysemicWords.length));
        keywords && keywords.map((keywordId)=> {
            let keyword = keywordsDic[keywordId];
            if (!keyword) return false;
            let kind = keyword.kind;
            let label = keyword.enname;
            keywordsArr.push({
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
        // if(isPublish && newWords.length == 0 && polysemicWords.length==0 && (!alert.params && !alert.params.isPublish)){
        //     // 不需要弹框 但是直接发布 发布状态暂存到alert的isPublish 使用后立即删除
        //     alert.params.isPublish = true;
        //     this.handleOnPublish();
        //     return;
        // }

        this.openAlert({
            "width": 800,
            "title": "编辑关键词",
            "contentShow": "validateKeywords",
            "params": {
                'type': 'edit',
                "unconfirmedTags": [...newWords, ...polysemicWords],
                "confirmedTags": keywordsArr,
                "isPublish": isPublish,
                "deleteAuditWordsWhenPublish": false,
                "submitMsg": "",
                "tagAreaConfigs": {
                    dispatch: this.props.dispatch,
                    type: "edit",
                    keywordsDic: this.state.keywordsDic,
                    size: "large",
                    className: "mb-10",
                    tagContainerStyle: {height: 'auto', maxHeight: '300px'},
                    updateTags: this.updateTags.bind(this),
                    noWrap: true,
                    alertHandle: this.alertHandle.bind(this)
                },
                "handleOnPublish": this.handleOnPublish.bind(this)
            },
            "footer": false,
            "maskClosable": false,
            "dragable": true
        })
    };

    handleOnPublish() {
        const {groupData, listSelectData, listData, alert} = this.state;
        let {deleteAuditWordsWhenPublish} = alert.params;
        let lists = listSelectData.list;

        if (lists == null || lists.length == 0) {
            lists = listData.filter(item=> item.qualityRank < 5 && !item.offlineReason && !item.hide);
        }

        if(deleteAuditWordsWhenPublish){
            groupData.keywordsAuditArr = [];
            lists.forEach(item => item.keywordsAuditArr = []);
            alert.params.isPublish = true;
        }

        if (deleteAuditWordsWhenPublish && alert.params) alert.params.unconfirmedTags = [];
        this.setState({groupData, listSelectData, alert});

        if (alert.params.isPublish) {
            if (!this.checkGroupForm()){
                 message.error('请添加组照关键词');
                 this.closeAlert();
                 return false;
            }else{
                this.submit({"publishType": 5})
            }
        } else {
            this.synchronizeTagData();
        }
    };

    submit({publishType, topicId}) {
        this.setState({fatchIng: true});

        const {groupData, listData, saveTemp} = this.state;
        const {dispatch} = this.props;

        let selectIds = [];

        listData.forEach((item, i) => {
            // if(item.title) item.title = encodeURIComponent(item.title);
            // if(item.caption) item.caption = encodeURIComponent(item.caption);
            // if(item.providerCaption) item.providerCaption = encodeURIComponent(item.providerCaption);

            // if (item.price == 3) {
            //     item.minPrice = 500;
            // } else if (!item.price || item.price == 0) {
            //     item.minPrice = '';
            //     item.price = '';
            // }
            if (item.qualityRank == 5) {
                if (item.onlineState == 1) {
                    item.onlineState = 3;
                }
            }
            // item.sortNumber = i;
        });


        const regionArr = ['country', 'province', 'city']
        listData.filter(item => item.qualityRank < 5 && !item.hide && !item.offlineReason).forEach(item => {
            const { region } = item
            regionArr.forEach((r, i) => {
                item[r] = region[i] || ''
            })

            item.keywordsArr = _.uniq(item.keywordsArr.concat(groupData.categoryArr, item.region.filter(item => item * 1)));

            // 发布清空未确定的词
            if (!saveTemp) {
                item.keywordsAuditArr = [];
                item.keywordsAudit = '';
            } else {// 保存时不清空而且要把当时存在的多义词和新词添加到对象属性上传给后端
                let tempKeywordsAudit = [];
                item.keywordsAuditArr.forEach(item=> {
                    tempKeywordsAudit.push(item.source);
                });

                item.keywordsAudit = tempKeywordsAudit.join(",");
            }

            item.keywords = item.keywordsArr.join(',');
            selectIds.push(item.id + '');
        });

        groupData.keywords = groupData.keywordsArr.join(',');
        groupData.category = groupData.categoryArr.join(',');

        // if(groupData.title) groupData.title = encodeURIComponent(groupData.title);
        // if(groupData.caption) groupData.caption = encodeURIComponent(groupData.caption);

        if(publishType == 8){ //保存
            // listData.list.forEach(item => {
            //     Object.assign(item, item.saveTemp);
            //     item.qualityRank = item.saveTemp.qualityRank == 5 ? 5 : item.qualityRank; //如果等级非E的话不变
            // });
        }else if(publishType == 5){ //发布
            listData.filter(item => item.qualityRank < 5 && !item.hide && !item.offlineReason && item.ossYuantu).forEach(item => {
                if(item.onlineState == 2) item.onlineState = 1;
                if(item.imageState != 2) item.imageState = 2;
            });
        }

        const params = {
            publishType, // publishType 4 二审 5 发布 6 推送（暂定）8 保存
            "operate": saveTemp ? "save" : "publish",
            "group": groupData,
            "images": listData,
            selectIds
        };

        if (publishType == 3 || publishType == 6){
            //console.log(params, topicId);

            params.topicId = topicId.replace(/^\,+/, '');
        }

        // //console.log(publishType, topicId, params);
        this.closeAlert()

        dispatch(publishPushto(params, publishType)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                this.setState({fatchIng: false});
                return false
            }
            let title = "发布";

            switch (publishType) {
                case 3:
                    title = "发布并加入专题";
                    break;
                case 4:
                    title = "二审";
                    break;
                case 5:
                    title = "发布";
                    break;
                case 6:
                    title = '推送';
                    break;
                case 7:
                    title = '发布';
                    break;
                case 8:
                    title = "保存";
                    break;
                default:
            }

	       this.setState({fatchIng: false});

           message.success(title + "成功");
        });
    }

    // 保存不发布
    save({publishType, topicId}) {
        this.submit({publishType, topicId});
    };


    // 发布
    release({publishType, topicId}) {
        const {listData} = this.state;

        if(publishType == 4){ // 如果选了已上线的图片不让二审
            const hasOnline = listData.filter(item => item.qualityRank < 5 && !item.hide && !item.offlineReason).some(item => item.onlineState==1);
            if(hasOnline){
                message.error('已上线的图片，不能进入二审!');
                return;
            }
        }

        if (!this.checkGroupForm()) return false;
        if (!this.synchronizeTagData(publishType == 5, true)) return false;
        this.submit({publishType, topicId});
    };

    // 加入专题
    addToTopic({key, id, groupId}) {

        let ids = [], title = "";
        if (id) {
            title = "发布并加入专题：ID-" + groupId;
            ids.push(id);
        } else {
            title = "发布并加入专题";
            ids = _.pluck(this.state.listData.filter(item => item.qualityRank < 5 && !item.offlineReason), 'id');
            if (ids.length == 0) {
                message.info("请选择组照", 3);
                return false;
            }
        }

        const submit = (param) => {
            if (!this.checkGroupForm()) return false;
            if (!this.synchronizeTagData('', true)) return false;
            this.submit(param)
        }

        this.openAlert({
            "width": 800,
            "title": title,
            "contentShow": "body",
            isFooter: false,
            "body": (<AddToTopic groupId={ids}
                                 release={this.release.bind(this)}
                                 returnTopicId={id => { this.state.topicId = id; } }
                                 closeAlert={this.closeAlert.bind(this) } />)
        });
    };

    //缓存修改结果
    setDataCache() {
        const {filterParams, cacheParams} = this.state;
        const {dispatch} = this.props;
        const key = "eidt_" + filterParams.userId + "_" + filterParams.ids;
        dispatch(dataCache({"key": key, "value": JSON.stringify(cacheParams)})).then(result => {

        });
    };

    setSwing(swing, direction) {
        if (direction == "left") {
            if (swing) {
                swing -= 90
            }
            else {
                swing = 270
            }
        }
        if (direction == "right") {
            if (swing) {
                swing += 90
            }
            else {
                swing = 90
            }
        }
        if (swing > 270) swing = 0;
        if (swing < 0) swing += 360;
        return swing;
    };

    showReplaceBox() {
        const replace = (data, type) => {
            const {listData, listSelectData} = this.state;
            const {find, replace} = data;

            if(type == 'caption'){ // 替换图说
                const re = new RegExp(data.find, 'ig');
                let list = (listSelectData.list && listSelectData.list.length) ? listSelectData.list : listData;
                [...list].forEach(item => {
                    item.caption = item.caption || '';
                    item.providerCaption = item.providerCaption || '';
                    this.step2setItem(item, {
                        caption: item.caption.replace(re, replace),
                        providerCaption: item.providerCaption.replace(re, replace)
                    }, 'sync')
                });
                this.setState({
                    listData
                })
            }else if(type == 'keyword'){
                this.autoMatchKeywords([replace], [find])
            }
        }

        this.openAlert({
            "title": "图片批量查找替换",
            "body": <TextReplace onSubmit={replace} onCancel={this.closeAlert.bind(this)}/>,
            "contentShow": "form",
            "isFooter": false,
            "maskClosable": false,
            "dragable": true
        })
    };

    setListPeopleTag() {
        const { dispatch } = this.props;
        const { listData, listSelectData } = this.state;

        const list = listSelectData.list.length ? listSelectData.list : listData;
        const chunks = _.chunk(list, 2000)


        const queryTag = (n) => {
            const chunk = chunks[n];
            if (!chunk) {
                this.setState({ listData })
                message.success('抓取图说人物关键词成功！')
                return false
            }

            const params = chunk.map(item => ({
                caption: item.caption + ',' + item.providerCaption,
                resImageId: item.id
            }));

            dispatch(findDiscTag(params)).then(res => {
                const { apiError, apiResponse } = res
                if (apiError) {
                    message.error(apiError)
                    return false
                }

                let resObj = apiResponse[0]
                    .reduce((result, cur) => {
                        Object.assign(result, cur);
                        return result;
                    }, {});

                chunk.forEach(item => {
                    const tagObj = resObj[item.id];
                    if (tagObj) {
                        let keywordsArr = [],
                            keywordsAuditArr = [];

                        Object
                            .keys(tagObj)
                            .forEach(key => {
                                let tag = tagObj[key];
                                if (tag.length == 1) { // 已确定的关键词
                                    this.updateKeywordDic(tag[0]);
                                    keywordsArr.push(tag[0].id + '')
                                } else if (tag.length > 1) { // 多义词
                                    let ids = tag.map(t => {
                                        this.updateKeywordDic(t);
                                        return t.id;
                                    }).join('::');

                                    keywordsAuditArr.push({
                                        label: key,
                                        id: ids,
                                        type: 2,
                                        kind: 0,
                                        source: key + '|' + ids + '|2|0'
                                    })
                                }
                            });

                        item.keywordsArr = item
                            .keywordsArr
                            .concat(keywordsArr);
                        item.keywordsAuditArr = item
                            .keywordsAuditArr
                            .concat(keywordsAuditArr);
                    }
                });
                // apiResponse[0]
                queryTag(n + 1)
            })
        }

        queryTag(0)
    };

    showListEditBox() {
        let form = null

        const EditorModal = createForm()(TextEditorModal)

        this.openAlert({
            "title": "图片批量文字编辑",
            "body": <EditorModal ref={(f) => {
                form = f
                let initValue = storage.get('editorModal');

                if (initValue) {
                    initValue = JSON.parse(initValue)
                    if(initValue.createdTime){
                        initValue.createdTime = moment(initValue.createdTime)
                    }
                    f && f.setFieldsValue(initValue)
                }else{
                    f && f.resetFields()
                }
            }} />,
            "contentShow": "body",
            "width": 600,
            style: {
                'height': 420,
                'max-height': 420
            },
            "isFooter": true,
            "maskClosable": false,
            "dragable": true,
            "clearBody": false,
            onOk: () => {
                // console.log(form)
                form.validateFields((err, values) => {
                    if (err) {
                        return;
                    }
                    const { area, caption, captionArea, captionType, createdTime, tagType, tags , history} = values

                    console.log(history)
                    if(history){
                        storage.set('editorModal', JSON.stringify({
                            ...values,
                            dateCameraShot: createdTime
                        }))
                    }else{
                        storage.remove('editorModal')
                    }

                    if (area) {
                        this.step2setList({
                            'region': area
                        }, 'sync', false)
                    }

                    if (createdTime) {
                        this.step2setList({
                            dateCameraShot: createdTime.format('YYYY-MM-DD h:mm:ss')
                        }, 'sync')
                    }

                    if (tagType === 2) { //清空人物关键词
                        this.clearListPeopleTag()
                    } else if (tags) { //修改关键词
                        this.setKeywords(tags, tagType)
                    }

                    if (caption || captionType === 'sync') {
                        captionArea.forEach(key => {
                            this.step2setList({
                                [key]: caption
                            }, captionType)
                        })
                    }

                    // this.closeAlert()
                })
            }
        });


    };

/**
   * 显示隐藏带人名关键词列表
   * @param {keywordsDic} 关键词信息
   * @param {hidePensonTag} 设置状态信息
   * @param {listData} 项目列表
   */

  showHideListEdit() {
    let {keywordsDic, listData, hidePensonTag} = this.state;

    // TODO: 获取kind为3，也就是带人名关键字列表
    const hasPensonTag = (ids) => ids.some(id => keywordsDic[id].kind === 3);


    // TODO: 设置循环列表，隐藏显示符合条件的项
    listData.forEach(item => {
      if (hasPensonTag(item.keywordsArr)) {
        item.hide = !hidePensonTag
      }
    });

    // TODO: 更新状态
    this.setState({
      listData,
      hidePensonTag: !hidePensonTag
    })
  };

  /**
   * 点击推送按钮执行方法
   */
  showPushBox() {
    const QUALIT_YRANK_NUMBER = 5;
    if (this.validateCaption()) {
      message.error('图说不能超过200个字符！');
      return
    }

    let {listData, listSelectData, listSelect} = this.state;
    let lists = (listSelectData.list && listSelectData.list.length) ? listSelectData.list : listData;

    let arrResIds = [];
    let hideResIdsDom = false;

    // TODO: 存贮第二部选择的列表
    listSelect = lists.filter(item => !item.hide && item.qualityRank < QUALIT_YRANK_NUMBER && !item.offlineReason);

    /**
     * 存储已推送过的图片ID
     */
    listSelect.forEach((item) => {
      if (item.pushedOrganizations) {
        arrResIds.push(item.resId)
      }
    });

    /**
     * 设置已推送过图片列表的显示方式
     */
    listSelect.every((item) => {
      if (!item.pushedOrganizations) {
        hideResIdsDom = true
      }
    });

    this.openAlert({
      "title": "推送",
      "body": <PushToStep3 dispatch={this.props.dispatch} handleOnPublish={this.setPushData.bind(this)} resIds={arrResIds} hide={hideResIdsDom}/>,
      "contentShow": "body",
      "onOk": () => {
        this.push()
      },
      "isFooter": true
    });
  };

    setPushData(data) {
        this.state.pushData = data;
    };

    validateCaption() {
        const { listData } = this.state;
        return listData.some(item => !item.hide && item.qualityRank < 5 && !item.offlineReason && (getStrLength(item.caption) > 200 || (getStrLength(item.providerCaption) > 200 && !item.caption)))
    }

    push() {
        const { dispatch } = this.props;
        const { pushData, listData } = this.state;
        // let topicedIds = [];
        if (pushData.length == 0) {
            message.error("请选择推送方");
            return false;
        }

        // const topicedIds = _.uniq(listData.filter(item => {
        //     return !item.hide && item.qualityRank < 5 && !item.offlineReason && Array.isArray(item.pushedOrganizations) && item.pushedOrganizations.length>0;
        // }).reduce((result, item) => {
        //     // //console.log(item);
        //     result = result.concat(item.pushedOrganizations);
        //     return result;
        // }, []).map(item => item.type));

        // if(pushData.some(item => topicedIds.indexOf(item+'')!=-1)){
        //     message.error("图片不能重复推送同个推送方，请重新选择！");
        //     return false;
        // }

        this.release({"publishType": 6, topicId: pushData.join(',')})
    };

    /**
     * 请求匹配关键词
     * @param  {String} labelArr 新增的关键词数组
     * @param  {String} tag 删除的关键词
     */
     autoMatchKeywords(labelArr, tag) {
         const {dispatch, type, kind} = this.props;
         tag = tag || null;

         const now = (n) => {
             const time = Date.now() + '';
             return (time.substr(0, time.length-1) + n)*1
         };

         //console.log(labelArr);
         //输入多个词且以逗号分隔时，传参为name:['a', 'b', 'c']  返回格式{a: [{xxx}], b:[{xx}, {oo}], c:[]}
         dispatch(findKeyword({name: labelArr, type})).then(result => {
             if (result.apiError) {
                 message.error(result.apiError.errorMessage, 3);
                 return false;
             }
             const res = result.apiResponse;
             let keywordsArr = [], keywordsAuditArr = [], newDic = [];

             labelArr.forEach((label, i)=>{ //
                 let matchedKeywords = Array.isArray(res[label]) ? res[label]: eval(res[label]);

                 newDic = newDic.concat(matchedKeywords);

                 if (!matchedKeywords || !matchedKeywords.length) {//新词按照格式加入keywordsAuditArr
                     if(label){
                         keywordsAuditArr.push({
                             label: label,
                             id: '',
                             type: 0,
                             kind: kind,
                             source: label + '||0|0'
                         });

                         sortTag[label] = sortTag[label] || now(i);
                     }
                 }else if(matchedKeywords.length > 1){ //多义词按照格式加入keywordsAuditArr
                     let ids = [], idStr = '';
                     matchedKeywords.map((item)=> {
                         ids.push(item.id);
                     });
                     //多义词的多个id以::分隔
                     idStr = ids.join('::');
                     keywordsAuditArr.push({
                         label: label,
                         id: idStr,
                         type: 2,
                         kind: kind,
                         source: label + '|' + idStr + '|2|0'
                     });

                     sortTag[label] = sortTag[label] || now(i);
                 }else{//匹配到一个直接加入keywordsArr中
                     let matchedId = matchedKeywords[0].id;

                     sortTag[matchedKeywords[0].enname] = sortTag[matchedKeywords[0].enname] || now(i);

                     keywordsArr.push(matchedId.toString());
                 }
             });

             //console.log({keywordsArr, keywordsAuditArr, newDic: _.compact(newDic)}, tag, false);

             this.updateTags({keywordsArr, keywordsAuditArr, newDic: _.compact(newDic)}, tag, false);
         });
     };
}
