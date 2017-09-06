import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "TOPICSFILTER",
  "TOPICSSEARCH",
  "TOPICSMERGE",
  "TOPICSUPDATE",
  "TOPICSCREATE",
  "TOPICSDELETE",
  "TOPICSVIEW",
  'TOPICSAUTO'
]);

export default {...AsyncTypes};
