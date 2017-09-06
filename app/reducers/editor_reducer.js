import Types         from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "data": {},
  "pushtoData": {},
  "special": {},
  "specialList": {},
  "groupList": {},
  "favoriteList": {},
  "keywords": null,
  "queryTopicData": null,
  "peopleTagData": null
});


export default function editorReducer(state = initialState, action) {
  
  // EDIT_STORAGE_DATA
  if (matchesAction(action, Types.EDIT_STORAGE_DATA.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_STORAGE_DATA.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "dataList", action.apiResponse);
  }
  
  if (matchesAction(action, Types.EDIT_STORAGE_DATA.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // downloadCountQuery
  if (matchesAction(action, Types.downloadCountQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.downloadCountQuery.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "queryData", action.apiResponse);
  }
  if (matchesAction(action, Types.downloadCountQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // pushQuery
  if (matchesAction(action, Types.pushQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.pushQuery.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "queryData", action.apiResponse);
  }
  if (matchesAction(action, Types.pushQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // pushView
  if (matchesAction(action, Types.pushView.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.pushView.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "queryData", action.apiResponse);
  }
  if (matchesAction(action, Types.pushView.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // pushDelete
  if (matchesAction(action, Types.pushDelete.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.pushDelete.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "queryData", action.apiResponse);
  }
  if (matchesAction(action, Types.pushDelete.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // groupCopyOrMerge 复制或合并并新建组
  if (matchesAction(action, Types.groupCopyOrMerge.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.groupCopyOrMerge.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "dataList", action.apiResponse);
  }
  if (matchesAction(action, Types.groupCopyOrMerge.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // photosNewOrAdd 单张：新建、加入组
  if (matchesAction(action, Types.photosNewOrAdd.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.photosNewOrAdd.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "dataList", action.apiResponse);
  }
  if (matchesAction(action, Types.photosNewOrAdd.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}
