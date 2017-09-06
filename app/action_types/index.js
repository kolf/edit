import env from "app/utils/env";

const list = [
  require("./common_action_types"),
  require("./group_action_types"),
  require("./passport_action_types"),
  require("./tag_action_types"),
  require("./supplier_topic_action_types"),
  require("./topics_action_types"),
  require("./editor_action_types"),
  require("./edit_action_types"),
  require("./create_action_types"),
  require("./provider_action_types"),
  require("./person_action_types"),
  require("./search"),
  require("./cms_action_types")
];


/*
 * Export the merged list of action types.
 */
export default list.reduce((result, actionTypes) => tryMerge(result, actionTypes), {});


/**
 * Little helper only for Dev, just throw if we find an Action that already exists
 * just to make easier the development.
 */
function tryMerge(obj, newObj) {
  
  if (env.isDev) {
    Object.keys(newObj).forEach(type => {
      if (obj[type]) throw new Error(`ActionType: [${type}] already exists`);
    });
  }
  
  return {...obj, ...newObj};
}
