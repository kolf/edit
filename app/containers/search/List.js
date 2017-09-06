import React, {Component} from "react";
import {connect} from "react-redux";
import {
    Form,
    Input,
    Button,
    Select,
    message,
    Spin,
    Radio,
    Tabs
} from 'antd';
import EditorBase from "app/containers/editor/editorBase";
import storage from 'app/utils/localStorage';
import {isEmptyObj, queryUrl


} from 'app/utils/utils';

import './style.scss';

const FormItem = Form.Item;
const CreateForm = Form.create;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

const defaultParams = {
    pageNum: 1,
    pageSize: 60,
    assetFamily: 1,
    superSearch: 1,
    desc: 1
}

const toParam = (params) => {
    ['providerId', 'agency'].forEach(key => {
        console.log(params[key])
        params[key] = params[key] ? params[key].match(/\d+/g).toString() : ''
    })

    if(params.providerAgentType == 1){
        params.providerId = ''
    }else if(params.providerAgentType == 2){
        params.agency = ''
    }

    if(params.resGroup == '1'){
        ['qualityRank', 'orientation', 'picSize'].forEach(key => {
            params[key] = ''
        });

        params.searchScope = params.groupScope
    }else{
        params.searchScope = params.imageScope
    }

    delete params.groupScope;
    delete params.imageScope;
}

const id = window.location.href.match(/\/(\d+)/)[1] || '';
const params = id ? JSON.parse(storage.get(id) || '{}') : {};
let errorMsg = isEmptyObj(params) ? '没有找到你要的结果！' : '';
if(!errorMsg){
    toParam(params);
}

const resName = params.resGroup == 2 ? '单张' : '组照';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParam: {
                dataFilter: [],
                filterParams: Object.assign({}, defaultParams, params)
            }
        }
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {}

    render() {
        const {searchParam} = this.state;
        // //console.log(params)

        return (
            <div className="main">
                <Tabs type="card">
                    <TabPane tab={'高级搜索结果页 （'+resName+'）'} key="1">
                        {(params.resId || params.groupId || params.keywordAnd || params.keywordNot || params.keywordOr) && <div className="search-list">
                            {(params.resId || params.groupId) && <div className="search-item search-item-text">
                                <div className="search-label">搜索ID:</div>
                                {params.groupId && <div className="ant-row ant-form-item">
                                    <div className="ant-col-4 ant-form-item-label">组照 ID</div>
                                    <div className="ant-col-20"><div className="ant-form-item-control">
                                        {params.groupId}
                                    </div></div>
                                </div>}
                                {params.resId && <div className="ant-row ant-form-item">
                                    <div className="ant-col-4 ant-form-item-label">单张 ID</div>
                                    <div className="ant-col-20"><div className="ant-form-item-control">
                                        {params.resId}
                                    </div></div>
                                </div>}
                            </div>}
                            {(params.keywordAnd || params.keywordNot || params.keywordOr) && <div className="search-item search-item-text">
                                <div className="search-label">搜索结果:</div>
                                {params.keywordAnd && <div className="ant-row ant-form-item">
                                    <div className="ant-col-4 ant-form-item-label">包含全部关键词</div>
                                    <div className="ant-col-20"><div className="ant-form-item-control">
                                        {params.keywordAnd}
                                    </div></div>
                                </div>}
                                {params.keywordNot && <div className="ant-row ant-form-item">
                                    <div className="ant-col-4 ant-form-item-label">不包含关键词</div>
                                    <div className="ant-col-20"><div className="ant-form-item-control">
                                        {params.keywordNot}
                                    </div></div>
                                </div>}
                                {params.keywordOr && <div className="ant-row ant-form-item">
                                    <div className="ant-col-4 ant-form-item-label">包含任意一个关键词</div>
                                    <div className="ant-col-20"><div className="ant-form-item-control">
                                        {params.keywordOr}
                                    </div></div>
                                </div>}
                            </div>}
                        </div>}
                        {!errorMsg && <EditorBase
                            filterParamsInit={searchParam}
                            showSearchBar={false}
                            pageId={30}
                            pageType={"editorStorage"}/>}
                        {errorMsg && <div className="error-box">{errorMsg}</div>}
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}

export default connect()(CreateForm()(SearchResult));
