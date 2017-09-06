import React, {Component} from 'react';
// import Dialog from 'rc-dialog';
import {Button, Modal} from "antd";

import addEventListener from 'rc-util/lib/Dom/addEventListener';

import './style.scss';

class XModal extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  };
  
  componentWillMount() {
    //console.log(this);
  }
  
  componentDidMount() {
    //console.log(this.props.children);
  }
  
  componentWillReceiveProps(nextProps) {
    //console.log(React.Children);
    //console.log(React);
    //console.log(nextProps);
    //console.log(this.props.children);
  }
  
  render() {
    // const {value} = this.state;
    
    return (
      <Modal {...this.props} />
    );
  }
}

export default XModal
