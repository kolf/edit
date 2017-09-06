import Types from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih from "./utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "dataFilter": null,
  "queryData": null,
  "saveData": null,
  "viewData": null,
  "expandData": null,
  "deleteData": null
});

export default function tagReducer(state = initialState, action) {
  
  // tagQuery
  if (matchesAction(action, Types.tagQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.tagQuery.done)) {
    state = ih.set(state, "doing", false);
    // role 1 销售 2 财务 3 运营
    state = ih.set(state, "queryData", action.apiResponse);
  }
  if (matchesAction(action, Types.tagQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // tagSave
  if (matchesAction(action, Types.tagSave.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.tagSave.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "saveData", action.apiResponse);
  }
  if (matchesAction(action, Types.tagSave.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // tagView
  if (matchesAction(action, Types.tagView.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.tagView.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "viewData", action.apiResponse);
  }
  if (matchesAction(action, Types.tagView.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // tagExpand
  if (matchesAction(action, Types.tagExpand.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.tagExpand.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "expandData", action.apiResponse);
  }
  if (matchesAction(action, Types.tagExpand.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // tagDelete
  if (matchesAction(action, Types.tagDelete.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.tagDelete.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "deleteData", action.apiResponse);
  }
  if (matchesAction(action, Types.tagDelete.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}