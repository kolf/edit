import React, { Component } from "react"
import ReactDOM from "react-dom";
import { Link } from "react-router";
import Sortable from "sortablejs";
import { getStorage } from "app/api/auth_token";

import { editorUrl } from "app/api/api_config"
import "./css/thumbnail.css";

import { Grid, Row, Col, Tooltip, OverlayTrigger, Well } from "react-bootstrap/lib";

import TagAreaPanel from "app/components/tag/tagArea";
import cs from 'classnames';

import BackTop from 'antd/lib/back-top';
import Form from "antd/lib/form";
import Icon from "antd/lib/icon";

import Spin from "antd/lib/spin";
import Card from "antd/lib/card";
import Button from "antd/lib/button";
import Radio from "antd/lib/radio";
import Input from "antd/lib/input";
import DatePicker from "antd/lib/date-picker";
import Cascader from "antd/lib/cascader";
import Tag from "antd/lib/tag";
import Modal from "antd/lib/modal";
import Upload from "antd/lib/upload";
import message from "antd/lib/message";
import Popover from "antd/lib/popover";
import Table from "antd/lib/table";
import Select from "antd/lib/select";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import LazyLoad from 'react-lazyload';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

import storage from "app/utils/localStorage";
import { isElite, isEn, getDevice, queryUrl } from "app/utils/utils";

import {
  findKeyword,
  addKeyword,
  modifyKeyword,
  getKeywordById,
  sortGroupImage,
  viewEditPic,
} from "app/action_creators/edit_action_creator";

import {
  viewImageExif as getImageExif,
  viewImageDetail as getImageDetail
} from "app/action_creators/create_action_creator";

// import {
//   viewImageExif as getImageExif,
//   viewImageDetail as getImageDetail
// } from "app/action_creators/create_action_creator";

import { favoriteQuery, favoriteSave } from "app/action_creators/person_action_creator";
// favoriteQuery({userId: filterParams.userId}
//   dispatch(favoriteSave({
//     "userId": filterParams.userId,
//     "type": "photos",     // group photos
//     "ids": ids.join(','), // groupIds photoIds
//     "status": status,     // 已有 - 新的
//     "id": favId,          // 已有 收藏夹 id
//     "name": favName       // 新的 收藏夹 name
// }))

//以中英文逗号分割关键词字符串
const tagSplitReg = /,|，/;

const priceObj = {
  3: '时效限价'
};

import EditStepOneBox from "./EditStepOneBox";
import EditStepTwoBox from "./EditStepTwoBox";
import TagAuditBox from "./TagAuditBox";

export default class ThumbnailBox extends Component {

  constructor(props) {
    super(props);
    //console.log('----',props);
    this.state = {
      "doing": "doing",
      "animate": false,
      "types": props.types || "group",
      "operate": props.operate || "edit",
      "groupId": "",
      "favoriteFolder": null,     // 收藏夹
      "listData": null,
      "selectStatus": [],
      "listSelectData": {      // 选择列表数据
        "ids": [],           // id []
        "keys": [],          // key []
        "list": [],          // 选择数据 item []
        "listInit": []       // 选择原始数据 item []
      },
      "keywordsDic": {},   // // 关键词字典
      "regionOptions": [],
      "token": getStorage('token'),
      "userId": getStorage('userId'), // userId 用户ID
      "editConfig": [
        {
          "title": "置顶",
          "operate": "setTop",
          "icon": "arrow-up"
        }, {
          "title": "左旋转",
          "operate": "setLeftRotation",
          "icon": "rotate-left"
        }, {
          "title": "右旋转",
          "operate": "setRightRotation",
          "icon": "rotate-right"
        }, {
          "title": "收藏",
          "operate": "addToFavorite",
          "icon": "star"
        }, {
          "title": "下载",
          "operate": "download",
          "icon": "cloud-download"
        },
        {
          "title": "替换",
          "operate": "upload",
          "icon": "cloud-upload"
        }, {
          "title": "查看原图",
          "operate": "origin",
          "icon": "picture-o"
        }, {
          "title": "查看中图",
          "operate": "middle",
          "icon": "file-image-o"
        }, {
          "title": "时效限价",
          "operate": "selectPrice",
          "icon": "dollar"
        }, {
          "title": "下线",
          "operate": "offlineMark",
          "icon": "arrow-down"
        }
      ],
      "creativeConfig": [
        {
          "title": "左旋转",
          "operate": "setLeftRotation",
          "icon": "rotate-left"
        }, {
          "title": "右旋转",
          "operate": "setRightRotation",
          "icon": "rotate-right"
        }, {
          "title": "收藏",
          "operate": "addToFavorite",
          "icon": "star"
        }, {
          "title": "查看原图",
          "operate": "origin",
          "icon": "picture-o"
        }, {
          "title": "查看中图",
          "operate": "middle",
          "icon": "file-image-o"
        }
      ],
      "editGroup": {},
      "viewTimer": null,
      "modal": {
        "visible": false,
        "maskClosable": false,
        "confirmLoading": false,
        "title": "",
        "width": "520",
        "onOk": this.closeModal.bind(this),
        "onCancel": this.closeModal.bind(this),
        "footer": false,
        "showContent": "body",
        "body": null,
        "noFooter": false,
        "oktext": "",
        "submitMsg": "",
        "params": {}
      },
      "hasSelect": false,//tag OnSelect
      "maskLoading": true,
      "tagClickTimer": null,
      'lang': isEn() ? 'enname' : 'cnname',
      rowIndex: 0,
      rowSize: 6,
      listTop: 150,
      rowHeight: 420
    };

    this.viewImageExitInfoTimer = null;

    this.handelScroll = this.handelScroll.bind(this);

    // kind 0 主题 1 概念 2 规格 3 人物 4 地点 其他放到主题里
    this.keywordType = ['themeTag', 'conceptTag', 'formatTag', 'peopleTag', 'locationTag'];

    //用于输入一段关键字后自动匹配
    this.autoMatchKeywordsTimeout = [];

    this.imageRejectReason = ["图片质量欠佳", "图片精度较低", "重复图片", "题材敏感", "图片市场需求小", "版权问题", "拍摄角度场景单一、无法构成图片故事"];

    this.handleOnClick = this.handleOnClick.bind(this);

    this.loop = 1;

    this.defaultImage = require('app/assets/default.jpg');

    this.keyDownListKey = null;
  };

  setInitData() {
    //"animate":  props.animate?props.animate:false,
    //    "types":    props.types?props.types:"group",
    //    "operate":  props.operate?props.operate:"edit",
    //    "groupId":  props.groupId?props.groupId:"",
    //    "listData": props.lists?props.lists:null,
    //    "selectStatus": props.lists?_.fill(new Array(props.lists.length), false):[],
  };

  //static contextTypes = {
  //    "router": React.PropTypes.object.isRequired
  //};

  componentWillMount() {
    this.handelResize()
    // //console.log(this.props)
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handelScroll, false);
    window.addEventListener('resize', this.handelResize, false);

    // 列表展示方式切换 首次加载组件 state未赋值导致的问题
    // let {listData} = this.state;
    // listData = this.props.lists;
    // this.setState({listData});

    // 列表展示方式切换 首次加载组件 state未赋值导致的问题
    this.setState({ listData: this.props.lists, maskLoading: false });

    document.body.addEventListener('keydown', (e) => {
      if (e.keyCode === 16) {
        const { selectStatus, listSelectData: { keys } } = this.state;
        if (keys && keys.length > 0) {
          this.keyDownListKey = {
            firstKey: keys[0],
            lastKey: keys[keys.length - 1]
          }
        } else {
          this.keyDownListKey = {
            firstKey: -1,
            lastKey: keys[keys.length - 1]
          }
        }
      }
    }, false);

