import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "SEARCHRELIST",
  "RSS_CREATE",
  "RSS_QUERY",
  "RSS_UPDATE",
  "RSS_REMOVE",
]);

export default {...AsyncTypes};
