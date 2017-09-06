import createAsyncActionsTypes from "./utils/create_async_actions_types";

const AsyncTypes = createAsyncActionsTypes([
  // my favorite
  "favoriteQuery",      // favorite query
  "favoriteDelete",     // favorite delete
  "favoriteSave",       // favorite create save
  "favoriteItemQuery",  // favorite item query
  "favoriteItemDelete", // favorite item delete
  "favoriteItemAdd",
  
  "GET_DRAFTDATA",
  "POST_RELIEVEDRAFT",
  "GET_MYNEWSLIST",
  "POST_DELETEMYNEWS",
  "POST_TOMYNEWS",
  "GET_PERSONALDATA"
]);

export default {...AsyncTypes};
