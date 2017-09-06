import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {Link}             from "react-router";

export default class BreadCrumbs extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      crumbsTags: props.crumbsTags
    }
  };
  
  renderCrumb() {
    const {crumbs} = this.props;
    const len = crumbs.length;
    return (
      crumbs.map((item, i) => {
        const {path, text} = item;
        var active = (len == 1 || len == i) ? 'active' : '',
          icon = (i == 0) ? <i className="ace-icon fa fa-home home-icon"></i> : '';
        return (
          <li className={ active } key={i}>
            { icon }
            { len != (i + 1) && len != 1 ? <Link to={path}>{text}</Link> : text}
          </li>
        )
      })
    )
  };
  
  renderCrumbTag() {
    const {crumbsTags} = this.state;
    if (!crumbsTags) {
      return null
    }
    ;
    return (
      <li id="j_crumbs_tags" className="crumbsTags">
        {crumbsTags.map((item, i) => {
          const id = "tag_" + item.field + '_' + item.value;
          return (
            <span ref={id} className="tag" key={i}>
                            <span className="txt">{item.text}</span>
                            <i className="fa fa-times smaller-20"
                               data-field={item.field}
                               onClick={this.handleOnTag.bind(this)}></i>
                        </span>
          );
        })}
      </li>
    );
  };
  
  handleOnTag(event) {
    const target = event.target;
    const field = target.getAttribute('data-field');
    const {crumbsTags} = this.state;
    crumbsTags.map((item, i) => {
      if (item.field == field) {
        delete crumbsTags[i]
      }
    });
    this.setState({
      "crumbsTags": crumbsTags
    });
    this.props.onCrumbsTags(field);
  }
  
  render() {
    return (
      <div id="breadcrumbs" className="breadcrumbs">
        <ul className="breadcrumb">
          {this.renderCrumb()}
          {this.renderCrumbTag()}
        </ul>
        <div id="nav-search" className="nav-search">
          <form className="form-search">
                        <span className="input-icon">
                            <input type="text" placeholder="Search ..." className="nav-search-input"
                                   id="nav-search-input"/>
                            <i className="ace-icon fa fa-search nav-search-icon"></i>
                        </span>
          </form>
        </div>
      </div>
    )
  };
}

// <li><i className="ace-icon fa fa-home home-icon"></i><Link to="#">Home</Link></li>
// <li><Link to="#">Tables</Link></li>
// <li className="active">Simple &amp; Dynamic</li>
