import Types  from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

const reviewRecordsTableInit = {
  "idField": "recordsId",
  "head": [
    {
      "field": "createdTime",
      "text": "编审时间"
    },
    {
      "field": "userName",
      "text": "编审人"
    },
    {
      "field": "message",
      "text": "具体操作"
    }
  ],
  "list": null,
  "pages": 1,
  "params": null
};

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "addInEdit": false, //添加到待编审
  "reviewRecordsDataList": {}, //编审记录
  "postilData": {}, //批注
  "providerList": null, //摄影师列表
  "providerdata": null, //摄影师信息
  "infoData": null, // 供应商详情
  "pictureData": null // 供应商详情 图列表
});

export default function providerReducer(state = initialState, action) {
  
  // ADDINEDIT
  //if (matchesAction(action, Types.ADDINEDIT.request)) {
  //  state = ih.set(state, "doing", true);
  //}
  //if (matchesAction(action, Types.ADDINEDIT.done)) {
  //  state = ih.set(state, "doing", false);
  //  state = ih.set(state, "addInEdit", "done");
  //}
  //if (matchesAction(action, Types.ADDINEDIT.fail)) {
  //  state = ih.set(state, "doing", false);
  //  state = ih.set(state, "error", action.apiError);
  //}
  
  // REVIEWRECORDSVIEW
  //if (matchesAction(action, Types.REVIEWRECORDSVIEW.request)) {
  //  state = ih.set(state, "doing", true);
  //}
  //if (matchesAction(action, Types.REVIEWRECORDSVIEW.done)) {
  //  state = ih.set(state, "doing", false);
  //  reviewRecordsTableInit.list = action.apiResponse;
  //  state = ih.set(state, "reviewRecordsDataList", reviewRecordsTableInit);
  //}
  //if (matchesAction(action, Types.REVIEWRECORDSVIEW.fail)) {
  //  state = ih.set(state, "error", action.apiError);
  //  state = ih.set(state, "doing", false);
  //}
  
  //GET_POSTILDATA
  // providerView
  if (matchesAction(action, Types.providerView.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.providerView.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "infoData", action.apiResponse);
  }
  if (matchesAction(action, Types.providerView.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}
