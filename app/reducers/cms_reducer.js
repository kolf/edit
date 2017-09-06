import React, {Component} from "react";
import Types from "app/action_types";
import matchesAction from "./utils/matches_action";
import * as ih from "./utils/immutable_helpers";

const filterInit = [{
  "field": "lanmu_type",
  "text": "栏目：",
  "value": [{
    "text": "编辑",
    "id": 1
  }, {
    "text": "创意",
    "id": 2
  }, {
    "text": "视频",
    "id": 3
  }, {
    "text": "音乐",
    "id": 4
  }]
}, {
  "field": "category_id",
  "text": "分类：",
  "value": []
}, {
  "field": "status",
  "text": "在线状态：",
  "value": [{
    "text": "已上线",
    "id": 1
  }, {
    "text": "已下线",
    "id": 2
  }, {
    "text": "未发布",
    "id": 3
  }, {
    "text": "已上线未发布",
    "id": 4
  }, {
    "text": "未生效",
    "id": 5
  }]
}, {
  "field": "focus",
  "text": "使用状态：",
  "value": [{
    "text": "全部",
    "id": 0
  }, {
    "text": "常用",
    "id": 2
  }, {
    "text": "一般",
    "id": 1
  }]
}, {
  "field": "onlineDate",
  "text": "上线时间",
  "type": "time",
  "value": []
}];

const tableInit = {
  "idField": "topicId",
  "head": [
    // {
    //   "field": "sequence",
    //   "text": "序号"
    // },
    {
      "field": "topicId",
      "text": "专题ID"
    },
    {
      "field": "title",
      "text": "专题列表",
      "type": "status",
      "isFun": "callbackTitle"
    },
    //{
    //    "field": "onlineDate",
    //    "text": "上线时间"
    //},
    {
      "field": "column",
      "type": "status",
      "text": "栏目",
      "value": {
        "1": "编辑",
        "2": "创意",
        "3": "视频",
        "4": "音乐"
      }
    },
    {
      "field": "onlineState",
      "text": "状态",
      "type": "status",
      "value": {
        "1": "已上线",
        "2": "已下线",
        "3": "未发布",
        "4": "已上线未发布",
        "5": "未生效",
        "6": "未生效",
        "7": "未生效"
      },
      "isFun": "callbackOnlineState"
    },
    {
      "field": "usingState",
      "text": "使用状态",
      "type": "status",
      "value": {
        "1": "一般",
        "2": "常用"
      },
      "isFun": "callbackUsingState"
    },
    {
      "field": "operate",
      "text": "操作",
      "type": "operate",
      "value": [
        // {"operate":"moveTo", "icon":"fa-arrows", "text":"移动专题到"},
        // {"operate":"createLink", "icon":"fa-external-link", "text":"创建快捷链接"},
        // {"operate":"onlineStateConfig", "icon":"fa-gear", "text":"在线状态设置"},
        {"operate": "configPage", "icon": "fa-edit", "text": "基本信息编辑"},
        {"operate": "manageContent", "icon": "fa-file", "text": "内容管理编辑"}
      ]
    }
  ],
  "list": null,
  "pages": 1,
  "params": null
};

const channelListInit = {
  "idField": "id",
  "head": [
    //{
    //    "field": "sort",
    //    "text": "排序"
    //},
    {
      "field": "id",
      "text": "ID"
    },
    {
      "field": "title",
      "text": "名称",
      "type": "status",
      "isFun": "callbackTitle"
    },
    {
      "field": "update_time",
      "text": "最后一次编辑时间"
    },
    //{
    //    "field": "editor",
    //    "text": "编辑人员"
    //},
    {
      "field": "operate",
      "text": "操作",
      "type": "operate",
      "value": [
        {"operate": "configPage", "icon": "fa-edit", "text": "编辑"}
      ]
    }],
  "list": null,
  "pages": 1,
  "params": null
};

