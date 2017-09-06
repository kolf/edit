import React, {Component} from "react";
import {connect} from "react-redux";
import {message, Icon, Tooltip, Popconfirm, Button, Affix} from "antd";
import {str2json, searchs2title, splitVal} from "./utils";
import filterData from "./filterData";
import {rssCreate, rssQuery, rssUpdate, rssRemove} from "app/action_creators/search_action_creator";
import cs from 'classnames';
import storage from "app/utils/localStorage";

const maxWidth = (size) => {
    let result = ''
    if(size<=5){
        result = '20%'
    }else if(size<=10){
        result = '10%'
    }else if(size<=14){
        result = '7%'
    }else{
        result = '5%'
    }
    return result
}

class rssBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '',
            data: [],
            alert: {}
        };
    }

    componentWillMount() {
        //console.log('-----------');
        this.query()
    }

    componentWillReceiveProps(nextProps) {
        //console.log('nextProps-----------', nextProps);
    }

    openAlert(config) {
        const {modal} = this.props;
        const alert = Object.assign(this.state.alert,{
            "show": true,
            "isLoading": false,
            "contentShow": "body",
            "params": {},
            "maskClosable": false,
            "dragable" : true
        }, config);

        modal(alert);
    };

    closeAlert() {
        this.props.modal();
    };

    create() {
        const {dispatch, pageType, searchs, modal, dataFilter} = this.props;
        let {data} = this.state;

        if (data.length >= 20) {
            message.error('每个页面最多只可以订阅20条标签哦！');
            return false;
        }

        if(!hasVla()){
            message.error('请至少选择一个筛选项');
            return false;
        };

        for(let name in searchs){
            if(!searchs[name] || !splitVal(searchs[name]).value){
                delete searchs[name]
            }
        }

        searchs.collectionId = '';
        if(searchs.agency){
            const agencyIndex = filterData.index('3', dataFilter),collectioArr = [], agencyArr = [];
            const {value, label, key} = splitVal(searchs.agency);

            // //console.log(dataFilter);
            // //console.log(agencyIndex);

            if(agencyIndex!=-1 && dataFilter[agencyIndex].options.filter(item => item.id!=-1).length>0){
                dataFilter[agencyIndex].options.forEach(option => {
                    if(value.split(',').indexOf(option.id+'')!=-1){
                        if(option.agencyType == 0){
                            agencyArr.push(`${key}|${option.text}|${option.id}`)
                        }else if(option.agencyType == 1){
                            collectioArr.push(`${key}|${option.text}|${option.id}`)
                        }
                    }
                });

                searchs.collectionId = collectioArr;
                searchs.agency = agencyArr;
            }

        }

        const rssName = searchs2title(searchs);

        this.openAlert({
            "title": "添加订阅",
            "contentShow": "createRss",
            "params": {
                rssName
            },
            onOk: () => {
                const {alert} = this.state;
                const {rssName} = alert.params;
                if (!rssName) {
                    alert.params.submitMsg = "请输入订阅名称";
                    this.setState({alert});
                    return false;
                };

                // alert.confirmLoading = true;
                this.setState({alert});

                dispatch(rssCreate({
                    name: rssName,
                    type: pageType,
                    searchs: JSON.stringify(searchs)
                })).then((result) => {
                    if (result.apiError) {
                        message.error(result.apiError.errorMessage);
                        return false
                    }
                    this.query(result.apiResponse.id, 'create');
                    modal();
                });
            },
            "isFooter": true
        });

        function hasVla() {
            return Object.values(searchs).some(item => !!item)
        }
    }

    query(id, type) {
        const {dispatch, pageType, onClick, query, onRss} = this.props;
        let {activeKey} = this.state;
        let data = [];

        dispatch(rssQuery({
            type: pageType
        })).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                return false
            }

            data = result.apiResponse;
            onRss && onRss(data)
            // const

            if (result.apiResponse.length) {
                if(!id || (activeKey == id)){ // 第一次初始化请求和删除当前的订阅
                    const rssId = storage.get(`rssId_${pageType}`) || '';
                    let index = data.findIndex(item => item.id == rssId);
                    if(index == -1) index = 0;
                    if(activeKey == id) storage.remove(`rssId_${pageType}`);

                    activeKey = data[index].id;
                    onClick(str2json(data[index].searchs));
                }else if(type == 'create'){
                    activeKey = id;
                    onClick({});
                }

                this.setState({
                    activeKey,
                    data
                });
            } else {
                this.setState({
                    data,
                    activeKey: ''
                });
                onClick({});
            }
        });
    }

    remove(id) {
        const {dispatch, pageType} = this.props;

        dispatch(rssRemove({
            id: id,
            type: pageType
        })).then((result) => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                return false
            }

            this.closeAlert();
            this.query(id, 'remove');
        });
    }

    handleClick(searchs, id) {
        const {onClick, active, pageType} = this.props;
        let {activeKey} = this.state;

        //console.log(searchs);

        if(activeKey == id && active) {
            activeKey = '';
            for(let name in searchs){
                if(searchs[name]){
                    searchs[name] = ''
                }
            }
        }else{
            activeKey = id
        }

        this.setState({
            activeKey
        });

        storage.set(`rssId_${pageType}`, id);

        onClick(searchs);
    }

    confirmRemove(id){
        const _this = this;

        this.openAlert({
            "title": "删除订阅",
            "contentShow": "body",
            "body": <p className="alert alert-info text-center mt-15"><i className="ace-icon fa fa-hand-o-right bigger-120"></i>确定删除此订阅？</p>,
            "onOk": _this.remove.bind(_this, id),
            "isFooter": true
        });
    };

    render() {
        const {data, activeKey} = this.state;
        const {active, show} = this.props;

        return (
            <div className={cs('rss-bar', {'hide': !show})}>
                {/* <span className="to-title"><Icon type="tags"/>我的订阅：</span> */}
                <Affix>
                    <div className="to-list">
                    {data.length ? data.map(item => {
                        const searchs = str2json(item.searchs);
                        const title = searchs2title(searchs);
                        return <div className="to-list-item"
                                    style={{'backgroundColor': (item.id == activeKey && active)?'#2db7f5':'#ccc', 'maxWidth': maxWidth(data.length)}}>
                            <Tooltip placement="bottomLeft" title={title}><span onClick={this.handleClick.bind(this, searchs, item.id)}>{item.name || title}</span></Tooltip>
                            <Icon type="close" onClick={this.confirmRemove.bind(this, item.id)}/>
                        </div>
                    }) : <span style={{position: 'relative',top:4}}></span>}
                    </div>
                </Affix>
                <Button type="primary" className="create-rss-btn" size="small" onClick={this.create.bind(this)}>订阅</Button>
            </div>
        )
    }
}

export default connect()(rssBar);
