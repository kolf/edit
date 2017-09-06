import React, {Component} from "react"

import DatePicker         from "react-datepicker"
import moment             from "moment"

import ANTDatePicker from "antd/lib/date-picker";
const MonthPicker = ANTDatePicker.MonthPicker;

import {getStorageFilter} from "app/action_creators/editor_action_creator";
import {Collapse} from "react-bootstrap/lib";
import ComboBox  from "app/components/provider/combobox";

import Select from "antd/lib/select";
import Cascader from "antd/lib/cascader";
import message from "antd/lib/message";
const Option = Select.Option;

import 'react-datepicker/dist/react-datepicker.css'
import "./filter.css"

import {
  regionQuery    // query
} from "app/action_creators/common_action_creator";

export default class FilterBox extends Component {
  constructor(props) {
    super(props);
    this.toolInit = {
      "status": true, // true Open false Close
      "text": ["显示筛选", "收起筛选"],
      "icon": ["fa-chevron-down", "fa-chevron-up"],
      "toolName": ["hidden", ""]
    };
    this.itemExpandInit = {
      "status": true, // true Open false Close
      "text": ["更多", "收起"],
      "icon": ["fa-chevron-down", "fa-chevron-up"],
      "itemName": ["", "expand"],
      "itemNumber": 16,
      "otherNumber": 8
    };
    this.itemCheckboxInit = {
      "status": true, // true Checkbox false Radio
      "btnName": ["", "hidden"], // button more
      "btnItem": ["hidden", ""], // button item submit cancel
      "checkboxName": ["", "lbl"],
      "data": {}
    };
    this.itemLineInit = {
      "status": true, // true open false close
      "lineName": ["hidden", ""]
    };
    this.state = {
      "tool": {},
      "itemExpand": {},
      "itemCheckbox": {},
      "itemLine": {},
      "field": "",
      "startDate": {},
      "endDate": {},
      "tags": {},
      "optionData": null,
      "showTag": false,
      "defaultValue": "",
      "regionOptions": []
    };
    this.runField = [];
  };

  componentWillMount() {
    this.renderTagsSort();
  };

  componentDidMount() {
    this.handleOnSearch();
  };

  componentWillReceiveProps(nextProps) {
  };

  renderTagsSort() {
    const {dataFilter, filterInit} = this.props;
    let tags = {};
    [...dataFilter].map((item) => {
      const {field, type} = item;
      tags[field] = {
        "type": type ? type : "text",
        "itemIsDisplay": true,
        "tagIsClosed": true,
        "field": field,
        "fieldText": item.text,
        "text": '',
        "id": ''
      };
    });
    if (filterInit) {
      Object.assign(tags, filterInit);
    }
    this.state.tags = tags;
    //this.setState({tags});
  };

  renderTags() {
    //const tags = Object.values(this.state.tags);
    const tags = this.props.filterInit ? Object.values(this.props.filterInit) : [];

    return (
      <span className="words">
                {tags.map((item, i) => {
                  if (!item.id && !item.text) {
                    return false
                  }
                  return (
                    <span className="tag" key={i}>
                            <span className="txt">{item.fieldText + item.text}</span>
                      {item.tagIsClosed && <i className="fa fa-times"
                                              data-field={item.field}
                                              onClick={this.deleteTag.bind(this)}></i>}
                        </span>
                  );
                })}
            </span>
    );
  };

  renderText(item, line) {
    let {value, field} = item;
    if (!value) {
      return false
    }
    // status true Checkbox false Radio
    const {status, checkboxName, data} = this.state.itemCheckbox[field];
    const label = data.map((label, col) => {
      const selectClass = label.status ? ' here' : ' ';
      return (
        <label key={col}>
          {status && <input type="checkbox" value={label.id} defaultChecked={label.status} className="ace"/>}
          <span className={"hand " + checkboxName + selectClass}
                data-field={field}
                data-id={label.id}
                onClick={this.onClickText.bind(this, line, col)}>{' ' + label.text}</span>
        </label>
      )
    });
    return [label];
  };

  renderSelect(item, i) {
    const text = this.renderText(item);
    const select = (
      <div className="input-daterange input-group" key={i}>
        <select className="form-control" onchange={this.onSelect.bind(this)}>
          {
            [...item.option].map((option, j) => {
              return (
                <option value={option.id} key={j}>{option.text}</option>
              )
            })
          }
        </select>
      </div>
    );
    return [text, select];
  };

