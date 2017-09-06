import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "AUTHENTICATE",
  "INVALID",
  "GET_USERINFO"
]);

export default {...AsyncTypes};
