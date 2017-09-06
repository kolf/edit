import Types         from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih       from "./utils/immutable_helpers";

const filterInit = [
  {
    "field": "category",
    "text": "分类：",
    "value": []

  },
  {
    "field": "uploadTime",
    "text": "创建时间：",
    "type": "time",
    "value": [
      {
        "text": "今日",
        "id": 1
      },
      {
        "text": "昨日",
        "id": 2
      },
      {
        "text": "本周",
        "id": 3
      },
      {
        "text": "上周",
        "id": 4
      }
    ]
  }
];

const tableInit = {
  "idField": "topicsId",
  "head": [
    {
      "field": "topicsId",
      "text": "专题 ID"
    },
    {
      "field": "title",
      "text": "专题名",
      "type": "link",
      "href": "/topics/"
    },
    {
      "field": "parentTopicsId",
      "text": "父专题 ID"
    },
    {
      "field": "category",
      "text": "分类"
    },
    {
      "field": "createdTime",
      "text": "创建时间"
    },
    {
      "field": "operate",
      "text": "操作",
      "type": "operate",
      "value": [
        {"operate": "viewTopicsId", "icon": "fa-eye", "text": "查看"}
      ]
    }
  ],
  "list": null,
  "pages": 1,
  "params": null
};

const viewTableInit = {
  "idField": "groupId",
  "isTitle": "title",
  "head": [
    {
      "field": "groupId",
      "text": "组照 ID",
      "type": "checkbox"
    },
    {
      "field": "firstResId",
      "text": "组照",
      "type": "image"
    },
    {
      "field": "resCount",
      "text": "组照数量"
    },
    {
      "field": "createdTime",
      "text": "上传时间"
    },
    {
      "field": "provider",
      "text": "供应商"
    },
    {
      "field": "collection",
      "text": "品牌"
    },
    {
      "field": "operate",
      "text": "操作",
      "type": "operate",
      "value": [
        {"operate": "deleteGroupId", "icon": "fa-trash", "text": "删除"},
      ]
    }
  ],
  "list": null,
  "pages": 1,
  "params": null
};

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "dataFilter": {},
  "dataList": {}
});

export default function topicsReducer(state = initialState, action) {

  // TOPICSFILTER
  if (matchesAction(action, Types.TOPICSFILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.TOPICSFILTER.done)) {
    state = ih.set(state, "doing", false);
    filterInit.map((item, i) => {
      const fieldValue = action.apiResponse[item.field];
      let arg = [];
      if (item.field == "category") {
        fieldValue.map((item) => {
          const obj = {};
          obj.id = item.code;
          obj.text = item.name;
          arg.push(obj);
        })
      }
      if (item.field == "agency" || item.field == "photographer") {
        fieldValue.map((item) => {
          const obj = {};
          obj.id = item.id;
          obj.text = item.provider_name_zh;
          arg.push(obj);
        })
      }
      if (item.field == "user") {
        fieldValue.map((item) => {
          const obj = {};
          obj.id = item.id;
          obj.text = item.userName;
          arg.push(obj);
        })
      }
      if (fieldValue) {
        filterInit[i].value = arg;
      }
    });
    state = ih.set(state, "dataFilter", filterInit);
  }
  if (matchesAction(action, Types.TOPICSFILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }

  // TOPICSSEARCH
  if (matchesAction(action, Types.TOPICSSEARCH.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.TOPICSSEARCH.done)) {
    state = ih.set(state, "doing", false);
    Object.assign(tableInit, action.apiResponse);
    state = ih.set(state, "dataList", tableInit);
  }
  if (matchesAction(action, Types.TOPICSSEARCH.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }

  // TOPICSUPDATE

  // TOPICSCREATE

  // TOPICSDELETE

  // TOPICSVIEW
  if (matchesAction(action, Types.TOPICSVIEW.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.TOPICSVIEW.done)) {
    state = ih.set(state, "doing", false);
    Object.assign(viewTableInit, action.apiResponse);
    state = ih.set(state, "dataList", viewTableInit);
  }
  if (matchesAction(action, Types.TOPICSVIEW.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }

  // TOPICSAUTO
  if (matchesAction(action, Types.TOPICSAUTO.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.TOPICSAUTO.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "dataList", action.apiResponse);
  }
  if (matchesAction(action, Types.TOPICSAUTO.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }

  return state;
}
