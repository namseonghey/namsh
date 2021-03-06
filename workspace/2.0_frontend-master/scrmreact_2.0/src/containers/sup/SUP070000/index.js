// 채널관리
import React from 'react';
import {ComponentPanel, FlexPanel, FullPanel, SubFullPanel, LFloatArea, RFloatArea, RelativeGroup, SearchPanel} from 'components'; //버튼 컴포넌트
import {BasicButton as Button, Label} from 'components';
import {Textfield, Selectbox} from 'components';
import {Grid} from 'components';
import {ComLib, DataLib, newScrmObj, TransManager, StrLib} from 'common';

class View extends React.Component {
	constructor(props) {
		super(props);
		this.currntChennel = null;
		this.chennelGrid = null;
		this.chennelGridApi = null;
		this.state = {
			dsSrch: DataLib.datalist.getInstance([{CENT_CD: ComLib.setOrgComboValue("CENT_CD"), TEAM_CD: "", SRCH_VALUE: "", USE_FLAG: ""}]),
			dsChennelList : DataLib.datalist.getInstance(),
			
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
				btnAdd : {
					id       : 'btnAdd',
					disabled : false,
					value    : '신규',
					hidden   : false
				},
			},
			selectboxProps : {
				cmbSrchCent : {
					id : 'cmbSrchCent',
					value : '',
					width : 200,
					selected : 1,
					disabled : false
				},
				cmbSrchTeam : {
					id : 'cmbSrchTeam',
					value : '',
					width : 200,
					selected : 1,
					disabled : false
				},
				cmbSrchUseYn : {
					id       : 'cmbSrchUseYn',
					value    : '',
					width    : 80,
					selected : 0,
					disabled : false
				},
				// 상세정보 영역
				cmbCentCd : {
					id : 'cmbCentCd',
					value : '',
					width : 200,
					selected : 1,
					disabled : false
				},
				cmbTeamCd : {
					id : 'cmbTeamCd',
					value : '',
					width : 200,
					selected : 1,
					disabled : false
				},	
				cmbConstNm : {
					id : 'cmbConstNm',
					value : '',
					width : 200,
					selected : 1,
					disabled : false
				},
				cmbUseYn : {
					id : 'cmbUseYn',
					value : '',
					width : 200,
					selected : 1,
					disabled : false
				},
			},
			textFieldProps : {
				iptSrchword : {
					id          : 'iptSrchword',
					name        : 'iptSrchword',
					value       : '',
					placeholder : '성명/CD',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : false
				},
				iptConstCd : {
					id          : 'iptConstCd',
					name        : 'iptConstCd',
					value       : '',
					placeholder : '',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : true
				},
				iptConstIp : {
					id          : 'iptConstIp',
					name        : 'iptConstIp',
					value       : '',
					placeholder : '0.0.0.0',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : false
				},
				iptChennelNum : {
					id          : 'iptChennelNum',
					name        : 'iptChennelNum',
					value       : '',
					placeholder : '',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : false
				},
				iptExtNum : {
					id          : 'iptExtNum',
					name        : 'iptExtNum',
					value       : '',
					placeholder : '',
					minLength   : 1,
					maxLength   : 20,
					readOnly    : false,
					disabled    : false
				},
			},
			singleCheckProp : {
				id : 'chkUseYn',
				index : 0,
				keyProp : 'SUP080000_chkUseYn',
				value : '',
				checked : 'N',
				readOnly : false,
				disabled : false
			},
			gridProps : {
				id : 'grdCsList',
				areaName : '상당원 목록',
				header: [
					{headerName: '채널번호(자동채번)',	field: 'UNQ',	  colId: 'UNQ',		    editable: false,	width: '100', textAlign: 'center'},
					{headerName: '센터',		field: 'CENT_NM',		colId: 'CENT_NM', 		editable: false,	width: '100'},
					{headerName: '팀',			field: 'TEAM_NM',		colId: 'TEAM_NM',		editable: false,	width: '100'},
					{headerName: '상담원CD',	field: 'CONST_CD',		colId: 'CONST_CD',		editable: false,	width: '100'},
					{headerName: '상담원명',	field: 'CONST_NM',		colId: 'CONST_NM',		editable: false,	width: '100'},
					{headerName: '상담원IP',	field: 'CONST_IP',		colId: 'CONST_IP',		editable: true,	width: '100', req: true},
					{headerName: '내선번호',	field: 'EXT_NUM',		colId: 'EXT_NUM',		editable: true,	width: '100', req: true},
					{headerName: '사용여부',	 field: 'USE_FLAG',	    colId: 'USE_FLAG',   	editable: true, defaultValue : 'Y', width: 90, 
					    req: true, resizable: false, textAlign: 'center', singleClickEdit: true,
						cellEditor: 'agSelectCellEditor',
						cellEditorParams: { values : ComLib.getComCodeValue('CMN', 'USE_FLAG')},
					valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'USE_FLAG')},		
					{headerName: '등록/수정자',	field: 'REG_USR_ID',	colId: 'REG_USR_ID', 	editable: false,	width: '100', textAlign: 'center'},
					{headerName: '등록/수정 일시',	field: 'REG_DTM',	 colId: 'REG_DTM', 	    editable: false,	width: '100', textAlign: 'center'},
				],	
			}
		}

		// 이벤트 바인딩
		this.event.button.onClick = this.event.button.onClick.bind(this);
		this.event.selectbox.onChange = this.event.selectbox.onChange.bind(this);
	}
	
	/*------------------------------------------------------------------------------------------------*/
	// 1) componentDidMount () => init 함수 개념으로 이해하는게 빠름
	// => 컴포넌트가 마운트된 직후, 호출 ->  해당 함수에서 this.setState를 수행할 시, 갱신이 두번 일어나 render()함수가 두번 발생 -> 성능 저하 가능성
	/*------------------------------------------------------------------------------------------------*/
	componentDidMount () { // 조회
		if(this.validation("SUP080000_R01")) this.transaction("SUP080000_R01");
	}

	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	validation = (serviceid) => {
		let chkCnt  = 0;
		let returnVal = -1;

		switch (serviceid) {
			case 'SUP080000_R01' :
				break;
			
			case 'SUP080000_C01' :
				let chennelRecord = this.chennelGrid.gridDataset.records;

				outer : for (let intA = 0; intA < chennelRecord.length; intA ++) {
					if (chennelRecord[intA].rowtype !== newScrmObj.constants.crud.read) {
						chkCnt ++;
					}		
					
					let chennelHeader = this.state.gridProps.header;
					
					for (let i = 0; i < chennelHeader.length; i ++) {		
						if (chennelHeader[i].req === true) {
							if (StrLib.isNull(chennelRecord[intA][chennelHeader[i].field])) {
								let chennelRows = this.chennelGridApi.rowModel.rowsToDisplay;
								let chennelNum = 0;
								
								for (let i = 0; i < chennelRows.length; i ++) {
									if (chennelRows[i].data.TEMP === chennelRecord[intA].TEMP){									
										chennelNum = i;

										break;
									}
								}

								ComLib.openDialog('A', 'COME0001', [Number(chennelNum + 1) , chennelHeader[i].headerName.replace(/\*/g,'')]);
			
								returnVal = intA;

								break outer;
							}
						}
					}	

					for ( let intB = 0; intB < chennelRecord.length; intB ++ ) {							
						if (intA !== intB) {								
							
							let isDup = false;
							let dupType = ""; 
							if (String(chennelRecord[intA].CONST_IP) === String(chennelRecord[intB].CONST_IP)) {
								isDup = true;
								dupType = "상담원 IP"; 
	
							} else if (String(chennelRecord[intA].CHNL_NUM) === String(chennelRecord[intB].CHNL_NUM)) {
								isDup = true;
								dupType = "채널 번호"; 
	
							} else if (String(chennelRecord[intA].EXT_NUM) === String(chennelRecord[intB].EXT_NUM)) {
								isDup = true;
								dupType = "내선 번호"; 
	
							}
	
							if (isDup) {
								let chennelRows = this.chennelGridApi.rowModel.rowsToDisplay;
								let chennelNum = 0;
	
								for (let i = 0; i < chennelRows.length; i ++) {
									if (chennelRows[i].data.TEMP === chennelRecord[intA].TEMP){									
										chennelNum = i;
		
										break;
									}
								}
								
								ComLib.openDialog('A', 'COME0012', [Number(chennelNum + 1), Number(intB + 1), dupType ]);
								
								this.chennelGrid.moveRow(intA, true);
					
								return false;
							}						
						}
					}		
						
				}


				if (returnVal > -1) {
					this.chennelGrid.moveRow(returnVal, true);
					
					return false;
				}	

				if (chennelRecord.length < 1 || chkCnt === 0) {
					ComLib.openDialog('A', 'COME0005');

					return false;
				}
				break;
			default :
				break;
		}

		return true;
	}

	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	transaction = (serviceid) => {
		let transManager = new TransManager();
		let state = this.state;
		
		transManager.setTransId (serviceid);
		transManager.setTransUrl(transManager.constants.url.common);
		transManager.setCallBack(this.callback);
		
		try  {
			switch (serviceid) {
				case 'SUP080000_R01' :
					transManager.addConfig  ({
						dao        : transManager.constants.dao.base,
						crudh      : transManager.constants.crudh.read,
						sqlmapid   : "SUP.R_getChennelList",
						datasetsend: "dsSend",
						datasetrecv: "dsChennelList",
					});

					transManager.addConfig  ({
						dao        : transManager.constants.dao.base,
						crudh      : transManager.constants.crudh.read,
						sqlmapid   : "SUP.R_getNewChennelList",
						datasetsend: "dsSend",
						datasetrecv: "dsNewChennelList",
					});
					
					let param = {
						CENT_CD    : state.dsSrch.records[0]["CENT_CD"],
						TEAM_CD    : state.dsSrch.records[0]["TEAM_CD"],
						SRCH_VALUE : state.dsSrch.records[0]["SRCH_VALUE"].trim(),	
						USE_FLAG   : state.dsSrch.records[0]["USE_FLAG"],		
					};

					transManager.addDataset('dsSend', [ param ]);
					transManager.agent();

					break;

				case 'SUP080000_C01' :
					transManager.addConfig ({
						dao        : transManager.constants.dao.base,
						crudh      : transManager.constants.crudh.create,
						sqlmapid   : "SUP.C_setChennelList",
						datasetsend: "dsSend",
					});
										
					transManager.addDataset('dsSend', this.chennelGrid.gridDataset.getTransRecords(newScrmObj.constants.rowtype.CREATE_OR_UPDATE));
					transManager.agent();

					break;

				default :
					break;
			}
		} catch (err) {

		}
	}

	/*------------------------------------------------------------------------------------------------*/
	// [5. Callback Event Zone]
	//  - Callback 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	callback = (res) => {
		let state = this.state;
		switch (res.id) {
			case 'SUP080000_R01':
				let cnList = res.data.dsChennelList;
				let ncnList = res.data.dsNewChennelList;

				let newCnt = 0;
				for (let i = 0; i < ncnList.length; i ++) {
					let isExist = false;
					for (let j = 0; j < cnList.length; j ++) {
						if (ncnList[i].CONST_CD === cnList[j].CONST_CD) {
							isExist = true;
							break;
						}
					}
					if (!isExist) {
						cnList.push(ncnList[i]);
						cnList[cnList.length - 1].REG_DTM = "";
						cnList[cnList.length - 1].REG_USR_ID = "";
						cnList[cnList.length - 1].USE_FLAG = "Y";
						cnList[cnList.length - 1].CONST_IP = "";
						cnList[cnList.length - 1].CHNL_NUM = "";
						cnList[cnList.length - 1].EXT_NUM = "";	
						newCnt += 1;					
					}
				}
				let cnt = 0;
				for (let j = 0; j < cnList.length; j ++) {
					cnList[j].TEMP = cnt;
					cnt += 1;
				}

				ComLib.setStateInitRecords(this, "dsChennelList", cnList);

				this.setState(state);
				if (newCnt > 0) {
					ComLib.openDialog('A', 'SYSI0010', ['채널이 등록되지 않은 ' + newCnt + '명의 상담원 리스트를 자동 생성 하였습니다.']);	
				}
				
				let chennelRow = this.chennelGridApi.rowModel.rowsToDisplay[0];
				this.chennelGridApi.ensureIndexVisible(0, 'middle');	
				
				if (chennelRow.selected !== true) {
					chennelRow.setSelected(true);
				}	

				this.currntChennel = chennelRow.data.TEMP

				break; 

			case 'SUP080000_C01':
				ComLib.openDialog("A", "COMI0003");
				this.transaction("SUP080000_R01");
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
					case "btnSearch" :	// 조회
						if(this.validation("SUP080000_R01")) this.transaction('SUP080000_R01');
						break;					
					case "btnSave" : 	// 저장
						if (this.validation("SUP080000_C01")) {
							this.transaction('SUP080000_C01')
							
						}
						break;
					default : break;
				}
			}
		},
		grid: {
			onGridReady : (e) => {
				//this.setState({grdMenuApi : e.gridApi, grdMenu : e.grid});
				switch(e.id) {
					case "grdCsList":
						this.chennelGridApi = e.gridApi;
						this.chennelGrid = e.grid;
					break;
					default: break;
				}
			},
			onRowClicked: (e) => {		
				let constRows = this.chennelGridApi.rowModel.rowsToDisplay;
				let constRow;
				this.currntChennel = e.data.TEMP;
				for (let i = 0; i < constRows.length; i ++) {
					if (constRows[i].data.TEMP === e.data.TEMP){
						constRow = this.chennelGridApi.rowModel.rowsToDisplay[i];
						break;
					}
				}
				constRow.setSelected(true);
			},
			onDeleteRow: (e) => {
				
			},
			onBeforeInsertRow: (e) => {
				let rtnVal = true;
				let index = 0;
				let records = this.chennelGrid.gridDataset.records;

				for (let i = 0; i < records.length; i ++) {
					if (records[i]["TEMP"] === this.currntChennel) {
						index = i;

						break;
					}
				}
				
				return {'rtn': rtnVal, 'index': index + 1};
			},
			onInsertRow: (e) => {	
				let chennelRowNm = - 1;
				let records      = this.chennelGrid.gridDataset.records;
				let chennelRow ;
				
				let rowData = this.chennelGrid.gridDataset.getRecords();

				if (!StrLib.isNull(this.currntChennel)) {
					let index = 0;

					for (let i = 0; i < records.length; i++) {
						if (records[i]["TEMP"] === this.currntChennel) {
							index = i;

							break;
						}
					}
					chennelRowNm = index;
				}
				
				for (let i = 0; i < records.length; i ++) {
					if (e.index === i) {						
						records[i].CENT_CD   = records[chennelRowNm]["CENT_CD"];
						records[i].TEAM_CD   = records[chennelRowNm]["TEAM_CD"];
						records[i].CENT_NM   = records[chennelRowNm]["CENT_NM"];
						records[i].TEAM_NM   = records[chennelRowNm]["TEAM_NM"];
						records[i].CONST_CD  = records[chennelRowNm]["CONST_CD"];
						records[i].CONST_NM  = records[chennelRowNm]["CONST_NM"];
						records[i].CONST_IP  = records[chennelRowNm]["CONST_IP"];
						records[i].TEMP      = records.length;
						
					} 

					let data = JSON.parse(JSON.stringify(records[i]));
					Object.assign(rowData[i], data);
				}
								
				this.chennelGrid.gridDataset.setRecords(rowData);

				this.chennelGridApi.setRowData(this.chennelGrid.gridDataset.getRecords().filter(item => item['rowtype'] !== newScrmObj.constants.crud.destroy));

				let chennelRows = this.chennelGridApi.rowModel.rowsToDisplay;

				for (let i = 0; i < chennelRows.length; i ++) {
					if (chennelRows[i].data.TEMP === records[chennelRowNm].TEMP){
						chennelRow = this.chennelGridApi.rowModel.rowsToDisplay[i + 1];
						this.chennelGridApi.ensureIndexVisible(i, 'middle');	
						break;
					}
				}

				if (chennelRow.selected !== true) {
					chennelRow.setSelected(true);
				}	
			
				this.currntChennel = chennelRow.data.TEMP;

			}
		},
		input : {
			onChange : (e) => {
				switch (e.target.id) {
				case 'iptSrchword' :
					ComLib.setStateValue(this, "dsSrch", 0, "SRCH_VALUE", e.target.value);

					break;
				default : break;
				}
			}
		},
		selectbox: {
			onChange: (e) => {
				switch (e.id) {
				case 'cmbSrchCent' : 
					ComLib.setStateValue(this, "dsSrch", 0, "CENT_CD", e.target.value);
					ComLib.setStateValue(this, "dsSrch", 0, "TEAM_CD", "");

					break;
				case 'cmbSrchTeam' :
					ComLib.setStateValue(this, "dsSrch", 0, "TEAM_CD", e.target.value);

					break;
					
				case 'cmbSrchUseYn' :
					ComLib.setStateValue(this, "dsSrch", 0, "USE_FLAG", e.target.value);

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
									<Label value="센터"/>
									<Selectbox
										id = {this.state.selectboxProps.cmbSrchCent.id}
										dataset = {ComLib.convComboList(ComLib.getCentList(), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSrch.records[0]["CENT_CD"]}
										width = {200}
										disabled = {false}
										controlOrgCombo = {'CENT'}
										onChange = {this.event.selectbox.onChange}
									/>
									<Label value="팀"/>
									<Selectbox
										id = {this.state.selectboxProps.cmbSrchTeam.id}
										dataset = {ComLib.convComboList(ComLib.getTeamList(this.state.dsSrch), newScrmObj.constants.select.argument.all)}
										value = {this.state.dsSrch.records[0]["TEAM_CD"]}
										width = {200}
										disabled = {false}
										onChange = {this.event.selectbox.onChange}
									/>
									<Label value="상담원명/CD"/>
									<Textfield 
										width={200}
										id = {this.state.textFieldProps.iptSrchword.id}
										name =  {this.state.textFieldProps.iptSrchword.name}
										value =  {this.state.dsSrch.records[0]["SRCH_VALUE"]}
										placeholder =  {this.state.textFieldProps.iptSrchword.placeholder}
										minLength =   {this.state.textFieldProps.iptSrchword.minLength}
										maxLength =   {this.state.textFieldProps.iptSrchword.maxLength}
										readOnly =  {this.state.textFieldProps.iptSrchword.readOnly}
										disabled =  {this.state.textFieldProps.iptSrchword.disabled}
										onChange = {this.event.input.onChange}
									/>
									<Label value="사용여부"/>
									<Selectbox
										id       = {this.state.selectboxProps.cmbSrchUseYn.id}
										value    = {this.state.dsSrch.records[0]["USE_FLAG"]}
										dataset  = {ComLib.convComboList(ComLib.getCommCodeList('CMN', 'USE_FLAG'), newScrmObj.constants.select.argument.all)}
										width    = {this.state.selectboxProps.cmbSrchUseYn.width}
										disabled = {this.state.selectboxProps.cmbSrchUseYn.disabled}
										selected = {this.state.selectboxProps.cmbSrchUseYn.selected}
										onChange = {this.event.selectbox.onChange}
									/>
								</FlexPanel>
							</LFloatArea>
							<RFloatArea>
								<Button
									color= 'blue' fiiled= {true} innerImage={true} icon = {'srch'}
									id = {this.state.btnProps.btnSearch.id}
									value = {this.state.btnProps.btnSearch.value}
									disabled = {this.state.btnProps.btnSearch.disabled}
									hidden = {this.state.btnProps.btnSearch.hidden}
									onClick = {this.event.button.onClick}
									mt = {5}
								/>
							</RFloatArea>
						</RelativeGroup>
					</SearchPanel>
					<SubFullPanel>
						<ComponentPanel>
							<Grid
								id      = {this.state.gridProps.id} 
								ref     = {this.state.gridProps.id} 
								header  = {this.state.gridProps.header}
								areaName= {this.state.gridProps.areaName}
								height  = "610px"

								addRowBtn = {true}
								delRowBtn = {true}

								data = {this.state.dsChennelList}

								onGridReady       = {this.event.grid.onGridReady}
								onRowClicked      = {this.event.grid.onRowClicked}
								onBeforeInsertRow = {this.event.grid.onBeforeInsertRow}	
								onInsertRow       = {this.event.grid.onInsertRow}
								onDeleteRow       = {this.event.grid.onDeleteRow}	
							/>	
							<RelativeGroup>
								<RFloatArea>
									<Button
										color    ="purple"
										fiiled   = {true} 
										id       = {this.state.btnProps.btnSave.id}
										value    = {this.state.btnProps.btnSave.value}
										disabled = {this.state.btnProps.btnSave.disabled}
										hidden   = {this.state.btnProps.btnSave.hidden}
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
export default View;