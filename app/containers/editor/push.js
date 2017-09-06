import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import ReactDOM from "react-dom";
import CrumbsBox from "app/components/common/crumbs";
import ThumbnailBox from "app/components/provider/thumbnail";
import Wizard, {Step} from "app/components/provider/wizard";
import {Panel, Modal} from "react-bootstrap/lib";
import {editorUrl} from "app/api/api_config.js";
import {Affix, Form, Button, Input, Select, Radio, Switch, Spin, message, TreeSelect} from "antd";
import {EditStep2_1} from "app/components/edit/Step2_1";
import {EditStep2_2} from "app/components/edit/Step2_2";
import {PushToStep3} from "app/components/edit/pushto_step3";
import {
    viewEditPic,
    pushtoData,
    publishPushto,
    editSavePostData,
    getFavoriteList,
    postFavoriteItem,
    allNoPass,
    findlocaltion,
    findKeyword,
    addKeyword,
    modifyKeyword,
    getKeywordById
} from "app/action_creators/edit_action_creator";

const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const SHOW_ALL = TreeSelect.SHOW_ALL;
const SHOW_CHILD = TreeSelect.SHOW_CHILD;

const Step2_1 = createForm()(EditStep2_1);
const Step2_2 = createForm()(EditStep2_2);

function noop() {
    return false;
}

const edit = (state) => ({
    "List": state.edit.pushtoData.resource,
    "group": state.edit.pushtoData.group,
    "keywords": state.edit.keywords
});
@connect(edit)

