import Types from "app/action_types";

import {
  groupQuery as groupQueryCall      // favorite query
} from "app/api/api_calls";

export function groupQuery(params) {
  return {
    type: Types.groupQuery,
    callAPI: () => groupQueryCall(params)
  }
}