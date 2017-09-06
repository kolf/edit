export function UpdateImgData(width, height, index, field, value, _this) {
  if (width != 0 && height != 0) {
    let img = new Image();
    img.src = "http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com" + value;
    img.onload = function () {
      //console.log("p",img.width/img.height);
      if (img.width / img.height != width / height || (img.width != width || img.height != height)) {
        _this.alertMsg("请上传最小尺寸为" + width + "/" + height + "的图");
      }
      else {
        _this.state.picListData.list[index][field] = value;
        _this.forceUpdate();
      }
    }
  }
  else {
    _this.state.picListData.list[index][field] = value;
    _this.forceUpdate();
  }
  
}