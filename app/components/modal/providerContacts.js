import React, {Component} from "react";
import ReactDOM           from "react-dom";
import TableBox           from "app/components/editor/table";

// input:{Lists}
// output: components

const tableInit = {
    "idField": "id",
    "isTitle": null,
    "noTitle": true,
    "head": [
        {
            "field": "name",
            "text": "姓名"
        }, {
            "field": "jobTitle",
            "text": "职位"
        }, {
            "field": "mobile",
            "text": "手机"
        }, {
            "field": "email",
            "text": "邮箱"
        }, {
            "field": "workTel",
            "text": "办公电话"
        }, {
            "field": "qq",
            "text": "QQ"
        }, {
            "field": "skype",
            "text": "Skype"
        }, {
            "field": "isDefault",
            "text": "主联系人",
            "type": "status",
            "isFun": "callbackIsDefault"
        }
    ],
    "list": null,
    "pages": 1,
    "params": null
};

export default class ProviderContacts extends Component {

    constructor(props) {
        super(props);
    };

    render() {
        tableInit.list = this.props.Lists;

        //console.log(tableInit.list);
        return (
            <div id="editRecord" style={{"height":"300px","overflow":"auto"}}>
                <TableBox tableInit={tableInit} />
            </div>
        )
    };
}
