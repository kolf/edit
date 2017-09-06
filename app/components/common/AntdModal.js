import React, {Component, PropTypes} from 'react'
import {Modal} from 'antd'
import {connectModal} from 'redux-modal'

class AntdModal extends Component {
  render() {
    const {body, visible, title, onCancel, onOk} = this.props
    const modalProps = {
      title,
      visible,
      onOk,
      onCancel
    };
    
    return (
      <Modal {...modalProps}>
        {body}
      </Modal>
    );
  }
}

export default connectModal({name: 'antd', destroyOnHide: true})(AntdModal)
