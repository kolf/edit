import React, {Component, PropTypes}    from "react";
import {connect}                        from "react-redux";
import Affix                            from 'antd/lib/affix';

export default class Wizard extends Component {
   
    constructor (props) {
        super(props);
 
        this.state = {
            "children": React.Children.count,
            "active": [0]
        };
    };
	componentDidMount() {
        let { active } = this.state;
        const children = this.props.children;
        this.setState({children});
    };
    
    componentWillReceiveProps(nextProps) {
        //console.info(nextProps);
    };  
     
    componentWillUnmount() {
        
    };
    
    render () {
        const {active, children} = this.state;
        let count = children.length;
        let len = active.length;
                
        return (
            <div className="page-content">
                <div id="fuelux-wizard-container">
                    <div className="mt-15">
                        <ul className="steps">
                            {
                                React.Children.map(this.props.children, function (child) {
                                    const {key} = child;
                                    const {title} = child.props;
                                    const val = active[key-1];
                                    return (
                                        <li data-step={key} className={val === 0? "active" : val === 1? "complete" : ""} key={key}>
                                            <span className="step">{key}</span>
                                            <span className="title">{title}</span>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>

                    <hr className="mb-5"/>
                    <Affix offsetTop={9} className="wizard-actions top">
                        <button className="btn btn-prev" onClick={this.prevClick.bind(this)} disabled={active[0]===0?true:false}>
                            <i className="ace-icon fa fa-arrow-left"></i>
                            上一步
                        </button>{' '}
                        <button className="btn btn-success btn-next" onClick={this.nextClick.bind(this)} >
                            {count === len? "发布" : "下一步"}
                            <i className="ace-icon fa fa-arrow-right icon-on-right"></i></button>
                    </Affix>

                    <div className="step-content pos-rel">
                        {
                            React.Children.map(this.props.children, function (child) {
                                // //console.log("child", child);
                                const {key} = child;
                                return (
                                    <div className={active[key-1]===0?"step-pane active":"step-pane"} data-step={key}>
                                        {child}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <hr/>
                <div className="wizard-actions">
                    <button className="btn btn-prev" onClick={this.prevClick.bind(this)} disabled={active[0]===0?true:false}>
                        <i className="ace-icon fa fa-arrow-left"></i>
                        上一步
                    </button>{' '}
                    <button className="btn btn-success btn-next" onClick={this.nextClick.bind(this)} >
                        {count === len? "发布" : "下一步"}
                        <i className="ace-icon fa fa-arrow-right icon-on-right"></i></button>
                </div>
            </div>
        );
    };
    
    prevClick(e) {
        const target = e.target;
        const {children} = this.state;
        let {active} = this.state;
        
        if(active.length === 1)
        {
            target.disabled = true;
        }
        else
        {
            target.disabled = false;
            active.shift();
            this.setState({active});
        }    
        //console.log(active,children);
    };
    
    nextClick(e) {
        const target = e.target;
        const {children} = this.state;
        let {active} = this.state;
        
        if(active.length !== children.length)
        {
            if(_.indexOf(active, 0) === 0){
                if(this.props.nextAction_1()) return false;
            }
            active = _.fill(active, 1);
            active.push(0);
            this.setState({active});
        }
        else
        {
            this.props.publish();
        }
        
        //console.log(active,children);
        
    };
    
};

export class Step extends Component {
   
    constructor (props) {
        super(props);
        this.state = {
            
        };
        
    };
    
    componentDidMount(){
        const {componentDid} = this.props;
        if(componentDid) componentDid();
    };
    
    componentWillUnmount() {
        
    };
   
    render () {
        // //console.log("Step:props ",this.props);
        const {stepRender, contentText, param} = this.props;
        return (
            <div>
                { stepRender && stepRender(param)}
                { !stepRender && <div className="center">{contentText}</div>}
            </div>
        );
    };
   

}