import Types         from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "groupData": null,
  "listData": null,
  "keywordsData": null,
  "reasonData": null,
  
  "pushtoData": {},
  "special": {},
  "specialList": {},
  "favoriteList": {},
  "queryTopicData": null,
  "peopleTagData": null
});

export default function editReducer(state = initialState, action) {
  
  // EDIT_DATA
  if (matchesAction(action, Types.EDIT_DATA.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_DATA.done)) {
    state = ih.set(state, "doing", false);
    const {group, list} = action.apiResponse;
    state = ih.set(state, "groupData", group);
    state = ih.set(state, "listData", list);
  }
  if (matchesAction(action, Types.EDIT_DATA.fail)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", action.apiError);
  }
  
  // GET_PUSHTODATA
  if (matchesAction(action, Types.GET_PUSHTODATA.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.GET_PUSHTODATA.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "pushtoData", action.apiResponse);
  }
  if (matchesAction(action, Types.GET_PUSHTODATA.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  //EDIT_JOINTOSPECIAL/加入专题推荐
  if (matchesAction(action, Types.EDIT_JOINTOSPECIAL.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_JOINTOSPECIAL.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "special", action.apiResponse);
  }
  if (matchesAction(action, Types.EDIT_JOINTOSPECIAL.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  //EDIT_JOINTOSPECIAL_LIST/加入专题下拉
  if (matchesAction(action, Types.EDIT_JOINTOSPECIAL_LIST.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_JOINTOSPECIAL_LIST.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "specialList", action.apiResponse);
  }
  if (matchesAction(action, Types.EDIT_JOINTOSPECIAL_LIST.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  //GET_KEYWORDBYID/根据id获取关键词
  if (matchesAction(action, Types.GET_KEYWORDBYID.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.GET_KEYWORDBYID.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "keywordsData", action.apiResponse);
  }
  if (matchesAction(action, Types.GET_KEYWORDBYID.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // topicQuery
  if (matchesAction(action, Types.topicQuery.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.topicQuery.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "queryTopicData", action.apiResponse);
  }
  if (matchesAction(action, Types.topicQuery.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // 获取图说人物关键词
  if (matchesAction(action, Types.FIND_DISC_TAG.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.FIND_DISC_TAG.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "discTagData", action.apiResponse);
  }
  if (matchesAction(action, Types.FIND_DISC_TAG.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // 查询不通过、下线原因
  if (matchesAction(action, Types.QUERY_REASON.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.QUERY_REASON.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "error", false);
    state = ih.set(state, "reasonData", action.apiResponse[0].childNodes);
  }
  if (matchesAction(action, Types.QUERY_REASON.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
  
}
