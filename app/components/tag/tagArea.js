/*
 *  关键词输入框

    对外接口：
        @updateTags: 用于更新关键词. function({keywordsArr, keywordsAuditArr, newDic}, tag)
                        @keywordsArr：新增的确定的关键词数组，格式[1,2,3]仅包含id
                        @keywordsAuditArr：新增的新词或多义词数组，格式[{ids, label, type}]
                        @newDic：新增关键词对应的字典
                        @tag：删除的关键词
 */
import React, {Component, PropTypes} from 'react';
import TagForm from './form';
import EditModal from "app/components/edit/editModal";
import Select from './Select';
import message from "antd/lib/message";
import Table from "antd/lib/table";
import {isEn, uniq, unescapeHtml} from "app/utils/utils";

import {
    findKeyword,
    addKeyword,
    modifyKeyword,
    getKeywordById
} from "app/action_creators/edit_action_creator";
//以中英文逗号分割关键词字符串
const tagSplitReg = /,|，|\n/;

let sortTag = {};

export default class TagAreaPanel extends Component {
    constructor(props) {
        const {type,className,style,size,disabled,value,tagContainerStyle,placeholder,keywordsDic,noWrap} = props;
        super(props);
        this.state = {
            "doing": "doing",
            "alert": {},
            "type": type?type:"",
            "className": className?className:"",
            "style": style?style:null,
            "size": size?size:"",
            "disabled": disabled?disabled:false,
            "value": props.value || [],
            "tagContainerStyle": tagContainerStyle?tagContainerStyle:{},
            "placeholder": placeholder?placeholder:"",
            "keywordsDic": keywordsDic?keywordsDic:{},
            "noWrap": noWrap || false
        };
    }

    componentWillMount() {
        const {value} = this.state;

        value.forEach((item, index) => {
            sortTag[item.title] = index;
        });
    }

    componentWillReceiveProps(nextProps){
        let {value} = this.state;

        // //console.log('1--------------',value);
        // //console.log('2--------------',nextProps.value);

        // if(value.length!== nextProps.value.length || uniq(value, nextProps.value, 'key', false).length!==value.length){
            this.setState({value: nextProps.value.filter(item => !/^;{2}$/.test(item.title) || !/\|1\|\d$/.test(item.source))})
        // }

        if(nextProps.sortTags){ // 有bug
            // Object.assign(sortTag, nextProps.sortTags);
        }
    };

