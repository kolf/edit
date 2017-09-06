import Request from "superagent";
import jsonp from "superagent-jsonp";
import {message} from 'antd';
import {CustomPromise} from "app/utils/custom_promise";
import {getStorage, clearStorage} from "./auth_token";

// import message from "antd/lib/message";

var TIMEOUT = 5 * 60 * 1000;

function makeUrl(url) {
  if (_.isArray(url)) {
    url = "/" + url.join("/");
  }
  url = "/api" + url;
  return url;
}

function removeValue(arr, v) {
  _.remove(arr, (item) => item === v);
}

function forceLogout() {
  clearStorage();
  window.location = "/login";
}

var _pendingRequests = [];

// Abor the requests for the Api Call with the specified name.
// Be careful since won"t make any difference if the same api call gets
// called with diffrent query strings or body, this feature stops any
// pending call for the specified Api Call
function abortPendingRequestsForApiCall(apiCallName) {
  var pendingRequest = _.find(_pendingRequests, (pending) => {
    return pending._apiCallName === apiCallName;
  });

  if (pendingRequest) {
    pendingRequest._callback = () => {
    };
    pendingRequest.abort();
    removeValue(_pendingRequests, pendingRequest);
  }
}

function toKenOverdue() {
  const loginTime = window.localStorage.loginTime;
  const currentTime = Date.now();
  const outTime = currentTime - loginTime;
  const currentS = outTime / 1000;//秒
  //60*60*11.5//十一个半小时
  const tt = 60 * 60 * 11.5;
  if (currentS > tt) {
    message.error('认证失效！请重新登录。');
    window.localStorage.clear();
    window.location = "/login";
  }
}

function digestResponse(resolve, reject, error, request, response, options) {
  //判断token是否过期,如果过期则返回登录页面
  toKenOverdue();

  var result = {};

  if (options.type && options.type === 'jsonp') {
    next()
  }
  // Autofail with standard api error on timeout. Origin is not allowed by Access-Control-Allow-Origin
  if (error) {
    // if(error.timeout >= 0) {
    //   result.apiError = {errorMessage: "数据请求超时, 请重试！"};
    // }else{
    //   result.apiError = {errorMessage: "服务暂不可用, 请稍后重试！"};
    // }
    result.apiError = {errorMessage: response.text};

    reject(result);
    // Auto-fail with special auth error on 401.
  } else if (response.status === 401 && !options.ignoreAuthFailure) {
    result.apiError = {errorMessage: "服务暂不可用, 请稍后重试！"};
    reject(result);

    // Auto-fail with special api down error on 502 - 504.
    // IE can do weird things with 5xx errors like call them 12031s.
  } else if ((response.status >= 502 && response.status <= 504) || response.status > 12000) {
    result.apiError = {errorMessage: "服务正在启动, 请稍后重试！"};
    reject(result);

  } else if (response.status === 429) {
    result.apiError = "RATE_LIMIT_ERROR";
    reject(result);
  } else if (response.status == 200 && JSON.parse(response.text).status == 300) {
    // token 为空，请重新登录！
    //result.apiError = {errorMessage: "登录超时，请重新登录！"};
    //reject(result);
    //forceLogout();
  } else if (response.status == 200 && JSON.parse(response.text).status == 400) {
    const res = JSON.parse(response.text) || {};
    const errorMsg = res.msg || res.message;
    if (errorMsg) {
      //   message.error(res.msg);
      result.apiError = {errorMessage: errorMsg};
      reject(result);
    }
  } else if (response.status == 200 && JSON.parse(response.text).status == 500) {
    // 登录超时，请重新登录！
    result.apiError = {errorMessage: JSON.parse(response.text).message};
    reject(result);
  } else {
    next()
  }

  function next() {
    if (response) {
      response.body = response.body || {}; // patch response.body if nonexistant
    }

    let gotExpectedResponse;
    let parser = options.parse || defaultParser;

    let done = function (data) {
      gotExpectedResponse = true;
      result.apiResponse = data || {};
      resolve(result);
    };

    let fail = function (err) {
      gotExpectedResponse = true;
      result.apiError = err;
      reject(result);
    };

    let pass = function () {
      // do nothing.  don"t resolve or reject the promise.
      gotExpectedResponse = true;
    };

    parser.call({done, fail, pass}, response);

    // Our parser did not get a response it understands
    if (!gotExpectedResponse) {
      result.apiError = "UNKOWN ERROR";
      reject(result);
    }
  }
}

