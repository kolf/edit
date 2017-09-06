import React, {Component, PropTypes} from "react";
import {Link}     from "react-router";
import storage from "app/utils/localStorage";
import cs from "classnames";

export default class SidebarNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: true,
      projectName: 'zh',
      pathName: props.pathname,
      navData: props.navData
    };
    
    this.depth = 0;
    this.projects = props.navData.map(item => item.projectName);
  };
  
  componentWillMount() {
    const paths = this.props.pathname.split('/');
    this.state.projectName = this.projects.indexOf(paths[1]) != -1 ? paths[1] : 'zh'
  }
  
  componentWillReceiveProps(nextProps) {
    const {projectName, pathName} = this.state;
    
    if (pathName == nextProps.pathname) {
      return false;
    }
    
    const paths = nextProps.pathname.split('/');
    this.state.pathName = nextProps.pathname;
    
    if (paths[1] != projectName) {
      const projectName = this.projects.indexOf(paths[1]) != -1 ? paths[1] : 'zh';
      this.state.projectName = projectName;
      storage.set('projectName', projectName);
    }
  }
  
  render() {
    // const {navData} = this.props;
    const {projectName, pathName, expand, navData} = this.state;
    
    const navList = navData.length == 1 ? navData[0].children : navData.find(nav => nav.projectName == projectName).children;
    
    const renderNav = (list, depth) => {
      return list.map(item => {
        let pathReg = new RegExp(item.path + '/');
        return item.onClick ? (<li className={cs({'active': pathName == item.path || pathReg.test(pathName)})}>
          <a herf={item.path} onClick={item.onClick}><i className={'menu-icon fa ' + item.icon}></i><span
            className="menu-text">{item.text}</span>{item.children && <b className="arrow fa fa-angle-down"></b>}</a>
          {item.children && <ul className="submenu">{renderNav(item.children, this.depth + 1)}</ul>}
        </li>) : (<li className={cs({'active': pathName == item.path || pathReg.test(pathName)})}>
          <Link target={item.type} to={item.path}><i className={'menu-icon fa ' + item.icon}></i><span
            className="menu-text">{item.text}</span>{item.children && <b className="arrow fa fa-angle-down"></b>}</Link>
          {item.children && <ul className="submenu">{renderNav(item.children, this.depth + 1)}</ul>}
        </li>)
      })
    };
    
    return (
      <div className={cs('sidebar', {'responsive': expand, 'menu-min': !expand})}>
        {navData.length > 1 && <div className="sidebar-shortcuts">
          <div className="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
            {navData.map(nav => {
              if (!nav.text) return null;
              const props = {
                className: cs({'btn': true, 'active': nav.projectName == projectName}),
                style: {'width': '30%', 'fontSize': 12}
              };
              return nav.onClick ? (<a {...props} herf={nav.path} onClick={nav.onClick}>{nav.text}</a>) : (
                <Link {...props} to={nav.path}>{nav.text}</Link>)
            })}
          </div>
          <div className="sidebar-shortcuts-mini">
            <button className="btn active"></button>
            <button className="btn"></button>
            <button className="btn"></button>
            <button className="btn"></button>
          </div>
        </div>}
        {navList && <ul className="nav nav-list">{renderNav(navList, this.depth)}</ul>}
        <div className="sidebar-toggle sidebar-collapse">
          <i onClick={() => {
            this.setState({expand: !expand})
          }} className={expand ? "ace-icon fa fa-angle-double-left" : "ace-icon fa fa-angle-double-right"}></i>
        </div>
      </div>
    )
  }
}
