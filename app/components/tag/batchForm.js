import React, { Component, PropTypes } from 'react';
import {reduxForm}                     from 'redux-form';
import TagForm                         from './form';
import {
    Form, Input, Select, Radio, Button, Modal, message, RowAntd, ColAntd
} from 'antd';

import {
    findKeyword,
    addKeyword,
    modifyKeyword,
    getKeywordById
} from "app/action_creators/edit_action_creator";

const FormItem = Form.Item, Option = Select.Option, RadioGroup = Radio.Group;;

@reduxForm(
    {
        "form": "tagBatchForm",
        "fields":[
            'keywords'
        ]
    }
)
export default class TagBatchForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "modal": {
                param: {}
            }
        };

        this.modalInit = {
            "param": {},
            "visible": false,
            "title": "",
            "body": null,
            "onOk": this.closeModal.bind(this),
            "onCancel": this.closeModal.bind(this),
            "oktext": null,
            "confirmLoading": false
        };
    }

    componentWillMount() {

    };


    render() {
        const {handleSubmit, fields: {keywords}} = this.props, {modal} = this.state;
        let keywordsArr = [];
        keywords.value.split(',').map((value)=>{
            if(value){
                keywordsArr.push({
                    key: value,
                    label: value
                });
            }
        })

        return (
            <Form horizontal onSubmit={handleSubmit}>
                <Modal {...modal}>
                    {modal.body && modal.body}
                </Modal>
                <Select tags labelInValue
                    className="people-tag tag"
                    style={{ width: '100%' }}
                    value={keywordsArr}
                    onSearch={this.tagOnInput.bind(this)}
                    onChange={this.tagOnChange.bind(this)}
                    onSelect={this.tagOnSelect.bind(this)}
                    >
                </Select>
            </Form>
        )
    };

    setModal(config) {
        const modal = Object.assign({}, this.state.modal, { "visible": true }, config);
        this.setState({ modal });
    };

    openModal(config) {
        const modal = Object.assign({}, this.modalInit, { "visible": true }, config);
        this.setState({ modal });
    };

    closeModal(config) {
        const modal = Object.assign({}, this.modalInit, { "visible": false }, config);
        this.setState({ modal });
    };

    tagOnInput(inputStr){
        if(/，|,$/.test(inputStr)){
            clearTimeout(this.tagInputTimeout);
            this.tagInputTimeout = setTimeout(this.formatTag.bind(this, inputStr.split(',')), 500);
        }
    };

    tagOnChange(value){
        //console.warn('tagOnChange')
    };

    tagOnSelect(value){
        this.formatTag(value.label.split(','));
    };

    formatTag(newTags){
        let {fields:{keywords}} = this.props;
        //console.warn(keywords, newTags)
        let keywordsArr = _.union(keywords.value.split(','), newTags);
        keywords.onChange(keywordsArr.join(','));
    }

    //modal param set
    setParam(key, value) {
        let modal = this.state.modal;
        modal.param[key] = value;
        this.setState(modal);
    };
}