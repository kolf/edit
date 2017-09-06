import React, {Component, PropTypes} from "react";

import {Tag, Button, Input} from 'antd';
import { OverlayTrigger, Tooltip } from "react-bootstrap/lib";

import TagRenderBox from "./TagRenderBox";

export default class TagAuditBox extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.creativeConfig = [
            {
                "title": "左旋转",
                "operate": "setLeftRotation",
                "icon": "rotate-left"
            }, {
                "title": "右旋转",
                "operate": "setRightRotation",
                "icon": "rotate-right"
            }, {
                "title": "收藏",
                "operate": "addToFavorite",
                "icon": "star"
            }, {
                "title": "查看原图",
                "operate": "origin",
                "icon": "picture-o"
            }, {
                "title": "查看中图",
                "operate": "middle",
                "icon": "file-image-o"
            }
        ];

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

        //console.log('TagAuditBox---',nextProps.keywordsArr,nextState.keywordsArr);
        //console.log('TagAuditBox---',nextProps.keywordsAuditArr,nextState.keywordsAuditArr);
        //console.log('TagAuditBox---',_.keys(nextProps.keywordsDic),_.keys(nextState.keywordsDic));
        //console.log('TagAuditBox-listDisplay', nextProps.listDisplay,nextState.listDisplay);

        //console.log(
        //    'i---',nextProps.i
        //);
        //
        //console.log(
        //    'keywordsDic---',!_.isEqual(_.keys(nextProps.keywordsDic),_.keys(nextState.keywordsDic))
        //);
        //
        //console.log(
        //    'keywordsArr---',!_.isEqual(nextProps.keywordsArr,nextState.keywordsArr)
        //);
        //
        //console.log(
        //    'keywordsAuditArr---',nextProps.keywordsAuditArr.length!=nextState.keywordsAuditArr.length
        //);
        //
        //console.log(
        //    'keywordsAuditArr2---',!_.isEqual(propsSource,stateSource)
        //);

        return (nextProps.id!=nextState.id)||
            (nextProps.title!=nextState.title)||
            (nextProps.rotate!=nextState.rotate)||
            (nextProps.onlineState!=nextState.onlineState)||
            (nextProps.imageState!=nextState.imageState)||
            (nextProps.listDisplay!=nextState.listDisplay)||
            (nextProps.selectStatus!=nextState.selectStatus)||
            (!_.isEqual(_.keys(nextProps.keywordsDic),_.keys(nextState.keywordsDic)))||
            (!_.isEqual(nextProps.keywordsArr,nextState.keywordsArr))||
            (nextProps.keywordsAuditArr.length!=nextState.keywordsAuditArr.length)||
            (!_.isEqual(propsSource,stateSource));
    };

    render() {
        const {
            i,
            id,
            lang,
            pageType,
            operate,
            listDisplay,
            resId,
            rotate,
            oss176,
            ossYuantu,
            title,
            onlineState,
            providerId,
            providerName,
            brandName,
            uploadTime,
            imageState,
            selectStatus,
            keywordsRejectReason,
            keywordsArr,
            keywordsAuditArr,
            keywordsDic,
            providerKeywords,
            providerAgentType,

            setSelectStatus,
            onLoadImgError,
            handleOnClick,
            imageClickHandle,
            dispatch,
            alertHandle,
            handleOnUpdateTags
        } = this.props;

        //console.log('id-----',id);

        this.state = {
            id,
            title,
            rotate,
            onlineState,
            listDisplay,
            imageState,
            selectStatus,
            keywordsArr,
            keywordsAuditArr,
            keywordsDic
        };

        const key = i;

        let onlineStateClass = "",onlineStateText=""; //  '1已上线2未上线3撤图4冻结 ',

        // 关键词待编审 ： 图片审核通过 自动上线的图
        // 关键词已编审 ： 自动上线的图 关键词发布 关键词不通过

        // 已编审显示发布按钮 待编审显示发布按钮和不通过按钮
        if(onlineState == 1){
            onlineStateClass = "text-success";
            onlineStateText = "已上线";
        }else if(imageState == 5){
            onlineStateClass = "text-danger";
            onlineStateText = keywordsRejectReason || '';
        }else{
            onlineStateText="未上线";
        }
        //console.log(i,'keywordsRejectReason',keywordsRejectReason,'onlineStateText',onlineStateText)
        //console.log('----TagAuditBox',key,keywordsDic);
        console.log('------------------',keywordsAuditArr);

        return (
            <div className="col-xlg-2 col-md-3 col-sm-4 col-xs-6">
                <div className={selectStatus ? "ant-card editCard ant-card-bordered selected" : "ant-card editCard ant-card-bordered " }><div className='ant-card-body'>
                {/* <div className={selectStatus ? "ant-card editCard ant-card-bordered selected" : "ant-card editCard ant-card-bordered " }><div className='ant-card-body'> */}
                    <div className="custom-image" onClick={setSelectStatus.bind(this,{ key }) } onDoubleClick={handleOnClick.bind(this,{ "operate": "origin", key, id, resId }) } data-key={key}>
                        <img alt="找不到图片" src={(ossYuantu&&oss176)?oss176:this.defaultImage} className={"imgRotate_" + rotate} onError={onLoadImgError.bind(this) } />
                        <div className="operate-card" onDoubleClick={e => { e.stopPropagation() } } onClick={e => { e.stopPropagation() } }>
                            {this.creativeConfig.map((item, _i) => {
                                const operateBar = (
                                    <i className={"fa fa-" + item.icon} onClick={handleOnClick.bind(this,{ "operate": item.operate, key, id, resId }) }></i>
                                );
                                return (<OverlayTrigger
                                    key={_i}
                                    overlay={<Tooltip id={'tooltip'+key+_i}>{item.title}</Tooltip>}
                                    placement="top"
                                    delayShow={150}
                                    delayHide={50}>{operateBar}</OverlayTrigger>);
                            }) }
                        </div>
                    </div>
                    <div className="custom-card">
                        <div className="row mb-10">
                            <div className="col-xs-6 sis"><a title={providerName} onClick={handleOnClick.bind(this,{ "operate": "viewProvider", key, "id": providerId, "type" : pageType }) }>{providerName ? providerName : "---" }</a></div>
                            <div className="col-xs-6 sis text-right"><span title={brandName}>{brandName}</span></div>
                        </div>
                        <div className="row mb-5">
                            {uploadTime || "0000-00-00 00:00:00"}
                        </div>
                        <div className="row mb-5">ID：<a onClick={imageClickHandle.bind(this,{"resImageId":id, key,"viewWhat":"imageDetailInfo"})}>{resId}</a></div>

                        <div className="row mb-10">
                            <Input value={title} style={{ "width":"100%"}} placeholder="请输入标题"
                                   onChange={ handleOnClick.bind(this,{ "operate": "title", key, id, resId }) }/>
                        </div>
                        {keywordsDic==null && <div className="row">关键词加载中...</div>}
                        {keywordsDic!=null && <TagRenderBox
                            i={key}
                            lang={lang}
                            type="creative"
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
                        />}
                        <hr/>
                        <div className="row mb-5 mt-10">
                            <div className="col-xs-12 text-nowrap">
                                <Button size="small" type="button" icon="to-top" title="上线" onClick={handleOnClick.bind(this,{operate: 'publish', key, id, resId })} style={{margin:"4px 4px 4px 0"}}></Button>
                                {imageState==4 && onlineState == 2 && <Button size="small" type="button" title="不通过" icon="close" onClick={handleOnClick.bind(this,{operate: 'setNotPass', key, id, resId })} style={{margin:"4px 4px 4px 0"}}></Button>}
                                {(imageState!=4 || onlineState != 2) && <Button size="small" type="button" icon="close" title="不通过" disabled onClick={handleOnClick.bind(this,{operate: 'setNotPass', key, id, resId })} style={{margin:"4px 4px 4px 0"}}></Button>}
                                <Button size="small" type="button" icon="file-text" title="编审记录" onClick={handleOnClick.bind(this,{operate: 'viewEditHistory', key, id, resId })} style={{margin:"4px 4px 4px 0"}}></Button>
                            </div>
                        </div>

                        {imageState==5 && keywordsRejectReason && <div className="reason-tip" title={keywordsRejectReason}>
                            <Tag color="#f50" title={'不通过原因：'+keywordsRejectReason}>{_.trunc(keywordsRejectReason,10)}</Tag>
                        </div>}

                        <div className="card-num">
                            <span className={onlineStateClass}>{i + 1}</span>
                        </div>

                        {/* <div className="card-num">
                            {!onlineStateText && <span className={onlineStateClass}>{key + 1}</span>}
                            {onlineStateText && <OverlayTrigger
                                overlay={<Tooltip id={"card_"+key}>{onlineStateText}</Tooltip>}
                                placement="top"
                                delayShow={150}
                                delayHide={50}><span className={onlineStateClass}>{key + 1}</span></OverlayTrigger>}
                        </div> */}
                    </div>
                </div></div>
            </div>
        );
    };

}
