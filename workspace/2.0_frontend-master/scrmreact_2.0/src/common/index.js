import axios from 'axios';
import { loadProgressBar } from 'x-axios-progress-bar';
import 'x-axios-progress-bar/dist/nprogress.css';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {Dialog} from 'components';
import { Provider } from 'react-redux';
import store from '../store';

const newScrmObj = {
	constants: {
		crud: {
			read: 'r',
			create: 'c',
			update: 'u',
			destroy: 'd',
			remove: 'e'
		},
		datetime: {
			format: 'YYYYMMDDHH24MISS'
		},
		mdi: {
			DIALOG : 'dialog',
			POP_UP : 'popup',
			PLAYER : 'player',
			LOADING : '_loadDiv'
		},
		select: {
			argument: {
				all: 'a',
				select: 's',
				none: 'n',
			},
			dataType : {
					all : 'A'
				,	cns : 'B'
				,	qa : 'Q'
				,	mng : 'M'
			},
			authControl : {
				QA : {
					CENT : [4, 5, 6, 7, 9],
					TEAM  : [5, 6, 9],
					USER : [5]
				},
				CSR : {
					CENT : [4, 6, 7],
					TEAM  : [4, 6],
					USER : [4]
				}
			}
		},
		rowtype: {
			CREATE_OR_UPDATE: 'cu',
			DESTROY: 'd'
		}
	}
};
const ComLib = {
	isNull: (obj) => {
		if (typeof obj === undefined || obj === null) return true;
	},
	isJson: (data) => {
		try {
			let json = JSON.parse(data);
			return (typeof json === 'object');
		} catch (e) {
			return false;
		}
	},
	setSession: (id, obj) => {
		if (typeof obj === 'object') {
			sessionStorage.setItem(id, JSON.stringify(obj));
		} else {
			sessionStorage.setItem(id, obj);
		}
	},
	getSession: (id) => {
		if (ComLib.isJson(sessionStorage.getItem(id))) {
			return JSON.parse(sessionStorage.getItem(id));
		} else {
			return sessionStorage.getItem(id);
		}
	},
	openDialog : (type, msgcd, msg, callback) => {
		if ( document.getElementById(newScrmObj.constants.mdi.DIALOG) === undefined || document.getElementById(newScrmObj.constants.mdi.DIALOG) === null ) {
			let dialog = document.createElement('div');
			dialog.id = newScrmObj.constants.mdi.DIALOG;
			document.body.appendChild(dialog);
		}
		if (type === 'C') {
			if (typeof callback === undefined || typeof callback !== 'function') { return false; }
			ReactDOM.render( <Dialog.ConfirmDialog open={true} message={ComLib.getMsgCont(msgcd, msg)}  onReturnVal = {callback}
											onClose={ () => { document.body.removeChild(document.getElementById(newScrmObj.constants.mdi.DIALOG));} }/>
			, document.getElementById(newScrmObj.constants.mdi.DIALOG) );
		} else {
			ReactDOM.render( <Dialog.AlertDialog   open={true} message={ComLib.getMsgCont(msgcd, msg)}
											onClose={ () => { document.body.removeChild(document.getElementById(newScrmObj.constants.mdi.DIALOG));} }/>
			, document.getElementById(newScrmObj.constants.mdi.DIALOG) );
		}
	},
	openPop : (url, name, options, callbackFunc) => {
		let arrPopTag = Object.values(document.body.children).filter(
			tag => tag.tagName === 'DIV'
		).filter(
			item => item.id.substring(0, newScrmObj.constants.mdi.POP_UP.length) === newScrmObj.constants.mdi.POP_UP
		);

		let popDiv = document.createElement('div');
		let position = {x: 0, y: 0};

		if (arrPopTag.length === 0) {
			popDiv.id = newScrmObj.constants.mdi.POP_UP + '_div_' + arrPopTag.length;
		} else {
			popDiv.id = newScrmObj.constants.mdi.POP_UP + '_div_' + (Number(arrPopTag[arrPopTag.length - 1].id.substr((newScrmObj.constants.mdi.POP_UP.length + '_div_'.length))) + 1).toString();
			position = { x : arrPopTag.length * 10,  y: arrPopTag.length * 10 }
		}
		
		document.body.appendChild(popDiv);

		ReactDOM.render(
			<Provider store={store}>
				<Dialog.PopupDialog
					popupdivid = {popDiv.id}
					open={true}
					url={url}
					name={name}
					modaless={options.modaless}
					position = {position}
					options={options}
					onCallbackFunc={callbackFunc}
					onClose={
						() => {
							return new Promise ( (resolve, reject) => {
								try {
									if (typeof options.callback === "function") {
										try {
											options.callback();
										} catch (err) {
											reject(err);
										}
									}
									resolve();
								} catch (error) {
									reject(error);
								}
							}).then(function () {
								ReactDOM.unmountComponentAtNode(document.getElementById(popDiv.id));
							}).catch(function (error) {
								console.log(error);
							}).then(function () {
								document.body.removeChild(popDiv);
							});
						}
					}
				/>
			</Provider>
		, popDiv);
		return popDiv.id;
	},
	openPlayer : (options, callbackFunc) => {
		options.height = '810px';
		let title = 'STT???????????? : ' + (options.useUuid === true ? options.UUID : options.callId);
		ComLib.openPop('STT000001', title, options, callbackFunc);
	},
	copyText : (txt) => {
		const element = document.createElement('textarea');
		element.textContent = txt.join('\r\n');
		// element.innerText = element.innerText.split('\r\n').join('<br/>')
		document.body.appendChild(element);

		element.select();
		document.execCommand('copy');
		document.body.removeChild(element);
		ComLib.openDialog("A", "SYSI0010", ["?????? ???????????????."]);
	},
	writeTxtFile : (strData, strFileName) => {
		let file = new Blob([strData], {type: 'text/plain'});

		/// IE
		if (navigator.appVersion.toString().indexOf('.NET') > 0)
			window.navigator.msSaveBlob(file, strFileName);
		/// Chrome
		else{
			let element = document.createElement("a");
			element.href = window.URL.createObjectURL(file);
			element.download = strFileName;
			element.click();
		}
	},
	getComCodeValue : (sBigCtgCd, sMdlCtgCd) => {
		var arr = ComLib.getCommCodeList(sBigCtgCd, StrLib.isNull(sMdlCtgCd) ? "" : sMdlCtgCd).map(item => { return item['CODE']});
		return arr;
	},
	getComCodeName : (sBigCtgCd, value, sMdlCtgCd) => {
		let arr = ComLib.getCommCodeList(sBigCtgCd, StrLib.isNull(sMdlCtgCd) ? "" : sMdlCtgCd).filter(ele => ele['CODE'] === value);
		if (arr.length === 0) return '';
		else return arr[0]['CODE_NM'];
	},
	getComCodeCdVal : (sBigCtgCd, value, sMdlCtgCd) => {
		let arr = ComLib.getCommCodeList(sBigCtgCd, StrLib.isNull(sMdlCtgCd) ? "" : sMdlCtgCd).filter(ele => ele['CODE'] === value);
		if (arr.length === 0) return '';
		else return arr[0]['CD_VAL'];
	},
	setDisableByAuth : (tgtOrg, blnQa) => {
		if (blnQa) {
			if (newScrmObj.constants.select.authControl['QA'][tgtOrg].filter(item => item === ComLib.getSession("gdsUserInfo")[0]['AUTH_LV']).length > 0) {
				return true;
			}
		} else {
			if (newScrmObj.constants.select.authControl['CSR'][tgtOrg].filter(item => item === ComLib.getSession("gdsUserInfo")[0]['AUTH_LV']).length > 0) {
				if (ComLib.getSession("gdsUserInfo")[0]['AUTH_LV'] === 6)  {
					if (tgtOrg !== 'CENT') {
						if (ComLib.getSession("gdsUserInfo")[0]['TEAM_TP_CD'] === 'Q') {
							return false;
						}
					}
				}
				return true;
			}
		}
		return false;
	},
	setOrgComboValue : (orgCode, blnQa) => {
		let code = orgCode.substring(0, orgCode.length-3);
		if  (code === "USR") code = "USER";

		if (blnQa) {
			if (newScrmObj.constants.select.authControl['QA'][code].filter(item => item === ComLib.getSession("gdsUserInfo")[0]['AUTH_LV']).length > 0) {
				if (orgCode !== 'CENT_CD') {
					if (ComLib.getSession("gdsUserInfo")[0]['TEAM_TP_CD'] === 'Q') {
						return ComLib.getSession("gdsUserInfo")[0][orgCode];
					}
				} else {
					return ComLib.getSession("gdsUserInfo")[0][orgCode];
				}
			}
		} else {
			if (newScrmObj.constants.select.authControl['CSR'][code].filter(item => item === ComLib.getSession("gdsUserInfo")[0]['AUTH_LV']).length > 0) {
				if (orgCode !== 'CENT_CD') {
					if (ComLib.getSession("gdsUserInfo")[0]['TEAM_TP_CD'] !== 'Q') {
						return ComLib.getSession("gdsUserInfo")[0][orgCode];
					}
				} else {
					// console.log(ComLib.getSession("gdsUserInfo")[0]['TEAM_TP_CD']);
					return ComLib.getSession("gdsUserInfo")[0][orgCode];
				}
			}
		}
		return "";
	},
	/*----------------------------------------------------------------------------------------
	* [????????? ????????? ???????????? ????????? ??????????????? ????????????]
	* @param	:	string sBigCtgCd
	* @return	:	array
	* @see		:	1. sBigCtgCd : ???????????? ????????? ??????
					2. ?????? => ????????? ????????? ???????????? ????????? ????????? array??? return
					   ?????? => empty array return
	*--------------------------------------------------------------------------------------*/
	getCommCodeList: (sBigCtgCd, sMdlCtgCd) => {
		let commCodeList = [];
		if (!StrLib.isNull(sessionStorage.getItem('gdsCommCode'))) {
			commCodeList = JSON.parse(sessionStorage.getItem('gdsCommCode'));
			if (!StrLib.isNull(sMdlCtgCd)) commCodeList = commCodeList.filter(item => item.LAG_CD === sBigCtgCd && item.MDM_CD === sMdlCtgCd);
			else commCodeList = commCodeList.filter(item => item.LAG_CD === sBigCtgCd);
		}
		return commCodeList;
	},

	/*----------------------------------------------------------------------------------------
	* [?????? ????????? ???????????? ????????? ????????? ???????????? ?????? ??????]
	* @param	:	string strStndCd, string strTargetCol
	* @return	:	string
	* @see		:	1. strStndCd : ????????????
					2. strTargetCol : ?????? ?????? ID ( ??? : 'ETC1_CONT' )
					3. ?????? => ????????? ????????? ????????? ????????? ???????????? ?????? ?????? ??????
						-> ?????? ????????? Value??? return
					   ?????? => '' return
	*--------------------------------------------------------------------------------------*/
	getCentStndVl: (strStndCd, strTargetCol) => {
		var strRtn = "";
		var arrStndVl = ComLib.getSession("gdsCentStndVl");

		if (typeof arrStndVl === "object") {
			for (var idx = 0; idx < arrStndVl.length; idx++) {
				if (arrStndVl[idx].STND_CD === strStndCd) {
					if (arrStndVl[idx].APY_FLAG === "Y") {
						strRtn = arrStndVl[idx][strTargetCol];
					} else {
						if (strTargetCol === 'APY_FLAG') strRtn = "N";
						else strRtn = "";
					}
				}
			}
		}
		return strRtn;
	},

	getInitScreen: () => {
		var rtn = {};
		var iScrnId = ComLib.getCentStndVl('00000', 'STND_VAL');
		if (!StrLib.isNull(iScrnId))
			rtn = (ComLib.getSession("gdsMenu").filter(item => item.MNU_ID === iScrnId))[0];
		return rtn;
	},

	/*----------------------------------------------------------------------------------------
	* [?????? ????????? Dataset??? react state??? Update]
	* @param	:	object obj, string strDatasetId
	* @return	:
	* @see		:	1. obj : setState ?????? ?????? Object (this)
					2. strDatasetId : ?????? ?????? Dataset ID
	*--------------------------------------------------------------------------------------*/
	setStateDs: (obj, strDatasetId, callback) => {
		obj.setState((state) => { return DataLib.setRecordsToDs(state, strDatasetId, state[strDatasetId].records); }, () => {
			if (typeof callback === 'function') callback();
		});

	},
	/*----------------------------------------------------------------------------------------
	* [????????? Dataset Value??? Target Dataset, react state??? Update]
	* @param	:	object obj, string strDatasetId, integer nRowIndex, string strColumnId, string strValue
	* @return	:
	* @see		:	1. obj : setState ?????? ?????? Object (this)
					2. strDatasetId : ?????? ?????? Dataset ID
					3. nRowIndex : ?????? ?????? Row Index
					4. strColumnId : ?????? ?????? Column ID
					5. strValue : ?????? Value
	*--------------------------------------------------------------------------------------*/
	setStateValue: (obj, strDatasetId, nRowIndex, strColumnId, strValue, callback) => {
		obj.setState((state) => { return DataLib.setValueToDs(state, strDatasetId, nRowIndex, strColumnId, strValue); }, () => {
			if (typeof callback === 'function') callback();
		});
	},

	/*----------------------------------------------------------------------------------------
	* [????????? Dataset Records??? Target Dataset, react state??? Update]
	* @param	:	object obj, string strDatasetId, array arrRecords
	* @return	:
	* @see		:	1. obj : setState ?????? ?????? Object (this)
					2. strDatasetId : ?????? ?????? Dataset ID
					3. arrRecords : ?????? ????????? array
	*--------------------------------------------------------------------------------------*/
	setStateRecords: (obj, strDatasetId, arrRecords, callback) => {
		obj.setState((state) => { return DataLib.setRecordsToDs(state, strDatasetId, arrRecords); }, () => {
			if(typeof callback === 'function') callback(obj);
		});
	},

	/*----------------------------------------------------------------------------------------
	* [Dataset Records??? Initialize]
	* @param	:	object obj, string strDatasetId, array arrRecords
	* @return	:
	* @see		:	1. obj : setState ?????? ?????? Object (this)
					2. strDatasetId : ?????? ?????? Dataset ID
					3. arrRecords : ?????? ????????? array
	*--------------------------------------------------------------------------------------*/
	setStateInitRecords: (obj, strDatasetId, arrRecords) => {
		obj.setState((state) => { return DataLib.initRecordsToDs(state, strDatasetId, arrRecords); });
	},

	/*----------------------------------------------------------------------------------------
	* [SelectBox List??? ??????]
	* @param	:	array arrRecords, string args
	* @return	:	array
	* @see		:	1. arrRecords : select inner list data
					2. args : list add flag (all : ?????? / select : ?????? / none)
					3. select inner list array return
	*--------------------------------------------------------------------------------------*/
	convComboList: (arrRecords, args) => {
		var arr = [];
		if (args === newScrmObj.constants.select.argument.all) {
			arr.push({value: "", name: "??????"});
		} else if (args === newScrmObj.constants.select.argument.select) {
			arr.push({value: "", name: "??????"});
		}
		
		for (var index = 0; index < arrRecords.length; index++) {
			arr.push({value: arrRecords[index]["CODE"], name: arrRecords[index]["CODE_NM"]});
		}
		return arr;
	},

	/*----------------------------------------------------------------------------------------
	* [????????? ????????? ???????????? ????????? ????????? ?????? ??????]
	* @param	:	string msgcd, array args
	* @return	:	string
	* @see		:	1. msgcd : ????????? ??????
					2. args : ????????? ?????? Replace value
					3. select inner list array return
	*--------------------------------------------------------------------------------------*/
	getMsgCont: (msgcd, args) => {
		var strMsg = "";
		if (ComLib.getSession("gdsMsgList") !== undefined && ComLib.getSession("gdsMsgList") !== null) {
			var objMsg =  (msgcd) ? ComLib.getSession("gdsMsgList").filter(msg => msg.MSG_CD === msgcd) : ComLib.getSession("gdsMsgList").filter(msg => msg.MSG_CD === 'SYSI0010');
			
			if (objMsg.length === 0) strMsg = "Message not found";
			else strMsg = objMsg[0].MSG_CONT;
			if (typeof args === 'string') {
				args = [args];
			}
			if (args !== undefined && args.hasOwnProperty('length')) {
				for (var idx = 0; idx < args.length; idx++) {
					strMsg = strMsg.replace("{" + idx + "}", args[idx]);
				}
			}
		} else {
			strMsg = args;
		}
		return strMsg;
	},

	setServerInfos: () => {
		console.log("1. setSercerInfos")
		var serverInfos = JSON.parse(localStorage.getItem("infos"));
		if (serverInfos.prod.domain === window.location.hostname) {
			ComLib.setSession("SYSTEM_DV", "P");
			ComLib.setSession("SVR_URL", window.location.protocol + "//" + serverInfos.prod.domain + ":" + serverInfos.prod.domainPort);
		} else if (serverInfos.prod.host === window.location.hostname) {
			ComLib.setSession("SYSTEM_DV", "P");
			ComLib.setSession("SVR_URL", window.location.protocol + "//" + serverInfos.prod.host + ":" + serverInfos.prod.port);

		} else if (serverInfos.dev.host === window.location.hostname) {
			ComLib.setSession("SYSTEM_DV", "D");
			ComLib.setSession("SVR_URL", window.location.protocol + "//" + serverInfos.dev.host + ":" + serverInfos.dev.port);
			document.title = "AI-VA  ::::: [DEV] :::::";

		} else if (serverInfos.localbuild.host === window.location.hostname) {
			ComLib.setSession("SYSTEM_DV", "B");
			ComLib.setSession("SVR_URL", window.location.protocol + "//" + serverInfos.localbuild.host + ":" + serverInfos.localbuild.port);
			document.title = "AI-VA  ::::: [LOCAL] :::::";

		} else {
			ComLib.setSession("SYSTEM_DV", "L");
			ComLib.setSession("SVR_URL", window.location.protocol + "//" + serverInfos.local.host + ":" + serverInfos.local.port);
			document.title = "AI-VA  ::::: [LOCAL] :::::";
		}
	},

	getCentList: (blnBizPsb) => { //BIZ_PSB_YN Filtering
		if (ComLib.isNull(blnBizPsb)) blnBizPsb = false;
		let arrCentList = ComLib.getSession("gdsCentList");
		if (blnBizPsb) arrCentList = arrCentList.filter(item => item.BIZ_PSB_YN === 'Y');
		return arrCentList;
	},
	getTeamList: (objDs, teamType) => { //Filtering ????????? ?????? ??????
		let arrTeamList = ComLib.getSession("gdsTeamList");
		teamType = (StrLib.isNull(teamType)) ? newScrmObj.constants.select.dataType.all : teamType;
		if (!StrLib.isNull(objDs.getValue(0, "CENT_CD"))) {
			if (teamType !== newScrmObj.constants.select.dataType.all) {
				arrTeamList = ComLib.getSession("gdsTeamList").filter(item => item.CENT_CD === objDs.getValue(0, "CENT_CD")).filter(item => item['TP_CD'] === teamType);
			} else {
				arrTeamList = ComLib.getSession("gdsTeamList").filter(item => item.CENT_CD === objDs.getValue(0, "CENT_CD"));
			}
		}
		return arrTeamList;
	},
	getUserList: (objDs, blnActive) => { //Active Filtering
		if (ComLib.isNull(blnActive)) blnActive = true;

		let arrUsrList = ComLib.getSession("gdsUserList");
		if (!StrLib.isNull(objDs.getValue(0, "CENT_CD")))
			arrUsrList = arrUsrList.filter(item => item.CENT_CD === objDs.getValue(0, "CENT_CD"));
		if (!StrLib.isNull(objDs.getValue(0, "TEAM_CD")))
			arrUsrList = arrUsrList.filter(item => item.TEAM_CD === objDs.getValue(0, "TEAM_CD"));
		if (blnActive)
			arrUsrList = arrUsrList.filter(usr => usr.ACT_STA_CD === 'A');

		return arrUsrList;
	},
	getConstList: (objDs, blnActive) => { //Active Filtering
		if (ComLib.isNull(blnActive)) blnActive = true;

		let arrConstList = ComLib.getSession("gdsConstList");
		if (!StrLib.isNull(objDs.getValue(0, "CENT_CD")))
			arrConstList = arrConstList.filter(item => item.CENT_CD === objDs.getValue(0, "CENT_CD"));
		if (!StrLib.isNull(objDs.getValue(0, "TEAM_CD")))
			arrConstList = arrConstList.filter(item => item.TEAM_CD === objDs.getValue(0, "TEAM_CD"));
		if (blnActive)
			arrConstList = arrConstList.filter(usr => usr.USE_FLAG === 'Y');

		return arrConstList;
	},
	getConstListValue: () => {
		let arrConstList = ComLib.getSession("gdsConstList");
		let arrConstListValue = [];
		
		arrConstListValue = arrConstList.map((item) => {
			return item['CODE']
		})

		return arrConstListValue;
	}
};

