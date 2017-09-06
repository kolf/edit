import React, {Component, PropTypes} from "react";
import TagAreaPanel from "app/components/tag/tagArea";
import TableBox from "app/components/editor/table";
import Spin from "antd/lib/spin";
import Switch from "antd/lib/switch";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Select from "antd/lib/select";

import {Radio, Checkbox, Modal} from 'antd';
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

export default class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "doing": "doing",
      "alert": {
        "key": props.key || `id_${Date.now()}`,
        "visible": false,
        "confirmLoading": false,
        "title": "",
        "width": "520",
        "showContent": "body",
        "body": null,
        "onOk": null,
        "onCancel": this.closeAlert.bind(this),
        "isFooter": true,
        "footer": [],
        "okText": "",
        "cancelText": "",
        "submitMsg": "",
        "params": {}
      },
      "tooltip": {
        "show": false,
        "target": null,
        "text": "更新中...",
        "placement": "right"
      },
      'inputKeywords': '',
      "tagAreaConfigs": props.tagAreaConfigs || {}
    };
    
    this.submitOperateGroup = props.submitOperateGroup ? props.submitOperateGroup : () => {
    };
    
    this.loop = 1;
    
    this.dragableConfig = {
      drag: null,
      modal: null,
      active: false,
      startX: 0,
      startY: 0
    };
    
    this.mousedownHandle = this.mousedownHandle.bind(this);
    this.mousemoveHandle = this.mousemoveHandle.bind(this);
    this.mouseupHandle = this.mouseupHandle.bind(this);
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentWillUnmount() {
    // todo remove
  }
  
  /**
   * 组件重新渲染完成后 拖动效果添加和样式更新
   *
   * @param  {Object} prevState 组件状态
   */
  componentDidUpdate(prevProps, prevState) {
    
    if (prevState.alert && prevState.alert.dragable) {
      // 添加拖动
      if (prevState.alert.visible) this.addDragListener();
      
      // 弹框状态可拖动样式修改
      this.updateModalStyle(prevState.alert.visible, prevState.alert.dragable);
    }
  }
  
  /**
   * 拖动弹出框状态切换
   * body滚动条 拖动状态没有弹框的状态显示
   *
   * @param  {Boolean} visible  弹出框弹出状态
   * @param  {Boolean} dragable 拖动状态
   */
  updateModalStyle(visible, dragable) {
    let modalMasks = document.getElementsByClassName("ant-modal-mask"),
      modalWrap = document.getElementsByClassName("ant-modal-wrap"),
      modalHeader = document.getElementsByClassName("ant-modal-header"),
      modalBody = document.getElementsByClassName("ant-modal-body");
    
    //console.log(11)
    
    // document.body.style = '';
    // 窗口中的滚动条 拖动状态没有弹框的状态显示
    // setTimeout(function(){
    //     document.body.style = ( dragable || !visible ) ? "" : "padding-right: 17px; overflow: hidden";
    // },500);
    
    // 蒙层颜色 拖动透明
    for (let i = modalMasks.length - 1; i >= 0; i--) {
      if (modalMasks && modalMasks[i]) modalMasks[i].style.backgroundColor = dragable ? "transparent" : "rgba(55,55,55,.6)";
      if (modalHeader && modalHeader[i]) modalHeader[i].style.cursor = dragable ? "move" : "";
    }
    //
    // // 弹出框全局滚动条 拖动隐藏
    // for (var i = modalWrap.length - 1; i >= 0; i--) {
    //     //modalWrap[i].style.overflow = dragable ? "hidden" : "";
    // }
    //
    // // 拖动bar 添加拖动样式
    // for (var i = modalHeader.length - 1; i >= 0; i--) {
    //     modalHeader[i].style.cursor = dragable ? "move" : "";
    // }
    //
    // // 弹出框内是否允许有滚动条
    // for (var i = modalBody.length - 1; i >= 0; i--) {
    //     modalBody[i].style.overflow = dragable ? "auto" : "";
    //     modalBody[i].style.maxHeight = dragable ? "400px" : "";
    // }
  }
  
  componentWillReceiveProps(nextProps) {
    //console.log('nextProps.doing---', nextProps);
    const {doing} = this.state;
    // 一定要传 doing
    // //console.log(doing != nextProps.doing,nextProps.doing);
    switch (nextProps.doing) {
      case "openAlert":
        this.openAlert(nextProps.alert);
        break;
      case "closeAlert":
        this.closeAlert();
        break;
      case "alertInfo":
        this.messageAlert('info', nextProps.alert);
        break;
      case "alertSuccess":
        this.messageAlert('success', nextProps.alert);
        break;
      case "alertError":
        this.messageAlert('error', nextProps.alert);
        break;
      case "alertWarning":
        this.messageAlert('warning', nextProps.alert);
        break;
      default:
      //console.log(nextProps.doing);
    }
    //this.state.doing = nextProps.doing;
  };
  
  // 设置isFooter 必须有onOk事件才能显示footer
  openAlert(config) {
    config.width = config.width ? config.width : 520;
    config.onOk = config.onOk ? config.onOk : null;
    config.onCancel = config.onCancel ? config.onCancel : this.closeAlert.bind(this);
    const alert = Object.assign(
      this.state.alert,
      config,
      {"visible": true, "submitMsg": ""}
    );
    
    alert.footer = alert.isFooter ? this.footerRender() : null;
    this.setState({alert});
    if (this.props.updateData) this.props.updateData({"doing": "openAlert", alert});
  };
  
  closeAlert(config) {
    // 移除拖动事件
    if (this.state.alert.dragable) {
      this.removeDragListener();
    }
    // 去掉 "contentShow": "body", "body": "" 关闭弹框不对内容进行修改
    let alert = Object.assign(
      this.state.alert,
      {"visible": false, "confirmLoading": false, "dragable": false, "maskClosable": true}
    );
    
    // 弹框状态可拖动样式修改
    this.updateModalStyle(alert.visible, alert.dragable);
    
    // alert.contentShow = 'body';
    // alert.body = '';
    
    this.setState({alert});
    
    if (alert.params && this.state.inputKeywords) this.state.inputKeywords = '';
    if (alert.params && _.isBoolean(this.state.alert.params.isPublish)) delete this.state.alert.params.isPublish;
    
    if (this.props.updateData) this.props.updateData({"doing": "closeAlert", alert});
  };
  
  messageAlert(type, alert) {
    const modal = Modal[type]({"title": alert.title, "content": alert.content});
    if (this.props.updateData) this.props.updateData({"doing": "messageAlert"});
    // setTimeout(() => modal.destroy(), 2000);
  };
  
  footerRender() {
    const {alert} = this.state;
    
    //console.log(alert);
    
    let footer = [];
    if (alert.params.submitMsg) {
      footer.push(<span className="orange pr-10" key={this.loop++}><i
        className="ace-icon fa fa-hand-o-right"></i> {alert.params.submitMsg}</span>);
    }
    if (alert.onOk) {
      footer.push(<span key={this.loop++}>
                <Button key="ghost" type="ghost" size="large"
                        onClick={alert.onCancel}>{alert.cancelText ? alert.cancelText : "取消"}</Button>
                <Button key="primary" type="primary" size="large" loading={alert.confirmLoading} onClick={alert.onOk}>{alert.okText || "确定"}</Button>
            </span>);
    } else if (alert.params.type && alert.params.operate) {
      footer.push(<span key={this.loop++}>
                {alert.onOk2 && <Button key="ghost" type="primary" size="large" loading={alert.confirmLoading}
                                        onClick={alert.onOk2}>{alert.okText2}</Button>}
        {alert.onOk3 && <Button key="primary" type="primary" size="large" loading={alert.confirmLoading}
                                onClick={alert.onOk3}>{alert.okText3}</Button>}
            </span>);
    }
    
    return footer;
  }
  
  bodyRender() {
    const {alert} = this.state;
    //console.log('alert------',alert);
    let body = [];
    const radioStyle = {
      display: 'block',
      height: '24px',
      lineHeight: '24px'
    };
    if (alert.contentShow == "loading") {
      body.push(<div className="text-center"><Spin /></div>);
    }
    if (alert.contentShow == "body") {
      body.push(alert.body);
    }
    if (alert.contentShow == "form") {
      body.push(alert.body);
    }
    if (alert.contentShow == "textarea") {
      body.push(
        <Input type="textarea" value={alert.params.content}
               placeholder={alert.params.placeholder ? alert.params.placeholder : "请输入"} rows={4}
               onChange={e => {
                 let {alert} = this.state;
                 alert.params.submitMsg = "";
                 alert.params.content = e.target.value;
                 this.setState({alert});
               } }
        />
      );
    }
    if (alert.contentShow == "createRss") {
      body.push(<Input placeholder="请输入订阅名称" value={alert.params.rssName} onChange={e => {
        let {alert} = this.state;
        alert.params.submitMsg = "";
        alert.params.rssName = e.target.value;
        this.setState({alert});
      } }/>);
    }
    if (alert.params.operate == "copyAndAdd" || alert.params.operate == "splitAndAdd") {
      body.push(<div className="favoriteModal">
        <Input size="large" placeholder="请输入组照ID" value={alert.params.groupId || ""} onChange={e => {
          let {alert} = this.state;
          alert.params.submitMsg = "";
          alert.params.groupId = e.target.value;
          this.setState({alert});
        } }/>
      </div>);
    }
    if (alert.contentShow == "favorite") {
      body.push(<div className="favoriteModal">
        <span className="fl">加入{alert.params.status ? "已有" : "新的"}收藏夹中</span>
        <Switch className="fr" defaultChecked={alert.params.status} onChange={value => {
          let {alert} = this.state;
          alert.params.status = value;
          this.setState({alert});
        } }/>
        <div className="slideBox mt-10">
          <div className={alert.params.status ? "slideBox-inner" : "slideBox-inner next"}>
            <div className="slideBox-context">
              <Select style={{"width": "100%"}} onChange={value => {
                let {alert} = this.state;
                alert.params.submitMsg = "";
                alert.params.favId = value;
                this.setState({alert});
              } }>
                {alert.params.favoriteOption && alert.params.favoriteOption.map(item => <Option
                  value={item.id}>{item.favor_name}</Option>)}
              </Select>
            </div>
            <div className="slideBox-context">
              <Input placeholder="请输入新的收藏夹名" onChange={e => {
                let {alert} = this.state;
                alert.params.submitMsg = "";
                alert.params.favName = e.target.value;
                this.setState({alert});
              } }/>
            </div>
          </div>
        </div>
      </div>);
    }
    if (alert.contentShow == 'priceModal') {
      const options = [{
        value: 0,
        label: '0（无特殊限价）',
        price: 30,
      },{
        value: 3,
        price: 500,
        label: '3（前台显示：500元）推荐优先设置'
      },{
        value: 4,
        price: 1000,
        label: '4（前台显示：1000元）'
      },{
        value: 5,
        price: 1500,
        label: '5（前台显示：1500元）'
      },{
        value: 9,
        price: 99999999,
        label: '9（无，特殊授权品牌）'
      }]
      let {alert} = this.state
      console.log(alert.params.minSettingPrice)
      body.push(<div className="priceModal">
        <RadioGroup onChange={e => {
          alert.params.submitMsg = '';
          alert.params.price = e.target.checked ? e.target.value : 0
          this.setState({alert})
          }} value={alert.params.price}>
          {options.map(option => <Radio disabled={option.price < alert.params.minSettingPrice} style={radioStyle} value={option.value}>{option.label}</Radio>)}
      </RadioGroup>
      </div>)
    } else if (alert.contentShow == 'newGroupModal') {
      const {oneCategory, categorys, text} = alert.params;
      body.push(<div>
        <p className="alert alert-info text-center"><i className="ace-icon fa fa-hand-o-right bigger-120"></i>{text}</p>
        <Select disabled={categorys && categorys.length == 1} placeholder="请选择分类" value={oneCategory}
                style={{width: '100%'}} onChange={(val) => {
          alert.params.oneCategory = val;
          this.setState({alert})
        }}>{categorys && categorys.map(item => <Option value={item.id}>{`${item.name}(${item.id})`}</Option>)}</Select>
      </div>)
    } else if (alert.contentShow == 'selectGroupModal') {
      const tableInit = {
        "idField": "id",
        "isTitle": null,
        "noTitle": true,
        "head": [{
          "field": "groupId",
          "text": "组照ID"
        }, {
          "field": "title",
          "text": "组照标题",
          "width": 500
        }, {
          "field": "btns",
          "text": "操作",
          "render": (id, groupId, tr) => <Button onClick={e => {
            // window.localStorage.setItem('id', id);
            window.open("/zh/doing/group/" + alert.params.comefrom + "/" + id + "?groupId=" + groupId + '&resId=' + tr.resImageId);
          }} icon="edit"/>
        }
        ],
        "list": alert.params.groupIds.map(item => {
          //console.log(item);
          return {
            id: item.id,
            groupId: item.groupId || item.groupid,
            resImageId: item.resImageId,
            title: item.title
          }
        }),
        "pages": 1,
        "params": null
      };
      
      body.push(<div className={alert.contentShow}>
        <p>该图片在以下组照中展示，请选择进入组照编审</p>
        <TableBox tableInit={tableInit}/>
      </div>)
    }
    if (alert.contentShow == "createFavorite") {
      body.push(<div className="favoriteModal">
        <Input placeholder="请输入新的收藏夹名" value={alert.params.name} onChange={e => {
          let {alert} = this.state;
          alert.params.submitMsg = "";
          alert.params.name = e.target.value;
          this.setState({alert});
        } }/>
      </div>);
    }
    
    if (alert.contentShow == "qualityRank") {
      let {value} = this.state.alert.params;
      
      //console.log(value);
      
      body.push(
        <div className="row">
          <div className="col-xs-12">
            <RadioGroup value={value} onChange={e => {
              alert.params.value = e.target.value;
              this.setState({alert});
            }}>
              <Radio value={"1"}>A</Radio>
              <Radio value={"2"}>B</Radio>
              <Radio value={"3"}>C</Radio>
              <Radio value={"4"}>D</Radio>
              <Radio value={"5"}>E</Radio>
            </RadioGroup>
          </div>
        </div>
      );
    }
    
    if (alert.contentShow == "imageRejectReason") {
      const reasonList = alert.params.reasonList.filter(item => item.value < 9998).concat({value: '0', label: '其它原因'});
      const {value} = this.state.alert.params;
      
      body.push(<div className="row">
        <div className="col-xs-12">
          <RadioGroup value={value} onChange={e => {
            alert.params.value = e.target.value;
            this.setState({alert});
          }}>
            {reasonList.map(item => {
              return <Radio style={radioStyle} value={item.value}>{item.label}</Radio>
            })}
            
            {alert.params.value === "0" ? <Input value={alert.params.otherValue} onChange={e => {
              alert.params.otherValue = e.target.value;
              this.setState({alert});
            }} style={{width: 300, marginLeft: 10}}/> : null}
          
          </RadioGroup>
        </div>
      </div>);
    }
    if (alert.contentShow == "creditLine") {
      body.push(<div className="row">
        <div className="col-xs-12">
          <Input placeholder="请输入署名" onChange={e => {
            let {alert} = this.state;
            alert.params.submitMsg = "";
            alert.params.creditLine = e.target.value;
            this.setState({alert});
          } }/>
        </div>
      </div>);
    }
    if (alert.contentShow == "validateKeywords") {
      let {
        type,
        deleteAuditWordsWhenPublish,
        tagAreaConfigs,
        handleOnPublish,
        unconfirmedTags,
        confirmedTags,
        submitMsg,
        isPublish
      } = alert.params;
      //console.log('deleteAuditWordsWhenPublish',deleteAuditWordsWhenPublish);
      //console.log('unconfirmedTags',unconfirmedTags);
      //console.log('confirmedTags',confirmedTags);
      //console.log('submitMsg',submitMsg);
      //console.log('isPublish',isPublish);
      let isOnPublish = true;
      if (type != 'edit') {
        if (deleteAuditWordsWhenPublish && submitMsg == "" && confirmedTags.length >= 5) isOnPublish = false;
        if (!deleteAuditWordsWhenPublish && submitMsg == "" && unconfirmedTags.length == 0 && confirmedTags.length >= 5) isOnPublish = false;
      } else {
        if (deleteAuditWordsWhenPublish && submitMsg == "") isOnPublish = false;
        if (!deleteAuditWordsWhenPublish && submitMsg == "" && unconfirmedTags.length == 0) isOnPublish = false;
      }
      //console.log('isOnPublish---',isOnPublish);
      body.push(<div>
        <p>
          待确认关键词
          {isPublish && unconfirmedTags.length > 0 && <span className="pl-10 orange">
                        <i className="ace-icon fa fa-hand-o-right"></i> 尚有未确认的关键词，请确认后再提交或选择下面的勾选框。
                    </span>}
        </p>
        <TagAreaPanel tagContainerStyle={{"font-size": 12 + 'px'}} value={unconfirmedTags} {...tagAreaConfigs}/>
        {!isPublish && <Button onClick={e => {
          let {alert} = this.state;
          alert.params.deleteAuditWordsWhenPublish = true;
          this.setState({alert});
          handleOnPublish();
        } }>删除所有待确认关键词</Button>}
        {!isPublish && <div>
          <p className="mt-10">删除指定关键词</p>
          <Input type="textarea" value={this.state.inputKeywords} onChange={e => {
            this.setState({inputKeywords: e.target.value});
          }} placeholder="请输入删除关键词，多个关键词用逗号或者换行分隔" autosize={{minRows: 2, maxRows: 6}}/>
          <Button className="mt-10 mb-10" onClick={e => {
            const {inputKeywords} = this.state;
            // 没有输入任何关键词
            if (_.isEmpty(inputKeywords)) {
              return false;
            }
            //以中英文逗号或者换行分割关键词字符串
            const tagSplitReg = /,|，|\n/;
            tagAreaConfigs.updateTags({}, _.compact(_.map(inputKeywords.split(tagSplitReg), _.trim)))
          }}>提交</Button>
        </div>}
        <p>已匹配关键词</p>
        <TagAreaPanel value={confirmedTags} {...tagAreaConfigs} />
        {isPublish &&
        <p>
          <Button disabled={isOnPublish} onClick={handleOnPublish.bind(this) }>提交</Button>
          <label className="ml-10">
            <input type="checkbox" checked={deleteAuditWordsWhenPublish} onChange={(e) => {
              let {alert} = this.state;
              alert.params.deleteAuditWordsWhenPublish = e.target.checked;
              this.setState({alert});
            }}/>
            待确认关键词不做处理，提交后被删除
          </label>
        </p>
        }
        {submitMsg && <p className="mt-5 orange"><i className="ace-icon fa fa-hand-o-right"></i> {submitMsg}</p>}
      </div>);
    }
    return body;
  }
  
  render() {
    return ( <Modal {...this.state.alert}>{this.bodyRender()}</Modal> );
  }
  
  // 添加拖动效果
  addDragListener() {
    document.addEventListener('mousedown', this.mousedownHandle);
    document.addEventListener('mousemove', this.mousemoveHandle)
    document.addEventListener('mouseup', this.mouseupHandle);
  }
  
  // 移除拖动效果
  removeDragListener() {
    document.removeEventListener("mousedown", this.mousedownHandle);
    document.removeEventListener("mousemove", this.mousemoveHandle);
    document.removeEventListener("mouseup", this.mouseupHandle);
  }
  
  mousedownHandle(e) {
    if (['ant-modal-header', 'ant-modal-title'].indexOf(e.target.className) == -1) {
      // if (e.target.className != "ant-modal-header" && e.target.className != "ant-modal-title") {
      return this.dragableConfig.active = false;
    }
    
    this.dragableConfig.drag = e.target;
    this.dragableConfig.modal = this.dragableConfig.drag.parentElement.parentElement.className == "ant-modal" ? this.dragableConfig.drag.parentElement.parentElement : this.dragableConfig.drag.parentElement.parentElement.parentElement;
    this.dragableConfig.active = true;
    this.dragableConfig.startX = e.pageX - this.dragableConfig.modal.offsetLeft;
    this.dragableConfig.startY = e.pageY - this.dragableConfig.modal.offsetTop;
  }
  
  mousemoveHandle(e) {
    if (this.dragableConfig.active) {
      let left = e.pageX - this.dragableConfig.startX,
        top = e.pageY - this.dragableConfig.startY,
        {alert} = this.state;
      const $antModal = document.querySelector('.ant-modal');
      const maxLeft = document.documentElement.clientWidth - this.dragableConfig.modal.offsetWidth;
      const maxTop = document.documentElement.clientHeight - 20;
      if (left < 0) left = 0;
      if (left > maxLeft) left = maxLeft;
      if (top < 0) top = 0;
      if (top > maxTop) top = maxTop;
      
      Object.assign(alert, {"style": {margin: "0", top, left}});
      this.setState({alert});
    }
  }
  
  mouseupHandle(e) {
    this.dragableConfig.active = false;
  }
}
