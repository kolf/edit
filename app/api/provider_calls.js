import Api from "./api";
import {edgeUrl, providerUrl} from "./api_config.js";

const dev = true;

export default {
  
  searchProvider (params) { // 搜索供应商
    return Api.post({
      absolutePath: dev && providerUrl + '/provider/searchProviderInfo',
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.data) {
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
      }
    });
  },
  providerView (params) { // 供应商详情 providerId
    return Api.get({
      path: "/provider/view",
      absolutePath: dev && (edgeUrl + '/provider/findContactByProviderId?providerId=' + params.providerId),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.data) {
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
      }
    });
  }
  
  
}
