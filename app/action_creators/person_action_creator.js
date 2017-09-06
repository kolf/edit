import Types from "app/action_types";

import {
  // my favorite
  favoriteQuery      as favoriteQueryCall,      // favorite query
  favoriteDelete     as favoriteDeleteCall,     // favorite delete
  favoriteSave       as favoriteSaveCall,       // favorite create save
  favoriteItemQuery  as favoriteItemQueryCall,  // favorite item query
  favoriteItemDelete as favoriteItemDeleteCall, // favorite item delete
  favoriteItemAdd as favoriteItemAddCall, // favorite item delete
  
  getDraftData as getDraftDataCall,
  postRelieveDraft as postRelieveDraftCall,
  getMyNewsList as getMyNewsListCall,
  postDeleteMyNews as postDeleteMyNewsCall,
  postToMyNews as postToMyNewsCall,
  getpersonalData as getpersonalDataCall,
} from "app/api/api_calls";

//获取草稿箱数据
export function getDraftData(params) {
  return {
    type: Types.GET_DRAFTDATA,
    callAPI: () => getDraftDataCall(params)
  }
}

// 草稿箱解除绑定
export function postRelieveDraft(params) {
  return {
    type: Types.POST_RELIEVEDRAFT,
    callAPI: () => postRelieveDraftCall(params)
  }
}

//我的消息列表
export function getMyNewsList(params) {
  return {
    type: Types.GET_MYNEWSLIST,
    callAPI: () => getMyNewsListCall(params)
  }
}

//删除我的消息
export function postDeleteMyNews(params) {
  return {
    type: Types.POST_DELETEMYNEWS,
    callAPI: () => postDeleteMyNewsCall(params)
  }
}

//发送我的消息
export function postToMyNews(params) {
  return {
    type: Types.POST_TOMYNEWS,
    callAPI: () => postToMyNewsCall(params)
  }
}

//获取个人中心数据
export function getpersonalData(params) {
  return {
    type: Types.GET_PERSONALDATA,
    callAPI: () => getpersonalDataCall(params)
  }
}
// my favorite begin
// favorite query
export function favoriteQuery(params) {
  return {
    type: Types.favoriteQuery,
    callAPI: () => favoriteQueryCall(params)
  }
}
// favorite delete
export function favoriteDelete(params) {
  return {
    type: Types.favoriteDelete,
    callAPI: () => favoriteDeleteCall(params)
  }
}
// favorite create save
export function favoriteSave(params) {
  return {
    type: Types.favoriteSave,
    callAPI: () => favoriteSaveCall(params)
  }
}
// favorite view
export function favoriteItemQuery(params) {
  return {
    type: Types.favoriteItemQuery,
    callAPI: () => favoriteItemQueryCall(params)
  }
}
// favorite item delete
export function favoriteItemDelete(params) {
  return {
    type: Types.favoriteItemDelete,
    callAPI: () => favoriteItemDeleteCall(params)
  }
}
// favorite item delete
export function favoriteItemAdd(params) {
  return {
    type: Types.favoriteItemAdd,
    callAPI: () => favoriteItemAddCall(params)
  }
}
// my favorite end
