import React, {Component} from "react";

export class Steps extends Component {
  render() {
    const stepButtons = [...this.props.stepButtons];
    return (
      <div className={this.props.className}>
        {
          [...stepButtons].map((btn, i) => {
            const btnClass = "btn " + btn.className;
            const icon = "ace-icon fa " + btn.icon;
            return <button className={btnClass} key={i} onClick={btn.handler}>
              <i className={icon}></i>{btn.text}
            </button>
          })
        }
      </div>
    );
  }
}