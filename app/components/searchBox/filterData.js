const filterArr = [
    {//2
        "id": 2,
        "field": "category",
        "text": "内容分类",
        "type": "tag",
        "multiple": {
            status: false
        },
        "options": [],
        "syncOptions": {
            paramType: 1,
            parent: 'graphicalType',
            param: {}
        },
        'callback': 'queryOftenAgency'
        // "linkageId": 3
    },
    {//3
        "id": 3,
        "field": "agency",
        "text": "机构",
        "type": "transfer",
        syncOptions: {
            title: '机构',
            paramType: 2,
            resOptionsName: 'agency'
        }
        // oftenOptions: [{
        //     label: '全部',
        //     value: 'all',
        // },{
        //     label: '南方都市报独家稿件',
        //     value: '南方都市报独家稿件|1',
        // },{
        //     label: '成都商报',
        //     value: '成都商报|2',
        // }]
        // "allowClear": true,
        // "multiple": {
        //     status: false
        // },
        // "options": [
        //     {
        //         "text": "全部",
        //         "id": '-1'
        //     }
        // ],
        // "syncOptions": {
        //     paramType: 5,
        //     parent: 'category',
        //     param: {
        //         graphicalType: '',
        //         category:'',
        //         picType: 1
        //     }
        // }
    },
    {//4
        "id": 4,
        "field": "providerId",
        "text": "供稿人",
        "type": "transfer",
        syncOptions: {
            title: '供稿人',
            paramType: 3,
            resOptionsName: 'photographer',
        }
        // "allowClear": true,
        // "options": [{
        //     "text": "全部",
        //     "id": "-1"
        // }]
    },
    {//5
        "id": 5,
        "field": "uploadTime",
        "text": "上传时间",
        "type": "tag,time",
        "options": [
            {
                "text": "今日",
                "id": 1
            }, {
                "text": "昨日",
                "id": 2
            }, {
                "text": "近一周",
                "id": 3
            }
        ]
    },
    {//6
        "id": 6,
        "field": "editTime",
        "text": "编审时间",
        "type": "tag,time",
        "options": [
            {
                "text": "今日",
                "id": 1
            }, {
                "text": "昨日",
                "id": 2
            }, {
                "text": "近一周",
                "id": 3
            }
        ]
    },
    {//7
        "id": 7,
        "field": "editUserId",
        "text": "编审人",
        "type": "transfer",
        syncOptions: {
            title: '编审人',
            paramType: 4,
            resOptionsName: 'user'
        }
        // "type": "search",
        // "options": []
    },
    {//8
        "id": 8,
        "field": "timeliness",
        "text": "资料/时效",
        "type": "tag",
        "options": [
            {
                "text": "资料",
                "id": 1
            }, {
                "text": "时效",
                "id": 0
            }
        ]
    },
    {//9
        "id": 9,
        "field": "isPostil",
        "text": "批注状态",
        "type": "tag",
        "options": [
            {
                "text": "未批注",
                "id": 0
            }, {
                "text": "已批注",
                "id": 1
            }
        ]
    },
    {//11
        "id": 11,
        "field": "onlineType",
        "text": "上线方式",
        "type": "tag",
        "options": [
            {
                "text": "人工审核",
                "id": 1
            },
            {
                "text": "标记下线",
                "id": 100
            }
        ]
    },
    {//12
        "id": 12,
        "field": "qualityRank",
        "text": "图片等级",
        "type": "tag",
        "options": [
            {
                "text": "A",
                "id": 1
            }, {
                "text": "B",
                "id": 2
            }, {
                "text": "C",
                "id": 3
            }, {
                "text": "D",
                "id": 4
            }
        ]
    },
    {//13
        "id": 13,
        "field": "authority",
        "text": "图片授权",
        "type": "tag",
        "options": [
            {
                "text": "RF",
                "id": 1
            }, {
                "text": "RM",
                "id": 0
            }
        ]
    },
    {//14
        "id": 14,
        "field": "imageRejectReason",
        "text": "不通过原因",
        "type": "tag",
        "options": [
            {
                "text": "创意不通过",
                "id": 0
            }, {
                "text": "肖像权/物权不通过",
                "id": 1
            }
        ]
    },
    {//15
        "id": 15,
        "field": "onlineType",
        "text": "入库方式",
        "type": "tag",
        "options": [
            {
                "text": "非免审",
                "id": 1 //2|2|1
            }, {
                "text": "免审(敏感词)",
                "id": 2 //1|1|2
            }
        ]
    },
    {//16
        "id": 16,
        "field": "offlineReason",
        "text": "下线类型",
        "type": "tag",
        "options": [
            {
                "text": "不通过",
                "id": 0
            }, {
                "text": "标记下线",
                "id": 1
            }, {
                "text": "供稿人申请下线",
                "id": 2
            }
        ]
    },
    {//17
        "id": 17,
        "field": "editType",
        "text": "审核类型",
        "type": "tag",
        "options": [
            {
                "text": "创意审核",
                "id": 1
            }, {
                "text": "关键词审核",
                "id": 0
            }
        ]
    },
    {//18
        "id": 18,
        "field": "graphicalType",
        "text": "内容类型",
        "type": "tag",
        "multiple": {
            status: false
        },
        "options": [
            {
                "text": "摄影图片",
                "id": 1
            }, {
                "text": "插画",
                "id": 2
            }, {
                "text": "矢量图",
                "id": 5
            }
        ]
    },
    {//19
        "id": 19,
        "field": "onlineState",
        "text": "上线状态",
        "type": "tag",
        "options": [
            {
                "text": "已上线",
                "id": 1
            }, {
                "text": "标记下线",
                "id": 2
            }, {
                "text": "已下线",
                "id": 3
            }
        ]
    },
    {//20
        "id": 20,
        "field": "other",
        "text": "",
        "type": "tag",
        "options": [
            {
                "text": "",
                "id": 0
            }
        ]
    },
    {//21
        "id": 21,
        "field": "offlineReason",
        "text": "标记下线",
        "type": "tag",
        "options": [
            { text: "撤图", id: "9999" },
            { text: "陈旧内容", id: "333" },
            { text: "法律法规问题", id: "334" },
            { text: "画质不佳", id: "335" },
            { text: "买断下线", id: "336" },
            { text: "敏感内容", id: "331" }
        ]
    },
    { // 22
        "id": 22,
        "field": "kind",
        "text": "类型",
        "type": 'tag',
        "options": [
            {
                "text": "主题",
                "id": 0
            }, {
                "text": "概念",
                "id": 1
            }, {
                "text": "规格",
                "id": 2
            }, {
                "text": "人物",
                "id": 3
            }, {
                "text": "地点",
                "id": 4
            }
        ]

    },
    {
        "id": 23,
        "field": "agency",
        "text": "机构",
        "type": "transfer",
        "syncOptions": {
            title: '机构',
            paramType: 2,
            resOptionsName: 'agency'
        },
        "oftenOptions": [{
            "nameCn": "全部",
            "id": '-1'
        }, {
            "nameCn": "BJI",
            "id": '3'
        }, {
            "nameCn": "VSI",
            "id": '64,44018'
        }, {
            "nameCn": "UIG",
            "id": '30'
        }, {
            "nameCn": "Bambustone",
            "id": '17'
        }, {
            "nameCn": "BVS",
            "id": '44'
        }, {
            "nameCn": "HaveImages",
            "id": '18'
        }, {
            "nameCn": "Totallmage",
            "id": '40'
        }, {
            "nameCn": "Getty",
            "id": '1'
        }]
    }, {
        "id": 24,
        "field": "imageState",
        "text": "图片状态",
        "type": "tag",
        "options": [{
            "text": "未编审",
            "id": '1'
        }, {
            "text": "通过",
            "id": '2'
        }, {
            "text": "不通过",
            "id": '3'
        }]
    }, {
        "id": 25,
        "field": "imageState",
        "text": "图片状态",
        "type": "tag",
        "options": [{
            "text": "待编审",
            "id": '1'
        }, {
            "text": "不通过",
            "id": '3'
        }]
    }, {
        "id": 26,
        "field": "graphicalType",
        "text": "内容类型",
        "type": "tag",
        "multiple": {
            status: false
        },
        "options": [{
            "text": "摄影图片",
            "id": 1
        }, {
            "text": "插画",
            "id": 2
        }, {
            "text": "漫画",
            "id": 3
        }, {
            "text": "图表",
            "id": 4
        }],
        "linkageId": 2,
        callback: 'clearOptenAgency'
    }, {
        "id": 27,
        "field": "operator",
        "text": "操作人",
        "type": "search",
        "options": []
    }, {
        "id": 28,
        "field": "operatingTime",
        "text": "操作时间",
        "type": "tag,time",
        "options": [{
            "text": "今日",
            "id": 1
        }, {
            "text": "昨日",
            "id": 2
        }, {
            "text": "近一周",
            "id": 3
        }
        ]
    }, {
        "id": 29,
        "field": "contentType",
        "text": "推送专题",
        "type": "sels, tag",
        selectOptions: [{
            id: 291,
            placeholder: '自媒体',
            options: [{
                "text": "图播快报",
                "id": 1100
            },{
                "text": "最星动",
                "id": 1400
            },{
                "text": "图说赛事",
                "id": 1200
            },{
                "text": "图话历史",
                "id": 1300
            },{
                "text": "潮我看",
                "id": 1600
            },{
                "text": "智游12301",
                "id": 1500
            }]
        }, {
            id: 292,
            placeholder: '企鹅号',
            options: [{
                "text": "图播快报",
                "id": 301
            },{
                "text": "最星动",
                "id": 304
            },{
                "text": "图说赛事",
                "id": 302
            },{
                "text": "图话历史",
                "id": 303
            },{
                "text": "智游12301",
                "id": 305
            }]
        }, {
            id: 293,
            placeholder: '百度百家',
            options: [{
                "text": "潮我看-自动",
                "id": 16
            },{
                "text": "图播快报-自动",
                "id": 17
            },{
                "text": "图说赛事-自动",
                "id": 18
            },{
                "text": "图话历史-自动",
                "id": 19
            },{
                "text": "最星动-自动",
                "id": 20
            },{
                "text": "智游12301-自动",
                "id": 21
            },{
                "text": "潮我看-人工",
                "id": 10
            },{
                "text": "图播快报-人工",
                "id": 11
            },{
                "text": "图说赛事-人工",
                "id": 12
            },{
                "text": "图说历史-人工",
                "id": 13
            },{
                "text": "最星动-人工",
                "id": 14
            },{
                "text": "智游12301-人工",
                "id": 15
            }]
        }],
        options: [{
            "text": "人民日报",
            "id": 6
        }]
    }, {
        "id": 30,
        "field": "pushTime",
        "text": "推送时间",
        "type": "tag,time",
        "options": [{
            "text": "今日",
            "id": 1
        }, {
            "text": "昨日",
            "id": 2
        }, {
            "text": "近一周",
            "id": 3
        }
        ]
    },
    {//31 编辑类已上线入库方式和编辑类待编审入库方式有点不同
        "id": 31,
        "field": "publishType",
        "text": "入库方式",
        "type": "tag",
        "options": [
            {
                "text": "非免审",
                "id": 1 //2|2|1
            }, {
                "text": "免审",
                "id": 2 //1|1|2
            }
        ]
    },
    {//32 编辑类下线类型
        "id": 32,
        "field": "offlineReason",
        "text": "下线类型",
        "type": "tag",
        "options": [
            {
                "text": "编审不通过",
                "id": 0
            },
            {
                "text": "手动下线",
                "id": 2
            }
        ]
    },
    {// 编审上线时间
        "id": 33,
        "field": "onlineTime",
        "text": "上线时间",
        "type": "tag,time",
        "options": [
            {
                "text": "今日",
                "id": 1
            }, {
                "text": "昨日",
                "id": 2
            }, {
                "text": "近一周",
                "id": 3
            }
        ]
    },
    {// 编审下线时间
        "id": 34,
        "field": "offlineTime",
        "text": "下线时间",
        "type": "tag,time",
        "options": [
            {
                "text": "今日",
                "id": 1
            }, {
                "text": "昨日",
                "id": 2
            }, {
                "text": "近一周",
                "id": 3
            }
        ]
    },
    {// 供应商搜索
        "id": 35,
        "field": "assetFamily",
        "text": "供应商类型",
        "type": "tag",
        "options": [
            {
                "text": "编辑类",
                "id": 1
            }, {
                "text": "创意类",
                "id": 2
            }, {
                "text": "编辑类&创意类",
                "id": 3
            }, {
                "text": "公关",
                "id": 4
            }
        ]
    },
    {// 权限状态 3开通 5冻结 6关闭
        "id": 36,
        "field": "status",
        "text": "状态",
        "type": "tag",
        "options": [
            {
                "text": "有效",
                "id": 3
            }, {
                "text": "冻结",
                "id": 5
            }, {
                "text": "关闭",
                "id": 6
            }
        ]
    },
    {// 地区 isNative 1本地 2海外 城市另说
        "id": 37,
        "field": "address",
        "text": "地区",
        "type": "area",
        "options": []
    },
    {// 等级
        "id": 38,
        "field": "qualityRank",
        "text": "等级",
        "type": "tag",
        "options": [
            {
                "text": "A+",
                "id": 1
            }, {
                "text": "A",
                "id": 2
            }, {
                "text": "B",
                "id": 3
            }, {
                "text": "C",
                "id": 4
            }, {
                "text": "D",
                "id": 5
            }

        ]
    },
    {// 组照编审状态
        "id": 39,
        "field": "groupState",
        "text": "编审状态",
        "type": "tag",
        "multiple": {
            status: false
        },
        "options": [
            {
                "text": "未编审",
                "id": 1
            }, {
                "text": "待编审",
                "id": 2
            }, {
                "text": "二审",
                "id": 3
            }, {
                "text": "已发布",
                "id": 4
            }
        ]
    },
    {// 上线状态
        "id": 40,
        "field": "onlineState",
        "text": "上线状态",
        "type": "tag",
        "multiple": {
            status: false
        },
        "options": [
            {
                "text": "未上线",
                "id": 2
            }, {
                "text": "已上线",
                "id": 1
            }, {
                "text": "已下线",
                "id": 3
            }
        ],
    },
    {// 上线方式
        "id": 41,
        "field": "onlineType",
        "text": "上线方式",
        "type": "tag",
        "options": [
            {
                "text": "审核上线",
                "id": 1
            }, {
                "text": "自动上线",
                "id": 2
            }
        ]
    },
    {// 组照编审状态
        "id": 42,
        "field": "imageState",
        "text": "编审状态",
        "type": "tag",
        "options": [
            {
                "text": "待编审",
                "id": 1
            }, {
                "text": "已通过",
                "id": 2
            }, {
                "text": "不通过",
                "id": 3
            }
        ]
    }, {
        "id": 43,
        "field": "ifsend",
        "text": "推送结果",
        "type": "tag",
        "options": [{
            "text": "未推送成功",
            "id": 0
        }, {
            "text": "推送成功",
            "id": 1
        }, {
            "text": "已删除",
            "id": -1
        }]
    },
    {
        "id": 44,
        "field": "oneCategory",
        "text": "分类",
        "type": "tag",
        "options": [
            {
                "text": "Archival",
                "id": 237654
            },
            {
                "text": "Art & Culture",
                "id": 237655
            },
            {
                "text": "Business",
                "id": 237656
            },
            {
                "text": "Entertainment & Fashion",
                "id": 237657
            },
            {
                "text": "News",
                "id": 237658
            },
            {
                "text": "Weird News",
                "id": 237659
            },
            {
                "text": "Sport",
                "id": 237660
            },
            {
                "text": "Travel",
                "id": 237661
            }
        ],
    }, {// 组照编审状态
        "id": 45,
        "field": "groupState",
        "text": "编审状态",
        "type": "tag",
        "options": [
            {
                "text": "待编审",
                "id": 2
            }, {
                "text": "二审",
                "id": 3
            }, {
                "text": "已发布",
                "id": 4
            }
        ]
    }, {
        "id": 46,
        "field": "graphicalType",
        "text": "内容类型",
        "type": "tag",
        "options": [{
            "text": "摄影图片",
            "id": 1
        }, {
            "text": "插画",
            "id": 2
        }, {
            "text": "漫画",
            "id": 3
        }, {
            "text": "图表",
            "id": 4
        }]
    }, {// 英文上线状态
        "id": 47,
        "field": "onlineState",
        "text": "上线状态",
        "type": "tag",
        "options": [
            {
                "text": "未上线",
                "id": 2
            }, {
                "text": "已上线",
                "id": 1
            }, {
                "text": "已下线",
                "id": 3
            }
        ],
    }, {// 组照编审状态
        "id": 48,
        "field": "groupState",
        "text": "编审状态",
        "type": "tag",
        "options": [
            {
                "text": "未编审",
                "id": 1
            }, {
                "text": "待编审",
                "id": 2
            }, {
                "text": "二审",
                "id": 3
            }, {
                "text": "已发布",
                "id": 4
            }
        ]
    }, {// 客户
        "id": 49,
        "field": "accountId",
        "text": "客户",
        "type": "search",
        "options": []
    }, {// 下载时间
        "id": 50,
        "field": "downloadTime",
        "text": "下载时间",
        "type": "tag,time",
        "options": [
            {
                "text": "今日",
                "id": 1
            }, {
                "text": "昨日",
                "id": 2
            }, {
                "text": "近一周",
                "id": 3
            }
        ]
    }, {// 下载时间
        "id": 51,
        "field": "status",
        "text": "订单状态",
        "type": "tag",
        "options": [
            {
                "text": "未生效",
                "id": 0
            },
            {
                "text": "生效",
                "id": 1
            }
        ]
    }, {// 机构
        "id": 52,
        "field": "agency",
        "text": "机构",
        "type": "search",
        "options": []
    }, {// 供稿人
        "id": 53,
        "field": "providerId",
        "text": "供稿人",
        "type": "search",
        "options": []
    }, {// 供应商搜索
        "id": 54,
        "field": "assetFamily",
        "text": "资源类型",
        "type": "tag",
        "options": [
            {
                "text": "编辑类",
                "id": 1
            }, {
                "text": "创意类",
                "id": 2
            }
        ]
    }, {// 推送人
        "id": 55,
        "field": "editUserId",
        "text": "推送人",
        "type": "search",
        "options": []
    }, {// 专题
        "id": 56,
        "field": "topicId",
        "text": "专题",
        "type": "search",
        "options": []
    }, {// 专题
        "id": 57,
        "field": "category_2",
        "text": "二级分类",
        "type": "tag",
        "options": []
    }, {// 专题
        "id": 58,
        "field": "category_3",
        "text": "三级分类",
        "type": "tag",
        "options": []
    }, {// 用户
        "id": 59,
        "field": "downloadUserId",
        "text": "用户",
        "width": 400,
        "type": "select",
        "options": []
    }, {// 用户
        "id": 60,
        "field": "isNative",
        "text": "所在区域",
        "type": "tag",
        "options": [{
            "text": "本土",
            "id": 1
        }, {
            "text": "海外",
            "id": 2
        }]
    }, {// 机构供稿人
        "id": 61,
        "field": "providerId",
        "text": "供稿人",
        "type": "transfer",
        syncOptions: {
            title: '供稿人',
            paramType: 3,
            resOptionsName: 'photographer',
        },
        "oftenOptions": [{
            "nameCn": "全部",
            "id": '-1'
        }]
    }
];



export default {
    list(...arg) {
        return Array.from([...arg]).map(id => filterArr.find(item => item.id == id))
    },
    get(id, list = filterArr, i) {
        if (i) {
            return list.find((item, index) => index == i)
        } else {
            return list.find(item => item.id == id)
        }
    },
    index(id, list = filterArr) {
        return list.findIndex(item => item.id == id)
    },
    remove(ids, list = filterArr) {
        ids.forEach(id => {
            const index = list.findIndex(item => item.id == id);
            if (index != -1) list.splice(index, 1)
        })
    },
    add(ids, index, list) {
        list.splice(index, 0, ...filterArr.filter(item => ids.indexOf(item.id) > -1));
    },
    replace(oldId, newId, list) {
        list[this.index(oldId, list)] = this.get(newId);
    },
    compare(data1, data2) {
        if (!data1 || !data2) {
            return false;
        }
        if (Array.isArray(data1)) {
            if (data1.length != data2.length) {
                return false;
            } else {
                return data1.every((item, index) => {
                    return JSON.stringify(item) == JSON.stringify(data2[index])
                })
            }
        } else if (typeof data1 === 'object') {
            return JSON.stringify(data1) == JSON.stringify(data2)
        } else {
            return data1 == data2
        }
    }
};
