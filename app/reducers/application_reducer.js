import Types  from "app/action_types/application";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

const initialState = ih.immutable({
  layoutsing: false,
  layoutsError: null,
  layouts: null
});

export default function applicationReducer(state = initialState, action) {
  
  if (matchesAction(action, Types.LAYOUTS.request)) {
    state = ih.set(state, "layoutsing", true);
  }
  
  if (matchesAction(action, Types.LAYOUTS.done)) {
    const layouts = action.apiResponse.layouts;
    
    state = ih.set(state, "layoutsing", false);
    state = ih.set(state, "layouts", action.apiResponse.layouts);
  }
  
  if (matchesAction(action, Types.LAYOUTS.fail)) {
    state = ih.set(state, "layoutsError", action.apiError);
    state = ih.set(state, "layoutsing", false);
  }
  
  return state;
}