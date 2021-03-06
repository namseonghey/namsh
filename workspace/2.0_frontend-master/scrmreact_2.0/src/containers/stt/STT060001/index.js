// 오인식문장관리
import React from 'react';
import {
	ComponentPanel, FlexPanel, FullPanel, SubFullPanel} from 'components';
//버튼 컴포넌트
import {Grid} from 'components';
import {ComLib, DataLib, TransManager} from 'common';

class View extends React.Component {
	constructor(props) {
		super();
		this.state = {
			dsSttAns : DataLib.datalist.getInstance(),
			dsSttRes : DataLib.datalist.getInstance(),
			grdProps : {
				grdSttAns : {
					id       : 'grdSttAns',
					areaName : 'STT 정답지',
					height   : '600px',
					header   : [
									{headerName: '화자',	field: 'CENT_NM',	colId: 'CENT_NM', width: 50},
									{headerName: '발화내용', field: 'PART_NM',	colId: 'PART_NM', width: 200},
								]
				},
				grdSttRes : {
					id       : 'grdSttRes',
					areaName : 'STT 결과',
					height   : '600px',
					header   : [
									{headerName: '화자',	field: 'CENT_NM',	colId: 'CENT_NM', width: 50},
									{headerName: '발화내용', field: 'PART_NM',	colId: 'PART_NM', width: 200},
								]
				}
			}
		}
	}
	componentDidMount () {
		// this.transaction('STT060001_R01')
		// ComLib.setStateInitRecords(this, "dsTrainHistory", this.props.options.dsTrainHistory);
		
		console.log(this.props)
		console.log(this.props.options.dsTrainHistory)
		console.log(this.state.dsTrainHistory)
	}
	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	transaction = (...params) => {		
		let serviceid = params[0];
		let transManager = new TransManager();
		
		transManager.setTransId(serviceid);
		transManager.setTransUrl(transManager.constants.url.common);
		transManager.setCallBack(this.callback);

		try {
			switch (serviceid) {
			case 'STT060001_R01':
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"STT.R_getTrainHistory",
					datasetsend:"dsSearch",
					datasetrecv:"dsTrainHistory",
				});
					
				let monthRangeArr = ComLib.getCommCodeList('TRAIN_LOG_MONTH');

				transManager.addDataset('dsSearch', [{MONTH_RANGE: monthRangeArr[0].CODE}]);
				transManager.agent();

				break;

			default : break;
			}
		} catch (err) {

		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [5. Callback Event Zone]
	//  - Callback 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	callback = (res) => {		
		switch (res.id) {		
		case 'STT060001_R01':
			let dsTrainHistory = res.data.dsTrainHistory;

			ComLib.setStateInitRecords(this, "dsTrainHistory", dsTrainHistory);

			break;

		default : break;
		}
	}
	render () {
		return (
			<React.Fragment>
				<FullPanel>
					<SubFullPanel>
						<FlexPanel>
							<ComponentPanel>
								<Grid
									id          = {this.state.grdProps.grdSttAns.id} 
									areaName    = {this.state.grdProps.grdSttAns.areaName}
									header      = {this.state.grdProps.grdSttAns.header}
									data        = {this.state.dsSttAns}
									height      = {this.state.grdProps.grdSttAns.height}
									rowNum      = {true}	
									addRowBtn   = {false}
									delRowBtn   = {false}
									dnlExcelBtn = {true}	
								/>
							</ComponentPanel>
							<ComponentPanel>
								<Grid
									id          = {this.state.grdProps.grdSttRes.id} 
									areaName    = {this.state.grdProps.grdSttRes.areaName}
									header      = {this.state.grdProps.grdSttRes.header}
									data        = {this.state.dsSttRes}
									height      = {this.state.grdProps.grdSttRes.height}
									rowNum      = {true}
									addRowBtn   = {false}
									delRowBtn   = {false}
									dnlExcelBtn = {true}
								/>
							</ComponentPanel>
						</FlexPanel>
					</SubFullPanel>
				</FullPanel>
			</React.Fragment>
		)
	}
}

export default View;