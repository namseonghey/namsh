import React from 'react';
import { newScrmObj, ComLib, TransManager, StrLib, DataLib } from 'common';
import { Link } from 'react-router-dom';
import 'assets/styles/login.css';

class Login extends React.Component {
	/*******************************************************************
	 * Constructor
	 *******************************************************************/
	constructor(props){
		super();
				// state 초기화
		this.state = {
			warning: false,
			dsLogin: DataLib.datalist.getInstance(),
			dsRst: DataLib.datalist.getInstance(),
			dsLoginInfo: DataLib.datalist.getInstance([{USR_ID: "", PWD: "", CENT_CD: "", CONN_IP: ""}]),
		};
		// 이벤트 바인딩
		this.event.button.onClick = this.event.button.onClick.bind(this);
		this.event.input.onChange = this.event.input.onChange.bind(this);
		this.event.input.onKeyUp = this.event.input.onKeyUp.bind(this);
	}

	componentDidUpdate(){
		if (this.state.warning) {
			setTimeout(() => this.setState({...this.state, warning: false}), 1500);
		}		
	}

	componentDidMount () {
		window.dispatchEvent(new CustomEvent("navigationhandler"));
		var serverInfos = this.getInfos();
		localStorage.setItem("infos", JSON.stringify(serverInfos));
		ComLib.setServerInfos();
		
	}
	/*******************************************************************
	 * Event
	 *******************************************************************/
	 getInfos = () => {
		var infos = {
			prod: {
				host: '192.168.0.27',
				domain: 'itfact.iptime.org',
				port: '8080',
				domainPort: '12388'
			},
			dev: {
				host: '',
				domain: '',
				port: '',
				domainPort: ''
			},
			localbuild: {
				host: '192.168.0.55',
				domain: '',
				port: '8443'
			},
			local: {
				host: 'localhost',
				domain: '',
				port: '8080'
			},
			// demo : {
			// 	host: 'itfact.iptime.org',
			// 	domain: '',
			// 	port: '12388'
				
			// }
		};
		return infos;
	}
	event = {
		button: {
			onClick: (e) => {
				switch (e.target.id) {
				case 'btnLogin':
					 if (this.validation('LOGIN_R01')) { this.transaction('LOGIN_R01'); }
					break;
				case 'btnChgPasswd':
					if (document.getElementById('popup_div_0') != undefined) {
						document.getElementById('popup_div_0').hidden = false;
					} else {
						let option = { width: '350px', height: '300px', modaless: false,
							param: [{
								USR_ID: this.state.dsLoginInfo.getValue(0, "USR_ID"),
								CUR_PWD: this.state.dsLoginInfo.getValue(0, "PWD"),
								NEW_PWD: '',
								CON_PWD: '',
							}],
						};
						ComLib.openPop('pwdChg', '비밀번호 변경', option);
					}
					break;
				default:
					break;
				}
			}
		},
		input: {
			onChange: (e) => {
				switch (e.target.id) {
				case 'txtUsrCd':
					this.state.dsLoginInfo.setValue(0, "USR_ID", e.target.value);
					ComLib.setStateDs(this, "dsLoginInfo");
					break;
				case 'txtUsrPasswd':
					ComLib.setStateValue(this, "dsLoginInfo", 0, "PWD", e.target.value);
					break;
				default:
					break;
				}
			},
			onKeyUp: (e) => {
				switch (e.target.id) {
				case 'txtUsrPasswd':
					if (e.getModifierState("CapsLock")) {
						this.setState({ warning: true });

					} else {
						this.setState({ warning: false });
					}

					if (e.keyCode === 13) {
						if (!ComLib.isNull(document.getElementById(newScrmObj.constants.mdi.DIALOG))) {
						} else if (!ComLib.isNull(document.getElementById(newScrmObj.constants.mdi.LOADING))) {
							if (document.getElementById(newScrmObj.constants.mdi.LOADING).hasChildNodes()) {
							} else { document.getElementById('btnLogin').click(); }
						} else { document.getElementById('btnLogin').click(); }
					}
					break;
				default:
					break;
				}
			}
		},
	}

