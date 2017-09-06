import Types from "app/action_types";

import {
  supplierTopicQuery  as supplierTopicQueryCall,           // query
} from "app/api/api_calls";

export function supplierTopicQuery(params) {
  return {
    type: Types.supplierTopicQuery,
    callAPI: () => supplierTopicQueryCall(params)
  };
}
