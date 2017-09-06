import React, { Component, PropTypes } from "react";

import TagAreaPanel from "app/components/tag/tagArea";

export default class TagRenderBox extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    shouldComponentUpdate(nextProps, nextState) {

        //console.log('TagRenderBox---',nextProps.keywordsArr,nextState.keywordsArr);
        //console.log('TagRenderBox---',nextProps.keywordsAuditArr,nextState.keywordsAuditArr);
        //console.log('TagRenderBox---',nextProps.keywordsDic,nextState.keywordsDic);
        //console.log('TagRenderBox-listDisplay', nextProps.listDisplay,nextState.listDisplay);

        let propsSource = [], stateSource = [];
        if (nextProps.keywordsAuditArr.length == nextState.keywordsAuditArr.length) {
            nextProps.keywordsAuditArr.map(item => {
                propsSource.push(item.source);
            });
            nextState.keywordsAuditArr.map(item => {
                stateSource.push(item.source);
            });
        }

        console.log(nextProps.keywordsAuditArr)

        return (nextProps.listDisplay != nextState.listDisplay) ||
            (!_.isEqual(_.keys(nextProps.keywordsDic), _.keys(nextState.keywordsDic))) ||
            (!_.isEqual(nextProps.keywordsArr, nextState.keywordsArr)) ||
            (nextProps.keywordsAuditArr.length != nextState.keywordsAuditArr.length) ||
            (!_.isEqual(propsSource, stateSource));
    };

    render() {
        const {
            i,
            type,
            lang,
            disabled,
            dispatch,
            alertHandle,
            handleOnUpdateTags,
            listDisplay,
            keywordsDic,
            keywordsArr,
            keywordsAuditArr,
            providerKeywords,
            providerAgentType
        } = this.props;

        this.state = {
            listDisplay,
            keywordsArr,
            keywordsAuditArr,
            keywordsDic
        };

        const key = i;


        //组件中修改时只维护keywordsArr与keywordsAuditArr这两个中间量，keywords与keywordsAudit仅在接口调用保存时修改
        let picKeywords = { themeTag: [], conceptTag: [], formatTag: [], peopleTag: [], locationTag: [], auditTag: [] },
            tempWordsDic = [
                { themeTag: [], conceptTag: [], formatTag: [], peopleTag: [], locationTag: [] },
                '',
                { themeTag: [], conceptTag: [], formatTag: [], peopleTag: [], locationTag: [] }
            ];
        // kind 0 主题 1 概念 2 规格 3 人物 4 地点 其他放到主题里
        const keywordType = { themeTag: '主题', conceptTag: '概念', formatTag: '规格', peopleTag: '人物', locationTag: '地点' };
        const keywordTypeArr = _.keys(keywordType);


        // 所有已经确定的关键词 按照类别装起来
        if (keywordsArr.length > 0) {
            keywordsArr.forEach(keywordId => {
                const keyword = keywordsDic[keywordId];
                if (!keyword) return false;
                let kind = keyword.kind;
                let tag = keywordTypeArr[kind] ? keywordTypeArr[kind] : "themeTag";
                let label = keyword[lang];
                if (keywordId && label) {
                    const obj = {
                        key: label + "  (" + keywordId + ")",
                        label: <span className="ant-select-selection__choice__content" data-id={keywordId}>{label}</span>,
                        title: label,
                        id: keywordId,
                        kind: kind
                    };
                    picKeywords[tag].push(obj);
                }
            });
        }

        /*
         *  keywordsAudit为后台自动审计后的关键字，格式为 tag|id|type

         *  其中type=0表示新词，type=1表示正常，type=2表示多义词，type=3表示不检测

         *  多义词的多个id以逗号分隔.目前数据库中存在错误数据，大量id之间包含双冒号，这里也需要处理

         *  keywordsAuditArr为keywordsAudit转换为的数组

         *  手动增加的新词与多义词要保留在输入的那个框中，最后的auditTag框只记录原词
         */

        if (keywordsAuditArr.length > 0) {
            keywordsAuditArr.forEach(item => {
                const auditClass = ['danger', '', 'success'];
                const param = { ...item };
                param.key = param.label + ' (' + param.id + ')'; //source为原始数据
                param.title = param.label;                       //新词与多义词的label要转为jsx，这里用title记录下字符

                if (auditClass[param.type]) {
                    let className = "ant-select-selection__choice__content label label-" + auditClass[param.type];
                    param.label = <span className={className} data-type={param.type} data-id={param.id}>{param.label}</span>;
                    //新词放在前面，多义词放在后面
                    tempWordsDic[param.type][keywordTypeArr[param.kind || 0]].push(param);
                } else if (param.type == 3) {//
                    picKeywords.auditTag.push(param.label);
                }
            });
            _.keys(picKeywords).map(tag => { //循环已确定词的分类 0 主题 1 概念 2 规格 3 人物 4 地点
                if (tempWordsDic[0][tag]) {
                    //新词和多义词都加到主题里面
                    picKeywords[tag] = tempWordsDic[0][tag].concat(tempWordsDic[2][tag], picKeywords[tag]);
                }
            });
            picKeywords.auditTag = _.uniq(picKeywords.auditTag);
        }

        const tagAreaConfigs = {
            dispatch: dispatch,
            type: type,
            keywordsDic: keywordsDic,
            disabled: disabled,
            size: "large",
            className: "mb-10 row",
            alertHandle: alertHandle
        };
        const TagAreaPanels = listDisplay == 1 ?
            [<TagAreaPanel // 一个框
                key={key + '_' + listDisplay + '_' + 0}
                {...tagAreaConfigs}
                tagContainerStyle={{ height: 120, "fontSize": 12 }}
                value={_.union(picKeywords.themeTag, picKeywords.conceptTag, picKeywords.formatTag, picKeywords.peopleTag, picKeywords.locationTag)}
                placeholder=" 输入关键词后回车添加。"
                updateTags={handleOnUpdateTags.bind(this, key, 0)}
            />]
            :
            keywordTypeArr.map((name, index) => { //五个框模式
                return (<TagAreaPanel
                    key={key + '_' + listDisplay + '_' + index}
                    {...tagAreaConfigs}
                    tagContainerStyle={{ "fontSize": 12, "height": 60 }}
                    value={picKeywords[name]}
                    placeholder={`输入${keywordType[name]}关键词后回车添加。`}
                    updateTags={handleOnUpdateTags.bind(this, key, index)}
                />)
            });

        if (type === 'edit' || type === 'push') {
            TagAreaPanels.push(<textarea disabled value={(providerKeywords && providerAgentType != 1) ? _.compact(providerKeywords.split(',')).join(',') : ''} style={{ height: '60px', width: '100%' }} />);
        }


        return (
            <div>{TagAreaPanels}</div>
        );
    };

}
