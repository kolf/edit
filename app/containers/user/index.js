import React, {Component} from "react";
import {connect}          from "react-redux";

import CrumbsBox from "app/components/common/crumbs";

import {getStorage, clearStorage} from "app/api/auth_token";
import Card from "antd/lib/card";
import Spin from "antd/lib/spin";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import classNames from 'classnames';

import {getUserInfo, modifyPassword} from "app/action_creators/passport_action_creator";

const createForm = Form.create;
const FormItem = Form.Item;

function noop() {
    return false;
};

const select = (state) => ({
    personalData: state.person.data
});
@connect(select)

export default class UserContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            "crumbs": [
                { "path": "/home", "text": "首頁" },
                { "path": "/user", "text": "用户中心" },
                { "path": "/password", "text": "修改密码" }
            ],
            "personalData":{}
        };
    };

    componentWillMount() {
        document.title= '修改密码 - 用户中心 - 内容管理系统 - VCG © 视觉中国';
        this.queryData();
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    render() {
        const {crumbs, personalData} = this.state;
        return (
            <div className="main-content-inner">

                <CrumbsBox crumbs={crumbs} />

                <div className="page-content">
                    {/*personalData &&   <Row>
                            <Col sm={8}>
                                <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
                                    <div className="custom-image">
                                        <img alt="name" width="100%" src={personalData.avatar} />
                                    </div>
                                    <div className="custom-card pl-15">
                                        <p>{"姓名："+personalData.name}</p>
                                        <p>{"联系方式："+personalData.tel}</p>
                                        <p>{"职位："+personalData.job}</p>
                                        <p>{"备注："+personalData.caption}</p>
                                    </div>
                                </Card>
                            </Col>
                            <Col sm={16} style={{marginTop:"85px"}}>
                               
                            </Col>
                        </Row>
                    */}
                    {personalData && <Card className="pt-10 pb-10">
                                    <Demo userName={personalData.name} router={this.context.router} dispatch={this.props.dispatch} />
                                </Card>}
                    {!personalData && <Spin/>}
                </div>
            </div>
        );
    };

    queryData() {
        const {dispatch} = this.props;

        dispatch(getUserInfo({"token": getStorage('token')})).then((result) => {
            if (result.apiError) {
                Message.error(result.apiError.errorMessage);
                return false;
            }
            this.setState({"personalData": result.apiResponse});
        });
    }


}


let Demo = React.createClass({
    getInitialState() {
        return {
            passBarShow: false, // 是否显示密码强度提示条
            rePassBarShow: false,
            passStrength: 'L', // 密码强度
            rePassStrength: 'L',
        };
    },

    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                return;
            }

            let params = {
              "ucId": getStorage("ucId"),
              "newPassword": values.pass
            };

            this.props.dispatch(modifyPassword(params)).then((result) => {
                if (result.apiError) {
                    alert(result.apiError.errorMessage);
                    return false;
                }
                alert("修改成功");
                // 清除缓存 打开登录
                clearStorage();
                this.props.router.push("/login");
            });
        });
    },

    getPassStrenth(value, type) {
        if (value) {
            let strength;
            // 密码强度的校验规则自定义，这里只是做个简单的示例
            if (value.length < 6) {
                strength = 'L';
            } else if (value.length <= 9) {
                strength = 'M';
            } else {
                strength = 'H';
            }
            if (type === 'pass') {
                this.setState({ passBarShow: true, passStrength: strength });
            } else {
                this.setState({ rePassBarShow: true, rePassStrength: strength });
            }
        } else {
            if (type === 'pass') {
                this.setState({ passBarShow: false });
            } else {
                this.setState({ rePassBarShow: false });
            }
        }
    },

    checkPass(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'pass');

        if (form.getFieldValue('pass')) {
            form.validateFields(['rePass'], { force: true });
        }

        callback();
    },

    checkPass2(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'rePass');

        if (value && value !== form.getFieldValue('pass')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    },

    renderPassStrengthBar(type) {
        const strength = type === 'pass' ? this.state.passStrength : this.state.rePassStrength;
        const classSet = classNames({
            'ant-pwd-strength': true,
            'ant-pwd-strength-low': strength === 'L',
            'ant-pwd-strength-medium': strength === 'M',
            'ant-pwd-strength-high': strength === 'H',
        });
        const level = {
            L: '低',
            M: '中',
            H: '高',
        };

        return (
            <div>
                <ul className={classSet}>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-1"></li>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-2"></li>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-3"></li>
                    <span className="ant-form-text">
                        {level[strength]}
                    </span>
                </ul>
            </div>
        );
    },

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
                <Form horizontal form={this.props.form}>
                    <Row>
                        <Col span="10">
                            <FormItem {...formItemLayout} label="用户名" >
                              <span className="ant-form-text">{this.props.userName}</span>
                            </FormItem>
                        </Col>
                    </Row>
                   {/*<Row>
                        <Col span="10">
                            <FormItem
                                {...formItemLayout}
                                label="旧密码"
                                >{getFieldDecorator('oldPass', {
                                    rules: [
                                        { required: true, whitespace: true, message: '请填写旧密码' }
                                    ],
                                    onChange: (e) => {
                                        //console.log('旧密码：', e.target.value);
                                    },
                                })(
                                  <Input type="password"
                                      onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                      autoComplete="off" id="oldPass"
                                      />
                                )}
                            </FormItem>
                        </Col>
                    </Row>*/} 
                    <Row>
                        <Col span="10">
                            <FormItem
                                {...formItemLayout}
                                label="新密码"
                                >{getFieldDecorator('pass', {
                                    rules: [
                                        { required: true, whitespace: true, message: '请填写密码' },
                                        { validator: this.checkPass },
                                    ],
                                    onChange: (e) => {
                                        //console.log('密码：', e.target.value);
                                    }
                                })(
                                  <Input type="password"
                                      onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                      autoComplete="off" id="pass"
                                      />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="14">
                            {this.state.passBarShow ? this.renderPassStrengthBar('pass') : null}
                        </Col>
                    </Row>

                    <Row>
                        <Col span="10">
                            <FormItem
                                {...formItemLayout}
                                label="确认密码"
                                >
                                {getFieldDecorator('rePass', {
                                    rules: [{
                                        required: true,
                                        whitespace: true,
                                        message: '请再次输入密码',
                                    }, {
                                            validator: this.checkPass2,
                                        }],
                                })(
                                  <Input type="password"
                                      onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                      autoComplete="off" id="rePass"
                                      />
                                )}
                            </FormItem>
                        </Col>
                        <Col span="14">
                            {this.state.rePassBarShow ? this.renderPassStrengthBar('rePass') : null}
                        </Col>
                    </Row>
                    <Row>
                        <Col span="10">
                            <Col span="17" offset="7">
                                <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                            </Col>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    },
});

Demo = createForm()(Demo);
