import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Button, Radio, DatePicker, Checkbox, Select, message } from "antd";
import { formatDate, splitVal } from "./utils";
import filterData from "./filterData";
import SelectCity from "app/components/modal/selectCity";
import XTransfer from 'app/components/common/XTransfer';
import cs from 'classnames';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;

import { queryAccont } from "app/action_creators/editor_action_creator";
import { editJoinToSpecialList } from "app/action_creators/edit_action_creator";
import { getStorageFilter } from "app/action_creators/editor_action_creator";

let timer = null;

class FilterItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || '',
            selectsVal: {},
            data: props.data,
            options: []
        };
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        let { value, data } = this.state;

        if (!filterData.compare(value, nextProps.value)) {
            let timeValue = '', transferVal = '';
            if (typeof nextProps.value == 'string' && nextProps.value.indexOf('00:00:00,') != -1) {
                timeValue = formatDate(splitVal(nextProps.value).value);
                value = ''
            } else {
                value = nextProps.value;
                timeValue = '';
            }

            // console.log(nextProps.value)
            // console.log(transferVal)

            if (value && /search/.test(data.type)) {
                this.setState({
                    options: [{
                        key: splitVal(value).value,
                        label: splitVal(value).label
                    }]
                });
            }

            this.setState({
                value,
                timeValue
            })
        }

        if (!filterData.compare(data, nextProps.data)) {
            this.setState({ data: nextProps.data })
        }
    }

    componentWillUpdate() {

    }

    componentWillUnmount() {

    }

    getOptions(name, val) {
        if (!val) return;
        if (!timer) {
            timer = setTimeout(() => {
                this.fatchOptions(name, val)
            }, 1000)
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.fatchOptions(name, val)
            }, 1000)
        }
    }

    fatchOptions(name, val) {
        const { dispatch, comboboxSearch, assetFamily } = this.props;
        if (name === 'topicId') {
            dispatch(editJoinToSpecialList({
                keyword: val,
                pageNumber: 1,
                pageSize: 100
            })).then(res => {
                if (res.apiError) {
                    this.message(res.apiError.errorMessage);
                    return false
                }

                res.apiResponse.length && this.setState({
                    options: res.apiResponse.map(item => {
                        return {
                            key: item.id,
                            label: item.title
                        }
                    })
                })
            });

            return false;
        } else if (name === 'accountId') {
            dispatch(queryAccont({
                searchName: val
            })).then(res => {
                if (res.apiError) {
                    this.message(res.apiError.errorMessage);
                    return false
                }

                res.apiResponse.length && this.setState({
                    options: res.apiResponse.map(item => {
                        return {
                            key: item.accountId.replace('|', '*'),
                            label: item.accountName
                        }
                    })
                })
            });

            return false;
        }

        let param = {
            searchName: val,
            assetFamily
        };
        let paramType = 1;
        let dataName = '';

        switch (name) {
            case 'agency':
                paramType = 2;
                dataName = 'agency';
                break;
            case 'providerId':
                paramType = 3;
                dataName = 'photographer';
                break;
            case 'editUserId':
                paramType = 4;
                dataName = 'user';
                break;
        }

        // //console.log(param);

        dispatch(comboboxSearch({
            paramType,
            param
        })).then(result => {
            if (result.apiError) {
                message.error(result.apiError.errorMessage);
                return false
            }

            if (result.apiResponse[dataName] && result.apiResponse[dataName].length) {
                const options = result.apiResponse[dataName].map((item) => {
                    let label = item.nameCn || item.name;
                    if (name == 'providerId') {
                        label = `${item.nameCn}（${item.id}）`
                        if (item.city) {
                            label += '+ ' + item.city
                        }
                        if (item.company) {
                            label += '+ ' + item.company
                        }
                    }
                    return {
                        key: item.id || item.partyId,
                        label,
                        agencyType: item.type
                    }
                })

                this.setState({
                    options
                });
            }
        })
    }

    handleChange(e, t) {
        const { onChange, data } = this.props;
        const oldVal = this.state.value;
        let val = '';

        if (/time/.test(data.type)) {
            //console.log(e, t);

            if (e.target) { //tag
                val = e.target.value == oldVal ? '' : e.target.value;
                // this.state.timeValue = '';
            } else {
                val = e.length ? `${data.id}|${data.text}|${t[0]} 00:00:00,${t[1]} 23:59:59` : '';
                // this.state.timeValue = e.length ? e : '';
            }
        } else if (/sels/.test(data.type)) {
            let selectsVal = {};
            if(e.target){ // tag

                // selectsVal= e.target.value ? splitVal(e.target.value).value : ''
                val = e.target.value
            }else{ // select
                // selectsVal = e;
                selectsVal[t] = e
                val = e
            }

            this.setState({selectsVal})

            // val = `${data.id}|${data.label}|${Object.values(selectsVal).toString()}`
            // console.log(val)
            // console.log(e, t)
            // console.log(selectsVal)
            // console.log(data.selectOptions)
        } else if (/search|select/.test(data.type)) {
            if (e.target) {
                val = e.target.value == oldVal ? '' : e.target.value;
            } else {
                val = e
            }
        } else if (/checkbox/.test(data.type)) {
            val = e;
        } else if (/area/.test(data.type)) {
            if (!t.length) {
                val = '';
                this.state.areaValue = undefined;
            } else {
                const label = t.map(item => item.label).join('*');
                val = `${data.id}|${label}|${label}`;
                this.state.areaValue = t;
            }
        } else if (/tag/.test(data.type)) {
            val = e.target.value == oldVal ? '' : e.target.value;
        } else if (/transfer/.test(data.type)) {
            val = e.map(item => data.id + '|' + item)
            // const transferVal = /(\d+)(?=\))/g
            // // console.log(e)
            // val = e.filter(item => item.match(transferVal)).map(item => `${data.id}|${data.text}|${item.match(transferVal)[0]}`)
        }

        // console.log(val)

        if (!val) {
            val = `${data.id}||`;
        } else if (val.length == 0) {
            val.push(`${data.id}||`);
        }

        onChange(data.field, val);
    }

    toggleMultiple() {
        const { onChange } = this.props;
        let { data } = this.state;
        let val = '';
        // console.log(data)
        if (data.multiple.status) {
            // if (data.field === 'agency') {
            //     data.type = 'tag,search';
            // } else {
            //     data.type = 'tag';
            // }
            data.type = 'tag';
            data.multiple.status = false;
            val = `${data.id}||`;
        } else {
            val = [];
            data.type = 'checkbox';
            data.multiple.status = true;
            val.push(`${data.id}||`);
        }

        // onChange(data.field, val)
    }

    clearValue(val) {
        const { data, onChange } = this.props;
        let value = val || `${data.id}||`;
        onChange(data.field, value);
    }

    render() {
        const { assetFamily } = this.props;
        let { data, timeValue, areaValue, options, transferVal, value, selectsVal } = this.state;
        // console.log(data, timeValue, areaValue, options, transferVal, value, selectsVal)

        if (/checkbox/.test(data.type)) {
            data.options = data.options.filter(item => item.id !== '-1');
        }


        const optionObj = data.options.reduce((result, cur) => {
            if (result[cur.type]) {
                result[cur.type].push({
                    label: cur.text,
                    value: `${data.id}|${cur.text}|${cur.id}`
                });
            } else {
                let arr = []; arr.push({
                    label: cur.text,
                    value: `${data.id}|${cur.text}|${cur.id}`
                }); result[cur.type] = arr
            };
            return result
        }, {});

        if (/select/.test(data.type)) {
            if (!data.options.some(option => {
                return `${data.id}|${option.label}|${option.key}` == value
            })) {
                value = undefined
            }
        }

        if (/search/.test(data.type)) {
            if (!options.some(option => {
                return `${data.id}|${option.label}|${option.key}` == value
            })) {
                value = undefined
            }
        }

        value = /\|\|/.test(value) || !value ? undefined : value;

        if (/transfer/.test(data.type)) {
            value = (value && value.length) ? value.map(item => item.substr((item.indexOf('|') + 1))) : []
        }

        return (
            <div className="ant-row ant-form-item">
                <div className="ant-col-2 ant-form-item-label">
                    <label>{data.text}</label>
                </div>
                <div className="ant-col-22">
                    <div className="ant-form-item-control">
                        {/sels/.test(data.type) && data.selectOptions.map((select, index) => {
                            return <Select value={selectsVal[select.id]} placeholder={select.placeholder} style={{ width: 120, marginLeft: 10 }} onChange={(val) => {
                                this.handleChange(val, select.id)
                                }}>{select.options.map(option => <Option value={`${data.id}|${option.text}|${option.id}`}>{option.text}</Option>)}</Select>
                        })}

                        {(/tag/.test(data.type)) && Object.values(optionObj).map(opts => <div className="radio-tag-container"><RadioGroup size="small" value={value} onChange={this.handleChange.bind(this)}>{opts.map(radio => {
                            return <RadioButton value={radio.value}>{radio.label}</RadioButton>
                        })}</RadioGroup></div>)}

                        {/time/.test(data.type) &&
                            <RangePicker size="default" onChange={this.handleChange.bind(this)} format="YYYY-MM-DD"
                                value={timeValue}
                                style={{ width: 200, marginLeft: 20 }} />}

                        {/select/.test(data.type) &&
                            <Select notFoundContent="暂无数据" allowClear size="default" optionFilterProp="children" value={value} placeholder="请选择"
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onSelect={this.handleChange.bind(this)}
                                onChange={this.clearValue.bind(this)}
                                style={{ width: data.width || 280, marginLeft: 10 }}>{data.options.filter(option => option.key).map(item => <Option
                                    value={`${data.id}|${item.label}|${item.key}`} title={item.label}>{item.label}</Option>)}</Select>}
                        {/search/.test(data.type) &&
                            <Select onBlur={() => {
                                if (!value || options.map(option => option.key).indexOf(value.split('|')[2]) == -1) {
                                    this.clearValue()
                                }
                            }} notFoundContent="暂无数据" defaultActiveFirstOption={false} allowClear size="default" showSearch optionFilterProp="children" value={value} placeholder="请选择"
                                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onSelect={this.handleChange.bind(this)} onSearch={this.getOptions.bind(this, data.field)}
                                onChange={this.clearValue.bind(this)}
                                style={{ width: 280 }}>{options.filter(option => option.key).map(item => <Option
                                    value={`${data.id}|${item.label}|${item.key}`} title={item.label}>{item.label}</Option>)}</Select>}
                        {/area/.test(data.type) &&
                            <SelectCity
                                style={{ width: 200, marginLeft: 20 }}
                                onSelect={this.handleChange.bind(this)}
                                value={areaValue || []}
                                dispatch={this.props.dispatch} /*stepStr = "0,2"*/ />}
                        {/transfer/.test(data.type) &&
                            <XTransfer assetFamily={assetFamily} resOptionsName={data.syncOptions.resOptionsName} oftenOptions={data.oftenOptions} value={value} title={data.syncOptions.title} onChange={this.handleChange.bind(this)} action={getStorageFilter} params={{ 'paramType': data.syncOptions.paramType }} style={{ width: 500 }} placeholder="请输入供稿人名称/ID" />}
                        {/checkbox/.test(data.type) && Object.keys(optionObj).map((key, index) => <div className={cs({ "radio-tag-container": true, 'tag-group-container': (key != undefined && index) })}><CheckboxGroup value={value} options={optionObj[key]} onChange={this.handleChange.bind(this)} /></div>)}

                        {/* {/checkbox/.test(data.type) &&
                        <CheckboxGroup value={value} options={plainOptions} onChange={this.handleChange.bind(this)}/>} */}

                        {(data.multiple && data.options.filter(item => item.id != -1).length > 0) &&
                            <Button className="checkbox-toggle-btn" onClick={this.toggleMultiple.bind(this)}
                                size="small">{data.multiple.status ? '单选' : '多选'}</Button>}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(FilterItem);
