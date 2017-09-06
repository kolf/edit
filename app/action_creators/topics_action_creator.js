import Types from "app/action_types/topics_action_types";

import {
  topicsFilter as topicsFilterCall,
  topicsSearch as topicsSearchCall,
  topicsMerge  as topicsMergeCall,
  topicsUpdate as topicsUpdateCall,
  topicsCreate as topicsCreateCall,
  topicsDelete as topicsDeleteCall,
  topicsView   as topicsViewCall,
  topicsAuto   as topicsAutoCall
} from "app/api/api_calls";

export function topicsFilter(params) {
  return {
    type: Types.TOPICSFILTER,
    callAPI: () => topicsFilterCall(params)
  }
}

export function topicsSearch(params) {
  return {
    type: Types.TOPICSSEARCH,
    callAPI: () => topicsSearchCall(params)
  }
}

export function topicsMerge(params) {
  return {
    type: Types.TOPICSMERGE,
    callAPI: () => topicsMergeCall(params)
  }
}

export function topicsUpdate(params) {
  return {
    type: Types.TOPICSUPDATE,
    callAPI: () => topicsUpdateCall(params)
  }
}

export function topicsCreate(params) {
  return {
    type: Types.TOPICSCREATE,
    callAPI: () => topicsCreateCall(params)
  }
}

export function topicsDelete(params) {
  return {
    type: Types.TOPICSDELETE,
    callAPI: () => topicsDeleteCall(params)
  }
}

export function topicsView(params) {
  return {
    type: Types.TOPICSVIEW,
    callAPI: () => topicsViewCall(params)
  }
}

export function topicsAuto(params) {
  return {
    type: Types.TOPICSAUTO,
    callAPI: () => topicsAutoCall(params)
  }
}
