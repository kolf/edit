import React, {Component} from "react";
import {connect} from "react-redux";
import moment from 'moment';
import {
    Form,
    Input,
    Button,
    Select,
    message,
    Spin,
    Radio,
    Icon
} from 'antd';

import XCheckboxGroup from 'app/components/common/XCheckboxGroup/index';
import XInput from 'app/components/common/XInput/index';
import XTimeGroup from 'app/components/common/XTimeGroup/index';
import XTransfer from 'app/components/common/XTransfer/index';
import './style.scss';

import {
    getStorageFilter
} from "app/action_creators/editor_action_creator";
import storage from 'app/utils/localStorage';

const FormItem = Form.Item;
const CreateForm = Form.create;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 20
    }
};

const offsetFormItemLayout = {
    wrapperCol: {
        span: 20,
        offset: 4
    }
};

const scopeObj = {
    1: [{label: '全部', value: 'all'},{label: '标题', value: '1'}, {label: '组关键词', value: '2'}, {label: '组说', value: '3'}],
    2: [{label: '全部', value: 'all'},{label: '图关键词', value: '4'}, {label: '图说', value: '5'}]
};
const imageScopeOpts = [{label: '全部', value: 'all'},{label: '图关键词', value: '4'}, {label: '图说', value: '5'}];
const groupScopeOpts = [{label: '全部', value: 'all'},{label: '标题', value: '1'}, {label: '组关键词', value: '2'}, {label: '组说', value: '3'}];
const graphicalTypeOpts = [{label: '全部', value: 'all'},{label: '摄影图片', value: '1'}, {label: '插画', value: '2'}, {label: '漫画', value: '3'}, {label: '图表', value: '4'}];
const picSizeOpts = [{label: '全部', value: 'all'},{label: 'a<2000', value: '1'}, {label: '2000<=a<3000', value: '2'}, {label: '3000<=a<4000', value: '3'}, {label: '4000<=a<5000', value: '4'}, {label: 'a>=5000', value: '5'}];
const orientationOpts = [{label: '全部', value: 'all'},{label: '横图', value: 1}, {label: '竖图', value: 2}];
const qualityRankOpts = [{label: '全部', value: 'all'},{label: 'A级', value: '1'}, {label: 'B级', value: '2'},{label: 'C级', value: '3'}, {label: 'D级', value: '4'},{label: 'E级', value: '5'}];
const timelinessOpts = [{label: '全部', value: 'all'},{label: '时效图', value: '0'}, {label: '资料图', value: '1'}];
const onlineStateOpts = [{label: '全部', value: 'all'},{label: '未上线', value: '2'}, {label: '已上线', value: '1'}, {label: '已下线', value: '3'}];
const onlineTypeOpts = [{label: '全部', value: 'all'},{label: '审核上线', value: '1'}, {label: '自动上线', value: '2'}];
const groupStateOpts = [{label: '全部', value: 'all'},{label: '未编审', value: '1'}, {label: '待编审', value: '2'}, {label: '二审', value: '3'}, {label: '已发布', value: '4'}];
const imageStateOpts = [{label: '全部', value: 'all'},{label: '待编审', value: '1'}, {label: '已通过', value: '2'}, {label: '不通过', value: '3'}];
const providerOpts = [{label: '全部', value: 0},{label: '机构', value: 1}, {label: '供稿人', value: 2}];
const assetFamily = 1;

