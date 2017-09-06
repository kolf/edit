import Api from "./api";
import {editorUrl} from "./api_config.js";

const dev = true;

export default {
  groupQuery(params) {
    return Api.get({
      absolutePath: '',
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          this.done(res.body.data ? res.body.data : {});
        } else {
          this.fail({errorMessage: res.body.message});
        }
      }
    });
  }
}
