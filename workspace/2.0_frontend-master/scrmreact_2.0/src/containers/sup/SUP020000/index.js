// 메뉴관리
import React from 'react';
import {ComponentPanel, FlexPanel, FullPanel, SubFullPanel, LFloatArea, RFloatArea, RelativeGroup, SearchPanel} from 'components';//버튼 컴포넌트
import {BasicButton as Button, Label} from 'components';
import {Textfield, Selectbox} from 'components';
import {Grid} from 'components';
import {ComLib, DataLib, newScrmObj, StrLib, TransManager} from 'common';

class View extends React.Component {
	constructor() {
		super();
		this.grdMenu = null;
		this.grdMenuApi = null;
		this.state = {
			dsMenuInfo: DataLib.datalist.getInstance(),
			dsSel: DataLib.datalist.getInstance([{MNU_TP: "", USE_FLAG: ""}]),

			textFieldProps : {
				iptMenuId : {
					id : 'iptMenuId',
					name : 'iptMenuId',
					value : '',
					placeholder : '메뉴ID',
					minLength : 1,
					maxLength : 20,
					readOnly : false,
					disabled : false
				},
				iptMenuNm : {
					id : 'iptMenuNm',
					name : 'iptMenuNm',
					value : '',
					placeholder : '메뉴명',
					minLength : 1,
					maxLength : 20,
					readOnly : false,
					disabled : false
				}
			},
			btnMenuSearchProps : {
				id : 'menuSearchBtn',
				disabled : false,
				value : '조회',
				hidden : false
			},
			btnBMenuSaveProps : {
				id : 'menuSaveBtn',
				disabled : false,
				value : '저장',
				hidden : false
			},
			grdMenuCdProps : {
				id : 'menuCdGrid',
				areaName : '메뉴목록',
				header : [
					{headerName: '메뉴ID'    , field: 'MNU_ID'     , colId: 'MNU_ID'     , editable: true, req: true, width: '250',  cellEditor: 'customEditor', maxLength: 10, type:'code'},
					{headerName: '메뉴명'    , field: 'MNU_NM'     , colId: 'MNU_NM'     , editable: true, req: true, width: '300',  cellEditor: 'customEditor', maxLength: 45},
					{headerName: '상위메뉴ID', field: 'PARE_MNU_ID', colId: 'PARE_MNU_ID', editable: true, req: false, width: '250', cellEditor: 'customEditor', maxLength: 50},
					{headerName: '메뉴유형'  , field: 'MNU_TP'    , colId: 'MNU_TP'    , editable: true, req: true, width: '200', singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('STT_SYS_MNU', 'MNU_TP')},
						valueFormatter : (param) => ComLib.getComCodeName('STT_SYS_MNU', param.value, 'MNU_TP')},
					{headerName: '파일경로', field: 'PGM_PATH', colId: 'PGM_PATH', editable: true, req: false, width: '300', maxLength: 100},
					{headerName: '메뉴순서', field: 'SORT_ORD', colId: 'SORT_ORD', editable: true, req: true, width: '100', cellEditor: 'customEditor', maxLength: 6, type:'num'},
					{headerName: '사용여부', field: 'USE_FLAG'  , colId: 'USE_FLAG'  , editable: true, req: true, width: '100', textAlign: 'center', defaultValue : 'Y', resizable: false, singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
						valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')},	
				]
			}
		}

		this.event.button.onClick   = this.event.button.onClick.bind(this);
		this.event.grid.onInsertRow = this.event.grid.onInsertRow.bind(this);
		this.event.input.onChange   = this.event.input.onChange.bind(this);
		this.event.selectbox.onChange   = this.event.selectbox.onChange.bind(this);
	}
	/*------------------------------------------------------------------------------------------------*
		1) componentDidMount () => init 함수 개념으로 이해하는게 빠름
		=> 컴포넌트가 마운트된 직후, 호출 ->  해당 함수에서 this.setState를 수행할 시, 갱신이 두번 일어나 render()함수가 두번 발생 -> 성능 저하 가능성
	------------------------------------------------------------------------------------------------*/
	componentDidMount() {
		if (this.validation("SUP020000_R01")) this.transaction("SUP020000_R01");
	}
	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	validation = (serviceid) => {
		let chkCnt = 0;

		switch (serviceid) {
			case 'SUP020000_R01': break;
			case 'SUP020000_H01':
				let menuRecord = this.grdMenu.gridDataset.records;
				let menuHeader = this.state.grdMenuCdProps.header.filter(item => item['req'] === true);
				let menuRows = this.grdMenuApi.rowModel.rowsToDisplay;
				let menuNum = 0;

				for(let intA = 0; intA < menuRecord.length; intA++) {
					if(menuRecord[intA].rowtype !== newScrmObj.constants.crud.read){
						chkCnt++;
					}

					// req 빈칸 체크
					for (let intB = 0; intB < menuHeader.length; intB++) {
						if(StrLib.isNull(menuRecord[intA][menuHeader[intB].field])){
							// 정렬 순서를 바꿨을 때 그에 따른 index값 따라가게 하기
							for (let i = 0; i < menuRows.length; i++) {
								if (menuRows[i].data.MNU_ID === menuRecord[intA].MNU_ID){									
									menuNum = i;

									break;
								}
							}

							ComLib.openDialog('A', 'COME0001', [Number(menuNum + 1) , menuHeader[intB].headerName.replace(/\*/g,'')]);
							
							this.grdMenu.moveRow(intA, true);

							return false;
						}
					}	

					// 메뉴ID 중복체크
					if(menuRecord.filter(item => item['MNU_ID'] === menuRecord[intA]['MNU_ID']).length > 1) {
						let index = menuRecord.findIndex((ele, index) => ele['MNU_ID'] === menuRecord[intA]['MNU_ID'] && intA !== index);
						// 정렬 순서를 바꿨을 때 그에 따른 index값 따라가게 하기
						for (let i = 0; i < menuRows.length; i++) {
							if (menuRows[i].data.MNU_ID === menuRecord[intA].MNU_ID){
								menuNum = i;								

								break;
							}
						}

						ComLib.openDialog('A', 'COME0012', [Number(menuNum + 1), Number(index + 1), '메뉴ID']);

						this.grdMenu.moveRow(intA, true);

						return false;
					}

					//메뉴 저장 시, 메뉴순서 중복체크
					if(menuRecord[intA]['MNU_TP'] === '10') {
						if(menuRecord.filter(item => item['MNU_TP'] === menuRecord[intA]['MNU_TP']).filter(ele => ele['SORT_ORD'] === menuRecord[intA]['SORT_ORD']).length > 1) {
							let index = menuRecord.findIndex((ele, index) => ele['MNU_TP'] === menuRecord[intA]['MNU_TP'] && ele['SORT_ORD'] === menuRecord[intA]['SORT_ORD'] && intA !== index);
							// 정렬 순서를 바꿨을 때 그에 따른 index값 따라가게 하기
							for (let i = 0; i < menuRows.length; i++) {
								if (menuRows[i].data.MNU_ID === menuRecord[intA].MNU_ID){									
									menuNum = i;

									break;
								}
							}
							ComLib.openDialog('A', 'COME0012', [Number(intA+1), Number(index+1), '메뉴순서']);

							this.grdMenu.moveRow(intA, true);
							
							return false;
						}
					} else {
						if(menuRecord.filter(menu => menu['MNU_TP'] === menuRecord[intA]['MNU_TP']).filter(item => item['PARE_MNU_ID'] === menuRecord[intA]['PARE_MNU_ID']).filter(ele => ele['SORT_ORD'] === menuRecord[intA]['SORT_ORD']).length > 1) {
							let index = menuRecord.findIndex((ele, index) => ele['MNU_TP'] === menuRecord[intA]['MNU_TP'] && ele['PARE_MNU_ID'] === menuRecord[intA]['PARE_MNU_ID'] && ele['SORT_ORD'] === menuRecord[intA]['SORT_ORD'] && intA !== index);
							// 정렬 순서를 바꿨을 때 그에 따른 index값 따라가게 하기
							for (let i = 0; i < menuRows.length; i++) {
								if (menuRows[i].data.MNU_ID === menuRecord[intA].MNU_ID){
									menuNum = i;

									break;
								}
							}

							ComLib.openDialog('A', 'COME0012', [Number(intA+1), Number(index+1), '메뉴순서']);

							this.grdMenu.moveRow(intA, true);
							
							return false;
						}
					}
				}

				// 변경된 행이 없을 때
				if(menuRecord.length < 1 || chkCnt === 0) {
					ComLib.openDialog('A', 'COME0005');

					return false;
				}

			break;
			default : break;
		}
		return true;
	}
	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	transaction = (serviceid) => {
		let transManager = new TransManager();
		
		transManager.setTransId(serviceid);
		transManager.setTransUrl(transManager.constants.url.common);
		transManager.setCallBack(this.callback);

		try {
			switch (serviceid) {
			case 'SUP020000_R01':
				transManager.addConfig({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getMenuList",
					datasetsend: "dsUser",
					datasetrecv: "dsMenuRecv",
				});
				transManager.addDataset('dsUser', 
				[{
					"MNU_ID": this.state.textFieldProps.iptMenuId.value.trim(), 
					"MNU_NM": this.state.textFieldProps.iptMenuNm.value.trim(), 
					"MNU_TP": this.state.dsSel.records[0]["MNU_TP"],
					"USE_FLAG" : this.state.dsSel.records[0]["USE_FLAG"]
				}]);

				transManager.agent();
			break;
			case 'SUP020000_H01':
				transManager.addConfig({
					dao         : transManager.constants.dao.base,
					crudh       : transManager.constants.crudh.handle,
					sqlmapid    : "SUP.H_handleMenuList",
					datasetsend : "dsMenuInfo",
				});
				
				transManager.addDataset('dsMenuInfo', this.grdMenu.gridDataset.records);
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
		//console.log(res)
		switch (res.id) {
			case 'SUP020000_R01':
				if(res.data.dsMenuRecv.length > 0){
					ComLib.setStateInitRecords(this, "dsMenuInfo", res.data.dsMenuRecv);
				} else {
					//ComLib.setStateRecords(this, "dsMenuInfo", []);
					ComLib.setStateInitRecords(this, "dsMenuInfo", []);
					// stateRecord로만 바꾸면 orgRecord 라든지 데이터가 남아 있어 
					// 다른 페이지에서 에러가 발생할 확율이 있음.
					// 완전 초기화는 setStateInitRecords로 할것
				}
		
			break;
			case 'SUP020000_H01':
				ComLib.openDialog('A', 'COMI0003');
				this.transaction('SUP020000_R01');

			break;
			default : break;
			}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [6. event Zone]
	//  - 각 Component의 event 처리
	/*------------------------------------------------------------------------------------------------*/
	event = {
		// 버튼 이벤트
		button : {
			onClick : (e) => {
				switch (e.target.id) {
					case "menuSearchBtn" :
						if (this.validation("SUP020000_R01")) this.transaction("SUP020000_R01");
					
					break;
					case "menuSaveBtn" :
						if (this.validation("SUP020000_H01")) this.transaction("SUP020000_H01");
					break;		
					default: break;
				}
			}
		},

		// grid 이벤트
		grid: {
			onGridReady : (e) => {
				switch(e.id) {
					case "menuCdGrid":
						this.grdMenuApi = e.gridApi;
						this.grdMenu = e.grid;
					break;
					default: break;
				}
			},
			onRowClicked: () => {

			},
			onCellFocused: () => {
			
			},
			onCellClicked: () => {
				
			},
			onCellDoubleClicked: () => {
		
			},
			onCellValueChanged: (e) => {
				ComLib.setStateValue(this, "dsMenuInfo", e.index, e.col, e.newValue);
			},
			onRowDoubleClicked: () => {

			},
			onCellEditingStopped: () => {

			},
			onSelectionChanged: () => {
				
			},
			onRowSelected: () => {

			},
			onDeleteRow: (e) => {

			},
			onInsertRow: (e) => {

			}
		},
		// input 이벤트
		input : {
			onChange : (e) => {
				switch (e.target.id) {
					case 'iptMenuId' :
						let state = this.state;
						state['textFieldProps']['iptMenuId'].value = e.target.value;
						this.setState(state);
						//this.setState({...this.state, textFieldProps : { ...this.state.textFieldProps, iptMenuId : {...this.state.textFieldProps.iptMenuId, value : e.target.value }}});
					break;
					case 'iptMenuNm' :
						this.setState({...this.state, textFieldProps : { ...this.state.textFieldProps, iptMenuNm : {...this.state.textFieldProps.iptMenuNm, value : e.target.value }}});
					break;
					default : break;
				}
			}
		},
		// selectbox 이벤트
		selectbox: {
			onChange: (e) => {
				switch (e.id) {
					case 'mnuKnd':
						ComLib.setStateValue(this, "dsSel", 0, "MNU_TP", e.target.value);
					break;
					case 'useYN':
						ComLib.setStateValue(this, "dsSel", 0, "USE_FLAG", e.target.value);
					break;
					default : break;
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
									<Label value="메뉴ID"/>
									<Textfield 
										width={200}
										id = {this.state.textFieldProps.iptMenuId.id}
										name =  {this.state.textFieldProps.iptMenuId.name}
										value =  {this.state.textFieldProps.iptMenuId.value}
										placeholder =  {this.state.textFieldProps.iptMenuId.placeholder}
										minLength =   {this.state.textFieldProps.iptMenuId.minLength}
										maxLength =   {this.state.textFieldProps.iptMenuId.maxLength}
										readOnly =  {this.state.textFieldProps.iptMenuId.readOnly}
										disabled =  {this.state.textFieldProps.iptMenuId.disabled}
										onChange = {this.event.input.onChange}
									/>
									<Label value="메뉴명"/>
									<Textfield 
										width={200}
										id = {this.state.textFieldProps.iptMenuNm.id}
										name =  {this.state.textFieldProps.iptMenuNm.name}
										value =  {this.state.textFieldProps.iptMenuNm.value}
										placeholder =  {this.state.textFieldProps.iptMenuNm.placeholder}
										minLength =   {this.state.textFieldProps.iptMenuNm.minLength}
										maxLength =   {this.state.textFieldProps.iptMenuNm.maxLength}
										readOnly =  {this.state.textFieldProps.iptMenuNm.readOnly}
										disabled =  {this.state.textFieldProps.iptMenuNm.disabled}
										onChange = {this.event.input.onChange}
									/>
									<Label value="메뉴유형"/>
									<Selectbox
										id = {"mnuKnd"}
										dataset = {ComLib.convComboList(ComLib.getCommCodeList('STT_SYS_MNU', 'MNU_TP'), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSel.records[0]["MNU_TP"]}
										width = {200}
										//disabled = {false}
										onChange = {this.event.selectbox.onChange}
									/>
									<Label value="사용여부"/>
									<Selectbox
										id = {"useYN"}
										dataset = {ComLib.convComboList(ComLib.getCommCodeList('CMN','USE_FLAG'), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSel.records[0]["USE_FLAG"]}
										width = {200}
										
										onChange = {this.event.selectbox.onChange}
									/>
								</FlexPanel>
							</LFloatArea>
							<RFloatArea>
								<Button
									color= 'blue' fiiled= {true} innerImage={true} icon = {'srch'}
									id = {this.state.btnMenuSearchProps.id}
									value = {this.state.btnMenuSearchProps.value}
									disabled = {this.state.btnMenuSearchProps.disabled}
									hidden = {this.state.btnMenuSearchProps.hidden}
									onClick = {this.event.button.onClick}
									mt = {5} 
								></Button>
							</RFloatArea>
						</RelativeGroup>
					</SearchPanel>
					<SubFullPanel>
						<ComponentPanel>
							<Grid
								id={this.state.grdMenuCdProps.id} 
								ref={this.state.grdMenuCdProps.id}
								areaName = {this.state.grdMenuCdProps.areaName}
								rowNum = {true}
								height= "605px"
								header = {this.state.grdMenuCdProps.header}
								data = {this.state.dsMenuInfo}

								onGridReady = {this.event.grid.onGridReady}
								onRowClicked = {this.event.grid.onRowClicked}
								onCellFocused = {this.event.grid.onCellFocused}
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
										color="purple" fiiled= {true} 
										id 		 = {this.state.btnBMenuSaveProps.id}
										value 	 = {this.state.btnBMenuSaveProps.value}
										disabled = {this.state.btnBMenuSaveProps.disabled}
										hidden 	 = {this.state.btnBMenuSaveProps.hidden}
										onClick  = {this.event.button.onClick}
										mt 		 = {5}
									/>
								</RFloatArea>
							</RelativeGroup>
						</ComponentPanel>
					</SubFullPanel>
				</FullPanel>
			</React.Fragment>
		);
	}
}
export default View;