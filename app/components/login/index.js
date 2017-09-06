import React, {Component, PropTypes} from "react";
import {Link}                        from "react-router";
import {reduxForm}                   from "redux-form";
import validation                    from 'app/components/login/validation';
import 'app/components/login/login.scss';

const logo = require('app/assets/images/login/logo.png');
const iconAccount = require('app/assets/images/login/icon-account.svg');
const iconPwd = require('app/assets/images/login/icon-pwd.svg');
const loginBg = require('app/assets/images/login/login-bg.jpg');


@reduxForm({
	form: 'login',
	fields: ['userName', 'password'],
	validate: validation
	//asyncValidate,
	//asyncBlurFields: ['userName']
})
export default class LoginComponent extends Component {

	static propTypes = {
		//active: PropTypes.string,
		//asyncValidating: PropTypes.bool.isRequired,
		fields: PropTypes.object.isRequired,
		//dirty: PropTypes.bool.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		//resetForm: PropTypes.func.isRequired,
		//invalid: PropTypes.bool.isRequired,
		//pristine: PropTypes.bool.isRequired,
		//valid: PropTypes.bool.isRequired
		submitting: PropTypes.bool.isRequired
	};

	render() {
		const {
			fields: {userName, password},
			handleSubmit,
			submitting,
			passportError
        } = this.props;

		return (
			<div className="vcg-login" >
				<div className="login-head" >
					<h4>
						<img src={logo} width="120px"></img>
						<span id="id-text2">VCG内容管理系统</span>
					</h4>
				</div>
				<div className="login-layout" style={{"backgroundImage":"url(" + loginBg + ")"}}>
					<div className="login-container">
						
						<form onSubmit={handleSubmit}>
							<fieldset>
								<h4>账号密码登录</h4>
								<label className="block clearfix">
													<span className="block input-icon input-icon-right">
														<input type="text" className="form-control" {...userName} placeholder="请输入用户名" />
														<i className="ace-icon fa fa-user"></i>
													</span>
									{userName.error && userName.touched && <div className="text-danger">{userName.error}</div>}
								</label>

								<label className="block clearfix">
													<span className="block input-icon input-icon-right">
														<input type="password" className="form-control" {...password} placeholder="请输入密码" />
														<i className="ace-icon fa fa-lock"></i>
													</span>
									{password.error && password.touched && <div className="text-danger">{password.error}</div>}
								</label>

								<div className="space"></div>
								<button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-block">
									{submitting ? <i/> : <i/>} 登录
								</button>
								<div className="space"></div>
								{/*
								<div className="clearfix">
									<label className="inline">
										<input type="checkbox" className="ace" />
										<span className="lbl"> 保持登录</span>
									</label>

								</div>*/}

								<div className="space-4"></div>
								{passportError && <p className="text-warning small orange text-center"><i className="ace-icon fa fa-exclamation-triangle"></i> {passportError.errorMessage}</p>}
							</fieldset>
						</form>


					</div>
				</div>

				<div className = "login-footer">
					©视觉中国 津ICP备13002056号-2 天津市武清公安分局
				</div>
			</div>

		);
	}

}


/*
* <div className="toolbar clearfix">
 <div>
 <Link to="#" data-target="#forgot-box" className="forgot-password-link">
 <i className="ace-icon fa fa-arrow-left"></i>
 I forgot my password
 </Link>
 </div>

 <div>
 <Link to="#" data-target="#signup-box" className="user-signup-link">
 I want to register
 <i className="ace-icon fa fa-arrow-right"></i>
 </Link>
 </div>
 </div>

 <div className="navbar-fixed-top align-right">
 <br />
 &nbsp;
 <Link id="btn-login-dark" to="#">ch</Link>
 &nbsp;
 <span className="blue">/</span>
 &nbsp;
 <Link id="btn-login-blur" to="#">en</Link>
 &nbsp; &nbsp; &nbsp;
 </div>
* */