  renderTime(item, i) {
    const field = item.field;
    const text = this.renderText(item);
    const time = (
      <span data-field={field} onClick={this.onDatePickerField.bind(this)} key={i}>
                <DatePicker
                  selected={this.state.startDate[field]}
                  startDate={this.state.startDate[field]}
                  endDate={this.state.endDate[field]}
                  dateFormat="YYYY/MM/DD"
                  placeholderText="请选择开始时间"
                  locale="zh-cn"
                  todayButton={"今天"}
                  className={field}
                  tabIndex={1}
                  onChange={this.onDatePickerStart.bind(this)}/>
                <span style={{"padding": "0 8px"}}>至</span>
                <DatePicker
                  selected={this.state.endDate[field]}
                  startDate={this.state.startDate[field]}
                  endDate={this.state.endDate[field]}
                  dateFormat="YYYY/MM/DD"
                  placeholderText="请选择结束时间"
                  locale="zh-cn"
                  todayButton={"今天"}
                  className={field}
                  tabIndex={2}
                  onChange={this.onDatePickerEnd.bind(this)}/>
            </span>
    );
    return [text, time];
  };

  renderMonth(item, i) {
    const field = item.field;
    const text = this.renderText(item);
    const time = (
      <span data-field={field} onClick={this.onMonthPickerField.bind(this)} key={i}>
                <MonthPicker format={"YYYYMM"} onChange={this.onMonthPicker.bind(this)}/>
            </span>
    );
    return [text, time];
  };

  renderSearch(item, i) {
    const text = this.renderText(item);
    const search = (
      <ComboBox
        defaultValue={this.state.defaultValue}
        handOnSelect={(value, option) => this.onComboBoxSearch(item, value, option)}
        type={item.field}
        assetFamily={this.props.assetFamily ? this.props.assetFamily : ""}
        dispatchAct={getStorageFilter}
        dispatch={this.props.dispatch}
        key={i}
        isOneTime={this.props.isOneTime}
      >
      </ComboBox>
    );
    return [text, search];
  };

  renderKeyword(item, i) {
    return (
      <div className="input-group">
        <input type="text" ref={'j_keyword_' + item.field} name={item.field} placeholder={item.placeholder}
               className="form-control input-mask-product"/>
        <span className="input-group-addon hand" onClick={() => this.onKeyword(item)}>
                    <i className="ace-icon fa fa-search"></i>
                </span>
      </div>
    );
  };

  onKeyword(item) {
    const keyword = this.refs['j_keyword_' + item.field].value;
    const params = {
      "field": item.field,
      "text": keyword,
      "id": keyword
    };
    this.addTags(params);
  };

  onComboBoxSearch(item, value, option) {
    const params = {
      "field": item.field,
      "text": value,
      "id": option.props.id
    };
    this.addTags(params);
    const {itemCheckbox} = this.state;
    itemCheckbox[item.field].data.map((item) => {
      item.status = false;
    });
    this.setItemCheckbox({"field": item.field, "flag": false, "type": "set"});
  };

  getNewTreeData(treeData, curKey, child, level) {
    const loop = (data) => {
      //if (level < 1 || curKey.split('-').length - 3 > level * 2) return;
      data.forEach((item) => {
        if (curKey.indexOf(item.key) === 0) {
          if (item.children) {
            loop(item.children);
          } else {
            item.children = child;
          }
        }
      });
    };
    loop(treeData);
    //this.setLeaf(treeData, curKey, level);
  };

  queryRegion(params) {
    const {dispatch} = this.props;
    dispatch(regionQuery(params)).then((result) => {
      if (result.apiError) {
        message.error(result.apiError.errorMessage, 3);
        return false;
      }
      if (result.apiResponse.length == 0) return false;

      let child = [];
      result.apiResponse.map((item, i) => {
        child.push({
          "label": item.name,
          "value": item.id + "",
          "key": params.curKey + '-[' + i + ']'
        });
      });

      let regionOptions = [...this.state.regionOptions];
      if (params.parentId == 0) {
        const last = child.splice(child.length - 1, 1);
        regionOptions = last.concat(child);
      } else {
        this.getNewTreeData(regionOptions, params.curKey, child, 2);
      }
      //this.state.regionOptions = regionOptions;
      this.setState({regionOptions});
      //this.renderRegion();
    });
  };

  onChangeRegion(value, selectedOptions) {
    const curKey = value.length - 1;
    this.queryRegion({"parentId": selectedOptions[curKey].value, "curKey": selectedOptions[curKey].key});
    let region = [];
    selectedOptions.map(item => {
      region.push(item.label);
    });
    //地区查询需要传递汉字的处理
    const {isRegionName} = this.props;
    const params = {
      "field": "region",
      "text": region.join('+'),
      "id": isRegionName ? region.join(',') : value.join(',')
    };
    this.addTags(params);
  };

