import React, {Component, PropTypes}    from "react";
import {connect}                        from "react-redux";
import ReactDOM                         from "react-dom";

import Button from "antd/lib/button";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
import Checkbox from "antd/lib/checkbox"
import "./css/pushto_step3.css";
import {isEnv} from "app/utils/utils";

import {

} from "app/action_creators/edit_action_creator";

const Option = Select.Option;

// 自媒体
let topicsmedia = [{
    value: 1100,
    label: '图播快报'
},{
    value: 1400,
    label: '最星动'
},{
    value: 1200,
    label: '图说赛事'
},{
    value: 1300,
    label: '图话历史'
},{
  value: 1600,
  label: '潮我看'
},{
    value: 1500,
    label: '智游12301'
},{
    value: 7777,
    label: '技术测试-A'
}];

// 企鹅号
let topicsqq = [{
    value: 301,
    label: '图播快报'
},{
    value: 304,
    label: '最星动'
},{
    value: 302,
    label: '图说赛事'
},{
    value: 303,
    label: '图话历史'
},{
    value: 305,
    label: '智游12301'
}];

if(!isEnv('dev')){
    topics.length = 5
}

export let PushToStep3 = React.createClass({

    getInitialState() {
      return {
        checked: [false,false,false],
        topicId: []
      };
    },

    componentDidMount() {},

    onChange(value, key, type) {
      const {checked, topicId} = this.state;

      if(type!="select") {
        checked[key] = !checked[key];
      }

      if(!checked[key]){
          topicId[key] = "";
      } else {
        if(key === 0 && (type != "select")) {
          value = 1100;
        }
        if(key === 1 && (type != "select")) {
          value = 301;
        }
        topicId[key] = value;
      }

      // console.log(topicId)

      this.setState({checked, topicId});
      const {handleOnPublish} = this.props;
      handleOnPublish(topicId);
    },

    /**
     * 设置显示推送页面，已经推送过的ID，超过50个之后显示省略号
    */

    forMatResIds() {
      const {resIds} = this.props;
      let [def, totalLength] = [0, 10];

      if (resIds.length > def) {
        if (resIds.length > totalLength) {
          return resIds.slice(def, totalLength).join('、') + '...';
        } else {
          return resIds.join('、');
        }
      }
    },

    render() {
        const {hide} = this.props;
        const {checked,topicId} = this.state;

      return (
          <div className="pushto-step3">
              <div className={hide ? 'hide' : 'break-word alert alert-danger'}>已推送过图ID：{this.forMatResIds()}</div>
              <h5>请选择推送方：</h5>
              <div className="checkGroup" style={{"margin":"0px"}}>
                  <div className="checkblock">
                      <Checkbox checked={checked[0]} className='col-xs-3' vlaue={topicId[0]} onChange={(e)=>{this.onChange(e.target.vlaue, 0)}}>自媒体号</Checkbox>
                      {checked[0] &&
                          <Select defaultValue={topicId[0] || ""} style={{ width: 170 }} onChange={(value)=>{this.onChange(value, 0, 'select')}}>
                              {topicsmedia.map(item => <Option value={item.value}>{item.label}</Option>)}
                          </Select>
                      }
                  </div>
                  <div className="checkblock">
                      <Checkbox checked={checked[1]} className='col-xs-3' vlaue={topicId[0]} onChange={(e)=>{this.onChange(e.target.value, 1)}}>企鹅号</Checkbox>
                      {checked[1] &&
                          <Select defaultValue={topicId[1] || ""} style={{ width: 170 }} onChange={(value)=>{this.onChange(value, 1, 'select')}}>
                              {topicsqq.map(item => <Option value={item.value}>{item.label}</Option>)}
                          </Select>
                      }
                  </div>
                  <div className="checkblock">
                      <Checkbox checked={checked[2]} className='col-xs-3' value={6} onChange={(e)=>{this.onChange(e.target.value, 2)}}>人民日报</Checkbox>
                      {/* <Checkbox checked={checked[1]} value={8888} onChange={(e)=>{this.onChange(e.target.value,1)}}>{"技术测试-B"}</Checkbox> */}
                  </div>
              </div>
          </div>
      )
    }

})
