import React, {Component, PropTypes} from "react";
import TagAreaPanel from "app/components/tag/tagArea";
import {Row, Col, TreeSelect, message, Form, Button, Input, Tree} from "antd";
import {
  findKeyword,
  addKeyword,
  modifyKeyword,
  getKeywordById,
  getAllCategory
} from "app/action_creators/edit_action_creator";
import {categoryQuery, productQuery} from "app/action_creators/common_action_creator";
import EditModal from "app/components/edit/editModal";
import {uniq, isElite, isEn} from "app/utils/utils";
import $ from 'app/utils/dom';
import classNames from 'classnames';

const FormItem = Form.Item;
const SHOW_ALL = TreeSelect.SHOW_ALL;
const TreeNode = Tree.TreeNode;

export default class Step2_1 extends Component {
  constructor(props) {
    super(props);
    const {operate, groupData, keywordsDic} = props;

    groupData.keywordsArr = groupData.keywordsArr || [];
    groupData.keywordsAuditArr = groupData.keywordsAuditArr || [];
    this.doubleHeight = this.doubleHeight.bind(this);

    this.state = {
      "operate": operate
        ? operate
        : "edit",
      groupData,
      keywordsDic,
      "oneCategoryDoc": {},
      "product": {
        "id": "",
        "name": ""
      },
      "treeData": [],
      "alert": {},
      "doing": "doing",
      "titleLength": 0,
      "captionLength": 0,
      categoryModalVal: []
    }
  };

  componentWillMount() {
    const {title, caption} = this.state.groupData;
    // load data group category
    if (this.state.operate == "edit")
    // this.queryCategory({"parentId": 0, "curKey": "[0]"});

    this.state.titleLength = this.getStrLength(title);
    this.state.captionLength = this.getStrLength(caption);

    this.getAllCategory()
  };

  componentDidUpdate(nextProps, nextState) {
    // const {groupData} = this.state;
    //
    // const $searchInput = $.get('.ant-select-search__field')[0];
    //
    // if($searchInput && $searchInput.value){
    //     $searchInput.value = ''
    // }

  }

  componentWillReceiveProps(nextProps) {
    const {groupData, keywordsDic} = this.state;
    const {title, categoryArr, keywordsArr, keywordsAuditArr, caption} = groupData;

    let flag = false;

    if ((!_.isEqual(_.keys(nextProps.keywordsDic), _.keys(keywordsDic)))) {
      this.setState({keywordsDic: nextProps.keywordsDic})
    }

    if (!_.isEqual(nextProps.groupData.keywordsArr, keywordsArr)) {
      groupData.keywordsArr = nextProps.groupData.keywordsArr;
      flag = true;
    }

    if (!nextProps.groupData.keywordsAuditArr || nextProps.groupData.keywordsAuditArr.length != keywordsAuditArr.length || uniq(nextProps.groupData.keywordsAuditArr, keywordsAuditArr, 'source', false).length != keywordsAuditArr.length) {
      groupData.keywordsAuditArr = nextProps.groupData.keywordsAuditArr;
      flag = true;
    }

    if (!nextProps.groupData.categoryArr || !_.isEqual(nextProps.groupData.categoryArr, categoryArr)) {
      groupData.categoryArr = nextProps.groupData.categoryArr;
      flag = true;
    }

    if (nextProps.groupData.title != title) {
      groupData.title = nextProps.groupData.title;
      flag = true;
    }

    if (nextProps.groupData.caption != caption) {
      groupData.caption = nextProps.groupData.caption;
      flag = true;
    }

    flag && this.setState({groupData})
  };

  openAlert(alert) {
    this.setState({alert, "doing": "openAlert"})
  };

  closeAlert() {
    this.setState({"doing": "closeAlert"});
  };

  // 子组件弹框代理 传参数表示打开 否则为关闭
  alertHandle(alert) {
    if (alert) {
      this.openAlert(alert);
    } else {
      this.closeAlert();
    }
  };

  /**
   * 双击展第二步组照说明的高度，然后双击再关闭
   * @param {evt} 事件对象
   * @returns {boolean}
   */

  doubleHeight(evt) {
    const target = evt.target;
    const textareaHeight = 100;
    const clientHeight = target.offsetHeight; //可视区域高度
    const scrollHeight = target.scrollHeight; //滚动内容高度
    clientHeight == textareaHeight ? target.style.height = `${scrollHeight}px` : target.style.height = `${textareaHeight}px`
  };

