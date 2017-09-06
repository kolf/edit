import React, { Component } from 'react';
import {Input, Icon} from 'antd';

import './style.scss';

let timer = null;

class TagInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };

    }

    componentWillReceiveProps(nextProps){
        if ('value' in nextProps) {
            this.setState({value: nextProps.value})
        }
    }

    onChange = (e) => {
        const {onChange, onSearch} = this.props;
        const value = e ? e.target.value : '';

        if(onSearch){
            this.setState({value});
            this.onSearch(value);
        }else if(onChange){
            onChange(value);
        }else{
            this.setState({value})
        }
    }

    onSearch = (val) => {
        // if(!val) return;
        const {onSearch} = this.props;

        if(timer){
            clearTimeout(timer);
            timer = null
        }

        timer = setTimeout(() => {
            onSearch(val)
        }, 900)
    }

    clearVal = () => {
        this.onChange('')
    }

    render() {
        const {onChange, placeholder, style} = this.props;
        const {value} = this.state;

        return (<span className="ant-input-affix-wrapper">
            <Input style={style} placeholder={placeholder || '请输入'} className="" onChange={this.onChange} value={value}/>
            <span style={{display: value ? 'block': 'none'}} className="ant-input-suffix" onClick={this.clearVal}><Icon type="close-circle" /></span>
        </span>);
    }
}

export default TagInput
