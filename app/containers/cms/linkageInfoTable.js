import React, {Component} from "react";
import {Upload, Tabs, Switch, Select, DatePicker, Icon, Button, Input}        from "antd"
import {Steps}          from "app/containers/cms/steps";
export class LinkageInfoTable extends Component {
  constructor(props) {
    super(props);
    const _this = this;
    this.state = {
      editIndex: -1,
      editLevel: 0,
      newLevelOneName: "",
      newLevelTwoName: "",
      newLevelThreeName: "",
      levelOneTagName: "",
      levelTwoTagName: "",
      levelThreeTagName: "",
      editTagName: "",
      selectOneId: "",
      selectTwoId: ""
    }
  }
  
  render() {
    
    const {list} = this.props;
    
    return (
      <div id={'linkage_div'} className="table-responsive">
        
        
        {this.renderBody()}
      
      </div>
    )
  }
  
  renderHead() {
    
    return (
      <thead>
      <tr >
        <th width="20%">筛选条件名称</th>
        <th width="60%">筛选项</th>
        <th width="80%">操作</th>
      </tr>
      </thead>
    )
  }
  
  renderBody() {
    
    return (
      <div style={{display: "flex"}}>
        {this.renderBox(this.props.linkageFilterList.levelOne, "一级联动", "1")}
        {this.renderBox(this.props.linkageFilterList.levelTwo, "二级联动", "2")}
        {this.renderBox(this.props.linkageFilterList.levelThree, "三级联动", "3")}
      </div>
    )
    
    /*  return (<div>
     {[...contentArr].map((item, i) => {
     return <span key={i}><input style={{width:80}}  value={item} onChange={_this.handleInputChange.bind(_this, "feFilter", index, i)}/>
     <Button shape="circle" size="small" icon="minus" className="btn-danger" onClick={_this.delFilterContent.bind(_this, index, i)}></Button></span>;
     })}
     <Button size="small" shape="circle" type="primary" icon="plus" onClick={_this.addFilterItem.bind(_this, index)}></Button></div>)*/
  }
  
  renderBox(contentObj, title, level) {
    let _this = this;
    let list = "";
    let tagName = "";
    
    if (!contentObj || !contentObj.content || contentObj.content.length <= 0) {
      
      list = "";
    }
    else {
      
      tagName = contentObj.tag.name;
      if (level == "1" && this.state.levelOneTagName) {
        tagName = this.state.levelOneTagName;
      }
      if (level == "2" && this.state.levelTwoTagName) {
        tagName = this.state.levelTwoTagName;
      }
      if (level == "3" && this.state.levelThreeTagName) {
        tagName = this.state.levelThreeTagName;
      }
      
      list = contentObj.content.map((item, i) => {
        return <div key={i} className="box_firsttr">
          <a style={{display: (_this.state.editIndex == i && _this.state.editLevel == level) ? "none" : "block"}}
             data-id={item.id} id={"filter" + level + "tag" + i} data-pid={item.pid}
             onClick={_this.handleTagClick.bind(_this, item.id, item.pid, level)}
             className={item.id == contentObj.selected ? "filter_active" : "filter"} href="javascript:;">{item.name}</a>
          <div style={{display: (_this.state.editIndex == i && _this.state.editLevel == level) ? "none" : "block"}}
               className="ml_10">
            <i style={{marginLeft: "5px"}} title="编辑" onClick={this.editTagClick.bind(_this, i, level, item.name)}
               className="ace-icon fa hand blue bigger-110 fa-edit"></i>
            <button style={{height: "16px", width: "16px", marginTop: "-2px", marginLeft: "5px"}}
                    onClick={this.handleDeleteFilterClick.bind(this, item.id)} type="button"
                    className="filter_delete ant-btn ant-btn-circle ant-btn-sm ant-btn-icon-only btn-danger">
              <i title="删除" className="anticon anticon-minus "></i>
            </button>
          </div>
          <div className="ml_5"
               style={{display: (_this.state.editIndex == i && _this.state.editLevel == level) ? "block" : "none"}}>
            <input style={{width: 150}} value={this.state.editTagName}
                   onChange={_this.handleEditTagInputChange.bind(_this)}/>
            <input className="btn_save_linkage"
                   onClick={_this.handlerSaveLinkageClick.bind(_this, level, item.id, item.pid)} type="Button"
                   value="保存"/>
            <input className="btn_save_linkage" onClick={_this.handlerCancelClick.bind(_this)} type="Button"
                   value="取消"/>
          </div>
        </div>
      })
    }
    let tagId = contentObj ? contentObj.tag ? contentObj.tag.id : "" : "";
    return (<div className="topic_box">
      <div>{title}</div>
      <div className="box_firsttr">
        
        <input style={{width: "150px", height: "25px"}} id={"txttag" + level} value={tagName}
               onChange={this.handleInputChange.bind(_this, level)}/>
        <input className="btn_save_linkage" type="Button" onClick={_this.handlerSaveTagClick.bind(_this, level, tagId)}
               value="保存标签"/>
      </div>
      {list}
      <div>
        <input style={{width: 150}} id={"newtag" + level} onChange={this.handleNewTagInputChange.bind(this)}/>
        <input className="btn_save_linkage" type="Button" onClick={_this.handlerAddLinkageClick.bind(_this, level)}
               value="保存"/></div>
    </div>)
  }
  