let contentFilter = [
  {
    "field": "picType",
    "text": "照片类型：",
    "value": [{
      "id": 1,
      "text": "单张"
    }, {
      "id": 2,
      "text": "组照"
    }],
    "children": [{
      "value": [{
        "id": 0,
        "text": "全部"
      }, {
        "id": 1,
        "text": "待编审"
      }, {
        "id": 2,
        "text": "已编审"
      }]
    }, {
      "value": [{
        "id": 0,
        "text": "全部"
      }]
    }]
  },
  {
    "field": "contentType",
    "text": "内容类型：",
    "value": [{
      "id": 0,
      "text": "全部"
    }, {
      "id": 1,
      "text": "待编审"
    }, {
      "id": 2,
      "text": "已编审"
    }]
  },
  {
    "field": "contentMasterCate",
    "text": "筛选主分类：",
    "value": []
  },
  {
    "field": "uploadTime",
    "text": "入库时间：",
    "type": "time",
    "value": []
  },
  {
    "field": "contentCategory",
    "text": "分类：",
    "value": []
  },
  {
    "field": "contentLevel",
    "text": "照片等级：",
    "value": []
  },
  // {
  //   "field": "brand",
  //   "text": "品牌：",
  //   "value": []
  // },
  {
    "field": "contentLocation",
    "text": "地点：",
    "value": []
  }, {
    "field": "contentName",
    "text": "人名：",
    "value": []
  }
];

const initialState = ih.immutable({
  "doing": false,
  "error": null,
  "dataFilter": {},
  "dataList": {},
  "categories": {}
});

export default function cmsReducer(state = initialState, action) {
  // CMSFILTER
  if (matchesAction(action, Types.CMSFILTER.request)) {
    state = ih.set(state, "doing", true);
  } else if (matchesAction(action, Types.CMSFILTER.done)) {
    state = ih.set(state, "doing", false);
    let values = [];
    action.apiResponse.map((item, i) => {
      values.push({
        id: item.id,
        text: item.name
      });
    });
    filterInit[1].value = values;
    
    state = ih.set(state, "dataFilter", filterInit);
    state = ih.set(state, "categories", action.apiResponse);
  } else if (matchesAction(action, Types.CMSFILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CMSSEARCH
  if (matchesAction(action, Types.CMSSEARCH.request)) {
    state = ih.set(state, "doing", true);
  } else if (matchesAction(action, Types.CMSSEARCH.done)) {
    state = ih.set(state, "doing", false);
    Object.assign(tableInit, action.apiResponse);
    tableInit.pages = tableInit.totalPage;
    state = ih.set(state, "dataList", tableInit);
  } else if (matchesAction(action, Types.CMSSEARCH.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CMSCONTENTFILTER
  if (matchesAction(action, Types.CMSCONTENTFILTER.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CMSCONTENTFILTER.done)) {
    state = ih.set(state, "doing", false);
    const {feFilter, categories} = action.apiResponse;
    const levelDic = ['', 'A', 'B', 'C', 'D', 'E'];
    let categoriesMap = {};
    categories.list.map((c, i) => {
      categoriesMap[c.id] = c.name;
    });
    
    feFilter.list.map((itemObject, i) => {
      const item = itemObject[Object.keys(itemObject)[0]];
      const filterIndex = i + 2;
      if (i == 2) {
        contentFilter[filterIndex].value = [];
        item.content.map((o, j) => {
          if (categoriesMap[o]) {
            contentFilter[filterIndex].value.push({
              id: o,
              text: categoriesMap[o]
            })
          }
        })
      } else if (i == 3) {
        contentFilter[filterIndex].value = [];
        item.content.map((o, j) => {
          contentFilter[filterIndex].value.push({
            id: o,
            text: levelDic[o]
          })
        })
      } else if (i != 1) {
        let valueArr = [];
        item.content.map((o, j) => {
          valueArr.push({
            id: o,
            text: o
          })
        })
        if (contentFilter[filterIndex]) {
          contentFilter[filterIndex].value = valueArr;
        } else {
          contentFilter[filterIndex] = {
            "field": 'other_' + i + '_' + item.name,
            "text": item.name,
            "value": valueArr
          }
        }
      }
    });
    
    state = ih.set(state, "dataFilter", contentFilter);
  }
  if (matchesAction(action, Types.CMSCONTENTFILTER.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  // CMSCONTENTSEARCH
  if (matchesAction(action, Types.CMSCONTENTSEARCH.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CMSCONTENTSEARCH.done)) {
    state = ih.set(state, "doing", false);
    state = ih.set(state, "dataList", action.apiResponse);
  }
  if (matchesAction(action, Types.CMSCONTENTSEARCH.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  //channelList
  if (matchesAction(action, Types.CMSCHANNELLIST.request)) {
    state = ih.set(state, "doing", true);
  }
  if (matchesAction(action, Types.CMSCHANNELLIST.done)) {
    state = ih.set(state, "doing", false);
    Object.assign(channelListInit, action.apiResponse);
    state = ih.set(state, "dataList", channelListInit);
  }
  if (matchesAction(action, Types.CMSCHANNELLIST.fail)) {
    state = ih.set(state, "error", action.apiError);
    state = ih.set(state, "doing", false);
  }
  
  return state;
}
