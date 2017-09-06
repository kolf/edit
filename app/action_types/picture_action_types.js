import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  'creativeImageQuery',
  'creativeImageSetState',
  'creativeImageSetQualityRank',
  'creativeImageSetLicenseType'
]);

export default {...AsyncTypes};
