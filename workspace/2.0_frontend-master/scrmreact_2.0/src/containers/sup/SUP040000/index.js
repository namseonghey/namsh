// 기준값관리
import React from 'react';
import {ComponentPanel, SearchPanel, FlexPanel, FullPanel, SubFullPanel, LFloatArea, RFloatArea, RelativeGroup
} from 'components';
//버튼 컴포넌트
import {BasicButton as Button, Label} from 'components';
import {Textfield, Selectbox} from 'components';
import {Grid} from 'components';
import {ComLib, DataLib,StrLib, newScrmObj, TransManager} from 'common';

class View extends React.Component {
	constructor(props) {
		super();
		this.gridStndValApi = null;

		this.gridStndVal = null;

		this.state = {
			dsStndValInfo : DataLib.datalist.getInstance(),
			dsSel: DataLib.datalist.getInstance([{USE_FLAG: "", APY_PPTY_USE_FLAG:"", STND_PPTY_USE_FLAG:""}]),

			btnSearchProps : {
				id       : 'searchBtn',
				disabled : false,
				value    : '조회',
				hidden   : false
			},
			btnSaveProps : {
				id       : 'btnSave',
				disabled : false,
				value    : '저장',
				hidden   : false
			},
			stndCdGrid : {
				id : 'stndCdGrid',
				areaName : '기준값목록',
				header: [
					{headerName: '코드',	field: 'STND_CD',				colId: 'STND_CD', cellEditor: 'customEditor', width :'40',textAlign: 'center',
					maxLength: 5, type:'code',editable: true, req: true,	rowspan: true, },
 					{headerName: '코드명',		field: 'STND_CD_NM',		colId: 'STND_CD_NM', cellEditor: 'customEditor',	maxLength: 150, editable: true, req: true, width :'190'},
					{headerName: '사용구분',		field: 'USE_FLAG',		colId: 'USE_FLAG',	editable: true, req: true,width :'60',defaultValue : 'Y',textAlign: 'center', singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
						valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')
					},
					{headerName: '적용속성 사용여부',	field: 'APY_PPTY_USE_FLAG',		colId: 'APY_PPTY_USE_FLAG',	editable: true,req: true,width :'95',defaultValue : 'Y',textAlign: 'center', singleClickEdit: true,
							cellEditor: 'agSelectCellEditor',
							cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG') },
							valueFormatter : (params) => { return ComLib.getComCodeName('CMN', params.value, 'USE_FLAG') }         
					},
					 {headerName: '센터수정 가능여부',	field: 'CENT_SET_CHG_FLAG',colId: 'CENT_SET_CHG_FLAG',	editable: true, req: true,width :'95',defaultValue : 'N',textAlign: 'center', singleClickEdit: true,
					 	cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'PSB_FLAG')},
					 	valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'PSB_FLAG')
					},
					 {headerName: '기준값속성 사용여부',	field: 'STND_PPTY_USE_FLAG',colId: 'STND_PPTY_USE_FLAG',	editable: true,req: true,width :'100',defaultValue : 'Y',textAlign: 'center', singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
						valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')
					},
					{headerName: '기타속성1 사용여부',	field: 'ETC1_PPTY_USE_FLAG',colId: 'ETC1_PPTY_USE_FLAG',	editable: true,width :'95',defaultValue : 'Y',textAlign: 'center', singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
						valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')
					},
					{headerName: '기타속성2 사용여부',	field: 'ETC2_PPTY_USE_FLAG',		colId: 'ETC2_PPTY_USE_FLAG',	editable: true,width :'95',defaultValue : 'Y',textAlign: 'center', singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
						valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')
					},
 					{headerName: '정렬순서',	field: 'SORT_ORD',		colId: 'SORT_ORD',	cellEditor: 'customEditor', maxLength: 3, type: 'num', editable: true, req: true,width :'60',textAlign: 'center',},
					{headerName: '등록일자',	field: 'REG_DTM',		colId: 'REG_DTM',	editable: true, resizable: false,width :'60',},
				],

			},
			textFieldProps : {
				iptCdNm : {
					id 			: 'iptCdNm',
					name        : 'iptCdNm',
					value       : '',
					placeholder : '기준값코드/코드명',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : false
				}
			},
		}
		this.event.button.onClick   = this.event.button.onClick.bind(this);
		this.event.input.onChange   = this.event.input.onChange.bind(this);
		this.event.selectbox.onChange = this.event.selectbox.onChange.bind(this);
		this.event.grid.onInsertRow = this.event.grid.onInsertRow.bind(this);
	}
	/*------------------------------------------------------------------------------------------------*
		1) componentDidMount () => init 함수 개념으로 이해하는게 빠름
		=> 컴포넌트가 마운트된 직후, 호출 ->  해당 함수에서 this.setState를 수행할 시, 갱신이 두번 일어나 render()함수가 두번 발생 -> 성능 저하 가능성
	 ------------------------------------------------------------------------------------------------*/
	componentDidMount () {
		if (this.validation("SUP040000_R01")) this.transaction("SUP040000_R01");
	}