const formatVal = (values) => {
    //console.log(values);

    return Object.keys(values).reduce((result, key) => {
        const value = values[key];

        // if(!value) return result;

        if(typeof value == 'string'){
            result[key] = value == 'all' ? '' : value;
        }else if(Array.isArray(value)){
            if(key.indexOf('Time')!=-1){
                result[key] = value[0].format('YYYY-MM-DD HH:mm:ss')
                result[key] += ','+value[1].format('YYYY-MM-DD HH:mm:ss')
            }else{
                result[key] = (value.length==1 && value[0]=='all') ? '' : value.join(',')
            }

            result[key] = result[key].replace(/\*\d+/g, '')
        }else if(typeof value == 'number'){
            result[key] = value || 0;
        }else{
            result[key] = value || '';
        }
        return result;
    }, {})
}


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // scopeOpts: scopeObj[1],
            categoryOpts: [],
            idError: ''
        }
    }

    componentWillMount() {
        this.queryCategory(1)
    }

    componentWillReceiveProps(nextProps) {}

    submit = () => {
        const {idError} = this.state;

        if(idError){
            return;
        }

        const {form: {validateFields, getFieldsValue}} = this.props;

        validateFields(error => {
            if(error) return false;
            const creds = formatVal(getFieldsValue());
            const time = Date.now();
            //console.log(creds)

            window.open('/zh/search/' + time)

            storage.set(time, JSON.stringify(creds))
        })
    }

    reset = () => {
        this.props.form.resetFields();
        this.queryCategory(1);
        this.setState({
            scopeOpts: scopeObj[1]
        });
    }

    queryCategory = (graphicalType) => {
        const defaultOptions = [{label: '全部', value: 'all'}];
        const {dispatch} = this.props;

        dispatch(getStorageFilter({
            paramType: 1,
            param: {
                resGroup: 1,
                graphicalType,
                assetFamily
            }
        })).then(res => {
            if(res.apiError){
                message.error(res.apiError.errorMessage);
                return false
            }

            let categoryOpts = res.apiResponse.category ? res.apiResponse.category.map(item => ({label: item.name || item.nameCn, value: item.id, group: item.graphicalType})) : [];
            categoryOpts = defaultOptions.concat(_.uniq(categoryOpts, 'value'));

            this.setState({categoryOpts});
        })
    }

    render() {
        const {form: {
                getFieldDecorator,
                getFieldValue,
                setFieldsValue,
                resetFields
            }} = this.props;
        const {scopeOpts, categoryOpts, idError} = this.state;

        const isImage = (getFieldValue('resGroup') == 2) ? true : false;

        return (
            <div className="container">
                <div className="search-heading clearfix">
                    <h2 className="">高级搜索</h2>
                    <div>
                        {false && <Button size="large" className=""><Icon type="camera" />以图搜图</Button>}

                        <div className="text-center">
                             <Button onClick={this.submit} size="large" type="primary" className="search-btn search-btn-big">提交</Button>
                            <Button onClick={this.reset} size="large" className="search-btn ml-10 search-btn-big">重置</Button>
                        </div>
                    </div>
                </div>
                <Form className="search-list">
                    <div className="search-item">
                        <div className="search-label">搜索ID:
                        </div>
                        <FormItem {...formItemLayout} label="组照 ID">
                            {getFieldDecorator('groupId', {
                                onChange: (value) => {
                                    this.setState({
                                        idError: (getFieldValue('resId') && value) ? '组照ID与单张ID只能输入一个，请清空其中一个' : ''
                                    })
                                }
                            })(<XInput size="default" placeholder="搜索多个ID时可用逗号隔开"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="单张 ID">
                            {getFieldDecorator('resId', {
                                onChange: (value) => {
                                    this.setState({
                                        idError: (getFieldValue('groupId') && value) ? '组照ID与单张ID只能输入一个，请清空其中一个' : ''
                                    })
                                }
                            })(<XInput size="default" placeholder="搜索多个ID时可用逗号隔开"/>)}
                        </FormItem>
                         {idError && <FormItem validateStatus='error' {...offsetFormItemLayout} style={{marginTop: '-10px'}}>
                            <div className="ant-form-explain">{idError}</div>
                        </FormItem>}
                    </div>
                    <div className="search-item">
                        <div className="search-label">展示方式:
                        </div>
                        <FormItem {...formItemLayout} label="搜索结果展示">
                            {getFieldDecorator('resGroup', {
                                initialValue: '1',
                                onChange: (e) => {
                                    const {value} = e.target;

                                    setFieldsValue({
                                        groupScope: ['all'],
                                        imageScope: 'all'
                                    });

                                }
                            })(
                                <RadioGroup>
                                    <Radio value='1'>按组照</Radio>
                                    <Radio value='2'>按单张</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">搜索结果:
                        </div>
                        <FormItem {...formItemLayout} label="包含全部关键词">
                            {getFieldDecorator('keywordAnd', {})(<XInput size="default" placeholder="搜索多个关键词时可用逗号隔开"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="不包含关键词">
                            {getFieldDecorator('keywordNot', {})(<XInput size="default" placeholder="搜索多个关键词时可用逗号隔开"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="包含任意一个关键词">
                            {getFieldDecorator('keywordOr', {})(<XInput size="default" placeholder="搜索多个关键词时可用逗号隔开"/>)}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">搜索范围:
                        </div>
                        {!isImage && <FormItem {...formItemLayout} label="搜索关键词位于">
                            {getFieldDecorator('groupScope', {
                                initialValue: ['all']
                            })(
                                <XCheckboxGroup options={groupScopeOpts}/>
                            )}
                        </FormItem>}
                        {isImage && <FormItem {...formItemLayout} label="搜索关键词位于">
                            {getFieldDecorator('imageScope', {
                                initialValue: 'all'
                            })(
                                <RadioGroup>
                                    {imageScopeOpts.map(option => <Radio value={option.value}>{option.label}</Radio>)}
                                </RadioGroup>
                            )}
                        </FormItem>}
                    </div>
                    <div className="search-item">
                        <div className="search-label">内容类型:
                        </div>
                        <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('graphicalType', {
                                initialValue: ['1'],
                                onChange: (val) => {
                                    if(val[0]=='all'){
                                        this.queryCategory('')
                                    }else{
                                        const graphicalType = val.join(',');
                                        this.queryCategory(graphicalType)
                                    }
                                }
                            })(
                                <XCheckboxGroup options={graphicalTypeOpts}/>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">分类:
                        </div>
                        <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('category', {
                                initialValue: ['all']
                            })(
                                <XCheckboxGroup options={categoryOpts}/>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">供应商:
                        </div>
                        <FormItem {...formItemLayout} label="（单张搜索有效）">
                            {getFieldDecorator('providerAgentType', {
                                initialValue: 0
                            })(
                                <RadioGroup>
                                    {providerOpts.map(option => <Radio value={option.value}>{option.label}</Radio>)}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="机构">
                            {getFieldDecorator('agency', {
                                onChange: (val) => {
                                    //console.log(val)
                                }
                            })(
                                <XTransfer title="机构" resOptionsName="agency" params={{'paramType': 2}} action={getStorageFilter} placeholder="请输入机构名称/ID"/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="供稿人">
                            {getFieldDecorator('providerId', {
                                onChange: (val) => {
                                    //console.log(val)
                                }
                            })(
                                <XTransfer title="供稿人" resOptionsName="photographer" params={{'paramType': 3}} action={getStorageFilter} placeholder="请输入供稿人名称/ID"/>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">编审状态:
                        </div>
                        {!isImage && <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('groupState', {
                                initialValue: ['all']
                            })(
                                <XCheckboxGroup options={groupStateOpts}/>
                            )}
                        </FormItem>}
                        {isImage && <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('imageState', {
                                initialValue: 'all'
                            })(
                                <RadioGroup>
                                    {imageStateOpts.map(option => <Radio value={option.value}>{option.label}</Radio>)}
                                </RadioGroup>
                            )}
                        </FormItem>}
                    </div>
                    <div className="search-item">
                        <div className="search-label">上线状态:
                        </div>
                        <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('onlineState', {
                                initialValue: ['all']
                            })(
                                <XCheckboxGroup options={onlineStateOpts}/>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">上线方式:
                        </div>
                        <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('onlineType', {
                                initialValue: 'all'
                            })(
                                <RadioGroup>
                                    {onlineTypeOpts.map(option => <Radio value={option.value}>{option.label}</Radio>)}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">上传时间:
                        </div>
                        <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('uploadTime', {
                                initialValue: 'all'
                            })(
                                <XTimeGroup />
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">编审时间:
                        </div>
                        <FormItem {...offsetFormItemLayout} >
                            {getFieldDecorator('editTime', {
                                initialValue: 'all'
                            })(
                                <XTimeGroup />
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">资料/时效:
                        </div>
                        <FormItem {...formItemLayout} label="(组照搜索有效)">
                            {getFieldDecorator('timeliness', {
                                initialValue: 'all'
                            })(
                                <RadioGroup>
                                    {timelinessOpts.map(option => <Radio value={option.value}>{option.label}</Radio>)}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">图片等级:
                        </div>
                        <FormItem {...formItemLayout} label="（单张搜索有效）">
                            {getFieldDecorator('qualityRank', {
                                initialValue: ['all']
                            })(
                                <XCheckboxGroup options={qualityRankOpts}/>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">横图/竖图:
                        </div>
                        <FormItem {...formItemLayout} label="（单张搜索有效）">
                            {getFieldDecorator('orientation', {
                                initialValue: 'all'
                            })(
                                <RadioGroup>
                                    {orientationOpts.map(option => <Radio value={option.value}>{option.label}</Radio>)}
                                </RadioGroup>
                            )}
                        </FormItem>
                    </div>
                    <div className="search-item">
                        <div className="search-label">图片精度:
                        </div>
                        <FormItem {...formItemLayout} label="（单张搜索有效）">
                            {getFieldDecorator('picSize', {
                                initialValue: ['all']
                            })(
                                <XCheckboxGroup options={picSizeOpts}/>
                            )}
                        </FormItem>
                    </div>
                </Form>
                <div className="search-footer text-center  btn-lg">
                    <Button size="large" onClick={this.submit} type="primary" className="search-btn search-btn-big">提交</Button>
                    <Button size="large" onClick={this.reset} size="large" className="search-btn ml-10 search-btn-big">重置</Button>
                </div>
            </div>
        )
    }
}

export default connect()(CreateForm()(Search));
