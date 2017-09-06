import React, {Component} from "react";
import {connect}          from "react-redux";

import CrumbsBox from "app/components/common/crumbs";

import Spin from 'antd/lib/spin';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';

import {postdownLoadphoto} from "app/action_creators/provider_action_creator";

const select = (state) => ({});
@connect(select)

export default class LoginContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首页"},
        {"path": "/uploadphoto", "text": "资源下载"}
      ],
      "value": ""
    };
  };
  
  componentWillMount() {
  
  };
  
  render() {
    const {crumbs, providerId, photoList} = this.state;
    const {providerList, providerdata} = this.props;
    
    return (
      <div className="main-content-inner">
        <CrumbsBox crumbs={crumbs}/>
        <div className="page-content pl-40">
          <h3 className="mb-40 mt-50">Getty图片下载</h3>
          <Input autosize placeholder="请输入图片ID" type="textarea" autoComplete="off" onChange={ e => {
            this.state.value = e.target.value
          }}/>
          <hr/>
          <Button type="primary" size="large" onClick={this.handOnSbmit.bind(this)}>下载</Button>
        </div>
      </div>
    );
  };
  
  handOnSbmit() {
    const {value} = this.state;
    const {dispatch} = this.props;
    
    dispatch(postdownLoadphoto(value.split(","))).then(result => {
      if (result.apiError) return false;
    });
  }
}




