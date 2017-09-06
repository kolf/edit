import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "CREATE_TOEDIT_FILTER",
  "CREATE_TOEDIT_LIST",
  "CREATE_PUBLISH_FILTER",
  "CREATE_OFFLINE_FILTER",
  "CREATE_NOPASS_FILTER",
  "CREATE_POST_STATE",
  "setImagePublish",
  "setImageLicenseType",
  "setImageQualityLevel",
  "setImageOfflineTag",
  "viewImageExif",
  "viewImageDetail",
  "keywordSave",
  "keywordPublish",
  "CREATE_AUTHFILE_LIST",
  "CREATE_AUTHFILE_RELATED",
  "CREATE_AUTHFILE_PASS",
  "setCollectionId",
  "listByResId"
]);

export default {...AsyncTypes};
