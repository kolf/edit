import Types from "app/action_types/session";

import {
  fetchSession as fetchSessionCall,
  login as loginCall,
  invalid as invalidCall,
  userInfo as userInfoCall
} from "app/api/api_calls";


export function login(userName, password) {
  return {
    type: Types.AUTHENTICATE,
    callAPI: () => loginCall({userName, password})
  }
}

export function invalid() {
  return {
    type: Types.INVALID,
    callAPI: () => invalidCall()
  }
}

export function initializeSession() {
  return {}
}

export function userInfo(params) {
  return {
    type: Types.GET_USERINFO,
    callAPI: () => userInfoCall(params)
  }
}