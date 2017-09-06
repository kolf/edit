import Types from "app/action_types";

import {
  categoryQuery as categoryQueryCall,
  regionQuery   as regionQueryCall,
  productQuery  as productQueryCall,
  dataCache     as dataCacheCall,
  cachedData    as cachedDataCall
} from "app/api/api_calls";

export function categoryQuery(params, projectName) {
  return {
    type: Types.categoryQuery,
    callAPI: () => categoryQueryCall(params, projectName)
  }
}

export function regionQuery(params) {
  return {
    type: Types.regionQuery,
    callAPI: () => regionQueryCall(params)
  }
}

export function productQuery(params) {
  return {
    type: Types.productQuery,
    callAPI: () => productQueryCall(params)
  }
}
//缓存临时数据到服务端
export function dataCache(params) {
  return {
    type: Types.dataCache,
    callAPI: () => dataCacheCall(params)
  }
}
//获取服务端的临时数据
export function cachedData(params) {
  return {
    type: Types.cachedData,
    callAPI: () => cachedDataCall(params)
  }
}