  renderRegion(item, i) {
    if (this.state.regionOptions.length == 0) this.queryRegion({"parentId": 0, "curKey": "[0]"});
    return (
      <Cascader placeholder="请选择地区" options={this.state.regionOptions} onChange={this.onChangeRegion.bind(this) }/>)
  };

  renderLabel(item, i) {
    const {type, field} = item;
    let label = "";
    switch (type) {
      case "select":
        label = this.renderSelect(item, i);
        break;
      case "time":
        label = this.renderTime(item, i);
        break;
      case "search":
        label = this.renderSearch(item, i);
        break;
      case "keyword":
        label = this.renderKeyword(item, i);
        break;
      case "region":
        label = this.renderRegion(item, i);
        break;
      case "month":
        label = this.renderMonth(item, i);
        break;
      default:
        label = this.renderText(item, i);
    }
    //const lineName = (i == 0 ) ? "item h72" : "item h36";
    // status true Checkbox false Radio
    const {status, btnItem} = this.state.itemCheckbox[field];
    return (
      <div>
        <div className="item h36">{label}</div>
        {status && <div className={"text-center " + btnItem}>
          <button className="btn btn-minier btn-danger" data-field={field}
                  onClick={this.onItemCheckboxSubmit.bind(this)}>提交
          </button>
          <button className="btn btn-minier" data-field={field} onClick={this.onItemCheckboxCancel.bind(this)}>取消
          </button>
        </div>}
      </div>
    );
  };

  renderItem(item, line) {
    const {value, field, type} = item;
    //if(!value){return false}
    const {tags, itemExpand, itemCheckbox} = this.state;
    const {filterInit} = this.props;
    if (!itemExpand[field]) {
      this.setItemExpand({"field": field, "flag": false});
    }
    const {text, icon, itemName} = itemExpand[field];
    let data = [];
    value.length && [...value].map((item) => {
      const obj = {...item};
      // tags&&tags[field]&&tags[field].text==item.text filterInit&&filterInit[field]&&filterInit[field].text==item.text
      obj.status = filterInit && filterInit[field] && filterInit[field].text == item.text ? true : false;
      data.push(obj);
    });
    //this.setItemCheckbox({"field":field,"flag":itemCheckbox[field]&&itemCheckbox[field].status||false,"data":data});
    if (!itemCheckbox[field]) {
      this.setItemCheckbox({"field": field, "flag": false, "data": data});
    } else {
      if (!_.isEqual(data[0], itemCheckbox[field].data[0])) {
        this.setItemCheckbox({"field": field, "flag": itemCheckbox[field].status, "data": data});
        if (tags[field] && tags[field].id) tags[field].id = "";
        if (tags[field] && tags[field].text) tags[field].text = "";
      }
    }
    const {btnName} = itemCheckbox[field];
    return (
      <div>
        <div className={"body " + itemName}>{this.renderLabel(item, line)}</div>
        <div className="foot">
          {type == "checkbox" &&
          <span className={"hand ace-icon fa smaller-20 fa-check-square-o " + btnName} data-field={field}
                onClick={this.onItemCheckbox.bind(this)}>多选</span>}
          {type != "search" && value.length > this.itemExpandInit.itemNumber &&
          <span className={"hand ace-icon fa smaller-20 " + icon} data-field={field}
                onClick={this.onItemExpand.bind(this)}>{text}</span>}
        </div>
      </div>
    );
  };

  render() {
    const group = [...this.props.dataFilter].map((item, i) => {
      let {field, text, value} = item;
      const {itemLine} = this.state;
      if (!itemLine[field]) {
        this.setItemLine({"field": field, "flag": true});
      }
      const {lineName} = itemLine[field];
      return (
        <li className={lineName} key={i}>
          <h3>{text}</h3>
          {this.renderItem(item, i)}
        </li>
      );
    });
    const {tool} = this.state;
    if (!tool["expand"]) {
      this.setTool({"field": "expand", "flag": false});
    }
    if (!tool["toolbar"]) {
      this.setTool({"field": "toolbar", "flag": true});
    }
    const {status, text, icon} = tool["expand"];
    const {toolName} = tool["toolbar"];
    return (
      <div className="widget-box transparent ui-sortable-handle filter">
        <div className="widget-header widget-header-small gray">
          <h6 className="widget-title smaller">
            <i className="fa fa-tags" aria-hidden="true"></i>
            {" 所有分类 "}
            {this.renderTags()}
          </h6>
          <div className={"widget-toolbar " + toolName}>
                        <span className={"hand ace-icon fa " + icon} onClick={this.onExpand.bind(this)}>
                            {text}
                        </span>
          </div>
        </div>
        <Collapse in={status}>
          <div className="widget-body">
            <div className="widget-main padding-0">
              <ul>{group}</ul>
            </div>
          </div>
        </Collapse>
      </div>
    )
  };

