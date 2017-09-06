import Types from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih from "./utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "regionData": null,
  "queryData": null
});

export default function commonReducer(state = initialState, action) {
  
  // categoryQuery
  if (matchesAction(action, Types.categoryQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.categoryQuery.done)) {
    state = ih.set(state, "doing", false);
    // role 1 销售 2 财务 3 运营
    state = ih.set(state, "queryData", action.apiResponse);
  }
  if (matchesAction(action, Types.categoryQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // regionQuery
  if (matchesAction(action, Types.regionQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.regionQuery.done)) {
    state = ih.set(state, "doing", false);
    // role 1 销售 2 财务 3 运营
    state = ih.set(state, "regionData", action.apiResponse);
  }
  if (matchesAction(action, Types.regionQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}