import React from 'react';
import Main from './main';
import Footer from './footer';
import Header from './header';
import {AppPanel, HeadPanel, MiddlePanel, MainPanel, FooterPanel} from 'components';
import {ComLib, DataLib, TransManager} from 'common';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appModuleActions from 'store/modules/appModule';

class AppMain extends React.Component {
	/*******************************************************************
	 * Constructor
	 *******************************************************************/
	constructor() {
		super();
		if (ComLib.getSession("SYSTEM_DV") != "L") {
			this.event.window.onbeforeunload = this.event.window.onbeforeunload.bind(this);
			this.event.window.onunload = this.event.window.onunload.bind(this);
		}
	}

	state = {
		dsUser: DataLib.datalist.getInstance(),
		menu: ComLib.getSession("gdsMenu").filter(item => item.MNU_TP === '10' || item.MNU_TP === '20')
	}

	/*******************************************************************
	 * Event
	 *******************************************************************/
	componentDidMount() {
		const {AppModuleAction} = this.props;
		AppModuleAction.addTray(ComLib.getInitScreen());

		this.state.dsUser.setRecords(ComLib.getSession("gdsUserInfo"));
		if (ComLib.getSession("SYSTEM_DV") != "L") {
			window.addEventListener('beforeunload', this.event.window.onbeforeunload);
			window.addEventListener('unload', this.event.window.onunload);
		}
	}
	componentWillUnmount() {
		if (ComLib.getSession("SYSTEM_DV") != "L") {
			window.removeEventListener('beforeunload', this.event.window.onbeforeunload);
			window.removeEventListener('unload', this.event.window.onunload);
		}
	}
	componentDidUpdate () {
		this.handler.trayWidthTransform();
	}
	event = {
		window: {
			onbeforeunload: (e) => {
				if (!ComLib.getSession("logoutComplete")) e.returnValue = "๋ก๊ทธ์์?";
			},
			onunload: (e) => {
				if (!ComLib.getSession("logoutComplete")) {
					if (this.validation("BASE_D01")) this.transaction("BASE_D01");
				}
			}
		}
	}

	/*******************************************************************
	 * Validation
	 *******************************************************************/
	validation = (serviceid) => {
		switch(serviceid) {
		case 'BASE_D01':
			break;
		default : break;
		}

		this.setdata(serviceid);

		return true;
	}

	/*******************************************************************
	 * Set Data
	 *******************************************************************/
	setdata = (serviceid) => {
		switch(serviceid) {
		case 'BASE_D01':
			this.state.dsUser.setValue(0, "PS_STA_CD", "20");
			break;
		default: break;
		}
	}

	/*******************************************************************
	 * Transaction
	 *******************************************************************/
	transaction = (serviceid) => {
		let transManager = new TransManager();
		try {
			switch(serviceid) {
			case 'BASE_D01':
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.setAsync(false);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.update,
					sqlmapid:"COM.U_setLogoutInfo",
					datasetsend:"dsUsr",
				});
				transManager.addDataset('dsUsr', this.state.dsUser.getTransRecords());
				transManager.agent();

				break;
			default: break;
			}
		} catch (err) {
			console.log(err);
		}
	}

	/*******************************************************************
	 * Callback
	 *******************************************************************/
	callback = (res) => {
		switch(res.id) {
		case 'BASE_D01':
			break;
		default: break;
		}
	}

	/*******************************************************************
	 * User Function
	 *******************************************************************/
	handler = {
		trayWidthTransform : () => {
			// ์?์ฒด tray width ์์ ๋ฒํผ ์์ญ์ width ์?๊ฑฐ ()
			let width = document.getElementById('_trayPanelMenu').offsetWidth - document.getElementById('_trayPanelMenu').querySelector('.scrm-rfloat-div').offsetWidth;
			let trayWidth = 0;
			for (let intA = 0; intA < document.getElementById('_ul_mainTrayDiv').children.length; intA ++) {
				// 15px ๋งํผ์ padding์ด ์กํ ์์ด ํด๋น px๋ ํฌํจ
				trayWidth += (document.getElementById('_ul_mainTrayDiv').children[intA].offsetWidth + 15);
			}
			if (width > trayWidth) {
				document.getElementById('_ul_mainTrayDiv').style.transform = "translateX(0)";
			} else {
				// ์ฒซ๋ฒ์งธ ํ์ด ์๋?ํธ ์ธ ๊ฒฝ์ฐ, tray ์์์น
				if (document.getElementById('_ul_mainTrayDiv').querySelector('.scrm-tray-div-li-selected').id === document.getElementById('_ul_mainTrayDiv').children[0].id) {
					document.getElementById('_ul_mainTrayDiv').style.transform = "translateX(0)";
				} else {
					// ul tag์ ์กํ์๋ margin์ด 50px์ด๋ผ ๊ทธ๋งํผ ๋นผ์ค
					if (document.getElementById('_ul_mainTrayDiv').querySelector('.scrm-tray-div-li-selected').getBoundingClientRect().x-50  < 0) {
						document.getElementById('_ul_mainTrayDiv').style.transform = "translateX(" + ((document.getElementById('_ul_mainTrayDiv').getBoundingClientRect().x - document.getElementById('_ul_mainTrayDiv').querySelector('.scrm-tray-div-li-selected').getBoundingClientRect().x) + 50).toString() + "px)";
					} else {
						// ์?ํ๋ ํธ๋?์ด์ right ์ขํ๊ฐ ํธ๋?์ด ๋๋น๋ณด๋ค ํด ๊ฒฝ์ฐ, ํธ๋?์ด div ์์น ์ด๋
						if (document.getElementById('_ul_mainTrayDiv').querySelector('.scrm-tray-div-li-selected').getBoundingClientRect().right > width) {
							document.getElementById('_ul_mainTrayDiv').style.transform = "translateX(" + (width - trayWidth - 50).toString() + "px)";
						}
					}
				}
			}
		}
	}
	render () {
		const {selected, tray, popupList} = this.props;
		const {AppModuleAction} = this.props;
		
		return(
			<AppPanel>
				<HeadPanel>
					<Header menu={this.state.menu} openMenu = {AppModuleAction.addTray}/>
				</HeadPanel>
				<MiddlePanel>
					<MainPanel width="100%">
						<Main
							menu = {this.state.menu}
							tray={tray}
							selected = {selected}
							openMenu = {AppModuleAction.addTray}
							closeMenu = {AppModuleAction.delTray}
							prevMenu = {AppModuleAction.prevTray}
							nextMenu = {AppModuleAction.nextTray}
							selectMenu = {AppModuleAction.selectTray}
							closeAllMenu = {AppModuleAction.delAllTray}
						/>
					</MainPanel>
				</MiddlePanel>
				<FooterPanel>
					<Footer popupList = {popupList}/>
				</FooterPanel>
			</AppPanel>
		);
	}
}
export default connect(
	(state) => ({
		selected : state.appModule.selected,
		tray : state.appModule.tray,
		popupList : state.appModule.popupList,
	}),
	(dispatch) => ({
		AppModuleAction : bindActionCreators(appModuleActions, dispatch)
	})
)(AppMain);