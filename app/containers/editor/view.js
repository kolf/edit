import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {getStorage} from "app/api/auth_token";
import {editorUrl} from "app/api/api_config.js";
import CrumbsBox from "app/components/common/crumbs";
import ThumbnailBox from "app/components/provider/thumbnail";
import EditModal from "app/components/edit/editModal";
import EditStep2_1 from "app/components/edit/Step2_1";
import message from "antd/lib/message";
import Collapse from "antd/lib/collapse";
import Form from "antd/lib/form";
import Button from "antd/lib/button";
import {Input} from "antd";
import {getEditData, getKeywordById} from "app/action_creators/edit_action_creator";
import {Postil} from "app/action_creators/provider_action_creator";
const Panel = Collapse.Panel;
const createForm = Form.create;
const Step2_1 = createForm()(EditStep2_1);


//keywordsAudit字段分割的正则
const keywordsAuditReg = /[^,\|\s].*?\|[^|]*?\|[0-9\.]+\|\d+/g, keywordsSplitReg = /,|::/;

const edit = (state) => ({

});
@connect(edit)
export default class EditorViewContainer extends Component {

    constructor(props) {
        super(props);
        const {ids} = props.params;
        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "/group/:id", "text": "组图详情"}
            ],
            "filterParams": {
                "userId": getStorage('userId'), // userId 用户ID
                "role": 2,        // role 1 销售 2 财务 3 运营
                "type": "group",
                "operate": "edit",
                ids,              // groupId photoId
                "pageNum": 1,     // pageNum 当前页数
                "pageSize": 60    // pageSize 每页条数
            },
            "groupData": {        // 组图数据
            },
            "listData": {            // 图片数据
                "list": null,        // 提交数据
                "listInit": null,    // 原始数据
                "selectStatus": [],  // 选择状态
                "timeByOrder": false,// 创建时间排序
                "total": 0           // 数据总数
            },
            'maskLoading': true,     // loading
            "keywordsDic": {},       // 关键词字典
            "regionOptions": [],     // 地域数据
            "doing": "doing",
            "alert": {},
            "id": ''
        };
        // //console.info(this.state);
    };

    componentWillMount() {
        document.title= '组图ID：'+this.props.params.ids+' - 组图详情 - 内容管理系统 - VCG © 视觉中国';
        const {filterParams} = this.state;
        this.queryList(filterParams);
    };

    openAlert(alert) {
        this.setState({alert, "doing": "openAlert"})
    };

    closeAlert() {
        this.setState({"doing": "closeAlert"});
    };

    render() {
        const self = this;
        const {crumbs, alert, filterParams, groupData, doing, listData, keywordsDic, regionOptions,maskLoading} = this.state;

        const step2_1Config = {
            operate: "view",
            groupData,
            keywordsDic,
            dispatch: this.props.dispatch
        };
        const step2_3Config = {
            animate: true,
            type: 'edit',
            types: "editStepTwo",
            operate: "view",
            maskLoading: false,
            doing,
            lists: listData.list,
            keywordsDic,
            regionOptions,
            dispatch: this.props.dispatch
        };
        const paginationInit = {
            "current": filterParams.pageNum,
            "pageSize": filterParams.pageSize,
            "total": listData.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal () {
                return '共 ' + listData.total + ' 条';
            },
            onShowSizeChange (current, pageSize) {
                self.refresh("pagination", {"pageNum": current, "pageSize": pageSize});
            },
            onChange(current) {
                self.refresh("pagination", {"pageNum": current});
            }
        };

        return (
            <div className="main-content-inner">
                <CrumbsBox crumbs={crumbs}/>
                <div className="page-content">

                    <EditModal doing={doing} alert={alert} />

                    <div className="row">
                        <div className="space-6"></div>
                    </div>
                    <Button onClick={this.openPostil.bind(this)} type="primary" className="postilButton">批注</Button>

                    <Collapse defaultActiveKey={['1']}>
                        <Panel header={"组照查看（ID："+groupData.groupId+"）"} key="1">
                            <Step2_1 {...step2_1Config} />
                        </Panel>
                    </Collapse>

                    <div className="row">
                        <div className="space-8"></div>
                    </div>

                    <ThumbnailBox {...step2_3Config} />

                </div>
            </div>
        );
    };

    queryList(params) {
        this.setState({maskLoading: true});
        const {dispatch} = this.props;
        dispatch(getEditData(params)).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }

            const {list, group} = result.apiResponse;
            let {groupData, listData} = this.state,
                _dataList = [],
                keywordsTagArr = [],
                categoryArr = [],
                keywordsArr = [];
            groupData = {...group};
            [...list].map((item, i) => {
                let tmp = {...item};
                //_.mapKeys(item, (val, key) => {
                //	tmp[key] = val;
                //});
                tmp.timeByOrder = moment(item.createdTime).unix();
                tmp.rotate = 0;
                tmp.key = i;
                if (Number(tmp.qualityRank) != 5 && tmp.imageRejectReason) {
                    tmp.imageRejectReason = "";
                }
                if (!tmp.qualityRank) {
                    tmp.qualityRank = 1;
                    tmp.imageRejectReason = "";
                }
                _dataList.push(tmp);
            });
            //Object.assign(listData,dataList);
            listData.list = _dataList;
            listData.total = _dataList.length;

            if (groupData.category) { // keywords -> category -> oneCategory 组包含关系
                categoryArr = groupData.category.replace(/\,$/, '').split(keywordsSplitReg);
                keywordsTagArr = keywordsTagArr.concat(categoryArr);
            }
            groupData.categoryArr = categoryArr;
            if (groupData.keywords) { // keywords -> category -> oneCategory 组包含关系
                keywordsArr = groupData.keywords.split(keywordsSplitReg);
                keywordsTagArr = keywordsTagArr.concat(keywordsArr);
            }
            groupData.keywordsArr = keywordsArr;
            groupData.keywordsAuditArr = [];
            //console.log(groupData);
            [...listData.list].map((item, i) => { // keywords -> category -> oneCategory 图片包含关系
                item.keywordsArr = [];
                item.keywordsAuditArr = [];
                item.region = [];
                if (item.country) {
                    //item.keywordsArr.push(item.country);
                    item.region.push(item.country);
                }
                if (item.province) {
                    //item.keywordsArr.push(item.province);
                    item.region.push(item.province);
                }
                if (item.city) {
                    //item.keywordsArr.push(item.city);
                    item.region.push(item.city);
                }
                //console.log(i,item);
                if (item.keywords) {
                    item.keywordsArr = item.keywordsArr.concat(item.keywords.split(keywordsSplitReg));
                    keywordsTagArr = keywordsTagArr.concat(item.keywordsArr);
                }
                if (item.category) {
                    item.keywordsArr = item.keywordsArr.concat(item.category.split(keywordsSplitReg));
                    keywordsTagArr = keywordsTagArr.concat(item.keywordsArr);
                }
                item.keywordsArr = _.compact(_.uniq(item.keywordsArr));

                // const caption = item.caption ? item.caption : "";
                // const captionTemp = caption.split('***_***');
                // if (captionTemp.length == 2) {
                //     item.oldCaption = captionTemp[1] ? captionTemp[1] : "";
                //     item.newCaption = captionTemp[0] ? captionTemp[0] : "";
                // } else {
                //     item.oldCaption = captionTemp[0] ? captionTemp[0] : "";
                //     item.newCaption = captionTemp[1] ? captionTemp[1] : "";
                // }

                /*
                 *  keywordsAudit为后台自动审计后的关键字，格式为 tag|id|type

                 *  其中type=0表示新词，type=1表示正常，type=2表示多义词，type=3表示不检测

                 *  多义词的多个id以逗号分隔.目前数据库中存在错误数据，大量id之间包含双冒号，这里也需要处理
                 */
                if (item.keywordsAudit) {
                    const auditMatchResult = item.keywordsAudit.match(keywordsAuditReg);
                    let keywordsAuditArr = [];
                    auditMatchResult.map((auditItem)=> {
                        const auditSplitResult = auditItem.split('|');
                        keywordsTagArr = keywordsTagArr.concat(auditSplitResult[1].split(keywordsSplitReg));
                        keywordsAuditArr.push({
                            label: auditSplitResult[0],
                            id: auditSplitResult[1],
                            type: auditSplitResult[2],
                            source: auditItem
                        });
                    });
                    item.keywordsAuditArr = _.compact(_.uniq(keywordsAuditArr, 'source'));
                }
            });

            this.state.id = groupData.id;

            listData.listInit = listData.list;
            //listData.selectStatus = _.fill(new Array(listData.list.length), false);

            this.initKeywordDic({groupData, listData, keywordsTagArr});
        });
    };

    //生成字典&初始化生成字段
    initKeywordDic({groupData, listData, keywordsTagArr}) {
        keywordsTagArr = _.compact(_.uniq(keywordsTagArr));
        //console.log(groupData,listData,keywordsTagArr);
        //console.log(keywordsTagArr);
        const {dispatch} = this.props;
        dispatch(getKeywordById({'data': keywordsTagArr.join(',')})).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }

            //创建字典
            let {keywordsDic} = this.state, keywordsArr = [];
            [...result.apiResponse].forEach(item => {
                keywordsDic[item.id] = item;
                keywordsArr.push(item.id + "");
            });

            const keywordsAuditArr = _.difference(keywordsTagArr, keywordsArr);
            if (keywordsAuditArr.length > 0) {
                //console.error("初始化处理新词：", keywordsAuditArr);
            }

            //console.log(groupData, listData, keywordsDic);
            this.setState({groupData, listData, keywordsDic, maskLoading: false});

            //this.forceUpdate();
            //if(this.props.queryRegion) this.props.queryRegion({ "parentId": 0 , "curKey": "[0]" });
        });
    };

    refresh(type, dataParams) {
        const {filterParams} = this.state;
        //console.error(type, dataParams,filterParams);
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

    handleOnThumbnail(params) {
        const {operate, key} = params;
        switch (operate) {
            default:
                //console.log(operate, params);
        }
    };

    openPostil() {
        const config = {
            "bsSize": "small",
            "title": <samll style={{"fontSize":"14px"}}>批注</samll>,
            "contentShow": "body",
            "body": <Input type="textarea" placeholder="请输入图片批注" autoComplete="off" row={5}
                           onChange={e => {this.state.msg = e.target.value}}/>,
            // "submitAlert": this.submitPostil.bind(this),
            // "isButton": true,
            "maskClosable": false,
            "dragable": true,
            "onOk": this.submitPostil.bind(this),
            "isFooter":true
        };
        this.openAlert(config);
    };

    submitPostil() {
        const {dispatch, params} = this.props;
        const {msg, id} = this.state;
        //{groupId, msg, userId, type};
        //console.log(id);

        dispatch(Postil({groupId: id, msg: msg, type: 1})).then(result=> {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }
            message.success('批注成功!');
            this.closeAlert();
        });

    };

}
