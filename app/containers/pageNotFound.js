import React, {Component} from "react"
import {connect}          from "react-redux"
import BreadCrumbs        from "app/containers/sidebar/breadCrumbs"


const select = (state) => ({});
@connect(select)
export default class PageNotFound extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      "crumbs": [
        {"path": "/home", "text": "首頁"},
        {"path": "/nofound", "text": "Page Not Found."}
      ]
    }
  }
  
  componentWillMount() {
  
  }
  
  render() {
    //console.log('page not');
    //console.log(this.state);
    //console.log(this.props);
    return (
      <div className="main-content-inner">
        <BreadCrumbs crumbs={this.state.crumbs}/>
        
        <div className="error-container">
          <div className="well">
            <h1 className="grey lighter smaller">
											<span className="blue bigger-125">
												<i className="ace-icon fa fa-sitemap"></i>
												404
											</span>
              Page Not Found
            </h1>
            
            <hr />
            <h3 className="lighter smaller">We looked everywhere but we couldn't find it!</h3>
            
            <div>
              <form className="form-search">
												<span className="input-icon align-middle">
													<i className="ace-icon fa fa-search"></i>

													<input type="text" className="search-query" placeholder="Give it a search..."/>
												</span>
                <button className="btn btn-sm" type="button">Go!</button>
              </form>
              
              <div className="space"></div>
              <h4 className="smaller">Try one of the following:</h4>
              
              <ul className="list-unstyled spaced inline bigger-110 margin-15">
                <li>
                  <i className="ace-icon fa fa-hand-o-right blue"></i>
                  Re-check the url for typos
                </li>
                
                <li>
                  <i className="ace-icon fa fa-hand-o-right blue"></i>
                  Read the faq
                </li>
                
                <li>
                  <i className="ace-icon fa fa-hand-o-right blue"></i>
                  Tell us about it
                </li>
              </ul>
            </div>
            
            <hr />
            <div className="space"></div>
            
            <div className="center">
              <a href="javascript:history.back()" className="btn btn-grey">
                <i className="ace-icon fa fa-arrow-left"></i>
                Go Back
              </a>
              
              <a href="#" className="btn btn-primary">
                <i className="ace-icon fa fa-tachometer"></i>
                Dashboard
              </a>
            </div>
          </div>
        </div>
      
      </div>
    );
  }
  
}




