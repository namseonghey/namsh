// 시스템 로그
import React from 'react';
import {
	ComponentPanel, FlexPanel, SearchPanel, LFloatArea, RFloatArea, RelativeGroup, Grid
} from 'components';
//버튼 컴포넌트
import {BasicButton as Button, Label, RangeInputCalendar} from 'components';
import {StrLib, DateLib, ComLib, DataLib, TransManager} from 'common';

class View extends React.Component {
	constructor(props) {
		super();
		this.state = {
			dsSnroList : DataLib.datalist.getInstance(),
			btnProps : {
				btnSearch : {
					id : 'btnSearch',
					disabled : false,
					value : '조회',
					hidden : false
				}	
			},
			lastStartDate: "",
			lastEndDate  : "",
			grdProps : {
				grdSysLog : {
					areaName : '시스템 로그',
					header: [	
								{headerName: '프로그램명'       , field: 'PGM_NM',	    colId: 'PGM_NM', width: 120},
								{headerName: '로그코드'        , field: 'ERR_CD',	    colId: 'ERR_CD', width: 60},	
								{headerName: '로그메시지'       , field: 'ERR_MSG',	    colId: 'ERR_MSG', width: 250},	
								{headerName: '등록일시'         , field: 'REG_DTM',	    colId: 'REG_DTM', width: 100},	
								{headerName: '실행 호스트'      , field: 'EXE_HST',	    colId: 'EXE_HST', width: 100, textAlign: 'center'},	
								{headerName: '실행 호스트 IP'   , field: 'EXE_HST_IP',	colId: 'EXE_HST_IP', width: 100, textAlign: 'center'},	
							],
					height: '600px',									
					paging : {
						start: 0,
						size : Number(ComLib.getCentStndVl('00012','STND_VAL')),
						page : 1,
						loading: false
					},
				},	
			},
			rangeCalendarProps : {
				label : '기간',
				id : 'searchDateCalender',
				strtId : 'searchDateCalenderStart',
				endId : 'searchDateCalenderEnd',				
				startDate : DateLib.getAddMonth(DateLib.getToday(), -3),
				endDate : DateLib.getToday(),
				focusedInput : null,
			},
		}

	}

