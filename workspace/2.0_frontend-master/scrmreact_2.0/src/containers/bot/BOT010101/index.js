// 오인식문장관리
import React from 'react';
import {
	ComponentPanel, SearchPanel,
	FlexPanel, FullPanel, SubFullPanel, LFloatArea, RFloatArea, RelativeGroup
} from 'components';
//버튼 컴포넌트
import {BasicButton as Button, Label} from 'components';
import {Textfield} from 'components';
import {Grid} from 'components';
import {ComLib, DataLib, TransManager, newScrmObj} from 'common';

class SYS080101 extends React.Component {
	constructor(props) {
		super();
		this.state = {
			dsSnroKeywordList : DataLib.datalist.getInstance(),			
			btnProps : {
				btnKeywordSave : {
					id       : 'btnKeywordSave',
					disabled : false,
					value    : '저장',
					hidden   : false
				},
			},
			grdProps : {
				grdSnroKeyword : {
					id       : 'grdSnroKeyword',
					areaName : '추출 키워드',
					height   : '580px',
					header   : [
									{headerName: '키워드',	 field: 'KEYWORD',	colId: 'KEYWORD', width: 200},
									{headerName: '가중치',   field: 'SCO',	colId: 'SCO', width: 100},
									{headerName: '사용여부', field: 'USE_FLAG',	colId: 'USE_FLAG',	editable: true, defaultValue : 'Y', width: 150, req: true, resizable: false, textAlign: 'center', singleClickEdit: true,
										cellEditor: 'agSelectCellEditor',
										cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
										valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')}	
								]
				}
			},	
			textFieldProps : {
				iptSnroNm : {
					id          : 'iptSnroNm',
					name        : 'iptSnroNm',
					value       : '',
					placeholder : '',
				},				
				iptSnroType : {
					id          : 'iptSnroType',
					name        : 'iptSnroType',
					value       : '',
					placeholder : '',
				},
				iptSnroSco : {
					id          : 'iptSnroSco',
					name        : 'iptSnroSco',
					value       : '',
					placeholder : '',
				}
			},
		}
	}
	componentDidMount () {
		console.log(this.props.options.params)
		let props = this.props.options.params;
		let state = this.state;
		state['textFieldProps']['iptSnroNm'].value = props.SNRO_EXPL;
		state['textFieldProps']['iptSnroSco'].value = props.REQ_SCO;
		state['textFieldProps']['iptSnroType'].value = ComLib.getComCodeName('CALLBOT_SNRO', props.TYPE_FLAG, 'SNRO_TYPE');

		this.setState(state);
		this.transaction("SYS080101_R00")
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
			case 'SYS080101_R00':
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"SYS.R_getSnroKeyword",
					datasetsend:"dsSearch",
					datasetrecv:"dsSnroKeywordListRecv",
				});
				
				let props = this.props.options.params;

				transManager.addDataset('dsSearch', [{SNRO_CD: props.SNRO_CD}]);
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
		case 'SYS080101_R00':
			if (res.data.dsSnroKeywordListRecv.length > 0) {
				let dsSnroKeywordListRecv = res.data.dsSnroKeywordListRecv;

				ComLib.setStateInitRecords(this, "dsSnroKeywordList", dsSnroKeywordListRecv);

			}	

			break;

