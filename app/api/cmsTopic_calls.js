import Api from "./api";
import {cmsTopicUrl} from "./api_config.js";

const dev = true;

export default {
  cmsTopicUrlStatus(params) {
    return Api.get({
      path: "/param/filter",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicStatus/' + params.topicId + "?api_token=" + localStorage.getItem("token")),
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
        
      }
    });
  },
  
  cmsSearch(params) {
    return Api.get({
      path: "/cms/topicsList",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms_topic_list' + "?api_token=" + localStorage.getItem("token") + "&" + Api.stringify(params)),
      // body: params,
      ignoreAuthFailure: true,
      cancelPendingRequests: true,
      apiCallName: 'cmsSearch',
      parse: function (res) {
        if (res.body.status == 1) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
      }
    });
  },
  
  cmsFilter(params) {
    return Api.get({
      path: "/param/filter",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/list_category_by_pid?pid=0&api_token=' + localStorage.getItem("token")),
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.status == 1) {
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
        
      }
    });
  },
  cmsGetChildFilter(params){
    let queryString = "";
    if (params.level && params.filterId) {
      
      if (params.level == 1) {
        queryString = "&levelOne=" + params.filterId;
      }
      if (params.level == 2) {
        queryString = "&levelOne=" + params.pid + "&levelTwo=" + params.filterId;
      }
      
    }
    return Api.get({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/filterLinkage/' + params.topicId + '?api_token=' + localStorage.getItem("token") + queryString),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          //res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.messages});
        }
        
      }
    });
  },
  cmsSaveLinkageFilter(params)
  {
    //let method = 'post', topicPath = '';
    let data = {"linkage": JSON.stringify(params)};
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/filterLinkage/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
      body: data,
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
  cmsDeleteLinkageFilter(params)
  {
    //let method = 'DELETE', topicPath = '';
    
    return Api.delete({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/filterLinkage/' + params.id + '?api_token=' + localStorage.getItem("token")),
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
  cmsSaveLinkageFilterTag(params)
  {
    let data = JSON.stringify(params);
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/filterLinkageTag/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  
  topicFrequency(params) {
    return Api.post({
      path: "/param/filter",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicUseRate/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
        
      }
    });
  },
  
  topicCfg(params) {
    return Api.post({
      path: "/cms/topicCfg",
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.code == 200) {
          res.body.data.params = params;
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
        
      }
    });
  },
  
  getBasicInfo(params) {
    return Api.get({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicBaseInfo/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  
  saveBasicInfo(params) {
    
    let method = 'post', topicPath = '';
    if (params.topicId != 0) {
      method = 'put';
      topicPath = '/' + params.topicId;
    }
    return Api[method]({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicBaseInfo' + topicPath + '?api_token=' + localStorage.getItem("token")),
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
  
  bsFetch(params) {
    return Api.get({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicCatchInfo/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  
  saveFetch(params) {
    
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicCatchInfo/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  
  feFilter(params) {
    return Api.get({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicFilterInfo/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  
  saveFilter(params) {
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicFilterInfo/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  
  publicTopic(params) {
    return Api.post({
      path: "/cms/topicCfg",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/publicTopic/' + params.topicId + '?api_token=' + localStorage.getItem("token")),
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
  cmsContentFilter(params) {
    return Api.get({
      path: "/cms/contentFilter",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicFilterInfo/' + params.topicId + "?api_token=" + localStorage.getItem("token")),
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
  
  cmsContentSearch(params) {
    if (params && !params.api_token) {
      params.api_token = localStorage.getItem("token");
    }
    return Api.post({
      path: "/cms/contentList",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/cms/topicContentManage/' + params.topicId + "?api_token=" + localStorage.getItem("token")),
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
  
  // 获取常用专题列表
  editJoinToSpecial(params) {
    return Api.get({
      path: "/edit/jointospecial",
      absolutePath: dev && (cmsTopicUrl + '/v1/topic/list_topic_info?page=1&nums=20&focus=2'),
      body: params,
      ignoreAuthFailure: true,
      parse: function (res) {
        if (res.body.status == 1 && res.body.data) {
          this.done(res.body.data);
        } else {
          this.fail({errorMessage: res.body.message});
        }
      }
    });
  },
}
