import Api from "./api";
import {cmsAdUrl} from "./api_config.js";

const dev = true;

export default{
  publicAd(params) {
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/channel/publicAdInfo/' + params.id + '?api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  
  publicRecommend(params) {
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/channel/publicRecommendList/' + params.id + '?api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  
  picInfo(params) {
    return Api.get({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/channel/getPicInfoById/' + params.resourceId + '?resourceType=' + params.resourceType + '&api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  
  cmsChannelList(params) {
    return Api.get({
      path: "/cms/channelList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/' + params.pageClass + '/list?api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  
  channelCfg(params) {
    return Api.post({
      path: "/cms/channelCfg",
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  scrollList(params) {
    return Api.post({
      path: "/cms/scrollList",
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  picList(params) {
    let method = params.method || 'get';
    return Api[method]({
      path: "/cms/picList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/page/' + params.id + '/' + params.type + "?api_token=" + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  adPicList(params) {
    let method = params.method || 'get';
    return Api[method]({
      path: "/cms/picList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/channel/channelAdInfo/' + params.id + "?api_token=" + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  recommendPicList(params) {
    let method = params.method || 'get';
    return Api[method]({
      path: "/cms/picList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/channel/channelRecommend/' + params.id + "?api_token=" + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  deletePic(params) {
    return Api.delete({
      path: "/cms/picList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/page/' + params.id + '?api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  deleteAdPic(params) {
    return Api.delete({
      path: "/cms/picList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/channel/channelAdInfo/' + params.id + '?api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
      }
    });
  },
  
  tagData(params) {
    let method = params.method || 'get';
    return Api[method]({
      path: "/cms/contentList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/pageTabs/' + params.id + "?api_token=" + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      cancelPendingRequests: true,
      apiCallName: 'tagData',
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  
  tagPicList(params) {
    let method = params.method || 'get';
    const pathDic = {
      'get': 'get',
      'post': 'set'
    };
    return Api[method]({
      path: "/cms/contentList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/' + pathDic[method] + 'TabPic/' + params.id + "?api_token=" + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  
  deleteTag(params) {
    return Api.delete({
      path: "/cms/contentList",
      absolutePath: dev && (cmsAdUrl + '/v1/cms/pageTabs/' + params.id + "?api_token=" + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  }
  // favorite end
}
