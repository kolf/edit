import React, {Component} from "react";
import {Link}             from "react-router";
import {getStorage}       from "app/api/auth_token";
import {invalid}          from "app/action_creators/session_action_creator";
import {Menu, Dropdown, message} from 'antd';
import {clearStorage}     from "app/api/auth_token";

const avatarImage = require('app/assets/avatars/avatar.png');
const avatarImage1 = require('app/assets/avatars/avatar1.png');
const avatarImage2 = require('app/assets/avatars/avatar2.png');
const avatarImage3 = require('app/assets/avatars/avatar3.png');
const avatarImage4 = require('app/assets/avatars/avatar4.png');
const avatarImage5 = require('app/assets/avatars/avatar5.png');
// const userImage = require('app/assets/avatars/user.jpg');
const logo = require('app/assets/avatars/logo.png');

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: getStorage('userName')
    };
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  render() {
    const {userName} = this.state;
    return (
      <div id="navbar" className="navbar navbar-default">
        <div id="navbar-container" className="navbar-container">
          <div className="navbar-header pull-left">
            <Link className="navbar-brand" to="/home">
              <small style={{"fontSize": "60%"}}><img height={"20px"} style={{"marginRight": "10px"}} src={logo}></img>VCG
                内容管理系统
              </small>
            </Link>
          </div>
          <div className="navbar-buttons navbar-header pull-right" role="navigation">
            <ul className="nav ace-nav">
              {/*
               <li className="purple">
               <Link to="#" title="开发中..." data-toggle="dropdown" className="dropdown-toggle">
               消息
               <i className="ace-icon fa fa-bell icon-animated-bell"></i>
               <span className="badge badge-important">0</span>
               </Link>
               </li>
               
               <li className="green">
               <Link to="/user/drafts" data-toggle="dropdown" className="dropdown-toggle">
               <i className="ace-icon fa fa-envelope icon-animated-vertical"></i>
               </Link>
               </li>
               
               */}
              <li className="favorites">
                <Link to="/user/favorites" data-toggle="dropdown" className="dropdown-toggle">
                  <i className="ace-icon fa fa-star icon-animated-vertical"></i>
                </Link>
              
              
              </li>
              <li className="user">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <Link
                          to="/user/password"
                          data-toggle="dropdown"
                          className="dropdown-toggle">
                          修改密码
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <a onClick={this.loginOut.bind(this) }>
                          <i className="ace-icon fa fa-power-off"></i> 登出
                        </a>
                      </Menu.Item>
                    </Menu>
                  }>
                  <a data-toggle="dropdown" className="dropdown-toggle">
                    <img className="nav-user-photo" src={avatarImage5} alt="Jason's Photo"/>
                    <span className="user-info">{userName}</span>
                    <i className="ace-icon fa fa-caret-down"></i>
                  </a>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
  
  loginOut() {
    message.success('登出成功!');
    clearStorage();
    this.context.router.push("/login");
  };
}
