import React, { Component, PropTypes } from 'react';
import {Cascader} from "antd";
import './style.scss';

class XCascader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        }
    };

    componentWillReceiveProps(nextProps) {
        const {value} = this.state;

        //console.log(value)

        if(nextProps.value.toString()!=value.toString()){
            const {options} = nextProps;

            let result = [];
            let list = nextProps.options.slice(0, nextProps.options.length);

            nextProps.value.forEach(val => {
                const item = list.find(option => option.value == val);
                if(item){
                    result.push(item.label);
                    if(item.children) list = item.children.slice(0, item.children.length);
                }else if(val){
                    result.push(val);
                }
            });

            this.state.value = result;
        }
    }

    render() {
        const {value} = this.state;

        return (
          <div className="cascader-box">
              <span className="cascader-box-input">{value.join('/').replace(/\/$/, '')}</span>
              <Cascader {...this.props} />
          </div>
        );
    }
}

export default XCascader