  filterTreeNode = (inputValue, treeNode) => {
    //console.log(inputValue, treeNode);
    const {value, title} = treeNode.props;
    return new RegExp(inputValue, 'i').test(value + title);
  };

  getAllCategory() {
    const {dispatch} = this.props;
    dispatch(getAllCategory()).then(res => {
      if (res.apiError) {
        message.error(res.apiError.errorMessage);
        return;
      }

      let result = [];
      if (isEn()) {
        result = res.apiResponse.filter(item => item.id == 220639)[0].children;
      } else {
        result = res.apiResponse.filter(item => item.id != 220639);
      }

      const loop = (data, level) => {
        return data.map((item, i) => {
          const key = level + '-' + i;
          return {
            label: item.name,
            value: item.id + '',
            key: item.code ? item.code.match(/\d+/g).join(',') : 0,
            // key,
            pid: item.pid || 0,
            // code: item.code.match(/\d+/g),
            children: item.children ? loop(item.children, key) : []
          }
        })
      };

      //console.log(result);

      this.state.oneCategoryDoc = result.reduce((result, cur) => {
        result[cur.id] = cur;
        return result;
      }, {});

      this.state.treeData = loop(result, '0');
    })
  };

  keywordToImages = () => {
    const {step2setList} = this.props
    const {groupData: {keywords, keywordsArr, keywordsAuditArr}} = this.state
    // console.log(keywords)
    // console.log(keywordsArr)
    step2setList({keywords, keywordsArr, keywordsAuditArr}, 'sync')
  }

  captionToImages = () => {
    const {step2setList} = this.props
    const {groupData: {caption}} = this.state
    step2setList({caption}, 'sync')
  }

