import React, {Component, PropTypes} from "react";
import moment             from "moment";
import cs from 'classnames';

import SelectArea from 'app/components/common/SelectArea'

import {Card, DatePicker, Input, Popover, Tooltip} from 'antd';
import {getStrLength, isEn}  from 'app/utils/utils';

import TagRenderBox from "./TagRenderBox";

export default class EditStepTwoBox extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.defaultImage = require('app/assets/default.jpg');
    };

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextProps',nextProps);
        //console.log('nextState',nextState);

        let propsSource = [],stateSource=[];
        if(nextProps.keywordsAuditArr.length==nextState.keywordsAuditArr.length) {
            nextProps.keywordsAuditArr.map(item=>{
                propsSource.push(item.source);
            });
            nextState.keywordsAuditArr.map(item=>{
                stateSource.push(item.source);
            });
        }

        return (!_.isEqual(nextProps.id,nextState.id))||
            (!_.isEqual(nextProps.hide,nextState.hide)) ||
            (!_.isEqual(nextProps.dateCameraShot,nextState.dateCameraShot))||
            (!_.isEqual(nextProps.caption,nextState.caption))||
            (!_.isEqual(nextProps.providerCaption,nextState.providerCaption))||
            (!_.isEqual(nextProps.listDisplay,nextState.listDisplay))||
            (!_.isEqual(nextProps.selectStatus,nextState.selectStatus))||
            (!_.isEqual(_.keys(nextProps.keywordsDic),_.keys(nextState.keywordsDic)))||
            (!_.isEqual(nextProps.keywordsArr,nextState.keywordsArr))||
            (nextProps.keywordsAuditArr.length!=nextState.keywordsAuditArr.length)||
            (!_.isEqual(propsSource,stateSource))||
            (JSON.stringify(nextProps.region)!=JSON.stringify(nextState.region));
    };

    render() {
        const {
            i,
            id,
            lang,
            hide,
            operate,
            listDisplay,
            rotate,
            oss176,
            oss400,
            ossYuantu,
            resId,
            region,
            dateCameraShot,
            providerCaption,
            caption,
            selectStatus,
            keywordsArr,
            keywordsAuditArr,
            keywordsDic,
            providerKeywords,
            providerAgentType,
            setSelectStatus,
            imageClickHandle,
            onLoadImgError,
            handleOnClick,
            dispatch,
            alertHandle,
            handleOnUpdateTags,
            closeModal
        } = this.props;

        this.state = {
            id,
            listDisplay,
            dateCameraShot,
            region,
            caption,
            providerCaption,
            selectStatus,
            keywordsArr,
            keywordsAuditArr,
            keywordsDic,
            hide,
            'refreshTimer': null
        };

        const key = i;

        let onlineStateClass = "", onlineStateText="";
        const providerCaptionError = operate == 'push' && getStrLength(providerCaption) > 200 && !hide && !caption;
        const captionError = operate == 'push' && getStrLength(caption) > 200;

        // console.log(oss400)
        
        // TODO: 弹窗显示内容
        const content = (
          <div style={{width: '400px'}}><img src={(ossYuantu&&oss400)?oss400:this.defaultImage} onError={onLoadImgError.bind(this) } /></div>
        );

        console.log(keywordsAuditArr)

        return (
            <div className={hide?"col-xlg-2 col-md-3 col-sm-4 col-xs-6 hide":"col-xlg-2 col-md-3 col-sm-4 col-xs-6"}>
                <div className={selectStatus ? "ant-card editCard ant-card-bordered selected" : "ant-card editCard ant-card-bordered " }><div className='ant-card-body'>
                    <div className="custom-image"
                         onClick={setSelectStatus.bind(this,{ key }) } onDoubleClick={() => handleOnClick({ "operate": "origin", "key": i, id })} data-key={i} >
                        <div className={rotate && rotate !== 0 ? "rotate" : "hide"}>{rotate + "°"}</div>
                        <Popover placement="rightTop" content={content} title={'查看中图: ID-'+resId} trigger="hover" mouseEnterDelay="1">
                            <img className={"imgRotate_" + rotate} src={(ossYuantu&&oss176)?oss176:this.defaultImage} onError={onLoadImgError.bind(this) } />
                        </Popover>
                    </div>
                    <div className="custom-card">
                        <div className="row mb-10">
                          <div className="pull-left">
                            ID： <a onClick={imageClickHandle.bind(this,{"resImageId":id, key, "viewWhat":"imageDetailInfo"})}>{resId}</a>
                          </div>
                          <div className="pull-right font-weight-bold">
                            <span className={onlineStateClass} title={onlineStateText}>{key + 1}</span>
                          </div>
                        </div>
                        <div className="row mb-10">
                            <DatePicker
                                style={{ width: "100%" }}
                                placeholder="请选择拍摄时间"
                                value={dateCameraShot?moment(dateCameraShot, 'YYYY-MM-DD'):""}
                                disabled={operate=="view"}
                                onChange={(date, value)=>{ handleOnClick({ operate: "dateCameraShot", key, id, resId, date, value }) } } />
                        </div>
                        <div className="row mb-10">
                            <SelectArea
                                onChange = {
                                    (value) => handleOnClick({operate: 'region', key, id, resId, value})
                                }
                                value={region}
                                style={{ width: "100%" }}
                                disabled={operate=="view"} />
                        </div>
                        {(isEn() && operate == 'push') && <div>
                            <div className="row mb-10">
                                <Input
                                    disabled={operate=="view"}
                                    placeholder="Location"
                                    onChange={ handleOnClick.bind(this,{ operate: "ed", key, id, resId }) }/>
                            </div>
                            <div className="row mb-10">
                                <Select placeholder="Country Code" style={{width: '100%'}}>{['1', '2'].map(item => <Option value={item}>{item}</Option>)}</Select>
                            </div>
                            <div className="row mb-10">
                                <Select placeholder="Byline TItle" style={{width: '100%'}}>{['Byline Title', 'Contributor', 'Stringer', 'Staff', 'Handout'].map(item => <Option value={item}>{item}</Option>)}</Select>
                            </div>
                        </div>}
                        <div className={cs('row mb-10', {'has-error': providerCaptionError})}>
                            <Tooltip visible={providerCaptionError} placement="topLeft" title={'原始图说不能超过200个字'}>
                                <Input
                                value={providerCaption}
                                disabled={operate=="view"}
                                placeholder="请输入原始图说"
                                type="textarea"
                                autoComplete="off"
                                rows="5"
                                className="people-tag tag"
                                onChange={ handleOnClick.bind(this,{ operate: "providerCaption", key, id, resId }) }/>
                            </Tooltip>
                        </div>
                        <div className={cs('row mb-10', {'has-error': captionError})}>
                            <Tooltip visible={captionError} placement="topLeft" title={'新加图说不能超过200个字'}>
                                <Input
                                    value={caption}
                                    disabled={operate=="view"}
                                    placeholder="请输入新加图说"
                                    type="textarea"
                                    autoComplete="off"
                                    rows="5"
                                    className="people-tag tag"
                                    onChange={ handleOnClick.bind(this,{ operate: "caption", key, id, resId }) }/>
                            </Tooltip>
                        </div>
                        <TagRenderBox
                            i={key}
                            lang={lang}
                            type='edit'
                            listDisplay={listDisplay}
                            disabled={operate=='view'}
                            keywordsArr={keywordsArr}
                            keywordsAuditArr={keywordsAuditArr}
                            keywordsDic={keywordsDic}
                            providerKeywords={providerKeywords}
                            providerAgentType={providerAgentType}
                            dispatch={dispatch}
                            alertHandle={alertHandle}
                            handleOnUpdateTags={handleOnUpdateTags}
                        />
                        <hr/>

                    </div>
                </div></div>
            </div>
        );
    };

}
