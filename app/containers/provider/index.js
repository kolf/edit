import React, {Component, PropTypes} from "react";
import {Link}             from "react-router";

import Header             from "app/containers/header";
import SidebarNav         from "app/containers/sidebar/index";

import {isStorage, getStorage, setStorage} from "app/api/auth_token";

const navData = [
  {
    projectName: 'provider',
    children: [{
      path: '/provider',
      text: '供应商信息查询',
      icon: 'fa-history',
      children: [{
        path: '/provider/contributor',
        text: '供稿人信息',
        icon: 'fa-caret-right'
      }, {
        path: '/provider/agency',
        text: '机构信息',
        icon: 'fa-caret-right'
      }]
    }]
  }
];

export default class providerContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentWillMount() {
    const {dispatch} = this.props;
    if (!isStorage('token')) {
      this.context.router.push("/login");
    }
    ;
  };
  
  render() {
    const {pathname} = this.props.location;
    
    return (
      <div className="secured-layout">
        <Header />
        <div id="main-container" className="main-container">
          <SidebarNav navData={navData} pathname={pathname}/>
          <div className="main-content">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  };
  
  
}
