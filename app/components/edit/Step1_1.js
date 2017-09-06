import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {getStorage} from "app/api/auth_token";
import {editorUrl} from "app/api/api_config.js";
import ThumbnailBox from "app/components/provider/thumbnail";
import Affix from "antd/lib/affix";
import Pagination from "antd/lib/pagination";
import Button from "antd/lib/button";
import Radio from "antd/lib/radio";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";
import {Checkbox, message} from "antd";

const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

import {
  getEditData,
  setCreditLine,
  setTimeliness,
  editPostData,
  publishPushto,
  editSavePostData,
  getFavoriteList,
  postFavoriteItem,
  allNoPass,
  findlocaltion,
  findKeyword,
  addKeyword,
  modifyKeyword,
  getKeywordById,
  viewEditPic,
  removeEditPic
} from "app/action_creators/edit_action_creator";
import {queryReason} from "app/action_creators/editor_action_creator";
import {favoriteQuery, favoriteItemAdd} from "app/action_creators/person_action_creator";
import {offlineOptions} from "app/utils/dataType";
import {isElite, decode, isEn} from "app/utils/utils";

const RadioGroup = Radio.Group;

const radioStyle = {
  display: 'block',
  height: '24px',
  lineHeight: '24px'
};

@connect((state) => ({
  "error": state.edit.error,
  "reasonData": state.edit.reasonData
}))
export default class Step1_1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "doing": props.doing,
      "groupData": props.groupData,
      "filterParams": props.filterParams,
      "listData": props.listData,
      "maskLoading": props.maskLoading,
      "showCaption": false,    // true/false show/hidden
      "selectStatus": props.selectStatus,
      "listSelectData": {      // 选择列表数据
        "ids": [],           // id []
        "keys": [],          // key []
        "list": []           // 选择数据 item []
      },
      "keywordsDic": {},       // 关键词字典
      "alert": {
        "show": false,
        "isButton": true,
        "bsSize": "small",
        "onHide": this.closeAlert.bind(this),
        "title": null,
        "contentShow": "body",
        "body": null,
        "params": {},
        "submitAlert": null,
        "isLoading": false
      },
      hidePushed: false,
      hideReject: false,
      hideSelected: false
    };
    this.setSwing = (swing, direction) => {
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

  };

  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    const {doing, groupData, filterParams, listData, maskLoading, keywordsDic, selectStatus} = this.state;

    if (!_.isEqual(doing, nextProps.doing)) this.state.doing = nextProps.doing;
    if (!_.isEqual(selectStatus, nextProps.selectStatus)) this.state.selectStatus = nextProps.selectStatus;
    if (!_.isEqual(groupData, nextProps.groupData)) this.setState({groupData: nextProps.groupData});
    if (!_.isEqual(filterParams, nextProps.filterParams)) this.setState({filterParams: nextProps.filterParams});
    if (!_.isEqual(maskLoading, nextProps.maskLoading)) this.setState({maskLoading: nextProps.maskLoading});
    if (!_.isEqual(_.pluck(listData, 'id'), _.pluck(nextProps.listData, 'id'))) this.setState({listData: nextProps.listData});
    if (!_.isEqual(_.keys(nextProps.keywordsDic), _.keys(keywordsDic))) this.setState({keywordsDic: nextProps.keywordsDic});

    switch (nextProps.doing) {
      case "selectAll": // 全选
        this.setSelectStatus('all');
        break;
      case "selectCancel": // 取消
        this.setSelectStatus('cancel');
        break;
      case "selectInvert": // 反选
        this.setSelectStatus('invert');
        break;
      case "selectAppointed": // 指定选择
        this.setSelectStatus('appointed');
        break;
      default:
      //this.setSelectStatus('cancel');
    }
  };

  openAlert(config) {

    const {alertHandle} = this.props;

    const alert = Object.assign(this.state.alert, {
      "show": true,
      "isLoading": false,
      "contentShow": "body",
      "params": {},
      "maskClosable": false,
      "dragable": true
    }, config);

    // this.setState({alert});
    alertHandle(alert);
  };

  closeAlert() {
    this.props.alertHandle();
  };

  setSelectStatus(type) {
    if (type == "all") this.setState({"doing": "selectAll"});
    if (type == "cancel") this.setState({"doing": "selectCancel"});
    if (type == "invert") this.setState({"doing": "selectInvert"});
    if (type == "appointed") this.setState({"doing": "selectAppointed"});
  };

  updateData({doing, listData, selectStatus, listSelectData, update}) { // set value
    //console.log('step1_1---updateData',doing,selectStatus,listSelectData);

    if (doing) this.state.doing = doing;
    if (listData) this.state.listData = listData;
    if (selectStatus) this.state.selectStatus = selectStatus;
    if (listSelectData) this.state.listSelectData = listSelectData;

    if (this.props.updateData) this.props.updateData({doing, listData, selectStatus, listSelectData, update});
  };

  render() {
    const {dispatch, alertHandle} = this.props;
    const {alert, doing, groupData, filterParams, listData, selectStatus, keywordsDic, hidePushed, hideReject, maskLoading, showCaption, hideSelected} = this.state;

    const thumbnailConfig = {
      doing,
      maskLoading,
      showCaption,
      selectStatus,
      keywordsDic,
      dispatch,
      lists: listData,
      groupId: filterParams.ids,
      operate: filterParams.operate,
      types: "editStepOne",
      alertHandle: alertHandle,
      onThumbnail: this.handleOnThumbnail.bind(this),
      updateData: this.updateData.bind(this),
      setSwing: this.setSwing.bind(this)
    };

    //console.log('step1_1---',groupData,listData);

    return (
      <div style={{"overflow": "hidden"}}>

        {filterParams.step == 1 && <Affix offsetTop={45} className="affix_edit">
          <div className="row operate mt-5">
            <div className="col-xs-11">
              <a onClick={this.setSelectStatus.bind(this, 'all')}>全选</a>
              <samp>|</samp>
              <a onClick={this.setSelectStatus.bind(this, 'invert')}>反选</a>
              <samp>|</samp>
              <a onClick={this.setSelectStatus.bind(this, 'cancel')}>取消</a>

              {((operate) => {
                if (operate === 'edit' || operate === 'editen') {
                  return <span>
                                        <RadioGroup operate="radio" value={groupData ? groupData.timeliness : 0}
                                                    style={{"marginLeft": "10px"}} onChange={e => {
                                          if (!groupData.id) return false;
                                          groupData.timeliness = e.target.value;
                                          this.setState({groupData});
                                          if (this.props.updateData) this.props.updateData({groupData});
                                        }}>
                                            <Radio key="a" value={0}>时效图</Radio>
                                            <Radio key="b" value={1}>资料图</Radio>
                                        </RadioGroup>
                                        <Button onClick={this.addToFavorite.bind(this)}>收藏</Button>
                                        <Button onClick={this.downloadPicture.bind(this)}>下载</Button>
                                        <Button onClick={this.setTop.bind(this)}>排序</Button>
                                        <Button onClick={this.setApplicationTop.bind(this)}>排序预览</Button>
                                        <Button onClick={this.setQualityRank.bind(this)}>设置等级</Button>
                                        <Button onClick={this.setCreditLine.bind(this)}>修改署名</Button>
                                        <Button loading={alert.isLoading}
                                                onClick={this.setRotation.bind(this, {"direction": "left"})}>左旋转</Button>
                                        <Button loading={alert.isLoading}
                                                onClick={this.setRotation.bind(this, {"direction": "right"})}>右旋转</Button>
                                        <Button onClick={this.showPriceModal.bind(this)}>设置时效限价</Button>
                                        <Button onClick={this.setRejectReason.bind(this)}>设置不通过原因</Button>
                                        <Button onClick={this.setOffline.bind(this, {
                                          operate: "offlineMark",
                                          value: ''
                                        })}>下线</Button>
                                        <Button onClick={this.setOnline.bind(this)}>上线</Button>
                                        <Button onClick={this.removePic.bind(this)}>移除</Button>
                                        <Button onClick={() => {
                                          this.setState({showCaption: !showCaption});
                                        }}>{showCaption ? '隐藏图说' : '显示图说'}</Button>
                                    </span>
                } else if (operate === 'push') {
                  return <span style={{marginLeft: 10}}>
                                        <Button type={hidePushed ? 'primary' : ''}
                                                onClick={this.hideListItem.bind(this, 'Pushed')}>{hidePushed ? '显示已推送' : '隐藏已推送'}</Button>
                                        <Button type={hideReject ? 'primary' : ''}
                                                onClick={this.hideListItem.bind(this, 'Reject')}>{hideReject ? '显示不通过' : '隐藏不通过'}</Button>
                                        <Button type={hideSelected ? 'primary' : ''}
                                                onClick={this.hideListItem.bind(this, 'Selected')}>{hideSelected ? '显示已选' : '隐藏已选'}</Button>
                                        <Button onClick={this.setCreditLine.bind(this)}>修改署名</Button>
                                        <Button onClick={() => {
                                          this.setState({showCaption: !showCaption});
                                        }}>{showCaption ? '隐藏图说' : '显示图说'}</Button>
                                    </span>
                }

              })(filterParams.operate)}
            </div>
            <div className="col-xs-1 text-right">
              {`共${listData ? listData.length : 0}张`}
            </div>
          </div>

        </Affix>}

        <div className="row">
          <div className="space-8"></div>
        </div>

        <ThumbnailBox  {...thumbnailConfig} />

      </div>
    );
  };

  // refresh(type, dataParams) {
  //     const {filterParams} = this.state;
  //     //console.error(type, dataParams,filterParams);
  //     if (type == "pagination") { // pagination
  //         Object.assign(filterParams, dataParams);
  //     }
  //     if (type == "filter") { // filter
  //         Object.assign(filterParams, dataParams, {"pageNum": 1});
  //     }
  //     if (type == "pagination" || type == "filter") {
  //         this.setState({filterParams});
  //     }
  //     this.queryList(filterParams);
  // };

  handleOnThumbnail({operate, key, id, resId, value, price, offlineReason, onlineState}) {
    // doing thing
    switch (operate) {
      case "addToFavorite": // 添加至收藏夹
        this.addToFavorite({key, id, resId});
        break;
      case "download":
        this.downloadPicture({key, id});
        break;
      case "origin":
        this.viewPicture({operate, key, id});
        break;
      case "middle":
        this.viewPicture({operate, key, id});
        break;
      case "selectPrice":
        this.showPriceModal({key, id, price, resId});
        break;
      case "offlineMark":
        this.setOffline({operate, key, id, value, offlineReason, onlineState});
        break;
      case "qualityRank":
        this.setQualityRank({id, value});
        break;
      case "remove": // 移除单张
        this.removePic({key, id});
        break;
      default:
        this.props.onThumbnail && this.props.onThumbnail({operate, key, id, resId, value});
    }
  };

  removePic({key, id}) {
    let {groupData, listData, listSelectData: {ids}, selectStatus} = this.state;
    if (!id && ids.length == 0) {
      message.info("请选择单张", 3);
      return false;
    }
    if (id) {
      selectStatus = _.fill(selectStatus, false);
      selectStatus[key] = true;
      this.setState({"doing": "selectAppointed", selectStatus});
    }
    const title = !id ? '移除多个单张' : "移除单张：ID-" + id;
    const body = !id ? '确定移除多个单张？' : "确定移除单张？";
    this.closeAlert();
    this.state.refreshTimer = setTimeout(() => {
      clearTimeout(this.state.refreshTimer);
      this.state.refreshTimer = null;
      this.openAlert({
        title,
        "contentShow": "body",
        "params": {},
        "body": <p className="alert alert-info text-center mt-15"><i
          className="ace-icon fa fa-hand-o-right bigger-120"></i> {body}</p>,
        "onOk": () => {
          const {dispatch} = this.props;
          let {groupData, listSelectData: {ids}} = this.state;
          dispatch(removeEditPic({groupId: groupData.id, ids: ids.length > 0 ? ids.join(',') : id})).then(result => {
            if (result.apiError) {
              message.error(result.apiError.errorMessage, 3);
              return false
            }
            if (result.apiResponse.length > 0) {
              message.warning('单张ID：(' + result.apiResponse.join(',') + ')只属于一个组ID:(' + groupData.id + ')，无法移除。', 4);
            } else {
              message.success('移除成功！', 3);
            }
            this.closeAlert();
            this.state.refreshTimer = setTimeout(() => {
              clearTimeout(this.state.refreshTimer);
              this.state.refreshTimer = null;
              this.props.refresh();
              if (ids.length == listData.length) window.location.reload();
            }, 1000);
          });
        },
        "isFooter": true
      });
    }, 300);
  };

  setQualityRank({id, value}) { // 设置等级
    const _this = this;
    const {listData, listSelectData} = this.state;
    const ids = id ? [].concat(id) : listSelectData.ids;
    if (!ids.length) {
      message.error('请选择要设置的图片');
      return false;
    }

    let recalls = id ? listData.filter(item => {
      return (item.id == id && item.offlineReason >= 9998)
    }) : listSelectData.list.filter(item => item.offlineReason >= 9998);

    if (recalls.length) { //有已撤图的图片
      this.openAlert({
        "bsSize": "small",
        "title": "系统提示",
        "contentShow": "body",
        "body": <div style={{"fontSize": 14, "padding": '20px 0', "textAlign": "center"}}>
          图片{recalls.map(item => item.id).join(',')}状态为已撤图，确认此操作后，撤图状态将会被重置</div>,
        "onOk": () => {
          _set(id, value);
        },
        "isFooter": true
      });
    } else {
      _set(id, value)
    }

    function _set(id, value) {
      //const {listData} = _this.state;

      if (id) { //设置单个不弹框
        // listData.forEach(item => {
        //     if(id==item.id){
        //         item.qualityRank = value;
        //         // item.offlineReason= '';
        //         // item.offlineMark= 0;
        //     }
        // });
        // _this.setState({listData});
        //console.log(_this);

        _this.props.onThumbnail({'operate': 'qualityRank', value, id});

        _this.closeAlert();
      } else {
        _this.openAlert({
          "bsSize": "small",
          "title": "设置等级",
          "contentShow": "qualityRank",
          "onOk": _this.submitSetQualityRank.bind(_this),
          "isFooter": true
        });
      }
    }
  };

  submitSetQualityRank() { // 设置等级
    const {alert} = this.state;

    if (_.isEmpty(alert.params.value)) {
      alert.params.submitMsg = "请设置选择项";
      this.props.alertHandle(alert);
      return false;
    }

    if (this.props.setSelectedList) this.props.setSelectedList({
      "key": "qualityRank",
      "value": alert.params.value,
      "position": "sync"
    });

    this.closeAlert();

    setTimeout(() => {
      this.setState({doing: 'selectCancel'})
    }, 300)
  };


  showPriceModal({id, price, key}) {
    const {listSelectData, listData} = this.state;
    let minSettingPrice = 30;

    if (!id) { // 多选
      if (listSelectData.ids.length == 0) {
        message.info("请选择单张");
        return;
      }
      minSettingPrice = Math.max(...listSelectData.list.map(item => item.collectionMinPrice*1 || 30))
      const onePrice = listSelectData.list[0].price
      price = listSelectData.list.every(item => item.price==onePrice) ? onePrice : -1;
      // console.log(price)
    }else{ // 单选
      minSettingPrice = listData[key].collectionMinPrice
    }

    this.openAlert({
      "bsSize": "small",
      "title": '设置时效限价',
      "params": {
        price: price*1,
        minSettingPrice
      },
      "contentShow": "priceModal",
      "onOk": this.setPrice.bind(this, id)
    });
  };

  setPrice(id) {
    const {alert, listData, listSelectData} = this.state;
    const {price} = alert.params;
    let ids = [];
    if (id) {
      ids.push(id);
    } else {
      ids = listSelectData.ids;
    }

    const minPriceMap = {
      0: 30,
      3: 500,
      4: 1000,
      5: 1500,
      9: 99999999
    }

    listData.forEach(item => {
      if (ids.indexOf(item.id) != -1) {
        item.price = price || 0,
        item.minPrice = minPriceMap[price]
      }
    });

    this.closeAlert();

    setTimeout(() => {
      this.setState({doing: 'selectCancel'})
    }, 300)
  };

  addToFavorite({id, resId}) { // 收藏
    let title = "";
    if (id) {
      title = "收藏单张：ID-" + resId;
    } else {
      title = "收藏多个单张";
      if (this.state.listSelectData.ids.length == 0) {
        message.info("请选择单张", 3);
        return;
      }
    }
    this.openAlert({
      "bsSize": "small",
      "title": title,
      "params": {
        "status": true,    // 已有 - 新的
        "favId": "",       // 已有 收藏夹 id
        "favName": ""      // 新的 收藏夹 name
      },
      "contentShow": "body",
      "onOk": this.submitAddToFavorite.bind(this, id)
    });
    const {filterParams} = this.state;
    const {dispatch} = this.props;
    dispatch(favoriteQuery({userId: filterParams.userId})).then(result => {
      if (result.apiError) {
        message.error(result.apiError.errorMessage, 3);
        return false
      }
      let favoriteOption = result.apiResponse.list;
      let {alert} = this.state;
      alert.contentShow = "favorite";
      alert.params.favoriteOption = favoriteOption;
      this.props.alertHandle && this.props.alertHandle(alert);
    });
  };

  submitAddToFavorite(id) {
    const {alert, listSelectData} = this.state;
    let ids = [];
    if (id) {
      ids.push(id);
    } else {
      ids = listSelectData.ids;
    }


    let param = {
      ids: ids.join(','),
      isGroup: 0
    };

    let {favId, favName, status} = alert.params;
    if (status) {
      if (!favId) {
        alert.params.submitMsg = "请选择已有收藏夹";
        this.props.alertHandle(alert);
        return false;
      }

      param.favId = favId;
      param.isNew = 0;
    } else {
      if (!favName) {
        alert.params.submitMsg = "请输入新收藏夹名";
        this.props.alertHandle(alert);
        return false;
      }
      param.name = favName;
      param.isNew = 1;
    }
    // alert.isLoading = true;
    this.setState({alert});
    const {dispatch} = this.props;

    delete alert.params.favoriteOption;
    delete alert.params.submitMsg;

    dispatch(favoriteItemAdd(param)).then(result => {
      if (result.apiError) {
        message.error(result.apiError.errorMessage);
        return false
      }
      // refresh();
      this.closeAlert();
      setTimeout(() => {
        this.setState({doing: 'selectCancel'})
      }, 300)
    });
  };

  setRotation({direction}) { // 设置左旋转

    if (this.state.listSelectData.ids.length == 0) {
      message.info("请选择单张", "3");
      return false;
    }

    // this.state.refreshTimer = setTimeout(() => {
    //     clearTimeout(this.state.refreshTimer);
    //     this.state.refreshTimer = null;
    //     if (this.props.setSelectedList) this.props.setSelectedList({
    //         "key": "rotate",
    //         direction,
    //         "position": "sync"
    //     });
    // }, 1000);

    if (this.props.setSelectedList) this.props.setSelectedList({
      "key": "rotate",
      direction,
      "position": "sync"
    });
  };

  getReasonData() {
    const {reasonData} = this.props;
    let reasonList = [];
    [...reasonData].map(item => {
      reasonList.push({...item});
    });
    return reasonList;
  };

  setRejectReason() { // 设置不通过原因
    const _this = this;
    const {alert, listSelectData} = this.state;
    if (listSelectData.ids.length == 0) {
      message.info("请选择单张", 3);
      return;
    }

    //console.log('setRejectReason---',this.props);

    const reasonList = this.getReasonData();
    const {otherValue} = alert.params;

    let recalls = listSelectData.list.filter(item => item.offlineReason >= 9998);

    if (recalls.length) { //有已撤图的图片
      this.openAlert({
        "bsSize": "small",
        "title": "系统提示",
        "contentShow": "body",
        "body": <div style={{"fontSize": 14, "padding": '20px 0', "textAlign": "center"}}>
          图片{recalls.map(item => item.id).join(',')}状态为已撤图，确认此操作后，撤图状态将会被重置</div>,
        "onOk": () => {
          _set(reasonList, otherValue);
        },
        "isFooter": true
      });
    } else {
      _set(reasonList, otherValue)
    }

    function _set(reasonList, otherValue) {
      _this.openAlert({
        "bsSize": "small",
        "title": "设置不通过原因",
        "contentShow": "imageRejectReason",
        "params": {
          reasonList,
          otherValue
        },
        "onOk": _this.submitSetRejectReason.bind(_this, {"key": 10, "value": "其他原因"})
      });
      // _this.closeAlert();
    }
  };

  submitSetRejectReason() {
    const {alert} = this.state;
    let {value, otherValue} = alert.params;

    if (_.isEmpty(value)) {
      alert.params.submitMsg = "请设置选择项";
      this.props.alertHandle(alert);
      return false;
    }

    value = value == 0 ? otherValue : value;

    if (this.props.setSelectedList) this.props.setSelectedList({
      "key": "imageRejectReason",
      value,
      "position": "sync"
    });

    this.closeAlert();

    setTimeout(() => {
      this.setState({doing: 'selectCancel'})
    }, 300)
  };

  setCreditLine() { // 修改署名
    if (this.state.listSelectData.ids.length == 0) {
      message.info("请选择单张", 3);
      return;
    }
    this.openAlert({
      "bsSize": "small",
      "title": "修改署名",
      "contentShow": "creditLine",
      "onOk": this.submitSetCreditLine.bind(this)
    });
  };

  submitSetCreditLine() {
    const {alert} = this.state;
    const {creditLine} = alert.params;
    if (!creditLine) {
      alert.params.submitMsg = "请输入署名";
      this.props.alertHandle(alert);
      return false;
    }

    if (this.props.setSelectedList) this.props.setSelectedList({
      "key": "creditLine",
      "value": creditLine,
      "position": "sync"
    });

    this.closeAlert();
    setTimeout(() => {
      this.setState({doing: 'selectCancel'})
    }, 300)
  };

  downloadPicture({id}) { // 下载
    const {alert, filterParams} = this.state;
    let ids = [];
    if (id) {
      ids.push(id);
    } else {
      if (this.state.listSelectData.ids.length == 0) {
        message.info("请选择单张", 3);
        return;
      }

      alert.show = false;
      this.setState({alert});
      ids = this.state.listSelectData.ids;
      if (ids.length == 0) {
        message.info("请选择单张", "3");
        return false;
      }
    }

    setTimeout(() => {
      this.setState({doing: 'selectCancel'})
    }, 300);
    window.open("/api/" + (isEn() ? 'en' : 'zh') + editorUrl + '/image/downLoadYuantu?groupId=' + filterParams.ids + '&resImageIds=' + ids.join(',') + '&token=' + filterParams.token);
  };

  setOffline({id}) {
    // let next = true;
    const _this = this;
    // if(id && onlineState == 2){
    //     message.error('图片还未上线，请选择已上线过的图片');
    //     return false;
    // }
    // if(!offlineReason) offlineReason = [];
    // offlineReason = Array.isArray(offlineReason) ? offlineReason : offlineReason.split(',');
    const {listSelectData, listData, alert} = this.state;

    const ids = id ? [].concat(id) : listSelectData.ids;
    if (!ids.length) {
      message.error('请选择要下线的图片');
      return false;
    }

    let recalls = id ? listData.filter(item => {
      return (item.id == id && item.offlineReason >= 9998)
    }) : listSelectData.list.filter(item => item.offlineReason >= 9998);

    const reasonList = this.getReasonData();

    if (recalls.length) { //有已撤图的图片
      this.openAlert({
        "bsSize": "small",
        "title": "系统提示",
        "contentShow": "body",
        "body": <div style={{"fontSize": 14, "padding": '20px 0', "textAlign": "center"}}>
          图片{recalls.map(item => item.id).join(',')}状态为已撤图，确认此操作后，撤图状态将会被重置</div>,
        "onOk": () => {
          showOfflineModal(ids, reasonList)
        },
        "isFooter": true
      });
    } else {
      showOfflineModal(ids, reasonList)
    }


    let offlineReason = '';
    function showOfflineModal(ids, reasonList) {
      _this.openAlert({
        "bsSize": "small",
        "title": "下线原因",
        "contentShow": "body",
        "body": <RadioGroup value={offlineReason} onChange={e => {
          offlineReason = e.target.value;
          showOfflineModal(ids, reasonList);
        }}>{reasonList.map(item => <Radio style={radioStyle} value={item.value}>{item.label}</Radio>)}</RadioGroup>,
        "params": {},
        // "onOk":  _this.submitOffline.bind(_this, ids, offlineReason),
        "onOk": () => {
            if(offlineReason == 9998) {
              _this.openAlert({
                "title": "撤图二次确认",
                "contentShow": "body",
                "body": <div style={{"fontSize": 14, "padding": '20px 0', "textAlign": "center"}}>撤图后不可售卖和任何操作，是否要撤图。</div>,
                "onOk": _this.submitOffline.bind(_this, ids, offlineReason),
                "isFooter": true
              })
            } else {
              _this.submitOffline.bind(_this, ids, offlineReason)()
            }
        },
        "isFooter": true
      });
    }
  };

  //下线
  submitOffline(ids, offlineReason) {
    const {alert, listData, selectStatus} = this.state;

    if (!offlineReason) {
      alert.params.submitMsg = "请选择下线原因";
      this.props.alertHandle(alert);
      return false;
    }

    // console.log(ids);
    // console.log(offlineReason);

    listData.forEach((item, i) => {
      if (ids.indexOf(item.id) != -1) {
        // item.qualityRank = 3;
        item.offlineReason = offlineReason;
        item.offlineMark = 2;
        item.onlineState = 3;

        if (offlineReason >= 9998) {
          selectStatus[i] = false;
        }
      }
    });

    this.closeAlert();
    setTimeout(() => {
      this.setState({doing: 'selectCancel'})
    }, 300)
  };

  setOnline() {
    const {listData, listSelectData} = this.state;
    const ids = listSelectData.ids;

    listData.forEach(item => {
      if (ids.indexOf(item.id) != -1) { // 置为上线
        if (item.qualityRank != 5) {
          item.onlineState = 1;
          item.offlineReason = '';
          item.offlineMark = 0;
        }
      }
    });

    this.setState({listData, doing: 'selectCancel'});
    // this.props.refresh()
  };

  viewPicture({operate, id}) { // 查看图片
    const {dispatch} = this.props;
    // dispatch(viewEditPic({"resImageId": id, "type": operate})).then((result) => {
    //     if (result.apiError) {
    //         message.error(result.apiError.errorMessage, 3);
    //         return false
    //     }
    //     window.open(result.apiResponse);
    // });
    switch (operate) {
      case "origin":
        dispatch(viewEditPic({"resImageId": id, "type": "origin"})).then((result) => {
          if (result.apiError) {
            message.error(result.apiError.errorMessage, 3);
            return false
          }
          //   const url = encodeURIComponent(result.apiResponse);
          //   window.open("/image?url=" + url);
          window.open(result.apiResponse);
        });
        break;
      case "middle":
        dispatch(viewEditPic({"resImageId": id, "type": operate})).then((result) => {
          if (result.apiError) {
            message.error(result.apiError.errorMessage, 3);
            return false
          }
          window.open(result.apiResponse);
        });
        // window.open(editorUrl + "/image/viewMidTu?resImageId=" + id);
        break;
    }
  };

  hideListItem(type) { // 隐藏 已推送\不通过
    let {listData, listSelectData, selectStatus, hideSelected} = this.state;
    listData.forEach((item, i) => {
      if ((type == 'Pushed') && (item.pushedOrganizations && item.pushedOrganizations.length > 0) || (type == 'Reject') && (item.qualityRank == 5) || (type === 'Selected' && selectStatus)) {
        //   console.log(item.hide)
        // item.hide = !hideSelected ? selectStatus[i] : false;
        item.hide = type==='Selected' ? (!hideSelected ? selectStatus[i] : false) :!item.hide
      }
    });

    this.state['hide' + type] = !this.state['hide' + type]

    this.setState({listData});
  };

  setTop() {
    const {listSelectData: {keys}} = this.state;
    if (keys.length === 0) {
      message.info("请选择单张", 3);
      return false;
    }
    this.state.alert.params.sortNumber = '';
    this.openAlert({
      "title": "排序：1~99999999",
      "contentShow": "body",
      "body": (
        <InputNumber
          style={{width: '100%'}}
          min={1}
          max={99999999}
          type="text"
          value={this.state.alert.params.sortNumber}
          onChange={(value) => {
            this.state.alert.params.sortNumber = value ? value : '';
          }}
        />
      ),
      "onOk": () => {
        const {listData, listSelectData: {keys}} = this.state;
        if (keys.length == 0) {
          message.info("请选择单张", 3);
          return false;
        }
        keys.forEach((key) => {
          listData[key].sortNumber = this.state.alert.params.sortNumber;
        });
        this.setState({listData, "doing": "selectCancel"});
      },
      "isFooter": true
    })
  }


  /**
   * [格式化时间戳]
   * @param  {[str]} stringTime [传入的时间]
   * @return {[str]}            [时间戳]
   */

  formarDate = (stringTime) => {
    let date = new Date(stringTime);
    return date.getTime()
  }


  /**
   * [sortBy 排序规则，注意的时间排序是倒序]
   * @param  {[str]} rule  [排序规则]
   * @param  {[num]} type  [排序类型]
   * @param  {[fun]} minor [回调方法]
   * @return {[num]}       [返回排序规则]
   */
  sortBy = (rule, type, minor) => {
    var x = -1, y = 1;
    if (type == 2) {
      x = 1,
      y = -1
    }
    ;
    return function (o, p) {
      var a, b;
      if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[rule];
        b = p[rule];
        if (a === b) {
          return typeof minor === 'function' ? minor(o, p) : 0;
        }
        if (typeof a === typeof b) {
          return a < b ? x : y;
        }
        return typeof a < typeof b ? x : y;
      } else {
        console.log("Sort error");
      }
    }
  };

  /**
   * 列表排序，点击顶部菜单，按照排序的框里输入的值排序
   */

  setApplicationTop() {

    let {listData} = this.state;

    // TODO: 设置input输入框值的问题，如果为空，则设置为无穷大，反之使用自身
    for (var sortNum in listData) {
      if (!listData[sortNum].sortNumber) {
        listData[sortNum].numberSort = Number.POSITIVE_INFINITY
      } else {
        listData[sortNum].numberSort = listData[sortNum].sortNumber * 1
      }
      listData[sortNum].createdTime = this.formarDate(listData[sortNum].createdTime)
    }

    // TODO: 排序比较，规则先按照序号，序号想用按日期，日期相同则按照id
    listData.sort(this.sortBy('numberSort', 1, this.sortBy('createdTime', 2, this.sortBy('id', 2))))

    // TODO: 更新列表
    this.setState({
      listData
    })

  };
};