/*------------------------------------------------------------------------------------------------*
		2) componentDidUpdate () => 갱신이 일어나 직후에 호춮 (최초 렌더링 시에는 호출되지 않음)
		=> prevProps와 현재 props를 비교할 수 있음 -> 조건문으로 감싸지 않고 setState를 실행할 시, 무한 반복 가능성 -> 반드시 setState를 쓰려면 조건문으로 작성
	 ------------------------------------------------------------------------------------------------*/
	 componentDidUpdate (prevProps, prevState, snapshot) {

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
	validation = (transId) => {
		let chkCnt  = 0;
		let returnVal = -1;
		switch (transId) {
		case 'SUP040000_R01':
			break;
		case 'SUP040000_H01':

			let stndRecord = this.gridStndVal.gridDataset.records;

			outer : for ( let intA = 0; intA < stndRecord.length; intA ++ ) {
				if (stndRecord[intA].rowtype !== newScrmObj.constants.crud.read) {
					chkCnt ++;
				}	

				let stndHeader = this.state.stndCdGrid.header.filter(item => item['req'] === true);; // filter
				
				for(let i = 0; i < stndHeader.length; i++) {
					
					if (StrLib.isNull(stndRecord[intA][stndHeader[i].field])) {

					
						ComLib.openDialog('A', 'COME0001', [Number(intA + 1) , stndHeader[i].headerName.replace(/\*/g,'') ]);
					
						returnVal = intA;

						break outer;
					}
				}
				for ( let intB = 0; intB < stndRecord.length; intB ++ ) {
					if (intA !== intB && stndRecord[intA].STND_CD === stndRecord[intB].STND_CD) {
						ComLib.openDialog('A', 'COME0012', [Number(intA + 1) , Number(intB + 1) , '기준 코드']);// 중복되었습니다
						
						this.gridStndVal.moveRow(intB, true);
			
						return false;
					}
				}	
			}	
			if (returnVal > -1) {
				this.gridStndVal.moveRow(returnVal, true);
			
				return false;
			}

			if (stndRecord.length < 1 || chkCnt === 0) {
				ComLib.openDialog('A', 'COME0005');

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
			case 'SUP040000_R01':
				transManager.setTransId (serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getStndValInfo",
					datasetsend: "dsSearchParam",
					datasetrecv: "dsStndCdRecv",
				});
				transManager.addDataset('dsSearchParam'	, [{"STND_CD_NAME": this.state.textFieldProps.iptCdNm.value
														, 	"USE_FLAG": this.state.dsSel.records[0]["USE_FLAG"]
														,	"APY_PPTY_USE_FLAG":this.state.dsSel.records[0]["APY_PPTY_USE_FLAG"]
														,	"STND_PPTY_USE_FLAG":this.state.dsSel.records[0]["STND_PPTY_USE_FLAG"]}]);
				transManager.agent();
				break;

			case 'SUP040000_H01': 
				transManager.setTransId (serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
					transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.handle,
					sqlmapid   : "SUP.H_handleStndValInfo",
					datasetsend: "dsStndValInfo",
				});
				transManager.addDataset('dsStndValInfo', this.gridStndVal.gridDataset.getTransRecords(newScrmObj.constants.rowtype.CREATE_OR_UPDATE));
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
		case 'SUP040000_R01':
			if(res.data.dsStndCdRecv.length > 0) {
				ComLib.setStateInitRecords(this, "dsStndValInfo", res.data.dsStndCdRecv);
			}
			else {
				ComLib.setStateRecords(this, "dsStndValInfo", []);
			}
			break;
		case 'SUP040000_H01':
			ComLib.openDialog('A', 'COMI0001',['기준 코드']);//정상적으로 저장되었습니다
			this.transaction('SUP040000_R01');
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
				case "searchBtn":
					if (this.validation("SUP040000_R01")) this.transaction("SUP040000_R01");					
					break;
				case "btnSave": 
					if (this.validation("SUP040000_H01")) this.transaction("SUP040000_H01");
					break;		
				default: break;
				}
			}
		},
		input : {
			onChange : (e) => {
				switch(e.target.id) {
				case 'iptCdNm':
					let state = this.state;
					state['textFieldProps']['iptCdNm'].value = e.target.value;
					this.setState(state);
					break;
				default: break;
				}
			},
			onKeyPress: (e) => {
				switch (e.target.id) {
				case 'iptCdNm':
					if (e.key === 'Enter') {
						if (this.validation("SUP040000_R01")) this.transaction("SUP040000_R01");
					}			
					break;

				default: break;
				}

			}
		},
		selectbox : {
			onChange : (e) => {
				switch(e.id) {
				case 'useYn': 
					ComLib.setStateValue(this, "dsSel", 0, "USE_FLAG", e.target.value);
					break;
				case 'apyPtyYn':
					ComLib.setStateValue(this, "dsSel", 0, "APY_PPTY_USE_FLAG", e.target.value);
					break;
				case 'stndYn': 
					ComLib.setStateValue(this, "dsSel", 0, "STND_PPTY_USE_FLAG", e.target.value);
					break;
				default: break;

				}
				
			}
		},
		grid : {
			onGridReady : (e) => {
				switch(e.id) {
				case "stndCdGrid":
					this.gridStndValApi = e.gridApi;
					this.gridStndVal = e.grid;
					break;
				default: break
				}
				
			},		
			onDeleteRow: (e) => {
			
			},
			onInsertRow: (e) => {
			
			},
			onRowClicked: (e) => {
			
			},
			onCellClicked: (e) => {
		
			},
					
			onCellValueChanged: (e) => {
				if(e.col === "STND_CD") {
					if(this.gridStndVal.gridDataset.records[e.index].rowtype !== newScrmObj.constants.crud.create) {
						ComLib.openDialog('A', 'COME0013',['기준값 코드']);//변경할수없습니다

						this.gridStndVal.gridDataset.setValue(e.index , e.col, e.oldValue);
						this.gridStndValApi.setRowData(this.gridStndVal.gridDataset.getRecords().filter(item => item['rowtype'] !== newScrmObj.constants.crud.destroy));
					}
				}
					
			},
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
									<Label value="기준값코드/코드명"/>
									<Textfield 
										width={200}
										id = {this.state.textFieldProps.iptCdNm.id}
										name =  {this.state.textFieldProps.iptCdNm.name}
										value =  {this.state.textFieldProps.iptCdNm.value}
										placeholder =  {this.state.textFieldProps.iptCdNm.placeholder}
										minLength =   {this.state.textFieldProps.iptCdNm.minLength}
										maxLength =   {this.state.textFieldProps.iptCdNm.maxLength}
										readOnly =  {this.state.textFieldProps.iptCdNm.readOnly}
										disabled =  {this.state.textFieldProps.iptCdNm.disabled}
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
									<Label value="적용속성"/>
									<Selectbox
										id = {"apyPtyYn"}
										dataset = {ComLib.convComboList(ComLib.getCommCodeList('CMN', 'USE_FLAG'), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSel.records[0]["APY_PPTY_USE_FLAG"]}
										width = {200}
										disabled = {false}
										onChange = {this.event.selectbox.onChange}
									/>
									<Label value="기준값속성"/>
									<Selectbox
										id = {"stndYn"}
										dataset = {ComLib.convComboList(ComLib.getCommCodeList('CMN', 'USE_FLAG'), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSel.records[0]["STND_PPTY_USE_FLAG"]}
										width = {200}
										disabled = {false}
										onChange = {this.event.selectbox.onChange}
									/>
								</FlexPanel>
							</LFloatArea>
							<RFloatArea>
								<Button 
									id = {this.state.btnSearchProps.id}
									value = {this.state.btnSearchProps.value}
									disabled = {this.state.btnSearchProps.disabled}
									hidden = {this.state.btnSearchProps.hidden}
									onClick = {this.event.button.onClick}
									color="blue" fiiled="o" innerImage={true} icon = {'srch'} mt="5px"
								/>
							</RFloatArea>
						</RelativeGroup>
						</SearchPanel>
					<SubFullPanel>
						<ComponentPanel>
							<Grid
								id={this.state.stndCdGrid.id}
								areaName = {this.state.stndCdGrid.areaName}
								height= "600px"
								data = {this.state.dsStndValInfo}
								rowNum   = {true}
								onGridReady = {this.event.grid.onGridReady}
								header = {this.state.stndCdGrid.header}
								onRowClicked = {this.event.grid.onRowClicked}
								onCellClicked = {this.event.grid.onCellClicked}
								onCellValueChanged = {this.event.grid.onCellValueChanged}
								onDeleteRow = {this.event.grid.onDeleteRow}
								onInsertRow = {this.event.grid.onInsertRow}
								
							/>
							<RelativeGroup>
								<RFloatArea>
									<Button 
										id={this.state.btnSaveProps.id}
										value={this.state.btnSaveProps.value}
										disabled = {this.state.btnSaveProps.disabled}
										hidden = {this.state.btnSaveProps.hidden}
										onClick = {this.event.button.onClick}
										color="purple" fiiled="o" mt="5px"
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