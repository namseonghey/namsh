// 권한관리
import React from 'react';
import {ComponentPanel, FlexPanel, FullPanel, RFloatArea, RelativeGroup} from 'components'; //버튼 컴포넌트
import {BasicButton as Button} from 'components';
import {Grid} from 'components';
import {ComLib, DataLib, StrLib, TransManager, newScrmObj} from 'common';

class View extends React.Component {
	constructor(props) {
		super(props);
		
		this.grdAuth = null;
		this.grdPrgm = null;
		this.grdAuthApi = null;
		this.grdPrgmApi = null;
		//this.authLv = '';
		this.isRowClicked = false;

		this.state = {
			dsAuthInfo : DataLib.datalist.getInstance(),
			dsPrgmInfo : DataLib.datalist.getInstance(),

			grdProps : {
				grdAuthInfo : {
					id : 'grdAuthInfo',
					areaName : '권한목록',
					header : [
						{headerName: '사용자권한', field: 'AUTH_NM', colId: 'AUTH_NM', req: true},
						{headerName: '권한레벨', field: 'AUTH_LV', colId: 'AUTH_LV', req: true, resizable: false,}
					]
				},		
				grdPrgmInfo : {
					id : 'grdPrgmInfo',
					areaName : '프로그램목록',
					header : [
						{headerName: '', field: '', colId: '', headerCheckboxSelection: true, checkboxSelection: true, width: '25'},
						{headerName : '프로그램ID', field: 'MNU_ID', colId: 'MNU_ID'},
						{headerName : '상위메뉴', field: 'PARE_MNU_ID', colId: 'PARE_MNU_ID'},
						{headerName : '프로그램명', field: 'MNU_NM', colId: 'MNU_NM'},
						{headerName : '메뉴유형', field: 'MNU_TP_NM', colId: 'MNU_TP_NM', resizable: false}
					]
				}
			},

			btnPrgmSaveProps : {
				id       : 'prgmSaveBtn',
				disabled : false,
				value    : '저장',
				hidden   : false
			},
		}

		this.event.button.onClick = this.event.button.onClick.bind(this);
	}
	/*------------------------------------------------------------------------------------------------*
	1) componentDidMount () => init 함수 개념으로 이해하는게 빠름
	=> 컴포넌트가 마운트된 직후, 호출 ->  해당 함수에서 this.setState를 수행할 시, 갱신이 두번 일어나 render()함수가 두번 발생 -> 성능 저하 가능성
	------------------------------------------------------------------------------------------------*/
	componentDidMount () {
		if (this.validation("SUP030000_R01")) this.transaction("SUP030000_R01");
	}
	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	// SUP030000_R01 : 권한목록 조회
	// SUP030000_R02 : 프로그램목록 조회
	// SUP030000_H01 : 프로그램목록 수정
	/*------------------------------------------------------------------------------------------------*/
	validation = (...params) => {
		let transId = params[0];
		switch (transId) {
			case 'SUP030000_R01':
				break;
			case 'SUP030000_R02':
				break;
			case 'SUP030000_H01':
				break;
			default : break;
		}
		return true;
	}
	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	// SUP030000_R01 : 권한목록 조회
	// SUP030000_R02 : 프로그램목록 조회
	// SUP030000_H01 : 프로그램목록 수정
	/*------------------------------------------------------------------------------------------------*/
	transaction = (...params) => {
		let transId = params[0];

		let transManager = new TransManager();
		try {
			switch (transId) {
			case 'SUP030000_R01':
				transManager.setTransId(transId);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"SUP.R_getAuthList",
					datasetsend:"dsAuthInfo",
					datasetrecv:"dsAuthRecv",
				});
				transManager.addDataset('dsAuthInfo', [{}]);

				transManager.agent();

				break;

			case 'SUP030000_R02':
				transManager.setTransId(transId);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"SUP.R_getPrgmList",
					datasetsend:"dsPrgmInfo",
					datasetrecv:"dsPrgmRecv",
				});
				transManager.addDataset('dsPrgmInfo', [{"AUTH_LV": params[1]}]);

				transManager.agent();
				break;

			case 'SUP030000_H01':
				transManager.setTransId (transId);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.destroy,
					sqlmapid   : "SUP.D_handlePrgmList",
					datasetsend: "dsPrgmInfoDel",
				}); 

				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.create,
					sqlmapid   : "SUP.C_handlePrgmList",
					datasetsend: "dsPrgmInfoInst",
				});

				let temp = [];
				for(let i=0; i<this.grdPrgmApi.getSelectedRows().length; i++)
				{
					temp.push({ 
						AUTH_LV: this.grdAuthApi.getSelectedRows()[0].AUTH_LV, 
						MNU_ID: this.grdPrgmApi.getSelectedRows()[i].MNU_ID
					});
				 }

				transManager.addDataset('dsPrgmInfoDel', [{"AUTH_LV": this.grdAuthApi.getSelectedRows()[0].AUTH_LV}]);
				transManager.addDataset('dsPrgmInfoInst', temp);
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
	// SUP030000_R01 : 권한목록 조회
	// SUP030000_R02 : 프로그램목록 조회
	// SUP030000_H01 : 프로그램목록 수정
	/*------------------------------------------------------------------------------------------------*/
	callback = (res) => {
		let data;
		let { currentRowAuth } = this.state; 
		let authRowNm = 0;

		if (!StrLib.isNull(currentRowAuth)) {
			authRowNm = this.state.dsAuthInfo.indexOf("AUTH_LV", currentRowAuth);
		}	
		switch (res.id) {
			case 'SUP030000_R01':
				if (res.data.dsAuthRecv.length > 0) {
					ComLib.setStateInitRecords(this, "dsAuthInfo", res.data.dsAuthRecv);
					
					data = this.grdAuthApi.rowModel.rowsToDisplay[authRowNm];
					
					data.setSelected(true);

					let authCd = "";
	
					authCd = this.state.dsAuthInfo.records[authRowNm].AUTH_LV;
	
					if (this.validation("SUP030000_R02", authCd)) this.transaction("SUP030000_R02", authCd);

				} else {
					ComLib.setStateInitRecords(this, "dsAuthInfo", []);
					ComLib.setStateInitRecords(this, "dsPrgmInfo", []);
				}

				break;
			case 'SUP030000_R02':
				if (res.data.dsPrgmRecv.length > 0) {
					ComLib.setStateInitRecords(this, "dsPrgmInfo", res.data.dsPrgmRecv);

					this.grdPrgmApi.forEachNode((node) => { 
						if (node.data.CHK === 'Y') { 
							node.setSelected(true); 
						}
					});
				} else {
					//ComLib.setStateRecords(this, "dsPrgmInfo", []);
					ComLib.setStateInitRecords(this, "dsPrgmInfo", []);
					
					// stateRecord로만 바꾸면 orgRecord 라든지 데이터가 남아 있어 
					// 다른 페이지에서 에러가 발생할 확률이 있음.
					// 완전 초기화는 setStateInitRecords로 할것
				}				
				break;
			case 'SUP030000_H01':
				ComLib.openDialog("A", "COMI0003");
				this.transaction("SUP030000_R02", 
					(	this.grdAuthApi.getSelectedNodes().length > 0 
						? this.state.dsAuthInfo.records[Number(this.grdAuthApi.getSelectedNodes()[0]['id'])].AUTH_LV
						: this.state.dsAuthInfo.records[0].AUTH_LV
					)
				);
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
					case "prgmSaveBtn" :
						if (this.validation("SUP030000_H01")) this.transaction("SUP030000_H01");
						break;
					default : break;
				}
			}
		},
		// grid 이벤트
		grid: {
			onGridReady : (e) => {
				switch(e.id) {
					case "grdAuthInfo" : 
						this.grdAuth = e.grid;
						this.grdAuthApi = e.gridApi;
					break;
					case "grdPrgmInfo" :
						this.grdPrgm = e.grid;
						this.grdPrgmApi = e.gridApi;
					break;
					default: break;
				}
			},
			onRowClicked: (e) => {
				if (e.id === "grdAuthInfo") {
					let authRows = this.grdAuthApi.rowModel.rowsToDisplay;
					let authRow;
					
					// 권한목록 그리드 안에 같은 인덱스를 클릭하였을 때 트랜잭션이 돌지 않도록 만들기
					// if (this.authLv !== e.data.SML_CD) {
					// 	if (this.validation("SUP030000_R02", e.data.SML_CD)){
					// 		this.transaction("SUP030000_R02", e.data.SML_CD);
					// 	}
					// }
					
					for (let i = 0; i < authRows.length; i ++) {
						if (authRows[i].data.AUTH_LV === e.data.AUTH_LV){
							authRow = this.grdAuthApi.rowModel.rowsToDisplay[i];
							break;
						}
					}
					authRow.setSelected(true);

					if (this.validation("SUP030000_R02", e.data.AUTH_LV)){
						this.transaction("SUP030000_R02", e.data.AUTH_LV);
					}

					// this.authLv = e.data.SML_CD;

				} else if (e.id === "grdPrgmInfo") {
					if(this.grdPrgmApi.getRowNode(e.index).isSelected()) {
						this.grdPrgmApi.forEachNode((node) => {
							if (node.data.MNU_ID === e.data.MNU_ID) {
								node.setSelected(false);
								node.data.rowtype = newScrmObj.constants.crud.update
							} 
						});
					} else {
						this.grdPrgmApi.forEachNode((node) => {
							if (node.data.MNU_ID === e.data.MNU_ID) {
								node.setSelected(true);
								node.data.rowtype = newScrmObj.constants.crud.update
							} 
						});
					}
				}
			},
			onCellFocused: (e) => {

			},
			onCellClicked: (e) => {

			},
			onCellDoubleClicked: (e) => {
		
			},
			onCellValueChanged: (e) => {
				
			},
			onRowDoubleClicked: (e) => {

			},
			onCellEditingStopped: (e) => {

			},
			onSelectionChanged: (e) => {

			},
			onRowSelected: (e) => {
				if (e.id === "grdPrgmInfo") {	
					if(this.grdPrgmApi.getRowNode(e.index).isSelected()) {
						this.grdPrgmApi.forEachNode((node) => {
							if (node.data.MNU_ID === e.data.MNU_ID) {
								let childSelectedCnt = 0;

								this.grdPrgmApi.forEachNode((childNode) => {
									if (childNode.data.PARE_MNU_ID === node.data.MNU_ID) {
										if(childNode.isSelected()) {
											childSelectedCnt += 1;
										}										
									}
								});
	
								if (childSelectedCnt === 0) {
									this.grdPrgmApi.forEachNode((childNode) => {
										if (childNode.data.PARE_MNU_ID === node.data.MNU_ID && node.data.PARE_MNU_ID === null) {
											if(!childNode.isSelected()) {
												childNode.setSelected(true);
											}										
										}
									});
								} 
	
								this.grdPrgmApi.forEachNode((parentNode) => {
									if (node.data.PARE_MNU_ID === parentNode.data.MNU_ID) {										
										if(!parentNode.isSelected()) {
											parentNode.setSelected(true);
										}
									}
								});
							}
						});
					} else {
						this.grdPrgmApi.forEachNode((node) => {
							if (node.data.MNU_ID === e.data.MNU_ID) {
								let childSelectedCnt = 0;

								this.grdPrgmApi.forEachNode((childNode) => {
									if (childNode.data.PARE_MNU_ID === node.data.MNU_ID) {
										if(childNode.isSelected()) {
											childSelectedCnt += 1;
	
										}										
									}
								});
	
								if (childSelectedCnt > 0) {									
									this.grdPrgmApi.forEachNode((childNode) => {
										if (childNode.data.PARE_MNU_ID === node.data.MNU_ID) {
											if(childNode.isSelected()) {
												childNode.setSelected(false);
	
											}										
										}
									});							
								} 
								
								this.grdPrgmApi.forEachNode((parentNode) => {
									if (node.data.PARE_MNU_ID === parentNode.data.MNU_ID) {	
										let siblingSelectedCnt = 0;
	
										this.grdPrgmApi.forEachNode((siblingNode) => {
											if (siblingNode.data.PARE_MNU_ID === parentNode.data.MNU_ID) {
												if(siblingNode.isSelected()) {
													siblingSelectedCnt += 1;
			
												}										
											}
										});
	
										if (siblingSelectedCnt === 0 && parentNode.isSelected() && parentNode.data.MNU_ID.length === 3) {
											parentNode.setSelected(false);
		
										}																			
									}
								});
							}							
						});
					}
						
				}
			},
			onDeleteRow: (e) => {

			},
			onInsertRow: (e) => {

			}
		},
	}

	/*------------------------------------------------------------------------------------------------*/
	// [7. render Zone]
	//  - 화면 관련 내용 작성
	/*------------------------------------------------------------------------------------------------*/
	render () {
		return (
			<React.Fragment>
				<FullPanel>
					<FlexPanel>
						<ComponentPanel width={'65%'}>
							<Grid
								id={this.state.grdProps.grdAuthInfo.id} 
								ref={this.state.grdProps.grdAuthInfo.id}
								areaName = {this.state.grdProps.grdAuthInfo.areaName}
								rowNum = {true}
								height = "675px"
								addRowBtn = {false}
								delRowBtn = {false}
								header = {this.state.grdProps.grdAuthInfo.header}
								data = {this.state.dsAuthInfo}

								onGridReady			 = {this.event.grid.onGridReady}
								onRowClicked         = {this.event.grid.onRowClicked}
								onCellFocused        = {this.event.grid.onCellFocused}
								onCellClicked        = {this.event.grid.onCellClicked}
								onCellDoubleClicked  = {this.event.grid.onCellDoubleClicked}
								onCellValueChanged   = {this.event.grid.onCellValueChanged}
								onRowDoubleClicked   = {this.event.grid.onRowDoubleClicked}
								onCellEditingStopped = {this.event.grid.onCellEditingStopped}
								onSelectionChanged   = {this.event.grid.onSelectionChanged}
								onRowSelected        = {this.event.grid.onRowSelected}
								onDeleteRow          = {this.event.grid.onDeleteRow}
								onInsertRow          = {this.event.grid.onInsertRow}	
								sort                 = {false}
							/>
						</ComponentPanel>
						<ComponentPanel>
							<Grid
								id={this.state.grdProps.grdPrgmInfo.id} 
								ref={this.state.grdProps.grdPrgmInfo.id}
								areaName = {this.state.grdProps.grdPrgmInfo.areaName}
								height= "675px"
								addRowBtn = {false}
								delRowBtn = {false}
								rowSelection = 'multiple' 
								suppressRowClickSelection = {true}
								header = {this.state.grdProps.grdPrgmInfo.header}
								data = {this.state.dsPrgmInfo}

								onGridReady			 = {this.event.grid.onGridReady}
								onRowClicked         = {this.event.grid.onRowClicked}
								onCellFocused        = {this.event.grid.onCellFocused}
								onCellClicked        = {this.event.grid.onCellClicked}
								onCellDoubleClicked  = {this.event.grid.onCellDoubleClicked}
								onCellValueChanged   = {this.event.grid.onCellValueChanged}
								onRowDoubleClicked   = {this.event.grid.onRowDoubleClicked}
								onCellEditingStopped = {this.event.grid.onCellEditingStopped}
								onSelectionChanged   = {this.event.grid.onSelectionChanged}
								onRowSelected        = {this.event.grid.onRowSelected}
								onDeleteRow          = {this.event.grid.onDeleteRow}
								onInsertRow          = {this.event.grid.onInsertRow}	
							/>
							<RelativeGroup>
								<RFloatArea>
									<Button
										color="purple" fiiled= {true}
										id       = {this.state.btnPrgmSaveProps.id}
										value    = {this.state.btnPrgmSaveProps.value}
										disabled = {this.state.btnPrgmSaveProps.disabled}
										hidden   = {this.state.btnPrgmSaveProps.hidden}
										onClick  = {this.event.button.onClick}
										mt       = {5}
									/>
								</RFloatArea>
							</RelativeGroup>
						</ComponentPanel>
					</FlexPanel>
				</FullPanel>
			</React.Fragment>
		)
	}
}
export default View;