import React, {Component, PropTypes}    from "react";
import {connect} from "react-redux";
import { Form, Input,Button, Radio} from 'antd';
const CreateForm = Form.create;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

class TextReplace extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    handleSubmit(e){
      e.preventDefault();

      this.props.form.validateFields((errors) => {
        if (errors) {
          return false;
        }
        const creds = (this.props.form.getFieldsValue());
        const escArr= "*.?+$^[](){}|/".split('');
        let {find, replace, findType} = creds;

        replace = creds.replace || '';

        for(const i in find){
            if(escArr.indexOf(find[i])!=-1){
                find[i]="\\"+find[i]
            }
        }

        this.props.onSubmit({find, replace}, findType)
      });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
          labelCol: { span: 5 },
          wrapperCol: { span: 16 },
        };

        const tailFormItemLayout = {
          wrapperCol: {span: 16, offset: 5}
        };

        return (
            <Form ref={this.props.refName} horizontal className="modal-from" onSubmit={this.handleSubmit.bind(this)}>
                <FormItem  {...formItemLayout} label="查找范围" >
                    {getFieldDecorator('findType', {
                        initialValue: 'caption',
                        rules: [
                          { required: true, message: '请选择查找范围' },
                        ],
                    })(
                        <RadioGroup>
                          <Radio value="caption">图说</Radio>
                          <Radio value="keyword">关键词</Radio>
                        </RadioGroup>
                    )}
                  </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="查找内容"
                >
                  {getFieldDecorator('find', {
                    rules: [
                      { required: true, message: '请输入查找内容' },
                    ],
                  })(
                    <Input style={{height: 80}} type="textarea" />
                  )}
                </FormItem>

                <FormItem
                    style={{marginBottom: 10}}
                  {...formItemLayout}
                  label="替换内容"
                >
                  {getFieldDecorator('replace', {
                    rules: [
                    //   { required: true, message: '请输入替换内容' },
                    ],
                  })(
                    <Input style={{height: 80}} type="textarea" />
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} >
                  <Button onClick={this.props.onCancel}>取消</Button>
                  <Button type="primary" htmlType="submit" style={{marginLeft: 10}}>替换</Button>
                </FormItem>
            </Form>
        );
    }
}

export default connect()(CreateForm()(TextReplace));
