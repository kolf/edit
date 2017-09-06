import React, {Component} from "react"
import {Link}             from "react-router";
import {Tooltip, OverlayTrigger} from "react-bootstrap/lib";

export default class TableBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "params": null,
      "checkbox": {
        "status": false,
        "text": "全选",
        "ids": [],
        "checked": {}
      },
      "expand": {
        "init": {
          "open": false,
          "icon": "arrow fa fa-plus blue bigger-110 hand",
          "tr": "hidden"
        },
        "data": {}
      }
    };
  };

  renderHead() {
    const {idField, head} = this.props;
    return (
      <thead>
      <tr id={idField + '_head'}>
        {[...head].map((item, i) => {
          const {field, text, type} = item;
          let th;
          switch (type) {
            case "checkbox":
              th = (
                <span>
                                    <label className="hand" onClick={this.onCheckboxAll.bind(this)}>
                                        <input type="checkbox" checked={this.state.checkbox.status} className="ace"/>
                                      {this.state.checkbox.text}
                                    </label> - {text}
                                </span>
              );
              break;
            default :
              th = text;
          }
          return (
            <th key={i}>{th}</th>
          )
        })}
      </tr>
      </thead>
    )
  };

  renderBody() {
    const {isExpand, idField, head, list} = this.props;
    const body = [...list].map((tr, i) => {
      const element = this.renderBodyTr(tr, i);
      if (isExpand) {
        const id = tr[idField];
        const {expand} = this.state;
        const trName = expand.data[id] ? expand.data[id].tr : expand.init.tr;
        const colSpan = head.length;
        const expandElement = (
          <tr className={trName}>
            <td colSpan={colSpan}>
              <div id={idField + '_' + id + "_expand"} className="position-relative"></div>
            </td>
          </tr>
        );
        return [element, expandElement];
      } else if (tr.children) {
        let childrenEl = [];
        const hideChildren = this.state.expand.data[tr[idField]];
        childrenEl = this.renderChildren(tr.children, hideChildren);
        return [element].concat(childrenEl);
      } else {
        return [element];
      }
    });
    return (
      <tbody>
      {body}
      </tbody>
    )
  };

  renderChildren(lists, hideChildren, level) {
    let el = [];
    level = level || 1;
    [...lists].map((child, childIndex) => {
      if (child.children) {
        const trHidden = this.state.expand.data[child[this.props.idField]];
        el.push(this.renderChildren(child.children, trHidden, level + 1));
      } else {
        el.push(this.renderBodyTr(child, childIndex, hideChildren, level));
      }
    });

    return el;
  }

  renderBodyTr(tr, rowIndex, hide, childLevel) {
    const {idField, head} = this.props;
    const id = tr[idField];
    const displayStyle = hide ? 'none' : '';
    return (
      <tr id={idField + '_' + id} style={{display: displayStyle}}>
        {[...head].map((item, j) => {
          const {field, type, isFun} = item;
          let td_tag;
          const text = tr[field] || "";
          switch (type) {
            case "checkbox":
              td_tag = (
                <label>
                  <input type="checkbox" value={id} checked={this.state.checkbox.checked[id]} className="ace"/>
                  <span className="lbl" data-id={id} onClick={this.onCheckbox.bind(this)}>{' ' + text}</span>
                </label>
              );
              break;
            case "image":
              const image = require('app/assets/images/gallery/thumb-5.jpg');
              td_tag = (
                <ul className="ace-thumbnails clearfix">
                  <li>
                    <img width="150" height="150" alt="150x150" src={image}/>
                  </li>
                </ul>
              );
              break;
            case "expand":
              const {expand} = this.state;
              const icon = expand.data[id] ? expand.data[id].icon : expand.init.icon;
              td_tag = (
                <span>
                                    <i className={icon}
                                       data-id={id}
                                       data-operate="expand"
                                       onClick={this.handleOnExpand.bind(this)}
                                    ></i> {text}
                                </span>
              );
              break;
            case "field":
              td_tag = (
                <span
                  data-operate={field}
                  data-id={id}
                  onClick={this.handleOnClick.bind(this)}
                  className="text-primary hand" title={text}>{text}</span>
              );
              break;
            case "link":
              const href = item.href ? item.href + id : '/' + idField + '/' + id;
              td_tag = (<a href={href} title={text}>{text}</a>);
              break;
            case "status":
              if (isFun && this.props[isFun]) {
                td_tag = this.props[isFun](tr, item.value);
              } else {
                td_tag = item.value[text];
              }
              break;
            case "select":
              td_tag = this.renderSelect({
                "data": item.value,
                "scopeField": field,
                "scope": text,
                "id": id
              });
              break;
            case "operate":
              td_tag = this.renderOperate({
                "itemData": tr,
                "data": item.value,
                "id": id,
                "rowIndex": rowIndex
              });
              break;
            case "customize":
              td_tag = item.customize.call(this, text, rowIndex, tr);
              break;
            case "expandChildren":
              if (childLevel) {
                const padding = 20 * childLevel;
                td_tag = <span style={{paddingLeft: padding}}>{text}</span>;
              } else if (tr.children) {
                const icon = this.state.expand.data[id] ? "arrow fa fa-plus blue bigger-110" : "arrow fa fa-minus blue bigger-110";
                td_tag = (<span>
                                    <i className={icon}
                                       data-id={id}
                                       data-operate="expand"
                                       onClick={this.handleOnExpandChildren.bind(this)}
                                    ></i> {text}
                                </span>)
              } else {
                td_tag = text;
              }
              break;
            default:
              td_tag = text
          }
          return (<td key={j}>{td_tag}</td>);
        })}
      </tr>
    )
  };

  renderSelect(params) {
    const html = [...params.data].map((item, i) => {
      return (
        <option value={item.id} key={i}>{item.text}</option>
      )
    });
    const selectId = 'j_select_' + params.scopeField + '_' + params.id;
    return (
      <select id={selectId}
              data-id={params.id}
              data-scope-field={params.scopeField}
              data-operate={params.scopeField}
              defaultValue={params.scope}
              onChange={this.handleOnClick.bind(this)}>
        {html}
      </select>
    )
  };

  renderOperateIcon(item, id, i, rowIndex) {
    const {operate, text, icon, field} = item;
    const tooltip = (<Tooltip id={'j_' + operate + '_' + id}>{text}</Tooltip>);
    return (
      <OverlayTrigger placement="top" trigger={['click', 'hover', 'focus']} overlay={tooltip} key={i}>
        <i data-scope-field={field} title={text}
           data-id={id}
           data-operate={operate}
           data-rowIndex={rowIndex}
           onClick={this.handleOnClick.bind(this)}
           className={"ace-icon fa hand blue bigger-110 " + icon}></i>
      </OverlayTrigger>
    );
  };

  renderOperateText(item, id, i) {
    const {idField} = this.props;
    const {operate, field, text, href} = item;
    let text_tag;
    if (operate == "link") {
      const url = href ? href + id : '/' + idField + '/' + id;
      text_tag = (<a href={url} title={text} className="hand" key={i}>{text}</a>);
    } else {
      text_tag = (
        <span id={'j_operate_' + operate + '_' + id}
              data-scope-field={field}
              data-id={id}
              data-operate={operate}
              onClick={this.handleOnClick.bind(this)}
              className="text-primary hand" key={i}>{text}</span>
      );
    }
    return text_tag;
  };

  renderOperate(params) {
    const id = params.id;
    const itemData = params.itemData;
    const item_tag = [];
    [...params.data].map(({...item}, i) => {
      if (item.operate == "status") {
        item.text = item.text[itemData[item.field]];
      }
      let text_tag;
      if (item.icon) {
        text_tag = this.renderOperateIcon(item, id, i, params.rowIndex);
      } else {
        text_tag = this.renderOperateText(item, id, i);
      }
      item_tag.push(text_tag);
    });
    return (
      <span>{item_tag}</span>
    )
  };

  render() {
    const {idField, list} = this.props;
    return (
      <div id={idField + '_div'} className="table-responsive">
        {!list &&
        <i className="ace-icon fa fa-spinner fa-spin orange bigger-200"></i>
        }
        {list &&
        <table className="table table-striped table-bordered table-hover table-condensed">
          {this.renderHead()}
          {this.renderBody()}
        </table>
        }
      </div>
    );
  };

  handleOnClick(event, rowIndex) {
    //event.preventDefault();
    const target = event.target;
    const {idField, list} = this.props;
    const id = target.getAttribute('data-id');
    const operate = target.getAttribute('data-operate');
    const scopeField = target.getAttribute('data-scope-field');
    const data = {};
    data.idField = idField;
    list.forEach((item) => {
      if (id == item[idField]) {
        data.item = item;
      }
    });
    if (!data.item) {
      data.item = {
        "id": id
      };
    }
    if (scopeField) {
      data.scopeField = scopeField;
    }
    this.props.onTable({
      "operate": operate,
      "data": data,
      "rowIndex": target.getAttribute('data-rowIndex') ? target.getAttribute('data-rowIndex') : "1"
    });
  };

  handleOnExpand(event) {
    event.preventDefault();
    const target = event.target;
    const id = target.getAttribute('data-id');
    const {expand} = this.state;
    const open = !(expand.data[id] ? expand.data[id].open : expand.init.icon.open);
    const {idField, list} = this.props;
    list.forEach((item) => {
      const idn = item[idField];
      this.state.expand.data[idn] = expand.init;
    });
    this.setState({
      "expand": {
        "init": expand.init,
        "data": expand.data
      }
    });
    this.state.expand.data[id] = {
      "open": open,
      "icon": open ? "arrow fa fa-minus blue bigger-110 hand" : "arrow fa fa-plus blue bigger-110 hand",
      "tr": open ? "fade in" : "hidden"
    };
    this.setState({
      "expand": {
        "init": expand.init,
        "data": expand.data
      }
    });
    this.handleOnClick(event);
  };

  handleOnExpandChildren(e) {
    const id = e.target.dataset['id'];
    this.state.expand.data[id] = !this.state.expand.data[id];
    this.forceUpdate();
  }

  onCheckboxAll(event) {
    event.preventDefault();
    const status = !this.state.checkbox.status, ids = [], checked = {};
    const {idField, list} = this.props;
    list.map((item) => {
      const idn = item[idField];
      if (status) {
        ids.push(idn);
      }
      checked[idn] = status;
    });
    const checkbox = {
      "status": status,
      "text": status ? "反选" : "全选",
      "ids": ids,
      "checked": checked
    };
    this.setState({
      "checkbox": checkbox
    });
    this.props.onTable({
      "operate": "checkbox",
      "data": {ids: ids}
    });
  };

  onCheckbox(event) {
    event.preventDefault();
    const target = event.target;
    const id = target.getAttribute('data-id');
    const {idField, list} = this.props;
    const checked = this.state.checkbox.checked, ids = [];
    let status = true;
    checked[id] = !checked[id];
    list.map((item) => {
      const idn = item[idField];
      if (!checked[idn]) {
        status = false;
      } else {
        ids.push(idn);
      }
    });
    const checkbox = {
      "status": status,
      "text": status ? "反选" : "全选",
      "ids": ids,
      "checked": checked
    };
    this.setState({
      "checkbox": checkbox
    });
    this.props.onTable({
      "operate": "checkbox",
      "data": {ids: ids}
    })
  };
}
