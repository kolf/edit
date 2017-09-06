import React, {Component} from "react";
import {connect} from "react-redux";
import SearchBar from "./searchBar";
import FilterBox from "./filterBox";
import filterData from "./filterData";
import {joinVal} from "./utils";
import "./style.scss";

let reKeyword = /[\,\，]+/g;
let defaultKeywordTypes = [{label: '关键词', key: 1}, {label: '图片ID', key: 2}];

const assign = (...args) => {
  return args.reduce((result, obj) => {
      for(const name in obj){
            if(obj[name] || obj[name]==0){
                result[name] = obj[name]
            }else if(!result[name]){
                result[name] = ''
            }
      };
      //console.log('----', result);
      return result
  }, {});
}

class searchBox extends Component {
    constructor(props) {
        super(props);
        const types = props.keywordTypes || defaultKeywordTypes;
        this.state = {
            search: {
                types,
                values: {
                    keyword: '',
                    resGroup: props.resGroup || 2,
                    keywordType: types[0].key
                },
                hotKey: ''
            },
            rss: {
                show: (props.showRss == undefined),
                active: false
            },
            filter: {
                data: props.dataFilter,
                values: {}
            },
            param: {
                pageNum: 1
            }
        }
    }

    componentWillMount() {
        this.initFilter(true);
    }

    componentWillReceiveProps(nextProps) {
        let {search} = this.state;
        let {values: {resGroup}, types} = search;

        // if(resGroup == 1){
        //     nextProps.dataFilter.forEach(item => {
        //         if(item.id === 3 || item.id === 4){
        //             item.options.forEach(option => {
        //                 if(option.id == -1){
        //                     item.options.shift()
        //                 }
        //             });
        //         }
        //     })
        // }else if(resGroup == 2){

        // }
        //
        // if(types && !filterData.compare(types, nextProps.keywordTypes)){
        //     search.types = nextProps.keywordTypes || defaultKeywordTypes;
        //     search.values.keywordType = search.types[0].key;
        //     this.state.search = search
        // }
    }

    handleChange(values, type, callback) {
        // console.log('------------', values, type);

        const {hotSearchs, assetFamily} = this.props;
        let {search, rss, filter, param} = this.state;

        if(type === 'rss' && !Object.keys(values).length){
            rss.values = {};
            type = 'search'
        }


        //console.log('------------', search, rss, filter);

        if(type == 'filter'){
            if(!Object.keys(values).length){
                this.initFilter()
            };

            for(let name in filter.values){ // 清空上次筛选
                if(filter.values[name] && !values[name]){
                    values[name] = ''
                }
            };

            // if(assetFamily==1){
                for(let name in rss.values){ // 清空订阅的值
                    if(rss.values[name] && !values[name]){
                        values[name] = ''
                    }
                };
                rss.values = {};
                rss.active = false;
            // }

            filter.values = values;

            const valObjs = assetFamily == 1 ? Object.assign({}, {...filter.values}, {...search.values}) : assign({}, {...filter.values}, {...search.values});

            this.props.onSearch(joinVal(valObjs), filter.data);

        }else if(type == 'rss'){
            for(let name in rss.values){ //清空上次订阅的值
                if(rss.values[name] && !values[name]){
                    values[name] = '';
                }
            };

            if(assetFamily==1){
                this.initFilter();

                search.values.keyword = '' //清空搜索的值
                hotSearchs.forEach(item => {
                    search.values[item.key] = '';
                });
                search.hotKey = '';
            }

            for(let name in filter.values){ //清空上次筛选的值
                if(!values[name]){
                    values[name] = '';
                    filter.values[name] = ''
                }
            };
            filter.values = {};

            rss.values = values;
            rss.active = true;

            // //console.log(filter.values)
            // //console.log(rss.values)

            const valObjs = assetFamily == 1 ? Object.assign({}, {...rss.values}, {...search.values}) : assign({}, {...rss.values}, {...search.values});

            this.props.onSearch(joinVal(valObjs), filter.data);
            // //console.log('------', assign({}, {...rss.values}, {...filter.values}, {...search.values}));
            //
            // this.props.onSearch(joinVal(assign({}, {...rss.values}, {...filter.values}, {...search.values})), filter.data, 'rss');
        }else if(type == 'search'){
            let init = false,fatch = true;

            for(let name in values){
                if(name === 'resGroup'){
                    if(values.resGroup == 1){
                        rss.show = true;
                    }else if(values.resGroup == 2) {
                        rss.show = false;
                    }

                    hotSearchs.forEach(item => {
                        search.values[item.key] = '';
                    });
                    search.hotKey = '';
                    rss.active = false;
                    // search.values.keywordType = search.types[0].key;
                    //console.log(search.values);

                    search.values.resGroup = values.resGroup;
                    init = true;
                }else if(name === 'keyword'){
                    search.values.keyword = values.keyword ? values.keyword.replace(reKeyword, ',').replace(/^,/, '') : '';
                    fatch = false;
                }else if(name === 'hotKey'){

                    hotSearchs.forEach(item => {
                        search.values[item.key] = '';
                    })

                    const value = values[name];

                    search.values[value] = value ? 1 : '';

                    search.hotKey = values.hotKey;
                }else if(name === 'submit'){
                    // rss.active = false;

                }else if(name === 'keywordType'){
                    search.values.keywordType = values.keywordType;
                }
            }

            init && this.initFilter();

            if(fatch){
                if(assetFamily==1){
                    for(let name in rss.values){ // 清空订阅的值
                        if(!values[name]){
                            filter.values[name] = '';
                            rss.values[name] = '';
                        }
                    };
                    // rss.values = {};
                    rss.active = false;
                }

                // this.props.onSearch(joinVal(Object.assign({}, {...search.values}, {...rss.values}, {...filter.values})), filter.data)
                const valObjs = assetFamily == 1 ? Object.assign({}, {...filter.values}, {...search.values}) : assign({}, {...rss.values}, {...filter.values}, {...search.values});

                this.props.onSearch(joinVal(valObjs), filter.data);
            }
        }

        callback && callback();

        this.setState({
            search, rss, filter
        });
    };

