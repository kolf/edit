import Types from "app/action_types/search";

import {
  searchRsList as searchRsListCall,
  rssCreate as rssCreateCall,
  rssQuery as rssQueryCall,
  rssUpdate as rssUpdateCall,
  rssRemove as rssRemoveCall,
} from "app/api/api_calls";

export function searchRsList(params) {
  return {
    type: Types.SEARCHRELIST,
    callAPI: () => searchRsListCall(params)
  }
}
export function rssCreate(params) {
  return {
    type: Types.RSS_CREATE,
    callAPI: () => rssCreateCall(params)
  }
}
export function rssQuery(params) {
  return {
    type: Types.RSS_QUERY,
    callAPI: () => rssQueryCall(params)
  }
}
export function rssUpdate(params) {
  return {
    type: Types.RSS_UPDATE,
    callAPI: () => rssUpdateCall(params)
  }
}
export function rssRemove(params) {
  return {
    type: Types.RSS_REMOVE,
    callAPI: () => rssRemoveCall(params)
  }
}
