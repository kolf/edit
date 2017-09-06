import React, { Component, PropTypes } from 'react';

import Collapse from "antd/lib/collapse";
import Checkbox from "antd/lib/checkbox";
import Input from "antd/lib/input";
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;

export default class NoPassReasonBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: ['4'],
            noPassOptions: props.noPassOptions,
            imageRejectReason: {} // 收集选中项
        };
    };
    componentWillMount() {
        //console.log('init');
        this.initialState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        // if(nextProps.graphicalStyle == this.props.graphicalStyle){
        //     return false;
        // }
        //
        // 打开的时候 把值重新传递给弹框param
        // let {imageRejectReason} = this.state;
        // if(this.props.updateData) this.props.updateData({imageRejectReason});

        this.initialState(nextProps);

        // imageRejectReason = {};
        // this.setState({imageRejectReason: {}});
    }


    /**
     * 将父组件传过来的图片类型赋值到组件默认展开选项当中 4是其它默认显示
     *
     * @param  {Object} props 父组件属性
     */
    initialState(props) {
        let {activeKey, imageRejectReason} = this.state;

        activeKey = ['4'];

        switch(props.graphicalStyle) {/*1摄影图片2 插画 3漫画 4图表 5矢量图*/
            case "1":
                activeKey.unshift('0');
                break;
            case "2":
                activeKey.unshift('2');
                break;
            case "5":
                activeKey.unshift('1');
                break;
            default:
                break;
        }

        if(props.value){
            imageRejectReason = props.value;
        }

        this.setState({activeKey, imageRejectReason});
    }

    render() {
        const {noPassOptions, activeKey, imageRejectReason} = this.state;
        // let activeKeys = this.state.activeKey;
        return (
            <Collapse bordered={false} activeKey={activeKey} onChange={e => {
              this.setState({activeKey: e})
            }}>
                {this.renderPanel(noPassOptions)}
                <Panel header="其它原因" key="4">
                    <Input type="textarea" value={imageRejectReason['other']} onChange={e=>{
                       this.valueHandle.bind(this,{e})();
                    }} className="mt-10" placeholder="请输入其它原因" rows={4} />
                </Panel>
            </Collapse>
        )
    };

    renderPanel(list) {
        return  list.map((item, i) => {
            return (<Panel header={item.label} key={i}>{this.renderCheckbox(item.childNodes,item.label)}</Panel>)
        });
    };

    renderCheckbox(list,label){
        return list.map((item, i) => {
            return (
                <div className="creativeReasonCheckboxGroup">
                    <h4>{item.label}</h4>
                    <CheckboxGroup options={item.childNodes} value={this.state.imageRejectReason[item.value]}  onChange={checkedValue=>this.valueHandle.bind(this, {checkedValue, item})()} key = {i} />
                </div>
            )
        });
    };

    // 处理不通过原因选择和输入不通过原因公共方法
    valueHandle({checkedValue, item, e}){
        let {imageRejectReason} = this.state;
        if(checkedValue){
            imageRejectReason[item.value] = checkedValue;
        }else if(e){
            imageRejectReason.other = e.target.value;
        }

        this.setState({imageRejectReason});

        if(this.props.updateData) this.props.updateData({imageRejectReason});
    }

}
