import React, {Component} from "react";
import ReactDOM from "react-dom";
import {connect} from "react-redux";
import {
    form,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    HelpBlock,
    Collapse,
    Fade
} from "react-bootstrap/lib";

import {searchRsList} from "app/action_creators/search_action_creator";

const searchList = (state) => ({
	"error": state.search.error,
  "doing": state.search.doing,
	"searchData": state.search.data
});
@connect(searchList)

export default class SearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "value": "",//input值
            "type": "keyword",//输入类型
            "helpblock": "关键词:  查询中...",
            "helpblockshow": false,
            "helptimeout": null,
            "inputtimeout": null,
            "open": false,//下拉展开
            "inneropen": {},
            "fallback": false,//提示栏是否显示
            "params": {
                "user": "admin",
                "title": ""
            },
            "isclose": false,//判断组件是否加载
        }

    };

    componentDidMount() {
        let _this = this;
        window.addEventListener('click', function closelist(e){
            if (_this.state.isclose) {
                window.removeEventListener('click', closelist);
            }else{
                _this.setState({open: false});
            }
        });
    };

    componentWillUnmount() {
        this.state.isclose = true;
    };

    getValidationState() {
        if (this.props.error){
            this.helpBlock('返回结果错误');
            return 'error';
        }
        else if (this.props.doing) {
            this.helpBlock('搜索中...');
            return 'success';
        }
        else if(this.state.fallback){
            return 'success';
        }
    };

    handleChange(e) {
        let _value = e.target.value;
        this.setState({ value: e.target.value });
        this.helpblockShow();
        let type = this.selectType(_value);
        //console.log(this.state.type,type);

        if (this.state.inputtimeout){
            clearTimeout(this.state.inputtimeout);
            this.state.inputtimeout = null;
            this.helpBlock('输入中...');
        }
        this.state.inputtimeout = setTimeout(()=>{
            if(_value){
               if(type !== 'keyword'){
                   this.setState({open: false});
               }else{
                   this.searchList();
               }
            }else{
               this.reListHide();
            }
        },500);
    };

    render() {
        return (
            <div className="searchbox row" ref="searchBox" onClick={(e)=>{e.stopPropagation()}} >

                <FormGroup controlId="formBasicText" validationState={this.getValidationState()} className="col-xs-10">
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="请输入关键词"
                        onChange={this.handleChange.bind(this)}
                    />
                    <FormControl.Feedback />
                    <Fade in={this.state.helpblockshow}>
                        <HelpBlock  onClick={this.reflashhelp.bind(this)}>{this.state.helpblock}</HelpBlock>
                    </Fade>
                    <Collapse in={this.state.open}>
                        <div id="ReList" className="search-list"></div>
                    </Collapse>
                </FormGroup>
                <Button  bsStyle="info" className="col-xs-2 ace-icon fa fa-search" onClick={this.search.bind(this)}>  搜索</Button>
            </div>
        );
    };

    // 触发api
    searchList() {
        const { dispatch } = this.props;
        this.state.params.word = this.state.value;
        let params = {
            "api": this.props.listApi,
            "data": this.state.params
        };
        if(this.props.params){
            Object.assign(params, this.props.params);
        }
        dispatch(searchRsList(params)).then((result) => {
            if (result.apiError) return false;
            const {searchData} = this.props;
            this.helpBlock('搜索成功');
            if(this.props.renderList){
                this.props.renderList(searchData);
            }else{
                this.renderReList(searchData);
            }
        });
    };

    //渲染下拉
    renderReList(searchData) {
        const dom = document.getElementById('ReList');
        const list =
            <div id="searchList">
                {this.renderList(searchData)}
            </div>;

        ReactDOM.render(list,dom);
        this.reListShow();

    };

    renderList(data) {
        let dom = [];
        var open = {};
        this.setState({inneropen: open});
        for (let key in {...data}){
            open[key] = true
            this.setState({inneropen: open});

            if(key == 'customer') {
                const title = '客户列表';
                dom.push(this.querylist(data[key], title, key));
            }
            if(key == 'constract') {
                const title = '合同列表';
                dom.push(this.querylist(data[key], title, key));
            }
            else{
            }
        };
        // //console.log(open);
        return dom;
    };

    querylist(items, title, key) {
        let open = this.state.inneropen[key];
        return(
            <div className="list-item" key={key}>
                <div className="title">
                    <span>{title}</span>
                    <i data-key={key} className="ace-icon fa fa-angle-double-up toggle"></i>
                </div>
                <ul className={"collapse " + this.state.inneropen[key]? "in" : ""}>
                    {[...items].map((item, i) => {
                        return(
                            <li key={i}><span data-pid={key + '_' +item.id} onClick={this.itemClick.bind(this)}>{item.contractTitle}</span></li>
                        )
                    })}
                </ul>
            </div>
        );
    };

    toggleListItem(event) {
        const target = event.target;
        const key = target.getAttribute('data-key');
        let open = this.state.inneropen;
        open[key] = !open[key];
        this.setState(open);
        //console.log(this.state.inneropen);
    };

    //改变help提示状态
    helpBlock(status) {
        let type = "";
        if(status){
            type = this.state.params.title + "：";
        }else{
            type = this.state.params.title;
        }

        this.state.helpblock = type + status;

    };

    reflashhelp() {
        //console.log(this.state.helpblock);
    };

    helpblockShow() {
        if(this.state.helptimeout){
            clearTimeout(this.state.helptimeout);
            this.setState({helptimeout: null});
        }
        if(!this.state.fallback){
            this.setState({fallback: true});
        }
        this.setState({helpblockshow: true});

    };

    helpblockHide(time) {
        if(this.state.helpblockshow){
            this.state.helptimeout = setTimeout(()=>{
                this.setState({helpblockshow: false});
                this.setState({fallback: false});
            },time);
        }
    };

    reListShow() {
        this.setState({open: true});
        this.helpblockShow();


    };

    reListHide() {
        this.setState({open: false});
        this.helpblockHide(300);
    };


    //点击下拉信息
    itemClick(event) {
        const _value = this.state.value;
        const target = event.target;
        const pid = target.getAttribute('data-pid');
        //console.log(pid);
        this.props.onSearch({keyword: _value, pid: pid});
        this.reListHide();
    };

    //点击搜索
    search() {
        const _value = this.state.value;
        this.props.onSearch({keyword: _value});
        this.reListHide();
    };

    //输入类型判断
    selectType(value) {
        let _params = this.state.params;
        let post = this.props.rule(value);
        post.user = _params.user;
        this.setState({type: post.type});
        this.setState({params: post});

        return post.type;
    };
};
