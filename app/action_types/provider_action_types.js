import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "GET_POSTILDATA",
  "POST_POSTIL",
  "searchProvider",
  "providerView",
  "QUERY_PROVIDER"
]);

export default {...AsyncTypes};
