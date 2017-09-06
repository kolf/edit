import React, { Component } from 'react';
import {connect} from "react-redux";
import {Select, Icon} from 'antd';
import {compareArr } from 'app/utils/utils';

import './style.scss';
const Option = Select.Option;

let timer = null;

class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            options: props.options || []
        };
    }

    componentWillReceiveProps(nextProps){
        let {value, options} = this.state;

        if(!nextProps.value){
            this.setState({value: []})
        }else if (!compareArr(value, nextProps.value) && nextProps.value) {
            this.setState({
                value: nextProps.value.filter(item => item !== '全部|-1')
            })
        }

        if(!compareArr(options, nextProps.options)){
            this.setState({
                options: nextProps.options.filter(item => item.value !== '全部|-1')
            });

            // if(nextProps.options.length==1){
            //     this.state.value=['all']
            // }
        }
    }

    onSelect = (val) => {
        const {onSelect} = this.props;
        const {options} = this.state;
        const value = (this.state.value || []).concat([val]);

        if(onSelect){
            onSelect(value, options)
        }else{
            this.setState({value})
        }
    }

    onDeselect = (val) => {
        const {onSelect} = this.props;
        const {options} = this.state;
        const value = (this.state.value || []).filter(item => item!=val);

        if(onSelect){
            onSelect(value, options)
        }else{
            this.setState({value})
        }
    }

    clearVal = (val) => {

    }

    onSearch = (val) => {
        const {onSearch} = this.props;

        if(!val || !onSearch) return;
        // const {onSearch} = this.props;
        if(timer){
            clearTimeout(timer);
            timer = null
        }

        timer = setTimeout(() => {
            onSearch(val)
        }, 900)
    }

    render() {
        const {placeholder, multiple} = this.props;
        const {value, options} = this.state;

        return (<span className="ant-input-affix-wrapper">
            <Select
                value={value || []}
                allowClear
                showSearch
                multiple = {multiple}
                placeholder={placeholder}
                notFoundContent=""
                filterOption={false}
                style={this.props.style}
                defaultActiveFirstOption={false}
                optionFilterProp="children"
                onSelect={this.onSelect}
                onDeselect={this.onDeselect}
                onSearch = {this.onSearch}
            >
                {options.map((option, i) => <Option key={option.key}>{option.label}</Option>)}
            </Select>
        </span>);
    }
}

export default connect()(SearchInput);
