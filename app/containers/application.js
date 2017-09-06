import React               from "react";
import {connect}           from "react-redux"
import {initializeSession} from "app/action_creators/session_action_creator";
import {getStorage,clearStorage} from "app/api/auth_token";
import {getUserInfo}       from "app/action_creators/passport_action_creator"
import Message             from "antd/lib/message";

const queryUrl = (name) => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    const r = decodeURIComponent(window.location.search).substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
};

const select = (state) => ({
  layoutsError: state.application.layoutsError,
  isInitializingSession: state.application.isInitializingSession,
  sessionValid: state.application.sessionValid,
  "user": state.passport.user,
  "token": state.passport.token
});

@connect(select)
export default class Application extends React.Component {

  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };

    componentWillReceiveProps(nextProps) {
        //console.log('componentWillReceiveProps', nextProps);
        //console.log(getStorage('token'));

        if (getStorage('token')) {
            return
        }
        const query = nextProps.location.query || {};

        //console.log(window.location);
        //console.log('-------------------token', query.token);
        //console.log(queryUrl('token'));

        // if (query.token) {
        //     this.auth(query.token, (isLogin) => {
        //         if(isLogin){
        //             // const redirect = queryUrl('redirect');
        //             // //console.log('isLogin');
        //             window.location.reload()
        //         }
        //     })
        // }
    }

  componentWillMount() {
      const token = getStorage('token');
      const urlToken = queryUrl('token');

      //console.log(token);
      //console.log(urlToken);

      if(!token && urlToken){
          this.auth(urlToken, (isLogin) => {
              if(isLogin){
                  // const redirect = queryUrl('redirect');
                  // //console.log('isLogin');
                //   window.location.reload()
              }
          });

          return false;
      }

    if(!token) this.loginOut();
    this.auth(token);
  };

  auth(token, callback) {
    const {dispatch} = this.props;
    dispatch(getUserInfo({token})).then((res) => {
      if (res.apiError) {
        Message.error(res.apiError.errorMessage);
        return false;
      }
      const {user} = this.props;
      if(_.isEmpty(user)) {
        this.loginOut();
      }else if(token&&user.enabled==1&&user.level.indexOf('editor_admin')>=0){
          callback && callback(true)
      }else{
        this.loginOut();
      }
    });
  };

  loginOut() {
    Message.error('您无权访问，请联系管理员。');
    clearStorage();
    this.context.router.push("/login");
  };

  render () {
    return this.props.children;
  }

}
