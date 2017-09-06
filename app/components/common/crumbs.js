import React, {Component} from "react";
import ReactDOM           from "react-dom";
import {Link}             from "react-router";


export default class CrumbsBox extends Component {

  constructor(props) {
    super(props);
  };

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps);
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

  render() {
    return (
      <div id="breadcrumbs" className="breadcrumbs">
        <ul className="breadcrumb">
          {this.renderCrumb()}
        </ul>
        {
          // <div id="nav-search" className="nav-search">
          //     <form className="form-search">
          //         <span className="input-icon">
          //             <input type="text" placeholder="Search ..." className="nav-search-input" id="nav-search-input" />
          //             <i className="ace-icon fa fa-search nav-search-icon"></i>
          //         </span>
          //     </form>
          // </div>
        }
      </div>
    )
  };
}

// <li><i className="ace-icon fa fa-home home-icon"></i><Link to="#">Home</Link></li>
// <li><Link to="#">Tables</Link></li>
// <li className="active">Simple &amp; Dynamic</li>