  componentDidMount() {
    
    this.setState({
      selectOneId: this.props.linkageFilterList.levelOne ? this.props.linkageFilterList.levelOne.selected : "",
      selectTwoId: this.props.linkageFilterList.levelTwo ? this.props.linkageFilterList.levelTwo.selected : "",
    })
  };
  
  editTagClick(index, level, name) {
    this.setState({editIndex: index, editLevel: level, editTagName: name})
  }
  
  handlerCancelClick() {
    this.setState({editIndex: "-1", editLevel: "0", editTagName: ""});
  }
  
  //标签点击联动事件
  handleTagClick(id, pid, level) {
    
    this.props.handleGetLinkageFilter(level, pid, id)
    if (level == "1") {
      this.setState({
        selectOneId: id
      })
    }
    else if (level == "2") {
      this.setState({
        selectTwoId: id
      })
    }
    
  }
  
  //修改标签
  handleInputChange(e, level) {
    let newName = e.target.value;
    switch (level) {
      case "1":
        this.setState({
          levelOneTagName: newName
        })
        break;
      case "2":
        this.setState({
          levelTwoTagName: newName
        })
        
        break;
      case "3":
        this.setState({
          levelThreeTagName: newName
        })
        
        break;
    }
    //this.forceUpdate();
  }
  
  //编辑filter
  handleEditTagInputChange(e) {
    this.setState({
      editTagName: e.target.value
    })
  }
  
  //新增filter 文本change
  handleNewTagInputChange(level, id, pid) {
  
  }
  
  //删除条件
  handleDeleteFilterClick(id) {
    this.props.handleDeleteFilterClick(id)
  }
  
  //新筛选项条件
  handlerAddLinkageClick(level) {
    
    let _this = this;
    let name = document.querySelector("#newtag" + level).value;
    let pid = "";//document.querySelector("#filter"+level+"tag0").getAttribute("data-pid");
    let ppid = "";
    if (level == "1") {
      pid = "0"
    }
    else if (level == "2") {
      pid = this.state.selectOneId;
      if (!pid) {
        pid = this.props.linkageFilterList.levelOne ? this.props.linkageFilterList.levelOne.selected : ""
      }
    }
    else {
      ppid = this.state.selectOneId ? this.state.selectOneId : this.props.linkageFilterList.levelOne.selected;
      pid = this.state.selectTwoId ? this.state.selectTwoId : this.props.linkageFilterList.levelTwo.selected;
      ;
    }
    
    let id = "";
    
    this.props.handleSaveLinkageFilter(level, id, pid, ppid, name, function (data) {
      document.querySelector("#newtag" + level).value = "";
      if (!data.apiError) {
        if (level == "1") {
          _this.setState({editIndex: "-1", editLevel: "0", editTagName: "", selectOneId: data.apiResponse.id});
        }
        else {
          _this.setState({editIndex: "-1", editLevel: "0", editTagName: "", selectTwoId: data.apiResponse.id});
        }
        
        
      }
    });
  }
  
  //修改筛选条件
  handlerSaveLinkageClick(level, id, pid) {
    let _this = this;
    
    let ppid = "";
    
    if (level == "3") {
      ppid = this.state.selectOneId;
    }
    
    
    this.props.handleSaveLinkageFilter(level, id, pid, ppid, this.state.editTagName, function (data) {
      if (!data.apiError) {
        if (level == "1") {
          _this.setState({editIndex: "-1", editLevel: "0", editTagName: "", selectOneId: data.apiResponse.id});
        }
        else {
          _this.setState({editIndex: "-1", editLevel: "0", editTagName: "", selectTwoId: data.apiResponse.id});
        }
        
        
      }
    });
    /*this.props.handleSaveLinkageFilter(level,id,pid,this.state.editTagName,function(data)
     {
     if(!data.apiError)
     {
     _this.setState({editIndex:"-1",editLevel:"0",editTagName:""});
     }
     });*/
  }
  
  //保存标签
  handlerSaveTagClick(level, tagId) {
    let tagText = document.querySelector("#txttag" + level).value;
    let param = {tagName: tagText, level: level, id: tagId};
    this.props.handleSaveTag(param);
  }
}
