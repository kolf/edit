import React, { Component } from 'react';
import { Select, Input} from 'antd';
const Option = Select.Option;

import './style.scss';

const toValue = (value, type) => {
    let result;
    if(type == 'string'){
        result = (Array.isArray(value) ? value.join(','): (value || '')).replace(/\s+/g , ' ')
    }else if(type == 'array'){
        if(value){
            result = Array.isArray(value) ? value : value.replace(/^[,，]|[,，]$/, '').split(/[,，]/).filter(val => !!val)
        }else{
            result = []
        }
    }
    return result;
}

class TagInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            // value: props.value || '',
            isActive: true
        };

    };

    componentWillReceiveProps(nextProps){
        // const {}
        //console.log(nextProps)
    }

    handleChange = (e) => {
        let {change} = this.props;
        const value = Array.isArray(e) ? e : e.target.value;
        // this.setState({value});

        change && change(toValue(value, 'string'))
    }

    handleToggle = () => {
        let {isActive} = this.state;
        this.setState({isActive: !isActive})
    }

    render() {
        const {value} = this.props;
        const {options, isActive} = this.state;

        //console.log(value)

        return (
            <div onDoubleClick = {this.handleToggle}>
                {isActive ? <Select dropdownClassName="tag-input-dropdown" value={toValue(value, 'array')} tags size="large" tokenSeparators={[',', '，']} style={{ width: '100%' }} placeholder="请输入关键词" onChange={this.handleChange}>
                  {options.map(option => <Option key={option.value}>{option.label}</Option>)}
              </Select> : <Input placeholder="请输入关键词" onBlur={this.handleToggle} style={{maxHeight:100, overflowX: 'auto'}} autosize type="textarea" value={toValue(value, 'string')} size="large" onChange={this.handleChange} />}

            </div>
        );
    }
}

export default TagInput
