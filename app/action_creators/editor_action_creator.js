import Types from "app/action_types";

import {
  filterList as filterListCall,
  getOfflineData as getOfflineDataCall,
  storageSearch as storageSearchCall,
  
  groupAddToTopic        as groupAddToTopicCall,        // 加入专题
  groupViewEditHistory   as groupViewEditHistoryCall,   // 查看编审记录
  groupViewPostilHistory as groupViewPostilHistoryCall, // 查看批注记录
  groupOnline            as groupOnlineCall,            // 上线
  groupOffline           as groupOfflineCall,           // 下线
  groupAddToOverseas     as groupAddToOverseasCall,     // 添加到海外
  groupAddToNoEditor     as groupAddToNoEditorCall,     // 添加到待编审
  groupAddToTheEditor    as groupAddToTheEditorCall,    // 添加到未编审
  
  groupCopyOrMerge as groupCopyOrMergeCall,             // 复制或合并并新建组
  photosNewOrAdd as photosNewOrAddCall,                 // 单张：新建、加入组
  photosSplitOrAdd as photosSplitOrAddCall,             // 单张：拆分、加入组
  copyOrMerge2Attach as copyOrMerge2AttachCall,         // 组照：复制、拆分
  group as groupCall,         // 组操作
  
  isEdit as isEditCall,
  
  downloadCountQuery as downloadCountQueryCall,
  pushQuery  as pushQueryCall,
  pushView   as pushViewCall,
  pushDelete as pushDeleteCall,
  pushDetail as pushDetailCall,
  groupCreate as groupCreateCall,
  queryAccont as queryAccontCall,
  refreshImage as refreshImageCall,
  oss176View as oss176ViewCall,
  queryUserAccount as queryUserAccountCall,
  queryTopic as queryTopicCall,
  removeTopic as removeTopicCall
} from "app/api/api_calls";

export function group(params, operate) {
  return {
    type: Types.group,
    callAPI: () => groupCall(params, operate)
  }
}

export function copyOrMerge2Attach(params) {
  return {
    type: Types.copyOrMerge2Attach,
    callAPI: () => copyOrMerge2AttachCall(params)
  }
}

export function removeTopic(params) {
  return {
    type: Types.removeTopic,
    callAPI: () => removeTopicCall(params)
  }
}

export function queryTopic(params) {
  return {
    type: Types.queryTopic,
    callAPI: () => queryTopicCall(params)
  }
}

export function queryUserAccount(params) {
  return {
    type: Types.queryUserAccount,
    callAPI: () => queryUserAccountCall(params)
  }
}

export function refreshImage(params) {
  return {
    type: Types.refreshImage,
    callAPI: () => refreshImageCall(params)
  }
}

export function oss176View(params) {
  return {
    type: Types.oss176View,
    callAPI: () => oss176ViewCall(params)
  }
}

export function queryAccont(params) {
  return {
    type: Types.queryAccont,
    callAPI: () => queryAccontCall(params)
  }
}

// 全部资源筛选
export function getStorageFilter(params) {
  return {
    type: Types.EDIT_STORAGE_FILTER,
    callAPI: () => filterListCall(params)
  }
}

// 已上线筛选
export function getPublishFilter(params) {
  return {
    type: Types.EDIT_PUBLISH_FILTER,
    callAPI: () => filterListCall(params)
  }
}

// 待编审筛选
export function getToeditFilter(params) {
  return {
    type: Types.EDIT_TOEDIT_FILTER,
    callAPI: () => filterListCall(params)
  }
}

// 已下线筛选
export function getOfflineFilter(params) {
  return {
    type: Types.EDIT_OFFLINE_FILTER,
    callAPI: () => filterListCall(params)
  }
}

// 全部资源结果集
export function getStorageData(params) {
  return {
    type: Types.EDIT_STORAGE_DATA,
    callAPI: () => storageSearchCall(params)
  }
}

// 待编审结果集
export function getToeditData(params) {
  return {
    type: Types.EDIT_TOEDIT_DATA,
    callAPI: () => storageSearchCall(params)
  }
}

// 下线结果集
export function getOfflineData(params) {
  return {
    type: Types.EDIT_OFFLINE_DATA,
    callAPI: () => getOfflineDataCall(params)
  }
}

// 添加到专题
export function groupAddToTopic(params) {
  return {
    type: Types.groupAddToTopic,
    callAPI: () => groupAddToTopicCall(params)
  }
}

// 查看编审记录
export function groupViewEditHistory(params, method) {
  return {
    type: Types.groupViewEditHistory,
    callAPI: () => groupViewEditHistoryCall(params, method)
  }
}

// 查看批注记录
export function groupViewPostilHistory(params) {
  return {
    type: Types.groupViewPostilHistory,
    callAPI: () => groupViewPostilHistoryCall(params)
  }
}

// 上线
export function groupOnline(params) {
  return {
    type: Types.groupOnline,
    callAPI: () => groupOnlineCall(params)
  }
}

// 下线
export function groupOffline(params) {
  return {
    type: Types.groupOffline,
    callAPI: () => groupOfflineCall(params)
  }
}

// 添加到海外
export function groupAddToOverseas(params) {
  return {
    type: Types.groupAddToOverseas,
    callAPI: () => groupAddToOverseasCall(params)
  }
}

// 添加到未编审
export function groupAddToTheEditor(params) {
  return {
    type: Types.groupAddToTheEditor,
    callAPI: () => groupAddToTheEditorCall(params)
  }
}

// 添加到待编审
export function groupAddToNoEditor(params) {
  return {
    type: Types.groupAddToNoEditor,
    callAPI: () => groupAddToNoEditorCall(params)
  }
}

// 判断编审状态
export function isEdit(params) {
  return {
    type: Types.EDIT_GET_ISEDIT,
    callAPI: () => isEditCall(params)
  }
}

// 网站下载记录统计
export function downloadCountQuery(params) {
  return {
    type: Types.downloadCountQuery,
    callAPI: () => downloadCountQueryCall(params)
  }
}

// 组照推送记录
export function pushQuery(params) {
  return {
    type: Types.pushQuery,
    callAPI: () => pushQueryCall(params)
  }
}

// 组照推送记录 查看
export function pushView(params) {
  return {
    type: Types.pushView,
    callAPI: () => pushViewCall(params)
  }
}


//  组照推送记录 详情
export function pushDetail(params) {
  return {
    type: Types.pushDetail,
    callAPI: () => pushDetailCall(params)
  }
}

// 组照推送记录 删除
export function pushDelete(params) {
  return {
    type: Types.pushDelete,
    callAPI: () => pushDeleteCall(params)
  }
}

// 组照：复制、合并并新建组
export function groupCopyOrMerge(params) {
  return {
    type: Types.groupCopyOrMerge,
    callAPI: () => groupCopyOrMergeCall(params)
  }
}

// 单张：新建、加入组
export function photosNewOrAdd(params) {
  return {
    type: Types.photosNewOrAdd,
    callAPI: () => photosNewOrAddCall(params)
  }
}

// 单张：拆分、加入组
export function photosSplitOrAdd(params) {
  return {
    type: Types.photosSplitOrAdd,
    callAPI: () => photosSplitOrAddCall(params)
  }
}

// 单张：拆分、加入组
export function groupCreate(params) {
  return {
    type: Types.groupCreate,
    callAPI: () => groupCreateCall(params)
  }
}