  render() {
    const {addListTags} = this.props;
    const {getFieldDecorator} = this.props.form;
    const {operate, groupData, keywordsDic, treeData, doing, alert, titleLength, captionLength, oneCategoryDoc} = this.state;
    const {
      id,
      groupId,
      title,
      caption,
      category,
      categoryArr,
      keywords,
      keywordsArr,
      keywordsAuditArr,
      oneCategory
    } = groupData;

    const formItemLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 21
      }
    };

    // const hasOneCategory = uniq(Object.keys(oneCategoryDoc), categoryArr);
    const isOneCategory = oneCategoryDoc ? (id) => {
      return Object.keys(oneCategoryDoc).indexOf(id) != -1;
    } : false;

    const lang = isEn() ? 'enname' : 'cnname';

    const categoryProps = {
      treeData,
      filterTreeNode: this.filterTreeNode,
      labelInValue: true,
      value: (categoryArr && categoryArr.length > 0) ? (categoryArr.reduce((prev, cur) => {
        if (keywordsDic[cur] && (oneCategory ? isOneCategory(cur) != oneCategory : true) && isNaN(keywordsDic[cur][lang])) {

          const curObj = keywordsDic[cur];
          prev.push({'label': curObj[lang] + '(' + cur + ')', 'value': cur});
        }
        return prev;
      }, [])) : [],
      onChange: this.categoryChange.bind(this),
      autoExpandParent: false,
      treeCheckable: true,
      multiple: true,
      showCheckedStrategy: SHOW_ALL,
      treeCheckStrictly: true,
      searchPlaceholder: "请选择分类",
      disabled: operate == "view" || groupData.isElite,
      style: {
        width: "100%"
      },
      dropdownStyle: {
        maxHeight: 240,
        overflow: 'auto'
      }
    };

    const tagAreaConfigs = {
      dispatch: this.props.dispatch,
      type: 'edit',
      keywordsDic,
      value: keywordsAuditArr ? keywordsAuditArr.concat(keywordsArr).reduce((prev, cur) => {
        if (!cur) {
          return prev
        }

        if (_.isString(cur)) {
          const keyword = keywordsDic[cur];
          if (keyword) {
            let title = keyword[lang];
            if (!title) {
              title = isEn() ? 'cnname' : 'enname';
            }

            title = keyword.kind == 9 ? title += '(' + cur + ')' : title;

            prev.push({
              "key": `${title} (${cur})`,
              "label": <span data-kind={keyword.kind || 0} className="ant-select-selection__choice__content"
                             data-id={cur}>{title}</span>,
              "id": cur,
              title,
              "kind": keyword.kind,
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
            source: `${title}|${id}|${cur.type}|0`,
            type: cur.type
          })
        };

        return prev;
      }, []) : [],
      size: "large",
      className: "mb-0",
      tagContainerStyle: {height: '75px', maxHeight: '300px', padding: '2px 4px'},
      updateTags: this.updateTags.bind(this),
      alertHandle: this.alertHandle.bind(this),
      disabled: groupData.isElite
    };

    return (
      <div>
        <EditModal doing={doing} alert={alert} updateData={this.updateData.bind(this)}/>
        <Form horizontal form={this.props.form}>
          <Row gutter={24}>
            <Col span={19}>
              <FormItem {...formItemLayout} label="* 组照标题" className="mb-10">
                {getFieldDecorator('title', {
                  initialValue: title,
                  onChange: this.titleChange.bind(this),
                  rules: [{validator: this.checkTitle.bind(this)}]
                })(<Input disabled={operate == "view" || groupData.isElite} type="text" placeholder="请输入组照标题"
                          addonAfter={`${titleLength}/30`}/>)}
              </FormItem>
            </Col>
          </Row>

          {!(operate == "push") && <Row gutter={24}>
            <Col span={19}>
              <FormItem  {...formItemLayout} label="* 分类" className="mb-10 categorySelect"
                         style={{position: 'relative'}}>
                <TreeSelect {...categoryProps} _getPopupContainer={() => document.querySelector('.categorySelect')}/>
              </FormItem>
            </Col>
          </Row>}

          {!(operate == "push") && <Row gutter={24}>
            <Col span={19}>
              <FormItem hasFeedback {...formItemLayout} label="* 组照关键词" className="mb-10">
                <TagAreaPanel disabled={operate == "view"} {...tagAreaConfigs} />
              </FormItem>
            </Col>
            {operate != "view" && <Col sm={5} style={{"padding": "0"}}>
              <Button size="small" className="mr-10" onClick={this.readerTreeModal.bind(this)}>添加分类关键词</Button>
              <Button disabled={groupData.isElite} size="small" className="mr-10" onClick={addListTags}>添加图片关键词</Button>
              <Button size="small" className="mr-10 mt-5" onClick={this.keywordToImages}>同步到图片关键词</Button>
            </Col>}
          </Row>}

          <Row gutter={24}>
            <Col span={19}>
              {(() => {
                let label = isEn() ? '组照说明' : '* 组照说明';
                return <FormItem {...formItemLayout} label={label} autosize className="mb-0">
                  {getFieldDecorator('caption', {
                    initialValue: caption,
                    onChange: this.captionChange.bind(this),
                  })(<Input type="textarea" style={{height: 100}} className="unselectable"
                            onDoubleClick={this.doubleHeight} disabled={operate == "view" || groupData.isElite}
                            placeholder="请输入组照说明"
                            autoComplete="off"/>)}
                </FormItem>
              })()}
            </Col>
            <Col>
              <Button size="small" className="mr-10 mt-5" onClick={this.captionToImages}>组说替换图说</Button>
              <div style={{fontSize:'12px', color: '#939192', marginTop: '55px'}}>已输入字数{captionLength}</div>
            </Col>

          </Row>
        </Form>
      </div>
    );
  };

  checkTitle(rule, value, callback) {
    if (this.getStrLength(value) <= 30) {
      callback();
      return;
    }
    callback('组照标题最好控制在30个字以内哦!');
  }

  getStrLength(str) {
    str = str || '';
    var _zh = str ? str.match(/[^ -~]/g) : 0;
    return Math.ceil((str.length + (_zh && _zh.length) || 0) / 2);
  }

  getKeywordById(keywords) {
    const {dispatch} = this.props;
    let {keywordsDic} = this.state;

    dispatch(getKeywordById({'data': keywords})).then(result => {
      if (result.apiError) {
        this.messageAlert(result.apiError.errorMessage);
        return false;
      }
      ;

      result.apiResponse.forEach(item => {
        keywordsDic[item.id] = item
      })

      this.props.updateData({keywordsDic});
    });
  };

  readerTreeModal() {
    const {groupData, keywordsDic, treeData, categoryModalVal} = this.state;
    const lang = isEn() ? 'enname' : 'cnname';

    const categoryModalProps = {
      treeData,
      filterTreeNode: this.filterTreeNode,
      labelInValue: true,
      onChange: this.categoryTreeChange.bind(this),
      value: categoryModalVal,
      treeCheckable: true,
      multiple: true,
      showCheckedStrategy: SHOW_ALL,
      treeCheckStrictly: true,
      searchPlaceholder: "请选择分类关键词",
      style: {
        width: "100%"
      },
      dropdownStyle: {
        maxHeight: 240,
        overflow: 'auto'
      }
    };

    let selectArr = [];
    this.props.alertHandle({
      "title": "选择分类关键词",
      "body": <div style={{padding: 30, overflow: 'auto'}}><TreeSelect {...categoryModalProps} /></div>,
      "contentShow": "form",
      "isFooter": true,
      onOk: () => {
        const {categoryModalVal} = this.state;

        const ids = [];
        categoryModalVal.forEach(item => {
          const {label, value, pid} = item;

          keywordsDic[value] = {
            "id": value,
            "pid": pid,
            "kind": 9,
            [lang]: label
          };

          ids.push(value + '')
        });

        groupData.keywordsArr = groupData.keywordsArr.concat(ids);

        this.setState({groupData, keywordsDic});
        this.props.alertHandle();
        this.state.categoryModalVal = [];
      }
    })
  };

  categoryTreeChange(value, label, extra) {
    const lang = isEn() ? 'enname' : 'cnname';
    let {categoryModalVal, treeData} = this.state;
    let curVal = [];
    const val = value.map(item => item.value);

    const getChildsValue = (value, treeData) => {
      const obj = getValueObj(value, treeData);
      let result = [];

      const loop = (data) => {
        data.forEach(item => {
          result.push(item.value);
          item.children && loop(item.children);
        })
      }
      obj.children && loop(obj.children);
      return result;
    }

    const getParentsValue = (value, treeData) => {
      let result = [];
      const loop = data => {
        data.forEach(item => {

        })
      }

      loop(treeData);
      return result;
      // let result = {
      //     level : 0,
      //     parents : []
      // };
      // const loop = (data) => {
      //     data.forEach((item) => {
      //         if (curKey.indexOf(item.key) === 0) {
      //             result.level++;
      //             result.parents.push(item.value);
      //             item.children && loop(item.children);
      //         }
      //     });
      // };
      // loop(treeData);
      // return result;
    }

    const getValueObj = (value, treeData) => {
      let result = null;
      const loop = (data) => {
        data.forEach((item) => {
          if (item.value == value) {
            result = item;
          } else if (item.children && !result) {
            loop(item.children);
          }
        })
      };
      loop(treeData);
      return result;
    }

    if (extra.triggerNode) {
      const curKey = extra.triggerNode.props.eventKey.split(',');

      if (extra.checked) { //联级选中
        if (lang == 'enname') { // 一级
          curVal = val
        } else {
          curVal = _.uniq(val.concat(curKey));
        }
      } else { // 联级清除
        const childIds = getChildsValue(extra.triggerValue, treeData);
        _.remove(val, (n) => childIds.indexOf(n) != -1);
        curVal = val;
      }
    } else {
      const childIds = getChildsValue(extra.triggerValue, treeData);
      _.remove(val, (n) => childIds.indexOf(n) != -1);
      curVal = val;
    }

    this.state.categoryModalVal = curVal.map(val => {
      return getValueObj(val, treeData)
    });
    this.readerTreeModal()
  }

  categoryChange(value, label, extra) {
    const lang = isEn() ? 'enname' : 'cnname';
    let {groupData, keywordsDic, treeData, oneCategoryDoc} = this.state;
    let curVal = [];
    const val = value.map(item => item.value);
    const {triggerValue} = extra;

    const getChildsValue = (value, treeData) => {
      const obj = getValueObj(value, treeData);
      let result = [];

      const loop = (data) => {
        data.forEach(item => {
          result.push(item.value);
          item.children && loop(item.children);
        })
      }
      obj.children && loop(obj.children);
      return result;
    }

    const getValueObj = (value, treeData) => {
      let result = null;
      const loop = (data) => {
        data.forEach((item) => {
          if (item.value == value) {
            result = item;
          } else if (item.children && !result) {
            loop(item.children);
          }
        })
      };
      loop(treeData);
      return result;
    }

    const sortVal = (value) => {
      let result = [];
      const loop = (data) => {
        data.forEach(item => {
          if (value.indexOf(item.value) != -1) {
            result.push(item.value)
          }
          if (item.children) loop(item.children)
        })
      };

      loop(treeData);
      return result;
    }

    if (extra.triggerNode) {
      const curKey = extra.triggerNode.props.eventKey.split(',');

      if (extra.checked) { //联级选中
        if (curKey.length == 1 || lang == 'enname') { // 一级
          curVal = [triggerValue]
        } else {
          const oneCategory = treeData.find(item => val.indexOf(item.value) != -1);

          if (oneCategory && curKey.indexOf(oneCategory.value) == -1) {
            const childIds = getChildsValue(oneCategory.value, treeData);
            _.remove(val, (n) => {
              return childIds.indexOf(n) != -1 || n == oneCategory.value
            });
          }
          curVal = _.uniq(val.concat(curKey));
        }
      } else { // 联级清除
        const childIds = getChildsValue(extra.triggerValue, treeData);
        _.remove(val, (n) => childIds.indexOf(n) != -1);
        curVal = val;
      }
    } else {
      const childIds = getChildsValue(extra.triggerValue, treeData);
      _.remove(val, (n) => childIds.indexOf(n) != -1);
      curVal = val;
    }

    groupData.categoryArr = sortVal(curVal);

    curVal.forEach(item => { //更新词典
      const {value, pid, label} = getValueObj(item, treeData);
      keywordsDic[value] = {
        "id": value,
        "pid": pid,
        [lang]: label
      };

      if (oneCategoryDoc[value]) groupData.oneCategory = value; //设置主分类
    });

    this.setState({groupData, keywordsDic});
  };

  updateTags({keywordsArr, keywordsAuditArr, newDic}, tag) {
    const {groupData, keywordsDic} = this.state;
    if (keywordsArr) {
      groupData.keywordsArr = _.union(groupData.keywordsArr, keywordsArr);
    }
    if (keywordsAuditArr) {
      groupData.keywordsAuditArr = _.uniq(groupData.keywordsAuditArr.concat(keywordsAuditArr), 'source');
    }

    if (tag && _.isArray(tag)) {
      // _.remove(groupData.keywordsAuditArr, (v)=> {
      //     return tag.map(item => item.title).indexOf(v.label) != -1;
      // });

      groupData.keywordsAuditArr.forEach((v) => {
        if (tag.map(item => item.title).indexOf(v.label) != -1) {
          v.type = 1;
          v.source = updateTag(v.source, tag.curId);

          if (groupData.keywordsArr) {
            groupData.keywordsArr = groupData.keywordsArr.concat(tag.map(item => item.curId + ''))
          }
        }
      });

      _.remove(groupData.keywordsArr, (v) => {
        return tag.map(item => item.id).indexOf(v) != -1;
      });
    } else {
      if (tag && tag.type != undefined) {
        // _.remove(groupData.keywordsAuditArr, (v) => {
        //     return v.source == (tag.source || (tag.label + '|' + tag.id + '|' + tag.type));
        // });

        groupData.keywordsAuditArr.forEach((v) => {
          if (v.source === (tag.source || (tag.label + '|' + tag.id + '|' + tag.type + '|' + v.source.split('|')[3]))) {
            v.type = 1;
            v.source = updateTag(v.source, tag.curId);

            if (groupData.keywordsArr) {
              groupData.keywordsArr.push(tag.curId + '')
            }
          }
        });
      } else if (tag) {
        _.remove(groupData.keywordsArr, (v) => {
          return v == tag.id;
        });
      }
    }

    if (newDic) this.props.updateKeywordDic(newDic);

    this.alertHandle();
    this.setState({groupData});

    // if(this.props.updateData) this.props.updateData({groupData});

    function updateTag(source, id) {
      const arr = source.split('|');
      if (id) arr[1] = id + '';
      arr[2] = 1;
      return arr.join('|')
    }
  };

  titleChange(e) {
    const {groupData} = this.state;
    groupData.title = e.target.value;

    this.setState({
      groupData,
      titleLength: this.getStrLength(groupData.title)
    });
    if (this.props.updateData) this.props.updateData({groupData});
  };

  /**
   * 判断组照说明的文字数量，只提示不限制
   * @param e 事件对象
   */
  captionChange(e) {
    const {groupData} = this.state;
    console.log(groupData);
    groupData.caption = e.target.value;
    this.setState({
      groupData,
      captionLength: this.getStrLength(groupData.caption)
    });
    if (this.props.updateData) this.props.updateData({groupData});
  };

  updateData() {

  }
}
