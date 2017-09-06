import Types from "app/action_types";

import {
  layouts as layoutsCall,
  sidebar as sidebarCall,
} from "app/api/api_calls";

export function layouts(router, template) {
  return {
    type: Types.LAYOUTS,
    callAPI: () => layoutsCall({router, template})
  }
}
export function sidebar(collapse) {
  return {
    type: Types.SIDEBAR,
    // collapse: collapse
    callAPI: () => sidebarCall({collapse})
  }
}