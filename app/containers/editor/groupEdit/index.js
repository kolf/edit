import React from 'react'
import { Tabs, Button } from 'antd'
import './style.scss'
import GroupEdit from './GroupEdit'
import ImagesEdit from './ImagesEdit'

const TabPane = Tabs.TabPane

class GroupEdits extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        
        return (<div className="container">
            <div className="pad-v-lg">
                <div className="page-header clearfix">
                    <div className="page-title pull-left">组照信息编辑</div>
                    <div className="page-header-tools pull-right">
                        <Button type="primary" size="large" className="mr-5">保存</Button>
                        <Button size="large">取消</Button> 
                    </div>
                </div>
                <GroupEdit />
                <ImagesEdit />
                <div className="page-footer-tools">
                    <Button type="primary" size="large" className="mr-5">保存</Button>
                    <Button size="large">取消</Button> 
                </div>
            </div>
        </div>)
    }
}

export default GroupEdits