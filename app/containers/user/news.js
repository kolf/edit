import React, {Component} from "react";
import {connect} from "react-redux";
import CrumbsBox from "app/components/common/crumbs";
import TableBox from "app/components/editor/table";
import {getMyNewsList, postDeleteMyNews, postToMyNews} from "app/action_creators/person_action_creator";

const select = (state) => ({
    newsTable: state.person.newsTable
});
@connect(select)

export default class NewsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首頁"},
                {"path": "/user", "text": "用户中心"},
                {"path": "/user/password", "text": "修改密码"}
            ]
        };
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {
        this.queryList();
    };

    render() {
        const {crumbs} = this.state;
        return (
            <div className="main-content-inner">

                <CrumbsBox crumbs={crumbs}/>

                <div className="page-content">
                    <div className="row pl-10">
                        <button className="btn btn-sm btn-info mr-5">
                            <i className="ace-icon fa fa-bug"></i>批量删除
                        </button>
                        <button className="btn btn-sm btn-info mr-5">
                            <i className="ace-icon fa fa-star"></i>新建电子邮件
                        </button>
                        <button className="btn btn-sm btn-info">
                            <i className="ace-icon fa fa-star"></i>新建消息
                        </button>
                    </div>

                    <hr/>

                    <TableBox {...this.props.newsTable} onTable={this.handleOnTable.bind(this)}/>
                </div>
            </div>
        );
    };

    queryList() {
        const {dispatch} = this.props;

        dispatch(getMyNewsList()).then(result => {
            if (result.apiError) return false;

        });
    };

    handleOnTable({operate, data}) {
        switch (operate) {
            case "comment":
                this.context.router.push("/postil/" + data.item.id);
                break;
            default:
                //console.log(operate);
                //console.log(data);
        }
        //this.state.tableParams = Object.assign(this.state.tableParams, params);
    };


}




