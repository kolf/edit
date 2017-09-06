import React, {Component, PropTypes} from "react";
import ReactDOM           from "react-dom";

import { Collapse } from "react-bootstrap/lib";

import Spin from "antd/lib/spin";
import Switch from "antd/lib/switch";
import Input from "antd/lib/input";
import Button from "antd/lib/button";
import Select from "antd/lib/select";
const Option = Select.Option;

export default class StepModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "alert": props.alert?props.alert:{
                "show": false,
                "isButton": true,
                "bsSize": "small",
                "onHide": this.closeAlert.bind(this),
                "title": null,
                "contentShow": "body",
                "body": null,
                "params": {},
                "submitAlert": null,
                "isLoading": false
            }
        };

        this.QualityRankStatus  = ["A","B","C","D","E"];
        this.RejectReasonStatus = ["图片质量有待提升","请勿重复上传","此类图片市场需求较小","缺乏文字说明，请与编辑部门联系","图片精度未达到要求","拍摄角度/场景单一", "请控制传图数量", "题材敏感", "版权问题", "部分图片已拆分发布，其余图片审核未通过","其他原因"];

        this.submitSetQualityRank = props.submitSetQualityRank;
        this.submitSetRejectReason = props.submitSetRejectReason;

    };

    render() {
        const { alert } = this.state;
        return (
            <Collapse in={alert.show}>
                <div className="dashed-container">
                    {alert.contentShow=="loading" && <div className="row text-center" style={{"height":"68px"}}><Spin /></div>}
                    {alert.contentShow=="qualityRank" &&  <div className="row" style={{"height":"68px"}}>
                        <div className="col-xs-12">
                            <b style={{"lineHeight":"26px"}}>{alert.title}：</b>
                            {this.QualityRankStatus.map((text,i)=>{
                                return <Button type="primary" className="ml-5" key={i} onClick={this.submitSetQualityRank.bind(this, { key: i, value: text }) }>{text}</Button>;
                            })}
                            {alert.params.submitMsg && <span className="orange ml-10">
                                <i className="ace-icon fa fa-hand-o-right"></i> {alert.params.submitMsg}
                            </span>}
                        </div>
                    </div>}
                    {alert.contentShow=="favorite" && <div className="row" style={{"height":"68px"}}>
                        <div className="col-xs-12" style={{"marginBottom":"8px"}}>
                            <b style={{"lineHeight":"26px"}}>{alert.title}：</b>
                            <Switch defaultChecked={alert.params.status} onChange={value => {
                                let {alert} = this.state;
                                alert.params.status = value;
                                this.setState({alert});
                            } } />
                        </div>
                        <div className="col-xs-2" style={{"paddingRight":"0"}}>
                            <div className="slideBox">
                                <div className={alert.params.status?"slideBox-inner":"slideBox-inner next"}>
                                    <div className="slideBox-context">
                                        <Select style={{ "width": "100%" }} placeholder="请选择已有收藏夹" onChange={value => {
                                                let {alert} = this.state;
                                                alert.params.submitMsg = "";
                                                alert.params.favId = value;
                                                this.setState({alert});
                                            } }>
                                            {alert.params.favoriteOption}
                                        </Select>
                                    </div>
                                    <div className="slideBox-context">
                                        <Input placeholder="请输入新的收藏夹名" onChange={e => {
                                            let {alert} = this.state;
                                            alert.params.submitMsg = "";
                                            alert.params.favName = e.target.value;
                                            this.setState({alert});
                                        } } />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-4" style={{"paddingLeft":"0"}}>
                            <Button key="primary" type="primary" className="ml-10 mr-10" loading={alert.isLoading} onClick={alert.submitAlert}>{alert.okText?alert.okText:"确定"}</Button>
                            <Button key="ghost" type="ghost" className="mr-10" onClick={alert.onHide}>{alert.cancelText?alert.cancelText:"取消"}</Button>
                            {alert.params.submitMsg && <span className="orange">
                                <i className="ace-icon fa fa-hand-o-right"></i> {alert.params.submitMsg}
                            </span>}
                        </div>
                    </div>}
                    {alert.contentShow=="imageRejectReason" && <div className="row" style={{"height":"68px"}}>
                        <div className="col-xs-1" style={{"lineHeight":"26px","paddingRight":0}}>
                            <b>{alert.title}：</b>
                        </div>
                        <div className="col-xs-11">
                            {this.RejectReasonStatus.map((text,i)=>{
                                return <Button type="primary" className="mr-10 mb-10 fl" key={i} onClick={this.submitSetRejectReason.bind(this, { key: i, value: text }) }>{text}</Button>;
                            })}
                            {alert.params.key==10 && <span>
                                <span className="mb-10 fl">
                                    <Input placeholder="请输入不通过其他原因" onChange={e => {
                                        let {alert} = this.state;
                                        alert.params.submitMsg = "";
                                        alert.params.imageRejectReason = e.target.value;
                                        this.setState({alert});
                                    } } />
                                </span>
                                <span className="mb-10 fl">
                                    <Button key="primary" type="primary" className="ml-10 mr-10" loading={alert.isLoading} onClick={alert.submitAlert}>{alert.okText?alert.okText:"确定"}</Button>
                                    <Button key="ghost" type="ghost" className="mr-10" onClick={alert.onHide}>{alert.cancelText?alert.cancelText:"取消"}</Button>
                                </span>
                            </span>}
                            <span className="mb-10 fl" style={{"lineHeight":"26px"}}>
                                {alert.params.submitMsg && <span className="orange">
                                    <i className="ace-icon fa fa-hand-o-right"></i> {alert.params.submitMsg}
                                </span>}
                            </span>
                        </div>
                    </div>}
                    {alert.contentShow=="creditLine" && <div className="row" style={{"height":"68px"}}>
                        <div className="col-xs-12" style={{"marginBottom":"8px"}}>
                            <b style={{"lineHeight":"26px"}}>{alert.title}：</b>
                        </div>
                        <div className="col-xs-2" style={{"paddingRight":"0"}}>
                            <Input placeholder="请输入署名" onChange={e => {
                                let {alert} = this.state;
                                alert.params.submitMsg = "";
                                alert.params.creditLine = e.target.value;
                                this.setState({alert});
                            } } />
                        </div>
                        <div className="col-xs-4" style={{"paddingLeft":"0"}}>
                            <Button key="primary" type="primary" className="ml-10 mr-10" loading={alert.isLoading} onClick={alert.submitAlert}>{alert.okText?alert.okText:"确定"}</Button>
                            <Button key="ghost" type="ghost" className="mr-10" onClick={alert.onHide}>{alert.cancelText?alert.cancelText:"取消"}</Button>
                            {alert.params.submitMsg && <span className="orange">
                                <i className="ace-icon fa fa-hand-o-right"></i> {alert.params.submitMsg}
                            </span>}
                        </div>
                    </div>}
                </div>
            </Collapse>
        );
    };
}