    /**
     * 请求匹配关键词
     * @param  {String} labelArr 新增的关键词数组
     */
    autoMatchKeywords(labelArr){
        const {dispatch, type, kind, updateTags} = this.props;

        const now = (n) => {
            const time = Date.now() + '';
            return (time.substr(0, time.length-1) + n)*1
        }

        //输入多个词且以逗号分隔时，传参为name:['a', 'b', 'c']  返回格式{a: [{xxx}], b:[{xx}, {oo}], c:[]}
        dispatch(findKeyword({ name: labelArr, type })).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage, 3);
                return false;
            }

            const res = result.apiResponse;
            let keywordsArr = [], keywordsAuditArr = [], newDic = [];

            labelArr.forEach((label, i)=>{
                let matchedKeywords = Array.isArray(res[label]) ? res[label]: eval(res[label]);

                newDic = newDic.concat(matchedKeywords);

                if(!matchedKeywords || !matchedKeywords.length){//新词按照格式加入keywordsAuditArr
                    keywordsAuditArr.push({
                        label: label,
                        id: '',
                        type: 0,
                        kind: kind,
                        source: label + '||0|0'
                    });

                    // this.resultKeywords.push(label);
                    sortTag[label] = sortTag[label] ||  now(i);
                }else if(matchedKeywords.length > 1){//多义词按照格式加入keywordsAuditArr
                    let ids = [], idStr = '';
                    matchedKeywords.map((item)=>{
                        ids.push(item.id);
                    });
                    //多义词的多个id以::分隔
                    idStr = ids.join('::');
                    keywordsAuditArr.push({
                        label: label,
                        id: idStr,
                        type: 2,
                        kind: kind,
                        source: label + '|' + idStr + '|2|0'
                    });

                    // this.resultKeywords.push(label);
                    sortTag[label] = sortTag[label] ||  now(i);
                }else{//匹配到一个直接加入keywordsArr中
                    let matchedId = matchedKeywords[0].id;
                    const lang = isEn() ? 'enname' : 'cnname';
                    let title = matchedKeywords[0][lang];

                    if(!title){
                        title = isEn() ? 'cnname' : 'enname';
                    }

                    sortTag[title] = sortTag[title] ||  now(i);

                    keywordsArr.push(matchedId.toString());
                }
            });

            if(updateTags instanceof Function){
                updateTags({keywordsArr, keywordsAuditArr, newDic: _.compact(newDic)});
            }
        });
    };

    /**
     * 改词逻辑
     * 改字典 当做新词改字典 强制刷新
     *
     * @param  {Object} params form数据
     */
    submitSaveTag(params){
        const {dispatch, type, updateTags, alertHandle} = this.props;
        params.type = type;

        const {cnsyno, ensyno} = params;
        params.cnsyno = Array.isArray(cnsyno) ? cnsyno : cnsyno.split(',');
        params.ensyno = Array.isArray(ensyno) ? ensyno : ensyno.split(',');

        dispatch(modifyKeyword(params)).then(result => {
            if (result.apiError) {
                message.error("修改失败请重新尝试", 3);
                return false;
            }
            updateTags({newDic: params});
            alertHandle();
        });
    };

    /**
     * 加词逻辑
     * 往keywordsArr中添加词 删除原来的词
     *
     * @param  {Object} params form数据
     */
    submitAddTag(params){
        const {dispatch, kind, type, updateTags, alertHandle} = this.props;

        const {cnsyno, ensyno} = params;
        params.cnsyno = Array.isArray(cnsyno) ? cnsyno : cnsyno.split(',');
        params.ensyno = Array.isArray(ensyno) ? ensyno : ensyno.split(',');

        dispatch(addKeyword({...params,type})).then(result => {
            if (result.apiError) {
                message.error("添加失败请重新尝试", 3);
                return false;
            }
            const id = result.apiResponse.insert_id;
            updateTags({keywordsArr: [id.toString()],newDic:{...params, id}}, {label: this.orginalNewWord, id: '', type: 0, curId: id});
            alertHandle();
        });
    };

    tagTableRender(param){
        let columns = [{
            "title": "中文名",
            "dataIndex": 'cnname',
            "key": 'cnname',
            "width": "15%"
        }, {
            "title": "中文同义词",
            "dataIndex": "cnsyno",
            "key": "cnsyno",
            "width": "20%",
            "render": (text, record) => (text&&text.join(';'))
        }, {
            "title": "英文名",
            "dataIndex": "enname",
            "key": "enname",
            "width": "15%"
        }, {
            "title": "英文同义词",
            "dataIndex": "ensyno",
            "key": "ensyno",
            "width": "20%",
            "render": (text, record) => (text.join(';'))
        }, {
            "title": "类型 ",
            "dataIndex": "kind",
            "key": "kind",
            "width": "15%",
            "render": (kind, record) => {
                const kindDic = ["主题", "概念", "规格", "人物", "地点"];
                return kindDic[kind];
            }
        }, {
            "title": "备注",
            "dataIndex": "memo",
            "key": "memo",
            "width": "15%"
        }];

        return <Table className="hand" style={{width:'100%'}} columns={columns} dataSource={param.data} onRowClick={this.handleOnClickTagTable.bind(this, param)}/>
    };

    handleOnClickTagTable({label, ids, key}, record, index){
        label = unescapeHtml(label);
        //console.log(label);
        //console.log('------------', {label, ids, key});

        let lang = isEn() ? 'enname' : 'cnname';

        if(sortTag[label]){
            sortTag[record[lang]] = sortTag[label];
        }

        const id = record.id;
        this.props.updateTags({keywordsArr: [id.toString()]}, {label, id: ids, type: 2, curId: id});
        this.props.alertHandle();
    };

    updateData({doing, alert}) {
        if (doing) this.state.doing = doing;
        if (alert) this.state.alert = alert;
    };

    render() {
        const {value} = this.state;
        const {className,style,size,disabled,tagContainerStyle,placeholder,keywordsDic,noWrap} = this.props;

        console.log('----000', value);
        // //console.log(sortTag);

        // const sortVals = value.sort((val1, val2) => {
        //    return sortTag[val1.title] - sortTag[val2.title];
        // });

        //console.log('render-------------', value);
        //console.log(keywordsDic);
        return (
            <div className={className}>
                <Select tags labelInValue
                    className="people-tag tag"
                    disabled={disabled}
                    style={style}
                    size={size}
                    disabled={disabled}
                    value={value.filter(v => v.source!=='null||0|0')}
                    tagContainerStyle={tagContainerStyle}
                    noWrap={noWrap}
                    placeholder={placeholder}
                    onInput={this.tagOnInput.bind(this) }
                    onChange={this.tagOnChange.bind(this) }
                    onSelect={this.tagOnSelect.bind(this) }
                    onClickTag={this.tagOnClick.bind(this) }>
                </Select>
            </div>
        )
    };


    /**
     * 添加关键词事件
	 * @param  {String} inputStr 输入的字符串
	 * @param {Array} value 原来的关键词
     */
    tagOnInput(inputStr, value){

        const {disabled} = this.props;
        if(disabled) return;

        // if(this.props.value.find(val => val.title == inputStr)) return;
        // if(sortTag[inputStr]) return;

        //去掉空格和false 去掉每个关键词前后空格 生成关键词数组
		const labelArr = _.compact(_.map(inputStr.split(tagSplitReg), _.trim));

		// 存在关键词比较（文本还原成关键词需要在此处作比较）

		if(value){
			let deleteArray = []; // 要删除的关键词
			value.forEach(item=>{
				let index = labelArr.indexOf(item.title);
				if(index < 0){ // 关键词不在文本关键词中 删除词
					deleteArray.push(item);
				}else{// 文本关键词中删除之前存在的词 剩下的就是新词
					labelArr.splice(index, 1);
				}
			});
			// 删除关键词
			this.tagOnChange(deleteArray, deleteArray);
		}
		if(labelArr.length == 0){// 无需要添加关键词
			return;
		}

        clearTimeout(this.autoMatchKeywordsTimeout);
		this.autoMatchKeywordsTimeout = setTimeout(this.autoMatchKeywords.bind(this, labelArr), 500);
        //只有在输入项以逗号结束时才加词
        //if(/，|,$/.test(inputStr)){
        //
        //}
    };

    // 删词逻辑
    tagOnChange(value,delValue){
        if(this.props.updateTags) this.props.updateTags({}, delValue);
    };

    tagOnSelect(value){
        //console.log('tagOnSelect',value);
        //const {id} = this;
        //const labelArr = value.label.split(tagSplitReg);
        //clearTimeout(this.autoMatchKeywordsTimeout);
        //this.autoMatchKeywordsTimeout = this.autoMatchKeywords(_.compact(labelArr));
    };

    // 改词事件
    tagOnClick(e){
        const {target} = e;

        if(target.dataset.kind==9){
            return false; // 分类关键词不让改
        }

        const {disabled} = this.props;
        if(disabled) return;

        //console.log('----------',target);

        this.editTag({ label: target.innerHTML, errorType: target.dataset.type, id: target.dataset.id });
    };

    /**
     * 改词逻辑
     * @param  {String} options.label     关键词名称
     * @param  {Number} options.errorType 关键词类型
     * @param  {Number} options.id        关键词id
     */
    editTag({label, errorType, id}) {
        const { dispatch, type, keywordsDic ,alertHandle } = this.props;

        if(type == "edit" && keywordsDic[id]){
            // 编辑类关键词平行结构 不需要pid 默认设置为0 此处添加防止返回空值无法提交的情况
            keywordsDic[id].pid = 0;
        }
        if (!errorType) {
            alertHandle({
                width: 800,
                title: "修改关键词",
                contentShow: "body",
                body: <TagForm onSubmit={this.submitSaveTag.bind(this)} initialValues={keywordsDic[id]} operateType="edit" moduleType={type}/>,
                isFooter: false,
                maskClosable: false,
                dragable : true,
                onCancel: this.onCancel.bind(this)
            });
        }
        else if (errorType == 2) {//多义词
            dispatch(getKeywordById({data: id.replace(/::/g, ',')}, type)).then(result => {
                if (result.apiError) {
                    message.error(result.apiError.errorMessage, 3);
                    return false;
                }
                const res = result.apiResponse;

                alertHandle({
                    width: "800",
                    title: "选择多义词",
                    type: "select",
                    contentShow: 'body',
                    body: this.tagTableRender({ label, data: res, ids: id }),
                    isFooter: false,
                    maskClosable: false,
                    dragable : true,
                    onCancel: this.onCancel.bind(this)
                });
            });
            // if (!keyword) return false;
        }
        else if (errorType == 0) {//新词
            this.createTag({label});
        }
    };

    createTag({label}){
        const {kind, type, alertHandle} = this.props;
        this.orginalNewWord = label;
        let lang = isEn() ? 'enname' : 'cnname';
        let formConfig = {[lang]: label, kind: kind || '0', cnsyno: [], ensyno: [], type};
        if(type == "edit"){
            // 编辑类关键词平行结构 不需要pid 默认设置为0
            Object.assign(formConfig, {pid: 0})
        }

        alertHandle({
            width: "800",
            title: "添加新词",
            contentShow: "body",
            body: (
                <TagForm
                    operateType="create"
                    initialValues={formConfig}
                    moduleType={type}
                    onSubmit={this.submitAddTag.bind(this) }
                />
            ),
            isFooter: false,
            maskClosable: false,
            dragable : true,
            onCancel: this.onCancel.bind(this)
        });
    };

    // 框中框退出
    onCancel(){
        this.props.updateTags({});
        this.props.alertHandle();
    }
}
