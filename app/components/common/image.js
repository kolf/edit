import React, {Component} from "react"

export default class image extends Component {

  constructor(props) {
    super(props);
    this.state = {
      "active": false,
      "dragger": {},
      "imageUrl": props.location.query.url,
      "bp_left": 0,
      "bp_right": 0,
      height: 0,
      width: 0
    };

    this.startX = 0;
    this.startY = 0;
    this.left = 0;
    this.top = 0;
  }

  componentDidMount() {
    document.title = '原图 - 内容管理系统 - VCG © 视觉中国';
    this.dragger = document.getElementById("dragger");
    document.getElementById("vcgApp").style.height = "100%";
    document.addEventListener("mousedown", this.mousedownHandle.bind(this));
    document.addEventListener("mouseup", this.mouseupHandle.bind(this));
    document.addEventListener("mousemove", this.mousemoveHandle.bind(this));
    document.addEventListener("dblclick", this.switchModal.bind(this));
  }

  mousedownHandle(e) {
    this.active = true;
    this.startX = e.pageX;
    this.startY = e.pageY;

    let backgroundPositionArr = this.dragger.style.backgroundPosition.match(/([-\d\.]*)px\s([-\d\.]*)px/);

    this.left = backgroundPositionArr && backgroundPositionArr[1] || 0;
    this.top = backgroundPositionArr && backgroundPositionArr[2] || 0;
  }

  mousemoveHandle(e) {
    if (this.active) {
      let bp_left = e.pageX - this.startX + parseInt(this.left),
        bp_top = e.pageY - this.startY + parseInt(this.top);
      this.setState({bp_left, bp_top});
    }
  }

  mouseupHandle(e) {
    this.active = false;
  }

  switchModal(e) {
    let draggerStyle = this.dragger.style;
    draggerStyle.backgroundPosition = "0 0 ";
    if (draggerStyle.backgroundSize === "" || draggerStyle.backgroundSize === "cover") {
      draggerStyle.backgroundSize = "auto";
    } else {
      draggerStyle.backgroundSize = "cover"
    }
  }

  render() {
    const {bp_left, bp_top, imageUrl, width, height} = this.state;
    return <div id="dragger" style={{
      backgroundImage: 'url(' + imageUrl + ')',
      "backgroundPosition": bp_left + "px " + bp_top + "px",
      width,
      height
    }}></div>
  }
}
