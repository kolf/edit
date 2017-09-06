import React, {Component, PropTypes}    from "react";
import {connect}                        from "react-redux";
import ReactDOM                         from "react-dom";
import classNames from 'classnames';

import {
    Row,
    Col
} from "react-bootstrap/lib";

import Form from "antd/lib/form";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
import QueueAnim from 'rc-queue-anim';
import Radio from "antd/lib/radio";
import {message} from "antd";

import Card from 'antd/lib/card';
import TreeSelect from 'antd/lib/tree-select';
import filterData from "app/components/searchBox/filterData";
import TagAreaPanel from "app/components/tag/tagArea";
import {findKeyword} from "app/action_creators/edit_action_creator";
import EditModal from "app/components/edit/editModal";

const FormItem = Form.Item;
const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const SHOW_ALL = TreeSelect.SHOW_ALL;
const SHOW_CHILD  = TreeSelect.SHOW_CHILD;
const RadioGroup = Radio.Group;

import {
    Tooltip,
    OverlayTrigger
} from "react-bootstrap/lib";

export let Uploadform = React.createClass({
    getInitialState: function () {
        return {
            "title": "",
            "category": "",
            "keywords": "",
            "graphical_style": 1,
            "editor_provider_id": this.props.editorProviderId,
            "photoList": this.props.photoList || [],
            "categoryParams": {
                "paramType": 1,
                "param": {
                    "assetFamily": this.props.assetFamily || '1',
                    "graphicalType": 1,
                    "resGroup": 1
                }
            },
            "graphicalTypeOptions": [],
            "keywordsDic":{},
            "tagsData": {
                "keywordsArr":[],
                "keywordsAuditArr":[]
            },
            "alert": {},
            "doing": this.props.doing,
        };
    },

    componentWillMount() {
        const {assetFamily} = this.props;
        let id = '';
        if(assetFamily == 1){
            id = 26;
        }else if(assetFamily == 2){
            id = 18
        };
        this.state.graphicalTypeOptions = filterData.get(id).options
    },

    componentDidMount() {
        //console.log(this.props, "will");
    },

    componentWillReceiveProps(nextProps) {
        const {photoList} = this.state;

        if(photoList.length!= nextProps.photoList.length){
            this.setState({
                photoList: nextProps.photoList
            })
        }
    },

    handleReset(e) {
        e.preventDefault();
        this.props.form.resetFields();
    },

    openAlert(alert) {
        this.setState({alert, "doing": "openAlert"})
    },

    closeAlert() {
        this.setState({"doing": "closeAlert"});
    },

    // 子组件弹框代理 传参数表示打开 否则为关闭
    alertHandle(alert){
        if(alert){
            this.openAlert(alert);
        }else{
            this.closeAlert();
        }
    },

    handleSubmit(op) {
        //e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                return;
            };

            const {editor_provider_id, photoList, tagsData} = this.state;
            const {assetFamily} = this.props;

            if(tagsData.keywordsArr.length==0 && assetFamily==2){
                message.error('请输入关键词！');
                return false;
            }

            const pics = photoList.map(item => {
                return {
                    "graphical_style": values.graphical_style,
                    "keywords": values.category,
                    "category": values.category,
                    "url": item.url,
                    assetFamily,
                }
            });

            //console.log(tagsData, assetFamily);

            values.keywords = values.category;

            Object.assign(values, {
                assetFamily,
                keywords: values.category,
                editor_provider_id,
                pics
            })

            this.props.submit(values,op);
        });
    },

    toolsBtnFn(type){
        let {photoList} = this.state;

        if(type === 'remove'){
            const ids = photoList.filter(item => item.selected).map(item => item.url);
            this.props.delPic(ids);
        }else if(type === 'removeAll'){
            const ids = photoList.map(item => item.url);
            this.props.delPic(ids);
        }else if(type === 'selectAll'){
            photoList.forEach(item => {
                item.selected = true;
            });

            this.setState({
                photoList
            })
        };
    },

    handleReset(e) {
        e.preventDefault();
        this.setState({ "category": "","graphical_style": 1 });
        this.props.form.resetFields();
    },

    render() {
        const {getFieldDecorator, setFieldsValue} = this.props.form;
        const {categoryTag, assetFamily} = this.props;
        const {title,category,keywords,graphical_style,editor_provider_id, photoList, graphicalTypeOptions, tagsData: {keywordsAuditArr, keywordsArr}, keywordsDic, doing, alert} = this.state;

        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 }
        };

        const keywordsProps = {
            dispatch: this.props.dispatch,
            type: 'edit',
            keywordsDic,
            value : keywordsAuditArr ? keywordsAuditArr.concat(keywordsArr).reduce((prev, cur) => {
                if (_.isString(cur)) {
                    const keyword = keywordsDic[cur];
                    if (keyword) {
                        const title = keyword.cnname;
                        prev.push({
                            "key": `${title} (${cur})`,
                            "label": <span className="ant-select-selection__choice__content" data-id={cur}>{title}</span>,
                            "id": cur,
                            title,
                            "kind": keyword.kind,
                        })
                    }
                } else if(cur.type == 0 || cur.type == 2){
                    const arr = cur.source.split('|');
                    const title = arr[0];
                    let id ='';
                    if(cur.type == 2){
                        id = arr[1];
                    }
                    const class1 = classNames('hand ant-select-selection__choice__content label', {'label-danger': cur.type == 0, 'label-success': cur.type == 2});
                    prev.push({
                        id,
                        "key": `${title} (${id})`,
                        "label": <span className={class1}  data-id={id} data-type={cur.type}>{title}</span>,
                        title,
                        source: `${title}|${id}|${cur.type}`,
                        type: cur.type
                    })
                };
                return prev;
            }, []): [],
            size: "large",
            className: "mb-0",
            updateTags: this.updateTags.bind(this),
            alertHandle: this.alertHandle.bind(this)
        }

        return (
            <div>
                <EditModal doing={doing} alert={alert}/>
                <div style={{paddingBottom: 15}}>
                    <Button className="mr-10" onClick={this.toolsBtnFn.bind(this, 'selectAll')}>全选</Button>
                    <Button className="mr-10" onClick={this.toolsBtnFn.bind(this, 'remove')}>删除</Button>
                    <Button onClick={this.toolsBtnFn.bind(this, 'removeAll')}>全部删除</Button>
                  </div>
                <div className="row">{[...photoList].map((item, i) => {
                        let class1 = classNames('editCard', {'active': item.selected});
                        return (<Col xs={6} sm={4} md={3} lg={2} key={i} className="edit">
                            <Card className={class1} onClick={() => {
                                item.selected = !item.selected;
                                this.setState({photoList})
                            }}>
                                <div className="custom-image">
                                    <img alt="找不到图片" src={item.url} />
                                    <div className="operate-card">
                                        <OverlayTrigger
                                            key={i}
                                            overlay={<Tooltip id={"j_operate_"+i}>删除</Tooltip>}
                                            placement="top"
                                            delayShow={150}
                                            delayHide={50}>
                                            <i className="fa fa-trash-o" data-key={i} onClick={(e) => {
                                                e.preventDefault();
                                                this.props.delPic([item.url])
                                            }}></i>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </Card>
                        </Col>)
                    })}
                </div>
                <Form style={{ padding: "20px", border: "1px dashed #ddd", marginTop: "30px", marginBottom: "30px" }}>
                    <FormItem {...formItemLayout} label="内容类型">
                        {getFieldDecorator('graphical_style', {
                            initialValue: 1,
                            rules: [
                                { type: 'number', required: true, message: '请选择内容类型' }
                            ],
                            onChange: (e) => {
                              let {categoryParams} = this.state;
                              const value = e.target.value;
                              setFieldsValue({
                                  category: '',
                                  graphical_style: value
                              });

                              //console.log(value);
                            //   graphical_style = e.target.value;
                            //   this.setState({graphical_style, category: ""});
                              categoryParams.param.graphicalType = value;
                              this.props.queryCategory(categoryParams);
                            }
                        })(
                          <RadioGroup>
                              {graphicalTypeOptions.map(item => <Radio value={item.id}>{item.text}</Radio>)}
                          </RadioGroup>
                        )}
                    </FormItem>

                    {assetFamily==1 && <FormItem {...formItemLayout} label="内容分类">
                        {getFieldDecorator('category', {
                            rules: [
                                { required: true, message: '请选择分类' }
                            ],
                            onChange: this.categoryChange
                        })(
                          <Select placeholder="请选择分类" style={{ "width": "100%" }}>
                              {categoryTag && [...categoryTag].map(d => { return (<Option key={d.id} id={d.id}>{d.name}</Option>) })}
                          </Select>
                      )}
                  </FormItem>}

                    <FormItem {...formItemLayout} label="组照标题">
                        {getFieldDecorator('title', {
                            rules: [
                                { required: true, message: '请输入组照标题' }
                            ],
                            onChange: (e)=> {
                                //console.log(e)
                            }
                        })(
                          <Input placeholder="请输入组照标题" type="text"/>
                        )}
                    </FormItem>

                    {assetFamily==2 && <FormItem {...formItemLayout} label="* 关键词">
                        <TagAreaPanel {...keywordsProps} tagContainerStyle={{height: 120, "fontSize": 12}} />
                    </FormItem>}

                    <FormItem wrapperCol={{ span: 12, offset: 3 }} >
                        {assetFamily==1 && <Button type="primary mr-10" onClick={this.handleSubmit.bind(this,"edit")}>进入编审</Button>}
                        <Button type="primary mr-10" onClick={this.handleSubmit.bind(this,"save")}>提交</Button>
                        <Button type="ghost" onClick={this.handleReset.bind(this)}>重置</Button>
                    </FormItem>
                </Form>
            </div>
        );
    },

    categoryChange (value) {
        // this.setState({ "category": value, "keywords": value });
        this.props.form.setFieldsValue({
          category: value,
        });

        this.setState({keywords: value})
    },

    updateTags({keywordsArr,keywordsAuditArr,newDic}, tag) {

        const {tagsData, keywordsDic} = this.state;
        if (keywordsArr) {
            tagsData.keywordsArr = _.union(tagsData.keywordsArr, keywordsArr);
        }
        if (keywordsAuditArr) {
            tagsData.keywordsAuditArr = _.uniq(tagsData.keywordsAuditArr.concat(keywordsAuditArr), 'source');
        }
        if (tag && tag.type != undefined) {
            // _.remove(tagsData.keywordsAuditArr, (v) => {
            //     return v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type));
            // });

            tagsData.keywordsAuditArr.forEach((v)=> {
                if(v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type + '|' + v.source.split('|')[3]))){
                    v.type = 1;
                    v.source = updateTag(v.source, tag.curId)
                }
            });
        } else if (tag) {
            _.remove(tagsData.keywordsArr, (v) => {
                return v == tag.id;
            });
        }
        if (newDic) {
            this.updateKeywordDic(newDic);
        };

        this.alertHandle();
        this.setState({tagsData});

        function updateTag(source, id){
            const arr = source.split('|');
            if(id) arr[1] = id+'';
            arr[2]=1;
            return arr.join('|')
        }
    },

    // 更新关键词字典
    updateKeywordDic(data) {
        if (Object.prototype.toString.call(data) == '[object Array]') {
            data.map((item)=> {
                this.state.keywordsDic[item.id] = item;
            })
        } else {
            this.state.keywordsDic[data.id] = data;
        }
        this.forceUpdate();
    },

});