    document.body.addEventListener('keyup', (e) => {
      this.keyDownListKey = null;
    }, false);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handelScroll, false)
    window.removeEventListener('resize', this.handelResize, false)
  }

  handelResize = (e) => {
    const rowsMap = {
      xs: 2,
      sm: 3,
      md: 4,
      xlg: 6
    };

    this.setState({
      rowSize: rowsMap[getDevice()]
    })
  };

  handelScroll = (e) => {
    const { listTop, rowHeight, listData, rowSize } = this.state;
    if (listData.length <= rowSize * 3) {
      return
    }

    const scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    const rowIndex = parseInt((scrollTop - listTop) / rowHeight);
    this.setState({ rowIndex })
  };

  componentWillReceiveProps(nextProps) {
    const { doing, maskLoading, types, operate, listData, selectStatus, keywordsDic, regionOptions, showCaption } = this.state;

    //console.log(nextProps.lists);

    if (!_.isEqual(doing, nextProps.doing)) this.state.doing = nextProps.doing;
    if (!_.isEqual(maskLoading, nextProps.maskLoading)) this.setState({ "maskLoading": nextProps.maskLoading });
    if (!_.isEqual(types, nextProps.types)) this.setState({ "types": nextProps.types });
    if (!_.isEqual(operate, nextProps.operate)) this.setState({ "operate": nextProps.operate });
    if (nextProps.lists && nextProps.lists.length >= 0) this.setState({ listData: nextProps.lists });
    if (!_.isEqual(_.keys(keywordsDic), _.keys(nextProps.keywordsDic))) this.setState({ keywordsDic: nextProps.keywordsDic });

    // 对选中项的处理
    switch (nextProps.doing) {
      case "selectAll": // 全选
        // this.state.selectStatus = nextProps.selectStatus;
        this.setSelectStatus({ type: 'all' });
        break;
      case "selectCancel": // 取消
        this.setSelectStatus({ type: 'cancel' });
        break;
      case "selectInvert": // 反选
        this.setSelectStatus({ type: 'invert' });
        break;
      case "selectAppointed": // 指定选择项 必须收集选中结果
        this.setSelectStatus({ type: 'selectAppointed', nextPropsSelectStatus: nextProps.selectStatus });
        break;
      case "refresh": // 刷新 传递有selectStatus用父组件的selectStatus 否则为空
        this.state.selectStatus = nextProps.selectStatus || [];
        break;
      default:
      // this.state.selectStatus = nextProps.selectStatus || [];
      // //console.log(nextProps.doing);
    }

  };

  setSelectStatus({ type, key, value, nextPropsSelectStatus }) { // 设置选择状并获得选择数据
    let { listData, selectStatus } = this.state;
    if (!this.props.updateData) return;

    if (!listData) return false;
    if (type == 'all') {
      selectStatus = _.fill(new Array(listData.length), true);
    }
    if (type == 'cancel') {
      selectStatus = _.fill(new Array(listData.length), false);
    }
    if (type == 'invert') {
      if (selectStatus.length == 0) {
        selectStatus = _.fill(new Array(listData.length), true);
      } else {
        // selectStatus = [...selectStatus].map((val) => { return !val });
        listData.forEach((item, i) => {
          selectStatus[i] = !selectStatus[i]
        })
      }
    }
    if (type == 'selectAppointed') selectStatus = nextPropsSelectStatus;

    if (_.isNumber(key)) {
      if (_.isBoolean(value)) {
        selectStatus[key] = value;
      } else {
        selectStatus[key] = !selectStatus[key];
      }
    }

    if (this.keyDownListKey) {
      const { firstKey, lastKey } = this.keyDownListKey;
      if (firstKey === -1) {
        this.keyDownListKey = {
          firstKey: key,
          lastKey: key
        };
        selectStatus[key] = !selectStatus[key];
      } else {
        if (key > lastKey) {
          let i = lastKey;
          for (i; i < key + 1; i++) {
            selectStatus[i] = true
          }

        } else if (key < lastKey) {
          let i = key;
          for (i; i < lastKey; i++) {
            selectStatus[i] = true
          }
        }
      }
    }

    listData.forEach((item, i) => {
      if (item.onlineState == 3 && item.offlineReason && (item.offlineReason >= 9998 || (item.offlineReason + '').indexOf('撤图') != -1)) {
        selectStatus[i] = false
      }
    });

    this.getSelectList({ listData, selectStatus }); // 获得选择数据
    //this.props.updateData({"doing":"setSelectStatus"});
  };

  getSelectList({ listData, selectStatus }) { // 获得选择数据
    let listSelectData = {
      "ids": [],
      "keys": [],
      "list": [],
      "listInit": []
    };
    [...listData].forEach((item, i) => {
      if (selectStatus[i]) {
        listSelectData.ids.push(item.id);
        listSelectData.keys.push(item.key);
        listSelectData.list.push(item);
        listSelectData.listInit.push(item);
      }
    });
    this.setState({ selectStatus, listSelectData, "doing": "getSelectList" });
    if (this.props.updateData) this.props.updateData({ selectStatus, listSelectData, "doing": "getSelectList" });
  };

  // 根据id和key返回 list item
  getListItem({ id, key }) {
    const { listData } = this.state;
    if (listData && listData[key] && listData[key].id == id) return listData[key];
    else return false;
  };

  groupRender() {
    const { projectName } = this.props;
    let { operate, listData, selectStatus, types } = this.state;

    return (
      [...listData].map((item, i) => {

        const {
          id, groupId, oss176, ossYuantu, uploadTime, resCount, onlineCount, title,
          groupState, onlineState, offlineReason, topicIds, rejectReason
        } = item;

        const edit = false;

        let op_config = [];

        //types： group 编审 push 推送
        if (types == "group") {
          op_config = [
            { "text": "编审", "icon": "edit", "operate": "edit", "isOp": true },
            {},
            { "text": "推送", "icon": "menu-unfold", "operate": "push", "isOp": false },
            { "text": "加入专题", "icon": "select", "operate": "addToTopic", "isOp": true },
            {},
            { "text": "前台链接", "icon": "link", "operate": "accessLink", "isOp": true },
            { "text": "推荐", "icon": "like-o", "operate": "share", "isOp": true },
            { "text": "编审记录", "icon": "file-text", "operate": "viewEditHistory", "isOp": true },
            { "text": "批注记录", "icon": "file", "operate": "viewPostilHistory", "isOp": true },
            { "text": "更新上线时间", "icon": "clock-circle-o", "operate": "refreshImage", "isOp": true },
            // { "text": "编辑组照", "icon": "exception", "operate": "editGroup", "isOp": true}
          ];

          // <Icon type="exception" />
          // providerType 1 机构 2 个人 groupState '1 未编审、2待编审、3二审,4已编审', onlineState '1已上线2未上线3撤图4冻结 ',

          if (groupState == "1") { // 未编审
            op_config[1] = { "text": "添加到待编审", "icon": "addfile", "operate": "addToNoEdit", "isOp": true };
          } else if (groupState == "2") {
            op_config[1] = { "text": "添加到未编审", "icon": "file-unknown", "operate": "addToTheEdit", "isOp": true };
          }

          if (onlineState == "1") { // 已上线
            op_config[4] = { "text": "下线", "icon": "arrow-down", "operate": "offline", "isOp": true };
          } else {
            op_config[4] = { "text": "上线", "icon": "arrow-up", "operate": "online", "isOp": true };
          }

          if (topicIds && topicIds.length && isElite(_.pluck(topicIds, 'id'))) { // 每日精选不可上下线、添加到待编审
            op_config[1].isOp = false;
            op_config[3].isOp = false;
            op_config[4].isOp = false;
          }

        }

        let tipText = '';

        if (onlineState == 1) {
          op_config[2].isOp = true;
        }

        if (projectName && projectName == 'en') {
          op_config[1].hide = true;
        }
        // if(storage.get('projectName') == 'en'){ //导航得优化
        //     op_config[1].hide = true;
        // }
        let onlineStateClass, onlineStateText;

        if (onlineState == 1) {
          onlineStateClass = "text-success";
          onlineStateText = "已上线";
        } else if (onlineState == 3) {
          onlineStateClass = "text-danger";
          onlineStateText = "已下线";
        } else {
          onlineStateText = "未上线";
        }

        const isRevoke = (onlineState == 3 && offlineReason && offlineReason.indexOf('撤图') != -1)
        if (isRevoke) {
          const disableds = ['offline', 'online'];
          op_config.forEach(item => {
            if (disableds.indexOf(item.operate) != -1) {
              item.isOp = false
            }
          })
        }

        return (
          <div className="col-xlg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            < Card className={
              cs('storageCard', {
                'img-mark': isRevoke,
                'selected': selectStatus[i]
              })
            } >
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "viewGroup", "key": i, id, groupId })}>
                <LazyLoad height={200} offset={100}>
                  <img alt="找不到图片" src={(ossYuantu && oss176) ? oss176 : this.defaultImage}
                    onError={this.onLoadImgError.bind(this)} />
                </LazyLoad>
              </div>
              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                <div className="row mb-10">
                  <div className="pull-left">
                    <span className="text-nowrap">
                      上线数: {onlineCount}
                      <samp className="samp-split">|</samp>
                      总数: {resCount}
                    </span>
                  </div>
                  <div className="pull-right font-weight-bold">
                    <span className={onlineStateClass} title={onlineStateText}>{i + 1}</span>
                  </div>
                  {/*<a onClick={this.handleOnClick.bind(this,{ "operate": "viewProvider", "key":i, "id": providerId, "type": "edit" }) }>{providerName}</a>*/}
                </div>
                <div className="row mb-5">{uploadTime || "0000-00-00 00:00:00"}</div>
                <div className="row mb-5">组照ID：{groupId}</div>
                <div className="row mb-10">
                  <p title={title} style={{ "height": "40px", "overflow": "hidden", 'word-break': 'break-all' }}>
                    {title}
                  </p>
                </div>
                <div className="row mb-5 mt-10">
                  {!edit && [...op_config].map((item, _i) => {
                    return !item.operate ? null :
                      <Button title={item.text} disabled={!item.isOp} shape="circle" icon={item.icon} className={"mt-5"}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": item.operate,
                          "key": i,
                          id,
                          groupId
                        })} />
                  })
                  }
                  {edit && <span className="status">{edit + "正在编审中..."}</span>}
                </div>

                {onlineState == 3 && <div className="reason-tip" title={(offlineReason || '无')}>
                  <Tag color="#f50" title={'下线原因：' + (offlineReason || '无')}>{_.trunc((offlineReason || ''), 10)}</Tag>
                </div>}

                {(onlineState == 2 && groupState == 4) && <div className="reason-tip" title={(rejectReason || '无')}>
                  <Tag color="#f50" title={'不通过原因：' + (rejectReason || '无')}>{_.trunc((rejectReason || ''), 10)}</Tag>
                </div>}


              </div>
            </Card>
          </div>
        );
      })
    );
  };

  photosRender() {
    const { reasonList, projectName } = this.props;
    const { operate, listData, selectStatus, types } = this.state; // { "text": "编审", "icon": "edit", "operate": "edit", "isOp": true }, // { "text": "添加到待编审", "icon": "addfile",

    // { "text": "编审", "icon": "edit", "operate": "edit", "isOp": true },
    // { "text": "添加到待编审", "icon": "addfile", "operate": "addToNoEdit", "isOp": false },
    // { "text": "推送", "icon": "menu-unfold", "operate": "push", "isOp": false },
    // { "text": "加入专题", "icon": "select", "operate": "addToTopic", "isOp": true },
    // {},
    // { "text": "前台链接", "icon": "link", "operate": "accessLink", "isOp": true },
    // { "text": "推荐", "icon": "like-o", "operate": "share", "isOp": true },
    // { "text": "编审记录", "icon": "file-text", "operate": "viewEditHistory", "isOp": true },
    // { "text": "批注记录", "icon": "file", "operate": "viewPostilHistory", "isOp": true },
    // { "text": "更新上线时间", "icon": "clock-circle-o", "operate": "refreshImage", "isOp": true }

    let op_config = [
      { "text": "编审", "icon": "edit", "operate": "edit", "isOp": true, "isShow": true },
      { "text": "删除", "icon": "trash-o", "operate": "delete", "isOp": false, "isShow": false },
      { "text": "收藏", "icon": "star-o", "operate": "addToFavorite", "isOp": true, "isShow": true },
      {},
      { "text": "推荐", "icon": "like-o", "operate": "share", "isOp": true, "isShow": true },
      { "text": "前台链接", "icon": "link", "operate": "accessLink", "isOp": true, isShow: true },
      { "text": "编审记录", "icon": "file-text", "operate": "viewEditHistory", "isOp": true, isShow: true },
      { "text": "下载", "icon": "cloud-download", "operate": "downLoadYuantu", "isOp": true, isShow: true }
    ];

    if (operate == "favorites") {
      op_config[2].isOp = true;
      op_config[2].isShow = true;
    }

    if (projectName == 'en') {
      op_config[2].isShow = false;
    }

    return (
      [...listData].map((item, i) => {
        const {
          id, resId, oss176, ossYuantu, caption, editGroupIds, uploadTime, creditLine,
          onlineState, imageState, offlineReason, offlineMark, imageDetailInfo, providerName, providerId, groupIds, imageRejectReason, onlineType, qualityRank
        } = item;

        const edit = false;

        // 根据图片状态显示图片不通过原因或者下线原因
        let onlineStateTag, reasonText = "", onlineStateClass = "", onlineStateText = "";
        if (imageState === 3 && onlineState === 2) {
          // onlineStateTag = "不通过原因";
          // if(reasonList){
          //      var rejectObj = reasonList.find(item => item.value==imageRejectReason);
          // }
          // reasonText = rejectObj ? rejectObj.label : imageRejectReason;
          onlineStateClass = "text-danger";
          onlineStateText = "不通过";

          if (imageRejectReason) onlineStateText += '-' + imageRejectReason
        }

        if (onlineState == 1) {
          onlineStateClass = "text-success";
          onlineStateText = "已上线";
        } else if (onlineState == 3) {
          onlineStateClass = "text-danger";
          onlineStateText = "已下线";
          if (offlineReason) onlineStateText += '-' + offlineReason;
        } else if (onlineState == 2 && qualityRank != 5) {
          onlineStateText = "未上线";
        }

        const groupIdsMenu = [];
        groupIds && groupIds.length >= 2 && groupIds.map(item => {
          const menuItem = (
            <Menu.Item><a href={"/zh/doing/group/edit/" + item.id + '?groupId=' + (item.groupid || item.groupId)} target="_blank">{(item.groupid || item.groupId)}</a></Menu.Item>);
          groupIdsMenu.push(menuItem);
        });


        if (onlineState === 1) { // 已上线
          op_config[3] = { "text": "下线", "icon": "arrow-down", "operate": "offline", "isOp": true, isShow: true };
        } else {
          op_config[3] = { "text": "上线", "icon": "arrow-up", "operate": "online", "isOp": true, isShow: true };
        }
        // imageState '1待编审 2已编审/创意类关键词审核 3 不通过 4 图片审核通过' onlineState '1已上线2未上线3撤图4冻结
        // //console.log(offlineReason);
        const isRevoke = (onlineState === 3 && offlineReason && offlineReason.indexOf('撤图') !== -1)
        if (isRevoke) {
          const disableds = ['offline', 'online'];
          op_config.forEach(item => {
            if (disableds.indexOf(item.operate) !== -1) {
              item.isOp = false
            }
          })
        }

        return (
          <div className="col-xlg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={cs('editCard', { 'img-mark': isRevoke, 'selected': selectStatus[i] })}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "origin", "key": i, id, resId })}
                data-key={i}>
                <LazyLoad height={200} offset={100}>
                  <img alt="找不到图片" src={(ossYuantu && oss176) ? oss176 : this.defaultImage}
                    onError={this.onLoadImgError.bind(this)} />
                </LazyLoad>
              </div>
              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                <div className="row mb-10">
                  <div className="pull-left">
                    {uploadTime || "0000-00-00 00:00:00"}
                  </div>
                  <div className="pull-right font-weight-bold">
                    <span className={onlineStateClass} title={onlineStateText}>{i + 1}</span>
                  </div>
                </div>
                <div className="row mb-5">单张ID：<a onClick={this.imageClickHandle.bind(this, {
                  "resImageId": id,
                  "key": i,
                  "viewWhat": "imageDetailInfo"
                })}>{resId}</a></div>
                <div className="row mb-5">组照ID：<Dropdown overlay={<Menu>{groupIdsMenu}</Menu>}>
                  <span>{groupIds && groupIds[0] && ((groupIds[0].groupId || groupIds[0].groupid) ?
                    <a href={"/zh/doing/group/edit/" + groupIds[0].id + '?groupId=' + groupIds[0].groupId + '&resId=' + groupIds[0].resImageId}
                      target="_blank">{(groupIds[0].groupId || groupIds[0].groupid)}</a> : '无')} {groupIds && groupIds.length >= 2 &&
                        <Icon type="down" style={{ borderStyle: 'solid', borderWidth: '1px', background: '#646464', color: '#fff' }} />}</span>
                </Dropdown></div>
                <div className="row mb-5">
                  <p title={caption} style={{ "height": "54px", "overflow": "hidden" }}>
                    {_.trunc(caption, 90)}
                  </p>
                </div>
                <div className="row mb-10">
                  <div className="col-xs-6 sis"><a title={providerName} onClick={this.handleOnClick.bind(this, {
                    "operate": "viewProvider",
                    "key": i,
                    "id": providerId,
                    "type": 'edit'
                  })}>{providerName || "---"}</a></div>

                  <div className="col-xs-6 sis text-right" title={creditLine}>{creditLine || "---"}</div>
                </div>
                {types != "downloadPhotos" &&
                  <div>
                    <hr />
                    <div className="row mb-5 mt-10">
                      <div className="col-xs-12">
                        {!edit && [...op_config].map((item, _i) => {
                          return item.isShow ?
                            <Button disabled={!item.isOp} title={item.text} shape="circle" icon={item.icon}
                              className={"mt-5"} onClick={this.handleOnClick.bind(this, {
                                "operate": item.operate,
                                "key": i,
                                "id": id,
                                resId,
                                groupIds
                              })} /> : null
                        })}
                        {edit && <span className="status">{edit + "正在编审中..."}</span>}
                      </div>
                    </div>
                    {onlineState == 3 && <div className="reason-tip" title={(offlineReason || '')}>
                      <Tag color="#f50" title={'下线原因：' + (offlineReason || '')}>{_.trunc((offlineReason || ''), 10)}</Tag>
                    </div>}

                    {(imageState == 3 && onlineState == 2) && <div className="reason-tip" title={(imageRejectReason || '')}>
                      <Tag color="#f50" title={'不通过原因：' + (imageRejectReason || '')}>{_.trunc((imageRejectReason || ''), 10)}</Tag>
                    </div>}
                    {/* {onlineStateClass === 'text-danger' && <div className="reason-tip" title={(onlineStateText || '')}>
                      <Tag color="#f50" title={onlineStateText}>{_.trunc((onlineStateText || ''), 10)}</Tag>
                    </div>} */}

                  </div>
                }
              </div>
            </Card>
          </div>
        );
      })
    );
  };

  // 编辑图片-图片编审
  editStepOneRender() {
    const { operate, listData, selectStatus, token, lang, rowIndex, rowSize, rowHeight } = this.state;
    const { groupId, reasonList, keywordsDic, showCaption } = this.props;
    const _this = this;

    return (
      <div style={{
        paddingTop: rowIndex * rowHeight,
        height: Math.ceil(listData.length / rowSize) * rowHeight,
        overflow: 'hidden'
      }}>{listData.filter((item, index) => {
        item.i = index
        const startIndex = rowIndex * rowSize
        return (index >= startIndex) && (index < startIndex + rowSize * 4)
      }).map((item) => {
        const {
          minPrice,
          i,
          key, id, resId, creditLine, rotate, oss176, ossYuantu, providerName,
          onlineState, imageState, qualityRank, imageRejectReason, hide,
          price, category, pushedOrganizations, offlineReason, onlineType,
          collectionName, saveTemp, memo, providerCaption, sortNumber, providerAgentType
        } = item;

        const uploadProps = {
          "name": "file",
          "showUploadList": false,
          "action": '/api/zh' + editorUrl + '/image/replace?groupId=' + groupId + '&resImageId=' + id + '&token=' + token,
          "accept": "image/png,image/jpeg,image/jpg",
          "onChange": function (info) {
            if (info.file.status !== 'uploading') {
              //console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
              message.success(`${info.file.name} 上传成功。`);
              listData[i].oss176 = info.file.response.data.oss176;
              _this.setState({ listData });
              // this.props.refresh();
            } else if (info.file.status === 'error') {
              message.error(`${info.file.name} 上传失败。`);
            }
          }.bind(i),
          "beforeUpload": (file) => {
            const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
            if (!isJPG) {
              message.error('只能上传 JPG/PNG 文件！');
            }
            return isJPG;
          }
        };

        return (
          <EditStepOneBox
            rowHeight={rowHeight}
            key={id.toString()}
            i={item.i}
            sortNumber={sortNumber}
            id={id}
            lang={lang}
            operate={operate}
            pushedOrganizations={_.uniq(pushedOrganizations, 'type_name') || []}
            showCaption={showCaption}
            selectStatus={selectStatus[i]}
            resId={resId}
            rotate={rotate}
            oss176={oss176}
            ossYuantu={ossYuantu}
            price={price}
            minPrice={minPrice}
            qualityRank={qualityRank}
            offlineReason={offlineReason}
            onlineState={onlineState}
            uploadProps={uploadProps}
            providerName={providerName}
            collectionName={collectionName}
            providerCaption={providerCaption}
            providerAgentType={providerAgentType}
            creditLine={creditLine}
            memo={memo}
            saveTemp={saveTemp}
            onlineType={onlineType}
            imageState={imageState}
            reasonList={reasonList}
            imageRejectReason={imageRejectReason}
            hide={hide}
            category={category}
            keywordsDic={keywordsDic}
            setSelectStatus={this.setSelectStatus.bind(this)}
            onLoadImgError={this.onLoadImgError.bind(this)}
            imageClickHandle={this.imageClickHandle.bind(this)}
            handleOnClick={this.handleOnClick.bind(this)}
          />
        );
      })}
      </div>);
  };

  editStepTwoRender() {
    const { listDisplay, keywordsDic, regionOptions, dispatch, alertHandle } = this.props;
    const {
      operate,
      // listData,
      selectStatus,
      lang,
      rowIndex,
      rowSize,
      rowHeight,
      listTop
    } = this.state;
    let listData = this.state.listData.filter((item, index) => {
      item.i = index;
      return item.qualityRank < 5 && !item.offlineReason && !item.hide
    })

    return (
      <div style={{
        paddingTop: rowIndex * rowHeight,
        height: Math.ceil(listData.length / rowSize) * rowHeight,
        overflow: 'hidden'
      }}>{listData.filter((item, index) => {
        const startIndex = rowIndex * rowSize
        return (index >= startIndex) && (index < startIndex + rowSize * 3)
      }).map((item) => {
        // kind 0 主题 1 概念 2 规格 3 人物 4 地点 其他放到主题里
        const { key, id, resId, oss176, oss400, ossYuantu, dateCameraShot, caption, providerCaption, region, hide, rotate, keywordsArr, keywordsAuditArr, providerKeywords, providerAgentType, i } = item;

        let keywordsAuditArrTemp = [];
        keywordsAuditArr.map(item => {
          keywordsAuditArrTemp.push({ ...item });
        });

        return (
          <EditStepTwoBox
            rowHeight={rowHeight}
            key={id.toString()}
            i={i}
            id={id}
            lang={lang}
            hide={hide}
            operate={operate}
            listDisplay={listDisplay}
            rotate={rotate}
            oss176={oss176}
            oss400={oss400}
            ossYuantu={ossYuantu}
            resId={resId}
            region={[...region]}
            regionOptions={regionOptions}
            dateCameraShot={dateCameraShot}
            providerCaption={providerCaption}
            caption={caption}
            keywordsArr={[...keywordsArr]}
            keywordsAuditArr={keywordsAuditArrTemp}
            keywordsDic={_.assign({}, keywordsDic)}
            providerKeywords={providerKeywords}
            providerAgentType={providerAgentType}
            selectStatus={selectStatus[i]}
            dispatch={dispatch}
            alertHandle={alertHandle}
            closeModal={this.closeModal.bind(this)}
            handleOnUpdateTags={this.handleOnUpdateTags.bind(this)}
            setSelectStatus={this.setSelectStatus.bind(this)}
            imageClickHandle={this.imageClickHandle.bind(this)}
            onLoadImgError={this.onLoadImgError.bind(this)}
            handleOnClick={this.handleOnClick.bind(this)}
            regionLoadData={this.regionLoadData.bind(this)}
          />
        );
      })}
      </div>);
  };

  favoritesRender() {
    const { listData, selectStatus } = this.state;
    return (
      [...listData].map((item, i) => {
        // kind 0 主题 1 概念 2 规格 3 人物 4 地点 其他放到主题里
        const { favor_id, oss176, ossYuantu, id, resId, caption, uploadTime } = item;

        return (
          <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={selectStatus[i] ? "editCard selected" : "editCard"}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.imageClickHandle.bind(this, {
                  "resImageId": id,
                  "key": i,
                  "viewWhat": "imageDetailInfo"
                })} data-key={i}>
                <img alt="找不到图片" src={(ossYuantu && oss176) ? oss176 : this.defaultImage}
                  onError={this.onLoadImgError.bind(this)} />
              </div>
              <div className="custom-card">
                <div className="row mb-5">
                  {uploadTime || "0000-00-00 00:00:00"}
                </div>
                <div className="row mb-5">单张ID：<a onClick={this.imageClickHandle.bind(this, {
                  "resImageId": id,
                  "key": i,
                  "viewWhat": "imageDetailInfo"
                })}>{resId}</a></div>
                <div className="row mb-5">
                  <p title={caption} style={{ "height": "40px", "overflow": "hidden" }}>
                    {_.trunc(caption, 90)}
                  </p>
                </div>
                <div className="row mt-10">
                  <Button
                    onClick={this.handleOnClick.bind(this, { "operate": "deleteImage", "key": i, "id": id, favor_id })}
                    size="small" style={{ margin: "4px 4px 4px 0" }}>删除</Button>
                </div>

              </div>
            </Card>
          </div>
        );
      })
    );
  }

  tagAuditRender() {
    const { type, listDisplay, keywordsDic, dispatch, alertHandle } = this.props;
    const { types, operate, listData, selectStatus, lang, rowIndex, rowSize, rowHeight } = this.state;
    return (
      <div style={{
        paddingTop: rowIndex * rowHeight,
        height: Math.ceil(listData.length / rowSize) * rowHeight,
        overflow: 'hidden'
      }}>{listData.filter((item, index) => {
        item.i = index
        const startIndex = rowIndex * rowSize
        return (index >= startIndex) && (index < startIndex + rowSize * 4)
      }).map((item) => {
        const { key, id, resId, rotate, oss176, ossYuantu, providerId, providerName, uploadTime, brandName, imageState, onlineState, keywordsRejectReason, title, keywordsArr, keywordsAuditArr, i } = item;

        let keywordsAuditArrTemp = [];
        keywordsAuditArr.map(item => {
          keywordsAuditArrTemp.push({ ...item });
        });

        return (
          <TagAuditBox
            key={id.toString()}
            i={i}
            id={id}
            lang={lang}
            type={type}
            pageType={types}
            operate={operate}
            listDisplay={listDisplay}
            resId={resId}
            title={title}
            rotate={rotate}
            oss176={oss176}
            ossYuantu={ossYuantu}
            onlineState={onlineState}
            providerId={providerId}
            providerName={providerName}
            brandName={brandName}
            uploadTime={uploadTime}
            imageState={imageState}
            selectStatus={selectStatus[i]}
            keywordsRejectReason={keywordsRejectReason}
            keywordsArr={[...keywordsArr]}
            keywordsAuditArr={keywordsAuditArrTemp}
            keywordsDic={_.assign({}, keywordsDic)}
            dispatch={dispatch}
            alertHandle={alertHandle}
            handleOnUpdateTags={this.handleOnUpdateTags.bind(this)}
            setSelectStatus={this.setSelectStatus.bind(this)}
            onLoadImgError={this.onLoadImgError.bind(this)}
            handleOnClick={this.handleOnClick.bind(this)}
            imageClickHandle={this.imageClickHandle.bind(this)}
          />
        );
      })}
      </div>);
  };

  creativeRender() {  //pageType edit已下线 noEdit未上线
    const { operate, listData, selectStatus, types } = this.state;
    let pageType = types;

    // //console.log(listData);

    return (
      [...listData].map((item, i) => {
        let { id, resId, firstUrl, rotate, oss176, ossYuantu, title, brandName, caption, editTime, offlineMark, licenseType, isCopyright, qualityRank, onlineState, imageState, modelRelease, providerId, providerName, creditLine, publishLoading, imageRejectReason, keywordsRejectReason, offlineReason, imageDetailInfo, graphicalStyle, uploadTime, onlineTime, providerAgentType, collectionId, collections, assetFormat, onlineType } = item;

        const edit = false;

        caption = caption || title;

        let op_config = [
          { "text": "通过", "icon": "check", "op": "imageState", "isOp": true, "show": false, "value": 4 },
          { "text": "不通过", "icon": "close", "op": "imageState", "isOp": true, "show": false, "value": 3 },
          { "text": "标记下线", "icon": "tag-o", "op": "offlineMark", "isOp": true, "show": false, "value": 1 },
          { "text": "确认下线", "icon": "check-square", "op": "offlineMark", "isOp": true, "show": false, "value": 2 },
          { "text": "取消下线", "icon": "close-square", "op": "offlineMark", "isOp": true, "show": false, "value": 3 },
          { "text": "关键词编辑", "icon": "tag", "op": "editKeywords", "isOp": true, "show": false },
          { "text": "上线", "icon": "to-top", "op": "imageState", "isOp": true, "show": false, "value": 4 },
          { "text": "编审记录", "icon": "file-text", "op": "viewEditHistory", "isOp": true, "show": true },
          { "text": "下载", "icon": "cloud-download", "op": "downLoadCreativeYuantu", "isOp": true, "show": false }
        ];

        // imageState   1待编审 2已编审已上线 3 不通过 4 图片审核通过 5 关键词审核不通过
        // onlineState  1已上线 2未上线 3撤图
        // offlineMark 1已上线有下线标记 0|null 已上线没有下线标记 2 确认下线 3 取消下线
        if (assetFormat && ['PSD', 'AI', 'EPS'].indexOf(assetFormat.toUpperCase()) != -1) {
          op_config[8].show = true
        }

        let onlineStateClass = "", onlineStateText = "";

        if (onlineState == 1) {
          onlineStateClass = "text-success";
          onlineStateText = "已上线";
        } else if (onlineState == 2) { // 图片未上线
          if (imageState == 3) {
            onlineStateClass = "text-danger";
            onlineStateText = (imageRejectReason || '').replace(/\;$/, ''); //不通过原因显示
          } else if (imageState == 5) {
            onlineStateClass = "text-danger";
            onlineStateText = (keywordsRejectReason || '').replace(/\;$/, '');
          }


        } else if (onlineState == 3) {// 已下线 手动下线
          onlineStateClass = "text-danger";
          onlineStateText = "已下线";
          if (typeof offlineReason == "object") offlineReason = '';
          if (offlineMark == 2) onlineStateText = (offlineReason || '').replace(/\;$/, ''); //手动下线原因显示
        }

        // 创意图片未上线
        if (onlineState == 2) {
          op_config[0].show = true;
          op_config[1].show = true;

          if (imageState == 4) {
            onlineStateClass = "text-success";
            onlineStateText = "通过";
          }

        } else { // 创意图片已上线
          if ((imageState == 1 || imageState == 2) && onlineState == 1 && offlineMark != 1) { // 已上线
            op_config[2].show = true;
          } else if ((imageState == 1 || imageState == 2) && onlineState == 1 && offlineMark == 1) { // 标记下线
            op_config[3].show = true;
            op_config[4].show = true;
          } else if (onlineState == 3) { // 手动下线
            op_config[6].show = true;
          }

        }


        let collectionsValue = [], isLicenseType = false;
        collections.map((item, i) => {
          const obj = { ...item };
          if (obj) {
            collectionsValue.push(<Option key={obj.licenseType + '_' + i} value={obj.licenseType}>{obj.name}</Option>);
            if (obj.licenseType == licenseType) {
              brandName = obj.name;
              isLicenseType = true
            }
          }
        });

        // brandName =
        const isRevoke = (onlineState == 3 && offlineReason && offlineReason.indexOf('撤图') != -1)
        if (isRevoke) {
          const disableds = ['imageState', 'offlineMark'];
          op_config.forEach(item => {
            if (disableds.indexOf(item.op) != -1) {
              item.isOp = false
            }
          })
        }

        console.error(keywordsRejectReason)
        if(keywordsRejectReason){
          // alert(1)
        }

        return (
          <div className="col-xlg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={cs('editCard', { 'img-mark': isRevoke, 'selected': selectStatus[i] })}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "origin", "key": i, id, resId })}
                data-key={i}>
                <LazyLoad height={200} offset={100}>
                  <img alt="找不到图片" src={(ossYuantu && oss176) ? oss176 : this.defaultImage}
                    className={"imgRotate_" + rotate} onError={this.onLoadImgError.bind(this)} />
                </LazyLoad>
                <div className="operate-card" onDoubleClick={e => {
                  e.stopPropagation()
                }} onClick={e => {
                  e.stopPropagation()
                }}>
                  {[...this.state.creativeConfig].map((item, _i) => {
                    let operateBar = "";
                    operateBar = (
                      <i className={"fa fa-" + item.icon}
                        onClick={this.handleOnClick.bind(this, { "operate": item.operate, "key": i, id, resId })}></i>
                    );
                    return (<OverlayTrigger
                      key={_i}
                      overlay={<Tooltip id="operate">{item.title}</Tooltip>}
                      placement="top"
                      delayShow={150}
                      delayHide={50}>{operateBar}</OverlayTrigger>);
                  })}
                </div>
              </div>

              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                <div className="row mb-10">
                  <div className="col-xs-6 sis"><a title={providerName} onClick={this.handleOnClick.bind(this, {
                    "operate": "viewProvider",
                    "key": i,
                    "id": providerId,
                    "type": pageType
                  })}>{providerName || "---"}</a></div>
                  <div className="col-xs-6 sis text-right"><span title={brandName}>{brandName}</span></div>
                </div>
                <div className="row mb-5">
                  {uploadTime || "0000-00-00 00:00:00"}
                </div>
                <div className="row mb-5">ID：<a onClick={this.imageClickHandle.bind(this, {
                  "resImageId": id,
                  "key": i,
                  "viewWhat": "imageDetailInfo"
                })}>{resId}</a></div>
                <div className="row mb-5">
                  <p title={title} style={{ "height": "40px", "overflow": "hidden" }}>
                    {_.trunc(title, 90)}
                  </p>
                </div>

                {/* <div className="row mb-5"> {onlineTime || "---"} </div> */}

                <div className="row mb-5">
                  <div className="col-xs-3">授权：</div>
                  <div className="col-xs-9" style={{ height: '24px' }}>
                    {providerAgentType == 2 && <Select
                      size="small"
                      style={{ "width": "100%" }}
                      value={isLicenseType ? licenseType : ''}
                      onChange={value => {
                        this.handleOnClick({ "operate": "collectionId", "key": i, id, resId, value });
                      }}>
                      {collectionsValue}
                    </Select>}
                    {providerAgentType == 1 && <div className="ant-radio-group text-radio">
                      <span className={parseInt(licenseType || 0) == 2 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "licenseType",
                          "key": i,
                          id,
                          resId,
                          value: 2,
                          type: "creative"
                        })}>RF</span>
                      <span className={parseInt(licenseType || 0) == 1 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "licenseType",
                          "key": i,
                          id,
                          resId,
                          value: 1,
                          type: "creative"
                        })}>RM</span>
                    </div>}
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-xs-3">信息：</div>
                  <div className="col-xs-9">
                    <span className="mr-5">{[1, 2, 4].indexOf(isCopyright) > -1 ?
                      <a className={[1, 2, 4].indexOf(isCopyright) > -1 ? "text-danger em pointer" : ""}
                        href={`/license/${id}/1`} target="_blank">肖像权</a> : "肖像权"}</span>
                    <span>{[2, 3, 5].indexOf(isCopyright) > -1 ?
                      <a className={[2, 3, 5].indexOf(isCopyright) > -1 ? "text-danger em pointer" : ""}
                        href={`/license/${id}/2`} target="_blank">物权</a> : "物权"}</span>
                  </div>
                </div>
                <div className="row mb-10">
                  <div className="col-xs-3">等级：</div>
                  <div className="col-xs-9">
                    <div className="ant-radio-group text-radio">
                      <span className={parseInt(qualityRank || 0) == 1 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 1,
                          type: "creative"
                        })}>A</span>
                      <span className={parseInt(qualityRank || 0) == 2 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 2,
                          type: "creative"
                        })}>B</span>
                      <span className={parseInt(qualityRank || 0) == 3 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 3,
                          type: "creative"
                        })}>C</span>
                      <span className={parseInt(qualityRank || 0) == 4 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 4,
                          type: "creative"
                        })}>D</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row mb-5 mt-10">
                  {!edit &&
                    [...op_config].map((item, _i) => {
                      if (item.show) {
                        return (<Button title={item.text} disabled={!item.isOp} type="button" icon={item.icon}
                          onClick={this.handleOnClick.bind(this, {
                            "operate": item.op,
                            "key": i,
                            id,
                            resId,
                            "value": item.value,
                            type: "creative"
                          })} size="small" style={{ margin: "4px 4px 4px 0" }}></Button>)
                      }
                    })
                  }
                </div>
                {onlineState == 3 && <div className="reason-tip" title={offlineReason}>
                  <Tag color="#f50"
                    title={'下线原因：' + offlineReason}>{offlineReason ? _.trunc(offlineReason, 10) : '已下线'}</Tag>
                </div>}

                {(keywordsRejectReason && onlineType==2 && onlineState==2 && imageState==1) && <div className="reason-tip" title={offlineReason}>
                  <Tag color="#999"
                    title={keywordsRejectReason}>{keywordsRejectReason}</Tag>
                </div>}

                {(imageState == 3 || imageState == 5) && imageRejectReason &&
                  <div className="reason-tip" title={imageRejectReason}>
                    <Tag color="#f50" title={'不通过原因：' + imageRejectReason}>{_.trunc(imageRejectReason, 10)}</Tag>
                  </div>}
                <div className="card-num">
                  <span className={onlineStateClass}>{i + 1}</span>
                </div>
              </div>
            </Card>
          </div>
        );
      })
    );
  };

  videoRender() {  //pageType edit已下线 noEdit未上线
    const { operate, listData, selectStatus, types } = this.state;
    let pageType = types;

    // console.log(listData);
    // console.log(types);

    return (
      [...listData].map((item, i) => {
        let { id, resId, firstUrl, rotate, oss176, ossYuantu, title, brandName, caption, editTime, offlineMark, licenseType, isCopyright, qualityRank, onlineState, imageState, modelRelease, providerId, providerName, creditLine, publishLoading, imageRejectReason, keywordsRejectReason, offlineReason, imageDetailInfo, graphicalStyle, uploadTime, onlineTime, providerAgentType, collectionId, collections, assetFormat } = item;

        const edit = false;

        caption = caption || title;

        let op_config = [
          { "text": "通过", "icon": "check", "op": "imageState", "isOp": true, "show": false, "value": 4 },
          { "text": "不通过", "icon": "close", "op": "imageState", "isOp": true, "show": false, "value": 3 },
          { "text": "标记下线", "icon": "tag-o", "op": "offlineMark", "isOp": true, "show": false, "value": 1 },
          { "text": "确认下线", "icon": "check-square", "op": "offlineMark", "isOp": true, "show": false, "value": 2 },
          { "text": "取消下线", "icon": "close-square", "op": "offlineMark", "isOp": true, "show": false, "value": 3 },
          { "text": "关键词编辑", "icon": "tag", "op": "editKeywords", "isOp": true, "show": false },
          { "text": "上线", "icon": "to-top", "op": "imageState", "isOp": true, "show": false, "value": 4 },
          { "text": "编审记录", "icon": "file-text", "op": "viewEditHistory", "isOp": true, "show": true },
          { "text": "下载", "icon": "cloud-download", "op": "downLoadCreativeYuantu", "isOp": true, "show": false }
        ];

        // imageState   1待编审 2已编审已上线 3 不通过 4 图片审核通过 5 关键词审核不通过
        // onlineState  1已上线 2未上线 3撤图
        // offlineMark 1已上线有下线标记 0|null 已上线没有下线标记 2 确认下线 3 取消下线
        if (['PSD', 'AI', 'EPS'].indexOf(assetFormat.toUpperCase()) != -1) {
          op_config[8].show = true
        }

        let onlineStateClass = "", onlineStateText = "";

        if (onlineState == 1) {
          onlineStateClass = "text-success";
          onlineStateText = "已上线";
        } else if (onlineState == 2) { // 图片未上线
          if (imageState == 3) {
            onlineStateClass = "text-danger";
            onlineStateText = (imageRejectReason || '').replace(/\;$/, ''); //不通过原因显示
          } else if (imageState == 5) {
            onlineStateClass = "text-danger";
            onlineStateText = (keywordsRejectReason || '').replace(/\;$/, '');
          }


        } else if (onlineState == 3) {// 已下线 手动下线
          onlineStateClass = "text-danger";
          onlineStateText = "已下线";
          if (typeof offlineReason == "object") offlineReason = '';
          if (offlineMark == 2) onlineStateText = (offlineReason || '').replace(/\;$/, ''); //手动下线原因显示
        }

        // 创意图片未上线
        if (onlineState == 2) {
          op_config[0].show = true;
          op_config[1].show = true;

          if (imageState == 4) {
            onlineStateClass = "text-success";
            onlineStateText = "通过";
          }

        } else { // 创意图片已上线
          if ((imageState == 1 || imageState == 2) && onlineState == 1 && offlineMark != 1) { // 已上线
            op_config[2].show = true;
          } else if ((imageState == 1 || imageState == 2) && onlineState == 1 && offlineMark == 1) { // 标记下线
            op_config[3].show = true;
            op_config[4].show = true;
          } else if (onlineState == 3) { // 手动下线
            op_config[6].show = true;
          }

        }


        let collectionsValue = [], isLicenseType = false;
        collections.map((item, i) => {
          const obj = { ...item };
          if (obj) {
            collectionsValue.push(<Option key={obj.licenseType + '_' + i} value={obj.licenseType}>{obj.name}</Option>);
            if (obj.licenseType == licenseType) {
              brandName = obj.name;
              isLicenseType = true
            }
          }
        });

        // brandName =
        const isRevoke = (onlineState == 3 && offlineReason && offlineReason.indexOf('撤图') != -1)
        if (isRevoke) {
          const disableds = ['imageState', 'offlineMark'];
          op_config.forEach(item => {
            if (disableds.indexOf(item.op) != -1) {
              item.isOp = false
            }
          })
        }

        return (
          <div className="col-xlg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={cs('editCard', { 'img-mark': isRevoke, 'selected': selectStatus[i] })}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "origin", "key": i, id, resId })}
                data-key={i}>
                <LazyLoad height={200} offset={100}>
                  <img alt="找不到图片" src={(ossYuantu && oss176) ? oss176 : this.defaultImage}
                    className={"imgRotate_" + rotate} onError={this.onLoadImgError.bind(this)} />
                </LazyLoad>
                <div className="operate-card" onDoubleClick={e => {
                  e.stopPropagation()
                }} onClick={e => {
                  e.stopPropagation()
                }}>
                  {[...this.state.creativeConfig].map((item, _i) => {
                    let operateBar = "";
                    operateBar = (
                      <i className={"fa fa-" + item.icon}
                        onClick={this.handleOnClick.bind(this, { "operate": item.operate, "key": i, id, resId })}></i>
                    );
                    return (<OverlayTrigger
                      key={_i}
                      overlay={<Tooltip id="operate">{item.title}</Tooltip>}
                      placement="top"
                      delayShow={150}
                      delayHide={50}>{operateBar}</OverlayTrigger>);
                  })}
                </div>
              </div>

              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                <div className="row mb-10">
                  <div className="col-xs-6 sis"><a title={providerName} onClick={this.handleOnClick.bind(this, {
                    "operate": "viewProvider",
                    "key": i,
                    "id": providerId,
                    "type": pageType
                  })}>{providerName || "---"}</a></div>
                  <div className="col-xs-6 sis text-right"><span title={brandName}>{brandName}</span></div>
                </div>
                <div className="row mb-5">
                  {uploadTime || "0000-00-00 00:00:00"}
                </div>
                <div className="row mb-5">ID：<a onClick={this.imageClickHandle.bind(this, {
                  "resImageId": id,
                  "key": i,
                  "viewWhat": "imageDetailInfo"
                })}>{resId}</a></div>
                <div className="row mb-5">
                  <p title={title} style={{ "height": "40px", "overflow": "hidden" }}>
                    {_.trunc(title, 90)}
                  </p>
                </div>

                {/* <div className="row mb-5"> {onlineTime || "---"} </div> */}

                <div className="row mb-5">
                  <div className="col-xs-3">授权：</div>
                  <div className="col-xs-9" style={{ height: '24px' }}>
                    {providerAgentType == 2 && <Select
                      size="small"
                      style={{ "width": "100%" }}
                      value={isLicenseType ? licenseType : ''}
                      onChange={value => {
                        this.handleOnClick({ "operate": "collectionId", "key": i, id, resId, value });
                      }}>
                      {collectionsValue}
                    </Select>}
                    {providerAgentType == 1 && <div className="ant-radio-group text-radio">
                      <span className={parseInt(licenseType || 0) == 2 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "licenseType",
                          "key": i,
                          id,
                          resId,
                          value: 2,
                          type: "creative"
                        })}>RF</span>
                      <span className={parseInt(licenseType || 0) == 1 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "licenseType",
                          "key": i,
                          id,
                          resId,
                          value: 1,
                          type: "creative"
                        })}>RM</span>
                    </div>}
                  </div>
                </div>
                <div className="row mb-5">
                  <div className="col-xs-3">信息：</div>
                  <div className="col-xs-9">
                    <span className="mr-5">{[1, 2, 4].indexOf(isCopyright) > -1 ?
                      <a className={[1, 2, 4].indexOf(isCopyright) > -1 ? "text-danger em pointer" : ""}
                        href={`/license/${id}/1`} target="_blank">肖像权</a> : "肖像权"}</span>
                    <span>{[2, 3, 5].indexOf(isCopyright) > -1 ?
                      <a className={[2, 3, 5].indexOf(isCopyright) > -1 ? "text-danger em pointer" : ""}
                        href={`/license/${id}/2`} target="_blank">物权</a> : "物权"}</span>
                  </div>
                </div>
                <div className="row mb-10">
                  <div className="col-xs-3">等级：</div>
                  <div className="col-xs-9">
                    <div className="ant-radio-group text-radio">
                      <span className={parseInt(qualityRank || 0) == 1 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 1,
                          type: "creative"
                        })}>A</span>
                      <span className={parseInt(qualityRank || 0) == 2 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 2,
                          type: "creative"
                        })}>B</span>
                      <span className={parseInt(qualityRank || 0) == 3 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 3,
                          type: "creative"
                        })}>C</span>
                      <span className={parseInt(qualityRank || 0) == 4 ? 'ant-radio text-danger em' : 'ant-radio'}
                        onClick={this.handleOnClick.bind(this, {
                          "operate": "qualityRank",
                          "key": i,
                          id,
                          resId,
                          value: 4,
                          type: "creative"
                        })}>D</span>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row mb-5 mt-10">
                  {!edit &&
                    [...op_config].map((item, _i) => {
                      if (item.show) {
                        return (<Button title={item.text} disabled={!item.isOp} type="button" icon={item.icon}
                          onClick={this.handleOnClick.bind(this, {
                            "operate": item.op,
                            "key": i,
                            id,
                            resId,
                            "value": item.value,
                            type: "creative"
                          })} size="small" style={{ margin: "4px 4px 4px 0" }}></Button>)
                      }
                    })
                  }
                </div>
                {onlineState == 3 && <div className="reason-tip" title={offlineReason}>
                  <Tag color="#f50"
                    title={'下线原因：' + offlineReason}>{offlineReason ? _.trunc(offlineReason, 10) : '已下线'}</Tag>
                </div>}

                {(imageState == 3 || imageState == 5) && imageRejectReason &&
                  <div className="reason-tip" title={imageRejectReason}>
                    <Tag color="#f50" title={'不通过原因：' + imageRejectReason}>{_.trunc(imageRejectReason, 10)}</Tag>
                  </div>}
                <div className="card-num">
                  <span className={onlineStateClass}>{i + 1}</span>
                </div>
              </div>
            </Card>
          </div>
        );
      })
    );
  };

  cmsTopicSingleRender() {
    const { operate, listData, selectStatus } = this.state;
    return (
      [...listData].map((item, i) => {
        const info = [0],
          imgSrc = "http://pic.vcg.cn/bigimg/800bigwater/16318000/gic16318414.jpg",
          downloadHref = "http://pic.vcg.cn/bigimg/800bigwater/16318000/gic16318414.jpg";
        const { id, resId, qualityRank, src, title, width, height, onlineState } = item;
        let onlineStateClass = "", onlineStateText = ""; //  '1已上线2未上线3撤图4冻结 ',
        if (onlineState == 1) {
          onlineStateClass = "text-success";
          onlineStateText = "已上线";
        } else if (onlineState == 2 && imageState == 3 || onlineState == 3 && imageState == 2) {
          // '1待编审 2已编审/创意类关键词审核 3 不通过 4 图片审核通过',
          onlineStateClass = "text-danger";
          onlineStateText = "不通过";
        } else {
          onlineStateText = "未上线";
        }

        return (
          <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={selectStatus[i] ? "editCard selected" : "editCard"}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "origin", "key": i, id, resId })}
                data-key={i}>
                <img alt="找不到图片" src={src ? src : this.defaultImage} onError={this.onLoadImgError.bind(this)} />
              </div>
              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                <div className="row mb-5">ID：<a onClick={this.imageClickHandle.bind(this, {
                  "resImageId": id,
                  "key": i,
                  "viewWhat": "imageDetailInfo"
                })}>{resId}</a></div>
                <div className="row mb-5">
                  <div className="col-xs-3">等级：</div>
                  <div className="col-xs-9">
                    <RadioGroup
                      value={parseInt(qualityRank || 1)}
                      onChange={this.handleOnClick.bind(this, { "operate": "qualityRank", "key": i, id, resId })}>
                      <Radio key="a" value={1} style={{ "marginRight": 0 }}>A</Radio>
                      <Radio key="b" value={2} style={{ "marginRight": 0 }}>B</Radio>
                      <Radio key="c" value={3} style={{ "marginRight": 0 }}>C</Radio>
                      <Radio key="d" value={4} style={{ "marginRight": 0 }}>D</Radio>
                      <Radio key="e" value={5} style={{ "marginRight": 0 }}>E</Radio>
                    </RadioGroup>
                  </div>
                </div>
                <div className="row mt-17">"标题："{_.trunc(title, 20)}</div>

                <div className="card-num">
                  <span className={onlineStateClass} title={onlineStateText}>{i + 1}</span>
                </div>
              </div>
            </Card>
          </div>
        );
      })
    );
  };

  cmsTopicGrpRender() {
    const { operate, listData, selectStatus } = this.state;
    return (
      [...listData].map((item, i) => {
        const edit = false;
        const { id, resId, src, collectionName, uploadTime, groupState, resCount, onlineCount, title, onlineState, providerType } = item;
        return (
          <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={selectStatus[i] ? "storageCard selected" : "storageCard"}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "origin", "key": i, id, resId })}
                data-key={i} data-id={id}>
                <img alt="找不到图片" src={src ? src : this.defaultImage} onError={this.onLoadImgError.bind(this)} />
              </div>
              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                <div className="row mb-5">
                  <span className="num fr">{resCount}</span>
                  <span className="onlineNum fr">{onlineCount}</span>
                </div>
                <div className="row mb-10">
                  "标题：" {_.trunc(title, 20)}
                </div>
                <div className="row mb-5 mt-10">
                  <OverlayTrigger
                    key={"edit" + i}
                    overlay={<Tooltip id={"j_edit_" + i}>编审</Tooltip>}
                    placement="top"
                    delayShow={150}
                    delayHide={50}>
                    <i className={"tip fa fa-pencil-square"}
                      onClick={this.handleOnClick.bind(this, { "operate": "edit", "key": i, id, resId })}></i>
                  </OverlayTrigger>
                  <OverlayTrigger
                    key={"push" + i}
                    overlay={<Tooltip id={"j_push_" + i}>推送</Tooltip>}
                    placement="top"
                    delayShow={150}
                    delayHide={50}>
                    <i className={"tip fa fa-pencil-square"}
                      onClick={this.handleOnClick.bind(this, { "operate": "push", "key": i, id, resId })}></i>
                  </OverlayTrigger>
                  <OverlayTrigger
                    key={"noEdit" + i}
                    overlay={<Tooltip id={"j_noEdit_" + i}>加入待编审</Tooltip>}
                    placement="top"
                    delayShow={150}
                    delayHide={50}>
                    <i className={"tip fa fa-plus-circle"}
                      onClick={this.handleOnClick.bind(this, { "operate": "addToNoEdit", "key": i, id, resId })}></i>
                  </OverlayTrigger>
                </div>
                <div className="card-num">
                  <span className={onlineStateClass} title={onlineStateText}>{i + 1}</span>
                </div>
              </div>
            </Card>
          </div>
        );
      })
    );
  };

  commonRender() {
    const { operate, listData, selectStatus } = this.state;
    return (
      [...listData].map((item, i) => {
        const { id, resUrl } = item;
        return (
          <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6" key={id + '_' + i}>
            <Card className={selectStatus[i] ? "storageCard selected" : "storageCard"}>
              <div className="custom-image" onClick={this.setSelectStatus.bind(this, { "key": i })}
                onDoubleClick={this.handleOnClick.bind(this, { "operate": "origin", "key": i, id, resId })}
                data-key={i} data-id={id}>
                <LazyLoad height={200} offset={100}>
                  <img alt="找不到图片" src={resUrl ? resUrl : this.defaultImage} onError={this.onLoadImgError.bind(this)} />
                </LazyLoad>
              </div>
              <div className="custom-card" onClick={e => {
                e.stopPropagation()
              }}>
                {render instanceof Function && render(item)}
              </div>
            </Card>
          </div>
        );
      })
    );
  };

  tagRender({ key, record, disabled, providerKeywords, providerAgentType }) {
    const lang = isEn() ? 'enname' : 'cnname';
    const { id } = record, { keywordsDic, dispatch, type, listDisplay, alertHandle } = this.props;
    const { types } = this.state;
    // kind 0 主题 1 概念 2 规格 3 人物 4 地点 其他放到主题里
    const keywordType = ['themeTag', 'conceptTag', 'formatTag', 'peopleTag', 'locationTag'];
    let picKeywords = { themeTag: [], conceptTag: [], formatTag: [], peopleTag: [], locationTag: [], auditTag: [] };
    //组件中修改时只维护keywordsArr与keywordsAuditArr这两个中间量，keywords与keywordsAudit仅在接口调用保存时修改
    //console.log({key, record, disabled, providerKeywords, providerAgentType});
    if (record.keywordsArr) {
      // 所有已经确定的关键词 按照类别装起来
      record.keywordsArr.forEach(keywordId => {
        const keyword = keywordsDic[keywordId];
        if (!keyword) return false;
        let kind = keyword.kind;
        let tag = keywordType[kind] ? keywordType[kind] : "themeTag";
        let label = keyword[lang];
        if (keywordId && label) {
          const obj = {
            key: label + "  (" + keywordId + ")",
            label: <span className="ant-select-selection__choice__content" data-id={keywordId}>{label}</span>,
            title: label,
            id: keywordId,
            kind: kind
          };
          //console.log(obj);

          picKeywords[tag].push(obj);
        }
      });
    }
    /*
     *  keywordsAudit为后台自动审计后的关键字，格式为 tag|id|type

     *  其中type=0表示新词，type=1表示正常，type=2表示多义词，type=3表示不检测

     *  多义词的多个id以逗号分隔.目前数据库中存在错误数据，大量id之间包含双冒号，这里也需要处理

     *  keywordsAuditArr为keywordsAudit转换为的数组

     *  手动增加的新词与多义词要保留在输入的那个框中，最后的auditTag框只记录原词
     */
    if (record.keywordsAuditArr) {
      //新词与多义词需要按顺序排列，故采用两个数据分别组装
      let tempWordsDic = [
        { themeTag: [], conceptTag: [], formatTag: [], peopleTag: [], locationTag: [] },
        '',
        { themeTag: [], conceptTag: [], formatTag: [], peopleTag: [], locationTag: [] }
      ];

      //对所有包括确定和未确定的词 按照上面tempWordsDic 新词、确定词，多义词三个数组组装
      record.keywordsAuditArr.forEach(item => {
        const auditClass = ['danger', '', 'success'];
        const param = { ...item };
        param.key = param.label + ' (' + param.id + ')';//source为原始数据
        param.title = param.label;//新词与多义词的label要转为jsx，这里用title记录下字符

        if (auditClass[param.type]) {
          let className = "ant-select-selection__choice__content label label-" + auditClass[param.type];
          param.label = <span className={className} data-type={param.type} data-id={param.id}>{param.label}</span>;
          //新词放在前面，多义词放在后面
          tempWordsDic[param.type][keywordType[param.kind || 0]].push(param);
        } else if (param.type == 3) {//
          picKeywords.auditTag.push(param.label);
        }
      });
      for (let tag in picKeywords) { //循环已确定词的分类 0 主题 1 概念 2 规格 3 人物 4 地点
        if (tempWordsDic[0][tag]) {

          //新词和多义词都加到主题里面
          picKeywords[tag] = tempWordsDic[0][tag].concat(tempWordsDic[2][tag], picKeywords[tag]);
        }
      }
      picKeywords.auditTag = _.uniq(picKeywords.auditTag);
    }

    const tagAreaConfigs = {
      dispatch: dispatch,
      type: type,
      keywordsDic: keywordsDic,
      disabled: disabled,
      size: "large",
      className: "mb-10 row",
      alertHandle: alertHandle
    };

    //if(key==0) {
    //console.log('record',record,keywordsDic);
    //console.log('picKeywords.themeTag',picKeywords.themeTag);
    //}

    const { sortTag } = this.props;

    const keywordTypeObj = { themeTag: '主题', conceptTag: '概念', formatTag: '规格', peopleTag: '人物', locationTag: '地点' };
    const TagAreaPanels = listDisplay == 1 ? [<TagAreaPanel // 一个框
      key={key + '_' + 0}
      sortTags={sortTag}
      {...tagAreaConfigs}
      tagContainerStyle={{ height: 120, "fontSize": 12 }}
      value={_.union(picKeywords.themeTag, picKeywords.conceptTag, picKeywords.formatTag, picKeywords.peopleTag, picKeywords.locationTag)}
      placeholder=" 输入关键词后回车添加。"
      updateTags={this.handleOnUpdateTags.bind(this, key, 0)}
    />] : Object.keys(keywordTypeObj).map((name, index) => { //五个框模式
      return <TagAreaPanel
        key={key + '_' + index}
        sortTags={sortTag}
        {...tagAreaConfigs}
        tagContainerStyle={{ "fontSize": 12, "height": 60 }}
        value={picKeywords[name]}
        placeholder={`输入${keywordTypeObj[name]}关键词后回车添加。`}
        updateTags={this.handleOnUpdateTags.bind(this, key, index)}
      />
    });

    if (types === 'editStepTwo') {
      TagAreaPanels.push(<textarea disabled value={(providerKeywords && providerAgentType != 1) ? providerKeywords : ''}
        style={{ height: 60, width: '100%' }} />)
    }

    return TagAreaPanels;
  };

  // https://github.com/RubaXa/Sortable
  sortableGroupDecorator = (componentBackingInstance) => {
    // check if backing instance not null
    if (componentBackingInstance) {
      let options = {
        handle: ".custom-image",
        draggable: ".edit", // Specifies which items inside the element should be sortable
        group: "shared",
        onEnd: (evt) => {
          if (evt.newIndex == evt.oldIndex) {
            return false;
          }
          const { groupId2, dispatch } = this.props;
          const { listData } = this.state;

          if (!listData[evt.newIndex]) {
            return false;
          }

          // 旧位置 新位置
          this.setPosition({ key: evt.oldIndex, sortNumber: evt.newIndex });
        }
      };
      // //console.log(evt, this.props);
      // this.props.sortableGroup(evt);
      Sortable.create(componentBackingInstance, options);
    }
  };

  render() {
    const { listDisplay } = this.props;
    const { animate, types, operate, listData, selectStatus, modal, maskLoading } = this.state;

    //console.log(listData)

    let tpl = "";
    if (!listData) {
      // tpl = <div className="thumbnail-loading"><Spin tip="加载中..." /></div>;
    } else if (listData.length === 0) {
      tpl = <div className="col-xs-12">暂无数据</div>;
    } else {
      switch (types) {
        case "group":
          tpl = this.groupRender();
          break;
        case "push":
          tpl = this.groupRender();
          break;
        // case "downloadPhotos":
        //     tpl = this.photosRender();
        //     break;
        case "photos":
          tpl = this.photosRender();
          break;
        case "editStepOne":
          const { showCaption } = this.props
          this.state.rowHeight = showCaption ? 525 : 420
          this.state.listTop = 150
          tpl = <div className="group-list-sort">
            {this.editStepOneRender()}
          </div>;
          break;
        case "editStepTwo":
          this.state.rowHeight = 780
          this.state.rowHeight = listDisplay === 1 ? 780 : 1010
          this.state.listTop = 488
          tpl = this.editStepTwoRender();
          break;
        case "favorites":
          tpl = this.favoritesRender();
          break;
        case "creativeTagEditor": //创意类关键词已编审
          this.state.rowHeight = 540
          this.state.listTop = 230
          tpl = this.tagAuditRender();
          break;
        case "creativeTagNoEditor": //创意类关键词待编审
          this.state.rowHeight = 540
          this.state.listTop = 230
          tpl = this.tagAuditRender();
          break;
        case "creativeEdit": //已编审
          tpl = this.creativeRender("edit");
          break;
        case "creativeNoEdit": //待编审
          tpl = this.creativeRender("noEdit");
          break;

        case "videoTagEditor": // 创意视频类关键词已编审
          this.state.rowHeight = 540
          this.state.listTop = 230
          tpl = this.tagAuditRender();
          break;
        case "videoTagNoEditor": // 创意视频类关键词待编审
          this.state.rowHeight = 540
          this.state.listTop = 230
          tpl = this.tagAuditRender();
          break;
        case "videoEdit": //创意视频已编审
          tpl = this.videoRender("edit");
          break;
        case "videoNoEdit": //创意视频待编审
          tpl = this.videoRender("noEdit");
          break;

        case "cmsTopicSingle":
          tpl = this.cmsTopicSingleRender();
          break;
        case "cmsTopicGrp":
          tpl = this.cmsTopicGrpRender();
          break;
        // case "offline":
        //     tpl = this.offlineRender({ type: "resource" });
        //     break;
        // case "offlineGroup":
        //     tpl = this.offlineRender({ type: "group" });
        //     break;
        default:
          tpl = this.commonRender();
          break;
      }
    }

    return (
      <div>
        <BackTop />
        <div className="row">
          <Spin spinning={maskLoading} tip="加载中...">
            <div className="overflow">{tpl}</div>
          </Spin>
        </div>
        {modal && <Modal
          visible={modal.visible}
          maskClosable={modal.maskClosable}
          // closable={!modal.maskClosable}
          confirmLoading={modal.confirmLoading}
          title={modal.title}
          width={modal.width}
          onOk={modal.onOk}
          onCancel={modal.onCancel}
          footer={modal.footer ? [] : [
            <Button key="back" type="ghost" onClick={modal.onCancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={modal.onOk}>确定</Button>
          ]}>
          {modal.showContent == "body" && modal.body}
        </Modal>}
      </div>
    );
  };

  handleOnClick(params, e) {

    let { operate, key, id, resId, groupId, value, type, data, dateString, selectedOptions, groupIds, offlineReason, onlineState } = params;
    const { types, listData } = this.state;
    if (!value && e) value = e.target.value;

    //console.log('---',params);

    switch (operate) {
      case "title":
        this.setFieldValue({ operate, key, value });
        break;
      case 'region':
        // console.log(value);
        this.setFieldValue({ operate, key, value });
        break
      case "licenseType": // 设置授权
        if (type != "creative") { // 非创意类 走内部组件逻辑
          this.setFieldValue({ operate, key, value, id });
        }
      case "offlineMark": //设置下线状态
        if (type == "creative" && value == 3) this.setFieldValue({ operate, key, value, offlineReason, onlineState });
        if (this.props.onThumbnail) this.props.onThumbnail(params);
        break;
      case "setTop": // 设置置顶
        //this.setPosition({ key, sortNumber : 0 });
        this.setFieldValue({ operate: 'sortNumber', key, value: 1 });
        break;
      case "setLeftRotation": // 设置左旋转
        this.setFieldValue({ "operate": "rotate", key, "direction": "left" });
        break;
      case "setRightRotation": // 设置右旋转
        this.setFieldValue({ "operate": "rotate", key, "direction": "right" });
        break;
      // case "qualityRank":
      //     this.setFieldValue({ operate, key, value });
      //     break;
      case "creditLine":
        this.setFieldValue({ operate, key, value });
        break;
      case "sortNumber":
        console.log(operate, key, value)
        this.setFieldValue({ operate, key, value });
        break;
      case "dateCameraShot":
        this.setFieldValue({ operate, key, value });
        break;
      case "region":
        this.setRegion({ operate, key, value, selectedOptions });
        break;
      case "caption":
        this.setFieldValue({ operate, key, value });
        break;
      case "providerCaption":
        this.setFieldValue({ operate, key, value });
        break;
      case "origin":
        this.viewPic({ "resImageId": id, "type": operate });
        break;
      case "middle":
        this.viewPic({ "resImageId": id, "type": operate, resId });
        break;
      case "downLoadYuantu":
        //console.log(groupIds);
        window.open('/api/zh' + editorUrl + '/image/downLoadYuantu?groupId=' + groupIds[0].id + '&resImageIds=' + id + '&token=' + getStorage('token'));
        break;
      case "downLoadCreativeYuantu":
        window.open('/api/zh' + editorUrl + '/image/downLoadCreativeYuantu?resImageId=' + id + '&token=' + getStorage('token'));
        break;
      case "viewProvider":
        window.open("/provider/" + id + "/" + type);
        break;
      case "setNotPass": // 关键词不通过
        this.setSelectStatus({ type: 'cancel', key, value: true });
        if (this.props.onThumbnail) this.props.onThumbnail(params);
        break;
      case "publish": // 关键词发布
        this.setSelectStatus({ type: 'cancel', key, value: true });
        if (this.props.onThumbnail) this.props.onThumbnail(params);
        break;
      default:
        if (this.props.onThumbnail) this.props.onThumbnail(params);
    }
  };

  // // 显示收藏夹弹框
  // showFavoriteModal(id){
  //     const {favoriteFolder} = this.state;

  //     if(favoriteFolder == null){
  //         this.getFavoriteFolder(id);
  //         return ;
  //     }

  //     const favoriteBody =

  //     <div>
  //         <div className="clearfix">
  //             <label for="inputEmail3" className="col-sm-2 control-label">选择收藏夹</label>
  //             <div className="col-sm-5">
  //                   <AntSelect
  //                     showSearch
  //                     style={{ width: 200 }}
  //                     placeholder="选择已有收藏夹"
  //                     optionFilterProp="children"
  //                     onChange={e=>{
  //                         this.state.selectedFavoriteFolder = e;
  //                     }}
  //                 >
  //                     {favoriteFolder.map(item => <AntOption value={item.id.toString()}>{item.name}</AntOption>)}
  //                 </AntSelect>
  //             </div>
  //             <div className="col-sm-5">
  //                <Button type="primary" onClick = {this.addToFavorite.bind(this, id, 1)}>添加到收藏夹</Button>
  //             </div>
  //         </div>

  //         <div className="clearfix pt-20">
  //             <label for="inputEmail3" className="col-sm-2 control-label">收藏夹名称</label>
  //             <div className="col-sm-5">
  //                  <Input
  //                     onChange={e=>{
  //                         this.state.addFavoriteFolderName = e.target.value;
  //                     }}
  //                     style={{ width: 200 }} placeholder="请输入收藏夹名称" />
  //             </div>
  //             <div className="col-sm-5">
  //                <Button type="primary" onClick = {this.addToFavorite.bind(this, id, 2)}>添加到新建收藏夹</Button>
  //             </div>
  //         </div>
  //     </div>

  //     const {modal} = this.state;
  //     modal.visible=true;
  //     modal.width="700";
  //     modal._title="添加到收藏夹";
  //     modal.body=favoriteBody;
  //     modal.footer = true;
  //     modal.cancelBtn = this.closeImageModal.bind(this);
  //     this.setState({modal});
  // }

  // // 取到收藏夹并且显示收藏夹弹框
  // getFavoriteFolder(id,isShowModal = true){
  //     const {dispatch} = this.props;
  //     dispatch(favoriteQuery({userId: this.state.userId})).then(result => {
  //             if (result.apiError) {
  //                 message.error(result.apiError.errorMessage, 3);
  //                 return false;
  //             }

  //             let {favoriteFolder} = this.state;
  //             favoriteFolder =result.apiResponse;
  //             this.setState({favoriteFolder});
  //             if(isShowModal) this.showFavoriteModal(id);

  //         }
  //     )
  // }

  // /**
  //  * 添加到收藏事件
  //  * @param  {String} id         图片id
  //  * @param  {Number} methodType 按钮类型 1 添加到已有 2 添加到新建收藏夹
  //  */
  // addToFavorite(id,methodType){
  //     const {dispatch} = this.props;

  //     let param =  {
  //             "userId": this.state.userId,
  //             "type": "photos",     // group photos
  //             "ids": id // groupIds photoIds
  //         }
  //      // 添加到已有
  //     if(methodType == 1){
  //         if(_.isEmpty(this.state.selectedFavoriteFolder)){
  //             message.error("请选择收藏夹", 3);
  //             return;
  //         }
  //         param = Object.assign(param, {
  //             "status": true,     // 已有 - 新的
  //             "id": this.state.selectedFavoriteFolder          // 已有 收藏夹 id
  //         })
  //     }else{
  //         if(_.isEmpty(this.state.addFavoriteFolderName)){
  //             message.error("请填写收藏夹名称", 3);
  //             return;
  //         }
  //         param = Object.assign(param, {
  //             "status": false,     // 已有 - 新的
  //             "name": this.state.addFavoriteFolderName       // 新的 收藏夹 name
  //         })
  //     }

  //     const _this = this;
  //     dispatch(favoriteSave(param)).then(
  //         result =>{
  //             if (result.apiError) {
  //                 message.error(result.apiError.errorMessage, 3);
  //                 return false;
  //             }

  //             // 新建收藏夹 需要刷新
  //             if(!param.status){
  //                 this.getFavoriteFolder("", false)
  //             }
  //             _this.closeImageModal();

  //             // 提示成功、
  //             message.success("收藏成功");
  //         }
  //     )
  // }

  setFieldValue({ operate, key, value, direction }) {
    let { types, listData } = this.state;
    if (operate == "rotate") {
      if (this.props.setSwing) {
        value = this.props.setSwing(listData[key][operate], direction);
      } else {
        value = this.setSwing(listData[key][operate], direction);
      }

    }

    listData[key][operate] = value;

    //console.log(listData[key])

    this.setState({ listData, "doing": "setFieldValue" });
    //this.state.listData = listData;
    if (this.props.updateData) this.props.updateData({
      listData,
      "doing": "setFieldValue",
      operate,
      key,
      value,
      type: 'list'
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

  setRegion({ operate, key, value, selectedOptions }) {
    //console.log(operate, key, value, selectedOptions);
    const regionArr = ["country", "province", "city"];
    //let {keywordsDic,lang} = this.state;
    regionArr.forEach((region, i) => {
      const item = selectedOptions[i];
      this.setFieldValue({ operate: regionArr[i], key, value: item ? item.label : '' });
      //if(item){
      //    keywordsDic[item.code] = {
      //        "id": item.code,
      //        [lang]: item.label
      //    };
      //}
    });

    this.setFieldValue({ operate, key, value });
    // this.setState({keywordsDic,"doing":"setRegion"});
    if (this.props.updateData) this.props.updateData({ "doing": "setRegion", operate, key, value });
    // const curKey = selectedOptions.length - 1;
    // if(this.props.queryRegion) this.props.queryRegion({ "parentId": selectedOptions[curKey].code, "curKey": selectedOptions[curKey].key });
  }

  regionLoadData(selectedOptions) {
    const curOption = selectedOptions[selectedOptions.length - 1];
    this.props.queryRegion({ "parentId": curOption.code || curOption.value, "curKey": curOption.key }, selectedOptions);
  }

  /**
   * 置顶和拖动排序公共方法
   * @param {Number} options.key        元素旧位置
   * @param {Number} options.sortNumber 元素新位置
   */
  setPosition({ key, sortNumber }) {
    // 未改变排序
    if (key == sortNumber) return false;

    let { listData } = this.state;

    // 选中状态恢复
    //selectStatus[key] = false;
    //selectStatus[sortNumber] = true;

    // 旧元素删除添加到拖动对应位置
    listData.splice(sortNumber, 0, listData.splice(key, 1)[0]);

    // 重新生成sortNumber
    listData.forEach((item, i) => {
      item.sortNumber = i;
      item.key = i;
    });

    this.setState({ listData });
    this.setSelectStatus({ key: sortNumber, type: 'cancel', value: true });
    if (this.props.updateData) this.props.updateData({ listData });

  };

  openModal(config) {
    const modal = Object.assign(this.state.modal, {
      "visible": true,
      "maskClosable": true,
      "confirmLoading": false,
      "submitMsg": ""
    }, config);
    this.setState({ modal });
  };

  closeModal(config) {
    const modal = Object.assign(this.state.modal, {
      "visible": false,
      "maskClosable": false,
      "confirmLoading": false,
      "contentShow": "body",
      "param": {}
    });
    this.setState({ modal });
  };

  /*
   * 更新关键词数据
   *
   *  @i：listData的第几张图片

   @kind：在哪种类型的关键词框中进行的操作

   @keywordsArr：新增的确定的关键词

   @keywordsAuditArr：新增的新词与多义词

   @newDic：新增或修改的关键词字典

   @tag：删除的关键词 || 图片已存在的关键词中多个指定关键词
   */
  handleOnUpdateTags(key, kind, { keywordsArr, keywordsAuditArr, newDic }, tag) {
    //onThumbnail：更新listData的入口
    //updateKeywordDic：更新关键词字典的入口
    // console.log(909090);
    let { listData } = this.state, { onThumbnail, updateKeywordDic, updateData } = this.props;

    // console.log(keywordsAuditArr);
    // console.log(keywordsArr);
    // console.log(newDic);
    // console.log(updateData);

    if (keywordsArr) listData[key].keywordsArr = _.union(listData[key].keywordsArr, keywordsArr);
    if (keywordsAuditArr) {
      keywordsAuditArr.map((item) => {
        item.kind = kind;
      });
      listData[key].keywordsAuditArr = _.uniq(listData[key].keywordsAuditArr.concat(keywordsAuditArr), 'source');
    }

    // console.log(tag);

    if (Array.isArray(tag)) { // 删除图片已存在的关键词中多个指定关键词
      // 新词和多义词从source中删除 匹配词根据id删除
      tag.forEach(item => {

        listData[key].keywordsAuditArr.forEach(v => {
          if (v.source == item.source) {
            v.type = 1;
            v.source = updateTag(v.source, tag.curId)
          }
        })

        _.remove(listData[key].keywordsArr, function (v) {
          return v == item.id;
        });
      });

    } else {  // 删除指定关键词

      if (tag && tag.type != undefined && listData[key].keywordsAuditArr.length > 0) {
        listData[key].keywordsAuditArr.forEach(v => {
          if (v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type + '|' + v.source.split('|')[3]))) {
            v.type = 1;
            v.source = updateTag(v.source, tag.curId)
          }
        })
      }

      if (tag && tag.type == undefined && listData[key].keywordsArr.length > 0) {
        _.remove(listData[key].keywordsArr, (v) => {
          return v == tag.id;
        });
      }
    }

    if (onThumbnail instanceof Function) {
      // this.state.listData = listData;
      this.setState({ listData });
      // alert(1);
      updateData({ listData, "doing": "handleOnUpdateTags", key, type: 'list' });
    }

    if (newDic && updateKeywordDic) {
      updateKeywordDic(newDic);
    }

    // 关闭弹框
    //alertHandle();

    function updateTag(source, id) {
      const arr = source.split('|');
      if (id) arr[1] = id + '';
      arr[2] = 1;
      return arr.join('|')
    }
  };

  //modal param set
  setParam(key, value) {
    let modal = this.state.modal;
    modal.params[key] = value;
    this.setState(modal);
  };

  //图片悬浮显示照片信息
  imageClickHandle(params) {
    // alert(1);
    // console.log(params);
    let { listData, modal } = this.state;
    const needDispatch = params.viewWhat == "imageExifInfo" ? (!listData[params.key].imageExifInfo || listData[params.key].imageExifInfo == "加载中...") : (!listData[params.key].imageDetailInfo);

    //配置公用双击显示的弹框信息 如果不需要刷新直接弹框
    if (params.viewWhat == "imageDetailInfo") {
      modal.visible = true;
      modal.width = "940";
      modal.height = '820';
      modal.title = "图片信息";
      modal.maskClosable = true;
      modal.body = listData[params.key].imageDetailInfo;
      modal.footer = true;
      listData[params.key].imageDetailInfo = modal.body;
      if (!needDispatch) {
        this.setState({ modal });
        return;
      }
    }

    //发送数据请求 缓存请求信息 做效果
    if (needDispatch) {
      const { dispatch } = this.props;
      dispatch(params.viewWhat == "imageExifInfo" ? getImageExif(params) : getImageDetail(params)).then(result => {
        if (result.apiError) {
          message.error(result.apiError.errorMessage, 3);
          return false;
        }

        // if(params.viewWhat=="imageExifInfo"){
        //     let imageExifInfo=[];
        //     //这里是对象返回的json对象数组
        //     //const showKey=["fileSize","widthSize","heightSize","xResolution","yResolution","exposureMode","exposureTime","exposureBias","focalLength","iso","fNumber","flash","meteringMode","whiteBalance","make","model","lens","modifiedSoftware","dateModified","dateTimeOriginal","colorSpace"];
        //     const showKey=["fileSize","xResolution","yResolution","software","fileModifiedDate","exposureTime","fNumber","isoEquiv","dateTimeDigitized","dateTimeOriginal","exposureMode","resolution"];
        //     showKey.map(key=>{
        //         const value = result.apiResponse[key];
        //         if(value) imageExifInfo.push(<p>[{key}]=>{value}</p>);
        //     });
        //     listData[params.key].imageExifInfo = imageExifInfo;
        //     this.setState({listData});
        // }

        if (params.viewWhat == "imageDetailInfo") {
          modal.body = this.getImageDetailContent(result.apiResponse);
          listData[params.key].imageDetailInfo = modal.body;
          this.setState({ modal });
        }

      });
    }
  };

  //根据请求结果 组装弹框需要内容
  getImageDetailContent(data) {
    let imgId = (data.image.providerAgentType == 2) ? 'cfpGicId' : 'providerResId';

    let address = [];
    ['country', 'province', 'city', 'location'].forEach(item => {
      if (data.image[item]) {
        address.push(data.image[item]);
      }
    });
    data.image.address = address.join('/');

    var titleList = [["resId", "图片ID"], [imgId, "原始图片ID"], ["chicun", "图片尺寸"], ["providerName", "供应商"], ["providerId", "供应商ID"], ["dateCameraShot", "拍摄时间"], ["address", "拍摄地点"], ["qualityRank", "图片等级"], ["providerUsageRestrictions", "限制信息"]],
      showKeys = {
        "dateTimeOriginal": "原始日期时间",
        "dateModified": "修改时间",
        "modifiedSoftware": "修改程序",
        "exposureMode": "曝光模式",
        "focalLength": "焦距",
        "flash": "闪光灯",
        "meteringMode": "测光模式",
        "whiteBalance": "白平衡",
        "resolution": "分辨率",
        "fileSize": "尺寸",
        "colorSpace": "色彩空间",
        "size": "大小",
        "iso": "感光度",
        "exposureTime": "快门速度",
        "fNumber": "光圈值",
        "make": "相机制造商",
        "model": "机型",
        "lens": "镜头"
      };
    //const showKeys=["fileSize","xResolution","yResolution","software","fileModifiedDate","exposureTime","fNumber","isoEquiv","dateTimeDigitized","dateTimeOriginal","exposureMode","resolution"];

    var imageDetailInfo = titleList.map((title, i) => {
      // console.log(title);
      return (
        <div className="row mt-10">
          <div className="col-xs-5">{title[1]}</div>
          <div className="col-xs-7">{data.image[title[0]] || "---"}</div>
        </div>
      )
    });


    var imageExifInfo = <div></div>;

    if (data.exif) {

      imageExifInfo = Object.keys(showKeys).map((title, i) => {
        return (
          <div className="row mt-10">
            <div className="col-xs-5">{(`${title}(${showKeys[title]})`)}</div>
            <div className="col-xs-7">{data.exif[title] ? data.exif[title] : "---"}</div>
          </div>
        )
      });

    }
    //console.log('data.image',data.image);
    return (
      <div className="row">
        <div className="col-xs-5">
          <div style={{ width: '400px', height: '400px', display: 'table-cell' }}>
            <img onClick={() => {
              if (data.image.ossYuantu) this.viewPic({ type: 'origin', resImageId: data.image.id })
            }} src={(data.image.ossYuantu && data.image.oss400) ? data.image.oss400 : this.defaultImage}
              onError={this.onLoadImgError.bind(this)} />
          </div>
        </div>
        <div className="col-xs-7">
          <h5 className="text-center mt-15">图片信息</h5>
          {imageDetailInfo}
          <h5 className="text-center mt-15">EXIF信息</h5>
          {imageExifInfo}
        </div>
      </div>
    )
  }

  //图片悬浮关闭弹框 不需要数据处理
  closeImageModal() {
    let { modal } = this.state;
    modal.visible = false;
    this.setState({ modal });
  };

  onLoadImgError(e) {
    e.target.src = this.defaultImage;
  };

  viewPic(params) {
    if (params.type == 'origin') {
      window.open('/api/zh' + editorUrl + "/image/viewYuantu?resImageId=" + params.resImageId);
      return false;
    }

    const { dispatch, alertHandle, types } = this.props;
    dispatch(viewEditPic(params)).then((result) => {
      if (result.apiError) {
        message.error(result.apiError.errorMessage, 3);
        return false
      }

      if (params.type == 'origin') {
        window.open('/api/zh/' + editorUrl + "/image/viewYuantu?resImageId=" + params.resImageId);
      } else if (params.type == 'middle') {
        const { oss800, ossYuantu } = result.apiResponse;
        const imageMaxHeight = window.innerHeight - 240;
        // const width = types === 'editStepOne' ? 500 : 840;
        alertHandle({
          "title": "查看中图: ID-" + params.resId,
          "width": 840,
          "wrapClassName": 'imageModal',
          // "height": 540,
          "contentShow": "body",
          "body": <div className={cs('text-center', { 'modal-middle': types !== 'editStepOne' })}>
            <img style={{ cursor: 'pointer', 'max-width': 800, 'max-height': imageMaxHeight }} onClick={() => {
              window.open('/api/zh' + editorUrl + "/image/viewYuantu?resImageId=" + params.resImageId);
            }} src={oss800} />
          </div>,
          "dragable": true,
          "isFooter": false
        })
      }
    });
  };
}
