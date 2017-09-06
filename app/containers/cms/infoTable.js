import React, {Component} from "react";

export class InfoTable extends Component {
  render() {
    const {idField, list} = this.props;
    if (!idField) {
      return false
    }
    ;
    return (
      <div id={idField + '_div'} className="table-responsive">
        <table className="table table-striped table-bordered table-hover table-condensed">
          {this.renderHead()}
          {this.renderBody()}
        </table>
      </div>
    )
  }
  
  renderHead() {
    const {idField, head} = this.props;
    const len = head.length;
    return (
      <thead>
      <tr id={idField + '_head'}>
        {[...head].map((item, i) => {
          let {field, text, type, width} = item;
          width = width || '';
          return (
            <th key={i} width={width}>{text}</th>
          )
        })}
      </tr>
      </thead>
    )
  }
  
  renderBody() {
    const {idField, head, list} = this.props;
    const colSpan = head.length;
    const body = [...list].map((tr, i) => {
      const element = this.renderBodyTr(tr, i);
      return [element];
    });
    return (
      <tbody>
      {body}
      </tbody>
    )
  }
  
  renderBodyTr(tr, rowIndex) {
    const {idField, head} = this.props;
    const id = tr[idField];
    const len = head.length;
    return (
      <tr id={idField + '_' + id}>
        {[...head].map((item, i) => {
          const {field, type} = item;
          let td_tag;
          const text = tr[field];
          switch (type) {
            case "customize":
              td_tag = item.customize(text, rowIndex);
              break;
            default:
              td_tag = text;
              break;
          }
          return (<td key={i} data-id={id}>{td_tag}</td>);
        })}
      </tr>
    )
  };
}
