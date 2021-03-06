import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appModuleActions from 'store/modules/appModule';
import {TrayPanel, IconButton, RFloatArea, LFloatArea} from 'components';
class Footer extends React.Component{
	render () {
		const {AppModuleAction} = this.props;
		return (
			<TrayPanel id="_trayPanelPopup">
				<LFloatArea>
					<div id="scrmFooterDiv" className="scrm-footer-div">
						<ul className="scrm-footer-pop-ul">
						{
							(this.props.popupList !== undefined) ? this.props.popupList.map((item, index) => { return (
									<li className="scrm-footer-pop-li">
										<div onClick={e => {document.getElementById(item.id).hidden = false; AppModuleAction.selectPop(item)}}>
											{item.name}
										</div>
									</li>
								
							)})
							: null
						}
						</ul>
					</div>
				</LFloatArea>
				<RFloatArea>
					<div className="scrm-tray-btn-div">
						<IconButton classes='scrm-tray-btn-close' id='btnPopAllClose'
									onClick={e => {
										this.props.popupList.forEach(element => {
											ReactDOM.unmountComponentAtNode(document.getElementById(element.id));
										});
										AppModuleAction.delAllPop()
									}}
						/>
					</div>
				</RFloatArea>
			</TrayPanel>
		);
	}
}
export default connect(
	(state) => ({
		popupList : state.appModule.popupList,
	}),
	(dispatch) => ({
		AppModuleAction : bindActionCreators(appModuleActions, dispatch)
	})
)(Footer);