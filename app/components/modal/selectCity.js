import React, {
    Component
} from "react";
import ReactDOM from "react-dom";
import {
    Cascader
} from 'antd';

import {
    regionQuery
} from "app/action_creators/common_action_creator";

// 选择省份和城市封装 后期再拓展
export default class SelectCity extends Component {

    options = [];

    state = {
        inputValue: '',
        options: this.options,
    }


    onChange = (value, selectedOptions) => {
        // this.setState({
        //   inputValue: selectedOptions.map(o => o.label).join(', '),
        // });
        // //console.log(selectedOptions);
        // //console.log(value);
        //
		// if(selectedOptions.length == 0){
		// 	return;
		// }
        const lastArea = selectedOptions[selectedOptions.length - 1];
        if (this.props.onSelect) {
			this.props.onSelect && this.props.onSelect(lastArea, selectedOptions)
        }
    }

    componentWillMount() {
        this.regionQuery({parentId: 0}).then(options => {
            this.state.options = options
        })
    }

    loadData = (selectedOptions) => {
        let targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        this.regionQuery({parentId: targetOption.value}).then(options => {
            targetOption.loading = false;
            targetOption.children = options;

            this.forceUpdate();
        })
    }

    regionQuery(params){
        return new Promise((resolve, reject) => {
            this.props.dispatch(regionQuery(params)).then((res) => {
                if (res.apiError) {
                    this.messageAlert(res.apiError.errorMessage);
                    return false;
                }
                if (res.apiResponse.length == 0) return false;

                const result = res.apiResponse.map(item => {
                    let obj = {
                        label: item.name,
                        value: item.id,
                        isLeaf: item.type == 3 ? true : false
                    };

                    return obj
                }).sort((a, b) => a.id - b.id);

                resolve(result)
            });
        });
    }

    render() {

		let cascader = "" ;
		// 父组件控制逻辑
		if(this.props.value){
			// 把上次选择的值 保存为新的选中值转换
			let selectValue = this.props.value.map(item => item.value);
			// //console.log("selectValue", selectValue);
			cascader = <Cascader
                allowClear
				style={this.props.style}
				options={this.state.options}
				value={selectValue}
				placeholder = "请选择"
				loadData={this.loadData}
				onChange={this.onChange}
				changeOnSelect
				/>
		}else{// 组件自身控制逻辑
			cascader = <Cascader
                allowClear
				style={this.props.style}
				options={this.state.options}
				defaultValue={this.props.defaultValue}
				placeholder = "请选择"
				loadData={this.loadData}
				onChange={this.onChange}
				changeOnSelect
				/>
		}

		return (
				<span>{cascader}</span>
			);
    }
}
