import Types from "app/action_types";

import {
  removeEditPic as removeEditPicCall,
  viewEditPic as viewEditPicCall,
  getEditData as getEditDataCall,
  sortGroupImage as sortGroupImageCall,
  setCreditLine as setCreditLineCall,
  setTimeliness as setTimelinessCall,
  allNoPass as allNoPassCall,
  topicQuery as topicQueryCall,
  topicDelete as topicDeleteCall,
  editJoinToSpecial as editJoinToSpecialCall,
  editJoinToSpecialList as editJoinToSpecialListCall,
  editJoinToGroupList as editJoinToGroupListCall,
  editSavePostData as editSavePostDataCall,
  editPostData as editPostDataCall,
  getKeywordById as getKeywordByIdCall,
  findKeyword as findKeywordCall,
  addKeyword as addKeywordCall,
  modifyKeyword as modifyKeywordCall,
  findlocaltion as findlocaltionCall,
  publishPushto as publishPushtoCall,
  pushtoData as pushtoDataCall,
  findDiscTag as findDiscTagCall,
  queryReason as queryReasonCall,
  getAllCategory as getAllCategoryCall,
} from "app/api/api_calls";

// 查询所有分类
export function getAllCategory(params) {
  return {
    type: Types.getAllCategory,
    callAPI: () => getAllCategoryCall(params)
  }
}

// 移除单张
export function removeEditPic(params) {
  return {
    type: Types.removeEditPic,
    callAPI: () => removeEditPicCall(params)
  }
}

// 查看原图、中图
export function viewEditPic(params) {
  return {
    type: Types.viewEditPic,
    callAPI: () => viewEditPicCall(params)
  }
}

//编审/获取组照数据
export function getEditData(params) {
  return {
    type: Types.EDIT_DATA,
    callAPI: () => getEditDataCall(params)
  }
}

//编审/对编辑图片进行排序
export function sortGroupImage(params) {
  return {
    type: Types.sortGroupImage,
    callAPI: () => sortGroupImageCall(params)
  }
}

//编审/获取组照数据
export function setCreditLine(params) {
  return {
    type: Types.setCreditLine,
    callAPI: () => setCreditLineCall(params)
  }
}

//编审/获取组照数据
export function setTimeliness(params) {
  return {
    type: Types.setTimeliness,
    callAPI: () => setTimelinessCall(params)
  }
}

//编审/组照groupId 查询专题列表
export function topicQuery(params) {
  return {
    type: Types.topicQuery,
    callAPI: () => topicQueryCall(params)
  }
}

//编审/组照groupId 删除专题
export function topicDelete(params) {
  return {
    type: Types.topicDelete,
    callAPI: () => topicDeleteCall(params)
  }
}

//编审/获取获取加入专题推荐
export function editJoinToSpecial(params) {
  return {
    type: Types.EDIT_JOINTOSPECIAL,
    callAPI: () => editJoinToSpecialCall(params)
  }
}

//编审/获取加入专题下拉
export function editJoinToSpecialList(params) {
  return {
    type: Types.EDIT_JOINTOSPECIAL_LIST,
    callAPI: () => editJoinToSpecialListCall(params)
  }
}

//编审/发布
export function editPostData(params) {
  return {
    type: Types.EDIT_POSTDATA,
    callAPI: () => editPostDataCall(params)
  }
}

//编审/保存
export function editSavePostData(params) {
  return {
    type: Types.EDIT_SAVEDATA,
    callAPI: () => editSavePostDataCall(params)
  }
}

//编审/全部不通过
export function allNoPass(params) {
  return {
    type: Types.POST_ALLNOPASS,
    callAPI: () => allNoPassCall(params)
  }
}

//根据id返回关键词
export function getKeywordById(params, type) {
  return {
    type: Types.GET_KEYWORDBYID,
    callAPI: () => getKeywordByIdCall(params, type)
  }
}

// 查看数据库关键词
export function findKeyword(params) {
  return {
    type: Types.FIND_KEYWORDID,
    callAPI: () => findKeywordCall(params)
  }
}

// 新增关键词
export function addKeyword(params) {
  return {
    type: Types.ADD_KEYWORDID,
    callAPI: () => addKeywordCall(params)
  }
}

//查询地点关键词
export function findlocaltion(params) {
  return {
    type: Types.FIND_LOCALTION,
    callAPI: () => findlocaltionCall(params)
  }
}

// 修改关键词
export function modifyKeyword(params) {
  return {
    type: Types.MODIFY_KEYWORDID,
    callAPI: () => modifyKeywordCall(params)
  }
}

//推送
export function pushtoData(params) {
  return {
    type: Types.GET_PUSHTODATA,
    callAPI: () => pushtoDataCall(params)
  }
}

//发布推送
export function publishPushto(params, publishType) {
  return {
    type: Types.POST_PUSHTODATA,
    callAPI: () => publishPushtoCall(params, publishType)
  }
}

//抓取人物关健词
export function findDiscTag(params) {
  return {
    type: Types.FIND_DISC_TAG,
    callAPI: () => findDiscTagCall(params)
  }
}

export function queryReason(params) {
  return {
    type: Types.QUERY_REASON,
    callAPI: () => queryReasonCall(params)
  }
}
