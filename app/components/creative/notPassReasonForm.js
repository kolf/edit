import React, { Component, PropTypes } from 'react';

import {
    Form, Input, Button, message, RowAntd, ColAntd, Checkbox
} from 'antd';

const FormItem = Form.Item;

export default class NotPassReasonForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checkedReason: [],
            otherReason: '',
            checkboxOptions: [
                {label: '拍摄问题', value: 1},
                {label: '后期问题', value: 2},
                {label: '模特道具问题', value: 3},
                {label: '创意问题', value: 4},
                {label: '法律问题', value: 5},
                {label: '其他原因', value: 6}
            ]
        };
    };

    componentWillMount() {

    };

    render() {
        const {onSubmit} = this.props, {checkedReason, otherReason, checkboxOptions} = this.state;

        return (
            <Form horizontal >
                <FormItem className="row">
                {
                    checkboxOptions.map(({label, value})=>{
                        return <div key={value} className="col-xs-6"><Checkbox checked={checkedReason[value]} onChange={this.onCheck.bind(this, value)}>{label}</Checkbox></div>
                    })
                }
                {checkedReason[6] && <Input type="textarea" placeholder="请输入其他原因" value={otherReason} onChange={this.onChangeOtherReason.bind(this)}/>}
                </FormItem>
            </Form>


        )
    };

    onCheck(index, e){
        let {checkedReason, checkboxOptions} = this.state;
        checkedReason[index] = e.target.checked && checkboxOptions[index - 1].label;

        this.props.setCheckedValue(checkedReason,this.state.otherReason);
        this.setState({checkedReason}); 
    };

    onChangeOtherReason(e){
        this.props.setCheckedValue(this.state.checkedReason,e.target.value);
        this.setState({otherReason: e.target.value});
    }

}