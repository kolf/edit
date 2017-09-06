import React, {Component} from "react";
import {connect} from "react-redux";
import LoginComponent from "app/components/login";
import {isStorage, setStorage, clearStorage} from "app/api/auth_token";
import {signIn, getUserInfo} from "app/action_creators/passport_action_creator";
import Message from "antd/lib/message";

const queryUrl = (name) => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  const r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
  if (r != null) {
    return unescape(r[2])
  }
  return null; //返回参数值
};

const select = (state) => ({
  "passportError": state.passport.error,
  "user": state.passport.user,
  "token": state.passport.token
});
@connect(select)
export default class LoginContainer extends Component {
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentWillMount() {
    document.title = '登录 - 内容管理系统 - VCG © 视觉中国';
    let token = queryUrl('token');
    if (token) {
      if (token.indexOf('?')) token = token.split('?')[0];
      this.auth(token);
      return false;
    }
    if (isStorage("token")) {
      this.context.router.push("/home");
    }
  };
  
  render() {
    return (
      <LoginComponent onSubmit={this.handleSubmit.bind(this)} passportError={this.props.passportError}/>
    );
  };
  
  handleSubmit(params) {
    const {dispatch} = this.props;
    dispatch(signIn(params)).then((result) => {
      if (result.apiError) {
        Message.error(result.apiError.errorMessage);
        return false;
      }
      const {token} = this.props;
      this.auth(token);
    });
  };
  
  auth(token) {
    const {dispatch} = this.props;
    if (!token) {
      this.loginOut();
      return false;
    }
    dispatch(getUserInfo({token})).then((res) => {
      if (res.apiError) {
        Message.error(res.apiError.errorMessage);
        return false;
      }
      const {user, token} = this.props;
      if (_.isEmpty(user)) {
        this.loginOut();
      } else if (token && user.enabled == 1 && user.level.indexOf('editor_admin') >= 0) {
        this.context.router.push("/home");
      } else {
        this.loginOut();
      }
    });
  };
  
  loginOut() {
    Message.error('您无权访问，请联系管理员。');
    clearStorage();
    this.context.router.push("/login");
  };
}
