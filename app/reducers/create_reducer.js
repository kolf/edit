import Types         from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "data": {},
  "authFiles": [],
  "authFileRelatedPics": []
});

export default function createReducer(state = initialState, action) {
  
  // CREATE_TOEDIT_LIST
  if (matchesAction(action, Types.CREATE_TOEDIT_LIST.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CREATE_TOEDIT_LIST.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", action.apiResponse);
  }
  if (matchesAction(action, Types.CREATE_TOEDIT_LIST.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CREATE_POST_STATE
  if (matchesAction(action, Types.CREATE_POST_STATE.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CREATE_POST_STATE.done)) {
    state = ih.set(state, "doing", false);
  }
  if (matchesAction(action, Types.CREATE_POST_STATE.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  //CREATE_AUTHFILE_LIST 肖像权/物权文件清单
  if (matchesAction(action, Types.CREATE_AUTHFILE_LIST.done)) {
    state = ih.set(state, "authFiles", action.apiResponse.data);
  }
  if (matchesAction(action, Types.CREATE_AUTHFILE_RELATED.done)) {
    state = ih.set(state, "authFileRelatedPics", action.apiResponse.data);
  }
  
  return state;
}