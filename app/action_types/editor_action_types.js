import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "groupAddToTopic",
  "groupViewEditHistory",
  "groupViewPostilHistory",
  "groupOnline",
  "groupOffline",
  "groupAddToOverseas",
  "groupAddToNoEditor",
  "groupAddToTheEditor",
  
  "groupCopyOrMerge",
  "photosNewOrAdd",
  "photosSplitOrAdd",
  "groupCreate",
  "copyOrMerge2Attach",
  "group",
  
  "EDIT_STORAGE_FILTER",
  "EDIT_TOEDIT_FILTER",
  "EDIT_OFFLINE_FILTER",
  "EDIT_OFFLINE_DATA",
  "EDIT_STORAGE_DATA",
  "EDIT_TOEDIT_DATA",
  "EDIT_PUBLISH_FILTER",
  "EDIT_GET_ISEDIT",
  "downloadCountQuery",
  
  "pushQuery",
  "pushView",
  "pushDelete",
  "pushDetail",
  "queryAccont",
  "refreshImage",
  "oss176View",
  "queryUserAccount",
  "queryTopic",
  "removeTopic",
]);

export default {...AsyncTypes};