	componentDidMount () {
		this.transaction("SUP080100_R01");
	}
	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	/*------------------------------------------------------------------------------------------------*/	
	validation = (...params) => {

		let transId = params[0];

		switch (transId) {
			case 'SUP080100_R01' :
				if(StrLib.isNull(this.state.rangeCalendarProps.startDate) || StrLib.isNull(this.state.rangeCalendarProps.endDate) )  {
					ComLib.openDialog('A', 'COME0004', ['시작일자', '종료일자']);
					return false;
				}

				if(this.state.rangeCalendarProps.startDate > this.state.rangeCalendarProps.endDate ) {
					ComLib.openDialog('A', 'SYSI0010', ['검색시작일자가 검색종료일보다 클 수 없습니다.']);
					return false;
				}	


				break;

			default :
				break;
		}

		return true;
	}
	handler = {
		setDs : (transId) => {
			switch (transId) {
			case "SUP080100_R01" :
				let state = this.state;

				state['grdProps']['grdSysLog']['paging'].start = 0;
				state['grdProps']['grdSysLog']['paging'].page = 1;

				this.setState(state, () => {
					this.transaction('SUP080100_R01');
				});
				break;
			default: break;
			}
		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	transaction = (...params) => {
		let transId = params[0];
		let transManager = new TransManager();

		transManager.setTransId (transId);
		transManager.setTransUrl(transManager.constants.url.common);
		transManager.setCallBack(this.callback);

		let state       = this.state;	
		
		let pageStart   = state['grdProps']['grdSysLog']['paging'].start;
		let pageLimit   = state['grdProps']['grdSysLog']['paging'].size;

		try  {
			switch (transId) {
			case 'SUP080100_R01':
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getSysLogList",
					datasetsend: "dsSrch",
					datasetrecv: "dsSysLogList"
				});

				transManager.addDataset('dsSrch', 
					[{ START_DATE  : this.state.rangeCalendarProps.startDate
					,  END_DATE    : this.state.rangeCalendarProps.endDate 
					,  QUERY_START : pageStart
					,  QUERY_LIMIT : pageLimit
					}]);
				transManager.agent();

				break;		

			case 'SUP080100_R02':
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getSysLogList",
					datasetsend: "dsSrch",
					datasetrecv: "dsSysLogList"
				});

				transManager.addDataset('dsSrch', 
					[{ START_DATE  : this.state.lastStartDate
					,  END_DATE    : this.state.lastEndDate 
					,  QUERY_START : pageStart
					,  QUERY_LIMIT : pageLimit
					}]);
				transManager.agent();
				
				break;			
			default: break;
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
		case 'SUP080100_R01':
			if (res.data.dsSysLogList.length > 0) {				
				this.props.onLoadData({id: "SYS", data: res.data.dsSysLogList});

				state.lastStartDate = state['rangeCalendarProps'].startDate;
				state.lastEndDate   = state['rangeCalendarProps'].endDate;

				state['grdProps']['grdSysLog']['paging'].loading = false;

				this.setState(state);
			}	
			break;
		case 'SUP080100_R02':
			if (res.data.dsSysLogList.length > 0) {				
				this.props.onLoadData({id: "SYS", data: res.data.dsSysLogList});

				state['grdProps']['grdSysLog']['paging'].loading = false;

				this.setState(state);
			}	
			break;
		default : break;
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
					case "btnSearch" :		
						if (this.validation("SUP080100_R01")) this.handler.setDs('SUP080100_R01');	
						break;		
					default : break;					
				}
			}
		},
		inputcalendar : {
			onChange : (e) => {
				switch (e.target.id) {
					case 'searchDateCalender':
						let state = this.state;
						state['rangeCalendarProps'].startDate = e.startDate;
						state['rangeCalendarProps'].endDate   = e.endDate;
						this.setState(state); 
						break;
					default : break;				
				}
			},
		},	
		grid: {		
			onScrollEnd: (e) => {				
				if (!this.state.grdProps.grdSysLog.paging.loading) {
					let state = this.state;

					state['grdProps']['grdSysLog']['paging'].start = state['grdProps']['grdSysLog']['paging'].start + state['grdProps']['grdSysLog']['paging'].size;
					state['grdProps']['grdSysLog']['paging'].page  = state['grdProps']['grdSysLog']['paging'].page + 1;
					state['grdProps']['grdSysLog']['paging'].loading = true; 

					this.setState(state, () => {
						this.transaction("SUP080100_R02");
					});
				}
			},
		}
	}
		
	render () {
		return (
			<React.Fragment>
				<SearchPanel>
					<RelativeGroup>
						<LFloatArea>
							<FlexPanel>
							<Label value = {this.state.rangeCalendarProps.label} req={true} />
							<RangeInputCalendar
								id        = {this.state.rangeCalendarProps.id}
								startDate = {this.state.rangeCalendarProps.startDate}
								endDate   = {this.state.rangeCalendarProps.endDate}
								onChange  = {this.event.inputcalendar.onChange}
								strtId    = {this.state.rangeCalendarProps.strtId}
								endId     = {this.state.rangeCalendarProps.endId}
							/>
							</FlexPanel>
						</LFloatArea>
						<RFloatArea>
							<Button 
								id       = {this.state.btnProps.btnSearch.id}
								value    = {this.state.btnProps.btnSearch.value}
								disabled = {this.state.btnProps.btnSearch.disabled}
								hidden   = {this.state.btnProps.btnSearch.hidden}
								onClick  = {this.event.button.onClick}
								
								innerImage= {true}
								mt        = {5}							
								color     = {'blue'} 
								icon      = {'srch'}
								fiiled    = {'o'}
							/>
						</RFloatArea>
					</RelativeGroup>
				</SearchPanel>	
				<ComponentPanel>				
					<RelativeGroup>	
						<Grid
							id       = {this.state.grdProps.grdSysLog.id} 
							areaName = {this.state.grdProps.grdSysLog.areaName}
							header   = {this.state.grdProps.grdSysLog.header}
							data     = {this.props.sysLogList}
							height   = {this.state.grdProps.grdSysLog.height}

							addRowBtn = {false}
							delRowBtn = {false}
							rowNum    = {true}						
							paging    = {true}
							infinite  = {true}

							totalRowCnt = {(this.props.sysLogList.getRecords().length === 0) ? 0 : this.props.sysLogList.getValue(0, 'totalcount')}

							onScrollEnd = {this.event.grid.onScrollEnd}	
						/>	
					</RelativeGroup>	
				</ComponentPanel>		
			</React.Fragment>
		)
	}
}

export default View;