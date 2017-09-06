import React, {Component} from 'react';
import {Checkbox} from 'antd';
import {compareArr} from 'app/utils/utils';
import cs from 'classNames'

const CheckboxGroup = Checkbox.Group;
import './style.scss';

class XCheckboxGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || (props.type !== 'transfer' ? ['all'] : []),
            options: props.options
        };
    };

    componentWillReceiveProps(nextProps) {
        const {type} = this.props;
        const {value, options} = this.state;

        if (!compareArr(value, nextProps.value) && nextProps.value) {
            this.setState({value: nextProps.value})
        }

        if (!compareArr(options, nextProps.options)) {
            this.setState({options: nextProps.options});

            if (nextProps.options.length === 1 && type !== 'transfer') {
                this.state.value = ['all']
            }
        }

    }

    onChange = (e) => {
        const {onChange, value, type} = this.props;
        const {options} = this.state;
        // const {value, checked} = e.target;
        const checkedVal = e.target.value;
        const checked = e.target.checked;
        let vals = this.state.value || [];
        let removeVal = ''

        if (checked) {
            if (checkedVal === 'all') {
                vals = ['all']
            } else {
                if (vals[0] == 'all') {
                    vals = []
                }
                vals.push(checkedVal)
            }
        } else {
            vals = vals.filter(val => {
                removeVal = checkedVal
                return val != checkedVal
            });
            if(!vals.length && type!=='transfer'){
                vals = ['all']
            }
        }

        if(!value){
            this.setState({
                value: vals
            })
        }

        const valsOptions = options.filter(option => vals.indexOf(option.value)!=-1)

        onChange && onChange(vals, valsOptions, removeVal)
    }

    render() {
        const {options, value} = this.state;
        const {wrapClass} = this.props;
        const optionsObj = options.reduce((result, item) => {
            const group = item.group || 1;

            if(result[group]){
                result[group].push(item)
            }else{
                result[group] = [item]
            }
            return result;
        }, {});

        return <div className={cs('ant-checkbox-group', [wrapClass])}>
            {Object.keys(optionsObj).map(key => {
                return <div className="checkbox-group">
                    {optionsObj[key].map(item => {
                        return <Checkbox
                            checked={value.indexOf(item.value) != -1}
                            onChange={this.onChange}
                            value={item.value}>{item.label.replace(/\([0-9,-]+\)/, '')}
                        </Checkbox>
                    })}
                </div>
            })}
        </div>
    }
}

export default XCheckboxGroup