		default : break;
		}
	}


	event = {
		// 버튼 이벤트
		button : {
			onClick : (e) => {
				switch (e.target.id) {
				case "btnSearch":
					if (this.validation("SYS010000_R01")) this.transaction("SYS010000_R01");
				
					break;
						
				default : break;
				}
			}
		},
		grid: {
			onSelectionChanged: (e) => {
				switch (e.id) {
				case "grdSnroKeyword":
					let bigRow = this.snroKeywordGrid.getSelectedRows()[0]	

					let bigCd   = bigRow.BIG_CD;
					let rowType = bigRow.rowtype;
					let mdlCd   = bigRow.MDL_CD;					

					if ((rowType === 'r' || rowType === 'u') && (this.currentRowBig !== bigCd || this.currentRowMdl !== mdlCd)) {
						if (this.validation("SYS010000_R02")) this.transaction("SYS010000_R02", bigCd, mdlCd);
						

					} else if (rowType === 'c'){
						ComLib.setStateInitRecords(this, "dsSmlCdList", []);

					}

					this.currentRowBig = this.snroKeywordGridApi.getSelectedRows()[0].BIG_CD;
					this.currentRowMdl = this.snroKeywordGridApi.getSelectedRows()[0].MDL_CD;
						
					break;

				default: break
				}
			},
			onGridReady: (e) => {
				switch (e.id) {
				case "grdSnroKeyword":
					this.snroKeywordGridApi = e.gridApi;
					this.snroKeywordGrid    = e.grid;
					
					break;
				default: break
				}
			},
			onRowClicked: (e) => {
				switch (e.id) {
				case "grdSnroKeyword":
					let bigRows = this.snroKeywordGridApi.rowModel.rowsToDisplay;
					let bigRow;

					for (let i = 0; i < bigRows.length; i ++) {
						if (bigRows[i].data.TEMP_CD === e.data.TEMP_CD){
							bigRow = this.snroKeywordGridApi.rowModel.rowsToDisplay[i];
							break;
						}
					}

					if (bigRow.selected !== true) {
						bigRow.setSelected(true);
					}
															 		
					break;

				default: break;
				}
			},
			onCellValueChanged: (e) => {				
				switch (e.id) {
				case "grdSnroKeyword":	
					if (e.col === "BIG_CD" || e.col === "MDL_CD" ) {
						if (this.snroKeywordGrid.gridDataset.records[e.index].rowtype !== newScrmObj.constants.crud.create) {
							ComLib.openDialog('A', 'COME0013', [(e.col === "BIG_CD" ? '대' : '중') + '분류 코드']);
						
							this.snroKeywordGrid.gridDataset.setValue(e.index , e.col, e.oldValue);
							this.snroKeywordGridApi.setRowData(this.snroKeywordGrid.gridDataset.getRecords().filter(item => item['rowtype'] !== newScrmObj.constants.crud.destroy));
						}
					}	

					let bigRows = this.snroKeywordGridApi.rowModel.rowsToDisplay;
					let bigRow;

					for (let i = 0; i < bigRows.length; i ++) {
						if (bigRows[i].data.TEMP_CD === e.data[e.index].TEMP_CD){
							bigRow = this.snroKeywordGridApi.rowModel.rowsToDisplay[i];							
							break;
						}
					}

					this.currentRowBig = bigRow.data.BIG_CD;
					this.currentRowMdl = bigRow.data.MDL_CD;

					this.lastEditedBig = bigRow.data.BIG_CD;
					this.lastEditedMdl = bigRow.data.MDL_CD;

					break;
		
				default: break;
				}
			},
			onDeleteRow: (e) => {
				switch (e.id) {
				case "grdSnroKeyword":
					let bigCd   = this.snroKeywordGridApi.getSelectedRows()[0].BIG_CD
					let mdlCd   = this.snroKeywordGridApi.getSelectedRows()[0].MDL_CD
					let rowType = this.snroKeywordGridApi.getSelectedRows()[0].rowtype;					

					if ((rowType === 'r' || rowType === 'u') && (this.currentRowBig !== bigCd || this.currentRowMdl !== mdlCd)) {
						if (this.validation("SYS010000_R02")) this.transaction("SYS010000_R02", bigCd, mdlCd);
							
					} else {
						ComLib.setStateInitRecords(this, "dsSmlCdList", []);

					}
					
					this.currentRowBig = this.snroKeywordGridApi.getSelectedRows()[0].BIG_CD;
					this.currentRowMdl = this.snroKeywordGridApi.getSelectedRows()[0].MDL_CD;

					break;

				default: break;
				}
			},
			onBeforeInsertRow : (e) => {
				switch (e.id) {
				case "grdSnroKeyword":
					
					break;

		
				default: break;
				}

				return {rtn: true, index: 0};
			},			
			onInsertRow : (e) => {
				switch (e.id) {
				case "grdSnroKeyword":
					let bigCdRecords = this.snroKeywordGrid.gridDataset.records;

					bigCdRecords[e.index].TEMP_CD = this.maxTempBigCd + 1;

					this.maxTempBigCd ++;

					this.snroKeywordGrid.gridDataset.setRecords(bigCdRecords);

					this.snroKeywordGridApi.setRowData(this.snroKeywordGrid.gridDataset.getRecords().filter(item => item['rowtype'] !== newScrmObj.constants.crud.destroy));
				
					let bigRows = this.snroKeywordGridApi.rowModel.rowsToDisplay;
					let bigRow;

					for (let i = 0; i < bigRows.length; i ++) {
						if (bigRows[i].data.TEMP_CD === this.maxTempBigCd){
							bigRow = this.snroKeywordGridApi.rowModel.rowsToDisplay[i];
							this.snroKeywordGridApi.ensureIndexVisible(i, 'middle');
							break;
						}
					}

					if (bigRow.selected !== true) {
						bigRow.setSelected(true);
					}					

					ComLib.setStateInitRecords(this, "dsSmlCdList", []);
					
					this.currentRowBig = '';
					this.currentRowMdl = '';

					break;

		
				default: break;
				}
				
			}
		},
		input : {
			onChange: (e) => {
				let state = this.state;

				switch (e.target.id) {
				case 'iptSnroNm':

					state['textFieldProps']['iptSnroNm'].value = e.target.value;
	
					this.setState(state);
					
					break;
				case 'iptSnroSco':
					state['textFieldProps']['iptSnroNm'].value = e.target.value;
	
					this.setState(state);
					
					break;
				default: break;
				}
			},
			onKeyPress: (e) => {
				switch (e.target.id) {
				case 'iptSnroNm':
					
					break;

				case 'iptSnroSco':
					
					break;

				default: break;
				}

			}
		},
		selectbox: {
			onChange: (e) => {
				let state = this.state;

				state['selectboxProps'][e.target.id].selected = e.target.selectedIndex;
				state['selectboxProps'][e.target.id].value    = e.target.value;

				this.setState(state);

			}
		}
	}


	render () {
		return (
			<React.Fragment>
				<FullPanel>
					<SubFullPanel>
							<SearchPanel>
								<RelativeGroup>
									<LFloatArea>
										<FlexPanel>
											<Label value="시나리오"/>
											<Textfield
												width       = {200}
												id          = {this.state.textFieldProps.iptSnroNm.id}
												name        = {this.state.textFieldProps.iptSnroNm.name}
												value       = {this.state.textFieldProps.iptSnroNm.value}
												readOnly    = {true}
												disabled    = {false}
											/>
											<Label value="시나리오 타입"/>
											<Textfield
												width       = {150}
												id          = {this.state.textFieldProps.iptSnroType.id}
												name        = {this.state.textFieldProps.iptSnroType.name}
												value       = {this.state.textFieldProps.iptSnroType.value}
												readOnly    = {true}
												disabled    = {false}
											/>
											<Label value="임계값" req={true}/>
											<Textfield
												width       = {50}
												id          = {this.state.textFieldProps.iptSnroSco.id}
												name        = {this.state.textFieldProps.iptSnroSco.name}
												value       = {this.state.textFieldProps.iptSnroSco.value}
												placeholder = {this.state.textFieldProps.iptSnroSco.placeholder}
												minLength   = {1}
												maxLength   = {3}
												readOnly    = {false}
												disabled    = {false}
												onChange    = {this.event.input.onChange}
												onKeyPress  = {this.event.input.onKeyPress}
											/>
										</FlexPanel>
									</LFloatArea>
								</RelativeGroup>
							</SearchPanel>
							<ComponentPanel>
								<Grid
									id          = {this.state.grdProps.grdSnroKeyword.id} 
									areaName    = {this.state.grdProps.grdSnroKeyword.areaName}
									header      = {this.state.grdProps.grdSnroKeyword.header}
									data        = {this.state.dsSnroKeywordList}
									height      = {this.state.grdProps.grdSnroKeyword.height}
									rowNum      = {true}
									addRowBtn   = {true}
									delRowBtn   = {true}
								/>
								<RelativeGroup>
									<RFloatArea>	
										<Button
											color    = 'purple' 
											fiiled   = "o" 
											id       = {this.state.btnProps.btnKeywordSave.id}
											value    = {this.state.btnProps.btnKeywordSave.value}
											disabled = {this.state.btnProps.btnKeywordSave.disabled}
											hidden   = {this.state.btnProps.btnKeywordSave.hidden}
											onClick  = {this.event.button.onClick}
											mt       = {5}
										/>
									</RFloatArea>
								</RelativeGroup>
							</ComponentPanel>
					</SubFullPanel>
				</FullPanel>
			</React.Fragment>
		)
	}
}

export default SYS080101;