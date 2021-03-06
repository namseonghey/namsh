import React from 'react';
import ReactDOM from 'react-dom';
import {ComLib, DataLib, TransManager} from 'common';
import {IconButton, LFloatArea, RFloatArea, HeaderMenu, Label} from 'components';
import 'assets/styles/header.css';

class Header extends React.Component{
	/*******************************************************************
	 * Constructor
	 *******************************************************************/
	constructor(){
		super();
		this.state = {
			dsUser: DataLib.datalist.getInstance(),
		}
		this.event.button.onClick = this.event.button.onClick.bind(this);
	}

	/*******************************************************************
	 * Event
	 *******************************************************************/
	componentDidMount() {
		this.state.dsUser.setRecords(ComLib.getSession("gdsUserInfo"));
	}
	event = {
		button: {
			onClick: (e) => {
				switch (e.target.id) {
				case 'btnLogout':
					if (this.validation("HEADER_D01")) this.transaction("HEADER_D01");
					break;
				case 'btnNoti':
					let notiOption = { width: '700px', height: '800px' }
					ComLib.openPop('COM010010', '공지사항조회', 'modal', notiOption);
					break;
				case 'btnMyinfo':
					let infoOption = { width: '500px', height: '335px', pop: true }
					ComLib.openPop('pwdChg', '비밀번호 변경', 'modal', infoOption);
					break;
				case 'btnSetting':
					let setOption = { width: '500px', height: '600px' }
					ComLib.openPop('COM010020', '설정변경', 'modal', setOption);
					break;
				default : break;
				}
			}
		},
	}

	/*******************************************************************
	 * Validation
	 *******************************************************************/
	validation = (serviceid) => {
		switch (serviceid) {
		case 'HEADER_D01':
			break;
		default : break;
		}

		this.setdata(serviceid);

		return true;
	}

	/*******************************************************************
	 * Set data
	 *******************************************************************/
	setdata = (serviceid) => {
		switch (serviceid) {
		case 'HEADER_D01':
			this.state.dsUser.setValue(0, "PS_STA_CD", "20");
			break;
		default : break;
		}
	}

	/*******************************************************************
	 * Transaction
	 *******************************************************************/
	transaction = (serviceid) => {
		let transManager = new TransManager();
		try  {
			switch (serviceid) {
			case 'HEADER_D01':
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.update,
					sqlmapid:"COM.U_setLogoutInfo",
					datasetsend:"dsUser",
				});
				transManager.addDataset('dsUser', this.state.dsUser.getTransRecords());
				transManager.agent();
				break;
			default : break;
			}
		} catch (err) {
			console.log(err);
		}
	}

	/*******************************************************************
	 * Callback
	 *******************************************************************/
	callback = (res) => {
		try {
			switch (res.id) {
			case 'HEADER_D01':
				ComLib.setSession("token", false)
				ComLib.setSession("logoutComplete", true);
				
				window.location = '/';
				break;
			default : break;
			}
		} catch (err) {
			console.log(err);
		}
	}
	handleClickOutside = (e) => {
		const domNode = ReactDOM.findDOMNode(this);
		if ( !domNode || !domNode.contains(e.target) ) {
			document.getElementById(this.props.id).style.display = "none";
			this.setState({...this.state, expended : false});
		}
	}
	/*******************************************************************
	 * Render
	 *******************************************************************/
	render () {
		return (
			<React.Fragment>
				<LFloatArea>
					<div className = 'logo' style= {{display: 'flex'}}>
						<div className = 'scrm-header-left-div'/>Smart VA
					</div>
				</LFloatArea>
				<RFloatArea>
					<div className="scrm-header-btn-div">
						<IconButton classes='scrm-btn-logut' id='btnLogout'	onClick={this.event.button.onClick} tooltip="로그아웃"/>
					</div>
				</RFloatArea>
				<div style={{float : 'right',  position: 'absolute', right: 55}}>
					<div style={{alignContent: 'bottom', verticalAlign: 'center', height: '100%'}}>
						<div>
							<Label color={'white'} value={"소속 : [" + ComLib.getSession("gdsUserInfo")[0]['CENT_NM'] + ']' + ((ComLib.getSession("gdsUserInfo")[0]['TEAM_NM'] !== undefined ) ? ' / ['+ComLib.getSession("gdsUserInfo")[0]['TEAM_NM'] +']': '')}> </Label>
							<Label color={'white'} value={"사용자 : [" + ComLib.getSession("gdsUserInfo")[0]['USR_NM'] + ']'}> </Label>
						</div>
					</div>
				</div>
				<HeaderMenu menu={this.props.menu} openMenu = {this.props.openMenu}/>
			</React.Fragment>
		);
	}
}
export default Header;