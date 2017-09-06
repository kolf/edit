import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import Input  from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Upload from "antd/lib/upload";
import { OverlayTrigger, Tooltip } from "react-bootstrap/lib";
import cs from 'classnames';

import {isElite, isEn} from "app/utils/utils";

const getPriceName = (price) => {
    const priceMap = {
        3: '500元',
        4: '1000元',
        5: '1500元',
        9: '无'
    }

    return priceMap[price] || price
}

@connect((state) => ({
    "error": state.edit.error,
    "reasonData": state.edit.reasonData
}))
export default class EditStepOneBox extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.editConfig = [
            {
                "title": "置顶",
                "operate": "setTop",
                "icon": "arrow-up"
            },
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
                "title": "下载",
                "operate": "download",
                "icon": "cloud-download"
            },
            {
                "title": "替换",
                "operate": "upload",
                "icon": "cloud-upload"
            }, {
                "title": "查看原图",
                "operate": "origin",
                "icon": "picture-o"
            }, {
                "title": "查看中图",
                "operate": "middle",
                "icon": "file-image-o"
            }, {
                "title": "时效限价",
                "operate": "selectPrice",
                "icon": "dollar"
            }, {
                "title": "下线",
                "operate": "offlineMark",
                "icon": "arrow-down"
            }, {
                "title": "移除",
                "operate": "remove",
                "icon": "times"
            }
        ];

        this.qualityRankItem = ['A', 'B', 'C', 'D', 'E'];

        this.defaultImage = require('app/assets/default.jpg');
    };

    shouldComponentUpdate(nextProps, nextState) {
        //console.log('nextProps',nextProps);
        //console.log('nextState',nextState);

        return (nextProps.id!=nextState.id)||
            (nextProps.i!=nextState.key)||
            (nextProps.sortNumber!=nextState.sortNumber)||
            (nextProps.price!=nextState.price)||
            (nextProps.minPrice!=nextState.minPrice)||
            (nextProps.rotate!=nextState.rotate)||
            (nextProps.oss176!=nextState.oss176)||
            (!_.isEqual(_.keys(nextProps.keywordsDic),_.keys(nextState.keywordsDic)))||
            (nextProps.onlineState!=nextState.onlineState)||
            (nextProps.imageState!=nextState.imageState)||
            (nextProps.showCaption!=nextState.showCaption)||
            (nextProps.hide!=nextState.hide)||
            (nextProps.selectStatus!=nextState.selectStatus)||
            (nextProps.qualityRank!=nextState.qualityRank)||
            (nextProps.offlineReason!=nextState.offlineReason)||
            (nextProps.creditLine!=nextState.creditLine);
    };

    getReasonData() {
        const {reasonData} = this.props;
        let reasonList = [];
        [...reasonData].map(item=>{
            reasonList.push({...item});
        });
        return reasonList;
    };

    render() {
        const {
            i,
            id,
            lang,
            operate,
            pushedOrganizations,
            showCaption,
            selectStatus,
            resId,
            rotate,
            oss176,
            ossYuantu,
            price,
            uploadProps,
            qualityRank,
            offlineReason,
            onlineState,
            providerName,
            collectionName,
            providerAgentType,
            creditLine,
            providerCaption,
            memo,
            saveTemp,
            onlineType,
            imageState,
            imageRejectReason,
            hide,
            category,
            keywordsDic,
            setSelectStatus,
            onLoadImgError,
            handleOnClick,
            imageClickHandle,
            sortNumber,
            minPrice
        } = this.props;

        this.state = {
            id,
            price,
            rotate,
            oss176,
            keywordsDic,
            showCaption,
            hide,
            onlineState,
            imageState,
            selectStatus,
            qualityRank,
            creditLine,
            sortNumber,
            offlineReason,
            key: i
        };

        const {key} = this.state;

        const reasonList = this.getReasonData();

        let onlineStateClass = "",onlineStateText="",categoryLabel=[]; //  '1已上线2未上线3撤图4冻结 ',
        if(onlineState==1) {
            onlineStateClass="text-success";
            onlineStateText="已上线";
        }else if(onlineState == 3) {
            onlineStateClass="text-danger";
            onlineStateText="已下线";
        }else if(onlineState == 2) {
            onlineStateText="未上线";
            onlineStateClass=''
        }

        // if(onlineType ==2 && imageState == 1) {
        //     onlineStateClass="text-success";
        //     onlineStateText="已上线";
        // }else

        if(qualityRank == 5){
            onlineStateClass="text-danger";
            const rejectObj = reasonList.find(item => item.value==imageRejectReason);
            onlineStateText = rejectObj ? ('不通过-' + rejectObj.label) : '不通过';
        }

        if(!onlineStateText && qualityRank==5) {
            onlineStateText='未上线';
            onlineStateClass=''
        }

        if(offlineReason){
            onlineStateClass="text-danger";
            const offlineObj = reasonList.find(item => item.value==offlineReason);
            offlineObj && (onlineStateText = '已下线-' + offlineObj.label);
        }

        if(category&&!_.isEmpty(keywordsDic)) {
            [...category.split(',')].forEach((id)=>{
                const oneKeyword =keywordsDic[id];

                if(oneKeyword && (isEn() || oneKeyword.pid == 0)){
                    categoryLabel.push(oneKeyword[lang])
                }
            });
        }

        const getOneCategoryName = (name) => {
            if(lang === 'enname'){
                return name
            }else{
                return name.indexOf('国际')!=-1 ? "际" : name.substring(0,1)
            }
        };

        let qualityRankHtml=[];
        this.qualityRankItem.forEach((item, index) => {
            const className = parseInt(qualityRank||0)==(index+1)?'ant-radio text-danger em':'ant-radio';
            qualityRankHtml.push(<span key={'qualityRank'+'_'+key+'_'+index} className={className} onClick={operate!='push'?handleOnClick.bind(this,{ "operate": "qualityRank", key, id, resId, value: (index+1) }) : null}>{item}</span>);
        });

        // console.log(price)

        return (
            <div className={hide?'col-xlg-2 col-md-3 col-sm-4 col-xs-6 edit hide':'col-xlg-2 col-md-3 col-sm-4 col-xs-6 edit'} style={{height: showCaption ? 523 : 418}}>
                < div className = {
                    cs('ant-card editCard ant-card-bordered full-height', {
                        'selected': selectStatus,
                        'img-mark': offlineReason >= 9998
                    })
                } > <div className='ant-card-body'>
                    <div className="custom-image" onClick={setSelectStatus.bind(this,{ key }) } onDoubleClick={handleOnClick.bind(this,{ "operate": "origin", key, id, resId }) } data-key={key}>
                        <div className={rotate && rotate !== 0 ? "rotate" : "hide"}>{rotate + "°"}</div>
                        <img alt="找不到图片" src={(ossYuantu&&oss176)?oss176:this.defaultImage} className={"imgRotate_" + rotate} onError={onLoadImgError.bind(this) } />
                        {operate!="push" && <div className="operate-card" onClick={e => { e.stopPropagation() } }>
                            {this.editConfig.map((item, _i) => {
                                let operateBar = "";
                                if(item.operate=="upload"){
                                    operateBar =  (
                                        <i >
                                            <Upload {...uploadProps}>
                                                <i className={"fa fa-" + item.icon}></i>
                                            </Upload>
                                        </i>
                                    );
                                }else{
                                    operateBar = (
                                        <i className={"fa fa-" + item.icon} onClick={handleOnClick.bind(this,{ operate: item.operate, key, id, resId, price, offlineReason, onlineState}) }></i>
                                    );
                                }

                                    return (<OverlayTrigger
                                        key={_i}
                                        overlay={<Tooltip id={'tooltip_' + key + '_' + _i}>{item.title}</Tooltip>}
                                        placement="top"
                                        delayShow={150}
                                        delayHide={50}>{operateBar}</OverlayTrigger>);
                                })}
                            </div>}
                        </div>
                        <div className="custom-card" onClick={e => {
                            e.stopPropagation()
                        }}>
                            <div className="row mb-5">
                                    <div className="col-xs-3">单张ID：</div>
                                    <div className="col-xs-8"><a onClick={imageClickHandle.bind(this, {
                                        "resImageId": id,
                                        key,
                                        "viewWhat": "imageDetailInfo"
                                    })}>{resId}</a></div>
                                <div className="text-right col-xs-1 font-weight-bold">
                                    {!onlineStateText && <span className={onlineStateClass}>{key + 1}</span>}
                                    {onlineStateText && <OverlayTrigger
                                        overlay={<Tooltip id={"card_" + key}>{onlineStateText}</Tooltip>}
                                        placement="top"
                                        delayShow={150}
                                        delayHide={50}><span
                                        className={onlineStateClass}>{key + 1}</span></OverlayTrigger>}
                                </div>
                            </div>

                            <div className="row mb-5">
                                <div className="col-xs-3">等级：</div>
                                <div className="col-xs-9">
                                    <div className="ant-radio-group text-radio">{qualityRankHtml}</div>
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-xs-3">供商：</div>
                                <div className="col-xs-9 sis" title={providerName + '-' + collectionName}>
                                    {providerAgentType === 1 ? (providerName + '-' + collectionName) : providerName}
                                </div>
                            </div>
                            <div className="row mb-5">
                                <div className="col-xs-3">署名：</div>
                                <div className="col-xs-9">
                                    <Input
                                        key={'creditLine' + '_' + key}
                                        value={creditLine}
                                        placeholder="请输入署名"
                                        type="text"
                                        onChange={handleOnClick.bind(this, {"operate": "creditLine", key, id, resId})}/>
                                </div>
                            </div>
                            <div className="row mb-10">
                                <div className="col-xs-3">排序：</div>
                                <div className="col-xs-9">
                                    <Input
                                        style={{width: '100%'}}
                                        type='tel'
                                        key={'sortNumber' + '_' + key}
                                        min={1}
                                        max={99999999}
                                        value={sortNumber}
                                        type="text"
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/, '') || '';
                                            handleOnClick({
                                                "operate": "sortNumber",
                                                key,
                                                id,
                                                resId,
                                                value
                                            });
                                        }}/>
                                </div>
                            </div>
                            {showCaption && <div className="row mb-10" title={providerCaption}>
                                {<Input readonly value={providerCaption} placeholder="---" type="textarea"
                                        style={{height: '95px'}}/>}
                            </div>}
                            <hr/>
                            <div className="row mb-5 mt-10">
                                <div className="col-xs-10 text-nowrap">
                                <span className="info">
                                    <span style={{"height": "20px"}}>&nbsp;</span>

                                    {(operate =='edit' && price && price>0) ? <span className="label label-warn icon middle" style={{"marginRight":"8px",backgroundColor:'#333'}} title={'前台显示：' + (minPrice === 99999999 ? '无，特殊授权品牌' : minPrice) + '元'}>限价 {price}（{minPrice === 99999999 ? '无' : minPrice}）</span> : null}

                                    {(operate == 'edit' && memo && !isEn()) &&
                                    <span className="label label-warn icon middle"
                                          style={{"marginRight": "8px", backgroundColor: '#108ee9'}}>英</span>}

                                    {(onlineState != 2 && saveTemp.onlineState != 2 && operate != 'push' && categoryLabel.length > 0) && categoryLabel.map(item =>
                                        <span className="label label-warn icon middle" style={{"marginRight": "8px"}}
                                              title={item}>{getOneCategoryName(item)}</span>)}

                                    {(operate == "push" && pushedOrganizations.length > 0) && pushedOrganizations.map(org => {
                                        return <span className="label label-warn icon middle"
                                                     style={{"marginRight": "8px"}}
                                                     title={org.name}>{
                                            ((name, id) => {
                                                return (name || '')
                                                {/* if(!name) return '';
                                                switch (true) {
                                                    case name.indexOf('12301')!=-1:
                                                        return `头条—智游12301`;
                                                        break;
                                                    case name.indexOf('民日报')!=-1:
                                                        return `人民日报`;
                                                        break;
                                                    case name.indexOf('百度')!=-1:
                                                        return `百度`;
                                                        break;
                                                    default:
                                                        const length= name.length;
                                                        return name.substr(2,2)+'-'+name.substr(length-2, length);
                                                } */}
                                            })(org.type_name, org.type)
                                        }</span>
                                    })}
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

}
