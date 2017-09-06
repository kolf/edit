import React, {Component} from "react";
import ReactDOM           from "react-dom";
import TableBox           from "app/components/editor/table";
import { Input, Select, Button, Icon } from 'antd';
import classNames from 'classnames';
const Option = Select.Option;

// POST /group/findProvider
import {queryProvider} from "app/action_creators/create_action_creator";
export default class SelectProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
          data: [],
          value: '',
          focus: false
        };

        this.timeout = null;
        this.currentValue = {};
    };

    handleSearch(value) {
        this.setState({value});
        this.timeout = setTimeout(this.fetchData(value), 300)
    };

    handleChange(value) {
        const {data} = this.state;
        let text = '';
        for(let item of data){
            if(item.value == value){
                text = item.text;
            }
        }
        {this.props.updateSelectProviderId && this.props.updateSelectProviderId(value,text)}
    };

    handleFocus() {
        this.setState({ focus: true });
    };

    handleBlur() {
        this.setState({ focus: false });
    };

    render() {

        const btnCls = classNames({
          'ant-search-btn': true,
          'ant-search-btn-noempty': !!this.state.value,
        });
        const searchCls = classNames({
          'ant-search-input': true,
          'ant-search-input-focus': this.state.focus,
        });

        const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);

        return (

           <Select
                showSearch
                style={{ width: 200 }}
                placeholder="选择供应商"
                optionFilterProp="children"
                onSearch={this.handleSearch.bind(this)}
                onChange={this.handleChange.bind(this)}
              >
                 {options}
            </Select>
        );
    }


    fetchData(value) {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        let param = {"assetFamily": 1, "searchName": value, 'size': 100};
        this.props.dispatch(queryProvider(param)).then(result => {
            if (result.apiError) {
                this.messageAlert(result.apiError.errorMessage);
                return false
            }

            const data = [];

            (result.apiResponse && result.apiResponse.agency.forEach((r) => {
                data.push({
                  value: r.id,
                  text: r.nameCn,
                });
            }))

            this.setState({ data })

        });
    }
}