  onDatePicker({start, end}) {
    const {field, startDate, endDate} = this.state;
    if (start && start[field]) {
      start = start[field];
    } else {
      start = startDate[field] || null;
    }
    if (end && end[field]) {
      end = end[field];
    } else {
      end = endDate[field] || null;
    }
    if (start && start.isAfter(end)) {
      var temp = start;
      start = end;
      end = temp
    }
    this.setItemTime({"field": field, start, end});
    if (start && end) {
      const startStr = moment(start).startOf('day').format("YYYY-MM-DD HH:mm:ss");
      const endStr = moment(end).endOf('day').format("YYYY-MM-DD HH:mm:ss");
      const params = {
        "field": field,
        "text": startStr + ' 至 ' + endStr,
        "id": startStr + ',' + endStr
      };
      this.addTags(params);
      const {itemCheckbox} = this.state;
      itemCheckbox[field].data.map((item) => {
        item.status = false;
      });
      this.setItemCheckbox({"field": field, "flag": false, "type": "set"});
    }
  };

  onDatePickerStart(startDate) {
    const data = {};
    data[this.state.field] = startDate;
    this.onDatePicker({"start": data});
  };

  onDatePickerEnd(endDate) {
    const data = {};
    data[this.state.field] = endDate;
    this.onDatePicker({"end": data});
  };

  onDatePickerField(event) {
    this.state.field = event.target.className.split(' ')[0];
  };

  onMonthPickerField(event) {
    this.state.field = event.currentTarget.getAttribute("data-field");
  };

  onMonthPicker(month, dateValue) {
    const {field} = this.state;
    const params = {
      "field": field,
      "text": dateValue,
      "id": dateValue
    };
    this.addTags(params);
    const {itemCheckbox} = this.state;
    itemCheckbox[field].data.map((item) => {
      item.status = false;
    });
    this.setItemCheckbox({"field": field, "flag": false, "type": "set"});
  };

  setItemTime({field, start, end}) {
    const {startDate, endDate} = this.state;
    startDate[field] = start ? start : null;
    endDate[field] = end ? end : null;
    this.setState({
      "startDate": startDate,
      "endDate": endDate
    });
  };

  onExpand() {
    this.setTool({"field": "expand", "type": "set"});
  };

  setTool({field, flag, type}) {
    const {text, icon, toolName} = this.toolInit;
    const {tool} = this.state;
    if (flag == undefined) {
      flag = !tool[field].status;
    }
    const index = Number(flag);
    let init;
    if (field == "expand") {
      init = {
        "status": flag,
        "text": text[index],
        "icon": icon[index]
      };
    }
    if (field == "toolbar") {
      init = {
        "status": flag,
        "toolName": toolName[index]
      };
    }
    tool[field] = init;
    if (type == "set") {
      this.setState({"tool": tool});
    }
  };

  setItemLine({field, flag, type}) {
    const {lineName} = this.itemLineInit;
    const {itemLine} = this.state;
    if (flag == undefined) {
      flag = !itemLine[field].status;
    }
    const index = Number(flag);
    itemLine[field] = {
      "status": flag,
      "lineName": lineName[index]
    };
    if (type == "set") {
      this.setState({"itemLine": itemLine});
    }
  };

  setItemExpand({field, flag, type}) {
    const {text, icon, itemName} = this.itemExpandInit;
    const {itemExpand} = this.state;
    if (flag == undefined) {
      flag = !itemExpand[field].status;
    }
    const index = Number(flag);
    itemExpand[field] = {
      "status": flag,
      "text": text[index],
      "icon": icon[index],
      "itemName": itemName[index]
    };
    if (type == "set") {
      this.setState({"itemExpand": itemExpand});
    }
  };