const StrLib = {
	/*----------------------------------------------------------------------------------------
	* [???????????? null??? ???????????? ?????? ????????? ????????? ????????????]
	* @param	:	string sValue
	* @return	:	boolean
	* @see		:	1. sValue : ????????? ????????? ( ??? : null ?????? undefined ?????? "" ?????? "abc" )
					2. sValue??? undefined, null, NaN, "", Array.length = 0??? ?????? = true, ????????? ?????? false??? return??????.
	*--------------------------------------------------------------------------------------*/
	isNull: (sValue) => {
		sValue = StrLib.getTrim(sValue);
		if (String(sValue).valueOf() === "undefined") return true;
		if (String(sValue).valueOf() === "null") return true;
		if (String(sValue).valueOf() === "") return true;
		if (sValue === null) return true;
		if (sValue === '') return true;
		if ((sValue === "") && (String(sValue.length).valueOf() === "undefined")) return true;
		if (sValue.length === 0) return true;
		return false;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ???????????? ???????????? ?????????]
	* @param	:	String sOrg, String sFind, integer nStart
	* @return	:	integer
	* @see		:	1. sOrg : ?????? ?????????( ??? : "aaBBbbcc" )
					2. sFind : ????????? ?????? ?????????( ??? : "bb" )
					3. nStart : ?????? ???????????? (?????? : Default=0) ( ??? : 1 )
					4. ?????? => ????????? ?????? ???????????? ??????????????? return ( ??? : 4 )
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	 getPos: (sOrg, sFind, nStart) => {
		if (StrLib.isNull(sOrg) || StrLib.isNull(sFind)) { return -1; }
		if (StrLib.isNull(nStart)) { nStart = 0; }
		return sOrg.indexOf(sFind, nStart);
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ???????????? ???????????? ?????????]
	* @param	:	String sOrg, String sFind, integer nStart
	* @return	:	integer
	* @see		:	1. sOrg : ?????? ?????????( ??? : "aaBBbbcc" )
					2. sFind : ????????? ?????? ?????????( ??? : "bb" )
					3. nStart : ?????? ???????????? (?????? : Default=0) ( ??? : 1 )
					4. ?????? => ????????? ?????? ???????????? ??????????????? return ( ??? : 2)
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	getPosCase: (sOrg, sFind, nStart) => {
		if (StrLib.isNull(sOrg) || StrLib.isNull(sFind)) { return -1; }
		if (StrLib.isNull(nStart)) { nStart = 0; }
		return sOrg.toLowerCase().indexOf(sFind.toLowerCase(), nStart);
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ???????????? ???????????? ????????? ?????????]
	* @param	:	String sOrg, String sFind, integer nStart
	* @return	:	integer
	* @see		:	1. sOrg : ?????? ?????????( ??? : "aaBBbbcc" )
					2. sFind : ????????? ?????? ?????????( ??? : "bb" )
					3. nStart : ?????? ???????????? (?????? : Default=???????????? ???) ( ??? : 1 )
					4. ?????? => ????????? ?????? ???????????? ??????????????? return ( ??? : 2)
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	getPosReverse: (sOrg, sFind, nStart) => {
		if (StrLib.isNull(sOrg) || StrLib.isNull(sFind)) { return -1; }
		if (StrLib.isNull(nStart)) { nStart = sOrg.length-1; }

		let pos;
		for (pos = nStart; pos >= 0; pos--) {
			if (sOrg.substr(pos, sFind.length) === sFind) break;
		}

		return pos;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ???????????? ???????????? ????????? ?????????]
	* @param	:	String sOrg, String sFind, integer nStart
	* @return	:	integer
	* @see		:	1. sOrg : ?????? ?????????( ??? : "aaBBbbcc" )
					2. sFind : ????????? ?????? ?????????( ??? : "bb" )
					3. nStart : ?????? ???????????? (?????? : Default=???????????? ???) ( ??? : 1 )
					4. ?????? => ????????? ?????? ???????????? ??????????????? return ( ??? : 4)
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	getPosReverseCase: (sOrg, sFind, nStart) => {
		if (StrLib.isNull(sOrg) || StrLib.isNull(sFind)) { return -1; }
		if (StrLib.isNull(nStart)) { nStart = sOrg.length-1; }

		let pos;
		for (pos = nStart; pos >= 0; pos--) {
			if (sOrg.substr( pos, sFind.length ).toLowerCase() === sFind.toLowerCase()) break;
		}

		return pos;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ???????????? ???????????? ????????????]
	* @param	:	String sOrg, String sRepFrom, string sRepTo
	* @return	:	string
	* @see		: 	1. sOrg : ??????????????? (??? : "aaBBbbccBB" )
					2. sRepFrom : ????????? ????????? ( ??? : "BB" )
					3. sRepTo : ????????? ????????? ( ??? : "xx" )
					4. ?????? => ????????? ????????? ( ??? : "aaxxbbccxx" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getReplace: ( sOrg, sRepFrom, sRepTo ) => {
		if (StrLib.isNull(sOrg)) return "";
		if (StrLib.isNull(sRepFrom)) return "";
		if (StrLib.isNull(sRepTo)) return "";

		let pos, nStart = 0, sRet = "";
		while (1) {
			pos = StrLib.getPos(sOrg, sRepFrom, nStart);
			if (pos < 0) {
				sRet += sOrg.substr(nStart);
				break;
			} else {
				sRet += sOrg.substr(nStart, pos - nStart);
				sRet += sRepTo;
				nStart = pos + sRepFrom.length;
			}
		}
		return sRet;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ???????????? ???????????? ????????????]
	* @param	:	String sOrg, String sRepFrom, string sRepTo
	* @return	:	string
	* @see		: 	1. sOrg : ??????????????? (??? : "aaBBbbccBB" )
					2. sRepFrom : ????????? ????????? ( ??? : "BB" )
					3. sRepTo : ????????? ????????? ( ??? : "xx" )
					4. ?????? => ????????? ????????? ( ??? : "aaxxxxccxx" ) return
					   ?????? => sOrg return
	*--------------------------------------------------------------------------------------*/
	getReplaceCase: ( sOrg, sRepFrom, sRepTo ) => {
		if (StrLib.isNull(sOrg)) return "";
		if (StrLib.isNull(sRepFrom)) return "";
		if (StrLib.isNull(sRepTo)) return "";

		let pos, nStart = 0, sRet = "";
		while (1) {
			pos = StrLib.getPosCase(sOrg, sRepFrom, nStart);
			if (pos < 0) {
				sRet += sOrg.substr(nStart);
				break;
			} else {
				sRet += sOrg.substr(nStart, pos - nStart);
				sRet += sRepTo;
				nStart = pos + sRepFrom.length;
			}
		}
		return sRet;
	},

	/*----------------------------------------------------------------------------------------
	* [????????????(7?????? ??????)?????? ?????? ??????]
	* @param	:	string sRrNo
	* @return	:	string
	* @see		: 	1. sRrNo : ?????????????????? ?????? ????????????
					2. ?????? => 7?????? ?????? ?????? ?????? ?????? : 'M' / ?????? : 'F' return
					   ?????? => '' return
	*--------------------------------------------------------------------------------------*/
	getSexCd: (sRrNo) => {
		let strRno = StrLib.getNumStr(sRrNo);
		if (strRno.length < 7) return '';

		let strSexCd = "";
		if ((parseInt(strRno.substr(6, 1), 10)%2) === 0) strSexCd = "F";
		else strSexCd = "M";

		return strSexCd;
	},

	/*----------------------------------------------------------------------------------------
	* [????????? ????????? ??????]
	* @param	:	string sOrg, integer nTotLen, string sPad
	* @return	:	string
	* @see		: 	1. sOrg : ?????? ????????? ( ??? : "bbccCC" )
					2. nCnt : Pad??? ??? ?????? ( ??? : 7)
					3. sPad : Pad??? ????????? (?????? : Default=" ") ( ??? : "aa" )
					4. ?????? => Pad??? ????????? ( ??? : "abbccCC" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getLPad: (sOrg, nTotLen, sPad) => {
		if (StrLib.isNull(sOrg)) return "";
		if (StrLib.isNull(nTotLen)) return "";
		if (StrLib.isNull(sPad)) sPad = " ";

		let sRet = "";
		let nPadLen = nTotLen - sOrg.length;
		if (nPadLen <= 0) {
			return sOrg;
		} else {
			while (1) {
				if (nPadLen >= sPad.length) {
					sRet += sPad;
					nPadLen -= sPad.length;
				} else {
					if (nPadLen > 0) sRet += sPad.substr(0, nPadLen);
					break;
				}
			}
		}

		return sRet + sOrg;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ??????]
	* @param	:	String sOrg, integer nTotLen, String sPad
	* @return	:	string
	* @see		: 	1. sOrg : ?????? ????????? ( ??? : "bbccCC" )
					2. nTotLen : Pad??? ??? ?????? ( ??? : 7 )
					3. sPad : Pad??? ????????? (?????? : Default=" ")( ??? : "aa" )
					4. ?????? => Pad??? ????????? ( ??? : "bbccCCaa" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getRPad:(sOrg, nTotLen, sPad) => {
		if (StrLib.isNull(sOrg)) return "";
		if (StrLib.isNull(nTotLen)) return "";
		if (StrLib.isNull(sPad)) sPad = " ";

		let sRet = "";
		let nPadLen = nTotLen - sOrg.length;
		if (nPadLen <= 0) {
			return sOrg;
		} else {
			while (1) {
				if (nPadLen >= sPad.length) {
					sRet += sPad;
					nPadLen -= sPad.length;
				} else {
					if (nPadLen > 0) sRet += sPad.substr(0, nPadLen);
					break;
				}
			}
		}

		return sOrg + sRet;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ??????????????? nSize????????? ???????????? ????????????]
	* @param	:	string sOrg, integer nSize
	* @return	:	string
	* @see		: 	1. sOrg : ?????? ?????????( ??? : "aaBBbbcc" )
					2. nSize : ?????????????????? ?????? ( ??? : 2 )
					3. ?????? => ??????????????? nSize????????? ????????? ( ??? : "cc" ) return
					   ?????? => "" return
	* @note		:	sOrg??? ????????? nSize?????? ??????????????? sOrg??? Return??????.
					( ??? : sOrg="a", nSize=2 ===> return = "a" )
	*--------------------------------------------------------------------------------------*/
	getRight: (sOrg, nSize) => {
		if (StrLib.isNull(sOrg) || StrLib.isNull(nSize)) return "";
		if (sOrg.length < nSize) return sOrg;
		else return sOrg.substr(sOrg.length - nSize, nSize);
	},

	/*----------------------------------------------------------------------------------------
	* [?????? Byte ????????? ?????? (?????? : 2Byte / ??????, ??????, ???????????? : 1Byte)]
	* @param	:	String sVal
	* @return	:	integer
	* @see		: 	1. sVal : ???????????? ????????? ( ??? : "a1\n??????" )
					2. ?????? => ?????? ( ??? : 7 ) return
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	getLenB: (sVal) => {
		if (StrLib.isNull(sVal)) return -1;

		let len = 0;
		for (var i = 0; i < sVal.length; i++) {
			if (sVal.charCodeAt(i) > 127) len += 2;
			else len += 1;
		}
		return len;
	},

	/*----------------------------------------------------------------------------------------
	* [?????? Byte ????????? ?????? (?????? : 3Byte / ??????, ??????, ???????????? : 1Byte)]
	* @param	:	String sVal
	* @return	:	integer
	* @see		: 	1. sVal : ???????????? ????????? ( ??? : "a1\n??????" )
					2. ?????? => ?????? ( ??? : 9 ) return
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	getLen3B: (sVal) => {
		if (StrLib.isNull(sVal)) return -1;

		let len = 0;
		for (var i = 0; i < sVal.length; i++) {
			if (sVal.charCodeAt(i) > 127) len += 3;
			else len += 1;
		}
		return len;
	},

	/*----------------------------------------------------------------------------------------
	* [??????????????? ???????????????]
	* @reference:	??????????????? "????????????" ?????? ???????????? ????????????, ????????? ??? ??????????????? ????????? ???????????? ????????????.
					??????????????? ??????, ??????????????? 2????????????.
					?????? ?????? ?????? "3" ???, ?????? "???"??? ????????? ????????? ????????? ????????????.
					????????? ????????? ?????? ?????? ????????????, ???????????? ???????????? ?????????????????????.
					??????, ????????? ????????? ???????????? ????????? ?????? ????????????.
					(??? : ???????????? ===> ????????????
						???????????? ===> 1a )
	* @param	:	string sFull
	* @return	:	string
	* @see		: 	1. sFull : ????????????( ??? : "??????" )
					2. ?????? => ???????????? ( ??? : "0+" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getFull2Half: (sFull) => {
		if (StrLib.isNull(sFull)) return "";

		let sHalf = "";
		for (var i = 0; i < sFull.length; i++) {
			let c = sFull.charCodeAt(i);
			if (c === 12288) sHalf += unescape("%20");
			else if ((c >= 65281) && (c <= 65374)) sHalf += unescape("%"+(c-65248).toString(16));
			else sHalf += sFull.charAt(i);
		}
		return  sHalf;
	},

	/*----------------------------------------------------------------------------------------
	* [??????????????? ???????????????]
	* @param	:	string sHalf
	* @return	:	string
	* @see		: 	1. sHalf : ????????????( ??? : "0+" )
					2. ?????? => ???????????? ( ??? : "??????" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getHalf2Full: (sHalf) => {
		if (StrLib.isNull(sHalf)) return "";

		let rTmp = "";
		let iTmp = "";
		for (var i = 0; i < sHalf.length; i++ ) {
			//?????? ????????? ?????? ?????? ????????? ??????(??????)??? ????????? ????????? ?????? ??????.
			if ((sHalf.charCodeAt(i) >= 32) && (sHalf.charCodeAt(i) <= 126)) {
				if (sHalf.charCodeAt(i) === 32) iTmp = unescape("%u"+(12288).toString(16));
				else iTmp = sHalf.charCodeAt(i) + 65248;
			} else {
				iTmp = sHalf.charCodeAt(i);
			}

			if (sHalf.charCodeAt(i) === 32) rTmp = rTmp + (iTmp);
			else rTmp += String.fromCharCode(iTmp);
		}

		return rTmp;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ??????????????? ????????? ?????? ??????]
	* @param	:	String sNum
	* @return	:	boolean
	* @see		: 	1. sNum : ????????? ??????????????? ( ??? : "-1234.56" ) (???, ","??? ??????????????? ??? ???)
					2. ??????????????? ???????????? => true return
					   ??????????????? ???????????? ?????? => false return
	*--------------------------------------------------------------------------------------*/
	isNum: (sNum) => {
		if (StrLib.isNull(sNum)) return false;

		let point_cnt = 0;
		let ret = true;
		for (var i = 0; i < sNum.length; i++) {
			var c = sNum.charAt(i);
			if (i === 0 && (c === "+" || c === "-"));
			else if (c >= "0" && c <= "9");
			else if (c === ".") {
				point_cnt++;
				if (point_cnt > 1) {
					ret = false;
					break;
				}
			} else {
				ret = false;
				break;
			}
		}
		return ret;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ?????????(a~z, A~Z)????????? ???????????? ????????? ??????]
	* @param	:	string sVal
	* @return	:	boolean
	* @see		: 	1. sVal : ????????? ????????? ( ??? : "aAzZ" )
					2. ???????????? ???????????? = true return,
					   ???????????? ?????? ????????? ???????????? ?????? ?????? = false return
	*--------------------------------------------------------------------------------------*/
	isAlpha: (sVal) => {
		if (StrLib.isNull(sVal)) return false;
		if (sVal.search("[^A-Za-z]") >= 0) return false;
		else return true;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ?????????(a~z, A~Z), ??????????????? ???????????? ????????? ??????]
	* @param	:	string sVal
	* @return	:	boolean
	* @see		: 	1. sVal : ????????? ????????? ( ??? : "aAzZ09" )
					2. ?????????, ????????? ???????????? = true return,
					   ?????????, ????????? ?????? ????????? ???????????? ?????? ?????? = false return
	*--------------------------------------------------------------------------------------*/
	isAlNum: (sVal) => {
		if (StrLib.isNull(sVal)) return false;
		if (sVal.search("[^A-Za-z0-9]") >= 0) return false;
		else return true;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ???????????? ???????????? ????????? ??????]
	* @param	: String sVal
	* @return	: boolean
	* @see		: 	1. sVal : ????????? ????????? ( ??? : "?????????" )
					2. ????????? ???????????? = true return,
					????????? ?????? ????????? ???????????? ?????? ?????? = false return
	*--------------------------------------------------------------------------------------*/
	isKor: (sVal) => {
		if (StrLib.isNull(sVal)) return false;
		for (var i = 0; i < sVal.length; i++ ) {
			if (!((sVal.charCodeAt(i) > 0x3130 && sVal.charCodeAt(i) < 0x318F) || (sVal.charCodeAt(i) >= 0xAC00 && sVal.charCodeAt(i) <= 0xD7A3))) return false;
		}
		return true;
	},

	/*----------------------------------------------------------------------------------------
	* [????????? Trim ??????]
	* @param	:	string args
	* @return	:	string
	* @see		:   1. args : trim ??? ???
					2. ?????? => trim String return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getTrim: (arg) => {
		var str = new String(arg);
		if (str === null || str === "null") return "";
		if (new String(str).valueOf() === "undefined") return "";
		if (new String(str) === null) return "";
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},

	/*----------------------------------------------------------------------------------------
	* [??????????????? ????????? ????????????.]
	* @param	:	string sValue
	* @return	:	string
	* @see		:   1. sValue : ???????????? ( ??? : '2020-09-02' )
					2. ?????? => '20200902' return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getNumStr: (sValue) => {
		if (StrLib.getTrim(sValue) === "") return "";
		sValue = StrLib.getTrim(sValue);

		var sResult = "";
		var sNum = "0123456789";
		for (var i = 0; i<sValue.length; i++) {
			if (sNum.indexOf(sValue.charAt(i)) > -1) sResult += sValue.charAt(i);
		}
		return sResult;
	},

	/*----------------------------------------------------------------------------------------
	* [????????? ","??? ????????????]
	* @param	:	string sNum
	* @return	:	string
	* @see		: 	1. sNum : ?????? ????????? ????????? ( ??? : '-1234567.89' )
					2. ?????? => ","??? ????????? ????????? ( ??? : -1,234,567.89 ) return,
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	setComma: (sNum) => {
		if (StrLib.isNull(sNum)) return "";
		if (!StrLib.isNum(sNum)) return "";

		var nEnd, nStart = 0, sRet = "";
		sNum = StrLib.getTrim(sNum);

		if (sNum.charAt(0) === "+" || sNum.charAt(0) === "-") {
			sRet += sNum.charAt(0);
			nStart = 1;
		}

		var ppos = StrLib.getPos(sNum, ".", nStart);
		if (ppos < 0) nEnd = sNum.length;
		else nEnd = ppos;

		var sDigit = sNum.substr(nStart, nEnd-nStart);
		for (var pos = 0; pos < sDigit.length; pos ++ ) {
			if ( pos !== 0 && (sDigit.length-pos)%3 === 0) sRet += ",";
			sRet += sDigit.charAt(pos);
		}

		sRet += sNum.substr(nEnd);
		return sRet;
	},
	/*----------------------------------------------------------------------------------------
	* [Array??? ?????? ????????? Distinct(????????????)??????]
	* @param	:	array aOrg
	* @return	:	array
	* @see		: 	1. aOrg : ????????? ????????? ?????? Array ( ??? : (1,1,2,2,3,4,5) )
					2. ?????? => ????????? ????????? Array ( ??? : (1,2,3,4,5) ) return,
					   ?????? => ??? Array return
	*--------------------------------------------------------------------------------------*/
	getDistinct: (aOrg) => {
		var aDist = new Array();
		if (StrLib.isNull(aOrg)) return aDist;

		for (var i = 0; i < aOrg.length; i++) {
			var vDist = aOrg[i];
			var flag = false;
			for (var j = 0; j < aDist.length; j++) {
				if ("x" + aDist[j] === "x" + vDist) {
					flag = true;
					break;
				}
			}
			if (flag === false) aDist[aDist.length] = vDist;
		}
		return aDist;
	},
	/*----------------------------------------------------------------------------------------
	* [????????????  String ???????????? Date Format?????? ????????????.]
	* @param	:	String
	* @return	:	String
	* @see		: 	1. date : YYYYMMDD or YYYYMMDDHHMISS (8?????? ?????? 14????????? ??????)
					2. str : '-' or '/' (default : '-')
					2. ?????? => ?????? ???????????? ???????????? ??????(YYYY-MM-DD or YYYY/MM/DD)
					   ?????? => ????????? return
	*--------------------------------------------------------------------------------------*/
	setFormatData : (date, str) => {
		let rtnVal = date;
		let delim = (StrLib.isNull(str)) ? '-' : str;
		if (date.length === 8 ||  date.length === 14) {
			if (date.length >= 8) {
				rtnVal = date.substring(0,4) + delim + date.substring(4,6) + delim + date.substring(6,8);
				if (date.length === 14) {
					rtnVal = rtnVal + ' ' + date.substring(8,10) + ':' + date.substring(10,12) +  ':' + date.substring(12,14);
				}
			}
		}
		return rtnVal;
	}	
};

const FileLib = {
	/*----------------------------------------------------------------------------------------
	* [File Path ?????????(??? : C:\a\b\filename.ext)?????? File???(??? : filename)??? ??????]
	* @param	: string sPath, boolean bExt
	* @return	: string
	* @see		: 	1. sPath   - File Path ????????? (??? : "C:\a\b\filename.ext")
					2. bExt    - extend??? return?????? File?????? ??????????????? ?????? ( ?????? : Default=false )
								- true 	: extend??? File?????? ????????????
								- false : extend??? File?????? ??????????????? ??????
					2. ?????? =
							- bExt = true??? ?????? ===> sPath?????? File???(??? : "filename.ext") return
							- bExt = false??? ?????? ===> sPath?????? File???(??? : "filename") return
					?????? = "" return

	getFileName : ( sPath, bExt ) => {
		let start_pos, end_pos, tmp_pos, filename;

		if( StrLib.isNull(sPath) )		return "";
		if( StrLib.isNull(bExt) )
			bExt = false;

		start_pos = Math.max(StrLib.getPosReverse( sPath, "\\" ), StrLib.getPosReverse( sPath, "/" ));
		tmp_pos = StrLib.getPosReverse( sPath, "::");
		if( tmp_pos > 0 ) tmp_pos++;
		start_pos = Math.max( start_pos, tmp_pos );
		if( bExt === false ) {
			end_pos = StrLib.getPosReverse( sPath, "." );
			if( end_pos < 0 )
				end_pos = sPath.length;
			filename = sPath.substr( start_pos+1, end_pos-start_pos-1 );
		} else {
			filename = sPath.substr( start_pos+1 );
		}

		return filename;
	}
	*--------------------------------------------------------------------------------------*/
};
const ExcelLib = {
	exportToExcel : (header, data, rtn, grdId) => {
		if (rtn) {
			let fileName = "[" + DateLib.getTodayTime() + "]_" + grdId + '_excel.xls';
			let excelComponent = document.createElement('a');
			excelComponent.setAttribute('id', '_aExcelExport');
			excelComponent.setAttribute('download', fileName);
			excelComponent.setAttribute('style', "display:none");
			excelComponent.setAttribute('href', "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + ExcelLib.base64(ExcelLib.export(ExcelLib.convertDataStructureToTable(header, data))));
			// excelComponent.setAttribute('href', "data:application/vnd.ms-excel;base64," + ExcelLib.base64(ExcelLib.export(ExcelLib.convertDataStructureToTable(header, data))));
			
			document.getElementById('root').appendChild(excelComponent);
			document.getElementById('_aExcelExport').click();
			document.getElementById('root').removeChild(document.getElementById('_aExcelExport'));
		}
	},
	getHeaderDepth : (header) => {
		let cnt = 1;
		let maxCnt = 1

		for (let intA = 0; intA < header.length; intA ++) {
			if (header[intA].hasOwnProperty('children')) {
				cnt += ExcelLib.getHeaderDepth(header[intA]['children']);
				if (maxCnt < cnt) {
					maxCnt = cnt;
				}
			}
		}
		return maxCnt;
	},
	getMaxDepth : (header) => {
		let maxDepth = 0;
		let depthArr = header.map(item => {return 1;});
		for (let intA = 0; intA < header.length; intA ++) {
			if (header[intA].hasOwnProperty('children')) {
				depthArr[intA] += ExcelLib.getMaxDepth(header[intA]['children']);
			}
		}
		maxDepth = depthArr.reduce( function (previous, current) {  return previous > current ? previous:current; });
		return maxDepth;
	},
	setHeader : (header) => {
		let getMaxDepth = ExcelLib.getMaxDepth(header);
		let result = "";
		for (let intA = 0; intA < getMaxDepth; intA ++) {
			result += "<tr>";
			for (let intB = 0; intB < header.length; intB ++) {
				if (!header[intB]['hide'] && !StrLib.isNull(header[intB]['headerName']) && header[intB]['cellRenderer'] !== 'actionButton'){
					result += "<th style= text-align: 'center'; ";
					if (header[intB].hasOwnProperty('children')) {
						result += "colspan='" + header[intB]['children'].length + "';";
					} else {
						result += "rowspan='" + getMaxDepth + "';";
					}
					result += ">";
					result += header[intB]['headerName'].replace(/\*/g,'');
					result += "</th>";
				}
			}
			result += "</tr>";
			if (header.filter(item => item.hasOwnProperty('children')).length > 0) {
				let headerArr = [];
				header.filter(item => item.hasOwnProperty('children')).forEach((item) => {
					item['children'].forEach((children) => {
						headerArr.push(children);
					});
				});
				result += ExcelLib.setHeader(headerArr);
			}
			return result;
		}
	},
	setHeaderforBody : (header) => {
		let bodyHeader = [];
		function setColumn (data, rtnArr) {
			for (let intA = 0; intA < data.length; intA ++) {
				if (!data[intA].hasOwnProperty('children')) {
					let json = JSON.parse(JSON.stringify(data[intA]));
					json['valueFormatter'] = data[intA]['valueFormatter'];
					bodyHeader.push(json);
					json = null;
				} else {
					setColumn(data[intA]['children'], rtnArr);
				}
			}
		}
		setColumn(header, bodyHeader);
		return bodyHeader;
	},
	convertDataStructureToTable : (header, data) => {
		let result;

		try {
			result = "<table>";
			result += "<thead>";
			result += ExcelLib.setHeader(header);
			result += "</thead>";
			result += "<tbody>";

			let rowNum = 1;
			let bodyHeader = ExcelLib.setHeaderforBody(header);
			data.forEach(item => {
				result += "<tr>";
				bodyHeader.forEach(head => {
					if (!head['hide'] && !StrLib.isNull(head['headerName']) && head['cellRenderer'] !== 'actionButton') {
						if (head['field'] === '_No') {
							result += "<td style= 'text-align: center;'>";
							result += rowNum;
							result += "</td>";
						}
						if (item.hasOwnProperty(head['field'])) {
							// ????????? ??? ????????? null??? ???????????? ??????
							if (item[head['field']] === null ) { item[head['field']] = ''; }
							if (head['width'] !== undefined && head['width'] !== null && head['width'] !== '') {
								result += "<td style= 'mso-number-format: \\@; width: " + head['width'] + "px;";
								if (head['textAlign'] !== undefined && head['textAlign'] !== null && head['textAlign'] !== ''){
									result += "text-align: " + head['textAlign'] + ";";
								}
							} else {
								if (head['textAlign'] !== undefined && head['textAlign'] !== null && head['textAlign'] !== ''){
									result += "<td style= 'mso-number-format: \\@; text-align: " + head['textAlign'] + ";";
								} else {
									result += "<td style= 'mso-number-format: \\@;";
								}
							}
							result += "'>";
							if (typeof head['valueFormatter'] === 'function') {
								result += head['valueFormatter']({ 
											data : item
										,	value : item[head['field']]
										,	node : item['node']
								});
							} else {
								result += item[head['field']];
							}
							result += "</td>";
						}
					}
				});
				rowNum += 1;
				result += "</tr>";
			});
			result += "</tbody>";
			result += "</table>";
			return result;
		} finally {
			result = null;
		}
	},
	export : (htmltable) => {
		try {
			var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
			excelFile += "<head>";
			excelFile += '<meta http-equiv="Content-type" content="text/html;charset=utf-8" />';
			excelFile += "<!--[if gte mso 9]>";
			excelFile += "<xml>";
			excelFile += "<x:ExcelWorkbook>";
			excelFile += "<x:ExcelWorksheets>";
			excelFile += "<x:ExcelWorksheet>";
			excelFile += "<x:Name>";
			excelFile += "{worksheet}";
			excelFile += "</x:Name>";
			excelFile += "<x:WorksheetOptions>";
			excelFile += "<x:DisplayGridlines/>";
			excelFile += "</x:WorksheetOptions>";
			excelFile += "</x:ExcelWorksheet>";
			excelFile += "</x:ExcelWorksheets>";
			excelFile += "</x:ExcelWorkbook>";
			excelFile += "</xml>";
			excelFile += "<![endif]-->";
			excelFile += "</head>";
			excelFile += "<body>";
			excelFile += htmltable.replace(/"/g, '\'');
			excelFile += "</body>";
			excelFile += "</html>";

			var ctx = { worksheet: 'My Worksheet', table: htmltable };
			var rtn = (ExcelLib.format(excelFile, ctx));
			return  rtn;
		} finally {
			rtn = null;
		}
	},
	format : (s, c) => {
		return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; });
	},
	base64 : (s) => {
		return window.btoa(unescape(encodeURIComponent(s)));
	}
};
const DateLib = {
	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ????????? ????????? ?????????]
	* @param	:	string sDate
	* @return	:	integer
	* @see		: 	1. sDate : yyyyMMdd????????? ?????? ( ??? : "20121122" )
					2. ?????? => ????????? ?????? ????????? ( ??? : 30 ) return
					   ?????? => -1 return
	*--------------------------------------------------------------------------------------*/
	getLastDateNum: (sDate) => {
		if (typeof sDate !== "string") sDate = new String(sDate);
		let nMonth, nLastDate;

		if (StrLib.isNull(sDate)) return -1;

		nMonth = parseInt(sDate.substr(4,2), 10);
		if (nMonth === 1 || nMonth === 3 || nMonth === 5 || nMonth === 7  || nMonth === 8 || nMonth === 10 || nMonth === 12 ) {
			nLastDate = 31;
		} else if (nMonth === 2) {
			if ( DateLib.isLeapYear(sDate) === true ) nLastDate = 29;
			else nLastDate = 28;
		} else {
			nLastDate = 30;
		}
		return nLastDate;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ??????]
	* @param	:	string sDate
	* @return	:	boolean
	* @see		: 	1. sDate : yyyyMMdd????????? ?????? ( ??? : "20121122" )
					2. sDate??? ????????? ??????			=> true return
					   sDate??? ????????? ?????? ??????		=> false return
					   sDate??? ???????????? ?????? ??????	=> false return
	*--------------------------------------------------------------------------------------*/
	isLeapYear: (sDate) => {
		if (typeof sDate !== "string") sDate = new String(sDate);
		let ret, nY;

		if (StrLib.isNull(sDate)) return false;

		nY = parseInt(sDate.substring(0,4), 10);
		if ((nY % 4) === 0) {
			if ((nY % 100) !== 0 || (nY % 400) === 0) ret = true;
			else ret = false;
		} else {
			ret = false;
		}
		return ret;
	},

	/*----------------------------------------------------------------------------------------
	* [???????????? ????????? ????????? yyyyMMdd????????? ?????????]
	* @param	:	string sDate
	* @return	:	string
	* @see		: 	1. sDate : yyyyMMdd????????? ?????? ( ??? : "20121122" )
					2. ?????? => yyyyMMdd????????? ????????? ?????? ( ??? : "20121130" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getLastDate: (sDate) => {
		if (typeof sDate !== "string") sDate = new String(sDate);
		if (StrLib.isNull(sDate)) return "";
		let nLastDate = DateLib.getLastDateNum(sDate);
		return sDate.substr(0,6) + nLastDate.toString();
	},

	/*----------------------------------------------------------------------------------------
	* [????????? ????????? nOffset ?????? ????????? ????????? ?????? ????????????]
	* @param	:	string sDate, integer nOffset
	* @return	:	string
	* @see		: 	1. sDate : ?????? ( ??? : "20121122" )
					2. nOffset : ??? ????????? ( ??? : 10 ?????? -10 )
					3. ?????? => yyyyMMdd????????? ????????? ?????? ( ??? : "20121202" ?????? "20121112" ) return
					   ?????? => "" return
	*--------------------------------------------------------------------------------------*/
	getAddDate: (sDate, nOffset) => {
		if (typeof sDate !== "string") sDate = new String(sDate);

		if (StrLib.isNull(sDate) || StrLib.isNull(nOffset)) return "";

		let nYear	= parseInt(sDate.substr(0, 4));
		let nMonth	= parseInt(sDate.substr(4, 2));
		let nDate	= parseInt(sDate.substr(6, 2)) + nOffset;

		let objDate = new Date(nYear, nMonth - 1, nDate);

		let sYear	= objDate.getFullYear().toString();
		let sMonth	= StrLib.getRight("0" + (objDate.getMonth() + 1), 2);
		let sDay	= StrLib.getRight("0", objDate.getDate(), 2);

		return sYear + sMonth + sDay;
	},

	/*----------------------------------------------------------------------------------------
	* [????????? ????????? nOffset ?????? ????????? ????????? ?????? ????????????]
	* @param	:	string sDate, integer nOffset
	* @return	:	string
	* @see		: 	1. sDate : ?????? ( ??? : "20121122" )
					2. nOffset : ??? ????????? ( ??? : 1 ?????? -1 )
					3. ?????? => yyyyMMdd????????? ????????? ?????? ( ??? : "20121202" ?????? "20121022" ) return
					   ?????? => "" return
	* @note  	:	???, ????????? ????????? ????????? ????????? ?????? ????????? ??? ?????? ????????? ????????? ????????? return??????.
					?????? ??????, sDate="20120531", nOffset=-1??? ?????? return="20120430" ??? ??????.
	*--------------------------------------------------------------------------------------*/
	getAddMonth: (sDate, nOffset) => {
		if (typeof sDate !== "string") sDate = new String(sDate);

		if (StrLib.isNull(sDate) || StrLib.isNull(nOffset)) return "";
		sDate = StrLib.getTrim(sDate);

		let nYear 	= parseInt(sDate.substr(0, 4));
		let nMonth 	= parseInt(sDate.substr(4, 2)) + nOffset;
		let nDate 	= parseInt(sDate.substr(6, 2));

		let nLastDate, sRet;
		let objDate = new Date(nYear, nMonth, nDate);

		let sYear	= objDate.getFullYear().toString();
		let sMonth	= StrLib.getLPad(objDate.getMonth().toString(), 2, '0');
		let sDay	= StrLib.getLPad(objDate.getDate().toString(), 2, '0');
		if (sMonth === '00') {
			sYear = (parseInt(sYear) - 1).toString();
			sMonth = '12';
		}
		sRet = sYear + sMonth + sDay;

		let nsDate 	= parseInt(sRet.substr(6, 2));
		nLastDate = DateLib.getLastDateNum(sRet);
		sRet = sRet.substr(0,6);

		if (nsDate > nLastDate) sRet += nLastDate.toString();
		else sRet += (StrLib.getRight("0" + nsDate, 2)).toString();

		return sRet;
	},

	/*----------------------------------------------------------------------------------------
	* [?????? PC??? ?????? ????????? ????????????]
	* @param	:
	* @return	:	string
	* @see		: 	1. ?????? => yyyyMMdd????????? ?????? ?????? ( ??? : "20121122" ) return
					   ?????? => ??????
	*--------------------------------------------------------------------------------------*/
	getToday: () => {
		let objDate = new Date();
		let sToday  = objDate.getFullYear().toString();
		sToday += StrLib.getRight("0" + (objDate.getMonth() + 1), 2);
		sToday += StrLib.getRight("0" + objDate.getDate(), 2);

		return sToday;
	},

	/*----------------------------------------------------------------------------------------
	* [?????? PC??? ?????? ?????? + ????????? ????????????]
	* @param	:
	* @return	:	string
	* @see		: 	1. ?????? => yyyyMMddhhmiss????????? ?????? ?????? ( ??? : "20121122223010" ) return
					   ?????? => ??????
	*--------------------------------------------------------------------------------------*/
	getTodayTime: () => {
		let objDate = new Date();
		let sToday  = objDate.getFullYear().toString();
		sToday += StrLib.getRight("0" + (objDate.getMonth() + 1), 2);
		sToday += StrLib.getRight("0" + objDate.getDate(), 2);
		sToday += StrLib.getRight("0" + objDate.getHours(), 2);
		sToday += StrLib.getRight("0" + objDate.getMinutes(), 2);
		sToday += StrLib.getRight("0" + objDate.getSeconds(), 2);

		return sToday;
	},

	/*----------------------------------------------------------------------------------------
	* [??? ???????????? ?????? ?????? ??????]
	* @param	: 	tring sStartDate, string sEndDate
	* @return	:	integer
	* @see		: 	1. sStartDate : yyyyMMdd????????? From ?????? ( ??? : "20121122" )
					2. sEndDate   : yyyyMMdd????????? To ?????? ( ??? : "20121202" )
					3. ?????? => ?????? ????????? ????????????  ( ??? : 10 )  return
						* ???, sEndDate < sStartDate?????? ????????? return??????
					   ?????? => return NaN
	*--------------------------------------------------------------------------------------*/
	getDiffDate: (sStartDate, sEndDate) => {
		sStartDate	= StrLib.getTrim(sStartDate);
		sEndDate	= StrLib.getTrim(sEndDate);
		if (StrLib.isNull(sStartDate) || StrLib.isNull(sEndDate)) return NaN;

		let vFromDate = new Date(parseInt(sEndDate.substring(0,4),  10), parseInt(sEndDate.substring(4,6)-1,  10), parseInt(sEndDate.substring(6,8), 10));
		let vToDate = new Date(parseInt(sStartDate.substring(0,4),  10), parseInt(sStartDate.substring(4,6)-1,  10), parseInt(sStartDate.substring(6,8), 10));

		return parseInt((vFromDate - vToDate) / (1000 * 60 * 60 * 24));
	},

	/*----------------------------------------------------------------------------------------
	* [??? ????????? ?????? ?????? ??????]
	* @param	:	string sStartDate, string sEndDate
	* @return	:	integer
	* @see		: 	1. sStartDate : yyyyMMdd????????? From ?????? ( ??? : "20121122" )
					2. sEndDate   : yyyyMMdd????????? To ?????? ( ??? : "20131202" )
					3. ?????? => ?????? ????????? ????????????  ( ??? : 10 ) return
						* ???, sEndDate < sStartDate?????? ????????? return??????.
					   ?????? => NaN return
	* @note		:	???, sStartDate, sEndDate??? ?????? ???????????? ?????? ????????????
	*--------------------------------------------------------------------------------------*/
	getDiffMonth: (sStartDate, sEndDate) => {
		let nStartMon, nEndMon;
		sStartDate	= StrLib.getTrim(sStartDate);
		sEndDate	= StrLib.getTrim(sEndDate);
		if (StrLib.isNull(sStartDate) || StrLib.isNull(sEndDate)) return NaN;

		nStartMon = parseInt(sStartDate.substr(0, 4), 10) * 12 + parseInt(sStartDate.substr(4, 2), 10);
		nEndMon = parseInt(sEndDate.substr(0, 4), 10) * 12 + parseInt(sEndDate.substr(4, 2), 10);

		return (nEndMon - nStartMon);
	},

	/*----------------------------------------------------------------------------------------
	* [date => string]
	* @param	:	date objDate
	* @return	:	string
	* @see		:	1. objDate : Date Object
					2. ?????? => yyyyMMdd ????????? ?????? ????????? return
					   ?????? => '' return
	*--------------------------------------------------------------------------------------*/
	getStringDate: (objDate) => {
		if (StrLib.isNull(objDate)) return '';

		let year = objDate.getFullYear();
		let month = StrLib.getLPad((1 + objDate.getMonth()).toString(), 2, '0');
		let day = StrLib.getLPad((objDate.getDate()).toString(), 2, '0');

		return year + month + day;
	},

	/*----------------------------------------------------------------------------------------
	* [string => date]
	* @param	:	string sDate
	* @return	:	date
	* @see		:	1. sDate : yyyyMMdd ????????? ?????? ?????????
					2. ?????? => Date Object ????????? return
					   ?????? => '' return
	*--------------------------------------------------------------------------------------*/
	getDateYymmdd: (sDate) => {
		if (StrLib.isNull(sDate)) return '';
		if (sDate.length === 8) return new Date(parseInt(sDate.substring(0, 4)), parseInt(sDate.substring(4, 6)) - 1, parseInt(sDate.substring(6, 8)));
		else return '';
	},
};

