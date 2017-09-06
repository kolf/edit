import Types from "app/action_types";

import {
  filterList as filterListCall,
  createSearch as createSearchCall,
  postCreativeState as postCreativeStateCall,
  setImagePublish as setImagePublishCall,
  setImageLicenseType as setImageLicenseTypeCall,
  setImageOfflineTag as setImageOfflineTagCall,
  setImageQualityLevel as setImageQualityLevelCall,
  viewImageExif as viewImageExifCall,
  viewImageDetail as viewImageDetailCall,
  keywordSave as keywordSaveCall,
  keywordPublish as keywordPublishCall,
  authFileSearch as authFileSearchCall,
  authFileRelatedPicSearch as authFileRelatedPicSearchCall,
  authFilePass as authFilePassCall,
  queryProvider as queryProviderCall,
  setCollectionId as setCollectionIdCall,
  listByResId as listByResIdCall
} from "app/api/api_calls";

// 创意类编审记录
export function listByResId(params) {
  return {
    type: Types.listByResId,
    callAPI: () => listByResIdCall(params)
  }
}

//
export function setCollectionId(params) {
  return {
    type: Types.setCollectionId,
    callAPI: () => setCollectionIdCall(params)
  }
}

//创意/待编审/筛选列表
export function queryProvider(params) {
  return {
    type: Types.QUERY_PROVIDER,
    callAPI: () => queryProviderCall(params)
  }
}

//创意/待编审/筛选列表
export function getToeditFilter(params) {
  return {
    type: Types.CREATE_TOEDIT_FILTER,
    callAPI: () => filterListCall(params)
  }
}

//创意/已上线/筛选列表
export function getPublishFilter(params) {
  return {
    type: Types.CREATE_PUBLISH_FILTER,
    callAPI: () => filterListCall(params)
  }
}

//创意/已下线/筛选列表
export function getOfflineFilter(params) {
  return {
    type: Types.CREATE_OFFLINE_FILTER,
    callAPI: () => filterListCall(params)
  }
}

//创意/不通过/筛选列表
export function getNopassFilter(params) {
  return {
    type: Types.CREATE_NOPASS_FILTER,
    callAPI: () => filterListCall(params)
  }
}

//创意/待编审/结果集
export function createSearch(params) {
  return {
    type: Types.CREATE_TOEDIT_LIST,
    callAPI: () => createSearchCall(params)
  }
}

// 发布/撤图/不通过
export function postCreativeState(params) {
  return {
    type: Types.CREATE_POST_STATE,
    callAPI: () => postCreativeStateCall(params)
  }
}

// 创意/待编审/设置图片通过、不通过
export function setImagePublish(params) {
  return {
    type: Types.setImagePublish,
    callAPI: () => setImagePublishCall(params)
  }
}

// 创意/待编审/设置图片授权信息
export function setImageLicenseType(params) {
  return {
    type: Types.setImageLicenseType,
    callAPI: () => setImageLicenseTypeCall(params)
  }
}

// 创意/待编审/设置图片等级
export function setImageQualityLevel(params, edit) {
  return {
    type: Types.setImageQualityLevel,
    callAPI: () => setImageQualityLevelCall(params, edit)
  }
}

// 创意/已上线/标记图片下线、确定下线、撤销下线
export function setImageOfflineTag(params) {
  return {
    type: Types.setImageOfflineTag,
    callAPI: () => setImageOfflineTagCall(params)
  }
}

// 创意/查看图片exif信息
export function viewImageExif(params) {
  return {
    type: Types.viewImageExif,
    callAPI: () => viewImageExifCall(params)
  }
}

// 创意/查看图片detail信息
export function viewImageDetail(params) {
  return {
    type: Types.viewImageDetail,
    callAPI: () => viewImageDetailCall(params)
  }
}

// 创意关键词保存
export function keywordSave(params) {
  return {
    type: Types.keywordSave,
    callAPI: () => keywordSaveCall(params)
  }
}

// 创意关键词审核发布
export function keywordPublish(params) {
  return {
    type: Types.keywordPublish,
    callAPI: () => keywordPublishCall(params)
  }
}

//肖像权/物权文件列表
export function authFileSearch(params) {
  return {
    type: Types.CREATE_AUTHFILE_LIST,
    callAPI: () => authFileSearchCall(params)
  }
}

//肖像权/物权文件关联图片清单
export function authFileRelatedPicSearch(params) {
  return {
    type: Types.CREATE_AUTHFILE_RELATED,
    callAPI: () => authFileRelatedPicSearchCall(params)
  }
}

//肖像权/物权文件确认
export function authFilePass(params) {
  return {
    type: Types.CREATE_AUTHFILE_PASS,
    callAPI: () => authFilePassCall(params)
  }
}
