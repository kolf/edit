import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "LAYOUTS",
  "SIDEBAR"
]);

export default {...AsyncTypes};
