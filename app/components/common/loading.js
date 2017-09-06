import React, {Component} from "react";


export default class LoadingBox extends Component {
  
  constructor(props) {
    super(props);
    
  };
  
  render() {
    return (
      <div className="loading">
        <div className="message-loading-overlay">
          <i className="fa-spin ace-icon fa fa-spinner orange2 bigger-160"></i>
        </div>
      </div>
    )
  };
}