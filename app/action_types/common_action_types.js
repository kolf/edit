import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "categoryQuery",
  "regionQuery",
  "productQuery",
  "dataCache",
  "cachedData"
]);

export default {...AsyncTypes};
