import Types         from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

import {
  filterData,
  takeArray,
  storageGroupData,
  storagePhotosData
} from "app/components/common/filterData";

const editor_publish = takeArray(filterData, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
const editor_toedit = takeArray(filterData, [0, 1, 2, 3, 4, 14]);
const editor_offline = takeArray(filterData, [0, 1, 2, 3, 4, 15, 5, 6, 7, 8]);

const create_toedit = takeArray(filterData, [0, 2, 3, 4]);
const create_publish = takeArray(filterData, [17, 9, 0, 2, 3, 4, 5, 6, 11, 12]);
const create_offline = takeArray(filterData, [17, 0, 2, 3, 4, 5, 6, 11, 12]);
const create_nopass = takeArray(filterData, [17, 0, 2, 3, 4, 5, 6, 13]);


const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "data": {},
  "searchList": {}
});

export default function filterReducer(state = initialState, action) {
  
  // EDIT_STORAGE_FILTER
  if (matchesAction(action, Types.EDIT_STORAGE_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_STORAGE_FILTER.done)) {
    state = ih.set(state, "doing", false);
    const params = action.apiResponse.params;
    if (params.paramType !== 0) {
      state = ih.set(state, "searchList", action.apiResponse);
    } else {
      const resGroup = params.param.resGroup;
      if (resGroup == 1) {
        state = ih.set(state, "data", editData(storageGroupData, action.apiResponse));
      }
      if (resGroup == 2) {
        state = ih.set(state, "data", editData(storagePhotosData, action.apiResponse));
      }
    }
  }
  if (matchesAction(action, Types.EDIT_STORAGE_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // EDIT_PUBLISH_FILTER
  if (matchesAction(action, Types.EDIT_PUBLISH_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_PUBLISH_FILTER.done)) {
    state = ih.set(state, "doing", false);
    if (action.apiResponse.params.paramType !== 0) {
      state = ih.set(state, "searchList", action.apiResponse);
    } else {
      state = ih.set(state, "data", editData(editor_publish, action.apiResponse));
    }
  }
  if (matchesAction(action, Types.EDIT_PUBLISH_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // EDIT_TOEDIT_FILTER
  if (matchesAction(action, Types.EDIT_TOEDIT_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_TOEDIT_FILTER.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", editData(editor_toedit, action.apiResponse));
  }
  if (matchesAction(action, Types.EDIT_TOEDIT_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // EDIT_OFFLINE_FILTER
  if (matchesAction(action, Types.EDIT_OFFLINE_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.EDIT_OFFLINE_FILTER.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", editData(editor_offline, action.apiResponse));
  }
  if (matchesAction(action, Types.EDIT_OFFLINE_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CREATE_TOEDIT_FILTER
  if (matchesAction(action, Types.CREATE_TOEDIT_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CREATE_TOEDIT_FILTER.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", editData(create_toedit, action.apiResponse));
  }
  if (matchesAction(action, Types.CREATE_TOEDIT_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CREATE_PUBLISH_FILTER
  if (matchesAction(action, Types.CREATE_PUBLISH_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CREATE_PUBLISH_FILTER.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", editData(create_publish, action.apiResponse));
  }
  if (matchesAction(action, Types.CREATE_PUBLISH_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CREATE_OFFLINE_FILTER
  if (matchesAction(action, Types.CREATE_OFFLINE_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CREATE_OFFLINE_FILTER.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", editData(create_offline, action.apiResponse));
  }
  if (matchesAction(action, Types.CREATE_OFFLINE_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CREATE_NOPASS_FILTER
  if (matchesAction(action, Types.CREATE_NOPASS_FILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CREATE_NOPASS_FILTER.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "data", editData(create_nopass, action.apiResponse));
  }
  if (matchesAction(action, Types.CREATE_NOPASS_FILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  return state;
}

const editData = (filterInit, result) => {
  filterInit.map((item, i) => {
    let fieldValue = [];
    if (item.field == "editUserId") {
      fieldValue = result["user"];
    }
    else if (item.field == "providerId") {
      fieldValue = result["photographer"];
    }
    // else if (item.field == "agency") {
    //     fieldValue = result["categoryProviders"];
    // }
    else {
      fieldValue = result[item.field];
    }
    //console.log('result',result);
    //console.log(item.field,fieldValue);
    if (!fieldValue) return;
    let arg = [];
    if (item.field == "category" || item.field == "editUserId") {
      fieldValue.map((item) => {
        const obj = {};
        obj.id = item.id;
        obj.text = item.name;
        arg.push(obj);
      })
    }
    if (item.field == "providerId" || item.field == "agency") {
      fieldValue.map((item) => {
        const obj = {};
        obj.id = item.id + ",";
        obj.text = item.nameCn;
        arg.push(obj);
      })
    }
    if (fieldValue) {
      filterInit[i].value = arg;
    }
  });
  
  return filterInit;
};

