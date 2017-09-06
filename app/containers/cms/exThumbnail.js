import React, {Component} from "react"
import ReactDOM           from "react-dom";
import {Link}             from "react-router";

import { Upload, message, Icon, Button, Select, Input } from 'antd';

import {
	Grid,
	Row,
	Col,
	Thumbnail
} from "react-bootstrap/lib";

const Option = Select.Option;

import {cmsAdUrl}        from "app/api/api_config"

const uploadURL = '/api/zh'+ cmsAdUrl + '/v1/upload';
const uploadPrefix = 'http://bj-feiyuantu.oss-cn-beijing.aliyuncs.com';
const uploadProps = {
    name: 'cmsPicFile',
    showUploadList: false,
    action: uploadURL,
    listType: 'picture',
    multiple:false
};

export class ExThumbnailBox extends Component {

    constructor (props) {
        super(props);
        this.state = {
            "searchParams": {}
        };
    };
    
    compareStatus() {
        const {list} = this.props;
        const status = this.props.getStatus();
        if(!_.isMatch(list,status)){
            this.props.renderself();
        }
    };
    
    componentWillReceiveProps(nextProps) {
        this.setState({searchParams : nextProps.searchParams});
    };
    
    getTpl() {
        let {addition, list, addPic, deletePic, sortAble, contentChange, updatePicInfo} = this.props;
        //console.log('----tongaliz',this.props);
        //console.log('----tongaliz222',this.state);
        addition = addition || [];
        let _this=this;
        let addIcon = '';
        if(addPic){
            addIcon = <Col xs={12} sm={4} md={3} lg={3} className="thumbnailBoxFocus hand" onClick={this.props.addPic}><i className="thumbnail fa fa-plus fa-5x center"></i></Col>
        }
        let isTip=false;
        if(this.props.tipMessage&&this.props.tipMessage.message&&this.props.tipMessage.message.length>0)
        {
            isTip=true;
        }

                        
        return(<div className="clearfix">
            {[...list].map((item, i)=>{
                let tipMessage="";
                if(isTip)
                {
                    if(_this.props.tipMessage.isSame)
                    {
                        tipMessage=<div key={i} style={{color:"red"}}><label style={{width:'100%'}}>{_this.props.tipMessage.message[0]}</label></div>
                    }
                    else
                    {
                        tipMessage=<div key={i} style={{color:"red"}}><label style={{width:'100%'}}>{_this.props.tipMessage.message[i]}</label></div>
                    }
                }
               
                const {id, src, alt, day, time, num, describe, sort, resourceType, resourceId} = item;



                const sequenceTag = <input disabled={!sortAble} className="ml-10" style={{width:"10%"}} value={sort || ''} onChange={this.inputChange.bind(this, i, 'sort')}/>;
                //console.log("resourceType===",resourceType)
                const classNameFocus = ()=>{
                    if(resourceType == 2 ){
                        return "thumbnailBox"
                    }else if(!resourceType){
                        return "thumbnailBoxFocus"
                    }
                }
                return (
                    <Col  xs={12} sm={4} md={3} lg={3} key={i} className={classNameFocus()}>
                        {updatePicInfo &&
                            <div>
                                <Select className="col-xs-4" value={resourceType} onSelect={contentChange.bind(this, i, 'resourceType')}>
                                    <Option value={1}>专题</Option>
                                    <Option value={2}>组照</Option>
                                    <Option value={3}>手动上传</Option>
                                </Select>
                                {resourceType != 3 && <Input placeholder="请输入id" value={resourceId} className="col-xs-4" onChange={this.inputChange.bind(this, i, 'resourceId')}/>}
                                {resourceType != 3 && <Button className="col-xs-4" onClick={updatePicInfo.bind(this, i)}>查询</Button>}
                            </div>
                        }
                        <Thumbnail bsClass={resourceType == 2?"thumbnail":"thumbnailFocus"} src={src && src[0] == '/' ? (src.indexOf('//goss')>=0?src:(uploadPrefix + src)) : src} alt={alt} data-key={i} >
                            <Row className="mt-10 mb-10">
                                {sequenceTag}
                                {deletePic && <Button className="fr" onClick={this.deletePic.bind(this, i)}>删除</Button>}
                                <Upload className="fr"  style={{marginLeft:"-30%"}} {...uploadProps} onSuccess onChange={this.onUploadFile.bind(this, i, 'src')}>
                                    <Button>
                                      <Icon type="upload"/> 点击上传
                                    </Button>
                                </Upload>
                            </Row>
                            {[...addition].map((cfg, j)=>{
                                const type = cfg.type;
                                const field = cfg.field;
                                const label = this.formatLabel(cfg.label);
                                const text = item[field];
                                let tag = '';

                                switch(type){
                                    case "recommend":
                                        tag = recommend ? <Button className="recommendBtn actived" key={j} onClick={this.cancelRecommend.bind(this, i)}>取消推荐</Button> : <Button className="recommendBtn" key={j} onClick={this.recommend.bind(this, i)}>推荐</Button>;
                                        break;
                                    case "input":
                                        tag = <div key={j}><label style={{width:'35%'}}>{label}</label><input value={text || ''} style={{width:"60%"}} onChange={this.inputChange.bind(this, i, field)}/></div>;
                                        break;
                                    case "tip":
                                        tag=<div key={j}><label style={{width:'100%'}}>{label}</label><span>{text}</span></div>;
                                    default:
                                        tag = <div key={j}><label style={{width:'35%'}}>{label}</label><span>{text}</span></div>;
                                        break;
                                }

                                return tag;
                            })}
                           {tipMessage}
                        </Thumbnail>
                    </Col>
                );
            })}{addIcon}
                </div>
        );
    };

    formatLabel (label) {
        if(!label){
            return;
        }
        const {type, value} = label;

        switch(type) {
            case "select":
                label = (<select>
                            {[...value].map((v, i)=>{
                                return <option key={i} value={v || ''}>{v}</option>
                            })}
                        </select>)
                break;
            default:
                break;
        }

        return label;
    }
    
    render () {
        const {list, types, addFun} = this.props;
        let tpl = this.getTpl();
        return (
            <div className="row">
                {!list &&
                    <i className="ace-icon fa fa-spinner fa-spin orange bigger-200"></i>
                }
                {list && tpl}
            </div>
        );
    };

    cancelRecommend (index) {
        this.props.recommend(index, false);
    }

    recommend (index) {
        this.props.recommend(index, true);
    }

    inputChange (index, field, e) {
        this.forceUpdate();
        this.props.contentChange(index, field, e.target.value);
    }

    onUploadFile(index, field, fileInfo){
       /*let img=new Image();
        img.src=fileInfo.file.name;
        img.onload = function() {
            //console.log("imgheight",img.height);
        }
        //console.log("file",fileInfo);*/
        if(fileInfo.file.response){
            this.props.contentChange(index, field, fileInfo.file.response.data.fileSrc);
            if(this.props.updatePicInfo){
                this.props.contentChange(index, 'resourceType', 3);
            }
        }
    }

    deletePic(index){
        this.props.deletePic(index);
    }
    alertMsg(msg){
       
        this.openAlert({
            "bsSize": "small",
            "title": <samll style={{"fontSize":"14px"}}>提示：</samll>,
            "body": <p className="bolder center grey"><i className="ace-icon fa fa-exclamation-triangle blue bigger-120">{msg}</i></p>,
            "isButton": false
        });
    };
}