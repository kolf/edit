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
  tagData,
  tagPicList,
  deletePic
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

export default class CreativeFontpage extends Component {
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
      "params": {},
      "picListData": {
        list: []
      },
      "activedTab": props.tabIndex || 1,
      selectedTag: '',
      "scrollList": {
        "idField": "id",
        "head": [
          {
            "field": "sort",
            "text": "展开",
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
          // {
          //   "field": "date",
          //   "text": "发布日期"
          // },
          // {
          //   	"field": "operator",
          // 	"text": "操作人"
          // },
          {
            "field": "operate",
            "type": "operate",
            "text": "位置操作",
            "value": [
              
              {"operate": "delete", "icon": "fa-minus-square", "text": "删除"}
            ]
          }
        ],
        list: []
      },
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
    let tabIndex = this.props.tabIndex || "1";
    this.tabChange(tabIndex);
  };
  
  componentWillReceiveProps(props) {
    const {operate} = props;
    //console.log(operate)
    if (operate) {
      this[operate]({});
      // this.props.resetOperate();
    }
  };
  
  render() {
    const {crumbs, alert, topicInfo, banner, picListData, scrollList, selectedTag, activedTab} = this.state;
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
        <Tabs type="card" onChange={this.tabChange.bind(this)} activeKey={activedTab}>
          <Tabpane tab="焦点图设置" key="1">
            <FocusPic {...picListData} tipMessage={{isSame: 1, message: ["请上传最小尺寸为800/400的图"]}}
                      onUpdateData={this.updateData.bind(this, 800, 400)} addData={this.addData.bind(this)}
                      deleteData={this.deleteData.bind(this)} sortAble={true}/>
          </Tabpane>
          <Tabpane tab="热点活动" key="4">
            <FocusPic {...picListData} tipMessage={{isSame: 1, message: ["请上传最小尺寸为390/180的图"]}}
                      onUpdateData={this.updateData.bind(this, 390, 180)} addData={this.addData.bind(this)}
                      deleteData={this.deleteData.bind(this)} sortAble={true}/>
          </Tabpane>
          <Tabpane tab="标签管理" key="2">
            <TableBox {...scrollList} onTable={this.operateScrollList.bind(this)} isExpand={true}/>
            <button onClick={this.addScrollItem.bind(this)}><i className="menu-icon fa fa-plus-circle"></i>新建标签</button>
          </Tabpane>
          <Tabpane tab="标签图片管理" key="5">
            标签：<Select value={selectedTag} style={{width: '200px', marginBottom: '15px'}}
                       onSelect={this.handleOnSelectTag.bind(this)}>
            {scrollList.list.map((item, i) => <Option value={item.id} key={i}>{item.title}</Option>)}
          </Select>
            <FocusPic {...picListData} tipMessage={{isSame: 0, message: this.state.tipArr}}
                      deleteData={this.deleteData.bind(this)} onUpdateData={this.updateDataRecemened.bind(this)}/>
          </Tabpane>
        </Tabs>
      </div>
    )
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
  }
  
  handleOnTable() {
  
  };
  
  handleOnSelectTag(v) {
    this.state.selectedTag = v;
    this.setState({selectedTag: v});
    this.getTagPics();
  }
  
  tabChange(tabKey) {
    this.state.activedTab = tabKey;
    switch (tabKey) {
      case "1":
      case "4":
        this.getPicList();
        break;
      case "2":
        this.getScrollList();
        break;
      case "5":
        this.getScrollList(() => {
          this.getTagPics();
        });
        break;
      default:
        break;
    }
    
  };
  
  getPicList() {
    const {dispatch, id} = this.props;
    let {activedTab} = this.state;
    activedTab = activedTab || this.props.tabIndex;
    dispatch(picList({
      id,
      method: 'get',
      type: activedTab
    })).then((result) => {
      if (result.apiError) {
        this.alertMsg('获取图片清单失败：' + result.apiError.errorMessage);
        this.state.picListData.list = [];
      } else {
        this.state.picListData.list = result.apiResponse.list || [];
      }
      this.forceUpdate();
    });
    
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
      this.state.scrollList.list = result.apiResponse.list || [];
      if (this.state.scrollList.list[0]) {
        this.state.selectedTag = this.state.scrollList.list[0].id;
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
  
  operateScrollList(cfg) {
    const {operate, rowIndex, data} = cfg;
    switch (operate) {
      case "delete":
        this.handleOnDeleteTag(rowIndex);
        break;
      case "expand":
        this.expandTagPicList(data);
        break
      default:
        break;
    }
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
        <FocusPic {...picListData} tipMessage={{isSame: 0, message: this.state.tipArr}}
                  onUpdateData={this.updateDataRecemened.bind(this)}/>,
        container
      );
    });
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
  
  
  updateData(width, height, index, field, value) {
    let _this = this;
    if (width != 0 && height != 0 && field == "src") {
      UpdateImgData(width, height, index, field, value, _this)
    }
    else {
      _this.changePics(index, field, value)
    }
    
  }
  
  updateDataRecemened(index, field, value) {
    let _this = this;
    let img = new Image();
    img.src = "http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com" + value;
    let width = 290;
    let height = 220;
    if (width != 0 && height != 0 && field == "src") {
      
      if ((0 < index && index < 4) || (index < 11 && index >= 7)) {
        width = 290;
        height = 220;
      }
      else if (index < 7 && index >= 4) {
        width = 390;
        height = 220;
      }
      
      img.onload = function () {
        if (img.width / img.height != width / height || (img.width != width || img.height != height)) {
          _this.alertMsg("请上传最小尺寸为" + width + "/" + height + "的图");
        }
        else {
          _this.changePics(index, field, value)
        }
      }
    }
    else {
      _this.changePics(index, field, value)
    }
    
    
  }
  
  changePics(index, field, value) {
    
    this.state.picListData.list[index][field] = value;
    this.forceUpdate();
  }
  
  addData() {
    this.state.picListData.list.push({
      id: '',
      link: '',
      src: '',
      title: ''
    });
    this.forceUpdate();
  }
  
  deleteData(index) {
    const data = this.state.picListData.list[index];
    
    if (data.id) {
      const {dispatch} = this.props;
      dispatch(deletePic({
        id: data.id
      })).then((result) => {
        if (this.state.activedTab == 5) {
          this.getTagPics();
        } else {
          this.getPicList({});
        }
      });
    } else {
      this.state.picListData.list.splice(index, 1);
      this.forceUpdate();
    }
  }
  
  save() {
    switch (parseInt(this.state.activedTab)) {
      case 1:
      case 4:
        this.savePiclist();
        break;
      case 2:
        this.saveTag();
        break;
      case 5:
        this.saveTagPicList();
        break;
      default:
        break;
    }
  };
  
  savePiclist() {
    const {dispatch, id} = this.props,
      {activedTab, picListData} = this.state;
    
    dispatch(picList({
      id,
      type: activedTab,
      method: 'post',
      content: picListData.list
    })).then((result) => {
      let msg = '操作成功';
      if (result.apiError) {
        msg = result.apiError.errorMessage;
      }
      
      this.alertMsg(msg);
    });
  };
  
  saveTag() {
    const {dispatch, id} = this.props;
    
    dispatch(tagData({
      id,
      method: 'post',
      tabList: this.state.scrollList.list
    })).then((result) => {
      let msg = '操作成功';
      if (result.apiError) {
        msg = result.apiError.errorMessage;
      }
      
      this.alertMsg(msg);
      
      this.getScrollList();
    });
  };
  
  saveTagPicList() {
    const {dispatch} = this.props;
    
    dispatch(tagPicList({
      id: this.state.selectedTag,
      method: 'post',
      tabPicList: this.state.picListData.list
    })).then((result) => {
      let msg = '操作成功';
      if (result.apiError) {
        msg = result.apiError.errorMessage;
      }
      
      this.alertMsg(msg);
      this.getTagPics();
    });
  };
  
  submit() {
    //console.log("submit=======444======")
  };
}