    initFilter(init){
        const {filterInit, hotSearchs, defaultParams} = this.props;
        const {filter: {data}, search, rss} = this.state;
        let values = {};

        data.forEach(item => {
            if(defaultParams && defaultParams[item.field]){
                const {options, id} = filterData.get(item.id);
                if(options){
                    const valItem = options.find(option => defaultParams[item.field] == option.id);
                    values[item.field] = `${item.id}|${valItem.text}|${valItem.id}`
                }
            }else{
                values[item.field] = ''
            }

            if (item.linkageVal && item.linkageVal != -1) item.linkageVal = -1;

            if (item.syncOptions) item.options = [];

            if (item.multiple) {
                item.multiple.status = false;
                item.type='tag';
            };

            if(item.id === 3 || item.id===4) {
                item.options =[];
                item.oftenOptions = []
                // console.log(item)
            };

            // if(item.field === 'agency'){
            //     item.type='tag,search'
            // }
        });

        filterInit && (this.state.filter.data = filterInit);

        // this.state.search.values.keywordType = search.types[0].key
        this.state.filter.values = values;
        this.state.rss.active = false;

        //console.log(search);
        //console.log('init', init);

        if(init && !rss.show){
            this.props.onSearch(defaultParams)
        }
    }

    render() {
        const {comboboxSearch, assetFamily, resGroup, pageId, hotSearchs, showSearchBar, placeholder, modal, inputLeft, onRss} = this.props;
        const {search, filter, rss} = this.state;
        const dataFilter = filter.data;

        //console.log(search.values);

        return (
            <div className="filter-container">
                {(showSearchBar && dataFilter.length > 0) &&
                <SearchBar inputLeft={inputLeft} hotKey={search.hotKey} hotSearchs={hotSearchs} keywordType={search.values.keywordType} keyword={search.values.keyword} pageType={pageId || 0} types={search.types} resGroup={resGroup} placeholder={placeholder} onChange={this.handleChange.bind(this)}/>}
                {dataFilter.length > 0 && <FilterBox onRss={onRss} modal={modal} assetFamily={assetFamily} activeRss={rss.active} showRss={rss.show} pageType={pageId || 0} values={filter.values} resGroup={resGroup} comboboxSearch={comboboxSearch} data={dataFilter} onChange={this.handleChange.bind(this)}/>}
            </div>
        )
    }
}

export default connect()(searchBox);
