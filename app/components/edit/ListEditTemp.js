import React, {Component, PropTypes} from "react";
import {Row, Col, DatePicker, Cascader, Form, Button, Input, Checkbox, message, Progress} from "antd";
import moment from "moment";
import classNames from 'classnames';
import TagAreaPanel from "app/components/tag/tagArea";
import EditModal from "app/components/edit/editModal";
import {
  findKeyword,
  addKeyword,
  modifyKeyword,
  getKeywordById,
  findDiscTag
} from "app/action_creators/edit_action_creator";
import {isEn} from "app/utils/utils";

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const ButtonGroup = Button.Group;

export default class ListEditTemp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: {},
      doing: '',
      "groupData": {
        "dateCameraShot": null,
        "region": [],
        "keywordsArr": [],
        "keywordsAuditArr": []
      },
      "curCaption": ['caption'],
      "captionText": '',
      "keywordsText": '',
      "countDown": 0,
      'showProgress': false
    };
  };
  
  componentWillReceiveProps(nextProps) {
    // this.state.keywordsDic = nextProps.keywordsDic;
    // this.state.listSelectData = nextProps.listSelectData;
    // this.state.listData = nextProps.listData;
  };
  
  openAlert(alert) {
    this.setState({alert, "doing": "openAlert"})
  };
  
  closeAlert() {
    this.setState({"doing": "closeAlert"});
  };
  
  render() {
    const {getFieldDecorator} = this.props.form;
    const {groupData, curCaption, captionText, doing, alert, countDown, showProgress} = this.state;
    const {dateCameraShot, region, keywordsArr, keywordsAuditArr} = groupData;
    
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21}
    };
    
    const lang = isEn() ? 'enname' : 'cnname';
    
    const tagAreaConfigs = {
      dispatch: this.props.dispatch,
      type: 'edit',
      keywordsDic: this.props.keywordsDic,
      value: keywordsAuditArr.concat(keywordsArr).reduce((prev, cur) => {
        if (_.isString(cur)) {
          const keyword = keywordsDic[cur];
          if (keyword) {
            const title = keyword[lang];
            prev.push({
              "key": `${title} (${cur})`,
              "label": <span className="ant-select-selection__choice__content" data-id={cur}>{title}</span>,
              "id": cur,
              title,
              "kind": keyword.kind
            })
          }
        } else if (cur.type == 0 || cur.type == 2) {
          const arr = cur.source.split('|');
          const title = arr[0];
          let id = '';
          if (cur.type == 2) {
            id = arr[1];
          }
          const class1 = classNames('hand ant-select-selection__choice__content label', {
            'label-danger': cur.type == 0,
            'label-success': cur.type == 2
          });
          prev.push({
            id,
            "key": `${title} (${id})`,
            "label": <span className={class1} data-id={id} data-type={cur.type}>{title}</span>,
            title,
            source: `${title}|${id}|${cur.type}`,
            type: cur.type
          })
        }
        return prev;
      }, []),
      size: "large",
      className: "mb-0",
      tagContainerStyle: {height: '75px', maxHeight: '300px', padding: '2px 4px'},
      alertHandle: this.props.alertHandle
    };
    
    let {listSelectData, listData} = this.props;
    const list = listSelectData.list.length ? listSelectData.list : listData;
    
    const percent = Math.round(((list.length - countDown) / list.length) * 10000) / 100;
    //console.log('countDown',countDown);
    //console.log('percent',percent);
    
    return (
      <div>
        <Form horizontal form={this.props.form}>
          <Row gutter={24}>
            <Col span={10}>
              <FormItem className="mb-10"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        label="拍摄时间">
                <DatePicker
                  placeholder="请选择拍摄时间"
                  value={dateCameraShot ? moment(dateCameraShot, 'YYYY-MM-DD') : ""}
                  onChange={(date, value) => {
                    this.handleOnChange({operate: "dateCameraShot", value, date, position: "sync"})
                  } }/>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                className="mb-10"
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                label="拍摄地点">
                <Cascader
                  loadData={(this.regionLoadData.bind(this))}
                  changeOnSelect
                  expandTrigger="hover"
                  value={region}
                  options={this.props.regionOptions}
                  placeholder="请输入拍摄地点"
                  onChange={(value, selectedOptions) => {
                    this.handleOnChange({operate: "region", value, selectedOptions, position: "sync"})
                  } }/>
              </FormItem>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={19}>
              <FormItem
                className="mb-10"
                {...formItemLayout}
                label="关键词">
                <Input type="textarea" style={{height: 80}} placeholder="请输入关键词用逗号分隔" autoComplete="off" rows="2"
                       onChange={e => {
                         const keywordsText = e.target.value;
                         this.setState({keywordsText});
                       }}/>
              </FormItem>
            </Col>
            <Col sm={5} style={{"padding": "0"}}>
              <ButtonGroup size="small">
                {['覆盖', '追加'].map((item, i) => <Button
                  onClick={e => this.props.setKeywords(this.state.keywordsText, i)}>{item}</Button>)}
              </ButtonGroup>
              <div className="mt-5">
                <Button size="small" onClick={this.props.clearListPeopleTag}>清空人物关键词</Button>
              </div>
              <div className="mt-5">
                {showProgress && <div style={{width: '146px'}}><Progress percent={percent}/></div>}
                {!showProgress && <Button size="small" onClick={this.setListPeopleTag.bind(this)}>抓取图说人物关键词</Button>}
              </div>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col sm={19}>
              <FormItem
                className="mb-10"
                {...formItemLayout}
                label="图说">
                <Input type="textarea" style={{height: 80}} value={captionText} onChange={e => {
                  const captionText = e.target.value;
                  this.setState({captionText});
                }} placeholder="请输入图说" autoComplete="off" rows="2"/>
              </FormItem>
            </Col>
            <Col sm={5} style={{"padding": "0"}}>
              <CheckboxGroup value={curCaption} onChange={val => {
                this.setState({curCaption: val})
              }} options={[{label: '新加图说', value: 'caption'}, {label: '原始图说', value: 'providerCaption'}]}/>
              <div className="mt-5">
                <ButtonGroup size="small">
                  <Button onClick={this.setListCaption.bind(this, 'sync')}>覆盖</Button>
                  <Button onClick={this.setListCaption.bind(this, 'before')}>前追加</Button>
                  <Button onClick={this.setListCaption.bind(this, 'after')}>后追加</Button>
                </ButtonGroup>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  
  
  setListCaption(position) {
    const {curCaption, captionText} = this.state;
    
    if (curCaption.length) {
      curCaption.forEach(key => {
        const value = captionText;
        this.props.step2setList({
          [key]: value
        }, position)
      })
    }
  };
  
  setListPeopleTag() {
    let {dispatch, updateData, updateKeywordDic, listSelectData, listData} = this.props;
    //listData.listLoading = '抓取人物关键词中...';
    updateData({maskLoading: true});
    const list = listSelectData.list.length ? listSelectData.list : listData;
    this.setState({countDown: list.length, showProgress: true});
    
    const params = list.map(item => ({
      caption: item.caption + ',' + item.providerCaption,
      resImageId: item.id
    }));
    
    const timer = setTimeout(() => {
      let {countDown} = this.state;
      countDown--;
      this.setState({countDown});
    }, 900)
    
    dispatch(findDiscTag(params)).then(res => {
      if (res.apiError) {
        this.setState({countDown: 0, showProgress: false});
        message.error('抓取人物关键词失败');
        return false;
      }
      ;
      
      let resObj = res.apiResponse[0].reduce((result, cur) => {
        Object.assign(result, cur);
        return result;
      }, {});
      
      list.forEach(item => {
        const tagObj = resObj[item.id];
        if (tagObj) {
          let keywordsArr = [], keywordsAuditArr = [];
          
          Object.keys(tagObj).forEach(key => {
            let tag = tagObj[key];
            if (tag.length == 1) { // 已确定的关键词
              updateKeywordDic(tag[0]);
              keywordsArr.push(tag[0].id + '')
            } else if (tag.length > 1) { // 多义词
              let ids = tag.map(t => {
                updateKeywordDic(t);
                return t.id;
              }).join('::');
              
              keywordsAuditArr.push({
                label: key,
                id: ids,
                type: 2,
                kind: 0,
                source: key + '|' + ids + '|2|0'
              })
            }
          });
          
          item.keywordsArr = item.keywordsArr.concat(keywordsArr);
          item.keywordsAuditArr = item.keywordsAuditArr.concat(keywordsAuditArr);
        }
      });
      
      setTimeout(() => {
        clearTimeout(timer);
        message.success('抓取图说人物关键词成功！');
        this.setState({countDown: 0, showProgress: false});
        updateData({listData, listSelectData, update: true, maskLoading: false});
      }, 30)
    })
  };
  
  setKeywords(position) { // key value position
    const {groupData: {keywordsArr, keywordsAuditArr}} = this.state;
    this.props.step2setList({keywordsArr, keywordsAuditArr}, position);
  };
  
  setRegion({operate, key, value, selectedOptions}) {
    const regionArr = ["country", "province", "city"];
    const lang = isEn() ? 'enname' : 'cnname';
    
    let {keywordsDic} = this.props;
    
    regionArr.forEach((region, i) => {
      const item = selectedOptions[i];
      this.setFieldValue({operate: regionArr[i], key, value: item ? item.label : ''});
      if (item) {
        keywordsDic[item.code] = {
          "id": item.code,
          [lang]: item.label
        };
      }
    });
    
    this.setFieldValue({operate, key, value});
    // this.setState({keywordsDic,"doing":"setRegion"});
    
    if (this.props.updateData) this.props.updateData({keywordsDic, "doing": "setRegion", operate, key, value});
  };
  
  regionLoadData(selectedOptions) {
    const curKey = selectedOptions.length - 1;
    const curOption = selectedOptions[curKey];
    this.props.queryRegion({"parentId": curOption.code || curOption.value, "curKey": curOption.key}, selectedOptions);
  }
  
  setFieldValue({operate, value}) {
    const {groupData} = this.state;
    groupData[operate] = value;
    this.setState({groupData});
    // if (this.props.setSelectedList) this.props.setSelectedList({key: operate, value, "position": "sync", type: 'editStepTwo'});
    this.props.step2setList({
      [operate]: value,
      showRegionInput: true
    }, 'sync');
  };
  
  handleOnChange({operate, value, date, selectedOptions}) {
    //console.log(operate, value, date, selectedOptions);
    
    switch (operate) {
      case "dateCameraShot":
        this.setFieldValue({operate, value});
        break;
      case "region":
        this.setRegion({operate, value, selectedOptions});
        break;
    }
  };
  
}
