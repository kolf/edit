import React, {Component} from "react";
import {connect} from "react-redux";
import {Form, Input, Button, Tabs, Select, Row, Col, Radio, Icon, Menu, Dropdown} from "antd";
import {searchRsList} from "app/action_creators/search_action_creator";
import filterData from "./filterData";

import cs from "classnames";

import $ from 'app/utils/dom';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const CreateForm = Form.create;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const MenuItem = Menu.Item;

class searchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHotSearchs: true,
            hotSearchs: props.hotSearchs || [],
            types: props.types,
            keywordType: props.keywordType,
            keyword: props.keyword,
            hotKey: props.hotKey,
            resGroup: props.resGroup,
            pageType: props.pageType
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!filterData.compare(nextProps.types, this.state.types)){
            this.setState({types: nextProps.types});
        }
        if(nextProps.keyword!==this.state.keyword){
            this.setState({keyword: nextProps.keyword});
        }

        if(nextProps.hotKey!==this.state.hotKey){
            this.setState({hotKey: nextProps.hotKey});
        }

        if(nextProps.keywordType!==this.state.keywordType){
            this.setState({keywordType: nextProps.keywordType});
        }
    }

    componentWillMount() {
        //console.log('componentWillMount');
    }

    componentDidMount(){

    }

    handleChange(type, key) {
        const {onChange} = this.props;
        const value = type==='keyword' ? key.target.value: key;
        if(type === 'resGroup') this.setState({showHotSearchs: value == 1});
        onChange({ [type]: value }, 'search')
    }

    onSearch(type) {
        const {onChange} = this.props;

        if(type == 'clear') {
            onChange({keyword: ''}, 'search', () => {
                //console.log(this.state.keyword);
                onChange({'submit': 1}, 'search')
            })
        }else{
            onChange({'submit': 1}, 'search')
        }
    }

    onHotSearch(e) {
        const {onChange} = this.props;
        const {hotSearchs} = this.state;
        const oldVal = this.state.hotKey;
        const hotKey = e.target.value == oldVal ? '' : e.target.value;

        onChange({
            hotKey
        }, 'search')
    }

    handleKeyUp = (e) => {
        // //console.log(e);
        e.keyCode === 13 && this.onSearch()
    }

    render() {
        const {keyword, keywordType, hotSearchs, hotKey, showHotSearchs, types} = this.state;
        const {pageType, placeholder, inputLeft} = this.props;

        const keywordTypeName = types.find(type => type.key == keywordType).label;

        const renderAfter = (
            <Dropdown overlay={<Menu>{types.map(type => <Menu.Item><a onClick={this.handleChange.bind(this, 'keywordType', type.key)} href="javascript:;">{type.label}</a></Menu.Item>)}</Menu>}>
                <a className="ant-dropdown-link" href="javascript:;">{keywordTypeName} <Icon type="down" /></a>
            </Dropdown>
        );
        // const renderAfter = (
        //     <Select value={keywordType} dropdownMatchSelectWidth={false} onChange={this.handleChange.bind(this, 'keywordType')} style={{
        //         minWidth: 70
        //     }}>
        //         {types.map(item => <Option value={item.key}>{item.label}</Option>)}
        //     </Select>
        // );

		const selectItem = types.filter(item => item.key == keywordType);
        const keywordProps = {
            addonAfter: renderAfter || null,
        };

        //console.log(this.props.inputLeft);
        // ，多个可用空格和逗号分隔
        let placeholderText = `请输入${selectItem[0].label}`;
        if(selectItem[0].multiple !== false){
            placeholderText += '，多个可用空格和逗号分隔'
        }

        return (
            <div className="search-bar">
                <Form inline className="search-container">
                    {(pageType == 10 || pageType== 110) && <Tabs type="card" onChange={this.handleChange.bind(this, 'resGroup')}>
                        <TabPane tab="组照" key="1"/>
                        <TabPane tab="单张" key="2"/>
                    </Tabs>}
                    <Row>
                        <Col span="20">
                            <Input size="large" onKeyUp={this.handleKeyUp} onChange={this.handleChange.bind(this, 'keyword')}
								value={keyword} {...keywordProps}
								placeholder={placeholder || placeholderText}/>
                            <Icon style={{left: (inputLeft || 475)}} className={cs('search-clear', {'hide': !keyword})} onClick={this.onSearch.bind(this, 'clear')} type="close-circle" />
                        </Col>
                        <Col span="4">
                            <Button className="srarch-btn" type="primary" onClick={this.onSearch.bind(this)}>搜索</Button>
                        </Col>
                    </Row>

                    {(hotSearchs.length > 0 && showHotSearchs) && <div className="search-hots radio-tag-container">
                        <RadioGroup size="small" value={hotKey} onChange={this.onHotSearch.bind(this)}>
                            {hotSearchs.map(item => <RadioButton value={item.key}>{item.label}</RadioButton>)}
                        </RadioGroup>
                    </div>}
                </Form>
            </div>
        )
    }
}

export default connect()(CreateForm()(searchBar));
