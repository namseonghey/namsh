// 사용자 로그
import React from 'react';
import {
	ComponentPanel, FlexPanel, SearchPanel, LFloatArea, RFloatArea, RelativeGroup, Grid
} from 'components';
//버튼 컴포넌트
import {BasicButton as Button, Label, RangeInputCalendar} from 'components';
import {StrLib, DateLib, ComLib, TransManager} from 'common';

class View extends React.Component {
	constructor(props) {
		super();
		this.state = {
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
				grdUserLog : {
					id : 'grdUserLog',
					areaName : '사용자 로그',
					header: [	
								{headerName: '활동구분'     , field: 'ACT_TP',	    colId: 'ACT_TP', width: 60, textAlign: 'center',
									valueFormatter : (param) => ComLib.getComCodeName('CMN', param.value, 'ACT_TP')},	
								{headerName: '활동코드'     , field: 'ACT_CD',	    colId: 'ACT_CD', width: 120, textAlign: 'center',
									valueFormatter : (param) => ComLib.getComCodeName('STT_USR_LOG', param.value, 'ACT_CD')},	
								{headerName: '로그등록일시' , field: 'LOG_REG_DTM',	colId: 'LOG_REG_DTM', width: 120},	
								{headerName: '센터'        , field: 'CENT_NM',	    colId: 'CENT_NM', width: 100},	
								{headerName: '팀'          , field: 'TEAM_NM',	    colId: 'TEAM_NM', width: 100},	
								{headerName: '사용자 ID'   , field: 'USR_ID',	    colId: 'USR_ID', width: 100, textAlign: 'center'},	
								{headerName: '사용자 명'   , field: 'USR_NM',	    colId: 'USR_NM', width: 100, textAlign: 'center'},	
								{headerName: '실행자'     , field: 'REG_USR_ID',	colId: 'REG_USR_ID', width: 100, textAlign: 'center'},	
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
		this.transaction("SUP080200_R01");
	}
	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	/*------------------------------------------------------------------------------------------------*/	
	validation = (...params) => {

		let transId = params[0];

		switch (transId) {
			case 'SUP080200_R01' :
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
			case "SUP080200_R01" :
				let state = this.state;

				state['grdProps']['grdUserLog']['paging'].start = 0;
				state['grdProps']['grdUserLog']['paging'].page = 1;

				this.setState(state, () => {
					this.transaction('SUP080200_R01');
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
		
		let pageStart   = state['grdProps']['grdUserLog']['paging'].start;
		let pageLimit   = state['grdProps']['grdUserLog']['paging'].size;

		try  {
			switch (transId) {
			case 'SUP080200_R01':
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getUserLogList",
					datasetsend: "dsSrch",
					datasetrecv: "dsUserLogList"
				});

				transManager.addDataset('dsSrch', 
					[{ START_DATE  : this.state.rangeCalendarProps.startDate
					,  END_DATE    : this.state.rangeCalendarProps.endDate 
					,  QUERY_START : pageStart
					,  QUERY_LIMIT : pageLimit
					}]);
				transManager.agent();

				break;		

			case 'SUP080200_R02':
				transManager.addConfig  ({
					dao        : transManager.constants.dao.base,
					crudh      : transManager.constants.crudh.read,
					sqlmapid   : "SUP.R_getUserLogList",
					datasetsend: "dsSrch",
					datasetrecv: "dsUserLogList"
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
		case 'SUP080200_R01':
			if (res.data.dsUserLogList.length > 0) {				
				this.props.onLoadData({id: "USR", data: res.data.dsUserLogList});

				state.lastStartDate = state['rangeCalendarProps'].startDate;
				state.lastEndDate   = state['rangeCalendarProps'].endDate;

				state['grdProps']['grdUserLog']['paging'].loading = false;

				this.setState(state);
			}	
			break;
		case 'SUP080200_R02':
			if (res.data.dsUserLogList.length > 0) {				
				this.props.onLoadData({id: "USR", data: res.data.dsUserLogList});

				state['grdProps']['grdUserLog']['paging'].loading = false;

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
						if (this.validation("SUP080200_R01")) this.handler.setDs('SUP080200_R01');	
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
				if (!this.state.grdProps.grdUserLog.paging.loading) {
					let state = this.state;

					state['grdProps']['grdUserLog']['paging'].start = state['grdProps']['grdUserLog']['paging'].start + state['grdProps']['grdUserLog']['paging'].size;
					state['grdProps']['grdUserLog']['paging'].page  = state['grdProps']['grdUserLog']['paging'].page + 1;
					state['grdProps']['grdUserLog']['paging'].loading = true; 

					this.setState(state, () => {
						this.transaction("SUP080200_R02");
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
							id       = {this.state.grdProps.grdUserLog.id} 
							areaName = {this.state.grdProps.grdUserLog.areaName}
							header   = {this.state.grdProps.grdUserLog.header}
							data     = {this.props.userLogList}
							height   = {this.state.grdProps.grdUserLog.height}

							addRowBtn = {false}
							delRowBtn = {false}
							rowNum    = {true}						
							paging    = {true}
							infinite  = {true}

							totalRowCnt = {(this.props.userLogList.getRecords().length === 0) ? 0 : this.props.userLogList.getValue(0, 'totalcount')}

							onScrollEnd = {this.event.grid.onScrollEnd}	
						/>	
					</RelativeGroup>	
				</ComponentPanel>		
			</React.Fragment>
		)
	}
}

export default View;