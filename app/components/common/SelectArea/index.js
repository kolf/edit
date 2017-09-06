import React from 'react'
import {connect} from 'react-redux'
import {Cascader, message} from 'antd'

import {isEn, compareArr} from 'app/utils/utils'
import {regionQuery} from "app/action_creators/common_action_creator"
import data from './data.json'

let options = toOptions(data)

function toOptions(data) {
    const fn = (data) => {
        return data.map((item, index) => {
            const label = isEn()
                ? item.enname
                : item.name
            return {
                value: `${label}(${item.id})`,
                label,
                key: item.id+index,
                children: item.children
                    ? fn(item.children)
                    : []
            }
        })
    }

    return fn(data)
}

function value2Option(val) {
    return val.reduce((result, next, i) => {
        let option = {
            value: next,
            label: next,
            key: next + i
        }

        if (i === 0) {
            result = option
        } else if (i === 1) {
            result.children = [option]
        } else if (i === 2) {
            result.children[0].children = [option]
        }
        return result
    }, {})
}

class SelectArea extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        const {value} = this.state
        if (!compareArr(value, nextProps.value)) {
            this.setState({value: nextProps.value})
        }
    }

    componentWillMount() {
        const {value} = this.props
        if (value && value.length && !/\(\d+\)/.test(value[0])) {
            _.uniq(options.unshift(value2Option(value)), 'value')
        }

    }


    onSearch = {
        filter(inputValue, path) {
            // console.log(path)
        },
        render(inputValue, path, prefixCls) {
            // console.log(path)
            return path[0].label;
        }
    }

    getOptions() {
        const {dispatch} = this.props
        let n = 0;
        const queryRegion = (parentId) => {
            return new Promise((resolve, reject) => {
                dispatch(regionQuery({parentId})).then(res => {
                    const {apiError, apiResponse} = res
                    if (apiError) {
                        message(apiError.errorMessage);
                        return false
                    }

                    n++;
                    resolve(apiResponse)
                })
            })
        }

        queryRegion(0).then(aArr => {
            options = aArr
            let length = aArr.length

            aArr.forEach(a => {
                queryRegion(a.id).then(bArr => {
                    bArr.length && (a.children = bArr)
                    length += bArr.length
                    bArr.forEach(b => {
                        queryRegion(b.id).then(cArr => {
                            cArr.length && (b.children = cArr)
                            if (length == n - 1) {
                                console.log(JSON.stringify(options))
                            }
                        })
                    })
                })
            })
        })
    }

    render() {
        const {value} = this.state

        return (<Cascader
            showSearch
            {...this.props}
            changeOnSelect
            options={options}
            placeholder='请选择或搜索城市'/>)
    }
}

export default connect()(SelectArea)
