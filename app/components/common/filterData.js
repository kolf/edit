/**
 * Created by tonglaiz on 2016/9/19.
 */

const filterData = [
  {//0
    "field": "resGroup",
    "text": "搜索类型：",
    "value": [
      {
        "text": "组照",
        "id": 1
      },
      {
        "text": "图片",
        "id": 2
      }
    ]
  },
  {//1
    "field": "graphicalType",
    "text": "内容类型：",
    //"type": "checkbox",
    "value": [
      {
        "text": "摄影图片",
        "id": 1
      },
      {
        "text": "插画/漫画",
        "id": 2
      },
      {
        "text": "图表",
        "id": 4
      }
    ]
  },
  {//2
    "field": "category",
    "text": "内容分类：",
    //"type": "checkbox",
    "value": []
    
  },
  {//3
    "field": "agency",
    "text": "机构：",
    "type": "search",
    "value": []
  },
  {//4
    "field": "providerId",
    "text": "供稿人：",
    "type": "search",
    "value": []
  },
  {//5
    "field": "uploadTime",
    "text": "上传时间：",
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
  },
  {//6
    "field": "editTime",
    "text": "编审时间：",
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
  },
  {//7
    "field": "editUserId",
    "text": "编审人：",
    "type": "search",
    "value": []
  },
  {//8
    "field": "timeliness",
    "text": "资料/时效：",
    "value": [
      {
        "text": "时效",
        "id": 0
      },
      {
        "text": "资料",
        "id": 1
      }
    ]
  },
  {//9
    "field": "isPostil",
    "text": "批注状态：",
    "value": [
      {
        "text": "未批注",
        "id": 1
      },
      {
        "text": "已批注",
        "id": 0
      }
    ]
  },
  {//10
    "field": "groupState",
    "text": "编审状态：",
    "value": [
      {
        "text": "待编审",
        "id": 1
      },
      {
        "text": "已编审",
        "id": 4
      }
    ]
  },
  {//11
    "field": "onlineType",
    "text": "上线方式：",
    "value": [
      {
        "text": "人工审核",
        "id": 1
      },
      {
        "text": "系统免审",
        "id": 2
      },
      {
        "text": "下线审核",
        "id": 100
      }
    ]
  },
  {//12
    "field": "qualityRank",
    "text": "图片等级：",
    "value": [
      {
        "text": "A",
        "id": 1
      },
      {
        "text": "B",
        "id": 2
      },
      {
        "text": "C",
        "id": 3
      },
      {
        "text": "D",
        "id": 4
      }
    ]
  },
  {//13
    "field": "authority",
    "text": "图片授权：",
    "value": [
      {
        "text": "RF",
        "id": 1
      },
      {
        "text": "RM",
        "id": 0
      }
    ]
  },
  {//14
    "field": "imageRejectReason",
    "text": "不通过原因：",
    "value": [
      {
        "text": "创意不通过",
        "id": 0
      },
      {
        "text": "肖像权/物权不通过",
        "id": 1
      }
    ]
  },
  {//15
    "field": "onlineType",
    "text": "入库方式：",
    "value": [
      {
        "text": "非机构免审",
        "id": 1
      },
      {
        "text": "机构免审",
        "id": 0
      }
    ]
  },
  {//16
    "field": "offlineReason",
    "text": "下线类型：",
    "value": [
      {
        "text": "不通过",
        "id": 0
      },
      {
        "text": "机构下线",
        "id": 1
      }
    ]
  },
  {//17
    "field": "editType",
    "text": "审核类型：",
    "value": [
      {
        "text": "创意审核",
        "id": 1
      },
      {
        "text": "关键词审核",
        "id": 0
      }
    ]
  },
  {//18
    "field": "graphicalType",
    "text": "内容类型：",
    //"type": "checkbox",
    "value": [
      {
        "text": "摄影图片",
        "id": 1
      },
      {
        "text": "插画",
        "id": 2
      },
      {
        "text": "矢量图",
        "id": 5
      }
    ]
  },
  {//19
    "field": "onlineState",
    "text": "上线状态",
    "value": [
      {
        "text": "已上线",
        "id": 1
      },
      {
        "text": "未上线",
        "id": 2
      },
      {
        "text": "已下线",
        "id": 3
      }
    ]
  },
  {//20
    "field": "other",
    "text": "",
    "value": [
      {
        "text": "",
        "id": 0
      }
    ]
  }
];

const takeArray = (array, take) => {
  let tmp = [];
  [...take].map(item => {
    if (array[item]) tmp.push(array[item]);
  });
  return tmp;
};

const getFilterValue = (fieldValue) => {
  let tmp = [];
  fieldValue.map((item) => {
    const obj = {};
    obj.id = item.id;
    obj.text = item.name || item.nameCn;
    tmp.push(obj);
  });
  return tmp;
};

const storageGroupData = takeArray(filterData, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const storagePhotosData = takeArray(filterData, [1, 2, 3, 4, 5]);
const noEditorGroupData = takeArray(filterData, [1, 2, 4, 5, 15]);
const secondInstanceGroupData = takeArray(filterData, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
const onlineGroupData = takeArray(filterData, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
const offlineGroupData = takeArray(filterData, [1, 2, 3, 4, 5, 6, 7, 8, 9, 16]);

const noEditorCreativeData = takeArray(filterData, [18, 3, 4, 5]);
const onlineCreativeData = takeArray(filterData, [18, 2, 3, 4, 5, 6, 7, 11, 12, 13]);
const offlineCreativeData = takeArray(filterData, [18, 2, 3, 4, 5, 6, 7, 16, 12, 13]);
const failCreativeData = takeArray(filterData, [18, 2, 3, 4, 5, 6, 7, 12, 13]);
const creativeOnlineStateMethod = takeArray(filterData, [11, 14, 20]);
const creativeEditorData = takeArray(filterData, [19, 11, 18, 3, 4, 5, 6, 7, 12, 13]);

const contributorVerifyData = takeArray(filterData, [19]);

export {
  filterData,
  storageGroupData,
  storagePhotosData,
  noEditorGroupData,
  secondInstanceGroupData,
  onlineGroupData,
  offlineGroupData,
  
  noEditorCreativeData,
  onlineCreativeData,
  offlineCreativeData,
  failCreativeData,
  creativeOnlineStateMethod,
  creativeEditorData,
  
  contributorVerifyData,
  
  takeArray,
  getFilterValue
};
