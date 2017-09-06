import Api from "./api";
import {passportUrl, editorUrl} from "./api_config.js";

const dev = true;

export default {
  signIn(params) {
    const msg = {
      '401': '用户名或密码错误，请重新试试',
      '402': '用户不存在',
      '2001': '用户无效或者被锁定'
    };
    return Api.post({
      absolutePath: passportUrl + "/vcglogin/access",
      body: params,
      ignoreAuthFailure: true,
      // ContentType: 'application/x-www-form-urlencoded',
      parse(res) {
        if (res.body.status == 200) {
          this.done(res.body);
        } else {
          const code = res.body && res.body.status;
          this.fail({errorMessage: msg[code]});
        }
      }
    });
  },
  modifyPwd(params) {
    return Api.post({
      absolutePath: editorUrl + "/user/modifyPwd",
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body && res.body.status == 200) {
          this.done(res.body);
        } else {
          // res.body.message
          this.fail({errorMessage: "密码修改失败"});
        }
      }
    });
  },
}
