import Types from "app/action_types";

import {
  tagQuery      as tagQueryCall,           // query
  tagSave       as tagSaveCall,            // create edit
  tagView       as tagViewCall,            // view
  tagViewAll    as tagViewAllCall,            // view
  tagExpand     as tagExpandCall,          // expand pid
  tagDelete     as tagDeleteCall          // delete
} from "app/api/api_calls";

export function tagQuery(params) {
  return {
    type: Types.tagQuery,
    callAPI: () => tagQueryCall(params)
  };
}

export function tagSave(params) {
  return {
    type: Types.tagSave,
    callAPI: () => tagSaveCall(params)
  };
}

export function tagView(params) {
  return {
    type: Types.tagView,
    callAPI: () => tagViewCall(params)
  };
}

export function tagViewAll(params) {
  return {
    type: Types.tagView,
    callAPI: () => tagViewAllCall(params)
  };
}

export function tagExpand(params) {
  return {
    type: Types.tagExpand,
    callAPI: () => tagExpandCall(params)
  };
}

export function tagDelete(params) {
  return {
    type: Types.tagDelete,
    callAPI: () => tagDeleteCall(params)
  };
}