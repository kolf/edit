import React, {Component, PropTypes} from "react";
import {connect}    from "react-redux";
import {Row, Col, Select, message, Form, Button, Input} from "antd";

const CreateForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

class PushStep2 extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    };

    componentWillMount() {

    };

    componentWillReceiveProps(nextProps) {

    };

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div>
                <Form horizontal form={this.props.form} className="ant-col-22">
                    <div className="ant-row">
                        <div className="ant-col-24">
                            <FormItem label="组照标题" className="mb-10" labelCol={{span: 2}} wrapperCol={{span: 22}}>
                                {getFieldDecorator('title', {

                                })(<Input type="text" placeholder="请输入组照标题"/>)}
                            </FormItem>
                        </div>
                    </div>
                    <div className="ant-row">
                        <div className="ant-col-8">
                            <FormItem label="分类"  placeholder="请选择" className="mb-10" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                                {getFieldDecorator('class', {

                                })(<Select>
                                      {['A', 'I', 'S', 'E', 'SL'].map(item => <Option value={item}>{item}</Option>)}
                                  </Select>)}
                            </FormItem>
                        </div>
                        <div className="ant-col-16">
                            <FormItem label="补充分类" className="mb-10" labelCol={{span: 3}} wrapperCol={{span: 21}}>
                                {getFieldDecorator('otherClass', {

                                })(<Input type="text" placeholder="请输入补充分类"/>)}
                            </FormItem>
                        </div>
                    </div>
                    <div className="ant-row">
                        <div className="ant-col-8">
                            <FormItem label="Media Event ID" className="mb-10" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                                {getFieldDecorator('event', {

                                })(<Input type="text" placeholder="请输入Media Event ID"/>)}
                            </FormItem>
                        </div>
                        <div className="ant-col-8">
                            <FormItem label="Copyright" className="mb-10" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                                {getFieldDecorator('copyright', {
                                    initialValue: '2017 VCG'
                                })(<Input type="text" placeholder="请输入Copyright"/>)}
                            </FormItem>
                        </div>
                        <div className="ant-col-8">
                            <FormItem label="Source" className="mb-10" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                                {getFieldDecorator('source', {
                                    initialValue: 'Visual China Group'
                                })(<Input type="text" placeholder="请输入Source"/>)}
                            </FormItem>
                        </div>
                    </div>

                </Form>
            </div>
        );
    };
}

export default connect()(CreateForm()(PushStep2));