const DataLib = {
	/*----------------------------------------------------------------------------------------
	* [????????? Value??? Dataset Objec ??? react state??? Update]
	* @param	:	state prevState, string strDatasetId, integer nRowIndex, string, strColumnId, string strValue
	* @return	:	object
	* @see		:	1. prevState : React Class??? ?????? ??? state
					2. strDatasetId : Update ?????? Dataset Id ????????? (state??? Dataset Key) ( ??? : 'dsLogin')
					3. nRowIndex : ?????? Value??? Target Row Index
					4. strColumnId : ?????? Value??? Target Column ID ( ??? : 'USR_ID')
					5. strValue : ?????? Value
					2. ?????? => ?????? Value??? ?????? ??? Dataset Object ????????? return
					   ?????? => ??????
	*--------------------------------------------------------------------------------------*/
	setValueToDs: (prevState, strDatasetId, nRowIndex, strColumnId, strValue) => {
		let objDs = prevState[strDatasetId];
		objDs.setValue(nRowIndex, strColumnId, strValue);
		return {[strDatasetId]: objDs};
	},

	/*----------------------------------------------------------------------------------------
	* [????????? Record??? Dataset Object ??? react state??? Update]
	* @param	:	state prevState, string strDatasetId, array arrRecords
	* @return	:	object
	* @see		:	1. prevState : React Class??? ?????? ??? state
					2. strDatasetId : Update ?????? Dataset Id ????????? (state??? Dataset Key) ( ??? : 'dsLogin' )
					3. arrRecords : ????????? Records (????????? ?????????) ( ??? : ?????? ?????? ?????? ????????? )
					2. ?????? => ?????? Value??? ?????? ??? Dataset Object ????????? return
					   ?????? => ??????
	*--------------------------------------------------------------------------------------*/
	setRecordsToDs: (prevState, strDatasetId, arrRecords) => {
		let objDs = prevState[strDatasetId];
		objDs.setRecords(arrRecords);
		return {[strDatasetId]: objDs};
	},
	/*----------------------------------------------------------------------------------------
	* [Dataset Record??? Initialize]
	* @param	:	state prevState, string strDatasetId, array arrRecords
	* @return	:	object
	* @see		:	1. prevState : React Class??? ?????? ??? state
					2. strDatasetId : Update ?????? Dataset Id ????????? (state??? Dataset Key) ( ??? : 'dsLogin' )
					3. arrRecords : ????????? Records (????????? ?????????) ( ??? : ?????? ?????? ?????? ????????? )
					2. ?????? => ?????? Value??? ?????? ??? Dataset Object ????????? return
					   ?????? => ??????
	*--------------------------------------------------------------------------------------*/
	initRecordsToDs: (prevState, strDatasetId, arrRecords) => {
		let objDs = prevState[strDatasetId];
		objDs.initRecords(arrRecords);
		return {[strDatasetId]: objDs};
	},
	datalist: {
		records: [],
		orgrecords: [],
		header: {},
		size: function() {return this.records.length;},
		getRecords: function() {
			return JSON.parse(JSON.stringify(this.records));
		},
		getTransRecords: function(strRowType) {
			var arrRecords = JSON.parse(JSON.stringify(this.records));
			var arrOrgRecs = this.orgrecords;

			if (strRowType !== null && (strRowType === newScrmObj.constants.rowtype.CREATE_OR_UPDATE)) arrRecords = arrRecords.filter(item => item.rowtype === 'c' || item.rowtype === 'u');
			else if (strRowType !== null && strRowType === newScrmObj.constants.rowtype.DESTROY) arrRecords = arrRecords.filter(item => item.rowtype === 'd');

			for (var idxA = 0; idxA < arrRecords.length; idxA++) {
				for (var idxB = 0; idxB < arrOrgRecs.length; idxB++) {
					if (arrRecords[idxA].recid === arrOrgRecs[idxB].recid) arrRecords[idxA].orgdata = arrOrgRecs[idxB];
				}
			}
			return arrRecords;
		},
		setRecords: function(records) {
			this.records = records;
		},
		appendRecords: function(records) {
			this.records = this.records.concat(records);
			this.orgrecords = this.orgrecords.concat(JSON.parse(JSON.stringify(records)));
		},
		initRecords: function(records) {
			records = records || {};
			if (records.length !== undefined) {
				this.initialize(records);
				this.records = records;
				this.orgrecords = JSON.parse(JSON.stringify(records));
			}
		},
		getValue: function(index, column) {return this.records[index][column];},
		setValue: function(index, column, value) {
			var blnModified = false;
			this.records[index][column] = value;
			if (this.records[index].rowtype !== 'c' && this.records[index].rowtype !== 'd') {
				var recid = this.records[index].recid;
				var arrCol = Object.keys(this.header);
				for (var idxA = 0; idxA < this.orgrecords.length; idxA++) {
					if (this.orgrecords[idxA].recid === recid) {
						for (var idxB = 0; idxB < arrCol.length; idxB++) {
							if (this.records[index][arrCol[idxB]] !== this.orgrecords[idxA][arrCol[idxB]]) {
								blnModified = true;
								break;
							}
						}
					}
				}
				if (blnModified) this.records[index].rowtype = 'u';
				else this.records[index].rowtype = 'r';
			}
		},
		getValueByRecId: function(recid, column) {return this.records[this.indexOf("recid", recid)][column];},
		setValueByRecId: function(recid, column, value) {
			var index = this.indexOf("recid", recid);
			this.records[index][column] = value;
			if (this.records[index].rowtype !== 'c' && this.records[index].rowtype !== 'd') {
				for (var idx = 0; idx < this.orgrecords.length; idx++) {
					if (this.orgrecords[idx].recid === recid) {
						if (this.orgrecords[idx][column] === value) this.records[index].rowtype = "r";
						else if (this.orgrecords[idx][column] !== value) this.records[index].rowtype = "u";
					}
				}
			}
		},
		addRow: function(index) {
			if (typeof index === 'number') {
				this.records.splice(index, 0, JSON.parse(JSON.stringify(this.header)));
				this.records[index]['rowtype'] = 'c';
				return index;
			} else {
				this.records.push(JSON.parse(JSON.stringify(this.header)));
				this.records[this.size()-1]['rowtype'] = 'c';
				return this.size() - 1;
			}
		},
		getRow: function(index) {
			if (this.records.length > 0) return JSON.parse(JSON.stringify([this.records[index]]));
			else return [];
		},
		indexOf: function(column, value) {
			var index = -1;
			for (var i = 0; i < this.records.length; i++) {
				if (this.records[i][column] === value) {
					index = i;
					break;
				}
			}
			return index;
		},
		lastIndexOf: function(column, value) {
			var index = -1;
			for (var i = this.records.length; i >=0; i--) {
				if (this.records[i][column] === value) {
					index = i;
					break;
				}
			}
			return index;
		},
		find: function(column, value) {
			return this.records.filter((new Function(`return obj => obj.${column}=='${value}'`))());
		},
		findFirst: function(column, value) {
			return this.getRow(this.indexOf(column, value));
		},
		findLast: function(column, value) {
			return this.getRow(this.lastIndexOf(column, value));
		},
		filter: function(filterexpr) {
			return this.records.filter((new Function(`return ds => ${filterexpr}`))());
		},
		lookup: function(column, value, target) {
			var record = this.findFirst(column, value);
			return record === undefined ? undefined : record[target];
		},
		isUpdated: function() {
			if (this.records.filter(obj => obj.rowtype !== 'r').length > 0) return true;
			else return false;
		},
		initialize: function(records) {
			for (var idx = 0; idx < records.length; idx++) {
				if (!records[idx].hasOwnProperty("recid")) records[idx].recid = idx + 1;
				if (!records[idx].hasOwnProperty("rowtype")) records[idx].rowtype = 'r';
			}
			if (records.length > 0) {
				var arrCol = Object.keys(records[0]);
				for (var idx = 0; idx < arrCol.length; idx++) {
					this.header[arrCol[idx]] = "";
				}
			} else {
				this.header = {};
			}
		},
		getInstance: function(props) {
			props = props || {};
			if (props.length !== undefined) {
				this.initialize(props);
				props = {records: props, orgrecords: JSON.parse(JSON.stringify(props))};
			}
			return _.assign({}, DataLib.datalist, props);
		},
	}
};

