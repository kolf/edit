import React, {Component} from "react"
import ReactDOM           from "react-dom";
import {Link}             from "react-router";
import {Tooltip, OverlayTrigger} from "react-bootstrap/lib";

export default class TableBox extends Component {

    constructor (props) {
        super(props);
        this.state = {
            "checkedAll":false,
            "checked":{},
            "expandIcon":{},
            "expandTr":{},
            "params":{}
        };
    };

    renderThead () {
        const {fieldId, thead, pid} = this.props;
        const trId = pid ? pid + '_thead': fieldId + '_thead';
        return (
            <thead><tr id={trId} data-id-field={fieldId}>
                {[...thead].map((item,i) => {
                const {type, text} = item;
                let th;
                if(type =="checkbox") {
                    th = <label>
                            <input type="checkbox"
                                   data-operate="checkboxAll"
                                   data-pid={trId}
                                   checked={this.state.checkedAll}
                                   onChange={this.handleOnClick.bind(this)} />
                            {text}
                         </label>;
                } else {
                    th = text
                }
                return (
                    <th key={i}>{th}</th>
                )

            })}
            </tr></thead>
        )
    };


    renderTbody () {
        const {expand, fieldId, thead, list, pid} = this.props;
        const len = thead.length;
        const tbody = [...list].map((tr) => {
            const element = this.renderTbodyTr(tr);
            if(expand){
                const id = tr[fieldId];
                const trId = pid ? pid + '_' + id + '_expand' : fieldId + '_' + id + '_expand';
                const expandElement = <tr className={this.state.expandTr[id]?this.state.expandTr[id]:"hidden"}><td colSpan={len}><div id={trId} className="position-relative"></div></td></tr>;
                return [element, expandElement];
            }else{
                return [element];
            }
        });
        return (
            <tbody>
                {tbody}
            </tbody>
        )
    };

    renderTbodyTr (tr) {
        const {fieldId, thead, pid} = this.props;
        const id = tr[fieldId];
        const trId = pid ? pid + '_' + id : fieldId + '_' + id;
        return (
            <tr id={trId} data-id={id} data-id-field={fieldId}>
                {[...thead].map((item, j) => {
                    const {field, type} = item;
                    let td_tag;
                    const text = tr[field];
                    switch (type) {
                        case "checkbox":
                            td_tag = (
                                <label>
                                    <input type="checkbox"
                                        data-operate={type}
                                        data-pid={trId}
                                        checked={this.state.checked[id]}
                                        onChange={this.handleOnClick.bind(this)} />
                                </label>
                            );
                            break;
                        case "expand":
                            td_tag = (
                                <label>
                                    <i className={this.state.expandIcon[id]?this.state.expandIcon[id]:"arrow fa fa-plus blue bigger-110 hand"}
                                       data-operate={type}
                                       data-pid={trId}
                                       onClick={this.handleOnClick.bind(this)}
                                        ></i>{text}
                                </label>
                            );
                            break;
                        case "click":
                            td_tag = (
                                <span data-scope-field={field}
                                      data-operate={type}
                                      data-pid={trId}
                                      onClick={this.handleOnClick.bind(this)}
                                      className="text-primary hand">{text}</span>
                            );
                            break;
                        case "link":
                            const href = item.href + id;
                            td_tag = (<a href={href}>{text}</a>);
                            break;
                        case "status":
                            td_tag = item.status[text];
                            break;
                        case "select":
                            const params = {
                                "data":[...item.select],
                                "operate": type,
                                "scopeField": field,
                                "scope": text,
                                "pid": trId
                            };
                            td_tag = this.renderSelect(params);
                            break;
                        case "operate":
                            td_tag = this.renderOperate(item.operate, tr);
                            break;
                        default:
                            td_tag = text
                    }
                    return (<td key={j}>{td_tag}</td>);
                })}
            </tr>
        )
    };

    renderSelect (params) {
        const {data,scopeField,scope,operate,pid} = params;
        var html = data.map((item, i) => {
            return (
                <option value={item.id} key={i}>{item.text}</option>
            )
        });
        const selectId = pid + '_' + scopeField;
        return (
            <div className="input-daterange input-group">
                <select id={selectId}
                    data-scope-field={scopeField}
                    defaultValue={scope}
                    data-operate={operate}
                    data-pid={pid}
                    className="form-control"
                    onChange={this.handleOnClick.bind(this)}>
                    {html}
                </select>
            </div>
        )
    }

