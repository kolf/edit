import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  "removeEditPic",
  "viewEditPic",
  "EDIT_DATA",
  "sortGroupImage",
  "setCreditLine",
  "setTimeliness",
  "EDIT_JOINTOSPECIAL",
  "EDIT_JOINTOSPECIAL_LIST",
  "EDIT_JOINTOGROUP_LIST",
  "EDIT_POSTDATA",
  "EDIT_SAVEDATA",
  "POST_ALLNOPASS",
  "GET_KEYWORDBYID",
  "FIND_KEYWORDID",
  "ADD_KEYWORDID",
  "MODIFY_KEYWORDID",
  "FIND_LOCALTION",
  "GET_PUSHTODATA",
  "POST_PUSHTODATA",
  "topicQuery",
  "topicDelete",
  "FIND_DISC_TAG",
  "QUERY_REASON",
  "getAllCategory",
]);

export default {...AsyncTypes};
