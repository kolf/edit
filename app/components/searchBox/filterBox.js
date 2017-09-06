import React, {Component} from "react";
import {connect} from "react-redux";
import {Form, Button, message, Spin} from "antd";
import FilterItem from "./filterItem";
import filterData from "./filterData";
import RssBar from "./rssBar";
import {splitVal} from "./utils";
import {getStorageFilter} from "app/action_creators/editor_action_creator";

const CreateForm = Form.create;

class FilterBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expand: false,
            values: props.values,
            data: props.data,
            // activeRss: props.activeRss,
            // showRss: props.showRss,
            loading: false
        }
    }

    componentWillMount() {}

    componentWillReceiveProps(nextProps) {
        const {showRss, activeRss, values, data} = this.state;

        if(!Object.keys(values).length){
            // const firstItem  = data[0];
            // this.state.values[firstItem.field] = `${firstItem.id}||`
            this.state.values.placeholder='-1||'
        }

        if (!Object.values(nextProps.values).some(val => val)) {
            this.state.activeRss = false;
        }

        if (!filterData.compare(values, nextProps.values)) {
            this.setState({data: nextProps.data, values: nextProps.values})
        };

        if (!filterData.compare(data, nextProps.data)) {
            this.setState({data: nextProps.data, values: nextProps.values})
        };
    }

    linkage(val, curItem, callback) {
        const {onChange} = this.props;
        let {data, values} = this.state;
        let curIndex = filterData.index(curItem.id, data);
        let targetItem = filterData.get(curItem.linkageId);
        //
        if(!targetItem){
            return;
        }

        let targetIndex = filterData.index(targetItem.id, data);

        if(Array.isArray(val) && val.length>1){
            curItem.multiple.status = true;
            curItem.type = 'checkbox';
        }

        //console.log(targetItem)

        if(targetItem.multiple){
            targetItem.multiple.status = curItem.multiple.status;

            //console.log(targetItem);

            targetItem.type = targetItem.multiple.status ? 'checkbox' : 'tag';
            // if(targetItem.field == 'agency'){
            //     targetItem.type= 'tag,search'
            //     targetItem.multiple.status = false
            // }
        }

        targetItem.multiple && (targetItem.multiple.status = curItem.multiple.status);

        if (targetItem.syncOptions) {
            this.getOptions(targetItem, val).then(options => {
                values[targetItem.field] = '';
                // if (targetItem.field == 'agency') {
                //     options.unshift({"text": "全部", "id": '-1'})
                // };
                targetItem.options = _.uniq(options, 'id');

                if (options.length>0 && targetIndex <= 0) {
                    data.splice(curIndex + 1, 0, targetItem);
                } else if(options.length === 0 && targetIndex >= 0){
                    if(targetItem.syncOptions){
                        this.linkage(`${targetItem.id}||`, targetItem)
                    };
                    data.splice(curIndex + 1, 1);
                } else if(splitVal(values[targetItem.field]).value){
                    //console.log(11);
                    // values[targetItem.field] = `${targetItem.id}||`;
                    // this.linkage(`${targetItem.id}||`, targetItem)
                }

                if(curItem.field == 'graphicalType' && filterData.index(3, data)>=0){
                    values.agency = '';
                    // data[2].options = [{"text": "全部", "id": '-1'}];
                    // if(data[2].multiple && data[2].multiple.status){
                    //     data[2].type = 'tag,search';
                    //     data[2].multiple.status = false;
                    // }
                }

                Object.assign(values, {
                    [curItem.field]: val
                });

                onChange(values, 'filter', callback);
                this.setState({loading: false});
            });
        } else {
            data.splice(curIndex + 1, 0, targetItem);
            Object.assign(values, {
                [curItem.field]: val
            });
            onChange(values, 'filter', callback);
        }
    }

    handleChange(name, val) {
        const {onChange, activeRss} = this.props;
        let {values, data} = this.state;

        let curItem = filterData.get(splitVal(val).key);

        if (curItem.linkageId) { // 有联动走联动
            this.linkage(val, curItem)
        } else {
            Object.assign(values, {[name]: val});
            onChange(values, 'filter');
        }
        curItem.callback && this[curItem.callback]()
    }

    handleToggle() {
        let {expand} = this.state;
        expand = !expand;
        this.setState({expand})
    }

    getKeys() {
        const {data} = this.props;
        let keys = {};

        data.forEach(item => {
            keys[item.field] = ''
        });

        return keys;
    }

    handleClick(searchs) {
        const {onChange} = this.props;
        let {data, values} = this.state;

        if (!searchs) {
            return;
        };

        onChange(searchs, 'rss');

        //console.log(this.props.pageType);

        // if(searchs.graphicalType && splitVal(searchs.graphicalType).key == 26){
        //     this.linkage(searchs.graphicalType, data[0], () => {
        //         if(searchs.category){
        //             this.linkage(searchs.category, data[1], () => {
        //                 if(Array.isArray(searchs.agency)){
        //                     data[2].multiple.status = true;
        //                     data[2].type = 'checkbox';
        //                 }
        //
        //                 onChange(searchs, 'rss');
        //             })
        //         }else{
        //             onChange(searchs, 'rss');
        //         }
        //     });
        // }else{
        //     onChange(searchs, 'rss');
        // }
    }

    getOptions(item, val) {
        this.setState({loading: true});

        const {comboboxSearch, dispatch, assetFamily, resGroup} = this.props;
        const {values} = this.state;

        let {param, parent} = item.syncOptions;

        for (let name in param) {
            param[name] = splitVal(values[name]).value;
            if(/^\,+/.test(param[name]+'')) param[name] = param[name].replace(/^\,+/, '')
        };

        Object.assign(param, {
            [parent]: splitVal(val).value,
            resGroup,
            assetFamily
        });

        return new Promise((resolve) => {
            dispatch(comboboxSearch({paramType: item.syncOptions.paramType, param})).then(result => {
                if (result.apiError) {
                    message.error(result.apiError.errorMessage);
                    return false
                }

                let resultObj = result.apiResponse;

                resolve(_get(resultObj));
            });
        })

        function _get(obj) {
            return Object.values(obj).reduce((prev, cur) => {
                if (Array.isArray(cur)) {
                    prev = cur;
                };
                return prev;
            }, []).map(item => {
                const id = (item.id+'').indexOf(',')!=-1 ? (item.id+'').replace(',', '&') : item.id;

                return {
                    id,
                    text: item.name || item.nameCn,
                    type: item.graphicalType || item.category,
                    agencyType: item.type
                }
            })
        }
    }

    queryOftenAgency(){
        const {assetFamily, resGroup, dispatch, comboboxSearch} = this.props
        const {values, data} = this.state
        const [category, graphicalType] = ['category', 'graphicalType'].map(key => splitVal(values[key]).value)

        // console.log(category)

        dispatch(comboboxSearch({
            paramType: 5,
            param: {
                assetFamily,
                resGroup,
                category,
                graphicalType
            }
        })).then(res => {
            if (res.apiError) {
                message.error(res.apiError.errorMessage);
                return false
            }

            // const agency = _.uniq((res.apiResponse.agency || []), 'id')
            // console.log(agency)
            data[2].oftenOptions = _.uniq((res.apiResponse.agency || []), 'id')

            this.setState({
                data
            })
        })
    }

    clearOptenAgency(){
        // console.log(111111)
        const {data} = this.state
        data[2].oftenOptions = []
        this.setState({
            data
        })
    }

    render() {
        const {comboboxSearch, assetFamily, pageType, modal, activeRss, showRss, onRss} = this.props;
        const {data, expand, loading} = this.state;
        let {values} = this.state;

        return (
            <div style={{
                paddingTop: 20
            }}>
                <div className="filter-bar">
                    <RssBar onRss={onRss} show={showRss} dataFilter={data} modal={modal} onClick={this.handleClick.bind(this)} pageType={pageType} searchs={values} active={activeRss}/>
                    <div className="filter-tools">
                        <Button icon={expand ? 'up-square-o' : 'down-square-o'} onClick={this.handleToggle.bind(this)}>{expand ? '收起筛选' : '展开筛选'}</Button>
                    </div>
                </div>

                <Form horizontal className="filter-box" style={{
                    display: expand ? 'block' : 'none'
                }}>
                    <Spin spinning={loading} tip="加载中...">{data.map(item => <FilterItem assetFamily={assetFamily} value={values[item.field]} onChange={this.handleChange.bind(this)} comboboxSearch={comboboxSearch} data={item}/>)}
                    </Spin>
                </Form>

            </div>
        )
    }
}

export default connect()(CreateForm()(FilterBox));
