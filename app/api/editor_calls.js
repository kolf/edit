import Api from "./api";
import { editorUrl } from "./api_config.js";

const dev = true;

export default {
    // 单张功能操作
    group(params, operate) {
        return Api.post({
            absolutePath: (editorUrl + '/group/'+operate),
            // projectName: 'zh',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 || res.status == 200) {
                    this.done(res.body || []);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 复制、拆分组
    copyOrMerge2Attach(params) {
        return Api.get({
            absolutePath: (editorUrl + "/group/copyOrMerge2Attach?" + Api.stringify(params)),
            // projectName: 'zh',
            // body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 || res.status == 200) {
                    this.done(res.body || []);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 查询常用专题
    queryTopic(params) {
        return Api.post({
            absolutePath: (editorUrl + "/favoriteTopic/pageList"),
            projectName: 'zh',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data || []);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 查询常用专题
    removeTopic(params) {
        return Api.get({
            absolutePath: (editorUrl + "/favoriteTopic/delete?" + Api.stringify(params)),
            projectName: 'zh',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data || []);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 获取用户信息
    getAllCategory(params) {
        return Api.post({
            absolutePath: (editorUrl + "/param/getAllCategory"),
            projectName: 'zh',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data || []);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 获取用户信息
    queryUserAccount(params) {
        return Api.post({
            absolutePath: (editorUrl + "/iDownRecord/findUsersByAccountId"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data || []);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 获取用户信息
    getUserInfo(params) {
        return Api.get({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/user/viewByToken?" + Api.stringify(params)),
            projectName: 'zh',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data?res.body.data:{});
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    // 筛选列表
    filterList(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/param/pageList?paramType=" + params.paramType),
            body: params.param,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    res.body.data.params = params;
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 筛选结果集
    storageSearch(params) {
        const url = params.superSearch ? '/search/pageList' : '/group/pageList';
        return Api.post({
            absolutePath: dev && (editorUrl + url),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'storageSearch',
            parse: function(res) {
                if (res.body.code == 200) {
                    // res.body.data.params = params;
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 下线结果集
    getOfflineData(params) {
        return Api.post({
            path: "/editor/nopass",
            absolutePath: dev && (editorUrl + "/image/noPass"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    res.body.data.params = params;
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 创意类筛选结果集
    createSearch(params) {
        return Api.post({
            path: "/create/list",
            // absolutePath: "http://192.168.3.178:8005"+ "/image/creativeList",
            absolutePath: dev && (editorUrl + "/image/creativeList"),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'createSearch',
            parse: function(res) {
                if (res.body.code == 200) {
                    res.body.data.params = params;
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 创意/待编审/设置图片通过、不通过
    setImagePublish(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/image/resoucePublish"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },
    // 创意/待编审/设置图片授权
    setImageLicenseType(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/image/setCollectionIdBatch"),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'setImageLicenseType',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },
    // 设置图片等级 编辑和创意共用
    setImageQualityLevel(params, edit = "image") {
        return Api.post({
            absolutePath: dev && (editorUrl + "/" + edit + "/setQualityLevel"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },
    // 创意/已上线/标记下线、确认下线、撤销标记下线
    setImageOfflineTag(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/image/onLineOffLine"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },
    // 查看图片exif信息
    viewImageExif(params) {
        return Api.get({
            absolutePath: dev && (editorUrl + "/image/viewExif?" + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'viewImageExif',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },
    // 双击查看图片详细信息
    viewImageDetail(params) {
        return Api.get({
            // absolutePath: "http://192.168.3.178:8005"  + "/image/viewCreativeDetail?" + Api.stringify(params),
            absolutePath: dev && (editorUrl + "/image/viewCreativeDetail?" + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'viewImageDetail',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 添加到待编审
    groupAddToTheEditor(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/group/removeFromNoEdit"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 添加到待编审
    groupAddToNoEditor(params) {
        return Api.post({
            path: "/group/addToNoEdit",
            absolutePath: dev && (editorUrl + "/group/addToNoEdit"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 编审数据
    getEditData(params) {
        const {
            type,
            operate,
            pageNum,
            pageSize,
            ids
        } = params;
        let api, operateType; // operateType: 1组新建 2组合并 3单组直接编辑  4组内拆分 5组内新建 6添加海外 8默认组推送
        if (operate == "new") operateType = 1;
        if (operate == "merge") operateType = 2;
        if (operate == "edit") operateType = 3;
        if (operate == "push") operateType = 8;
        if (operate == "editen") operateType = 3;

        // const ids = window.localStorage.getItem('id');
        // window.localStorage.removeItem('id');
        //if (isDraft) api = "startBoxEdit?groupId=" + ids;
        if (type == "group" || type == 'photos') {
            if (operateType == 4) {
                api = "thirdgroup/startEdit?groupIds=" + ids;
            } else {
                api = "startEdit?editType=" + operateType + "&groupId=" + ids + "&pageNum=" + pageNum + "&pageSize=" + pageSize;
            }
        }
        // if (type=="photos") api = "startEdit?editType=" + operateType + "&id=" + ids;
        return Api.get({
            path: "/edit/examine_test",
            absolutePath: dev && (editorUrl + "/group/" + api),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'getEditData',
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    /**
     * 设置图片署名 批量
     * @param {Array} params 设置署名参数对象数组
     */
    setCreditLine(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/group/setCreditLine"),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        });
    },

    /**
     * 设置组图时效
     * @param {Object} params 组图时效对象
     */
    setTimeliness(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/group/setTimeliness"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        });
    },

    // 查看原图、中图
    viewEditPic(params) {
        const url = params.type === 'origin' ? '/image/viewYuantu' : '/image/viewMidTu';
        return Api.get({
            absolutePath: dev && (editorUrl + url + '?resImageId=' + params.resImageId),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 发布
    editPostData(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/group/publish"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        });
    },

    //编审状态判断
    isEdit(params) {
        return Api.get({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/group/isCurrentEdit?groupIds=" + params.groupIds),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'isEdit',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 保存
    editSavePostData(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/group/save"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 图片、组照下线
    groupOffline(params) {
        const {id, resId, offlineReason} = params;

        return Api.post({
            absolutePath: dev && (editorUrl + (resId?'/image':'/group') + "/unOnline"),
            body: {
                [(resId?'imageId':'groupId')]: id+'',
                offlineReason
            },
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 图片、组照上线
    groupOnline(params) {
        const {id, resId} = params;

        return Api.post({
            absolutePath: dev && (editorUrl + (resId?'/image':'/group') + "/online"),
            body: {
                [(resId?'imageId':'groupId')]: id+''
            },
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },


    // 关键词查询
    getKeywordById(params, type) {
        const typeUrl = (type == 'creative' ? 'gc' : 'cfp');
        let body = {};
        body.data = params.data ? params.data.split(',').filter(item => item*1).join(',') : {}; //关键词非数字类型传给后端会报错
        return Api.post({
            path: "/person/index",
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + typeUrl + "/keyword/get/ids"),
            body,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'getKeywordById',
            parse: function(res) {
                if (res.body.ifSuccess) {
                    this.fail({
                        errorMessage: res.body.message
                    });
                } else {
                    this.done(res.body);
                }
            }
        });
    },

    // 查看关键词
    findKeyword(params) {
        const type = params.type == 'creative' ? 'gc' : 'cfp';
        delete params.type;
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + type + "/kw/find/batch"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.ifSuccess) {
                    this.fail({
                        errorMessage: res.body.message
                    });
                } else {
                    this.done(res.body);
                }
            }
        });
    },
    // {"name":"无人","kind":0}
    // 0：主题1：概念2：规格3：人物4：地点9：分类
    // 创意类有个规格

    //新增关键词
    addKeyword(params) {
        const type = params.type == 'creative' ? 'gc' : 'cfp';
        delete params.type;
        let _params = {
            "ensyno": [],
            "memo": "",
            "cnname": "",
            "cnsyno": [],
            "kind": "0",
            "enname": ""
        };
        Object.assign(_params, params);
        return Api.post({
            path: "/person/index",
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + type + "/keyword/add"),
            body: _params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.success) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 修改关键词
    modifyKeyword(params) {
        const type = params.type == 'creative' ? 'gc' : 'cfp';
        delete params.type;
        let _params = {
            "id": "",
            "ensyno": [],
            "memo": "",
            "cnname": "",
            "cnsyno": [],
            "kind": "0",
            "enname": ""
        };
        Object.assign(_params, params);
        return Api.post({
            path: "/person/index",
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + type + "/keyword/modify"),
            body: _params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.success) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 地点查询 编辑类
    findlocaltion(params) {
        // {"id":"123","pid":"456","type":"1","name":"中国"}
        Object.assign(_params, params);
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/proxy/post?url=location/find"),
            body: _params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.success) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 全部不通过
    allNoPass(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/group/allNoPass"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //编审记录 [groupId,type] method 传值表示图片 不传表示组图
    groupViewEditHistory(params, method) {
        return Api.post({
            absolutePath: dev && (editorUrl + (method ? "/editHistory/listByImageId?" : "/editHistory/list?") + Api.stringify(params)),
            // body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },


    //批注
    Postil(params) {
        return Api.post({
            path: "/edit/examine_test",
            absolutePath: dev && (editorUrl + "/postilHistory/create"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //获取批注数据
    getPostilData(params) {
        return Api.get({
            path: "/edit/examine_test",
            absolutePath: dev && (editorUrl + "/group/view?" + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //批注历史  [groupId,type]
    groupViewPostilHistory(params) {
        return Api.get({
            path: "/param/reviewRecordsList",
            absolutePath: dev && (editorUrl + "/postilHistory/list?" + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //获取草稿箱数据
    getDraftData(params) {
        return Api.get({
            path: "/person/draft",
            absolutePath: dev && (editorUrl + "/userBox/list?userId=" + params),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'getDraftData',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //草稿箱解除绑定
    postRelieveDraft(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + "/userBox/delete"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //我的消息列表
    getMyNewsList(params) {
        return Api.get({
            path: "/person/news",
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'getMyNewsList',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //删除我的消息
    postDeleteMyNews(params) {
        return Api.post({
            path: "/param/postdata",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    //发送我的消息
    postToMyNews(params) {
        return Api.post({
            path: "/param/postdata",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 个人中心数据
    getpersonalData(params) {
        return Api.post({
            path: "/person/index",
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'getpersonalData',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // 创意类发布
    postCreativeState(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + '/image/creativePublish'),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //创意类关键词保存
    keywordSave(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + '/image/saveKeywords'),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //创意类关键词审核界面发布
    keywordPublish(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: dev && (editorUrl + '/image/keywordPublish'),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //创意类肖像权/物权文件清单
    authFileSearch(params) {
        return Api.get({
            // path: "/create/authFileList",
            absolutePath: dev && (editorUrl + '/image/view?' + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'authFileSearch',
            parse: function(res) {
                if (res.body) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //创意类肖像权/物权文件关联图片清单
    authFileRelatedPicSearch(params) {
        return Api.get({
            // path: "/create/authFileList",
            absolutePath: dev && (editorUrl + '/image/viewOssId?' + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'authFileRelatedPicSearch',
            parse: function(res) {
                if (res.body) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //肖像权/物权文件确认
    authFilePass(params) {
        return Api.post({
            // path: "/create/authFileList",
            absolutePath: dev && (editorUrl + '/image/releaseconfirm'),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    providerPictureView(params) { // 供应商详情 图列表 resGroup:2,providerId:1
        return Api.post({
            absolutePath: dev && (editorUrl + '/group/pageList'),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 获取摄影师列表
    getProviderList(params) {
        return Api.get({
            path: "/provider/providerList",
            absolutePath: dev && (editorUrl + '/resouceUpload/searchProvicer?searchName=' + params.value),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 获取摄影师信息
    getProviderById(params) {
        return Api.post({
            path: "/provider/provider",
            // absolutePath: dev? editorUrl + '/image/creativePublish),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 提交上传信息
    postProviderData(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: 'http://test.edit.vcg.com:9900/photographer/upload',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 生成groupinfojson文件
    uploadProviderSubmit(params) {
        return Api.post({
            path: "/param/postdata",
            absolutePath: editorUrl + '/resouceUpload/uploadSubmit',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 下载getty图片
    pictureDown(params) {
        return Api.get({
            path: "/cloud/down",
            absolutePath: dev && editorUrl + '/resouceUpload/downloadGetyIds?gettyIds=' + params.gettyIds,
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

        //编审/组照groupId 查询专题列表
        topicQuery(params) {
            return Api.get({
                path: "/topic/list",
                absolutePath: dev && (editorUrl + "/group/getTopicsByGroupId?groupId=" + params.groupId),
                body: params,
                ignoreAuthFailure: true,
                cancelPendingRequests: true,
                apiCallName: 'topicQuery',
                parse: function(res) {
                    if(res.body.code == 200) {
                        this.done(res.body.data);
                    }else{
                        this.fail({ errorMessage: res.body.message });
                    }
                }
            });
        },

    //编审/组照 专题列表 删除 groupId topicId
    topicDelete(params) {
        return Api.get({
            path: "/topic/list",
            absolutePath: dev && (editorUrl + '/group/deleteTopicFromGroup?groupId=' + params.groupId + '&topicId=' + params.topicId),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //获取专题对应的产品
    getProductId(params) {
        return Api.get({
            path: "/edit/jointospeciallist",
            absolutePath: dev && (editorUrl + '/vcgCategoryTopicProduct/listByTopic?topicId=' + params),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //添加到专题 [groupId,topicId,productId]
    groupAddToTopic(params) {
        return Api.post({
            path: "/edit/jointospeciallist",
            absolutePath: dev && (editorUrl + '/group/joinTopic'),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //添加到海外
    groupAddToOverseas(params) {
        const body = {};
        for(let name in params){
            if(!/categorys|text/.test(name)){
                body[name] = params[name]
            }
        }

        return Api.post({
            path: "/group/add2Oversea",
            absolutePath: dev && (editorUrl + '/group/add2Oversea'),
            body,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //推送
    pushtoData(params) {
        return Api.get({
            path: "/edit/jointospeciallist",
            absolutePath: dev && (editorUrl + '/thirdgroup/startEdit?groupIds=' + params),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    //发布\推送
    publishPushto(params, publishType) {
        let url = '';
        if (publishType == 5 || publishType == 4 || publishType == 7 || publishType == 8) {
            url = '/group/publish';
        }
        if (publishType == 6) {
            url = '/group/push'
        }
        return Api.post({
            path: "/edit/jointospeciallist",
            absolutePath: dev && (editorUrl + url),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    invalid() {
        return Api.get({
            path: "/login/invalid",
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    topicsFilter() {
        return Api.get({
            path: "/param/filter",
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    topicsSearch(params) {
        return Api.post({
            path: "/topics/topicsList",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    res.body.data.params = params;
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    topicsAuto(params) {
        return Api.post({
            path: "/topics/topicsAuto",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    topicsView(params) {
        return Api.post({
            path: "/topics/topicsView",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    topicsDelete(params) {
        return Api.post({
            path: "/editor/editorMerge",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    topicsUpdate(params) {
        return Api.post({
            path: "/editor/editorMerge",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    storageEditStatus(params) {
        return Api.post({
            path: "/storage/editstatus",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    res.body.data.params = params;
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    searchRsList(params) {
        return Api.post({
            path: params.api,
            body: params.data,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }

            }
        });
    },

    // tag begin
    tagQuery(params) { // query [use]
        const type = params.type == "tagEditor" ? "cfp" : "gc";
        delete params.type;
        return Api.post({
            path: "/tag/query",
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + type + "/keyword/find/list"),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'tagQuery',
            parse: function(res) {
                if (res.body) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },

    tagSave(params) { // create edit [use]
        const flag = params.data.id ? "edit" : "create";
        const type = params.data.type == "tagEditor" ? "cfp" : "gc";
        let url = "";
        if (flag == "create") {
            url = type + "/keyword/add";
        }
        if (flag == "edit") {
            url = type + "/keyword/modify";
        }
        delete params.data.type;
        return Api.post({
            path: "/tag/save",
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + url),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.success) {
                    this.done(res.body);
                }
                if (!res.body.ifSuccess) {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        });
    },

    tagView(params) { // view id [not use]
        const type = params.type == "tagEditor" ? "cfp" : "gc";
        return Api.post({
            path: "/tag/view",
            absolutePath: editorUrl + "/proxy/post?url=" + type + "/keyword/get/id",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200 && res.body) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    tagViewAll(params) { // view id [not use]
        const type = params.type == "tagEditor" ? "cfp" : "gc";
        return Api.post({
            path: "/tag/view",
            absolutePath: editorUrl + "/proxy/post?url=" + type + "/keyword/find/like",
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200 && res.body) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    tagExpand(params) { // expand pid [not use]
        return Api.post({
            path: "/tag/expand",
            //absolutePath: tagURL + '/tag/expand',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    tagDelete(params) { // delete id [not use]
        return Api.post({
            absolutePath: dev && (editorUrl + "/proxy/post?url=" + params.type + "/keyword/delete"),
            body: {
                data: params.id
            },
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    tagAuditList(params) {
        return Api.post({
            path: "/tag/auditList",
            // absolutePath: dev && (editorUrl + "/proxy/post?url=" + type + "/keyword/delete"),
            absolutePath: 'http://localhost:3030/api/tag/auditList',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },
    pushQuery(params) { // query [use]
        return Api.post({
            absolutePath: dev && (editorUrl +'/group/pushRecordlist'),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'pushQuery',
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },
    pushView(params) { // query [use]
        return Api.post({
            absolutePath: dev && editorUrl + '/group/pushPreview',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },
    pushDetail(params) { // query [use]
        return Api.get({
            absolutePath: dev && editorUrl + '/group/pushlook?' + Api.stringify(params),
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },
    pushDelete(params) { // query [use]
        return Api.post({
            absolutePath: dev && editorUrl + '/group/pushDelete',
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },
    // editor end

    // common begin
    categoryQuery(params, projectName) { // query [use]
        return Api.get({
            path: "/tag/query",
            projectName,
            absolutePath: dev && (editorUrl + "/group/getChildCategory?parentId=" + params.parentId),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'categoryQuery',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    productQuery(params) { // query [use]
        return Api.get({
            path: "/tag/query",
            absolutePath: dev && (editorUrl + "/group/getProductionByCategoryIdAndProviderId?" + Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'productQuery',
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data ? res.body.data : []);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    regionQuery(params) { // query [use]
        return Api.get({
            path: "/tag/query",
            absolutePath: dev && (editorUrl + "/group/getChildLocations?id=" + params.parentId),
            body: params,
            ignoreAuthFailure: true,
            cancelPendingRequests: true,
            apiCallName: 'regionQuery',
            parse: function(res) {
                if (res.status == 200) {
                    this.done(res.body ? res.body : []);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    //存储key-value
    dataCache(params) {
        return Api.post({
            path: "/common/dataCache",
            absolutePath: dev && ( /*editorUrl*/ 'http://192.168.3.120:8005' + "/editCache/pushEdit"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    cachedData(params) {
        return Api.get({
            path: "/common/cachedData",
            absolutePath: dev && (editorUrl + "/editCache/popEdit?key=" + params.key),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    // common end

    // edit group begin
    groupCopyOrMerge(params) { // query [use]
        const body = {};
        for(let name in params){
            if(!/categorys|text/.test(name)){
                body[name] = params[name]
            }
        }

        return Api.get({
            path: "/tag/query",
            absolutePath: dev && (editorUrl + "/group/copyOrMerge?" + Api.stringify(body)),
            // body,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200) {
                    this.done(res.body ? res.body : []);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    photosNewOrAdd(params) { // query [use]
        const body = {};
        for(let name in params){
            if(!/categorys|text/.test(name)){
                body[name] = params[name]
            }
        }

        return Api.get({
            absolutePath: dev && (editorUrl + "/group/copyAddOrNew?" + Api.stringify(body)),
            // body,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200) {
                    this.done(res.body ? res.body : []);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    groupCreate(params) { // query [use]
        const body = {};
        for(let name in params){
            if(!/categorys|text/.test(name)){
                body[name] = params[name]
            }
        }

        return Api.get({
            absolutePath: dev && (editorUrl + "/group/createGroupWithImages?" + Api.stringify(body)),
            // body,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    photosSplitOrAdd(params) { // query [use]
        const body = {};
        for(let name in params){
            if(!/categorys|text/.test(name)){
                body[name] = params[name]
            }
        }
        return Api.get({
            path: "/tag/query",
            absolutePath: dev && (editorUrl + "/group/splitAddOrNew?" + Api.stringify(body)),
            // body,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.status == 200 && res.body.data) {
                    this.done(res.body);
                } else {
                    this.fail({
                        errorMessage: res.body.msg
                    });
                }
            }
        })
    },
    // edit group end

    // 创建用户订阅
    rssCreate(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/userSearch/create"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 查询用户订阅
    rssQuery(params) {
        return Api.get({
            absolutePath: dev && (editorUrl + "/userSearch/get?" + Api.stringify(params)),
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 删除用户订阅
    rssRemove(params) {
        return Api.get({
            absolutePath: dev && (editorUrl + "/userSearch/delete?" + Api.stringify(params)),
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 更新用户订阅
    rssUpdate(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/userSearch/update"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 抓取人物关健词
    findDiscTag(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/group/getFigureKW"),
            body: params,
            ignoreAuthFailure: true,
            parse: function(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    // 编辑类获取不通过原因列表
    queryReason(value) {
        return Api.get({
            absolutePath: dev && (editorUrl + "/reason/pageList?value=" + value),
            ignoreAuthFailure: true,
            // cancelPendingRequests: true, //不能加，因为需要同时请下线原因和不通过原因
            // apiCallName: 'queryReason',
            parse(res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({
                        errorMessage: res.body.message
                    });
                }
            }
        });
    },

    queryProvider (params) { // 供应商详情 providerId
        return Api.post({
            absolutePath: dev && (editorUrl + '/group/findProvider'),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({errorMessage: res.body.message});
                }
            }
        });
    },

    // favorite begin
    favoriteQuery (params) { // favorite query [use]
        return Api.get({
            absolutePath: dev && (editorUrl + "/favorite/list?api_token="+ localStorage.getItem("token") +'&'+ Api.stringify(params)),
            // absolutePath: dev && (editorUrl + "/favorite/list?api_token="+ localStorage.getItem("token") +'&'+ Api.stringify(params)),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    favoriteDelete (params) {  // favorite delete [use]
        const body = {
            favId: params.id,
            api_token: localStorage.getItem("token")
        };
        return Api.post({
            absolutePath: dev && (editorUrl + "/favorite/delete"),
            body,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    favoriteSave (params) { // favorite create save [use]
        params.api_token = localStorage.getItem("token");
        return Api.post({
            absolutePath: dev && (editorUrl  + "/favorite/create"),
            body: params,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    favoriteItemQuery (params) { // favorite item query [use]
        params.api_token = localStorage.getItem("token");
        return Api.post({
            absolutePath: dev && (editorUrl + "/favorite/viewPics"),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    favoriteItemDelete (params) { // favorite item delete [use]
        params.api_token = localStorage.getItem("token");
        return Api.post({
            absolutePath: dev && (editorUrl + "/favorite/deletePics"),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    favoriteItemAdd (params) { // favorite item delete [use]
        params.api_token = localStorage.getItem("token");
        return Api.post({
            absolutePath: dev && (editorUrl + "/favorite/addPics"),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },
    downloadCountQuery (params) { // query [use]
        return Api.post({
            absolutePath: dev && editorUrl + `/iDownRecord/getLastWeekDownRecord?pass=yes&pageNum=${params.pageNum}&pageSize=${params.pageSize}`,
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200 && res.body.data) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    setCollectionId(params){
        return Api.post({
            absolutePath: editorUrl + `/image/setCollectionId`,
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    listByResId(params){
        return Api.get({
            absolutePath: editorUrl + `/editHistory/listByImageId?imageId=${params.resId}`,
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    //专题模糊搜索下拉
    editJoinToSpecialList(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + '/group/getTopicByTitle'),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data?res.body.data:[]);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    queryAccont(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + '/iDownRecord/findAccount'),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    refreshImage(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + '/group/refresh'),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    oss176View(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + "/group/recommandImgUrl"),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    },

    removeEditPic(params) {
        return Api.post({
            absolutePath: dev && (editorUrl + '/group/removeResImageFromGroup'),
            body: params,
            ignoreAuthFailure: true,
            parse: function (res) {
                if (res.body.code == 200) {
                    this.done(res.body.data);
                } else {
                    this.fail({ errorMessage: res.body.message });
                }
            }
        });
    }
}
