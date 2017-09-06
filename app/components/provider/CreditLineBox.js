import React, {Component, PropTypes} from "react";

export default class CreditLineBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'creditLine': '',
            'id': ''
        };
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.id!=nextState.id)||(nextProps.id==nextState.id&&nextProps.creditLine!=nextState.creditLine);
    };

    render() {
        const {operate,creditLine,i,id,resId,handleOnClick} = this.props;
        this.state.id = id;
        this.state.creditLine = creditLine;
        //console.log('----------',operate,creditLine,i,id,resId);
        return (
            <input
                key={'creditLine'+'_'+id+'_'+i}
                value={creditLine}
                placeholder="请输入署名"
                type="text"
                onChange={handleOnClick.bind(this,{ "operate": "creditLine", "key":i, id, resId }) } />
        );
    };

}