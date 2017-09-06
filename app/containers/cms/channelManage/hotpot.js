import React, {Component} from "react";

import {ExThumbnailBox}          from "app/containers/cms/exThumbnail";

export default class Hotpot extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "addition": [
        {
          "field": "size",
          "label": "图片大小："
        },
        {
          "type": "input",
          "field": "link",
          "label": "图片链接："
        }
      ]
    };
  }
  
  render() {
    return (<div>
        <ExThumbnailBox {...this.props}{...this.state}/>
        <button className="thumbnailBox thumbnail alignCenter" onClick={this.addHotpotPic}>+</button>
      </div>
    );
  }
}