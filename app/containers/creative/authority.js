import React, {Component} from "react";
import {connect} from "react-redux";
import CrumbsBox from "app/components/common/crumbs";
import AuthorityFilesPanel from "./authorityFiles";

const select = (state) => ({});
@connect(select)

export default class CreateAuthorityContainer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首頁"},
        {"path": props.location.pathname, "text": "肖像权/物权文件"}
      ],
      "authFile": ''
    };
  };
  
  componentWillMount() {
  
  };
  
  render() {
    const {crumbs, authFile} = this.state;
    const {params: {id, type}} = this.props;
    
    return (
      <div className="main-content-inner">
        
        <CrumbsBox crumbs={crumbs}/>
        <div className="page-content">
          <div className="col-xs-6">
            <AuthorityFilesPanel id={id} type={type} onChangeRelatedFile={this.handleOnChangeRelatedFile.bind(this)}/>
          </div>
          {/*<div className="col-xs-8"><AuthFileRelatedPicsPanel authFile={authFile}/></div>*/}
        </div>
      </div>
    );
  };
  
  handleOnChangeRelatedFile(authFile) {
    //console.log(authFile);
    this.setState({
      authFile
    });
  };
}
