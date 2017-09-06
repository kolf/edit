import React, { Component, PropTypes } from 'react';
import {reduxForm}                     from 'redux-form';
import validation                      from "./validation";
import {isEn} from "app/utils/utils";
import TagInput from 'app/components/common/TagInput/index';

import {
    Form, Input, Select, Radio, Button
} from 'antd';

@reduxForm(
    {
        "form": "tagForm",
        "fields":[
            'id',
            'pid',
            'cnname',
            'cnsyno',
            'enname',
            'ensyno',
            'kind',
            'memo',
            'operate',
            'type'
        ],
        validate: validation
    }
)
export default class TagForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    static propTypes = {
        "fields": PropTypes.object.isRequired,
        "handleSubmit": PropTypes.func.isRequired,
        "pristine": PropTypes.bool.isRequired,
        "resetForm": PropTypes.func.isRequired,
        "submitting": PropTypes.bool.isRequired
    };

    componentWillMount() {

    };

    componentWillReceiveProps(nextProps){
        //console.log(nextProps);
    };

    render() {
        const {
            fields: {
                id,
                pid,
                cnname,
                cnsyno,
                enname,
                ensyno,
                kind,
                memo,
                operate,
                type
            },
            handleSubmit,
            pristine,
            resetForm,
            submitting,
            operateType,
            moduleType
        } = this.props;

        const FormItem = Form.Item;
        const RadioGroup = Radio.Group;

        const Option = Select.Option;

        const lang = {
            zh: ['* 中文名', '中文名'],
            en: ['* 英文名', '英文名']
        };

        return (
            <Form horizontal onSubmit={handleSubmit}>

                <FormItem
                    label={isEn() ? lang.zh[1] : lang.zh[0]}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    className={cnname.touched && cnname.error && "has-error"}
                    style={{marginBottom:'10px',marginTop:'10px'}}
                    >
                    <Input placeholder="请输入中文名" {...cnname} disabled={operateType=="view"} />
                    {cnname.touched && cnname.error && <span className="ant-form-explain">{cnname.error}</span>}
                </FormItem>

                <FormItem
                    label="中文同义词"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    className={cnsyno.touched && cnsyno.error && "has-error"}
                    style={{marginBottom:'10px'}}
                    >
                    <TagInput value={cnsyno.value} change={cnsyno.onChange} />
                    {cnsyno.touched && cnsyno.error && <span className="ant-form-explain">{cnsyno.error}</span>}
                </FormItem>

                <FormItem
                    label={(moduleType=="creative" || isEn()) ? lang.en[0] : lang.en[1]}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    className={enname.touched && enname.error && "has-error"}
                    style={{marginBottom:'10px'}}
                    >
                    <Input placeholder="请输入英文名" {...enname} disabled={operateType=="view"} />
                    {enname.touched && enname.error && <span className="ant-form-explain">{enname.error}</span>}
                </FormItem>

                <FormItem
                    label="英文同义词"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    className={ensyno.touched && ensyno.error && "has-error"}
                    style={{marginBottom:'10px'}}
                    >
                    <TagInput value={ensyno.value} change={ensyno.onChange} />
                    {ensyno.touched && ensyno.error && <span className="ant-form-explain">{ensyno.error}</span>}
                </FormItem>

                <FormItem
                    label="* 类型"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    className={kind.touched && kind.error && "has-error"}
                    style={{marginBottom:'10px'}}
                    >
                    <RadioGroup value={kind.value} disabled={operateType=="view"} onChange={this.onRadioKind.bind(this)}>
                        <Radio value={0}>主题</Radio>
                        <Radio value={1}>概念</Radio>
                        <Radio value={2}>规格</Radio>
                        <Radio value={3}>人物</Radio>
                        <Radio value={4}>地点</Radio>
                    </RadioGroup>
                    {kind.touched && kind.error && <div className="ant-form-explain">{kind.error}</div>}
                </FormItem>
                {/*非编审有层级结构*/}
                {moduleType != "edit" && <FormItem
                    label="* 父ID"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    className={pid.touched && pid.error && "has-error"}
                    style={{marginBottom:'10px'}}
                    >
                    <Input placeholder="请输入父ID" {...pid} disabled={operateType=="view"} />
                    {pid.touched && pid.error && <span className="ant-form-explain">{pid.error}</span>}
                </FormItem>}
{/*
                {moduleType == "edit" && <Input type="hidden" {...pid} touched = {true} /> }
                {pid.touched && pid.error && <span className="ant-form-explain">{pid.error}</span>} */}
                <FormItem
                    label="备注"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    style={{marginBottom:'10px'}}
                    >
                    <Input type="textarea" placeholder="输入备注" {...memo} disabled={operateType=="view"} />
                </FormItem>

                {operateType!="view" &&  <FormItem wrapperCol={{ span: 16, offset: 6 }}>
                    <Button type="primary" htmlType="submit" disabled={submitting}>
                        {submitting ? <i className="fa fa-cog fa-spin fa-fw" /> : <i className="fa fa-paper-plane" />} 确定
                    </Button> 
                    <Button type="ghost" disabled={submitting} onClick={resetForm}>重置</Button>
                </FormItem>}

            </Form>
        )
    }

    onSelectCnsyno (value) {
        this.props.fields.cnsyno.onChange(value);
    };

    onSelectEnsyno (value) {
        this.props.fields.ensyno.onChange(value);
    };

    onRadioKind (e){
        this.props.fields.kind.onChange(e.target.value);
    };

    onInput (name, val) {
        // //console.log(val);
        this.props.fields[name].onChange(val);
        // this.props.fields.cnsyno.value = val
    };

}
