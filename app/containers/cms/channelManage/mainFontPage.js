import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs";
import TableBox          from "app/components/common/table";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {
  channelCfg,
  scrollList,
  picList,
  deletePic,
  tagData,
  tagPicList,
}      from "app/action_creators/cms_action_creator";
import {Steps}          from "app/containers/cms/steps";

// import {TableBox} 		  	  from "app/containers/cms/TableBox";
import {ExThumbnailBox}          from "app/containers/cms/exThumbnail";

import FocusPic          from "app/containers/cms/channelManage/focusPic"
import Recommend          from "app/containers/cms/channelManage/recommend"
import Hotpot          from "app/containers/cms/channelManage/hotpot"
import Advertisement    from "app/containers/cms/channelManage/advertisement"
import {UpdateImgData}    from "app/containers/cms/UpdateImgData"

import {Upload, Tabs, Switch, Select, DatePicker, Icon, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;

const select = (state) => ({
  "error": state.cms.error
});
@connect(select)

export default class FontPage extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    let tipArr = [];
    for (let i = 0; i < 12; i++) {
      if ((0 <= i && i < 4) || (i < 12 && i >= 7)) {
        tipArr.push("请上传最小尺寸为290/220的图")
        
      }
      else if (i < 7 && i >= 4) {
        tipArr.push("请上传最小尺寸为390/220的图")
        
      }
    }
    this.state = {
      "picListData": {
        list: []
      },
      "activeTab": props.tabIndex || "1",
      "scrollList": {
        "idField": "id",
        "head": [
          {
            "field": "id",
            "text": "id",
            "type": "expand"
          },
          {
            "field": "sort",
            "text": "顺序",
            "type": "customize",
            customize (text, i) {
              return <input style={{width: 50}} value={text} onChange={_this.updateTagData.bind(_this, i, 'sort')}/>
            }
          },
          {
            "field": "title",
            "text": "名称",
            "type": "customize",
            customize (text, i) {
              return <input style={{width: '100%'}} value={text}
                            onChange={_this.updateTagData.bind(_this, i, 'title')}/>
            }
          },
          {
            "field": "link",
            "text": "链接",
            "type": "customize",
            customize (text, i) {
              return <input style={{width: '100%'}} value={text} onChange={_this.updateTagData.bind(_this, i, 'link')}/>
            }
          },
          {
            "field": "operate",
            "type": "operate",
            "text": "位置操作",
            "value": [
              {"operate": "delete", "icon": "fa-minus-square", "text": "删除"},
              {"operate": "saveTagPicList", "icon": "fa-save", "text": "保存标签下的图片"}
            ]
          }
        ],
        list: []
      },
      "activedTab": 1,
      "alert": {
        "show": false,
        "isButton": true,
        "bsSize": "small",
        "onHide": this.closeAlert.bind(this),
        "title": null,
        "body": null,
        "submitAlert": null
      },
      tipArr: tipArr
    };
  };
  
  componentDidMount() {
    let tabIndex = this.props.tabIndex || 1;
    if (tabIndex == 1 || tabIndex == 4) {
      this.getPicList({});
    }
    if (tabIndex == 3) {
      this.getScrollList();
    }
//getScrollList
  };
  
  componentWillReceiveProps(props) {
    const {operate} = props;
    if (operate) {
      this[operate]({});
    }
  };
  
  render() {
    const {picListData, scrollList, alert, activeTab} = this.state;
    //1轮播图 2网站宣传 3推荐（多标签）4广告 5seo
    return (<div>
      <Modal {...alert}>
        <Modal.Header closeButton>
          <Modal.Title>{alert.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{"overflow": "hidden"}}>{alert.body}</Modal.Body>
        {alert.isButton &&
        <Modal.Footer>
          <Button bsClass="btn btn-sm btn-info btn-round" onClick={alert.submitAlert}>确认</Button>
          <Button bsClass="btn btn-sm btn-light btn-round" onClick={alert.onHide}>取消</Button>
        </Modal.Footer>
        }
      </Modal>
      <Tabs type="card" onChange={this.tabChange.bind(this)} activeKey={activeTab}>
        <Tabpane tab="焦点图设置" key="1">
          <FocusPic {...picListData} tipMessage={{isSame: 1, message: ["请上传最小尺寸为2000/660的图"]}}
                    onUpdateData={this.updateData.bind(this, 2000, 660)} addData={this.addData.bind(this)}
                    deleteData={this.deleteData.bind(this)} sortAble={true}/>
        </Tabpane>
        {/*	<Tabpane tab="网站宣传" key="2">
         
         </Tabpane>*/}
        <Tabpane tab="内容推荐" key="3">
          <TableBox {...scrollList} onTable={this.operateScrollList.bind(this)} isExpand={true}/>
          {scrollList.list.length == 0 &&
          <button onClick={this.addScrollItem.bind(this)}><i className="menu-icon fa fa-plus-circle"></i>新建标签</button>
          }
        </Tabpane>
        <Tabpane tab="热点活动" key="4">
          <FocusPic {...picListData} tipMessage={{isSame: 1, message: ["请上传最小尺寸为390/180的图"]}}
                    onUpdateData={this.updateData.bind(this, 390, 180)} addData={this.addData.bind(this)}
                    deleteData={this.deleteData.bind(this)} sortAble={true}/>
        </Tabpane>
      </Tabs>
    </div>)
  };
  
  closeAlert() {
    const alert = Object.assign(this.state.alert, {"show": false});
    this.setState({"alert": alert});
  };
  
  openAlert(config) {
    const alert = Object.assign(this.state.alert, {"show": true}, config);
    this.setState({"alert": alert});
  };
  
  alertMsg(msg) {
    this.setState({operate: {}});
    this.openAlert({
      "bsSize": "small",
      "title": <samll style={{"fontSize": "14px"}}>提示：</samll>,
      "body": <p className="bolder center grey"><i
        className="ace-icon fa fa-exclamation-triangle blue bigger-120">{msg}</i></p>,
      "isButton": false
    });
  };
  
  tabChange(tabKey) {
    this.state.activedTab = tabKey;
    
    switch (tabKey) {
      case "1":
        this.state.activeTab = tabKey;
        this.getPicList({});
        break;
      case "4":
        this.state.activeTab = tabKey;
        this.getPicList({});
        break;
      case "3":
        this.state.activeTab = tabKey;
        this.getScrollList();
        this.forceUpdate();
        break;
      default:
        this.state.activeTab = tabKey;
        break;
    }
  };
  
  getPicList(params) {
    const {dispatch, id} = this.props;
    //let api = adPicList;
    let {activedTab} = this.state;
    activedTab = activedTab || this.props.tabIndex;
    dispatch(picList({
      ...params,
      id,
      type: activedTab
    })).then((result) => {
      if (result.apiError) return false;
      this.state.picListData.list = result.apiResponse.list || [];
      this.forceUpdate();
    });
  }
  
  updateData(width, height, index, field, value) {
    
    let _this = this;
    if (width != 0 && height != 0 && field == "src") {
      UpdateImgData(width, height, index, field, value, _this)
      
    }
    else {
      _this.changePics(index, field, value, 0, width, height);
    }
    
    
  }
  
  updateDataRecemened(index, field, value) {
    let _this = this;
    
    let width = 290;
    let height = 220;
    
    if ((0 < index && index < 4) || (index < 11 && index >= 7)) {
      width = 290;
      height = 220;
    }
    else if (index < 7 && index >= 4) {
      width = 390;
      height = 220;
    }
    if (width != 0 && height != 0 && field == "src") {
      let img = new Image();
      img.src = "http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com" + value;
      img.onload = function () {
        
        if (img.width / img.height != width / height || (img.width != width || img.height != height)) {
          _this.alertMsg("请上传最小尺寸为" + width + "/" + height + "的图");
        }
        else {
          _this.changePics(index, field, value, 1, width, height)
        }
      }
    }
    else {
      _this.changePics(index, field, value, 1, width, height)
    }
    
  }
  
  changePics(index, field, value, type, width, height) {
    
    this.state.picListData.list[index][field] = value;
    
    this.forceUpdate();
    
    if (this.expanded) {
      const {idField, item: {id}} = this.expanded.data;
      const container = document.getElementById(idField + '_' + id + "_expand");
      if (type == 1) {
        ReactDOM.render(
          <FocusPic {...this.state.picListData} deleteData={this.deleteData.bind(this)}
                    tipMessage={{isSame: 0, message: this.state.tipArr}}
                    onUpdateData={this.updateDataRecemened.bind(this)}/>,
          container
        );
      }
      else {
        let tip = "请上传最小尺寸为" + width + "/" + height + "的图";
        ReactDOM.render(
          <FocusPic {...this.state.picListData} deleteData={this.deleteData.bind(this)}
                    tipMessage={{isSame: 1, message: [tip]}} onUpdateData={this.updateData.bind(this, width, height)}/>,
          container
        );
      }
      
    }
  }
  
  addData() {
    this.state.picListData.list.push({});
    this.forceUpdate();
  }
  
  deleteData(index) {
    const data = this.state.picListData.list[index];
    
    if (data.id) {
      const {dispatch} = this.props;
      dispatch(deletePic({
        id: data.id
      })).then((result) => {
        this.getTagPics();
        this.expandTagPicList(this.expanded.data)
        this.forceUpdate();
      });
    } else {
      this.state.picListData.list.splice(index, 1);
      this.forceUpdate();
    }
  }
  
  getScrollList(callBack) {
    const {dispatch, id} = this.props;
    
    dispatch(tagData({
      id
    })).then((result) => {
      if (result.apiError) {
        this.alertMsg('获取标签列表失败：' + result.apiError.errorMessage)
        return false;
      }
      let scrollList = result.apiResponse.list;
      if (scrollList.length > 0) {
        this.state.scrollList.list[0] = result.apiResponse.list[0] || [];//标签管理只取一条
        if (this.state.scrollList.list[0]) {
          this.state.selectedTag = this.state.scrollList.list[0].id;
        }
      } else {
        this.state.scrollList.list = [];
      }
      
      this.forceUpdate();
      if (callBack) {
        callBack();
      }
    });
  }
  
  getTagPics(callBack) {
    const {selectedTag} = this.state, {dispatch} = this.props;
    
    dispatch(tagPicList({
      id: selectedTag
    })).then((result) => {
      if (result.apiError) {
        this.alertMsg('获取标签下图片失败：' + result.apiError.errorMessage);
        this.state.picListData.list = [];
      } else {
        this.state.picListData.list = result.apiResponse.list || [];
      }
      this.forceUpdate();
      
      if (callBack) {
        callBack();
      }
    });
  }
  
  expandTagPicList({idField, item: {id}}) {
    this.state.selectedTag = id;
    if (!id) {
      this.saveTag();
      return;
    }
    
    this.getTagPics(() => {
      const container = document.getElementById(idField + '_' + id + "_expand"),
        {picListData} = this.state;
      ReactDOM.render(
        <FocusPic {...picListData} deleteData={this.deleteData.bind(this)}
                  tipMessage={{isSame: 0, message: this.state.tipArr}}
                  onUpdateData={this.updateDataRecemened.bind(this)}/>,
        container
      );
    });
  }
  
  operateScrollList(cfg) {
    const {operate, rowIndex, data} = cfg;
    
    switch (operate) {
      case "delete":
        this.handleOnDeleteTag(rowIndex);
        break;
      case "expand":
        this.expanded = {
          data
        };
        this.expandTagPicList(data);
        break;
      case "saveTagPicList":
        this.beforeSaveTagPicList(data);
        break;
      default:
        break;
    }
  }
  
  addScrollItem() {
    const d = new Date;
    const formatD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    this.state.scrollList.list.push({
      "id": "",
      "sort": "",
      "title": "",
      "link": ""
    });
    this.forceUpdate();
  };
  
  handleOnDeleteTag(index) {
    const id = this.state.scrollList.list[index].id;
    if (id) {
      const {dispatch} = this.props;
      dispatch(tagData({
        id,
        method: 'delete'
      })).then((result) => {
        if (result.apiError) return false;
        
        this.getScrollList();
      });
    } else {
      this.state.scrollList.list.splice(index, 1);
      this.forceUpdate();
    }
  };
  
  updateTagData(index, field, e) {
    this.state.scrollList.list[index][field] = e.target.value;
    this.forceUpdate();
  };
  
  save(params) {
    switch (parseInt(this.state.activedTab)) {
      case 1:
      case 4:
        this.savePiclist(params);
        break;
      case 3:
        this.saveTag();
        
        break;
      default:
        break;
    }
  };
  
  savePiclist(params) {
    const {dispatch, id, resetOperate} = this.props,
      {activedTab, picListData} = this.state;
    
    dispatch(picList({
      ...params,
      id,
      type: this.state.activedTab,
      method: 'post',
      content: picListData.list
    })).then((result) => {
      
      let msg = '图片保存成功';
      if (result.apiError) {
        msg = result.apiError.errorMessage;
      }
      
      this.alertMsg(msg);
      
    });
  }
  
  saveTag() {
    const {dispatch, id} = this.props;
    let _this = this;
    //console.log("tag",this.state.scrollList.list)
    dispatch(tagData({
      id,
      method: 'post',
      tabList: this.state.scrollList.list
    })).then((result) => {
      let msg = '标签保存成功';
      if (result.apiError) {
        msg = result.apiError.errorMessage;
      }
      
      _this.alertMsg(msg);
      
      _this.getScrollList();
    });
  };
  
  beforeSaveTagPicList({idField, item: {id, title}}) {
    if (!id) {
      this.openAlert({
        "bsSize": "small",
        "title": <samll style={{"fontSize": "14px"}}>提示：</samll>,
        "body": <p className="bolder center grey">
          <i className="ace-icon fa fa-exclamation-triangle blue bigger-120">请先保存标签</i>
        </p>,
        "isButton": false
      });
      return;
    }
    this.openAlert({
      "bsSize": "small",
      "title": <samll style={{"fontSize": "14px"}}>提示：</samll>,
      "body": <p className="bolder center grey">
        <i className="ace-icon fa fa-exclamation-triangle blue bigger-120">确认保存标签{id}下的图片?</i>
      </p>,
      "isButton": true,
      "submitAlert": this.saveTagPicList.bind(this)
    });
  };
  
  saveTagPicList() {
    
    const {dispatch} = this.props;
    
    dispatch(tagPicList({
      id: this.state.selectedTag,
      method: 'post',
      tabPicList: this.state.picListData.list
    })).then((result) => {
      let msg = '标签图片保存成功';
      if (result.apiError) {
        msg = result.apiError.errorMessage;
      }
      
      this.alertMsg(msg);
      this.getTagPics();
    });
  };
  
  submit() {
    let picListNum = this.state.picListData.list.length;
    let msg = "发布成功";
    if (picListNum < 3) {
      msg = '至少需要发布3张图片';
    }
    this.alertMsg(msg);
  }
}