export default class EditorPushContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "dataList": null,//所有的图片信息
            "selectedItem": {},//被选的图片ID
            "selectedList": [],//第二步中dataList
            "publishData": [],//发布选项
            "groupData": {},
            "keywordsDocName": {},
            "keywordsDocKind": {},
            "routeParams": {},
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "/editor/push/:id", "text": "组照推送：组照编审"}
            ],
            "selectStatus": [],
            "classifyValue": [],
            "wizardConfig": [
                {
                    "title": "图片审核",
                    "contentText": <h3 className="green">组照审核的内容（如果没有render方法则显示这个。。。</h3>,
                    "stepRender": this.RenderStep_1.bind(this),
                    "componentDid": this.ThumbnailboxRender.bind(this)
                },
                {
                    "title": "文字编辑",
                    "contentText": <h3 className="green"> 加载失败... </h3>,
                    "stepRender": this.RenderStep_2.bind(this)
                },
                {
                    "title": "发布操作",
                    "contentText": <h3 className="green">发布成功了喂~</h3>,
                    "stepRender": this.RenderStep_3.bind(this)
                }
            ],
            "param": {
                "nextAction_1": this.nextAction_1.bind(this),
                "publish": this.publish.bind(this)
            },
            "alert": {
                "show": false,
                "isButton": true,
                "bsSize": "small",
                "onHide": this.closeAlert.bind(this),
                "title": null,
                "body": null,
                "param": null,
                "submitAlert": null
            }
        };
    };

    componentDidMount() {
        const {group, params} = this.props;
        this.state.routeParams = {
            ids: params.ids
        };
        this.queryList();
        this.state.groupData = group;
    };

    componentWillUnmount() {
        if (document.getElementById('selectNum')) ReactDOM.render(<div></div>, document.getElementById('selectNum'));//数字标记
        if (document.getElementById('step2_1')) ReactDOM.render(<div></div>, document.getElementById('step2_1'));//组照第二步第一
        if (document.getElementById('thumbnailBox')) ReactDOM.render(
            <div></div>, document.getElementById('thumbnailBox'));//第一步
        //if (document.getElementById('wizard-container')) ReactDOM.render(<div></div>, document.getElementById('wizard-container'));
    };

    render() {
        const {crumbs, alert, param, wizardConfig} = this.state;
        const alertBox = (
            <Modal {...alert}>
                <Modal.Header closeButton>
                    <Modal.Title>{alert.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ "overflow": "hidden" }} className="textcenter">{alert.body}</Modal.Body>
                {alert.isButton &&
                <Modal.Footer>
                    <Button type="primary" onClick={alert.submitAlert}>确认</Button>
                    <Button type="ghost" onClick={alert.onHide} className="ml-5">取消</Button>
                </Modal.Footer>}
            </Modal>
        );
        return (
            <div className="main-content-inner">

                <CrumbsBox crumbs={crumbs}/>

                <Modal {...alert}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>{alert.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ "overflow": "hidden" }}>{alert.body}</Modal.Body>
                    {alert.isButton &&
                    <Modal.Footer>
                        {alert.msg && <span className="orange pr-10"><i
                            className="ace-icon fa fa-hand-o-right"></i> {alert.msg}</span>}
                        {alert.submitAlert &&
                        <Button bsClass="btn btn-sm btn-info btn-round" disabled={alert.isLoading}
                                onClick={!alert.isLoading ? alert.submitAlert : null}>
                            {alert.isLoading ? 'Loading...' : '确认'}
                        </Button>
                        }
                        <Button bsClass="btn btn-sm btn-light btn-round" onClick={alert.onHide}>取消</Button>
                    </Modal.Footer>
                    }
                </Modal>

                <Wizard {...param}>
                    {[...wizardConfig].map((step, i) => {
                        return (
                            <Step key={i + 1} {...step}/>
                        )
                    }) }
                </Wizard>

            </div>
        );
    };

    refresh() {
        this.queryList();
    };

    queryList() {
        const {dispatch, params} = this.props;
        dispatch(pushtoData(params.ids)).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }
            const {List, group} = this.props;

            let listTmp = [];
            [...List].forEach((item) => {
                let tmp = {...item};
                //_.mapKeys(item, (val, key) => {
                //    tmp[key] = val;
                //});
                if (Number(tmp.qualityRank) != 5 && tmp.imageRejectReason) {
                    tmp.imageRejectReason = "";
                }
                if (!tmp.qualityRank) {
                    tmp.qualityRank = 1;
                    tmp.imageRejectReason = "";
                }
                listTmp.push(tmp);
            });
            this.state.dataList = listTmp;

            //let grouptmp = {};
            //_.mapKeys(group, (val, key) => {
            //    //console.log('mapKeys',val, key);
            //    grouptmp[key] = val;
            //});

            this.state.groupData = {...group};
            //console.error('queryList', this.state.groupData, this.state.dataList);
            this.state.selectStatus = _.fill(new Array(List.len), false);
            this.setKeyword_doc();
        });
    };

    //生成字典&初始化生成字段
    setKeyword_doc() {
        const {dispatch, List, group} = this.props;
        let keywordsTag = "";
        if (group.keywords) { // keywords -> category -> oneCategory 组包含关系
            keywordsTag += group.keywords + ",";
        }
        //console.log('group.keywords', keywordsTag);
        [...List].forEach((item) => { // keywords -> category -> oneCategory 图片包含关系
            if (item.keywords) keywordsTag += item.keywords + ",";
        });
        //console.log('keywordsTag', keywordsTag);

        let keywordsTagArr = [];
        keywordsTag.split(',').forEach(item => {
            keywordsTagArr = _.union(keywordsTagArr, item.split('::'));
        });
        //console.log('keywordsTagArr', _.compact(keywordsTagArr));


        //if(!keywordsTag) {
        //    this.ThumbnailboxRender();
        //    return false;
        //}
        dispatch(getKeywordById({'data': _.compact(keywordsTagArr).join(',')})).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }

            //创建字典
            [...result.apiResponse].forEach(item => {
                const {id, cnname, kind} = item;
                if (id && cnname) this.state.keywordsDocName[id] = cnname;
                if (id && kind) this.state.keywordsDocKind[id] = kind;
            });

            const {keywordsDocName, keywordsDocKind} = this.state;

            //替换组分类
            let groupCategoryTag = [];
            if (group.category) {
                [...group.category.split(",")].forEach(id => {
                    const label = keywordsDocName[id];
                    const kind = keywordsDocKind[id];
                    if (id && label) {
                        // label value key
                        groupCategoryTag.push({label: label, value: id, kind: kind});
                    }
                });
            }
            this.state.groupData.categoryTag = groupCategoryTag;
            //替换组关键词
            let groupKeywordsTag = [];
            if (group.keywords) {
                [...group.keywords.split(",")].forEach(id => {
                    const label = keywordsDocName[id];
                    const kind = keywordsDocKind[id];
                    if (id && label) {
                        groupKeywordsTag.push({key: label + "  (" + id + ")", label: label, id: id, kind: kind});
                    }
                });
            }
            this.state.groupData.keywordsTag = groupKeywordsTag;

            //_.remove(groupkeywords_arr, item => { if (!item || _.indexOf(classify_arr, item) != -1) return true; });

            //替换图片关键词

            [...List].map((item, i) => {

                //this.state.dataList[i].keywordsDocName=keywordsDocName;
                //this.state.dataList[i].keywordsDocKind=keywordsDocKind;

                // kind 0 主题 1 概念 2 规格 3 人物 4 地点 其他放到主题里
                const keywordType = ['themeTag', 'conceptTag', 'formatTag', 'peopleTag', 'locationTag'];
                let picKeywords = {
                    themeTag: [],
                    conceptTag: [],
                    formatTag: [],
                    peopleTag: [],
                    locationTag: [],
                    keywordsTag: []
                };
                [...item.keywords.split(",")].forEach(id => { //keywords
                    const kind = keywordsDocKind[id];
                    const name = keywordType[kind] ? keywordType[kind] : "themeTag";
                    const label = keywordsDocName[id];
                    if (id && label) {
                        const obj = {key: label + "  (" + id + ")", label: label, id: id, kind: kind};
                        picKeywords[name].push(obj);
                        picKeywords.keywordsTag.push(obj);
                    }
                });
                Object.assign(this.state.dataList[i], picKeywords);

                //keywordsAudit [0-9a-zA-Z\W]+
                let keywordsAuditTag = [];
                if (item.keywordsAudit)
                    [...item.keywordsAudit.match(/[\s\S]+\|[0-9|'::']*\|\d+/g)].forEach(item => {
                        const arr = item.split("|");
                        const param = {
                            label: _.trim(arr[0], ","),
                            id: arr[1],
                            type: arr[2]
                        };
                        if (param.type === "3") {//没检测
                            param.label += "✲";
                        }
                        if (param.type === "2") {//多义词
                            param.label += "✻";
                        }
                        if (param.type === "0") {//新词
                            param.label += "✳";
                        }
                        keywordsAuditTag.push(param);
                    });
                this.state.dataList[i].keywordsAuditTag = keywordsAuditTag;

                //theme_tmp = _.uniq(keywordsAudit_tmp.concat(theme_tmp), "id");
                //console.log('1',keywordsDocName);
                //console.log('2',keywordsDocKind);
                //console.log('3',picKeywords);
                //console.log('4',keywordsAuditTag);
                //console.log('5',this.state.dataList[i]);

            });

            this.ThumbnailboxRender();

        });
    };

    closeAlert() {
        const alert = Object.assign(this.state.alert, {"show": false});
        this.setState({"alert": alert});
    };

    openAlert(config) {
        const alert = Object.assign(this.state.alert, {"show": true}, config);
        this.setState({"alert": alert});
    };

    //step_1

    RenderStep_1() {
        return (
            <div>
                <Affix className="row operate">
                    <div className="col-xs-12 pr-200">
                        <button className="btn btn-sm btn-info" onClick={this.selectAll.bind(this) }>
                            <i className="ace-icon fa fa-copy"></i>全选
                        </button>
                        <button className="btn btn-sm btn-info" onClick={this.selectToggle.bind(this) }>
                            <i className="ace-icon fa fa-clipboard"></i>反选
                        </button>
                        <button className="btn btn-sm btn-info" onClick={this.refresh.bind(this) }>
                            <i className="ace-icon fa fa-refresh"></i>刷新
                        </button>

                        <span className="line-c"></span>
                        {/*
                         <button className="btn btn-sm btn-info" onClick={this.AllTurnLeft.bind(this) }>
                         <i className="ace-icon fa fa-rotate-left"></i>左旋转
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.AllTurnRight.bind(this) }>
                         <i className="ace-icon fa fa-rotate-right"></i>右旋转
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.setLevel.bind(this) }>
                         <i className="ace-icon fa fa-bug"></i>设置等级
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.AllNoPass.bind(this,'select') }>
                         <i className="ace-icon fa fa-hand-stop-o"></i>不通过
                         </button>
                         <button className="btn btn-sm btn-info" onClick={() => this.favoriteModal(false) }>
                         <i className="ace-icon fa fa-star"></i>收藏夹
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.allDownloadPicture.bind(this) }>
                         <i className="ace-icon fa fa-cloud-download"></i>下载
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.selectToggle.bind(this) }>
                         <i className="ace-icon fa fa-ship"></i>添加到其他分类
                         </button>
                         <button className="btn btn-sm btn-info" onClick={this.selectToggle.bind(this) }>
                         <i className="ace-icon fa fa-ship"></i>推送
                         </button>
                         <div id="selectNum" className="fr"></div>
                         */}
                    </div>

                </Affix>

                <div className="row">
                    <div className="space-8"></div>
                </div>

                <div id="thumbnailBox" className="thumbnail-container"></div>
            </div>
        );
    };

    sortableGroup(evt) {
        const {oldIndex, newIndex} = evt;
        //console.log('oldIndex::', oldIndex, 'newIndex::', newIndex);
        if (_.isNumber(oldIndex) && _.isNumber(newIndex) && oldIndex != newIndex) {
            const {dataList} = this.state;
            const oldList = dataList[oldIndex];
            dataList[oldIndex] = dataList[newIndex];
            dataList[newIndex] = oldList;
            this.state.dataList = dataList;
            //this.ThumbnailboxRender();
        }
    };

    ThumbnailboxRender() {
        const {dataList} = this.state;
        const container = document.getElementById('thumbnailBox');

        const config = {
            "groupId": this.props.params.ids,
            "refresh": this.refresh.bind(this),
            //选择
            "selectStatus": this.state.selectStatus,
            "setSelectStatus": this.setSelectStatus.bind(this),
            "sortableGroup": this.sortableGroup.bind(this)
        };
        ReactDOM.render(
            <ThumbnailBox
                types="push"
                animate
                lists={dataList}
                onThumbnail={this.handleOnThumbnail.bind(this) }
                {...config}
            />, container
        );
        // this.selectNumRender();
    };

    selectNumRender() {
        const container = document.getElementById('selectNum');
        const length = this.state.dataList.length;
        const {selectStatus} = this.state;
        let len = 0;
        [...selectStatus].map((item, i) => {
            if (item) len++;
        });
        ReactDOM.render(
            <span className="selectAndTotal">{len + " / " + length}</span>, container
        );
    };

    setSelectStatus(params) {
        const {selectStatus} = this.state;
        const _selectStatus = Object.assign(selectStatus, params);
        this.setState({
            selectStatus: _selectStatus
        });
        this.setState({selectedItem: this.getSelectId});
        // this.selectNumRender();
    };

    selectAll() {
        const {selectStatus} = this.state;
        let len = this.state.dataList.length;
        this.state.selectStatus = _.fill(new Array(len), true);
        this.ThumbnailboxRender();
        this.setState({selectedItem: this.getSelectId});
        // this.selectNumRender();
    };

    selectToggle() {
        const {selectStatus} = this.state;
        this.state.selectStatus = [...selectStatus].map((val, i) => {
            return !val
        });
        this.ThumbnailboxRender();
        this.setState({selectedItem: this.getSelectId});
        // this.selectNumRender();
    };

    getSelectId() {
        const {selectStatus, dataList} = this.state;
        let selectIdList = [];
        [...selectStatus].map((item, i) => {
            if (item) selectIdList.push(dataList[i].id);
        });
        return selectIdList;
    };

    handleOnThumbnail(params) {
        const {operate, key} = params;
        switch (operate) {
            case "expand":
                this.expandContract();
                break;
            case "radio":
                this.radioChange(params);
                break;
            case "input":
                this.inputChange(params);
                break;
            case "turnRight":
                this.turnRight(params);
                break;
            case "turnLeft":
                this.turnLeft(params);
                break;
            case "addToFavorite":
                this.addToFavorite(params.id);
                break;
            case "goTop":
                this.gotop(params);
                break;
            case "originPicture":
                this.viewPicture(params, "origin");
                break;
            case "middlePicture":
                this.viewPicture(params, "middle");
                break;
            //case "upload":
            //    this.uploadPicture(params);
            //    break;
            case "download":
                this.downloadPicture([params.id]);
                break;
            case "viewProvider":
                this.viewProvider(params.id);
                break;
            default:
                //console.log(operate, params);
        }
    };

    viewProvider(providerId) {
        window.open('/provider/view/' + providerId);
    };

    radioChange(params) {
        const {id, key, value} = params;
        let {dataList} = this.state;
        if (dataList[key].id === id) dataList[key]['qualityRank'] = value;

        this.state.dataList = dataList;
        this.ThumbnailboxRender();
    };

    inputChange(params) {
        const {id, key, value} = params;
        let {dataList} = this.state;
        if (dataList[key].id === id) dataList[key]['creditLine'] = value;

        this.state.dataList = dataList;
        this.ThumbnailboxRender();
    };

    setLevel() { // 设置等级
        const {selectStatus} = this.state;
        this.state.alert.param = 1;
        let body, submitAlert;
        if (_.indexOf(selectStatus, true) < 0) {
            body = <p className="textcenter">你还没有选择任何图片~</p>;
            submitAlert = this.closeAlert.bind(this);
        } else {
            body = <RadioGroup
                value={this.state.alert.param}
                onChange={this.allRadioChange.bind(this) }
                operate="radio"
            >
                <Radio key="a" value={1}>A</Radio>
                <Radio key="b" value={2}>B</Radio>
                <Radio key="c" value={3}>C</Radio>
                <Radio key="d" value={4}>D</Radio>
                <Radio key="e" value={5}>E</Radio>
            </RadioGroup>;

            submitAlert = this.setRanksubmit.bind(this);
        }

        const config = {
            "bsSize": "small",
            "title": <samll style={{ "fontSize": "14px" }}>等级设置</samll>,
            "contentShow": "body",
            "body": body,
            "isKeyword": true,
            "submitAlert": submitAlert,
            "isButton": true
        };
        this.openAlert(config);
    };

    allRadioChange(e) {
        let {alert} = this.state;
        // unmountComponentAtNode(DOMElement, list);
        alert.show = true;
        alert.param = e.target.value;
        alert.body = <RadioGroup
            value={e.target.value}
            onChange={this.allRadioChange.bind(this) }
            operate="radio"
        >
            <Radio key="a" value={1}>A</Radio>
            <Radio key="b" value={2}>B</Radio>
            <Radio key="c" value={3}>C</Radio>
            <Radio key="d" value={4}>D</Radio>
            <Radio key="e" value={5}>E</Radio>
        </RadioGroup>;
        this.setState({alert});
    };

    setRanksubmit() {
        const {selectStatus, dataList} = this.state;
        const param = this.state.alert.param;
        if (_.isNumber(param)) {
            [...selectStatus].map((item, i) => {
                if (item) {
                    dataList[i].qualityRank = param;
                    dataList[i].imageRejectReason = "";
                }
            });
            this.ThumbnailboxRender();
            this.closeAlert();
        }
    };

    turnLeft({id, key, value}) {
        let {dataList} = this.state;
        let rotate = 0;
        if (parseInt(dataList[key].id) === parseInt(id)) rotate = dataList[key]['rotate'];

        //console.info('turnLeft', rotate, id, dataList[key].id, key);
        if (rotate) {
            rotate -= 90
        }
        else {
            rotate = 270
        }

        if (rotate > 270) rotate = 0;
        if (rotate < 0) rotate += 360;

        dataList[key]['rotate'] = rotate;
        this.state.dataList = dataList;
        //console.info(this.state.dataList[key]);
        this.ThumbnailboxRender();
    };

    turnRight({id, key, value}) {
        let {dataList} = this.state;
        let rotate = 0;

        if (parseInt(dataList[key].id) === parseInt(id)) rotate = dataList[key]['rotate'];

        if (rotate) {
            rotate += 90
        }
        else {
            rotate = 90
        }

        if (rotate > 270) rotate = 0;
        if (rotate < 0) rotate += 360;

        dataList[key]['rotate'] = rotate;
        this.state.dataList = dataList;
        this.ThumbnailboxRender();
    };

    AllTurnLeft() {
        let {dataList, selectStatus} = this.state;
        let done = false;
        [...selectStatus].map((item, i) => {
            if (!item) return false;
            let rotate = dataList[i].rotate;
            if (rotate) {
                rotate -= 90
            }
            else {
                rotate = 270
            }
            if (rotate > 270) rotate = 0;
            if (rotate < 0) rotate += 360;

            done = true;
            dataList[i].rotate = rotate;
        });
        if (done) {
            this.setState({dataList});
            this.ThumbnailboxRender();
        }
    };

    AllTurnRight() {
        let {dataList, selectStatus} = this.state;
        let done = false;
        [...selectStatus].map((item, i) => {
            if (!item) return false;
            let rotate = dataList[i].rotate;
            if (rotate) {
                rotate += 90
            }
            else {
                rotate = 90
            }
            if (rotate > 270) rotate = 0;
            if (rotate < 0) rotate += 360;

            done = true;
            dataList[i].rotate = rotate;
        });

        if (done) {
            this.setState({dataList});
            this.ThumbnailboxRender();
        }
    };

    AllNoPass(type) {
        const {selectStatus, alert} = this.state;
        let body, submitAlert;
        alert.param = {
            value: 1,
            imageRejectReason: "",
            error: false
        };

        if (type == "select") {
            if (_.indexOf(selectStatus, true) < 0) { // 没有选择
                body = <p className="textcenter">请选择图片</p>;
                submitAlert = this.closeAlert.bind(this);
            } else {  // 有选择
                body = this.allNoPassBody();
                submitAlert = this.setNoPassSubmit.bind(this, type);
            }
        }

        if (type == "next") { // nextAction_1
            body = this.allNoPassBody();
            submitAlert = this.setNoPassSubmit.bind(this, type);
        }

        const config = {
            "bsSize": "small",
            "title": <samll style={{ "fontSize": "14px" }}>设置图片不通过原因：</samll>,
            "contentShow": "body",
            "body": body,
            "isKeyword": true,
            "submitAlert": submitAlert,
            "isButton": true
        };
        this.openAlert(config);
    };

    allNoPassBody() {
        const {param} = this.state.alert;
        return (
            <RadioGroup
                value={param.value}
                onChange={this.allNoPassChange.bind(this) }
                operate="radio"
            >
                <Radio key="a" value={1} style={{ "width": " 100%"}}
                       className={"textleft margin-0 mt-5"}>图片质量有待提升</Radio>
                <Radio key="b" value={2} style={{ "width": " 100%"}} className={"textleft margin-0 mt-5"}>请勿重复上传</Radio>
                <Radio key="c" value={3} style={{ "width": " 100%"}}
                       className={"textleft margin-0 mt-5"}>此类图片市场需求较小</Radio>
                <Radio key="d" value={4} style={{ "width": " 100%"}} className={"textleft margin-0 mt-5"}>缺乏文字说明，请与编辑部门联系</Radio>
                <Radio key="e" value={5} style={{ "width": " 100%"}}
                       className={"textleft margin-0 mt-5"}>图片精度未达到要求</Radio>
                <Radio key="f" value={6} style={{ "width": " 100%"}}
                       className={"textleft margin-0 mt-5"}>拍摄角度/场景单一</Radio>
                <Radio key="g" value={7} style={{ "width": " 100%"}}
                       className={"textleft margin-0 mt-5"}>请控制传图数量</Radio>
                <Radio key="h" value={8} style={{ "width": " 100%"}} className={"textleft margin-0 mt-5"}>题材敏感</Radio>
                <Radio key="i" value={9} style={{ "width": " 100%"}} className={"textleft margin-0 mt-5"}>版权问题</Radio>
                <Radio key="j" value={10} style={{ "width": " 100%"}} className={"textleft margin-0 mt-5"}>部分图片已拆分发布，其余图片审核未通过</Radio>
                <Radio key="k" value={11} style={{ "width": " 100%"}} className={"textleft margin-0 mt-5"}>
                    其他原因
                    {param.value === 11 ?
                        <Input
                            className={param.error ? "error" : ""}
                            style={{ width: 100, marginLeft: 10 }}
                            onChange={this.allNoPassInputChange.bind(this) }
                            onFocus={e => {
                                    this.state.alert.param.error = false;
                                    //console.log(this.state.alert.param);
                                    if (param.value === 11)
                                        this.allNoPassBody();
                                } }
                        /> : null}
                </Radio>
            </RadioGroup>
        );
    }

    allNoPassChange(e) {
        let {alert} = this.state;
        // unmountComponentAtNode(DOMElement, list);
        alert.show = true;
        alert.param.value = e.target.value;
        alert.body = this.allNoPassBody();
        this.setState({alert});
    };

    allNoPassInputChange(e) {
        this.state.alert.param.imageRejectReason = e.target.value;
    };

    setNoPassSubmit(type) {
        const {selectStatus, dataList, alert} = this.state;

        if (alert.param.value === 11 && !alert.param.imageRejectReason) {
            alert.param.error = true;
            alert.body = this.allNoPassBody();
            this.setState({alert});
        } else {
            const imageRejectReason = alert.param.imageRejectReason ? alert.param.imageRejectReason : alert.param.value;
            if (type == "select") {
                [...selectStatus].map((item, i) => {
                    if (item) {
                        dataList[i].qualityRank = 5;
                        dataList[i].imageRejectReason = imageRejectReason
                    }
                });
            }
            if (type == "next") {
                dataList.map((item, i) => {
                    dataList[i].imageRejectReason = imageRejectReason
                });
            }
            this.ThumbnailboxRender();
            this.closeAlert();
        }
    };

    favoriteModal(e) {
        let body = <div className="text-center"><Spin /></div>, title = "";
        if (!e) {
            if (this.getSelectId().length === 0) {
                this.message("请选择图片");
                return false;
            }
            title = "收藏多个图片："
        } else {
            title = "收藏图片：ID-" + e;
        }
        const {dispatch} = this.props;
        const userId = getStorage('userId');
        dispatch(getFavoriteList(userId)).then(result => {
            if (result.apiError) {
                this.message(result.apiError.errorMessage);
                return false
            }

            this.state.alert.param = {
                "target": e,
                "switch": false,
                "value_1": "",
                "value_2": ""
            };
            let favoite = result.apiResponse;
            let favoiteList = [];
            [...favoite].map((item, i) => {
                favoiteList.push(
                    <Option key={item.id}>{item.name}</Option>
                )
            });

            let body = <div className="favoriteModal">
                <span className="fl" id="favoiteLabel">添加至收藏夹</span>
                <Switch className="fr" defaultChecked={false} onChange={this.favoriteSwitch.bind(this) }/>
                <div className="slideBox mt-10">
                    <div className="slideBox-inner" id="favoiteBox">
                        <div className="slideBox-context">
                            <Select style={{ "width": "100%" }}
                                    onChange={value => { this.state.alert.param.value_1 = value } }>
                                {favoiteList}
                            </Select>
                        </div>
                        <div className="slideBox-context">
                            <Input placeholder="请输入新的收藏夹名"
                                   onChange={e => { this.state.alert.param.value_2 = e.target.value } }/>
                        </div>
                    </div>
                </div>
            </div>;

            let {alert} = this.state;
            alert.body = body;
            this.setState({alert});
        });

        const config = {
            "bsSize": "small",
            "title": <samll style={{ "fontSize": "14px" }}>{title}</samll>,
            "contentShow": "body",
            "body": body,
            "isKeyword": true,
            "submitAlert": this.favoriteSubmit.bind(this),
            "isButton": true
        };

        this.openAlert(config);

    };

    favoriteSwitch() {
        const {alert} = this.state;
        alert.param.switch = !alert.param.switch;
        this.setState({alert});

        const box = document.getElementById("favoiteBox");
        const label = document.getElementById("favoiteLabel");
        if (alert.param.switch) {
            box.className = "slideBox-inner next";
            label.innerHTML = "新建收藏夹并加入";
        }
        else {
            box.className = "slideBox-inner";
            label.innerHTML = "添加至收藏夹";
        }
    };

    favoriteSubmit() {
        const {alert} = this.state;
        let id = alert.param.value_1;
        let name = alert.param.value_2;
        if (alert.param.switch) {
            id = "";
            if (!name) {
                this.errorAlert("请输入新的收藏夹名");
                return false;
            } else {
                this.loadingAlert();
            }
        } else {
            name = "";
            if (!id) {
                this.errorAlert("请选择收藏夹");
                return false;
            } else {
                this.loadingAlert();
            }
        }
        const userId = getStorage('userId');
        const params = {
            "favorite": {
                "id": id,
                "name": name,
                "userId": userId
            },
            "resImageIds": alert.param.target ? [alert.param.target] : this.getSelectId()
        };
        const {dispatch} = this.props;
        dispatch(postFavoriteItem(params)).then(result => {
            if (result.apiError) {
                this.message(result.apiError.errorMessage);
                return false
            }
            this.refresh();
            this.closeAlert();
        });
    };

    gotop(params) {
        const {key, id} = params;
        const {dataList, selectStatus} = this.state;

        const item = dataList.splice(key, 1);
        this.state.dataList = item.concat(dataList);

        const select = selectStatus.splice(key, 1);
        this.state.selectStatus = select.concat(selectStatus);

        this.ThumbnailboxRender();
    };

    viewPicture(param, type) {
        const {dispatch} = this.props;
        const dataParams = type === "origin" ? {"resImageId": param.id, "type": "origin"} : {"resImageId": param.id};
        dispatch(viewEditPic(dataParams)).then((result) => {
            if (result.apiError) return false;
            const title = type === "origin" ? "查看原图" : "查看中图";
            this.openAlert({
                "bsSize": "lg",
                "title": <samll style={{ "fontSize": "14px" }}>{title}</samll>,
                "contentShow": "body",
                "body": <img width="100%" src={result.apiResponse}/>,
                "isKeyword": true,
                "isButton": false
            });
        });
    };

    //uploadPicture(param) {
    //    const groupId = this.props.params.ids;
    //    const resImageId = param.id;
    //    const token = window.localStorage.getItem('token');
    //    //console.log(param);
    //    const Dragger = Upload.Dragger;
    //    const props = {
    //        "name": "file",
    //        "showUploadList": false,
    //        "action": 'http://111.200.62.68:8005/image/viewMidTu?groupId='+groupId+'&resImageId='+resImageId +'&token='+token,
    //        "beforeUpload": (file) => {
    //            const isJPG = file.type === 'image/jpeg';
    //            if (!isJPG) {
    //                message.error('只能上传 JPG 文件哦！');
    //            }
    //            return isJPG;
    //        }
    //    };
    //    this.openAlert({
    //        "bsSize": "small",
    //        "title": <samll style={{ "fontSize": "14px" }}>替换图片:ID-{resImageId}</samll>,
    //        "body":  (<div style={{ "width": "100%", "height": "140px" }}>
    //            <Dragger {...props}>
    //                <Icon type="plus" />
    //            </Dragger>
    //        </div>),
    //        "isButton": false
    //    });
    //};

    allDownloadPicture() {
        const selectIds = this.publishData().selectIds;
        const len = selectIds.length;
        let body, submitAlert;
        if (len == 0) {
            body = "请选择图片。";
            submitAlert = this.closeAlert.bind(this);
        } else {
            body = "确定要下载这" + len + "个图片？";
            submitAlert = this.submitAllDownloadPicture.bind(this, selectIds);
        }
        this.openAlert({
            "bsSize": "small",
            "title": <samll style={{ "fontSize": "14px" }}>下载多个图片</samll>,
            "contentShow": "body",
            "body": <p className="textcenter">{body}</p>,
            "isKeyword": true,
            "submitAlert": submitAlert,
            "isButton": true
        });
    };

    submitAllDownloadPicture(selectIds) {
        this.downloadPicture(selectIds);
        this.closeAlert();
    };

    downloadPicture(resImageIds) {
        const groupId = this.props.params.ids;
        const token = window.localStorage.getItem('token');
        window.open("/api/zh" + editorUrl + '/image/downLoadYuantu?groupId=' + groupId + '&resImageIds=' + resImageIds.join(',') + '&token=' + token);
    };

    nextAction_1() {
        const {dataList, selectStatus} = this.state;
        let _selectedList = [], pass = false, flag = false;

        [...dataList].map((item, i) => {
            const captionTemp = item.caption.split('***_***');
            if (captionTemp.legnth == 2) {
                dataList[i].oldCaption = captionTemp[1] ? captionTemp[1] : "";
                dataList[i].newCaption = captionTemp[0] ? captionTemp[0] : "";
            } else {
                dataList[i].oldCaption = captionTemp[0] ? captionTemp[0] : "";
                dataList[i].newCaption = captionTemp[1] ? captionTemp[1] : "";
            }
            if (item.qualityRank !== 5) pass = true;
            if (!item.imageRejectReason) flag = true;
        });

        if (pass) {
            if (_.indexOf(selectStatus, true) < 0) {
                [...dataList].map((item, i) => {
                    item.key = i;
                    if (item.qualityRank !== 5) _selectedList.push(item);
                });
            } else {
                [...selectStatus].map((item, i) => {
                    if (item && dataList[i].qualityRank !== 5) _selectedList.push(dataList[i]);
                });
            }

            this.state.selectedList = _selectedList;
            // //console.log(_selectedList,"_selectedList");

            this.RenderStep2_3();
            //this.classifyRender();
            this.RenderStep2_1();
        } else {
            if (flag) {
                message("请设置全部不通过原因", 2);
            } else {
                let {dispatch} = this.props;
                const params = this.publishData();
                dispatch(allNoPass(params)).then(result => {
                    if (result.apiError) return false;
                    window.close();
                });
                return true;
            }
        }

    };

    //step_2

    RenderStep_2() {
        return (
            <div>
                <Affix className="row operate">
                    <div className="col-xs-12 pr-200">
                        <button className="btn btn-sm btn-info" onClick={this.save.bind(this) }>
                            <i className="ace-icon fa fa-bug"></i>保存
                        </button>
                    </div>
                </Affix>

                <div className="row">
                    <div className="space-8"></div>
                </div>

                <div className="row">
                    <div className="col-xs-6">
                        <Panel header={"组照编辑（ID："+this.props.params.ids+"）"}>
                            <div id="step2_1"></div>
                        </Panel>
                    </div>
                    <div className="col-xs-6">
                        <Panel header="批量编辑">
                            <Step2_2
                                dispatch={this.props.dispatch}
                                addKeywordDoc={this.addKeywordDoc.bind(this) }
                                handOnChange={this.setSelectedList.bind(this) }/>
                        </Panel>
                    </div>
                </div>

                <Panel header="图片编辑">
                    <div id="textEdit_container"></div>
                </Panel>
            </div>
        );
    };

    RenderStep2_1() {
        const {groupData, classifyValue} = this.state;
        const container = document.getElementById("step2_1");
        ReactDOM.render(
            <Step2_1
                operate="push"
                groupData={groupData}
                handOnChange={value =>{this.state.groupData = value}}
                dispatch={this.props.dispatch}
                addKeywordDoc={this.addKeywordDoc.bind(this)}/>
            , container);
    };

    RenderStep2_3() {
        const {selectedList} = this.state;
        const container = document.getElementById("textEdit_container");

        ReactDOM.render(
            <ThumbnailBox
                types="editGroup"
                operate="push"
                lists={selectedList}
                onThumbnail={value =>{this.state.dataList = value}}
                dispatch={this.props.dispatch}
                addKeywordDoc={this.addKeywordDoc.bind(this)}
            />, container
        );

        this.findErrorTag();
    };

    findErrorTag() {
        var themTag = document.querySelectorAll(".themTag");
        for (let i = 0; i < themTag.length; i++) {
            let tags = themTag[i].querySelectorAll(".ant-select-selection__choice");
            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                let title = tag.title || '';

                //console.log(title);

                if (title.indexOf("✲") > 0) {//没检测
                    tag.className += " red";
                }
                if (title.indexOf("✻") > 0) {//多义词
                    tag.className += " green";
                }
                if (title.indexOf("✳") > 0) {//新词
                    tag.className += " gray";
                }

                // let tag_context = tag.querySelector(".ant-select-selection__choice__content")
                // tag_context.addEventListener("click", (e)=>{//console.log(e.target)});
            }
        }
    };

    //添加关键词字典
    addKeywordDoc({key, label, id, kind}) {
        if (id && label) this.state.keywordsDocName[id] = label;
        if (id && kind) this.state.keywordsDocKind[id] = kind;
    };

    setStep2_1({key, value, label, id}) {
        switch (key) {
            case "classify":
                this.state.classifyValue = value;
                break;
            case "keywords":
                this.setKeyword({value, label, id});
                break;
            case "title":
                this.state.groupData.title = value;
                break;
            case "caption":
                this.state.groupData.caption = value;
                break;
            default:
                //console.log(param);
                break;
        }
    };

    setKeyword({value, label, id}) {
        const {keywords_tag} = this.state.groupData;
        //console.error(this, value, label, id);
        if (value) {
            this.state.groupData.keywords_tag = value;
        }
        else if (label || id) {
            this.state.groupData.keywords_tag.push({label: label, id});
            this.state.keywordsdoc_name.id = label;
        }
    };

    //批量设置
    setSelectedList({key, value, position}) {
        const {selectedList, copySelectedList} = this.state;
        //console.log('1selectedList::',selectedList[0].caption,'copySelectedList::',copySelectedList[0].caption);
        [...selectedList].map((item, i) => {
            if (position === "before") {
                if (_.isString(value)) {
                    selectedList[i][key] = value + selectedList[i][key];
                }
                if (_.isArray(value)) {
                    selectedList[i][key] = selectedList[i][key].concat(value);
                }
            }
            else if (position === "after") {
                if (_.isString(value)) {
                    selectedList[i][key] = selectedList[i][key] + value;
                }
                if (_.isArray(value)) {
                    selectedList[i][key] = value.concat(selectedList[i][key]);
                }
            }
            else if (position === "cancel") {
                selectedList[i].createdTime = "";

                selectedList[i].country = "";
                selectedList[i].province = "";
                selectedList[i].city = "";

                selectedList[i].caption = "";
                selectedList[i].newCaption = "";

                selectedList[i].theme_tag = "";
                selectedList[i].concept_tag = "";
                selectedList[i].format_tag = "";
                selectedList[i].people_tag = "";
                selectedList[i].localtion_tag = "";
                selectedList[i].keywords = "";
            }
            else if (position === "reset") {
                selectedList[i].createdTime = copySelectedList[i].createdTime;

                selectedList[i].country = copySelectedList[i].country;
                selectedList[i].province = copySelectedList[i].province;
                selectedList[i].city = copySelectedList[i].city;

                selectedList[i].oldCaption = copySelectedList[i].oldCaption;
                selectedList[i].newCaption = copySelectedList[i].newCaption;

                selectedList[i].theme_tag = copySelectedList[i].theme_tag;
                selectedList[i].concept_tag = copySelectedList[i].concept_tag;
                selectedList[i].format_tag = copySelectedList[i].format_tag;
                selectedList[i].people_tag = copySelectedList[i].people_tag;
                selectedList[i].localtion_tag = copySelectedList[i].localtion_tag;
                selectedList[i].keywords = copySelectedList[i].keywords;
            }
            else {
                selectedList[i][key] = value;
            }
        });
        this.state.selectedList = selectedList;
        this.RenderStep2_3()
    };

    //step_3
    RenderStep_3() {
        return (
            <PushToStep3
                dispatch={this.props.dispatch}
                handleOnPublish={this.setPublishData.bind(this) }/>
        )
    };

    setPublishData(data) {
        this.state.publishData = data;
        //console.log(data)
    };

    publishData() {
        const {dataList, groupData, publishData, routeParams, selectedList, selectStatus} = this.state;

        [...selectedList].map((item, i) => {
            if (item.newCaption) {
                item.caption = item.newCaption + '***_***' + item.oldCaption;
            }
            dataList[item.key] = item;
        });

        return {
            "id": routeParams.ids,
            "group": groupData,
            "resourcs": dataList,
            "selectIds": this.getSelectId(),
            "topicId": publishData.join(',')
        };
    };

    publish() {
        const {dispatch} = this.props;
        const {selectStatus, publishData} = this.state;
        if (publishData.length == 0) {
            message.error("请选择推送方", 3);
            return false;
        }
        if (_.indexOf(selectStatus, true) < 0) {
            this.selectAll();
        }
        const params = this.publishData();
        //console.log('publish', params);
        dispatch(publishPushto(params)).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }
            message.success("推送成功！3秒后自动关闭窗口。");
            setTimeout(() => {
                window.close();
            }, 3000);
        });
    };

    save() {
        const {dispatch} = this.props;
        const params = this.publishData();

        dispatch(editSavePostData(params)).then(result => {
            if (result.apiError) return false;
        });
    };
}
