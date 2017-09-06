import React, { Component, PropTypes } from 'react';

import { Collapse, Checkbox, Input } from 'antd';
const Panel = Collapse.Panel;
const CheckboxGroup = Checkbox.Group;

export default class setCreativeImageNoPass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex:[],  // 当前展开项
            setNoPassOptions : 
            [
                {
                    "value": "1",
                    "label": "图片素材",
                    "childNodes": [
                        {
                            "value": "11",
                            "label": "拍摄问题",
                            "childNodes": [
                                {
                                    "value": 111,
                                    "label": "图片拍摄主体焦点不实"
                                },
                                {
                                    "value": 112,
                                    "label": "画面不够干净、杂点过多（传感器灰尘斑点、无助于创意构图的光斑光晕）"
                                },
                                {
                                    "value": 113,
                                    "label": "图片色调不够自然，对比度、饱和度有偏差"
                                },
                                {
                                    "value": 114,
                                    "label": "白平衡不准确"
                                },
                                {
                                    "value": 115,
                                    "label": "画面出现偏色"
                                },
                                {
                                    "value": 116,
                                    "label": "由于曝光过度或不足，引起的图片明暗层次损失过多"
                                },
                                {
                                    "value": 117,
                                    "label": "布光或补光缺失，反差过高"
                                },
                                {
                                    "value": 118,
                                    "label": "图片构图不够严谨，地平线倾斜、建筑透视不合理、畸变等"
                                },
                                {
                                    "value": 119,
                                    "label": "图片构图需改进，避免出现过多无关杂物或人物"
                                }
                            ]
                        },
                        {
                            "value": "12",
                            "label": "后期问题",
                            "childNodes": [
                                {
                                    "value": 121,
                                    "label": "处理过于简单的黑白图片"
                                },
                                {
                                    "value": 122,
                                    "label": "后期处理过度，比如：过度锐化、饱和度过高、对比度过高、画面整体偏色，或由特殊滤镜使用不当导致的画面失真等问题"
                                },
                                {
                                    "value": 123,
                                    "label": "后期处理不精致，注意改进抠图合成、细节把控等问题"
                                },
                                {
                                    "value": 124,
                                    "label": "过时的创意"
                                },
                                {
                                    "value": 125,
                                    "label": "注意图片的任何后期修图、剪裁、差值等处理都会影响画面的精度"
                                },
                                {
                                    "value": 126,
                                    "label": "注意后期降噪，尽可能在拍摄时选择合理的感光度，保证画面品质"
                                }
                            ]
                        },
                        {
                            "value": "13",
                            "label": "人物、静物",
                            "childNodes": [
                                {
                                    "value": 131,
                                    "label": "模特形象或表现力不佳（妆容、表情、肢体语言）"
                                },
                                {
                                    "value": 132,
                                    "label": "道具、服装等选择不够精致，搭配不够合理（颜色、），无法满足品质需求"
                                },
                                {
                                    "value": 133,
                                    "label": "道具处理不细致，避免出现脏点、手纹、灰尘等影响画面品质的杂物"
                                },
                                {
                                    "value": 134,
                                    "label": "拍摄背景或场景选择不够考究，拍摄较为随意"
                                }
                            ]
                        },
                        {
                            "value": "14",
                            "label": "常规问题",
                            "childNodes": [
                                {
                                    "value": 141,
                                    "label": "创意内容过于简单，缺乏商业潜力"
                                },
                                {
                                    "value": 142,
                                    "label": "图片精度不佳，放大后细节损失过多，无法满足客户对品质的要求"
                                },
                                {
                                    "value": 143,
                                    "label": "内容，更偏向于纪实、新闻等编辑类素材"
                                },
                                {
                                    "value": 144,
                                    "label": "图库内同类题材图片过多，不再过多收入，请提供更为精品的内容"
                                },
                                {
                                    "value": 145,
                                    "label": "同组内容上传，需注意拍摄视角、场景、构图等差异选择，不要提交过多相似内容"
                                },
                                {
                                    "value": 146,
                                    "label": "作为素材图，画面里不要出现logo、主题等相关的文字信息，方便客户后期修图"
                                },
                                {
                                    "value": 147,
                                    "label": "可识别的信息，包括：姓名、电话、身份证件、机动车号及某公司、某人的相关信息均不可出现在图库素材中"
                                }
                            ]
                        }
                    ]
                },
                {
                    "value": "2",
                    "label": "矢量图",
                    "childNodes": [
                        {
                            "value": "21",
                            "childNodes": [
                                {
                                    "value": 211,
                                    "label": "不符合入库格式，请提交AI、EPS其他文件格式不兼容"
                                },
                                {
                                    "value": 212,
                                    "label": "图像绘制线条过度不够自然"
                                },
                                {
                                    "value": 213,
                                    "label": "图像绘制色彩过度不够自然"
                                }
                            ]
                        },
                        {
                            "value": "22",
                            "label": "常规问题",
                            "childNodes": [
                                {
                                    "value": 221,
                                    "label": "创意内容过于简单，缺乏商业潜力"
                                },
                                {
                                    "value": 222,
                                    "label": "图片精度不佳，放大后细节损失过多，无法满足客户对品质的要求"
                                },
                                {
                                    "value": 223,
                                    "label": "内容，更偏向于纪实、新闻等编辑类素材"
                                },
                                {
                                    "value": 224,
                                    "label": "图库内同类题材图片过多，不再过多收入，请提供更为精品的内容"
                                },
                                {
                                    "value": 225,
                                    "label": "同组内容上传，需注意拍摄视角、场景、构图等差异选择，不要提交过多相似内容"
                                },
                                {
                                    "value": 226,
                                    "label": "作为素材图，画面里不要出现logo、主题等相关的文字信息，方便客户后期修图"
                                },
                                {
                                    "value": 227,
                                    "label": "可识别的信息，包括：姓名、电话、身份证件、机动车号及某公司、某人的相关信息均不可出现在图库素材中"
                                }
                            ]
                        }
                    ]
                },
                {
                    "value": "3",
                    "label": "插图",
                    "childNodes": [
                        {
                            "value": "31",
                            "childNodes": [
                                {
                                    "value": 311,
                                    "label": "商业插图不接受任何临摹的知名人物（包括政客、明星、艺术家等）"
                                },
                                {
                                    "value": 312,
                                    "label": "只接受原创内容，创作中避免过多参考知名卡通、动漫、电影等形象信息和布景道具等"
                                },
                                {
                                    "value": 313,
                                    "label": "产品包装、设计、海报等作品类内容，不适宜商业图库需求"
                                },
                                {
                                    "value": 314,
                                    "label": "插图主题需要更为积极、正面的信息，内容不要过于负面阴暗"
                                },
                                {
                                    "value": 315,
                                    "label": "商业插图不接受任何时政类、军事类、暴力、色情类的连环画、图表类"
                                },
                                {
                                    "value": 316,
                                    "label": "作为素材图，画面里不要出现logo、主题等相关的文字信息，方便客户后期修图"
                                }
                            ]
                        },
                        {
                            "value": "32",
                            "label": "常规问题",
                            "childNodes": [
                                {
                                    "value": 321,
                                    "label": "创意内容过于简单，缺乏商业潜力"
                                },
                                {
                                    "value": 322,
                                    "label": "图片精度不佳，放大后细节损失过多，无法满足客户对品质的要求"
                                },
                                {
                                    "value": 323,
                                    "label": "内容，更偏向于纪实、新闻等编辑类素材"
                                },
                                {
                                    "value": 324,
                                    "label": "图库内同类题材图片过多，不再过多收入，请提供更为精品的内容"
                                },
                                {
                                    "value": 325,
                                    "label": "同组内容上传，需注意拍摄视角、场景、构图等差异选择，不要提交过多相似内容"
                                },
                                {
                                    "value": 326,
                                    "label": "可识别的信息，包括：姓名、电话、身份证件、机动车号及某公司、某人的相关信息均不可出现在图库素材中"
                                }
                            ]
                        }
                    ]
                },
                {
                    "value": "4",
                    "label": "法律法规问题",
                    "childNodes": [
                        {
                            "value": "41",
                            "label": "基本法律法规",
                            "childNodes": [
                                {
                                    "value": 411,
                                    "label": "肖像权文件填写不规范，需要重新提供（可再编辑）"
                                },
                                {
                                    "value": 412,
                                    "label": "物权文件填写不规范，需要重新提供（可再编辑）"
                                },
                                {
                                    "value": 413,
                                    "label": "提供的素材出现可识别的人物形象，需要提供肖像权授权文件"
                                },
                                {
                                    "value": 414,
                                    "label": "提供的素材出现可识别的知名建筑或独立建筑（外景和内景）、艺术品或商品，需要提供物权授权文件"
                                },
                                {
                                    "value": 415,
                                    "label": "画面出现独立的广告牌、商标、logo等有物权风险，需后期修掉"
                                },
                                {
                                    "value": 416,
                                    "label": "内容有一定的敏感性（政治、军事、暴力、色情等），请谨慎提供"
                                }
                            ]
                        },
                        {
                            "value": "42",
                            "label": "常规行业信息",
                            "childNodes": [
                                {
                                    "value": 421,
                                    "label": "避免出现有关中国的政治、军事、公职人员等信息和形象，不得用于商业广告中"
                                },
                                {
                                    "value": 422,
                                    "label": "广告法规定：中国国旗（五星红旗）、中国国徽、中国国歌不得用于商业广告中"
                                },
                                {
                                    "value": 423,
                                    "label": "人民币的画面不得用于商业使用中"
                                },
                                {
                                    "value": 424,
                                    "label": "伊丽莎白二世头像的货币、邮票不得用于商业使用中"
                                },
                                {
                                    "value": 425,
                                    "label": "奥运会的五环标志、场馆、吉祥物等相关内容均需要提供物权授权，不得用于商业使用中"
                                },
                                {
                                    "value": 426,
                                    "label": "当代汽车（1985年以后生产）不得作为拍摄主体"
                                },
                                {
                                    "value": 427,
                                    "label": "豪华汽车（无论何种年代生产）不得作为拍摄主体"
                                },
                                {
                                    "value": 428,
                                    "label": "地图（中国以外）的主要部分或者完整部分不得用于商业使用"
                                },
                                {
                                    "value": 429,
                                    "label": "中国地图不得用于商业图片拍摄于制作"
                                },
                                {
                                    "value": 430,
                                    "label": "邮票类（加盖邮戳的除外）不收入，有物权风险"
                                },
                                {
                                    "value": 431,
                                    "label": "知名主题乐园的相关建筑、焰火、表演、经典形象、衍生的商品等，均有物权风险，不建议提供"
                                }
                            ]
                        }
                    ]
                }
            ],
            checkedReasonsList:[],// 选择原因
            otherReason:"" //其它原因
        };

        this.checkedOptionsList = [];
    };

    componentWillMount() {

    };

    render() {
        const {setNoPassOptions} = this.state;
        let {otherReason} = this.state;
        return (
            <div>
                <Collapse bordered={false} defaultActiveKey={this.state.activeIndex}>
                    {this.renderPanel(setNoPassOptions)}
                </Collapse> 
                <Input type="textarea" defaultValue={otherReason} onChange={e=>{this.handleOnClick(null,e)}} className="mt-10" placeholder="这里输入其它原因" autosize={{ minRows: 2, maxRows: 6 }} />
            </div>
 
        )
    };

    renderPanel(list) {
        
        let panels = null;

        panels = list.map((item, i) => {
            
            let {label,value,childNodes} = item;

            return (<Panel header = {label} key = {i}>
                    {this.renderCheckbox(childNodes,i)}
                </Panel>)
        })

        return panels
    }

    renderCheckbox(list){
        const {checkedReasonsList} = this.state;
        let checkboxGroup = null;
        checkboxGroup = list.map((item, i) => {
            let {label,value,childNodes} = item;
            return (
                <div>
                    <h4>{label}</h4>
                    <CheckboxGroup defaultValue={checkedReasonsList[label?item.value:value]}  options={label?item.childNodes:childNodes}  onChange={this.handleOnClick.bind(this,label?item.value:value) } key = {i} />
                </div>
                )
        });

        return checkboxGroup
    }

    handleOnClick(key,e){

        const {setAlertParam} = this.props;
        let {checkedReasonsList,setNoPassOptions,otherReason} = this.state; 

        if(key != null){    // 选择操作
            
            this.checkedOptionsList=[];
            checkedReasonsList[key] = e.sort();

            checkedReasonsList.forEach((list,i)=>{

                list.forEach((item,j)=>{

                    // 根据当前选中的value 取到label值 （选择选项的value和label如果都是中文，此处就不需取到label值）
                    this.checkedOptionsList.push( setNoPassOptions[item.toString().substr(0,1)-1].childNodes[item.toString().substr(1,1)-1].childNodes[item.toString().substr(2,1)-1].label );
                });

            });  
            
        }else{
            
            otherReason = e.target.value;
        }  
       
        this.setState({checkedReasonsList,otherReason});

        setAlertParam([...this.checkedOptionsList,otherReason])

    }
}