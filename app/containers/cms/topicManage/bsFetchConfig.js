import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";

import CrumbsBox          from "app/components/common/crumbs"
import FilterBox          from "app/components/common/filter";

import {Pagination, Modal, Tooltip, Overlay} from "react-bootstrap/lib";
import {topicCfg, bsFetch, saveFetch}      from "app/action_creators/cms_action_creator";
import {Steps}          from "app/containers/cms/steps";
import {InfoTable}          from "app/containers/cms/infoTable";

import moment from 'moment';
import {Upload, Tabs, Switch, Select, DatePicker, Icon, Button}        from "antd"

import "../cms.css"

const Tabpane = Tabs.TabPane;
const Option = Select.Option;
const currentDate = (() => {
  const d = new Date();
  const formatD = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  return formatD;
})()

const MultiSelect = React.createClass({
  getInitialState () {
    let o = {};
    
    this.props.selectedItems.map((item) => {
      o[item.id || item] = true;
    })
    return {"selectedItems": o};
  },
  render (){
    const {list, disabled} = this.props;
    const {selectedItems} = this.state;
    return (
      <ul className="filterSelect">
        {[...list].map((item, i) => {
          let checked = '', key = item.id || item, text = item.name || item;
          if (selectedItems[key]) {
            checked = "true";
          }
          return <li key={i}><label><input type="checkbox" defaultChecked={checked} disabled={disabled}
                                           onClick={this.setActive.bind(this, key)}/>{text}</label></li>;
        })}
      </ul>
    )
  },
  setActive (item){
    const {selectedItems} = this.state;
    let a = [];
    if (selectedItems[item]) {
      delete selectedItems[item];
    } else {
      selectedItems[item] = true;
    }
    
    for (let o in selectedItems) {
      a.push(o);
    }
    
    this.props.handleMultiSelect(a);
  }
});

const select = (state) => ({
  "error": state.cms.error
});
@connect(select)

