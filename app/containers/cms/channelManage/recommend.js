import React, {Component} from "react";

import {ExThumbnailBox}          from "app/containers/cms/exThumbnail";

export default class Recommend extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      "addition": [
        {
          "type": "input",
          "field": "title",
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
    const {addData, deleteData, sortAble, onUpdateData} = this.props;
    return (<div>
        <ExThumbnailBox
          {...this.props}
          {...this.state}
          
          addPic={addData}
          deletePic={deleteData}
          contentChange={onUpdateData}
          sortAble={sortAble}
        />
      </div>
    );
  };
  
  addFocusPic() {
    this.props.addData();
  }
  
  deletePic(index) {
    this.props.deleteData(index);
  }
}