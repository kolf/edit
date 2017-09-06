import Types         from "app/action_types";
import matchesAction from "app/reducers/utils/matches_action";
import * as ih       from "app/reducers/utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "dataList": null
});

export default function groupReducer(state = initialState, action) {
  
  // groupQuery
  if (matchesAction(action, Types.groupQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.groupQuery.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "user", action.apiResponse);
  }
  if (matchesAction(action, Types.groupQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}
