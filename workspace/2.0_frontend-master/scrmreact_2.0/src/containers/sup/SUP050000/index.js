// 메시지관리
import React from 'react';
import {ComponentPanel, FlexPanel, FullPanel, SubFullPanel,SearchPanel, LFloatArea, RFloatArea, RelativeGroup} from 'components';
//버튼 컴포넌트
import {BasicButton as Button, Label} from 'components';
import {Textfield, Selectbox, Grid} from 'components';
import {ComLib, StrLib, DataLib, newScrmObj, TransManager} from 'common';

class View extends React.Component {
	constructor(props) {
		super();
		this.gridMsgCdApi = null;
		this.gridMsgCd = null;
		
		this.currentRowMsg = '';
		this.state = {
			

			dsSel : DataLib.datalist.getInstance([{USE_FLAG:""}]),
			dsMsgCdList : DataLib.datalist.getInstance(),
			
			btnProps : {
				btnSearch : {
					id       : 'btnSearch',
					disabled : false,
					value    : '조회',
					hidden   : false
				},
				btnSave : {
					id       : 'btnSave',
					disabled : false,
					value    : '저장',
					hidden   : false
				},
			},
			
			textFieldProps : {
				iptMsgCdNm : {
					id          : 'iptMsgCdNm',
					name        : 'iptMsgCdNm',
					value       : '',
					placeholder : '메시지코드/코드명',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : false
				}
			},
			gridMsgCd : {
				id : 'gridMsgCd',
				areaName : '메시지목록',
				header :
					[
						{headerName: '메시지코드',		field: 'MSG_CD',	colId: 'MSG_CD', cellEditor: 'customEditor', maxLength: 30, type:'code',  editable: true, width :'50', req: true, },
						{headerName: '메시지명',		field: 'MSG_CONT',		colId: 'MSG_CONT', cellEditor: 'customEditor',	editable: true, width :'150', req: true, maxLength: 300, },
						{headerName: '사용여부',		field: 'USE_FLAG',		colId: 'USE_FLAG',	editable: true, width :'30', req: true, defaultValue : 'Y',textAlign: 'center', singleClickEdit: true,
							cellEditor: 'agSelectCellEditor',
							cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
							valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')						
						},
						{headerName: '등록자',			field: 'REG_USR_ID',		colId: 'REG_USR_ID',	editable: true,width :'30'},
						{headerName: '등록일시',		field: 'REG_DTM',		colId: 'REG_DTM',	editable: true,width :'50', resizable: false},
					],
					
			},
		}
		this.event.button.onClick = this.event.button.onClick.bind(this);
		this.event.selectbox.onChange = this.event.selectbox.onChange.bind(this);
		this.event.input.onChange   = this.event.input.onChange.bind(this);
		this.event.grid.onInsertRow = this.event.grid.onInsertRow.bind(this);
	}
	/*------------------------------------------------------------------------------------------------*
		1) componentDidMount () => init 함수 개념으로 이해하는게 빠름
		=> 컴포넌트가 마운트된 직후, 호출 ->  해당 함수에서 this.setState를 수행할 시, 갱신이 두번 일어나 render()함수가 두번 발생 -> 성능 저하 가능성
	 ------------------------------------------------------------------------------------------------*/
	 componentDidMount () {
		if (this.validation("SUP050000_R01")) this.transaction("SUP050000_R01");
	}
/*------------------------------------------------------------------------------------------------*
		2) componentDidUpdate () => 갱신이 일어나 직후에 호춮 (최초 렌더링 시에는 호출되지 않음)
		=> prevProps와 현재 props를 비교할 수 있음 -> 조건문으로 감싸지 않고 setState를 실행할 시, 무한 반복 가능성 -> 반드시 setState를 쓰려면 조건문으로 작성
	 ------------------------------------------------------------------------------------------------*/
	 componentDidUpdate (prevProps, prevState, snapshot) {
		//console.log("updated!!");
		//console.log(this.state.dsGrp);
	}
	/*------------------------------------------------------------------------------------------------*
		3) componentWillUnmount () => 컴포넌트가 마운트 해제되어 제거되기 직전에 호출
		=> 타이머 제거, 네트워크 요청 취소 등 수행 -> 마운트가 해제되기 때문에 setState를 호출하면 안됨
	 ------------------------------------------------------------------------------------------------*/
	 componentWillUnmount () {

	}

	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	validation = (serviceid) => {
		let chkCnt  = 0;
		let returnVal = -1;
		switch(serviceid) {
		case 'SUP050000_R01':
			break;
		case 'SUP050000_H01':
			let msgRecord = this.gridMsgCd.gridDataset.records;

			outer : for ( let intA = 0; intA < msgRecord.length; intA ++ ) {
				if (msgRecord[intA].rowtype !== newScrmObj.constants.crud.read) {
					chkCnt ++;
				}	

				let msgHeader = this.state.gridMsgCd.header.filter(item => item['req'] === true); //filter
				
				for (let i = 0; i < msgHeader.length; i ++) {
					if (StrLib.isNull(msgRecord[intA][msgHeader[i].field])) {
						
						ComLib.openDialog('A', 'COME0001',[Number(intA + 1), msgHeader[i].headerName.replace(/\*/g,'')]);//입력해주기시바랍니다
	
						returnVal = intA;

						break outer;
					}
				}

				for ( let intB = 0; intB < msgRecord.length; intB ++ ) {
					if (intA !== intB && msgRecord[intA].MSG_CD === msgRecord[intB].MSG_CD) {
						//중복되었습니다
						ComLib.openDialog('A', 'COME0012', [Number(intA + 1), Number(intB + 1), '메시지코드']);
						
						this.gridMsgCd.moveRow(intB, true);
			
						return false;
					}
				}									
			}

			if (returnVal > -1) {
				this.gridMsgCd.moveRow(returnVal, true);
			
				return false;
			}

			if (msgRecord.length < 1 || chkCnt === 0) {
				ComLib.openDialog('A', 'COME0005');//변경된 행이 없습니다

				return false;
			}

			break;

			
	default: break;
		
	}
		return true;
}
	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	transaction = (serviceid) => {
		let transManager = new TransManager();
		try  {
			switch (serviceid) {
			case 'SUP050000_R01':
				transManager.setTransId (serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getMsgCdList",
					datasetsend: "dsSearchParam",
					datasetrecv: "dsMsgCdRecv",
				});
				transManager.addDataset('dsSearchParam', [{
					"MSG_CD_NAME": this.state.textFieldProps.iptMsgCdNm.value,
					"USE_FLAG": this.state.dsSel.records[0]["USE_FLAG"]}]);
				transManager.agent();
				break;

			case 'SUP050000_H01':
				transManager.setTransId (serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
					transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.handle,
					sqlmapid   : "SUP.H_handleMsgCdList",
					datasetsend: "dsMsgCdList",
				});
				
				transManager.addDataset('dsMsgCdList', this.gridMsgCd.gridDataset.getTransRecords(newScrmObj.constants.rowtype.CREATE_OR_UPDATE));
				transManager.agent();
				break;
			default: break;
			}
		}	catch (err) {
		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [5. Callback Event Zone]
	//  - Callback 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	callback = (res) => {
		switch (res.id) {
		case 'SUP050000_R01':
			if(res.data.dsMsgCdRecv.length > 0) {
				ComLib.setStateInitRecords(this, "dsMsgCdList", res.data.dsMsgCdRecv);		
			}
			else {
				ComLib.setStateRecords(this, "dsMsgCdList", []);
			}
			break;
		case 'SUP050000_H01':
			ComLib.openDialog('A', 'COMI0001', '메시지 코드');//정상적으로 저장되었습니다
			this.transaction('SUP050000_R01');
			break;
		default: break;
		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [6. event Zone]
	//  - 각 Component의 event 처리
	/*------------------------------------------------------------------------------------------------*/
	event = {
		button : {
			onClick : (e) => {
				
				switch (e.target.id) {
					case "btnSearch": 
						if(this.validation("SUP050000_R01")) this.transaction("SUP050000_R01");
						break;
					case "btnSave":
						if (this.validation("SUP050000_H01")) this.transaction('SUP050000_H01');	
						break;
					default: break;
	
					}
				}
			
		},

		input : {
			onChange : (e) => {
				switch(e.target.id) {
				case 'iptMsgCdNm':
					let state = this.state;
					state['textFieldProps']['iptMsgCdNm'].value = e.target.value;
					this.setState(state);
					break;
				default: break;
				}
			},
			onKeyPress: (e) => {
				switch (e.target.id) {
				case 'iptMsgCdNm':
					if (e.key === 'Enter') {
						if (this.validation("SUP050000_R01")) this.transaction("SUP050000_R01");
					}
					
					break;

				default: break;
				}
			}
		},
		grid : {
			onGridReady : (e) => {

				switch(e.id) {
				case "gridMsgCd":
					this.gridMsgCdApi = e.gridApi;
					this.gridMsgCd = e.grid;
					break;
				default: break
				}
			
			},
			onRowClicked: (e) => {
	
			},
			onCellClicked: (e) => {

			},
			onCellDoubleClicked: (e) => {
				
			},
			onCellValueChanged: (e) => {
				if(e.col === "MSG_CD") {
					if(this.gridMsgCd.gridDataset.records[e.index].rowtype !== newScrmObj.constants.crud.create) {
						ComLib.openDialog('A', 'COME0013',['메시지 코드']);//변경할수없습니다

						this.gridMsgCd.gridDataset.setValue(e.index , e.col, e.oldValue);
						this.gridMsgCdApi.setRowData(this.gridMsgCd.gridDataset.getRecords().filter(item => item['rowtype'] !== newScrmObj.constants.crud.destroy));
					}
				}
				
				
			},
			onRowDoubleClicked: (e) => {
	
			},
			onCellEditingStopped: (e) => {
		
			},
			onSelectionChanged: (e) => {
		
			},
			onRowSelected: (e) => {

			},
			onDeleteRow: (e) => {

			},
			onInsertRow : (e) => {
		
			}
		},
		selectbox : {
			onChange : (e) => {
				console.log(e.id);
				switch (e.id) {
				case 'useYn': 
					ComLib.setStateValue(this, "dsSel", 0, "USE_FLAG", e.target.value);
					break;
				default: break;

				}

			}
		}
	}

	/*------------------------------------------------------------------------------------------------*/
	// [7. render Zone]
	//  - 화면 관련 내용 작성
	/*------------------------------------------------------------------------------------------------*/
	render () {
		return (
			<React.Fragment>
				<FullPanel>
					<SearchPanel>
						<RelativeGroup>
							<LFloatArea>
								<FlexPanel>
									<Label value="메시지코드/코드명"/>
									<Textfield 
										width={200}
										id = {this.state.textFieldProps.iptMsgCdNm.id}
										name =  {this.state.textFieldProps.iptMsgCdNm.name}
										value =  {this.state.textFieldProps.iptMsgCdNm.value}
										placeholder =  {this.state.textFieldProps.iptMsgCdNm.placeholder}
										minLength =   {this.state.textFieldProps.iptMsgCdNm.minLength}
										maxLength =   {this.state.textFieldProps.iptMsgCdNm.maxLength}
										readOnly =  {this.state.textFieldProps.iptMsgCdNm.readOnly}
										disabled =  {this.state.textFieldProps.iptMsgCdNm.disabled}
										onChange = {this.event.input.onChange}
										onKeyPress  = {this.event.input.onKeyPress}
									/>
									<Label value="사용여부"/>
									<Selectbox
										id = {"useYn"}
										dataset = {ComLib.convComboList(ComLib.getCommCodeList('CMN', 'USE_FLAG'), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSel.records[0]["USE_FLAG"]}
										width = {200}
										disabled = {false}
										onChange = {this.event.selectbox.onChange}
									/>
								</FlexPanel>
							</LFloatArea>
							<RFloatArea>
								<Button 			
										id = {this.state.btnProps.btnSearch.id}
										value = {this.state.btnProps.btnSearch.value}
										disabled = {this.state.btnProps.btnSearch.disabled}
										hidden = {this.state.btnProps.btnSearch.hidden}
										onClick = {this.event.button.onClick}
										color="blue" fiiled="o" innerImage={true} icon = {'srch'} mt="5px"		
								/>
							</RFloatArea>
						</RelativeGroup>
						</SearchPanel>
					<SubFullPanel>
						<ComponentPanel>
							<Grid
								id = {this.state.gridMsgCd.id}
								height= "600px"
								data = {this.state.dsMsgCdList}
								areaName = {this.state.gridMsgCd.areaName}
								header = {this.state.gridMsgCd.header}
								rowNum = {true}
								
								onGridReady = {this.event.grid.onGridReady}
								onRowClicked = {this.event.grid.onRowClicked}
								onCellClicked = {this.event.grid.onCellClicked}
								onCellDoubleClicked = {this.event.grid.onCellDoubleClicked}
								onCellValueChanged = {this.event.grid.onCellValueChanged}
								onRowDoubleClicked = {this.event.grid.onRowDoubleClicked}
								onCellEditingStopped = {this.event.grid.onCellEditingStopped}
								onSelectionChanged = {this.event.grid.onSelectionChanged}
								onRowSelected = {this.event.grid.onRowSelected}
								onDeleteRow = {this.event.grid.onDeleteRow}
								onInsertRow = {this.event.grid.onInsertRow}
							/>
							<RelativeGroup>
								<RFloatArea>								
									<Button 		
										id = {this.state.btnProps.btnSave.id}
										value = {this.state.btnProps.btnSave.value}
										disabled = {this.state.btnProps.btnSave.disabled}
										hidden = {this.state.btnProps.btnSave.hidden}
										onClick = {this.event.button.onClick}
										color="purple" fiiled="o"  mt="5px"
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

export default View;