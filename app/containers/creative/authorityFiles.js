/*
 *肖像权、物权文件列表与图片界面
 */

import React, {Component} from "react";
import {connect} from "react-redux";
import {Table} from "antd";
import {authFileSearch, authFilePass} from "app/action_creators/create_action_creator";
const select = (state) => ({
  // fileListData: state.create.authFiles
});
@connect(select)

export default class AuthorityFilesPanel extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      columns: [
        {
          title: '序号',
          dataIndex: 'index',
          key: 'index'
        },
        {
          title: this.props.type == 1 ? '肖像权文件名' : '物权文件名',
          dataIndex: 'name',
          key: 'name'
        }/*,
         {
         title: '操作',
         dataIndex: 'status',
         key: 'status',
         render: (text, record)=>{
         return text == '2' ? '已确认' : <Button onClick={this.confirmAuthFile.bind(this, record)}>确认</Button>;
         }
         }*/],
      loading: false,
      selectedRowKeys: [0],
      zoomRatio: 100,
      type: this.props.type /*肖像权/物权*/
    }
  };
  
  componentDidMount() {
    this.getFileList();
  };
  
  render() {
    const {columns, loading, selectedRowKeys, zoomRatio, type, fileListData} = this.state,
      rowSelection = {type: 'radio', selectedRowKeys};
    
    //console.log(fileListData);
    
    let listData = fileListData ? fileListData.filter((item, index) => {
      item.index = index;
      return item.type == type;
    }) : [];
    
    let selectedFileSrc = listData[selectedRowKeys[0]] && listData[selectedRowKeys[0]].url;
    
    return <div>
      <Table columns={columns} loading={loading} dataSource={listData} rowSelection={rowSelection}
             pagination={false}
             onRowClick={this.onClickTableRow.bind(this)}/>
      {/*<div className="col-xs-2">小图</div>
       <div className="col-xs-8"><Slider min={0} max={100} value={zoomRatio} onChange={(v)=>{this.setState({zoomRatio:v})}}/></div>
       <div className="col-xs-2">大图</div>*/}
      
      {selectedFileSrc && <div className="row">
        <div className="center" style={{fontSize: '2em'}}><a href={selectedFileSrc} target="_blank">查看原图</a>
        </div>
        {/\.pdf$/.test(selectedFileSrc) ?
          <iframe style={{width: (zoomRatio + '%')}} src={selectedFileSrc}></iframe>
          :
          <div className="col-xs-12 center"><img src={selectedFileSrc} style={{width: (zoomRatio + '%')}}/></div>
        }
      </div>}
    </div>;
  };
  
  confirmAuthFile(record) {
    const {dispatch, id} = this.props;
    
    this.setState({loading: true});
    dispatch(authFilePass({
      release: [{
        ossId: record.ossId,
        resId: id
      }]
    })).then((result) => {
      this.setState({loading: false});
      this.getFileList();
    });
  };
  
  getFileList() {
    const {dispatch, id, onChangeRelatedFile} = this.props, selectedRowKey = this.state.selectedRowKeys[0];
    this.setState({loading: true});
    dispatch(authFileSearch({id})).then((result) => {
      this.setState({loading: false});
      const data = result.apiResponse.data;
      
      this.setState({fileListData: result.apiResponse.data});
    });
  }
  
  onClickTableRow(record, index) {
    this.setState({selectedRowKeys: [index]});
    this.props.onChangeRelatedFile(record.ossId);
  }
}