	/*******************************************************************
	 * Validation
	 *******************************************************************/
	validation = (serviceid) => {
		switch (serviceid) {
		case 'LOGIN_R01':
			if (StrLib.isNull(this.state.dsLoginInfo.getValue(0, "USR_ID"))) {
				ComLib.openDialog('A', 'SYSI0010', ['ID를 입력해주세요.']);
				return false;
			}
			if (StrLib.isNull(this.state.dsLoginInfo.getValue(0, "PWD"))) {
				ComLib.openDialog('A', 'SYSI0010', ['비밀번호를 입력해주세요.']);
				return false;
			}

			break;
		case 'LOGIN_R02':
			break;
		case 'LOGIN_U01':
			break;
		default :
			break;
		}

		this.setdata(serviceid);

		return true;
	}

	/*******************************************************************
	 * Set Data
	 *******************************************************************/
	setdata = (serviceid) => {
		switch(serviceid) {
		case 'LOGIN_R01':
			break;
		case 'LOGIN_R02':
			this.state.dsRst.setValue(0, "CONN_IP", this.state.dsLoginInfo.getValue(0, "CONN_IP"));
			break;
		case 'LOGIN_U01':
			break;
		default :
			break;
		}
	}

	/*******************************************************************
	 * Transaction
	 * LOGIN_R01 : 로그인 체크
	 * LOGIN_R02 : 사용자 정보 조회
	 * LOGIN_U01 : 비멀번호 오류 카운트 업데이트
	 *******************************************************************/
	transaction = (serviceid) => {
		let transManager = new TransManager();
		try {
			switch (serviceid) {
			case 'LOGIN_R01':
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.passwd,
					datasetsend: "dsLogin",
					columnid: "PWD"
				});
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_doLogin",
					datasetsend:"dsLogin",
					datasetrecv:"dsRst",
				});
				transManager.addDataset('dsLogin', this.state.dsLoginInfo.getTransRecords());
				transManager.agent();

				break;
			case 'LOGIN_R02':
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				// // 비밀번호 오류 카운트 초기화
				// transManager.addConfig({
				// 	dao: transManager.constants.dao.base,
				// 	crudh: transManager.constants.crudh.update,
				// 	sqlmapid:"COM.U_initPwdErrCnt",
				// 	datasetsend:"dsSendData",
				// });
				// 사용자 정보 조회
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getUserInfo",
					datasetsend:"dsSendData",
					datasetrecv:"dsUserInfo"
				});
				// 공통코드 정보 조회
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getCommCode",
					datasetsend:"dsSendData",
					datasetrecv:"dsCommCodeInfo"
				});
				// 메뉴 정보 조회 -> TO-DO : Main Frame으로 이동 ?
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getMenuList",
					datasetsend:"dsSendData",
					datasetrecv:"dsMenuInfo"
				});
				// 센터 기준값 정보 조회
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getCentStndList",
					datasetsend:"dsSendData",
					datasetrecv:"dsCentStvlInfo"
				});
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getCentList",
					datasetsend:"dsSendData",
					datasetrecv:"dsCentList"
				});
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getTeamList",
					datasetsend:"dsSendData",
					datasetrecv:"dsTeamList"
				});
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getUserList",
					datasetsend:"dsSendData",
					datasetrecv:"dsUserList"
				});
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getConstList",
					datasetsend:"dsSendData",
					datasetrecv:"dsConstList"
				});
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getMsgList",
					datasetsend:"dsSendData",
					datasetrecv:"dsMsgList"
				});
				transManager.addDataset('dsSendData', this.state.dsRst.getTransRecords());
				transManager.agent();

				break;
			case 'LOGIN_R03':
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.update,
					sqlmapid:"COM.U_doLoginAfter",
					datasetsend:"dsSendData",
				});
				transManager.addDataset('dsSendData', this.state.dsRst.getTransRecords());
				transManager.agent();
				break;
			// 비밀번호 에러 카운트 업데이트
			case 'LOGIN_U01':
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.update,
					sqlmapid:"COM.U_addPwdErrCnt",
					datasetsend:"dsUpdatePwd",
				});
				transManager.addDataset('dsUpdatePwd', this.state.dsLoginInfo.getTransRecords());
				transManager.agent();

				break;
			default :
				break;
			}
		} catch (err) {
			console.log(err);
			console.log(err);
		}
	}

	/*******************************************************************
	 * Callback
	 *******************************************************************/
	callback = (res) => {
		switch (res.id) {
		case 'LOGIN_R01':
			if (res.data.dsRst.length < 1) {				
				ComLib.openDialog('A', 'SYSI0010', ['사용자가 존재하지 않습니다.']);
				return false;
				
			} else {
				ComLib.setStateInitRecords(this, "dsRst", res.data.dsRst);

				if (this.state.dsRst.getValue(0, "RST_CD") === 'Y') {
					if (this.validation('LOGIN_R02')) this.transaction('LOGIN_R02');
				} else {
					if (this.state.dsRst.getValue(0, "RST_CD") === 'LOGIN') {
						ComLib.openDialog('A', 'SYSI0010', ['이미 로그인 된 사용자 입니다.']);
						return false;
					}
					if (this.state.dsRst.getValue(0, "RST_CD") === 'MAX_ERR') {
						ComLib.openDialog('A', 'SYSI0010', ['비밀번호 입력 오류가 5회 초과하였습니다. 비밀번호를 초기화 해주세요.']);
						return false;
					}
					if (this.state.dsRst.getValue(0, "RST_CD") === 'INIT') {
						ComLib.openDialog('C', 'SYSI0010', ['비밀번호 변경 대상자 입니다.\n 비밀번호 변경 화면으로 이동합니다.'], foo => { if (foo === true) document.getElementById('btnChgPasswd').click();});
					}
					if (this.state.dsRst.getValue(0, "RST_CD") === 'PWD_ERR') {
						ComLib.openDialog('A', 'SYSI0010', ['비밀번호 오류입니다.']);
						if (this.validation('LOGIN_U01')) this.transaction('LOGIN_U01');
					}
				}
			}
			

			break;
		case 'LOGIN_R02':
			const access_token = true;
			ComLib.setSession('token', access_token);

			ComLib.setSession('gdsUserInfo',	res.data.dsUserInfo);
			ComLib.setSession('gdsCommCode',	res.data.dsCommCodeInfo);
			ComLib.setSession('gdsMenu', 		res.data.dsMenuInfo);
			ComLib.setSession('gdsCentStndVl',	res.data.dsCentStvlInfo);
			ComLib.setSession('gdsCentList',	res.data.dsCentList);
			ComLib.setSession('gdsTeamList',	res.data.dsTeamList);
			ComLib.setSession('gdsUserList',	res.data.dsUserList);
			ComLib.setSession('gdsMsgList',		res.data.dsMsgList);
			ComLib.setSession('gdsConstList',	res.data.dsConstList);

			this.transaction('LOGIN_R03');

			break;
		case 'LOGIN_R03':
			console.log(document.getElementById('linkBase'))
			// 메인 화면으로 이동
			document.getElementById('linkBase').click();

			break;
		case 'LOGIN_U01':
			break;
		default:
			break;
		}
	}

	/*******************************************************************
	 * render
	 *******************************************************************/
	render () {
		return (
			<React.Fragment>
				<div className = 'scrm-login-wrap'>
					<div className = 'scrm-login'>
						<div className = 'scrm-login-div'>
							<div className = 'scrm-login-main'>
								<h1>Smart VA</h1> 
							</div>
							
							
							<div className = 'scrm-login-input'>
								<input style = {{width: '100%'}} type = "text" id = 'txtUsrCd' value = {this.state.dsLoginInfo.records[0]["USR_ID"]} placeholder = {' 아이디'} onChange = {this.event.input.onChange}/>
							</div>
							<div className = 'scrm-login-input password'>
								<input style = {{width: '100%'}} type = "password" id = 'txtUsrPasswd' value = {this.state.dsLoginInfo.records[0]["PWD"]} placeholder = {' 비밀번호'} onChange = {this.event.input.onChange} onKeyUp = {this.event.input.onKeyUp}/>
							</div>
							{this.state.warning &&<div class="ly_v2" id="err_capslock">
														<div class="ly_box">
															<p><strong>Caps Lock</strong>이 켜져 있습니다.</p>
														</div>
														<span class="sp ly_point"></span>
													</div>}
							<div className = 'scrm-login-btn-div'>
								<div className = 'scrm-login-btn'>
									<button id = 'btnLogin' onClick = {this.event.button.onClick}>{'로그인'}</button>
								</div>
								<div className = 'scrm-login-btn2'>
									<button id = 'btnChgPasswd' onClick = {this.event.button.onClick}>{'비밀번호 변경'}</button>
								</div>
							</div>
							<dic className = 'scrm-login-btn-div'>
								<a href="https://www.google.com/intl/ko/chrome/">Chrome에 최적화 되어 있습니다.</a>								
							</dic>
						</div>
						<div className= 'scrm-login-img'></div>
					</div>
				</div>
				<div style = {{display: 'none'}}>
					<Link id = 'linkBase'	to = {{pathname: '/',	state: {}}}/>
				</div>
			</React.Fragment>
		);
	}
}

export default Login;