import React, {Component} from "react";
import HeaderContainer from "app/containers/header_container";
import FooterContainer from "app/containers/footer_container";

export default class IndexLayouts extends Component {
  
  render() {
    //console.log('loyout');
    //console.log(this.state);
    //console.log(this.props);
    return (
      <div className="all">
        <header className="header">
          <HeaderContainer />
        </header>
        <div className="container pt-20">
          <main>
            {this.props.children}
          </main>
        </div>
        <footer className="footer">
          <FooterContainer />
        </footer>
      </div>
    )
  }
}