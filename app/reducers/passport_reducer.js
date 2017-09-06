import Types         from "app/action_types";
import {setStorage}  from "app/api/auth_token";
import matchesAction from "app/reducers/utils/matches_action";
import * as ih       from "app/reducers/utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "token": '',
  "user": null
});


export default function passportReducer(state = initialState, action) {
  
  // loadAuth
  if (matchesAction(action, Types.loadAuth.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.loadAuth.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "user", action.apiResponse);
  }
  if (matchesAction(action, Types.loadAuth.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // signIn
  if (matchesAction(action, Types.signIn.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.signIn.done)) {
    state = ih.set(state, "doing", false);
    const token = action.apiResponse.TGT;
    setStorage({"key": "token", "value": token});
    state = ih.set(state, "token", token);
  }
  if (matchesAction(action, Types.signIn.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // signOut
  if (matchesAction(action, Types.signOut.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.signOut.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "user", action.apiResponse);
  }
  if (matchesAction(action, Types.signOut.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // signUp
  if (matchesAction(action, Types.signUp.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.signUp.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "user", action.apiResponse);
  }
  if (matchesAction(action, Types.signUp.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // getUserInfo
  if (matchesAction(action, Types.getUserInfo.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.getUserInfo.done)) {
    state = ih.set(state, "doing", false);
    const {partyId, name, ucId} = action.apiResponse;
    setStorage({key: "userId", value: (partyId || '')});
    setStorage({key: "userName", value: (name || '')});
    setStorage({key: "ucId", value: (ucId || '')});
    setStorage({key: "loginTime", value: Date.now()});
    state = ih.set(state, "user", action.apiResponse);
  }
  if (matchesAction(action, Types.getUserInfo.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}
