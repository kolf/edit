import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {connect}          from "react-redux";
import ComboBox           from "app/components/provider/combobox";
import {editJoinToSpecialList, topicQuery, topicDelete} from "app/action_creators/edit_action_creator";
import {getProductId}     from "app/action_creators/provider_action_creator";
import {groupAddToTopic, queryTopic, removeTopic}  from "app/action_creators/editor_action_creator";
import localStorage  from "app/utils/localStorage";

import { Table, Icon, Spin, Button, message } from 'antd';

import "./css/addtoTopic.css";
// input:{}
// output: returnTopicId(id);

const select = (state) => ({

});
@connect(select)
export default class AddToTopic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            groupId: props.groupId,
            value: "",
            errorMsg: '',
            promoteList: [],
            loading: false,
            columns:[
                {
                    title: 'ID',
                    dataIndex: 'id',
                    key: 'topicsId',
                    width: 150
                }, {
                    title: '专题名',
                    dataIndex: 'title',
                    key: 'title'
                }, {
                    title: '操作',
                    key: 'operation',
                    width: 100,
                    render: (text, record) => (
                        <Button type="primary" size="small"
                                onClick={this.deleteTopic.bind(this,record)}>删除</Button>
                    )
                }
            ],
            dataSource:null,
            tempVal: ''
        };
    };

    componentWillMount() {
        this.topicRender();
        this.queryTopic();
    };

    componentWillReceiveProps(nextProps){
        //console.log(nextProps);

        const {groupId} = this.state;
        if(groupId.length!=nextProps.groupId.length){
            this.state.groupId = nextProps.groupId;
            this.topicRender()
        }else if(groupId.some(id => nextProps.groupId.indexOf(id)==-1)){
            this.state.groupId = nextProps.groupId;
            this.topicRender()
        }
    }

    topicRender () {
        const {dispatch} = this.props;
        const {groupId} = this.state;

        if(!groupId) return false;
        dispatch(topicQuery({groupId})).then(result => {
            //console.log(result);
            if (result.apiError) {
                this.setMessge(result.apiError.errorMessage);
                return false;
            }
            this.setState({"dataSource": result.apiResponse.list});
        });
    };

    queryTopic(){
        this.props.dispatch(queryTopic()).then(result => {
            if (result.apiError) {
                // this.setMessge(result.apiError.errorMessage);
                message.error('获取常用专题失败！');
                return false;
            }

            this.setState({"promoteList": result.apiResponse});
        });
    };

    removeTopic(id){
        this.props.dispatch(removeTopic({id})).then(result => {
            if (result.apiError) {
                // this.setMessge(result.apiError.errorMessage);
                message.error('删除常用专题失败！');
                return false;
            }

            this.queryTopic()
            // this.setState({"promoteList": result.apiResponse});
        });
    }

    render() {
        const {dispatch} = this.props;
        const {id,value, promoteList, columns, dataSource,errorMsg,loading} = this.state;
        return (
            <div id="addToTopic" className="addToTopic">
                <div className="row"><div className="col-xs-12">
                    <ComboBox
                        onChange={this.handleChange.bind(this) }
                        className="fl"
                        type="topicId"
                        defaultValue={value}
                        dispatch={dispatch}
                        placeholder="请选择常用专题或输入专题ID"
                        dispatchAct={editJoinToSpecialList}
                        handOnSelect={this.onSelect.bind(this) } />
                    <Button type="primary" className="fl ml-10" loading={loading} onClick={this.handleOnAddTopic.bind(this) }>确定</Button>
                    {errorMsg && <span className="orange pl-10" style={{ "lineHeight": "26px" }}><i className="ace-icon fa fa-hand-o-right"></i>{errorMsg}</span>}
                </div></div>
                <h6>常用专题</h6>
                <ul className="promoteList">
                    {(!promoteList || promoteList && promoteList.length==0) && <p className="text-center">暂无常用专题！</p>}
                    {promoteList && promoteList.length>0 && promoteList.map((item, i) => <li><span onClick={this.onSelect.bind(this, item.topicId, item.topicName)}>{item.topicName}</span> <i className="fa fa-times" title="移除" onClick={this.removeTopic.bind(this,item.id) }></i></li>)}
                </ul>
                {dataSource && dataSource.length>0 && <span>
                    <h6>已添加专题</h6>
                    <Table pagination={false} columns={columns} dataSource={dataSource} size="small" />
                </span>}
            </div>
        )
    };

    handleChange(value){
        //console.log(value);
        this.state.tempVal = value;
    }

    onSelect (value, option) {
        this.state.id = value || '';
        this.state.value = _.isString(option)? option:option.props.children;
        const {returnTopicId} = this.props;
        if(returnTopicId) returnTopicId(this.state.id);
        this.setState({"errorMsg":'', tempVal: '', id: this.state.id, value: this.state.value});
    };

    deleteTopic (record) {
        const {dispatch} = this.props;
        const {groupId} = this.state;

        dispatch(topicDelete({groupId,"topicId":record.id})).then(result => {
            if (result.apiError) {
                this.setMessge(result.apiError.errorMessage);
                return false;
            }

            message.success('删除加入专题成功！');
            this.topicRender();
        });
    };

    setMessge (error) {
        this.setState({"errorMsg":error});
    };

    handleOnAddTopic () {
        const {dispatch,handleOnAddTopic, release, closeAlert} = this.props;
        let {id,value,promoteList, tempVal, groupId} =  this.state;

        //console.log(tempVal);

        if(groupId) {
            if(tempVal){
                if(!isNaN(tempVal)){
                    this.setState({value: tempVal});
                    id = tempVal;
                }else{
                    this.setState({value: ''});
                    id = '';
                    this.setMessge("专题ID只能为数字");
                    return;
                }
            }

            if (_.trim(id)) {
                this.setState({loading: true});

                const param = {
                    groupId,
                    topicId: id*1
                };

                dispatch(groupAddToTopic(param)).then(result => {
                    if (result.apiError) {
                        message.error(result.apiError.errorMessage);
                        this.setState({loading: false, value: undefined, id: '', tempVal: ''});
                        return false;
                    }
                    // const {id, title} = result.apiResponse.currentTopic || {};
                    // if(id && title && promoteList.map(item => item.value).indexOf(id)==-1){
                    //     if(promoteList.length>=10) promoteList.length=9;
                    //     promoteList.unshift({
                    //         label: title +' ('+id+')',
                    //         value: id
                    //     });
                    // }
                    //
                    // localStorage.set('promoteList', JSON.stringify(promoteList));

                    this.setState({loading: false, value: undefined, id: '', tempVal: ''});

                    this.queryTopic();
                    this.topicRender();

                    if(release){
                        release({publishType: 5, topicId: id});
                        // this.setState({value: undefined, id: '', tempVal: ''});
                        // closeAlert && closeAlert()
                        // if(closeAlert){
                        //     setTimeout(() => {
                        //         closeAlert()
                        //     }, 300)
                        // }
                    }else{
                        message.success('加入专题成功！');
                    }
                });

            } else {
                this.setMessge("请选择常用专题或输入专题ID。");
            }
        }else{
            if (id) {
                if(handleOnAddTopic) handleOnAddTopic({id,value});
                this.props.closeAlert();
            }else {
                this.setMessge("请选择常用专题或输入专题ID。");
            }
        }

    };
}
