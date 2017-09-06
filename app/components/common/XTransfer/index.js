import React, { Component } from 'react';
import { connect } from "react-redux";
import { Input, Icon, Button, Select, Modal, Transfer, Radio } from 'antd';
import { compareArr } from 'app/utils/utils';
import cs from 'classnames';

import './style.scss';
import SearchInput from 'app/components/common/SearchInput/index';
import XInput from 'app/components/common/XInput/index';
import XCheckboxGroup from 'app/components/common/XCheckboxGroup/index';

const Option = Select.Option;
const ButtonGroup = Button.Group;
const RadioGroup = Radio.Group

const getOptions = (data, resOptionsName) => {
    if (!data || data.length === 0) {
        return []
    }

    // console.log(data, resOptionsName)

    return data.map(item => {
        // let label, value, type;
        let obj = null;
        switch (resOptionsName) {
            case 'user':
                obj = {
                    label: `${item.name}(${item.partyId})`,
                    value: `${item.name}|${item.partyId}`,
                    key: `${item.name}|${item.partyId}`
                }
                break;
            case 'agency':
                obj = {
                    label: `${item.nameCn}(${item.id})`,
                    value: `${item.nameCn}|${item.id}`,
                    key: `${item.nameCn}|${item.id}`
                }
                if (item.city) {
                    obj.label += '+' + item.city
                }
                if (item.company) {
                    obj.label += '+' + item.company
                }
                break;
            case 'photographer':
                obj = {
                    label: `${item.nameCn}(${item.id})`,
                    value: `${item.nameCn}|${item.id}`,
                    key: `${item.nameCn}|${item.id}`
                }
                if (item.city) {
                    obj.label += '+' + item.city
                }
                if (item.company) {
                    obj.label += '+' + item.company
                }
                break;
        }

        return obj
    })
};

class XTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            targetKeys: [],
            selectedKeys: [],
            options: [],
            searchVal: '',
            oftenVal: [],
            oftenOptions: getOptions(props.oftenOptions, props.resOptionsName)
        };

    }

    componentWillReceiveProps(nextProps) {
        // const {oftenOption} = nextProps;
        const { resOptionsName } = this.props
        const { value, oftenOptions } = this.state;

        if (!compareArr(value, nextProps.value)) {
            // const oftenVal =
            this.setState({
                value: nextProps.value || [],
                oftenVal: nextProps.value || []
            });
        }

        if (!compareArr(oftenOptions, nextProps.oftenOptions)) {
            // const oftenVal =
            this.setState({
                // oftenVal: [],
                oftenOptions: getOptions(nextProps.oftenOptions, resOptionsName)
            });
        }
    }

    onSearch = (val, isFilter) => {
        const { params, action, dispatch, assetFamily, onChange, resOptionsName } = this.props;
        const { targetKeys, selectedKeys } = this.state;
        const prevVal = this.state.value || [];
        const prevOpts = this.state.options.filter(item => {
            return prevVal.indexOf(item.key) != -1 || targetKeys.indexOf(item.key) != -1
        });

        this.setState({
            searchVal: val,
            selectedKeys: []
        });

        if (!val) {
            this.setState({
                options: prevOpts
            });

            onChange(prevVal);
            return false;
        }

        // if(isFilter){
        //     this.setState({searchVal: val});
        // }else if(searchVal){
        //     this.setState({searchVal: ''});
        // }

        dispatch(action(Object.assign({}, params, {
            param: {
                searchName: val,
                assetFamily: assetFamily || 1
            }
        }))).then(res => {
            if (res.apiError) {
                message.error(result.apiError.errorMessage);
                return false
            }

            let options = getOptions(res.apiResponse[resOptionsName], resOptionsName);
            // console.log(options)
            if (isFilter) {
                options = options.filter(item => {
                    return item.label[0].toUpperCase() === val
                })
            }
            options = prevOpts.concat(options);

            this.setState({
                options,
                // targetKeys
            });

            onChange(prevVal)
        })
    }

    onSearchSelect = (value, options) => {
        const { onChange } = this.props;
        let { oftenVal } = this.state;

        _.remove((oftenVal || []), (n) => value.indexOf(n) == -1);

        // if (value.length === 0) {
        //     oftenVal = ['全部|-1']
        // }

        this.setState({
            options,
            oftenVal
        });

        onChange(value);
    }

    onChange = (targetKeys, direction, moveKeys) => {
        this.setState({ targetKeys })
    }

    onSelect = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    }

    showModal = () => {
        const { options, value } = this.state;

        this.setState({
            visibleModal: true,
            targetKeys: value || [],
            searchVal: ''
        });
    }


    clearSelect = () => {
      // const { options, value } = this.state;
      const { onChange} = this.props;
      const { value, visibleModal, options, oftenVal, oftenOptions } = this.state;
 
      this.setState({
        value: []
      })
      onChange([])
    }

    onOftenOption = (vals, valsOptions, removeVal) => {
        const { onChange } = this.props;
        let { options, value, oftenOptions } = this.state;
        let oftenVal = vals

        valsOptions.forEach(item => item.key = item.value)
        // options = _.uniq(options.concat(valsOptions.filter(item => item.value !== '全部|-1')), 'value')
        options = _.uniq(options.concat(valsOptions), 'value')

        if (removeVal) {
            _.remove(value, (n) => n === removeVal)
            _.remove(valsOptions, (n) => n.value === removeVal)
        }

        // if (oftenVal.length === 1 && oftenVal[0] === '全部|-1' && oftenOptions.length>1) {
        //     if (removeVal && value.length !== 0) {
        //         oftenVal = []
        //     } else {
        //         value = []
        //     }
        // }else
        if(oftenVal.some(item => item === '全部|-1')){
            // value = oftenVal = ['全部|-1']
            // value = []
            if(oftenVal[oftenVal.length-1]==='全部|-1'){
                oftenVal = value = ['全部|-1']
            }else{
                _.remove(value, (n) => n === '全部|-1')
            }
        }

        // if (oftenVal.some(item => item==='全部|-1')) {
        //     oftenVal = ['全部|-1']
            // if (removeVal && value.length !== 0) {
            //     oftenVal = []
            // } else {
            //     value = []
            // }
        // }

        value = _.uniq(value.concat(oftenVal.filter(item => item !== '全部|-1')))
        // value = _.uniq(value.concat(oftenVal))

        this.setState({
            options,
            oftenVal
        })
        onChange(value)
    }

    hideModal = () => {
        const { onChange } = this.props;
        let { targetKeys, oftenVal } = this.state;
        const value = targetKeys;

        _.remove((oftenVal || []), (n) => value.indexOf(n) == -1);

        // if (value.length === 0) {
        //     oftenVal = ['全部|-1']
        // }

        this.setState({
            visibleModal: false,
            oftenVal
        });

        onChange(value);
    }

    renderModal = () => {
        const { title, placeholder } = this.props;
        const { selectedKeys, targetKeys, options, searchVal } = this.state;

        return (<div className="transfer">
            <div className="transfer-heading">
                <ButtonGroup size="small">{'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.match(/[A-Z]/g).map(item => {
                    return <Button type={searchVal == item ? 'primary' : ''} onClick={() => {
                        const val = item === searchVal ? '' : item;
                        this.onSearch(val, true)
                    }}>{item}</Button>
                })}</ButtonGroup>
                <div className="mt-10 mb-10">
                    <XInput value={searchVal} size="default" style={{ width: 360 }} placeholder={placeholder} onSearch={this.onSearch} />
                </div>
            </div>
            <Transfer
                listStyle={{
                    width: 360,
                    height: 280,
                }}
                dataSource={options}
                titles={['未选择', '已选择']}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={this.onChange}
                onSelectChange={this.onSelect}
                render={item => item.label}
            // header={() => {
            //     <ButtonGroup size="small">{['全选', '反选'].map(item => {
            //         return <Button onClick={()=> {this.onSearch(item)}}>{item}</Button>
            //     })}</ButtonGroup>
            // }}
            />
        </div>)
    }

    render() {
        const { placeholder, params, action, multiple, title, style } = this.props;
        const { value, visibleModal, options, oftenVal, oftenOptions } = this.state;
        // console.log(value, visibleModal, options, oftenVal, oftenOptions)
        // console.log(oftenOptions)
        return <div>
            <Modal width={800} title={title} visible={visibleModal} onOk={this.hideModal} onCancel={this.hideModal} okText="确认" cancelText="取消">
                {this.renderModal()}
            </Modal>
            {(oftenOptions && oftenOptions.length > 0) && <XCheckboxGroup type='transfer' value={oftenVal} onChange={this.onOftenOption} wrapClass='checks-btn' options={oftenOptions} />}
            <SearchInput multiple={true} style={style || {}} placeholder={placeholder} options={options} value={value} onSearch={this.onSearch} onSelect={this.onSearchSelect} />
            <Button className="btn-link" onClick={this.showModal}>高级</Button>
            <Button className="btn-link" onClick={this.clearSelect}>清空</Button>
        </div>;
    }
}

export default connect()(XTransfer)
