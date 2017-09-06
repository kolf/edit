import React, {Component} from "react";
import {connect}          from "react-redux";

import CrumbsBox from "app/components/common/crumbs";
import ComboBox from "app/components/provider/combobox";
import {Uploadform} from "app/components/uploadform/form";

import Spin from 'antd/lib/spin';
import Upload from 'antd/lib/upload';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import QueueAnim from 'rc-queue-anim'; 
import Form from "antd/lib/form";

import {getProviderById, getProviderList, postProviderData} from "app/action_creators/provider_action_creator";

const createForm = Form.create;
const PhotoForm = createForm()(Uploadform);

const select = (state) => ({
    providerList: state.provider.providerList,
    providerdata: state.provider.providerdata
});
@connect(select)

export default class LoginContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                { "path": "/home", "text": "首页" },
                { "path": "/uploadphoto", "text": "资源上传" },
            ],
            "providerId": null,
            "photoList": [],
            "success": false
        };
        //console.log(PhotoForm);
        this.uploadprops = {
            name: 'file',
            action: '/api/provider/uploadpost',
            multiple: true,
            showUploadList: false,
            headers: {
                authorization: 'authorization-text',
            }
        }
        this.uploadprops.onChange = this.uploadOnChange.bind(this);
    };

    componentWillMount() {
        
    };

    uploadOnChange(info) {
        if (info.file.status !== 'uploading') {
            //console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            const {response} = info.file;
            const param = {
                src: response.data.url,
                id: response.data.id
            };
            var tmp = this.state.photoList;
            tmp.push(param);
            this.setState({photoList:tmp});
            message.success(`${info.file.name} 上传成功。`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败。`);
        }
    };

    render() {
        const {crumbs, providerId, photoList} = this.state;
        const {providerList, providerdata} = this.props;
        
        return (
            <div className="main-content-inner">
                <CrumbsBox crumbs={crumbs} />
                <div className="page-content pl-40">
                    <h2 className="mb-40 mt-50">请输入供稿人名称或ID</h2>
                    <ComboBox
                        type="provider"
                        placeholder="请输入名称或ID"
                        dispatch = {this.props.dispatch}
                        dispatchAct={getProviderList}
                        handOnSelect={(value, option) => { this.findprovider({ value, option }) } }
                        >
                    </ComboBox>
                    {providerdata && providerId &&
                        <Upload {...this.uploadprops} className="ml-20">
                            <Button type="ghost">
                                <Icon type="upload" /> 点击上传
                            </Button>
                        </Upload>
                    }
                    {providerdata && providerId &&
                        <div>
                            <div className="textblock"><span>姓名：</span>{providerdata.name}</div>
                            <div className="textblock"><span>ID：</span>{providerdata.id}</div>
                            <div className="textblock"><span>类型：</span>{providerdata.type}</div>
                        </div>
                    }
                    {photoList.length>0 && <PhotoForm List={this.state.photoList} submit={this.handOnSbmit.bind(this)}/>}
                </div>
            </div>
        );
    };

    findprovider({value, option}) {
        const {id} = option.props
        const {dispatch} = this.props;
        this.setState({photoList:[]})
        // //console.log(value, option);
        dispatch(getProviderById({ id })).then(result => {
            if (result.apiError) return false;
            this.state.providerId = id;
        })
    };

    handOnSbmit(form) {
        const {dispatch} = this.props;

        dispatch(postProviderData(form)).then(result => {
            if (result.apiError) return false;
        })
    }
}




