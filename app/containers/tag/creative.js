import React, {Component} from "react";
import {connect} from "react-redux";
import EditModal from "app/components/edit/editModal";
import CrumbsBox from "app/components/common/crumbs";
import SearchBox from "app/components/searchBox/index";
import filterData from "app/components/searchBox/filterData";
import TagForm from "app/components/tag/form";
import {Modal, Table, Tooltip, Button, message, Pagination, Affix} from "antd";
import {tagQuery, tagSave, tagView, tagViewAll, tagExpand, tagDelete} from "app/action_creators/tag_action_creator";
import $ from "app/utils/dom";

const select = (state) => ({
    "tagDoing": state.tag.doing,
    "tagError": state.tag.error,
    "tagQueryData": state.tag.queryData,
    "tagSaveData": state.tag.saveData,
    "tagViewData": state.tag.viewData,
    "tagExpandData": state.tag.expandData,
    "tagDeleteData": state.tag.deleteData
});
@connect(select)
export default class TagCreativeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "/creative/tag", "text": "创意类：关键词管理"}
            ],
            "filterInit": {},
            "componentType": true,
            "dataFilter": filterData.list(22),
            "filterParams": {
                //"role": 1,  // role 1 销售 2 财务 3 运营
                //"pid": 0,
                "keywordType": 5,
                "name": "",
                "page": 1,
                "perpage": 60,
                "total": 0
            },
            "columns": [
                {
                    "title": "ID",
                    "dataIndex": "id",
                    "key": "id",
                    "width": 100
                },
                {
                    "title": "中文名",
                    "dataIndex": "cnname",
                    "key": "cnname",
                    "width": 200,
                    "sorter": (a, b) => (a.cnname.length - b.cnname.length)
                },
                {
                    "title": "中文同义词",
                    "dataIndex": "cnsyno",
                    "key": "cnsyno",
                    "width": 200,
                    "render": (text, record) => (text && text.join(';'))
                },
                {
                    "title": "英文名",
                    "dataIndex": "enname",
                    "key": "enname",
                    "width": 200,
                    "sorter": (a, b) => (a.enname.length - b.enname.length)
                },
                {
                    "title": "英文同义词",
                    "dataIndex": "ensyno",
                    "key": "ensyno",
                    "width": 200,
                    "render": (text, record) => (text && text.join(';'))
                },
                {
                    "title": "类型 ",
                    "dataIndex": "kind",
                    "key": "kind",
                    "width": 100,
                    "render": (id, record) => {
                        const kind = record.kind;
                        let text = "";
                        if (kind == 0) {
                            text = "主题";
                        }
                        if (kind == 1) {
                            text = "概念";
                        }
                        if (kind == 2) {
                            text = "规格";
                        }
                        if (kind == 3) {
                            text = "人物";
                        }
                        if (kind == 4) {
                            text = "地点";
                        }
                        return text;
                    }
                }, {
                    "title": "父ID",
                    "dataIndex": "pid",
                    "key": "pid",
                    "width": 100
                }, {
                    "title": "父关键词",
                    "dataIndex": "pidName",
                    "key": "pidName",
                    "width": 200
                },
                {
                    "title": "备注",
                    "dataIndex": "memo",
                    "key": "memo",
                    "width": 200
                },
                {
                    "title": "添加时间",
                    "dataIndex": "addtime",
                    "key": "addtime",
                    "width": 100,
                    "sorter": (a, b) => (a.addtime.length - b.addtime.length)
                },
                {
                    "title": "创建人",
                    "dataIndex": "creater",
                    "key": "creater",
                    "width": 100
                },
                 {
                    "title": "操作",
                    "key": "operation",
                    "width": 160,
                    "fixed": "right",
                    "render": (text, record) => (
                        <span>
                            <Button icon="edit" title="编辑" type="button" className={"ml-10"} onClick={this.editTag.bind(this,record)} />
                            <Button icon="delete" title="删除" type="button" className={"ml-10"} onClick={this.tagDelete.bind(this,record)} />
                        </span>
                    )
                }
            ],
            "dataSource": [],
            "loading": false,
            "modal": {
                "title": "",
                "visible": false,
                "confirmLoading": false,
                "onOk": this.onOk.bind(this),
                "onCancel": this.onCancel.bind(this),
                "okText": "确定",
                "cancelText": "取消",
                "body": ""
            },
            "alert": {},
            "doing": "doing"
        };
    };

    componentWillMount() {
        document.title= '关键词管理 - 创意类 - 内容管理系统 - VCG © 视觉中国';
    };

    openAlert(alert) {
        Object.assign(alert, {"maskClosable": false, "dragable": true});
        this.setState({alert, "doing": "openAlert"})
    };

    closeAlert() {
        this.setState({"doing": "closeAlert"});
    };

    alertHandle(alert){
        if (alert) {
            this.openAlert(alert);
        } else {
            this.closeAlert();
        }
    };

    render() {
        const self = this;
        const {componentType, crumbs, modal, filterInit, dataFilter, filterParams, columns, dataSource, loading, doing, alert} = this.state;

        const paginationInit = {
            "simple": true,
            "current": filterParams.page,
            "pageSize": filterParams.perpage,
            "total": filterParams.total,
            "showSizeChanger": true,
            "showQuickJumper": true,
            showTotal () {
                return '共 ' + filterParams.total + ' 条';
            },
            onShowSizeChange (current, pageSize) {
                self.refresh("pagination", {"page": current, "perpage": pageSize});
            },
            onChange (current) {
                self.refresh("pagination", {"page": current});
            }
        };
        return (
            <div className="main-content-inner">

                <Modal {...modal}><div style={{height:'420px',overflow:'auto'}}>{modal.body}</div></Modal>

                <EditModal doing={doing} alert={alert} updateData={this.updateData.bind(this)}/>

                <div className="page-content">
                    <SearchBox
                        modal= {this.alertHandle.bind(this)}
                        inputLeft = {445}
                        showRss={false}
                        showSearchBar
                        placeholder="请输入关键词词条或ID"
                        keywordTypes={[{label:'关健词(精确)', key:5},{label:'关健词(模糊)', key:6},{label:'ID', key:0}]}
                        hotSearchs={[]}
                        pageId={24}
                        filterInit={dataFilter.slice()}
                        dataFilter={dataFilter}
                        onSearch={this.handleOnSearch.bind(this) }
                        searchError={this.props.error}/>

                    <Affix className="row operate">
                        <div className="col-xs-4">
                            <Button type="button" onClick={this.addTag.bind(this,{})}>添加关键词</Button>
                            <Button type="button" onClick={this.refresh.bind(this)}>刷新</Button>
                        </div>
                        <div className="col-xs-8">
                            <div className="dataTables_paginate pull-right">
                                <Pagination {...paginationInit} />
                            </div>
                        </div>
                    </Affix>


                    <div className="row">
                        <div className="space-8"></div>
                    </div>
                    <Table columns={columns} dataSource={dataSource} loading={loading} pagination={paginationInit} size="small" scroll={{ x: 1500 }}/>

                </div>
            </div>
        );
    }

    queryList(params) {
        params.type = "tagCreative";
        const {dispatch} = this.props;
        this.setState({loading: true});
        dispatch(tagQuery(params)).then((result) => {
            if (result.apiError) {
                Modal.error({
                    title: '系统提示：',
                    content: (
                        <p>{JSON.stringify(result.apiError)}</p>
                    )
                });
                return false;
            }
            const {filterParams} = this.state;
            const dataSource = result.apiResponse.data;
            //console.log("dataSource==", dataSource)
            filterParams.total = result.apiResponse.total;
            this.setState({loading: false, "dataSource": dataSource, "filterParams": filterParams})
        });
    };

    updateData({doing, alert}) {
        if (doing) this.state.doing = doing;
        if (alert) this.state.alert = alert;
    };

    refresh(type, dataParams) {
        const {filterParams} = this.state;
        if (type == "pagination") { // pagination
            window.scrollTo(0, $.offset('.filter-container').height + 50);
            Object.assign(filterParams, dataParams);
        }
        if (type == "filter") { // filter
            Object.assign(filterParams, dataParams, {"pageNum": 1});
        }
        if (type == "pagination" || type == "filter") {
            this.setState({filterParams});
        }

	this.queryList(filterParams);

    };

    queryListById(params) {
        const {name} = params;//name 是 ID值
        const {dispatch} = this.props;
        this.setState({loading: true});
        params.type = "tagCreative";

        if (!name) {//ID查询未输入值时，不调用ID接口查询
            delete params.data;
            this.queryList(params);
            return;
        }
        params.data = name;
        dispatch(tagView(params)).then((result) => {
            //console.log("result==========", result);
            if (result.apiError) {
                Modal.error({
                    title: '系统提示：',
                    content: (
                        <p>{JSON.stringify(result.apiError)}</p>
                    )
                });
                return false;
            }
            let retData = result.apiResponse;
            const {filterParams} = this.state;
            let dataSource = [];
            if (retData.id) {
                dataSource.push(result.apiResponse);
            }

            //console.log("queryListById==", dataSource)
            filterParams.total = dataSource.length;
            this.setState({loading: false, "dataSource": dataSource, "filterParams": filterParams})
        });
    };

    queryListFindAll(params) {
        const {name} = params;//name 是 ID值
        const {dispatch} = this.props;
        const data = {name: name, type: "tagCreative"}
        this.setState({loading: true});
        params.type = "tagCreative";

        if (!name) {//ID查询未输入值时，不调用ID接口查询
            delete params.data;
            this.queryList(params);
            return;
        }
        dispatch(tagViewAll(data)).then((result) => {
            //console.log("result==========", result);
            if (result.apiError) {
                Modal.error({
                    title: '系统提示：',
                    content: (
                        <p>{JSON.stringify(result.apiError)}</p>
                    )
                });
                return false;
            }
            let retData = result.apiResponse;
            const {filterParams} = this.state;
            filterParams.total = retData.length;
            this.setState({loading: false, "dataSource": retData, "filterParams": filterParams})
        });
    };

    handleOnSearch(params, current, tags) {
        this.refresh("filter", params);
    };

    closeModal() {
        const modal = Object.assign(this.state.modal, {"visible": false, 'body': ''});
        this.setState({"modal": modal});
    };

    showChildrenNode(value) {
        alert(value)
    }

    openModal(config) {
        const modal = Object.assign(this.state.modal, {"visible": true}, config);
        this.setState({"modal": modal});
    };

    onOk() {
        this.closeModal();
    };

    onCancel() {
        this.closeModal();
    };

    onAddTag(params) {
        const {cnsyno, ensyno} = params;
        params.cnsyno = Array.isArray(cnsyno) ? cnsyno : cnsyno.split(',');
        params.ensyno = Array.isArray(ensyno) ? ensyno : ensyno.split(',');

        params.type = "tagCreative";

        const {dispatch} = this.props;
        dispatch(tagSave({"data": params})).then((result) => {
            if (result.apiError) {
                Modal.error({
                    title: '系统提示：',
                    content: (
                        <p>{JSON.stringify(result.apiError)}</p>
                    )
                });
                return false;
            }
            this.closeModal();
            this.refresh();
        });
    };

    addTag(record) {
        record.kind = 0;
        record.cnsyno = [];
        record.ensyno = [];
        record.type = "creative";
        this.openModal({
            "title": "添加关键词",
            "width": 800,
            "body": <TagForm onSubmit={this.onAddTag.bind(this) } initialValues={record} operateType="create"
                             moduleType="creative" />,
            "footer": null
        });
    };

    editTag(record) {
        record.type = "creative";
        this.openModal({
            "title": "编辑关键词",
            "width": 800,
            "body": <TagForm onSubmit={this.onAddTag.bind(this)} initialValues={record} operateType="edit"
                             moduleType="creative" />,
            "footer": null
        });
    };

    tagDelete(record) {
        const submit = () => {
            const {dispatch} = this.props;
            dispatch(tagDelete({type: 'gc', id: record.id})).then(res => {
                if (res.apiError) {
                    message.error(res.apiError.errorMessage);
                    this.closeAlert();
                    return;
                }

                message.success('删除关键词成功！');
                this.closeAlert();
                this.refresh();
            })
        }

        this.openAlert({
            "title": "删除关键词",
            "contentShow": "body",
            "body": <p className="alert alert-info text-center mt-15"><i className="ace-icon fa fa-hand-o-right bigger-120"></i> 确定删除关键词？</p>,
            "onOk": submit,
            "isFooter": true
        });
    };

    expandedRowRender(record) {
        const {dataSource} = this.state;
        //console.log(dataSource);
        //console.log(record);
    };

}
