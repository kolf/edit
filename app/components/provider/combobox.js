import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import Select from "antd/lib/select";

import "./css/combobox.css"
const Option = Select.Option;

// props:
// 1: placeholder
// 2: className
// 3: dispatch
// 4: key [require, digital]
// 4: dispatchAct [require,fun]
// 5: getValue [require,fun]

export default class ComboBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "data": [],
            "value": "",
            "focus": false,
            "timer": null,
            "hasSelect": false
        };

    };

    componentDidMount() {
        //console.info(this.props)
    };

    componentWillReceiveProps(nextprops) {
        this.state.value = nextprops.defaultValue;

        // this.setState({ value: defaultValue })
        // if(value!=defaultValue){
        //     this.setState({ value: defaultValue })
        // }
        //
        // //console.log(defaultValue);
        //
        // if (defaultValue) this.setState({ value: defaultValue });
        // else this.render();
    };

    getValue() {
        const {getValue, keys} = this.props;
        if (getValue && keys) getValue({
            "keys": this.props.keys,
            "value": this.state.value
        });
        else if (getValue) getValue({
            "value": this.state.value
        });
    };

    handleChange(value) {
        // const {hasSelect} = this.state;
        //
        // //console.log(hasSelect);
        // //console.log(value);

        this.setState({ value });
        if (this.state.timer) {
            clearTimeout(this.state.timer)
        }
        this.state.timer = setTimeout(() => {
            this.getValue();
            this.getList(value);
        }, 300);

        // this.state.hasSelect = false;

        this.props.onChange && this.props.onChange(value);
    };

    getList(value) {
        const {dispatchAct, dispatch, type, assetFamily, dispatchData, isOneTime} = this.props;
        let param = { value };
        let typeId = 0, apifield = type;
        if (type) {
            if (type === "agency") {
                param = {
                    paramType: 2,
                    param: {
                        searchName: value,
                        assetFamily: assetFamily
                    }
                };
            }
            if (type === "providerId") {
                param = {
                    paramType: 3,
                    param: {
                        searchName: value,
                        assetFamily: assetFamily
                    }
                };
            }
            if (type === "editUserId") {
                param = {
                    paramType: 4,
                    param: {
                        searchName: value,
                        assetFamily: assetFamily
                    }
                };
            }
            if (type === "topicId") {
                param = {
                    keyword: value,
                    pageSize: 100,
                    pageNumber: 1
                };
            }
            if (type === "passUserId") {
                param = {
                    passUserId: value
                };
            }
        }
        if (!dispatchAct) return false;
        if (isOneTime) {
            dispatch(dispatchData(param)).then(result => {
                if (result.apiError) return false;
                //暂时不用reducer
                let data = [<Option key={" "} id={null}>{"找不到数据"}</Option>];
                if (type === "passUserId") {
                    if (!result.apiResponse || result.apiResponse.length == 0) {
                        data = [<Option key={" "} id={null}>{"请输入审核人名称"}</Option>];
                    } else {
                        data = result.apiResponse.map(d => <Option key={d.passUserId} id={d.passUserId}>{d.passUserName}</Option>);
                    }
                }
                this.setState({ data });
            });
        }else{
            dispatch(dispatchAct(param)).then(result => {
                //console.log(result);

                if (result.apiError) return false;
                //暂时不用reducer
                let data = [<Option key={" "} id={null}>{"找不到数据"}</Option>];
                if (type === "agency") {
                    if(!result.apiResponse.agency||result.apiResponse.agency.length==0){
                        data = [<Option key={" "} id={null}>{"请输入机构名称"}</Option>];
                    }else{
                        data = result.apiResponse.agency.map(d => <Option key={d.nameCn} id={d.id}>{d.nameCn}</Option>);
                    }
                } else if (type === "providerId") {
                    if(!result.apiResponse.photographer||result.apiResponse.photographer.length==0){
                        data = [<Option key={" "} id={null}>{"请输入供稿人"}</Option>];
                    }else{
                        data = result.apiResponse.photographer.map(d => <Option key={d.nameCn} id={d.id}>{d.nameCn}</Option>);
                    }
                }
                else if (type === "editUserId") {
                    if(!result.apiResponse.user||result.apiResponse.user.length==0){
                        data = [<Option key={" "} id={null}>{"请输入编审人"}</Option>];
                    }else{
                        data = result.apiResponse.user.map(d => <Option key={d.name} id={d.id}>{d.name}</Option>);
                    }
                }
                else if (type === "provider") {
                    if(!result.apiResponse||result.apiResponse.length==0){
                        data = [<Option key={" "} id={null}>{"请输入供稿人名称或ID"}</Option>];
                    }else{
                        data = result.apiResponse.map(d => <Option key={d.nameCn} assetFamily={d.assetFamily} id={d.id}>{d.nameCn}</Option>);
                    }
                }
                else if (type === "topicId") {
                    if(!result){
                        data = []
                    }else if(!result.apiResponse || result.apiResponse.length==0){
                        data = [<Option key={" "} id={null}>{"请输入相应的关键词"}</Option>];
                    }else{
                        data = result.apiResponse ? result.apiResponse.map(d => <Option key={d.id} id={d.id}>{d.title+' ('+d.id+')'}</Option>) : [];
                    }
                }
                else if (type === "passUserId") {
                    if(!result.apiResponse.list||result.apiResponse.list==0){
                        data = [<Option key={" "} id={null}>{"请输入审核人"}</Option>];
                    }else{
                        data = result.apiResponse.list.map(d => <Option key={d.id} id={d.id}>{d.title}</Option>);
                    }
                }
                else {
                    data = result.apiResponse;
                };

                //console.log(data);

                this.setState({ data });
            });
        }
    };

    handleFocusBlur(e) {
        if (e) {
            this.setState({ focus: e.target === document.activeElement });
        } else {
            this.setState({ focus: false });
            this.setState({ data: [] });
        }
    };

    onSelect(value, option) {
        const {handOnSelect, type} = this.props;

        //if(type && type === "topicId") this.setState({value: option.props.children});
        this.setState({value: option.props.children});
        if(handOnSelect) handOnSelect(value, option);

        this.state.hasSelect = true;
    };

    render() {
        const {className, placeholder, defaultValue, optionData, type} = this.props;
        const {data,value} = this.state;

        let options = null;
        if (data) options = data.map(d => <Option key={d.value}>{d.text}</Option>);
        if (type) options = data;

        //console.log(options, data, value);

        return (
            <Select
                combobox
                value={value=='请输入相应的关键词'?'':value}
                allowClear={true}
                className={className}
                placeholder={defaultValue ? false : this.props.placeholder}
                notFoundContent=""
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={this.handleChange.bind(this) }
                onFocus={this.handleFocusBlur.bind(this) }
                onBlur={this.handleFocusBlur.bind(this) }
                onSelect={this.onSelect.bind(this) }
                >
                {options}
            </Select>
        );
    };

}
