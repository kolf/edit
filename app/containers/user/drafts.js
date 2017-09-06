import React, {Component} from "react";
import {connect}          from "react-redux";

import CrumbsBox from "app/components/common/crumbs";
import TableBox from "app/components/editor/table";

import Spin from 'antd/lib/spin';

import {getDraftData, postRelieveDraft} from "app/action_creators/person_action_creator";

const select = (state) => ({
    draftList : state.person.draftList
});
@connect(select)

export default class DraftsContainer extends Component {

    constructor (props) {
        super(props);
        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首页"},
                {"path": "/user", "text": "用户中心"},
                {"path": "/user/drafts", "text": "我的草稿箱"}
            ]
        };
    };

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    componentWillMount() {
        this.queryList();
    };

    render () {
        const {crumbs} = this.state;
        const {draftList} = this.props;
        // //console.log(draftList)
        return (
            <div className="main-content-inner">

				<CrumbsBox crumbs={crumbs} />
                <div className="page-content">
                    {!draftList && <Spin/>}
                    {draftList &&
                        <TableBox onTable={this.handleOnTable.bind(this)} {...draftList}/>
                    }
                </div>

            </div>
        );
    };

    queryList() {
        const {dispatch} = this.props;

        dispatch(getDraftData(1)).then(result => {
            if(result.apiError) return false;
            this.render();
        });
    };

    handleOnTable(param) {
        const {operate, data} = param;
        const {dispatch} = this.props;
        let _type;
        switch (data.item.editType) {
            case 1:
                _type = "new_draft";
                break;
            case 2:
                _type = "merge_draft";
                break;
            case 3:
                _type = "edit_draft";
                break;
            default:
                _type = "edit_draft";
                break;
        };

        switch (operate) {
            case "editor":
                this.context.router.push("/edit/ids=" + data.item.groupId + "&type=" + _type);
                break;
            case "relieve":
                dispatch(postRelieveDraft({id:data.item.id})).then(result => {
                    if(result.apiError) return false; 
                    this.queryList();
                });
                break;
            default:
                break;
        }
        //console.log(param)
    }

}