function defaultParser(res) {
  if (isSuccessStatus(res.status)) {
    return this.done(res.body);
  }
}

function isSuccessStatus(status) {
  return status >= 200 && status <= 299;
}

function executeRequestFlow(options) {
  return new CustomPromise(function (resolve, reject) {

    options.method = options.method || "GET";

    let projectType = location.pathname.substring(1).split('/')[0];

    projectType = _.indexOf(['zh', 'en'], projectType) >= 0 ? projectType : 'zh';

    projectType = options.projectName || projectType;

    let url = /http/.test(options.absolutePath) ? options.absolutePath : '/api/' + projectType + (options.absolutePath || makeUrl(options.path)); //

    //此处token代码仅演示版本使用，后续请删除
    const token = getStorage('token');
    if (token && url.toLowerCase().indexOf('token') == -1) {
      if (url.indexOf('?') != -1) {
        url += '&token=' + token;
      } else {
        url += '?token=' + token;
      }

      // url += '&pass=yes';
    }
    //此处token代码仅演示版本使用，后续请删除

    var request = Request(options.method, url);

    var query = {};

    if (_(["GET", "POST", "PUT"]).contains(options.method)) {
      request.accept("json");
      if (options.ContentType) {
        request.type(options.ContentType);
      } else {
        request.type("json");
      }
    }

    if (_(["POST", "PUT"]).contains(options.method)) {
      options.body = options.body || {};
    }

    // If you need to set a cookie do as follow:
    // request.set("Cookie", sessionCookie);


    if (options.body) {
      request.send(options.body);
      Object.keys(options.body).forEach(function (key) {
        if (options.body[key] === undefined) {
        }
      });
    }

    if (options.query) {
      _.extend(query, options.query);
    }

    if (Object.keys(query).length) {
      request.query(query);
    }

    if (options.type === 'jsonp') {
      request.use(jsonp)
    }

    request.timeout(TIMEOUT);

    // Prevent concurrent calls for the same Api Call type.
    if (options.cancelPendingRequests) {

      if (request._apiCallName)
        if (!options.apiCallName) 
          request._apiCallName = options.apiCallName;

      abortPendingRequestsForApiCall(options.apiCallName);
    }

    // Request Callback logic
    request.end(function (error, response) {
      digestResponse(resolve, reject, error, request, response, options);
      removeValue(_pendingRequests, request);
    });

    _pendingRequests.push(request);
  });
}

// API Interface
var Api = {
  execute: executeRequestFlow,

  get: function (options) {
    options.method = "GET";
    return executeRequestFlow(options);
  },

  put: function (options) {
    options.method = "PUT";
    return executeRequestFlow(options);
  },

  post: function (options) {
    options.method = "POST";
    return executeRequestFlow(options);
  },

  // jsonp: function (options) {
  //    return new CustomPromise((resolve, reject) => {
  //       Request.get()
  //    });
  // },

  delete: function (options) {
    options.method = "DELETE";
    return executeRequestFlow(options);
  },

  head: function (options) {
    options.method = "HEAD";
    return executeRequestFlow(options);
  },

  isSuccessStatus: function (status) {
    return isSuccessStatus(status);
  },

  stringify: function (params) {
    let stringify = [], key;
    for (key in params) {
      stringify.push(key + "=" + params[key]);
    }
    return stringify.join('&');
  }

};

module.exports = Api;
