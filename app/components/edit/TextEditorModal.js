import React, {Component, PropTypes} from "react";
import {
    Form,
    Input,
    Button,
    Radio,
    DatePicker,
    Select,
    Checkbox
} from 'antd'
const Option = Select.Option
const CreateForm = Form.create
const RadioGroup = Radio.Group
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

import SelectArea from 'app/components/common/SelectArea'

const formItemLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 16
    }
}

const formTailLayout = {
    labelCol: {
        span: 5
    },
    wrapperCol: {
        span: 16,
        offset: 5
    }
}

class TextEditorModal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {getFieldDecorator} = this.props.form

        return (
            <Form className="modal-from">
                <FormItem {...formItemLayout} label="拍摄时间">
                    {getFieldDecorator('createdTime', {})(<DatePicker/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="拍摄地点">
                    {getFieldDecorator('area', {})(<SelectArea/>)}
                </FormItem>
                <FormItem {...formItemLayout} label="关键词">
                    {getFieldDecorator('tags', {})(<Input
                        type="textarea"
                        placeholder="请输入关键词"
                        style={{
                        height: 80
                    }}/>)}
                </FormItem>
                <FormItem {...formTailLayout} label="">
                    {getFieldDecorator('tagType', {initialValue: 1})(
                        <RadioGroup>
                            {['覆盖', '追加', '清空人物关键词'].map((item, index) => <Radio value={index}>{item}</Radio>)}
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="图说">
                    {getFieldDecorator('caption', {})(<Input
                        type="textarea"
                        placeholder="请输入图说"
                        style={{
                        height: 80
                    }}/>)}
                </FormItem>
                <FormItem {...formTailLayout}>
                    {getFieldDecorator('captionType', {initialValue: 'after'})(
                        <RadioGroup>
                            {[
                                {
                                    label: '覆盖',
                                    value: 'sync'
                                }, {
                                    label: '前追加',
                                    value: 'before'
                                }, {
                                    label: '后追加',
                                    value: 'after'
                                }
                            ].map((item, index) => <Radio value={item.value}>{item.label}</Radio>)
}
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem
                    {...formTailLayout}
                    style={{
                    top: '-12px'
                }}>
                    {getFieldDecorator('captionArea', {initialValue: ['caption']})(<CheckboxGroup
                        options={[
                        {
                            label: '新加图说',
                            value: 'caption'
                        }, {
                            label: '原始图说',
                            value: 'providerCaption'
                        }
                    ]}/>)}
                </FormItem>
                

                <FormItem
                    {...formTailLayout}
                    style={{
                    top: '-12px'
                    }}>
                    {getFieldDecorator('history', {
                        valuePropName: 'checked',
                        initialValue: false
                    })(<Checkbox>保留本次记录</Checkbox>)}
                </FormItem>
            </Form>
        )
    }
}

export default TextEditorModal