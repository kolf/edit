import React, {Component} from "react";
import ReactDOM           from "react-dom";
import TableBox           from "app/components/editor/table";

// input:{Lists}
// output: components

export default class EditRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    };


    render() {
        const {Lists, head} = this.props;

        const tableInit = {
            "idField": "id",
            "isTitle": null,
            "noTitle": true,
            "head": head,
            "list": Lists ? Lists.map(item => {
                return {
                    id: item.id,
                    createdTime: item.createdTime || item.createTime,
                    userName: item.userName,
                    message: item.message
                }
            }) : [],
            "pages": 1,
            "params": null
        };

        return (
            <div id="editRecord" style={{"height":"300px","overflow":"auto"}}>
                <TableBox tableInit = {tableInit} />
            </div>
        )
    };
}
