/*
 *肖像权/物权文件关联图片界面
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import ThumbnailBox from "app/components/provider/thumbnail";
import {Card, Button} from "antd";
import {authFileRelatedPicSearch, authFilePass} from "app/action_creators/create_action_creator";

const select = (state) => ({
  picListData: state.create.authFileRelatedPics
});
@connect(select)

export default class authFileRelatedPicsPanel extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      'loading': false,
      'zoomRatio': 0,
      'selectStatus': [],
      'maskLoading': true     // loading
    }
  };
  
  componentDidMount() {
    this.getRelatedPics(this.props.authFile);
  };
  
  componentWillReceiveProps(props) {
    if (props.authFile != this.authFile) {
      this.getRelatedPics(props.authFile);
    }
  };
  
  render() {
    const {picListData} = this.props, {zoomRatio, selectStatus, maskLoading} = this.state;
    return <Card title="当前文件关联图片">
      <div className="col-xs-12">
        <div className="col-xs-10"></div>
        {/*<div className="col-xs-1">小图</div>
         <div className="col-xs-8"><Slider min={0} max={100} value={zoomRatio} onChange={(v)=>{this.setState({zoomRatio:v})}}/></div>
         <div className="col-xs-1">大图</div>*/}
        <Button className="col-xs-2" onClick={this.handleOnConfirmPic.bind(this, null)}>批量确认</Button>
      </div>
      <ThumbnailBox lists={picListData} types="photos" maskLoading={maskLoading}
                    selectStatus={selectStatus}
                    setSelectStatus={this.setSelectStatus.bind(this)}
                    render={this.renderThumbnailOperation.bind(this)}
                    onThumbnail={this.handleOnThumbnail.bind(this)}/>
    </Card>;
  };
  
  getRelatedPics(authFile) {
    const {dispatch} = this.props;
    
    if (!authFile) {
      return;
    }
    
    this.authFile = authFile;
    dispatch(authFileRelatedPicSearch({ossId: authFile})).then((result) => {
      this.setState({maskLoading: false});
    });
  };
  
  renderThumbnailOperation({resId, resImageId, status}) {
    return <div><span>图片ID：{resImageId}</span>{status == '2' ? <p clasName="pull-right">已确认</p> :
      <Button onClick={this.handleOnConfirmPic.bind(this, resId)}>确认</Button>}</div>;
  };
  
  handleOnThumbnail() {
  
  };
  
  handleOnConfirmPic(id) {
    const {dispatch, authFile, picListData} = this.props;
    let release = [];
    
    if (id) {
      release.push({
        ossId: authFile,
        resId: id
      });
    } else {
      picListData.map((item) => {
        if (item.status != '2') {
          release.push({
            ossId: authFile,
            resId: item.resId
          });
        }
      })
    }
    
    dispatch(authFilePass({release})).then((result) => {
      this.setState({maskLoading: false});
    });
  };
  
  setSelectStatus(params) {
    this.setState({selectStatus: params});
  };
}
