import React, {Component, PropTypes} from "react";
import Header             from "app/containers/header";
import SidebarNav         from "app/containers/sidebar/index";
import {navArr}           from "app/containers/sidebar/navData";

import {isStorage, getStorage, setStorage} from "app/api/auth_token";

export default class SecuredContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  };
  
  static contextTypes = {
    "router": React.PropTypes.object.isRequired
  };
  
  componentWillMount() {
    if (!isStorage('token')) {
      this.context.router.push("/login");
    }
  };
  
  render() {
    let pathname = this.props.location.pathname;
    
    return (
      <div className="secured-layout">
        <Header />
        <div id="main-container" className="main-container">
          <SidebarNav navData={navArr} pathname={pathname}/>
          <div className="main-content">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  };
}
