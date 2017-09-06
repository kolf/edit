import React, {Component, PropTypes} from "react";

export default class QualityRankBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'qualityRank': '',
            'id': ''
        };
        this.qualityRankItem = ['A', 'B', 'C', 'D', 'E'];
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.id!=nextState.id)||(nextProps.id==nextState.id&&nextProps.qualityRank!=nextState.qualityRank);
    };

    render() {
        const {operate,qualityRank,i,id,resId,handleOnClick} = this.props;
        this.state.id = id;
        this.state.qualityRank = qualityRank;
        //console.log('----------',operate,qualityRank,i,id,resId);
        let html=[];
        this.qualityRankItem.forEach((item, index) => {
            const className = parseInt(qualityRank||0)==(index+1)?'ant-radio text-danger em':'ant-radio';
            html.push(<span key={'qualityRank'+'_'+id+'_'+i+'_'+index} className={className} onClick={operate!='push'?handleOnClick.bind(this,{ "operate": "qualityRank", "key": i, id, resId, value: (index+1) }) : null}>{item}</span>);
        });
        //console.log('------222',html);
        return (
            <div className="ant-radio-group text-radio">{html}</div>
        );
    };

}