import Types from "app/action_types";

import {
  Postil as PostilCall,
  getPostilData as getPostilDataCall,
  providerView as providerViewCall,
  searchProvider as searchProviderCall,
} from "app/api/api_calls";

//批注
export function Postil(params) {
  return {
    type: Types.POST_POSTIL,
    callAPI: () => PostilCall(params)
  }
}

//编审记录
export function getPostilData(params) {
  return {
    type: Types.GET_POSTILDATA,
    callAPI: () => getPostilDataCall(params)
  }
}

// 搜索供应商
export function searchProvider(params) {
  return {
    type: Types.searchProvider,
    callAPI: () => searchProviderCall(params)
  }
}

// 供应商详情 providerId
export function providerView(params) {
  return {
    type: Types.providerView,
    callAPI: () => providerViewCall(params)
  }
}
