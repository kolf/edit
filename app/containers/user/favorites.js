import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import moment from "moment";
import {getStorage} from "app/api/auth_token";

import CrumbsBox from "app/components/common/crumbs";
import ThumbnailBox from "app/components/provider/thumbnail";
import EditModal from "app/components/edit/editModal";
import EditRecord from "app/components/modal/editRecord";

import {Affix, Pagination, Spin, Tag, Button, Input, Select, message} from "antd";

import storage from "app/utils/localStorage";

const Option = Select.Option;

import {
  favoriteQuery,     // favorite query
  favoriteDelete,    // favorite delete
  favoriteSave,      // favorite create save
  favoriteItemQuery, // favorite item query
  favoriteItemDelete // favorite item delete
} from "app/action_creators/person_action_creator";

import {
  groupViewEditHistory,   // 查看编审记录
  groupCreate        // 单张：新建、加入组
} from "app/action_creators/editor_action_creator";

import {categoryQuery} from "app/action_creators/common_action_creator";

const select = (state) => ({});
@connect(select)
export default class FavoritesContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": "/user", "text": "用户中心"},
        {"path": "/user/favorites", "text": "我的收藏夹"}
      ],
      "filterParams": {
        "id": "", // 当前选择的收藏夹 id
        "pageNumber": 1,  // 当前页数
        "pageSize": 60, // 每页条数
        "userId": getStorage('userId'), // userId 用户ID
        "role": 2,        // role 1 销售 2 财务 3 运营
        "keywordType": 1,
        "keyword": "",
        "resGroup": 1,    // resGroup 1 组照 2 单张
        "assetFamily": 1, // assetFamily 1 编辑 2 创意
        "groupState": "",  // groupState '1 未编审、2待编审、3二审,4已编审',
        "pageNum": 1,     // pageNum 当前页数
        "pageType": 10,
        "desc": 1
      },
      "tooltip": {
        "show": false,
        "target": null,
        "text": "更新中...",
        "placement": "right"
      },
      "alert": {
        "show": false,
        "isButton": true,
        "bsSize": "small",
        "onCancel": this.closeAlert.bind(this),
        "title": null,
        "contentShow": "body",
        "body": null,
        "params": {},
        "submitAlert": null,
        "isLoading": false
      },
      "favoriteParams": {
        "pageNumber": 1,  // 当前页数
        "pageSize": 60 // 每页条数
      },
      "favoriteData": {
        list: [],
        total: 0
      },
      "listData": {            // 图片数据
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
      "doing": '',
      'maskLoading': true     // loading
    };
  };

  componentWillMount() {
    document.title = '我的收藏夹 - 用户中心 - 内容管理系统 - VCG © 视觉中国';
    this.refresh();
  };

  openAlert(config) {
    const alert = Object.assign(this.state.alert, {
      "show": true,
      "isLoading": false,
      "contentShow": "body",
      "params": {},
      "maskClosable": false,
      "dragable": true
    }, config);
    this.setState({"alert": alert, "doing": "openAlert"});
  };

  closeAlert() {
    const alert = Object.assign(this.state.alert, {
      "show": false,
      "isLoading": false,
      "contentShow": "body",
      "param": {}
    });
    this.setState({"alert": alert, "doing": "closeAlert"});
  };

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

  setSelectStatus(type) {
    if (type == "all") this.setState({"doing": "selectAll"});
    if (type == "cancel") this.setState({"doing": "selectCancel"});
    if (type == "invert") this.setState({"doing": "selectInvert"});
    if (type == "appointed") this.setState({"doing": "selectAppointed"});
  };

  // 根据id和key返回list
  getListItem({id, key}) {
    const {listData} = this.state;
    if (listData.list && listData.list[key] && listData.list[key].id == id) return listData.list[key];
    else return false;
  };


  updateData({doing, listData, listSelectData, imageRejectReason}) { // set value
    if (listData) this.state.listData.list = listData;
    if (listSelectData) this.state.listSelectData = listSelectData;
    if (doing) this.state.doing = doing;
    if (imageRejectReason) this.state.alert.params.imageRejectReason = imageRejectReason;
  };


  render() {
    const self = this;
    const {crumbs, alert, tooltip, typeDoc, filterParams, favoriteData, listData, doing, favoriteParams, maskLoading} = this.state;

    //console.log(listData);

    //分页组件模块化
    const paginationInit = {
      "current": filterParams.pageNumber,
      "pageSize": filterParams.pageSize,
      "total": listData.total,
      "showSizeChanger": true,
      "showQuickJumper": true,
      showTotal() {
        return '共 ' + listData.total + ' 条';
      },
      onShowSizeChange(pageSize) {
        self.refresh("pagination", {"pageNumber": 1, pageSize});
      },
      onChange(current) {
        self.refresh("pagination", {"pageNumber": current});
      }
    };

    const favoritePagesProps = {
      "current": favoriteParams.pageNumber,
      "pageSize": favoriteParams.pageSize,
      "total": favoriteData.total,
      // "showSizeChanger": true,
      // "showQuickJumper": true,
      "showTotal": () => {
        return '共 ' + favoriteData.total + ' 条';
      },
      "onShowSizeChange": (pageSize) => {
        Object.assign(favoriteParams, {pageNumber: 1, pageSize})
        this.queryFavorite()
      },
      "onChange": (current) => {
        Object.assign(favoriteParams, {pageNumber: current})
        this.queryFavorite()
      }
    }

    return (
      <div className="main-content-inner">
        <CrumbsBox crumbs={crumbs}/>
        <div className="page-content">

          <EditModal alert={alert} tooltip={tooltip} doing={doing}
                     submitOperateGroup={this.submitOperateGroup.bind(this)}/>

          <div className="text-warning mt-10 mb-10 clearfix">
            <span className="orange"><i
              className="ace-icon fa fa-hand-o-right icon-animated-hand-pointer"></i> 收藏夹</span>
            <div className="dataTables_paginate pull-right">
              <Select defaultValue={60} onChange={e => {
                favoritePagesProps.onShowSizeChange(e)
              }}>
                <Option value={60}>60条/页</Option>
                <Option value={100}>100条/页</Option>
                <Option value={200}>200条/页</Option>
              </Select>
              <Pagination simple {...favoritePagesProps}  />
              <div className="total-page"> {favoritePagesProps.showTotal()} </div>
            </div>
          </div>

          <div className="dashed-container">
            {favoriteData.list.length > 0 && favoriteData.list.map(
              (favorite, i) => <div key={i}
                                    className={filterParams.id == favorite.id ? 'ant-tag ant-tag-blue ant-tag-has-color' : 'ant-tag'}>
                                <span className="ant-tag-text" onClick={this.onSelectFavorite.bind(this, favorite.id)}>
                                    <i
                                      className={filterParams.id == favorite.id ? 'fa fa-folder-open' : 'fa fa-folder'}></i> {favorite.favor_name}
                                </span>
                <i className="anticon anticon-cross" onClick={this.deleteFavorite.bind(this, favorite.id)}></i>
              </div>
            )}
            <Tag type="button" onClick={this.createFavorite.bind(this)}>+ 新建收藏夹</Tag>
          </div>

          <Affix className="row operate">
            <div className="col-xs-12 col-sm-7">
              <a onClick={this.setSelectStatus.bind(this, 'all')}>全选</a>
              <samp>|</samp>
              <a onClick={this.setSelectStatus.bind(this, 'invert')}>反选</a>
              <samp>|</samp>
              <a onClick={this.setSelectStatus.bind(this, 'cancel')}>取消</a>
              <Button type="button" className="ml-20" onClick={this.operateGroup.bind(this, {operate: "copyAndNew"})}>
                新建组照
              </Button>
              <Button type="button" onClick={this.deleteFavoriteItem.bind(this)}>
                批量删除
              </Button>
              <Button type="button" onClick={this.refresh.bind(this)}>
                刷新
              </Button>
            </div>
            {/*分页组件引用*/}
            <div className="dataTables_paginate pull-right mr-10">
              <Select defaultValue={60} onChange={e => {
                paginationInit.onShowSizeChange(e)
              }}>
                <Option value={60}>60条/页</Option>
                <Option value={100}>100条/页</Option>
                <Option value={200}>200条/页</Option>
              </Select>
              <Pagination simple {...paginationInit}  />
              <div className="total-page"> {paginationInit.showTotal()} </div>
            </div>
          </Affix>

          <div className="row">
            <div className="space-8"></div>
          </div>

          <ThumbnailBox
            doing={doing}
            maskLoading={maskLoading}
            types="favorites"
            lists={listData.list}
            dispatch={this.props.dispatch}
            onThumbnail={this.handleOnThumbnail.bind(this)}
            updateData={this.updateData.bind(this)}/>
        </div>
      </div>
    );
  };

  queryFavorite() {
    const {dispatch} = this.props;
    let {filterParams, favoriteData, favoriteParams} = this.state;
    dispatch(favoriteQuery(favoriteParams)).then(result => {
      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false
      }

      favoriteData.list = result.apiResponse.list || [];
      favoriteData.total = result.apiResponse.total || [];

      if (favoriteData.list.length > 0) {
        filterParams.id = filterParams.id || favoriteData.list[0].id;
        this.queryFavoriteItem(filterParams);
      } else {
        filterParams.id = "";
      }
      this.setState({favoriteData, filterParams});
    });
  };

  queryFavoriteItem(params) {
    this.setState({maskLoading: true});
    const {dispatch} = this.props;
    dispatch(favoriteItemQuery(params)).then(result => {
      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false
      }

      //console.log(result);

      const {list, total_count} = result.apiResponse;
      let listData = {};
      listData.total = total_count;
      listData.list = list ? list.map(item => {
        return item
      }) : [];

      this.setState({listData, maskLoading: false});

      // let {listData} = this.state,_dataList = [];
      // listData.total = result.apiResponse.total_count;
      // [...dataList.list].map((item, i) => {
      //     let tmp = {...item};
      //     //_.mapKeys(item, (val, key) => {
      //     //	tmp[key] = val;
      //     //});
      //     tmp.timeByOrder = moment(item.createdTime).unix();
      //     _dataList.push(tmp);
      // });
      // Object.assign(listData,dataList);
      // this.state.listData.list  = _dataList;
      this.setSelectStatus('cancel');
    });
  };

  refresh(type, dataParams) {
    const {filterParams} = this.state;
    if (!filterParams.id) {
      this.queryFavorite();
      return false;
    }
    //console.error(type, dataParams,filterParams);
    if (type == "pagination") { // pagination
      Object.assign(filterParams, dataParams);
    }
    if (type == "filter") { // filter
      Object.assign(filterParams, dataParams, {"pageNumber": 1});
    }
    if (type == "pagination" || type == "filter") {
      this.setState({filterParams});
    }
    this.queryFavoriteItem(filterParams);
  };

  onSelectFavorite(id) {
    const {filterParams} = this.state;
    if (filterParams.id != id) {
      filterParams.id = id;
      this.setState(filterParams);
      this.refresh();
    }
  };

  handleOnPagination(page) {
    this.refresh("pagination", {"pageNumber": page});
  };

  handleOnThumbnail({operate, key, id, value}) {
    //console.log('handleOnThumbnail', operate, key, id, value);
    switch (operate) {
      case "deleteImage":
        this.deleteFavoriteItem({key, id});
        break;
      default:
      //console.log(operate, key, id, value);
    }
  };

  deleteFavorite(id) {
    this.openAlert({
      "bsSize": "small",
      "title": "删除收藏夹：ID-" + id,
      "contentShow": "body",
      "body": <p className="alert alert-info text-center mt-15"><i
        className="ace-icon fa fa-hand-o-right bigger-120"></i> 确定要删除此收藏夹？</p>,
      "params": {"id": id},
      "onOk": this.submitDeleteFavorite.bind(this),
      "isFooter": true
    });
  };

  submitDeleteFavorite() {
    const {alert} = this.state;
    alert.isLoading = true;
    this.setState({alert});
    const {dispatch} = this.props;
    dispatch(favoriteDelete(alert.params)).then(result => {
      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false
      }
      const {filterParams} = this.state;
      if (filterParams.id == alert.params.id) {
        filterParams.id = "";
        this.setState({filterParams});
      }
      this.queryFavorite();
      this.closeAlert();
    });
  };

  createFavorite() {
    this.openAlert({
      "bsSize": "small",
      "title": "新建收藏夹",
      "body": null,
      "contentShow": "createFavorite",
      "params": {
        "userId": this.state.filterParams.userId,
        "type": "photos",   // group photos
        "ids": "",     // groupIds photoIds
        "status": false, // 已有 - 新的
        "id": "",       // 已有 收藏夹 id
        "name": ""      // 新的 收藏夹 name
      },
      "onOk": this.submitCreateFavorite.bind(this),
      "isFooter": true
    });
  };

  submitCreateFavorite() {
    const {alert} = this.state;
    let {name} = alert.params;
    if (!name) {
      alert.params.submitMsg = "请输入新的收藏夹名";
      this.setState({alert});
      return false;
    }
    alert.isLoading = true;
    this.setState({alert});
    const {dispatch} = this.props;
    delete alert.params.submitMsg;
    dispatch(favoriteSave({
      name
    })).then(result => {
      //console.log(result);

      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false
      }
      ;

      if (result.apiResponse.status == 0) {
        message.error(result.apiResponse.message);
        return;
      }
      ;

      this.queryFavorite();
      this.closeAlert();
    });
  };

  deleteFavoriteItem({key, id}) {
    let ids = [], title = "", body = "", len = "";
    if (id) {
      title = "删除单张：ID-" + id;
      body = "确定删除此单张？";
      ids.push(id);
    } else {
      title = "删除多个单张";
      ids = this.state.listSelectData.ids;
      len = ids.length;
      if (len == 0) {
        this.messageAlert({title: title, body: "请选择单张", type: "info"});
        return false;
      }
      title = "确定删除" + len + "个单张？";
    }
    this.openAlert({
      "bsSize": "small",
      "title": title,
      "contentShow": "body",
      "body": <p className="alert alert-info text-center mt-15"><i
        className="ace-icon fa fa-hand-o-right bigger-120"></i> {title}</p>,
      "params": {
        "ids": ids.join(',')
      },
      "onOk": this.submitDeleteFavoriteItem.bind(this),
      "isFooter": true
    });
  };

  submitDeleteFavoriteItem() {
    const {alert, filterParams} = this.state;
    alert.isLoading = true;
    this.setState({alert});
    const params = {
      id: filterParams.id,
      pic_ids: alert.params.ids
    };
    const {dispatch} = this.props;
    dispatch(favoriteItemDelete(params)).then(result => {
      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false
      }
      this.refresh();
      this.closeAlert();
    });
  };

  // 新建组
  operateGroup({operate, key, id}) {
    const {dispatch} = this.props;
    const {filterParams, listSelectData: {ids, list}} = this.state;

    if (ids.length == 0) {
      this.messageAlert({"title": title, "body": "请选择图片", "type": "info"});
      return false;
    }

    // assetFamily == 2
    if (list.some(item => item.assetFamily == 2)) {
      message.error('创意类图片不允许新建组，请取消创意类图片！');
      return;
    }

    this.openAlert({
      "title": "新建组照",
      "params": {
        text: '选中图片新建组照，需要确认新组分类',
        operate: 'new',
        type: 'photos'
      },
      "contentShow": "loading",
      "isFooter": true,
      'onOk': null,
      "onOk3": this.submitOperateGroup.bind(this, 'submitAndEdit'),
      "okText3": "确认并编审新组",
      "onOk2": this.submitOperateGroup.bind(this, 'submit'),
      "okText2": "确认"
    });

    dispatch(categoryQuery({parentId: 0})).then(res => {
      if (res.apiError) {
        message.error(res.apiError.errorMessage);
        return;
      }

      let {alert} = this.state;
      alert.contentShow = "newGroupModal";
      alert.params.categorys = res.apiResponse;
      this.setState({alert});
    })
  };

  submitOperateGroup(submitType) {
    const self = this;
    const {alert, listSelectData: {ids}} = this.state;
    const {dispatch} = this.props;
    const {oneCategory} = alert.params;

    if (!oneCategory) {
      alert.params.submitMsg = "请选择分类！";
      this.setState({alert});
      return false;
    }
    //
    // alert.confirmLoading = true;
    // this.setState({alert});

    dispatch(groupCreate({"photoIds": ids.join(','), oneCategory})).then(result => {
      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false
      }
      ;

      if (submitType == "submitAndEdit") {
        const {id, groupId} = result.apiResponse;
        window.open("/zh/doing/group/edit/" + id + "?groupId=" + groupId);
      }
      this.state.refreshTimer = setTimeout(() => {
        clearTimeout(this.state.refreshTimer);
        this.state.refreshTimer = null;
        this.refresh();
        this.closeAlert();
      }, 1000);
    });
  };


  // 时间排序
  orderByDate(type) {
    const {listData} = this.state;
    if (!listData.total) return false;
    listData[type] = !listData[type];
    listData.list = _.sortByOrder(listData.list, [type], [listData[type] ? "asc" : "desc"]);
    this.setState({listData});
  };

}
