import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "tagQuery",     // query
  "tagSave",      // create edit
  "tagView",      // view
  "tagExpand",    // expand pid
  "tagDelete"     // delete
]);

export default {...AsyncTypes};
