/*
 * 专为关键词打造的仿蚂蚁Select组件
 */
import React, {Component, PropTypes} from "react";
import Spin from "antd/lib/spin";
import Input from 'antd/lib/input';
//中文匹配的正则
const chineseWordReg = /[\u4e00-\u9fa5]/g;

export default class Select extends Component{

	constructor(props){
		const {className,style,size,disabled,value,tagContainerStyle,placeholder,keywordsDic,noWrap} = props;
		super(props);
		this.state = {
			"className": className?className:"",
			"style": style?style:null,
			"size": size?size:"",
			"disabled": disabled?disabled:false,
			"value": value?value:[],
			"tagContainerStyle": tagContainerStyle?tagContainerStyle:{},
			"placeholder": placeholder?placeholder:"",
			"inputText": "", // 输入内容
			"inputFocused": false, // 光标消失
			"inputModel": 1, // 关键词编辑框模式 是否为文本框状态 1为不可选择模式 2为可选择模式 文本框
			"noWrap": noWrap || false // 强制不换行
		};
		this.loop = 0;
	};

	// 判断是否刷新 根据父组件判断即可
	// shouldComponentUpdate(nextProps, nextState){
	//
    // 	// setState 更新
    // 	if(nextState.inputModel != this.state.inputModel || nextState.inputText != this.state.inputText || nextState.inputFocused != this.state.inputFocused){
    // 		return true;
    // 	}
	//
    //     // 父类更新 检测value是否一致
    //     if(nextProps.value.length != this.props.value.length){
    //     	return true;
    //     }
	//
    //     return nextProps.value.some((item,i)=>{
	// 		        	if(this.props.value[i].id != item.id || this.props.value[i].kind != item.kind || this.props.value[i].title != item.title){
	// 		    			return true;
	// 		        	}
	// 	 });
    // };

	render(){

		//const {className,style,size,disabled,value,tagContainerStyle,placeholder} = this.props;
		const {className,style,size,disabled,tagContainerStyle,placeholder,inputModel,noWrap} = this.state;
		const {value} = this.props;

		let selectContent = <div></div> ;
		if(inputModel == 1){

			// // 修复Select组件的奇葩高度
			// // 如果是Select 设置200px 如果是Input 设置为201.6px 保证行高一致
			// if(tagContainerStyle&&tagContainerStyle.height=="201.6px"){
			// 	tagContainerStyle.height = "200px"
			// }

			selectContent = <div onDoubleClick={this.changeInputModel.bind(this,2)}  className={'ant-select ant-select-' + (disabled ? 'disabled' : 'enabled') + ' ' + className} style={style||{ width: '100%' }}>
				<div className="ant-select-selection ant-select-selection--multiple">
					<div className="ant-select-selection__rendered" onClick={this.onClickWapper.bind(this)} style={tagContainerStyle}>
						{this.optionRender(value)}
					</div>
				</div>
			</div>
		}else{
			let titles = value.map(item=>{
				return item.title;
			});

			let defalutValue = titles.join("，");

			// // 修复Select组件的奇葩高度
			if(tagContainerStyle&&tagContainerStyle.height==120){
				tagContainerStyle.height = 118
			}
			// console.log(tagContainerStyle.height)

			selectContent = <Input onDoubleClick={this.changeInputModel.bind(this,1)} onBlur={this.changeInputModel.bind(this,1)} type="textarea" defaultValue = {defalutValue}  style={tagContainerStyle}  />
		}

		return selectContent;
	};

	optionRender (value){
		let {inputText,inputFocused,placeholder} = this.state;
		let option = "";
		// if(!value) {
		// 	option = <Spin tip="加载中..." />;
		// } else if(value.length==0) {
		// 	option = !inputFocused && <div className="ant-select-selection__placeholder">{placeholder}</div>;
		// }else {

		// }


		option = value.map((data, i)=>{
			const {label, title, key} = data;
			return <li unselectable="unselectable"
					   className="ant-select-selection__choice"
					   title={title || label}
					   key={key}
					   style={{userSelect:'initial'}}>
				<div className="ant-select-selection__choice__content">{label || data}</div>
				<span className="ant-select-selection__choice__remove" data-index={i}></span>
			</li>
		})

		if(value.length == 0){
			option = !inputFocused && <div className="ant-select-selection__placeholder">{placeholder}</div>;
		}

		//中文按两个字符长度进行计算
		const inputTextCharLength = inputText.length + (inputText.match(chineseWordReg) || []).length;

		return <ul>
			{option}
			<li className="ant-select-search ant-select-search--inline">
				<input ref="tag_input" placeholder={placeholder}
					   className="ant-select-search__field" style={{width: (1 + 7 * inputTextCharLength) + 'px'}}
					   value={inputText} onKeyUp={this.onInputKeyUp.bind(this)} onChange={this.onInputChange.bind(this)} onBlur={this.onInputBlur.bind(this)}/>
			</li>
			{/*
			 <li>
			 <textarea></textarea>
			 </li>
			*/}
		</ul>
	};

	onRemoveTag(index){
		let {value} = this.props;
		//const delValue = value.splice(index, 1)[0];
		let delValue = value[index];
		if(this.props.onChange) this.props.onChange(value,delValue);
	};

	onClickWapper(e){
		const {target} = e, {onClickTag} = this.props;
		const targetTagName = target.tagName.toLowerCase();
		if(target && target.className.indexOf("ant-select-selection__choice__content") != -1){
			onClickTag && onClickTag(e);
		}else if(target.className.indexOf("ant-select-selection__choice__remove") != -1){
			this.onRemoveTag(target.dataset.index);

			this.refs.tag_input.focus();
			this.setState({inputFocused: true});
		}else if(targetTagName == 'div'){
			this.refs.tag_input.focus();
			this.setState({inputFocused: true});
		}
	};

	onInputBlur(){
		const {inputText} = this.state;
		if(this.props.onInput && inputText) {
			this.props.onInput(inputText);
			this.setState({ inputText: '', inputFocused: false });
		}
	};

	onInputKeyUp(e){
		//回车、逗号时均触发选择事件以添加标签
		if(e.keyCode == '13' || e.keyCode == '188'){
			this.onInputBlur();
		}
	};

	onInputChange(e){
		this.setState({inputText: e.target.value});
	};

	/**
	 * 切换关键词框的状态
	 * 切换到非文本框需要判断文本框是否有改动 如果文本框有改动删除所有原来的关键词并且重新添加文本框中的关键词
	 *
	 * @param  {Number} value 1非文本框 2 文本框
	 */
	changeInputModel(inputModel, e){
		const {noWrap} = this.state;
		const {value} = this.props;

		if(this.props.disabled){
			return;
		}

		// 切换到非文本框
		// //console.log("e.target.value != e.target.defaultValue", e.target.value != e.target.defaultValue);
		if(inputModel == 1 && e.target.value != e.target.defaultValue){
			let inputText = e.target.value || '';

			if(this.props.onInput) {
				this.props.onInput(inputText, value);
			}
		}else{
			// this.refs.tag_input.focus();
			// this.setState({inputFocused: true});
		}

		this.setState({inputModel});
	}
}
