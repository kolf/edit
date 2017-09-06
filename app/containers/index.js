import React, {Component} from "react";
import {connect} from "react-redux";
import {invalid} from "app/action_creators/session_action_creator";
import {clearStorage} from "app/api/auth_token";
import CrumbsBox from "app/components/common/crumbs";


const select = (state) => ({});
@connect(select)
export default class HomeContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            "crumbs": [
                {"path": "/home", "text": "首页"}
            ]
        }
    }

    static contextTypes = {
        "router": React.PropTypes.object.isRequired
    };

    render() {
        // //console.log('HomeContainer');
        // //console.log(this.state);
        return (
            <div className="main-content-inner">
                <CrumbsBox crumbs={this.state.crumbs}/>

                <button onClick={this._handleOnClick.bind(this)}>
                    Login Out
                </button>

            </div>
        );
    }

    _handleOnClick() {
        clearStorage();
        this.context.router.push("/login");
    };

}

// import IndexLayout from "app/layouts/index_layouts" <IndexLayout />
// import FooterContainer from "app/containers/footer_container" <FooterContainer />