    renderOperate (operate, tr) {
        const {fieldId, pid} = this.props;
        const id = tr[fieldId];
        const trId = pid ? pid + '_' + id : fieldId + '_' + id;
        var item = [...operate].map((item, i) => {
            const {type, text, icon, field} = item;
            let text_tag,text_val;
            if(field == "status"){
                text_val = text[tr[field]];
            }else{
                text_val = text;
            }
            if(icon){
                const tooltip = (<Tooltip id={'j_'+type}>{text_val}</Tooltip>);
                text_tag = (
                    <OverlayTrigger placement="top" trigger={['click', 'hover', 'focus']} overlay={tooltip} key={i}>
                        <i data-scope-field={field}
                           data-operate={type}
                           data-pid={trId}
                           onClick={this.handleOnClick.bind(this)}
                           className={"ace-icon fa hand blue bigger-110 "+ icon}></i>
                    </OverlayTrigger>
                );
            }else{

                switch (type) {
                    case "link":
                        const href = item.href + id;
                        text_tag = (<a href={href} key={i} className="hand">{text_val}</a>);
                        break;
                    case "click":
                        //const scope = tr[field];
                        const spanId = type + '_' + field + '_' + id;
                        text_tag = (
                            <span id={spanId} key={i}
                                  data-scope-field={field}
                                  data-scope={tr[field]}
                                  data-operate={type}
                                  data-pid={trId}
                                  onClick={this.handleOnClick.bind(this)}
                                  className="text-primary hand">{text_val}</span>
                        );
                        break;
                }

            }
            return text_tag;

        });

        return (
            <span>{item}</span>
        )
    };

    render () {
        const {fieldId, list, pid} = this.props;
        const tableId = pid ? pid : fieldId;
        return (
            <div id={tableId} className="col-xs-12 table-responsive">
                {!list &&
                    <i className="ace-icon fa fa-spinner fa-spin orange bigger-200"></i>
                }
                {list &&
                    <table className="table table-striped table-bordered table-hover table-condensed">
                        {this.renderThead()}
                        {this.renderTbody()}
                    </table>
                }
            </div>
        );
    };

    handleOnClick (event) {
        //event.preventDefault();
        const target      = event.target;
        const pid         = target.getAttribute('data-pid');
        const scopeField  = target.getAttribute('data-scope-field');
        const operate     = target.getAttribute('data-operate');
        const tr          = document.getElementById(pid);
        const idField     = tr.getAttribute('data-id-field');
        const id          = tr.getAttribute('data-id');

        this.state.params = {
            "id": id,
            "pid": pid,
            "operate": operate,
            "idField": idField,
            "scopeField": scopeField
        };
        switch (operate) {
            case "expand":
                this.onExpand();
                break;
            case "checkboxAll":
                this.onCheckboxAll();
                break;
            case "checkbox":
                this.onCheckbox();
                break;
            case "select":
                this.state.params.scope = target.value;

                this.props._handleOnClick(this.state.params);
                break;
            default:
                const {params} = this.state;
                this.props._handleOnClick(params);
        }
    };

    onCheckboxAll () {
        const {checkedAll, checked, params} = this.state;
        const {idField} = params;
        const all = !checkedAll,ids=[];
        const {list} = this.props;
        list.map((item) => {
            const idn = item[idField];
            if(all){ids.push(idn);}
            checked[idn] = all
        });
        this.setState({
            "checkedAll": all,
            "checked":checked
        });
        params.ids = ids;
        this.props._handleOnClick(params);
    };

    onCheckbox () {
        const {checked, params} = this.state;
        const {idField, id} = params;
        checked[id] = !checked[id];
        let all = true,ids=[];
        const {list} = this.props;
        list.map((item)=>{
            const idn = item[idField];
            if(!checked[idn]){
                all = false;
            }else{
                ids.push(idn);
            }
        });
        this.setState({
            "checkedAll": all,
            "checked": checked
        });
        params.ids = ids;
        this.props._handleOnClick(params);
    };

    onExpand () {
        const {expandIcon, expandTr, params} = this.state;
        const {id, idField} = params;
        const open = !!(expandTr[id]==undefined||expandTr[id]=="hidden");
        const {list} = this.props;
        list.map((item)=>{
            const idn = item[idField];
            expandIcon[idn] = "arrow fa fa-plus blue bigger-110 hand";
            expandTr[idn] = "hidden";
        });
        this.setState({
            "expandIcon": expandIcon,
            "expandTr": expandTr
        });
        expandIcon[id] = open ? "arrow fa fa-minus blue bigger-110 hand":"arrow fa fa-plus blue bigger-110 hand";
        expandTr[id] = open ? "fade in" : "hidden";
        this.setState({
            "expandIcon": expandIcon,
            "expandTr": expandTr
        });
        this.props._handleOnClick(params);
    };
}