class TransManager {
	constructor() {
		this.id = '';
		this.url = '';
		this.callback = null;
		this.beforeSend = null;
		this.erorr = null;
		this.timeout = (1000 * 30);
		this.async = true;
		this.asyncdata = null;
		this.dataType = 'json';
		this.contentType = 'application/json';
		this.progress = true;
		this.constants = {
			url: {
				common: '/json.service.do',
				upload: '/upload.service.do',
				sttSearch: '/sttSearch.service.do',
			},
			errorcode: {
				SUCCESS: '0',
				ERROR: '-2',
				UPLOADFAIL: '-3'
			},
			systemid: {
			},
			crudh: {
				create: '0',
				read: '1',
				update: '2',
				destroy: '3',
				procedure: '4',
				handle: '5',
				sequence: '6',
				iterator: '7',
				batch: '8',
				dir: '9',
				passwd: '10',
				interface: '11',
				sttSearch: '12',

				dataset: 'ds_config'
			},
			dao: {
				base: '0'
			},
			config: {
				dao: '',
				crudh: '',
				sqlmapid: '',
				datasetmap: '',
				datasetsend: '',
				datasetrecv: '',
				columnid: '',
				systemid: '',
				retry: 0
			},
			accessToken: '',
			contentType: {
				upload: 'multipart/form-data',
				json: 'application/json',
				javascript : 'application/json'
			},
			noProgressbar : false
		};
		this.transdata = {
			epytwor: newScrmObj.constants.crud,
			gifnoc: [],
			datasets: {},
			reyolpme: { "CENT_CD": "", "TEAM_CD": "", "USR_CD" : "", "AUTH_LV": "", "LOG_IP": "" },
			noisivid: ComLib.getSession("SYSTEM_DV"),
		};
		this.datatype = {
			html: 'html',
			json: 'json',
			script: 'script',
			xml: 'xml'
		};
	};
	initialize = () => {
		this.transdata.epytwor = newScrmObj.constants.crud;
		this.transdata.gifnoc = [];
		this.transdata.reyolpme = { "CENT_CD": "", "TEAM_CD": "", "USR_CD" : "", "AUTH_LV": "", "LGN_IP": "" };
		this.transdata.datasets = {};
		this.setAccessToken(ComLib.getSession('accessToken'));
	};
	setReyolpme = () => {
		var reyolpme = this.transdata.reyolpme;
		if (sessionStorage.getItem("gdsUserInfo") !== null) {
			var arrUser = ComLib.getSession("gdsUserInfo");
			reyolpme = {
				"CENT_CD": arrUser[0]["CENT_CD"],
				"TEAM_CD": arrUser[0]["TEAM_CD"],
				"USR_CD" : arrUser[0]["USR_ID"],
				"AUTH_LV": arrUser[0]["AUTH_LV"],
				"LGN_IP": arrUser[0]["LGN_IP"],
			};
		}
		return reyolpme;
	};
	setTransUrl = (url) => {
		this.url = url;
		if (this.constants.url.common === url) this.contentType = this.constants.contentType.json;
		else if (this.constants.url.upload === url) this.contentType = this.constants.contentType.upload;
	};
	setBeforeSend = (beforeSend) => {
		this.beforeSend = beforeSend;
	};
	setTransId = (transId) => {
		this.initialize();
		this.id	= transId;
		this.transdata.reyolpme = this.setReyolpme();
	};
	setCallBack = (callback) => {
		this.callback	= callback;
	};
	setError = (error) => {
		this.error = error;
	};
	setTimeout = (timeout) => {
		this.timeout = timeout;
	};
	setAsync = (async) => {
		this.async = async;
	};
	setProgress = (progress) => {
		this.progress = progress;
	};
	makeTransData = () => {
		return { transdata: JSON.stringify(this.transdata) };
	};
	addConfig = (props) => {
		this.transdata.gifnoc.push(_.assign({}, this.constants.config, props));
	};
	addDataset = (name, dataset) => {
		this.transdata.datasets[name] = dataset;
	};
	addSequence = (props) => {
		this.addConfig( _.assign(props, { crudh: this.constants.crudh.sequence }));
	};
	addIterator = (props) => {
		this.addConfig( _.assign(props, { crudh: this.constants.crudh.iterator }));
	};
	addSendDataset = (name, dataset) => {
		this.transdata.datasets[name] = dataset;
	};
	addRecvDataset = (name, dataset) => {
		this.transdata.datasets[name] = dataset;
	};
	setAccessToken = (token) => {
		this.constants.accessToken = token;
	};
	setProgressBar = (bln) => {
		this.constants.noProgressbar = bln;
	}
	replcaceSpChar = (data) => {
		return data.replace(/%/g, '???').replace(/=/g, '???').replace(/&amp;/g, '???').replace(/&/g, '???');
	};
	doLoading = (bVisible) => {
		let objLoadDiv = document.getElementById(newScrmObj.constants.mdi.LOADING);
		if (ComLib.isNull(objLoadDiv)) {
			objLoadDiv = document.createElement("div");
			objLoadDiv.id = newScrmObj.constants.mdi.LOADING;
		}
		document.body.appendChild(objLoadDiv);
		ReactDOM.render(<Dialog.ModalLoading isOpen = {bVisible}/>, objLoadDiv);
	};
	agent = () => {
		console.log('request => ');
		console.log(this.transdata);
		if (!this.constants.noProgressbar) {
			loadProgressBar();
			if (this.progress) this.doLoading(this.progress);
		}
		if (!this.async) this.agentSync();
		else this.agentAsync();
	};
	agentSync = () => {
		const reqOptions = {
			method: 'post',
			//url: process.env.API_URL + this.url,
			url: ComLib.getSession("SVR_URL") + this.url,
			data: this.contentType === this.constants.contentType.json ? this.replcaceSpChar(JSON.stringify({"transdata": this.transdata})) : this.transdata.datasets.fileupload,
			headers: {
				"Content-Type": this.contentType,
				"Authorization": this.constants.accessToken
			},
			json: true,
			retry: 0,
			progress: this.progress,
			timeout: this.timeout,
		};
		try {
			const resData = axios(reqOptions);
			console.log('response => ');
			console.log(resData);
			if (!this.constants.noProgressbar) { 
				if (this.progress) this.doLoading(!this.progress);
			}
			if (resData.data.gifnoc.ERR_CODE === this.constants.errorcode.SUCCESS) {
				if ( this.callback !== '' && this.callback !== undefined && this.callback !== null ) {
					return this.callback({ id: this.id, data: resData.data, result: this.constants.errorcode.SUCCESS });
				} else {
					return resData;
				}
			} else if (resData.data.data.gifnoc.ERR_CODE === this.constants.errorcode.UPLOADFAIL) {
				if ( this.callback !== '' && this.callback !== undefined && this.callback !== null) {
					return this.callback({ id: this.id, data: resData.data, result: this.constants.errorcode.UPLOADFAIL });
				}
			} else {
				ComLib.openDialog('A', 'SYSI0010', [resData.data.gifnoc.ERR_MESSAGE]);
			}
		} catch (err) {
			console.log('catch => ');
			console.log(err);
			if (!this.constants.noProgressbar) { 
				if (this.progress) this.doLoading(!this.progress);
			}
			ComLib.openDialog('A', 'SYSI0010', ['?????? ?????? ??????\n????????? ??????????????????.']);
		}
	};
	agentAsync = async() => {
		const reqOptions = {
			method: 'post',
			//url: process.env.API_URL + this.url,
			url: ComLib.getSession("SVR_URL") + this.url,
			data: this.contentType === this.constants.contentType.json ? this.replcaceSpChar(JSON.stringify({"transdata": this.transdata})) : this.transdata.datasets.fileupload,
			headers: {
				"Content-Type": this.contentType,
				"Authorization": this.constants.accessToken
			},
			json: true,
			retry: 0,
			progress: this.progress,
			timeout: this.timeout,
		};
		// console.log(this.url)
		
		if (this.url === '/sttSearch.service.do') {
			try {
				const resData = await axios(reqOptions);
				console.log('response => ');
				console.log(resData);

				if (!this.constants.noProgressbar) { 
					if (this.progress) this.doLoading(!this.progress);
				}

				if ( this.callback !== '' && this.callback !== undefined && this.callback !== null ) {
					return this.callback({ id: this.id, data: resData.data, result: this.constants.errorcode.SUCCESS });
				} else {
					return resData;
				}
				
			} catch (err) {
				console.log('catch => ');
				console.log(err);
				if (!this.constants.noProgressbar) { 
					if (this.progress) this.doLoading(!this.progress);
				}
				ComLib.openDialog('A', 'SYSI0010', ['?????? ?????? ??????\n????????? ??????????????????.']);
			}
		} else {
			try {
				const resData = await axios(reqOptions);
				console.log('response => ');
				console.log(resData);
				
				if (!this.constants.noProgressbar) { 
					if (this.progress) this.doLoading(!this.progress);
				}
	
				if (resData.data.gifnoc.ERR_CODE === this.constants.errorcode.SUCCESS) {
					if ( this.callback !== '' && this.callback !== undefined && this.callback !== null ) {
						return this.callback({ id: this.id, data: resData.data, result: this.constants.errorcode.SUCCESS });
					} else {
						return resData;
					}
				} else if (resData.data.data.gifnoc.ERR_CODE === this.constants.errorcode.UPLOADFAIL) {
					if ( this.callback !== '' && this.callback !== undefined && this.callback !== null) {
						return this.callback({ id: this.id, data: resData.data, result: this.constants.errorcode.UPLOADFAIL });
					}
				} else {
					ComLib.openDialog('A', 'SYSI0010', [resData.data.gifnoc.ERR_MESSAGE]);
				}
			} catch (err) {
				console.log('catch => ');
				console.log(err);
				if (!this.constants.noProgressbar) { 
					if (this.progress) this.doLoading(!this.progress);
				}
				ComLib.openDialog('A', 'SYSI0010', ['?????? ?????? ??????\n????????? ??????????????????.']);
			}
		}		
	};
};
export {newScrmObj, ComLib, StrLib, FileLib, ExcelLib, DateLib, TransManager, DataLib };