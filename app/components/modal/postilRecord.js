import React, {Component} from "react";
import ReactDOM           from "react-dom";
import TableBox           from "app/components/editor/table";

// input:{Lists}
// output: components

const tableInit = {
    "idField": "id",
    "isTitle": null,
    "head": [
        {
            "field": "createdTime",
            "text": "批注时间",
        },
        {
            "field": "userName",
            "text": "批注人"
        },
        {
            "field": "message",
            "text": "批注内容",
        }
    ],
    "list": null,
    "pages": 1,
    "params": null
};

export default class EditRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lists: this.filterData(this.props.Lists)
        }
    };

    filterData(lists) {
        let _lists = [];
        if(lists) {
            [...lists].map((item, i)=>{
                const list = {
                    id: item.id,
                    createdTime: item.createdTime,
                    userName: item.userName,
                    message: item.message
                };
                _lists.push(list);
            });
        }

        tableInit.list = _lists;
        return _lists;
    };

    render() {
        const {lists} = this.props;
        return (
            <div id="editRecord" className="editRecord">
                <TableBox {...tableInit}/>
            </div>
        )
    };
}