export default class BsFetch extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    
    this.state = {
      
      // "brands" : [],
      "categories": [],
      "bsFetch": {
        "idField": "bsFetch",
        "head": [{
          "field": "name",
          "text": "抓取条件名称",
          "width": "15%",
          "type": "customize",
          customize (text, index) {
            if (index < 4) {
              return text;
            } else {
              return <div><Button className="btn-danger fr" shape="circle" icon="cross"
                                  onClick={_this.delFetch.bind(_this, index)}/><label>标签：</label><input value={text}
                                                                                                        onChange={_this.handleInputChange.bind(_this, "bsFetch", index)}/>
              </div>;
            }
          }
        },
          {
            "field": "content",
            "text": "抓取项",
            "width": "70%",
            "type": "customize",
            customize (contentArr, index) {
              if (index >= 3) {
                return (<div>
                  {[...contentArr].map((item, i) => {
                    return <span key={i}><input style={{width: 80}} value={item}
                                                onChange={_this.handleInputChange.bind(_this, "bsFetch", index, i)}/>
			              				<Button shape="circle" size="small" icon="minus" className="btn-danger"
                                    onClick={_this.delFetchContent.bind(_this, index, i)}></Button></span>;
                  })}
                  <Button size="small" shape="circle" type="primary" icon="plus"
                          onClick={_this.addFetchItem.bind(_this, index)}></Button></div>)
                // }else if(index == 3){
                // 	return <div>
                //  			<MultiSelect list={_this.state.brands} selectedItems={contentArr || []} handleMultiSelect={_this.handleMultiSelect.bind(_this, index)}/>
                //  			<input style={{width:"40%"}}/><Button>确认</Button>
                //  		</div>
              } else if (index == 2) {
                const levels = [{id: 1, name: 'A'}, {id: 2, name: 'B'}, {id: 3, name: 'C'}, {id: 4, name: 'D'}, {
                  id: 5,
                  name: 'E'
                }];
                return <MultiSelect list={levels} selectedItems={contentArr || []}
                                    handleMultiSelect={_this.handleMultiSelect.bind(_this, index)}/>
              } else if (index == 1) {
                return <MultiSelect list={_this.state.categories} selectedItems={contentArr || []}
                                    handleMultiSelect={_this.handleMultiSelect.bind(_this, index)}/>
              } else {
                contentArr[0] = contentArr[0] || currentDate;
                contentArr[1] = contentArr[1] || currentDate;
                if (contentArr[0].length < 11) {
                  contentArr[0] += ' 00:00:00';
                }
                if (contentArr[1].length < 11) {
                  contentArr[1] += ' 00:00:00';
                }
                return <div><DatePicker style={{width: 200}} defaultValue={moment(contentArr[0], 'YYYY-MM-DD HH:mm:ss')}
                                        format="YYYY-MM-DD HH:mm:ss" showTime={true}
                                        onChange={_this.handleTimeChange.bind(_this, 0)}/>-
                  <DatePicker style={{width: 200}} defaultValue={moment(contentArr[1], 'YYYY-MM-DD HH:mm:ss')}
                              format="YYYY-MM-DD HH:mm:ss" showTime={true}
                              onChange={_this.handleTimeChange.bind(_this, 1)}/></div>
              }
            }
          },
          {
            "field": "source",
            "text": "抓取来源",
            "type": "customize",
            customize (text, index) {
              if (!text) {
                return "————";
              } else {
                return <Select defaultValue={text} style={{width: 150}} onSelect={(v) => {
                  _this.state.bsFetch.list[index].source = v;
                }}>
                  <Option value="explanation">读取图片说明</Option>
                  <Option value="keywords">读取关键词</Option>
                </Select>
              }
            }
          }],
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
      }
    };
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentDidMount() {
    this.init();
  };
  
  componentWillReceiveProps(props) {
    const {operate} = props;
    
    if (operate.index == 2) {
      this[operate.type]({});
    }
  };
  
  
  render() {
    const {alert} = this.state;
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
      <InfoTable {...this.state.bsFetch} />
      <Button className="addTagBtn" size="large" type="primary" onClick={this.addFetch.bind(this)}>+ 新建标签</Button>
    </div>);
  };
  
  init() {
    const {dispatch, params} = this.props;
    if (params.id == 0) {
      Object.assign(this.state.bsFetch.list, [
        {
          "name": "上传日期",
          "content": currentDate,
          "fetch": true
        },
        {
          "name": "分类",
          "content": []
        },
        {
          "name": "照片等级",
          "content": []
        },
        {
          "name": "品牌",
          "content": []
        },
        {
          "name": "地点",
          "content": []
        }
      ]);
      this.forceUpdate();
      return;
    }
    dispatch(bsFetch(params)).then((result) => {
      if (result.apiError) return false;
      // const bsFetch = Object.assign(this.state.bsFetch, result.apiResponse.bsFetch);
      let list = [];
      result.apiResponse.bsFetch.list.map((item, i) => {
        let o = item[Object.keys(item)[0]];
        const nameDic = ['入库时间', '分类', '照片等级', '地点'];
        o.name = o.name || nameDic[i];
        o.content = o.content || [];
        list.push(o);
      });
      this.state.bsFetch.list = list;
      this.setState({
        // brands : result.apiResponse.brands.list,
        categories: result.apiResponse.categories.list
      });
    });
  };
  
  handleOnTable() {
  
  };
  
  handleInputChange(stateIndex, row, i, e) {
    if (e) {
      this.state[stateIndex].list[row].content[i] = e.target.value;
    } else {
      this.state[stateIndex].list[row].name = i.target.value;
    }
    
    this.forceUpdate();
  }
  
  handleTimeChange(index, dateStrCTM, dateStr) {
    this.state.bsFetch.list[0].content[index] = dateStr;
    this.forceUpdate();
  }
  
  handleMultiSelect(index, content) {
    this.state.bsFetch.list[index].content = content;
    this.forceUpdate();
  }
  
  addFetch() {
    this.state.bsFetch.list.push({
      "name": "",
      "content": [],
      "source": "explanation",
      "fetch": true
    });
    this.forceUpdate();
  }
  
  delFetch(i) {
    this.state.bsFetch.list.splice(i, 1);
    this.forceUpdate();
  }
  
  delFetchContent(rowIndex, i) {
    this.state.bsFetch.list[rowIndex].content.splice(i, 1);
    this.forceUpdate();
  }
  
  addFetchItem(index) {
    this.state.bsFetch.list[index].content.push("");
    this.forceUpdate();
  }
  
  save({param, callBack}) {
    //console.log("param",param);
    const {dispatch, params: {topicId}} = this.props;
    const {bsFetch: {list}} = this.state;
    let _this = this;
    let alters = [];
    list.slice(4).map((item, i) => {
      if (item.name && item.content.length > 0) {
        alters.push({
          name: item.name,
          content: item.content,
          source: item.source
        })
      }
      
    })
    
    let params = {
      topicId: topicId,
      catchInDate: list[0].content,
      catchCategory: list[1],
      catchLevel: list[2],
      // catchBrand:list[3].content,
      catchLocation: list[3],
      catchOther: alters
    };
    if (param) {
      Object.assign(params, param);
    }
    if (alters.length == 0) {
      delete params.catchOther;
    }
    
    
    /*if(!this.validateFilter(params))
     {
     this.alertMsg("请至少设置一个抓取条件");
     return;
     }*/
    
    dispatch(saveFetch(params)).then((result) => {
      if (result.apiError) {
        this.alertMsg(result.apiError.errorMessage);
        return false;
      }
      else {
        _this.alertMsg("操作成功")
      }
      if (callBack) {
        
        callBack(result.apiResponse.topicId);
      }
    });
  }
  
  submit() {
    let _this = this;
    this.save({
      
      callBack: (topicId) => {
        this.context.router.push("/cms/topicManage/" + topicId + "/3");
      }
    });
  }
  
  validateFilter(params) {
    
    let isValidate = true;
    if (params.catchCategory.content.length <= 0 && params.catchLevel.content.length <= 0 && params.catchLocation.content.length <= 0)//分类
    {
      isValidate = false;
    }
    if (!isValidate && params.catchInDate.length > 1 && params.catchInDate[0] && params.catchInDate[1]) {
      if (new Date(params.catchInDate[1]).getTime() - new Date(params.catchInDate[0]).getTime() > 0) {
        isValidate = true;
      }
    }
    if (!isValidate && params.catchOther && params.catchOther.length > 0) {
      isValidate = true;
    }
    return isValidate;
  }
  
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
}