import Types from "app/action_types";

import {
  creativeImageQuery    as creativeImageQueryCall
} from "app/api/api_calls";

export function creativeImageQuery() {
  return {
    type: Types.creativeImageQuery,
    callAPI: () => creativeImageQueryCall()
  }
}