  setItemCheckbox({field, flag, data, type}) {
    const {btnName, btnItem, checkboxName} = this.itemCheckboxInit;
    const {itemCheckbox} = this.state;
    const index = Number(flag);
    itemCheckbox[field] = {
      "status": flag, // true Checkbox false Radio
      "btnName": btnName[index],
      "btnItem": btnItem[index],
      "checkboxName": checkboxName[index],
      "data": data ? data : itemCheckbox[field].data
    };
    if (type == "set") {
      this.setState({"itemCheckbox": itemCheckbox});
    }
  };

  onItemExpand(event) {
    const target = event.target;
    const field = target.getAttribute('data-field');
    this.setItemExpand({"field": field, "type": "set"});
    this.setItemCheckbox({"field": field, "flag": false, "type": "set"});
  };

  onItemCheckbox(event) {
    const target = event.target;
    const field = target.getAttribute('data-field');
    this.setItemExpand({"field": field, "flag": true, "type": "set"});
    this.setItemCheckbox({"field": field, "flag": true, "type": "set"});
  };

  onItemCheckboxSubmit(event) {
    const target = event.target;
    const field = target.getAttribute('data-field');

    const {itemCheckbox} = this.state;
    let textsArg = [], idsArg = [];
    itemCheckbox[field].data.map((item) => {
      if (item.status) {
        textsArg.push(item.text);
        idsArg.push(item.id);
      }
    });
    if (idsArg.length > 0) {
      const params = {
        "field": field,
        "text": textsArg.join('+'),
        "id": idsArg.join(',')
      };
      this.addTags(params);
      //this.setItemLine({"field":field,"flag":false,"type":"set"});
    } else {
      this.deleteTag(event);
      this.setItemExpand({"field": field, "flag": false, "type": "set"});
      this.setItemCheckbox({"field": field, "flag": false, "type": "set"});
    }
  };

  onItemCheckboxCancel(event) {
    //const target = event.target;
    //const field = target.getAttribute('data-field');
    this.deleteTag(event);
  };

  handleOnSearch(current) {
    const {tags} = this.state;
    let count = 0, params = [];
    const list = Object.values(tags);
    list.map((item, i) => {
      params.push(item);
      //if(item.id&&item.text){
      //    params.push(item);
      //    ++count;
      //}
    });
    //this.setItemLine({"field":item.field,"flag":item.itemIsDisplay,"type":"set"});
    //const flag = count == listArr.length;
    //this.setTool({"field":"toolbar","flag":flag,"type":"set"});
    this.props.onSearch(params, current, tags);
    this.runField = [];
  };

  addTags(tag) {
    const {field, text, id} = tag;
    this.renderTagsSort();
    //const {tags} = this.state;
    this.state.tags[field].text = text;
    this.state.tags[field].id = id;
    //Object.assign(tags[field], {
    //    "text": text,
    //    "id": id
    //});
    //this.setState(tags);
    const current = {"operate": "add", "field": field, "id": id};
    this.handleOnSearch(current);
  };

  deleteTag(event) {
    const target = event.target;
    const field = target.getAttribute('data-field');
    this.renderTagsSort();
    const {tags, itemCheckbox} = this.state;
    const current = {"operate": "delete", "field": field, "id": tags[field].id};
    itemCheckbox[field].data.map((item) => {
      item.status = false;
    });
    tags[field].id = "";
    tags[field].text = "";
    this.state.tags = tags;
    //this.setState(tags);
    this.handleOnSearch(current);
    this.setItemLine({"field": field, "flag": true, "type": "set"});
    this.setItemExpand({"field": field, "flag": false, "type": "set"});
    this.setItemCheckbox({"field": field, "flag": false, "type": "set"});
    //this.setTool({"field":"expand","flag":true,"type":"set"});
    if (tags[field] && tags[field].type && tags[field].type == "time") {
      this.setItemTime({"field": field});
    }
  };

  onClickText(row, col, event) {
    const target = event.target;
    const field = target.getAttribute('data-field');
    const text = _.trim(target.textContent);
    const id = target.getAttribute('data-id');
    const params = {
      "field": field,
      "text": text,
      "id": id
    };
    const {tags, itemCheckbox} = this.state;
    const {status, data} = itemCheckbox[field];
    if (!status) {
      data.map((item) => {
        item.status = false;
      });
      data[col].status = true;
      this.addTags(params);
    } else {
      data[col].status = !data[col].status;
    }
    this.setItemCheckbox({"field": field, "flag": status, "type": "set"});
    if (tags[field] && tags[field].type) {
      if (tags[field].type == "time") {
        this.setItemTime({"field": field});
      }
      if (tags[field].type == "search") {
        this.setState({"defaultValue": " "});
      }
    }
  };

  onSelect() {

  };

}
