import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  'filterAppend',
  'filterRemove'
]);

export default {...AsyncTypes};
