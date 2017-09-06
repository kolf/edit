import React, {Component} from "react";

import {ExThumbnailBox}          from "app/containers/cms/exThumbnail";

export default class FocusPic extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "addition": [
        {
          "type": "input",
          "field": "author",
          "label": "摄影师："
        },
        {
          "type": "input",
          "field": "describe",
          "label": "图片标题："
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
        <button className="thumbnailBox thumbnail alignCenter" onClick={this.addFocusPic}>+</button>
      </div>
    );
  }
}