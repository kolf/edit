import React, {Component, PropTypes} from "react"
import {Link}             from "react-router";
import QueueAnim      from 'rc-queue-anim';

import Spin   from "antd/lib/spin";
import Button from "antd/lib/button";
import Tooltip from "antd/lib/tooltip";
import {BackTop} from 'antd';
import Tag from "antd/lib/tag";
import moment from "moment";

import "./table.css"

const totalCol = {
  "field": "total",
  "text": "数量",
  "type": "status",
  "isFun": "callbackStatusTotal"
};

const groupIdCol = {
  "field": "groupId",
  "text": "组照ID|数量",
  "status": false,
  "type": "checkbox"
};

export default class TableBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "doing": "doing",
      "animate": false,
      "types": "",
      "operate": "",
      "idField": "id",
      "isTitle": "title",
      "noTitle": false,
      "head": [
        {
          "field": "index",
          "text": "序号",
          "type": "num",
          "width": 50
        },
        {
          "field": "oss176",
          "text": "组照",
          "type": "image",
          "width": 210
        },
        {
          "field": "operate",
          "text": "操作",
          "type": "operate",
          "value": []
        },
        {
          "field": "groupId",
          "text": "组照ID/数量",
          "type": "status",
          "isFun": "callbackGroupIdAndTotal"
        },
        {
          "field": "uploadTime",
          "text": "上传时间/编审时间",
          "type": "status",
          "isFun": "callbackUploadTimeAndEditTime"
        },
        {
          "field": "categoryNames",
          "text": "分类"
        },
        {
          "field": "providers",
          "text": "供应商",
          "type": "status",
          "isFun": "callbackProviders"
        },
        {
          "field": "topicIds",
          "text": "所属专题",
          "type": "status",
          "isFun": "callbackTopicIds"
        },
        {
          "field": "pushResult",
          "text": "已推送",
          "type": "status",
          "isFun": "callbackPushResult"
        }
      ],
      "list": props.list,
      "selectStatus": props.selectStatus || [],
      "maskLoading": false,
      "listSelectData": {      // 选择列表数据
        "ids": [],           // id []
        "keys": [],          // key []
        "list": [],          // 选择数据 item []
        "listInit": []       // 选择原始数据 item []
      },
      "viewTimer": null,
      resGroup: props.resGroup,
      // maskLoading: false
    };

    // 合并父组件传过来的表实体
    Object.assign(this.state, this.props.tableInit);
    // //console.log(this.state);
    this.loop = 1;

    this.defaultImage = require('app/assets/default.jpg');
  };

  componentWillMount() {
    //const {resGroup} = this.props;
    //if(resGroup == 1){
    //    this.state.head.splice(3, 0, totalCol, groupIdCol);
    //}
  }

  componentDidMount() {
    this.state.maskLoading = false;
  }

  componentWillReceiveProps(nextProps) {
    let {doing, animate, types, operate, head, list, selectStatus, resGroup, maskLoading} = this.state;

    // //console.log(nextProps, this.state, '-----------------');

    if (maskLoading != nextProps.maskLoading) this.setState({"maskLoading": nextProps.maskLoading});
    if (!_.isEqual(animate, nextProps.animate)) this.setState({"animate": nextProps.animate});
    if (!_.isEqual(types, nextProps.types)) this.setState({"types": nextProps.types});
    if (!_.isEqual(operate, nextProps.operate)) this.setState({"operate": nextProps.operate ? nextProps.operate : operate});

    if (nextProps.tableInit && nextProps.tableInit.list) {
      selectStatus = _.fill(new Array(nextProps.tableInit.list.length), false);
      const tableInit = nextProps.tableInit;
      Object.assign(this.state, tableInit, selectStatus);
      // this.state.list = tableInit.list;

      // 以防万一
      this.setState({
        maskLoading: false
      })
    }

    //if(nextProps.resGroup!= resGroup) {
    //    this.state.resGroup = nextProps.resGroup;
    //    const totalIndex = this.state.head.findIndex(item => item.field === 'total');
    //
    //    if(this.state.resGroup == 2 && totalIndex>-1){ //单张没有数量并且有数量这一项
    //        this.state.head.splice(totalIndex, 2);
    //    }else if(this.state.resGroup == 1 && totalIndex===-1){ //组照没有数量并且有数量这一项
    //        this.state.head.splice(3, 0, totalCol, groupIdCol);
    //    }
    //}

    this.state.list = nextProps.tableInit ? nextProps.tableInit.list : nextProps.list;

    //console.log(this.state.list);
    // }
    if (doing != nextProps.doing) {
      switch (nextProps.doing) {
        case "selectAll": // 全选
          this.setSelectStatus({type: 'all'});
          break;
        case "selectCancel": // 取消
          this.setSelectStatus({type: 'cancel'});
          break;
        case "selectInvert": // 反选
          this.setSelectStatus({type: 'invert'});
          break;
        case "selectAppointed": // 指定选择项 必须收集选中结果
          this.state.selectStatus = nextProps.selectStatus;
          this.setSelectStatus({type: 'selectAppointed'});
          break;
        case "refresh": // 刷新 传递有selectStatus用父组件的selectStatus 否则为空
          this.state.selectStatus = nextProps.selectStatus || [];
          break;
        default:
        //console.log(nextProps.doing);
      }
      //this.state.doing = nextProps.doing;
    }
  };

  setSelectStatus({type, key}) { // 设置选择状并获得选择数据
    if (!this.props.updateData) return;

    let {list, selectStatus} = this.state;
    if (!list) return false;
    if (type == 'all') {
      selectStatus = _.fill(new Array(list.length), true);
    }
    if (type == 'cancel') {
      selectStatus = _.fill(new Array(list.length), false);
    }
    if (type == 'invert') {
      selectStatus = [...selectStatus].map((val) => {
        return !val
      });
    }
    if (_.isNumber(key)) {
      selectStatus[key] = !selectStatus[key];
    }
    this.setState({selectStatus});
    this.getSelectList({list, selectStatus}); // 获得选择数据
    this.props.updateData({"doing": "setSelectStatus"});
  };

  getSelectList({list, selectStatus}) { // 获得选择数据
    let {listSelectData} = this.state;
    listSelectData = {
      "ids": [],
      "keys": [],
      "list": [],
      "listInit": []
    };
    [...list].map((item, i) => {
      if (selectStatus[i]) {
        listSelectData.ids.push(item.id);
        listSelectData.keys.push(item.key);
        listSelectData.list.push(item);
        listSelectData.listInit.push(item);
      }
    });
    this.state.listSelectData = listSelectData;
    if (this.props.updateData) this.props.updateData({listSelectData, "doing": "getSelectList"});
  };

  renderHead() {
    const {head} = this.state;
    // const len = head.length;
    // let tdWidth = Math.floor((1/len) * 100) + 1.2 + '%';
    return (
      <thead>
      <tr>
        { [...head].map((item, i) => {
          const {field, text, type, status, width} = item;
          let title;
          switch (type) {
            case "checkbox":
              // {this.state.checkbox.text}
              title = (
                <span>
                    {status && <label className="hand" onClick={this.handleOnCheckboxAll.bind(this)}>
                      <input type="checkbox"
                             checked={this.state.selectStatus && this.state.selectStatus[i]}
                             className="ace"/>
                      <span className="lbl"> </span>
                    </label>}
                  {text}
                </span>
              );
              break;
            default :
              title = text;
          }
          // if(i==len-1){
          //     tdWidth = "";
          // }
          return (
            <th key={i} width={width || ''}>{title}</th>
          )
        })}
      </tr>
      </thead>
    )
  };

  renderBody() {
    const {idField, isTitle, doing, animate, types, operate, head, list, selectStatus, noTitle} = this.state;
    const colSpan = head.length;
    if (list.length == 0) {
      return <tr>
        <td colSpan={colSpan} style={{padding: 10, textAlign: 'center'}}>暂无数据</td>
      </tr>
    }


    const body = [...list].map((tr, key) => {
      const element = this.renderBodyTr(tr, key);
      return [
        <tr key={isTitle + '_' + key}
            className={selectStatus[key] ? "border-active" : ""}>
          {!noTitle && <th colSpan={colSpan}><p>{tr[isTitle] || '-'}</p></th>}
        </tr>, element];
    });
    return (
      <tbody className="table-editor">
      {body}
      </tbody>
    )
  };

  renderBodyTr(tr, key) {
    const {idField, isTitle, doing, animate, types, operate, head, list, selectStatus} = this.state;
    const id = tr[idField];
    const len = head.length;
    const groupId = tr["groupId"];
    const groupIds = tr["groupIds"];
    const groupState = tr["groupState"];
    const onlineState = tr["onlineState"];
    const offlineReason = tr["offlineReason"];

    return (
      <tr
        key={key}
        className={ selectStatus[key] ? "border-active" : ""}
        onClick={this.setSelectStatus.bind(this, {key}) }
        onDoubleClick={this.handleOnDouble.bind(this, {"operate": 'viewGroup', key, id, groupId, tr, groupIds})}>
        {[...head].map((item, i) => {
          const {field, type, status, isFun, render, textLeng, isHtml} = item;

          let td_tag, imageCenter = null, val = tr[field];

          switch (type) {
            case "checkbox":
              td_tag = (
                <label>
                  {status && <input type="checkbox" value={id}
                                    defaultChecked={this.state.selectStatus && this.state.selectStatus[key]}
                                    className="ace"/>}
                  <span
                    className={this.state.selectStatus && this.state.selectStatus[key] ? "checkbox_focus checkbox_active" : "checkbox_focus"}> {val}</span>
                </label>
              );
              break;
            case "image":
              // const image = require('app/assets/images/gallery/thumb-5.jpg');
              imageCenter = {"textAlign": "center"};
              td_tag = (
                <div style={{"height": "178px"}} className="mt-10 mb-10">
                  <div>
                    <img alt="找不到图片" src={val ? val : this.defaultImage} onError={this.onLoadImgError.bind(this) }/>
                  </div>
                  {onlineState == 3 && <div className="reason-tip" title={(offlineReason || '')}>
                    <Tag color="#f50" title={'下线原因：' + (offlineReason || '')}>{_.trunc((offlineReason || ''), 10)}</Tag>
                  </div>}
                </div>
              );
              break;
            case "expand":
              const {expand} = this.state;
              const icon = expand.data[id] ? expand.data[id].icon : expand.init.icon;
              td_tag = (
                <span>
                    <i className={icon} onClick={this.handleOnExpand.bind(this, id)}
                    ></i> {val}
                </span>
              );
              break;
            case "field":
              td_tag = (
                <span onClick={this.handleOnClick.bind(this, {"operate": field, key, id, tr})}
                      className="text-primary hand" title={val}>{val}</span>
              );
              break;
            case "link":
              if (!val) {
                td_tag = ''
              } else if (this.props.types == "editorBase") {
                td_tag = (<a onClick={() => {
                  window.open("/provider/" + tr['providerId'] + "/edit");
                }} title={val}>{val}</a>);
              } else {
                const href = item.href ? item.href + id : '/' + idField + '/' + id;
                td_tag = (<a href={href} title={val}>{val}</a>);
              }
              break;
            case "status":
              if (isFun) {
                td_tag = this[isFun](tr);
              } else {
                td_tag = item.value[val];
              }
              break;
            case "select":
              td_tag = this.renderSelect({"defaultValue": tr[item.field], key, id, "value": [...item.value], groupIds});
              break;
            case "operate":
              td_tag = this.renderOperate({
                key,
                id,
                groupId,
                groupState,
                onlineState,
                tr,
                "value": [...item.value],
                groupIds
              });
              break;
            case "num":
              td_tag = key + 1;
              break;
            case "groupId":
              break;
            default:
              td_tag = val;
          }

          let textHtml = '';
          if (render) {
            textHtml = (<td style={imageCenter} key={i}>{render(id, groupId, tr)}</td>);
          } else {
            const titleContent = typeof td_tag !== 'object' ? item.text + '：' + td_tag : '';

            textHtml = (
              <td style={imageCenter} key={i}>
                {isHtml ? <div className="word-wrap position-relative" title={titleContent} dangerouslySetInnerHTML={{ __html: textLeng ? _.trunc(td_tag, textLeng) : td_tag }} /> : <div className="word-wrap position-relative" title={titleContent}>{textLeng ? _.trunc(td_tag, textLeng) : td_tag}</div>}

              </td>
            )
          }
          return textHtml;
        })}
      </tr>
    )
  };

  renderSelect({defaultValue, key, id, value}) {
    const html = value.map((item, i) => {
      return (
        <option value={item.id} key={i}>{item.text}</option>
      )
    });
    return (
      <select id={'j_select_' + id} defaultValue={defaultValue}
              onChange={this.handleOnClick.bind(this, {operate, "key": key, "id": id})}>
        {html}
      </select>
    )
  };

  renderOperateIcon({item, key, groupId, groupState, olineState, id, tr, groupIds}, col) {
    const {operate, text, icon, isOp} = item;
    return (
      <Button disabled={!isOp} title={text} shape="circle" icon={icon}
              onClick={this.handleOnClick.bind(this, {operate, key, id, groupId, tr, groupIds}) }
              style={{margin: "4px 4px 4px 0"}}></Button>
    );
  };

  renderOperateText({item, key, groupId, id}, col) {
    const {operate, text, href} = item;
    let text_tag;
    if (operate == "link") {
      const url = href + id;
      text_tag = (<a href={url} title={text} className="hand" key={i}>{text}</a>);
    } else {
      text_tag = (
        <span id={'j_' + operate + '_' + key + '_' + col}
              onClick={this.handleOnClick.bind(this, {operate, "key": key, id, groupId})}
              className="text-primary hand" key={i}>{text}</span>
      );
    }
    return text_tag;
  };

  renderOperate({key, id, groupId, groupState, onlineState, tr, value, groupIds}) {
    const {resGroup, projectName} = this.props;
    let op_config = [
      {"text": "编审", "icon": "edit", "operate": "edit", "isOp": true},
      {"text": "添加到待编审", "icon": "addfile", "operate": "addToNoEdit", "isOp": false},
      {"text": "推送", "icon": "menu-unfold", "operate": "push", "isOp": true},
      {"text": "加入专题", "icon": "select", "operate": "addToTopic", "isOp": true},
      {},
      {"text": "前台链接", "icon": "link", "operate": "accessLink", "isOp": true},
      {"text": "推荐", "icon": "like-o", "operate": "share", "isOp": true},
      {"text": "编审记录", "icon": "file-text", "operate": "viewEditHistory", "isOp": true},
      {"text": "批注记录", "icon": "file", "operate": "viewPostilHistory", "isOp": true},
      {"text": "更新上线时间", "icon": "clock-circle-o", "operate": "refreshImage", "isOp": true}
    ];

    if (groupState == "1") { // 未编审
      op_config[1].isOp = true;
    }

    if (onlineState == "1") {
      op_config[4] = {"text": "下线", "icon": "arrow-down", "operate": "offline", "isOp": true};
    } else {
      op_config[4] = {"text": "上线", "icon": "arrow-up", "operate": "online", "isOp": true}
    }

    if (resGroup == 2) { //单张
      op_config = [
        {"text": "编审", "icon": "edit", "operate": "edit", "isOp": true, "isShow": true},
        {"text": "收藏", "icon": "star-o", "operate": "addToFavorite", "isOp": true, "isShow": true}
      ]
    }

    if (projectName == 'en') {
      op_config[1].hide = true;
    }

    const item_tag = [];
    let lineTag = [];
    op_config.map((item, col) => {
      if (item.hide) {
        return null
      }
      let text_tag = [];
      const opt = {item, key, id, groupId, tr, groupIds};
      if (item.icon) {
        text_tag = this.renderOperateIcon(opt, col);
      } else {
        text_tag = this.renderOperateText(opt, col);
      }


      item_tag.push(lineTag);
      item_tag.push(text_tag);
      lineTag = [];
    });

    return (
      <span id={'j_operate_' + id}>{item_tag}{lineTag}</span>
    )
  };

  tableRender() {
    return (
      <table style={{tableLayout: "fixed"}} className="table table-striped table-bordered table-hover table-condensed">
        {this.renderHead()}
        {this.renderBody()}
      </table>);
  };

  render() {
    const {idField, doing, animate, types, operate, head, list, selectStatus, maskLoading, wrapClassName} = this.state;
    let tpl = "";
    if (!list) {
      // tpl = <div className="row"><div className="col-xs-12"><div className="thumbnail-loading"><Spin tip="加载中..." /></div></div></div>;
    } else {
      tpl = this.tableRender();
    }

    let className = 'table-responsive ' + wrapClassName;

    return (
      <Spin spinning={maskLoading} tip="加载中...">
        <BackTop />
        <div id={"j-" + (idField ? idField : "table") + (this.loop++)} className={className}>
          {animate &&
          <QueueAnim delay={100} interval={70}>
            {tpl}
          </QueueAnim>
          }
          {!animate && tpl}
        </div>
      </Spin>
    );
  };

  handleOnClick(params, e) {
    e.stopPropagation();
    if (this.props.onTable) this.props.onTable(params);
  };

  handleOnDouble(params, e) {
    e.stopPropagation();
    if (this.props.onTable) this.props.onTable(params);
  };

  handleOnExpand(event, {id, operate}) {
    event.preventDefault();
    const {expand} = this.state;
    const open = !(expand.data[id] ? expand.data[id].open : expand.init.icon.open);
    const {idField, list} = this.props;
    list.forEach((item) => {
      const idn = item[idField];
      this.state.expand.data[idn] = expand.init;
    });
    this.setState({
      "expand": {
        "init": expand.init,
        "data": expand.data
      }
    });
    this.state.expand.data[id] = {
      "open": open,
      "icon": open ? "arrow fa fa-minus blue bigger-110 hand" : "arrow fa fa-plus blue bigger-110 hand",
      "tr": open ? "fade in" : "hidden"
    };
    this.setState({
      "expand": {
        "init": expand.init,
        "data": expand.data
      }
    });
    this.handleOnClick(event);
  };


  callbackStatusTotal(item) {
    const onlineCount = item.onlineCount || 0;
    const resCount = item.resCount || 0;
    return (
      <span>
                <span>上线数: {onlineCount}</span>
                <samp>|</samp>
                <span>总数: {resCount}</span>
            </span>
    );
  };

  callbackcreatedTime(item) {
    return item.createdTime ? moment(item.createdTime).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00"
  };

  onLoadImgError(e) {
    e.target.src = this.defaultImage;
  };

  callbackAssetFamily(item) {
    const val = {'1': '编辑类', '2': '创意类', '3': '编辑类&创意类', '4': '公关'};
    return val[item.assetFamily] ? val[item.assetFamily] : '无';
  };

  callbackQualityRank(item) {
    const val = {'1': 'A+', '2': 'A', '3': 'B', '4': 'C', '5': 'D'};
    return val[item.qualityRank] ? val[item.qualityRank] : '无';
  };

  callbackStatus(item) {
    const val = {'3': '有效', '5': '冻结', '6': '关闭'};
    return val[item.status] ? val[item.status] : '无';
  };

  callbackSex(item) {
    const val = {'1': '男性', '2': '女性'};
    return val[item.sex] ? val[item.sex] : '无';
  };

  callbackJobType(item) {
    const val = {'1': '媒体', '2': '非媒体'};
    return val[item.jobType] ? val[item.jobType] : '无';
  };

  callbackName(item) {
    return <a onClick={this.viewContacts.bind(this, item.id)}>{item.nameCn}</a>;
  };

  callbackIsDefault(item) {
    return item.isDefault == 0 ? '不是' : '是';
  };

  callbackGroupIdAndTotal(item) {
    const onlineCount = item.onlineCount || 0;
    const resCount = item.resCount || 0;
    const groupId = item.groupId || '';
    return (
      <div>
        <p title={'组照ID：' + groupId}>{groupId}</p>
        <p className="mt-5">
          <span title={'上线数: ' + onlineCount}>上线数: {onlineCount}</span><samp>|</samp><span
          title={'总数: ' + resCount}>总数: {resCount}</span>
        </p>
      </div>
    );
  };

  callbackUploadTimeAndEditTime(item) {
    // const uploadTime = item.uploadTime ? moment(item.uploadTime).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00";
    // const editTime = item.editTime ? moment(item.editTime).format("YYYY-MM-DD HH:mm:ss") : "0000-00-00 00:00:00";
    // const editUserName = item.editUserName || '';
    const {uploadTime, editTime, editUserName} = item;

    return (
      <div>
        {uploadTime && <p title={'上传时间：' + uploadTime}>{uploadTime}</p>}
        {editTime && <p className="mt-5" title={'编审时间：' + editTime}>{editTime}</p>}
        {editUserName && <p className="mt-5" title={'编审人：' + editUserName}>{editUserName}</p>}
      </div>
    );
  };

  callbackTopicIds(item) {
    let topicIdsArr = [];
    item.topicIds && item.topicIds.length && item.topicIds.map((it, i) => {
      let itStr = <p><a href={'https://www.vcg.com/topic/' + it.id} target="_blank"
                        title={'所属专题：' + it.name + ' (' + it.id + ')'}>{it.name + ' (' + it.id + ')'}</a></p>;
      if (i != 0) itStr = <p className="mt-5"><a href={'https://www.vcg.com/topic/' + it.id} target="_blank"
                                                 title={'所属专题：' + it.name + ' (' + it.id + ')'}>{it.name + '(' + it.id + ')'}</a>
      </p>;
      topicIdsArr.push(itStr);
    });
    return (
      <div>{topicIdsArr}</div>
    );
  };

  callbackProviders(item) {
    let providersArr = [];
    item.providers && item.providers.length && item.providers.map((it, i) => {
      let itStr = <p><a href={'/provider/' + it.id + '/edit'} target="_blank"
                        title={'供应商：' + it.providerName + ' (' + it.id + ')'}>{it.providerName + ' (' + it.id + ')'}</a>
      </p>;
      if (i != 0) itStr = <p className="mt-5"><a href={'/provider/' + it.id + '/edit'} target="_blank"
                                                 title={'供应商：' + it.providerName + ' (' + it.id + ')'}>{it.providerName + ' (' + it.id + ')'}</a>
      </p>;
      providersArr.push(itStr);
    });
    return (
      <div>{providersArr}</div>
    );
  };

  callbackPushResult(item) {
    let pushArr = [];
    item.pushResult && item.pushResult.length && item.pushResult.map((name, i) => {
      let itStr = <p><span title={'已推送：' + name}>{name}</span></p>;
      if (i != 0) itStr = <p className="mt-5"><span title={'已推送：' + name}>{name}</span></p>;
      pushArr.push(itStr);
    });
    return (
      <div>{pushArr}</div>
    );
  };

  enterText(item) {
    return item.vcgUserName && item.vcgUserName.split(',').map(item => <p>{item}</p>)
  }

}
