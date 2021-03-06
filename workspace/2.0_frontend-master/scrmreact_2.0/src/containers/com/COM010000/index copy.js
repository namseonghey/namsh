// 대시보드
import React from 'react';
import {SubFullPanel, FlexPanel, ComponentPanel, RelativeGroup} from 'components';
import {ScrmLineBarChart, ScrmBarChart, ProgressBar, Selectbox} from 'components';
import { PieChart, FullOption } from 'react-minimal-pie-chart';
import {Label} from 'components';
import {ComLib, DataLib, StrLib, TransManager, newScrmObj} from 'common';

const svrDivColor = ['#33CC33','#CCFFCC','#66FFFF','#CC3300','#9966FF'];


class View extends React.Component {
	/*------------------------------------------------------------------------------------------------*/
	// [1. Default State Zone] 
	/*------------------------------------------------------------------------------------------------*/
	constructor(props) {
		
		super(props);
		
		this.state = {
			selectboxProps : {
				id : 'svrList',
				dataset : [{}],
				width : 200,
				selected : 1,
				disabled : false
			},
			options : {
				XAsisKey : '',
				dataKey : [{}],
			},
			dailyOptions :{
				YAsisKey : 'PATH',
				dataKey : [{key: '/', color: ''}],
			
			},
			dsResStatsticDaily : {
				SV_NM : '',
				REG_DTM : '',
				CPU : '',
				MEM : '',
				IO : '',
				DISK : '',
				SWAP : '',
				PROC_STATE : '',
				MIN_CPU : '',
				MIN_IO : '',
				MIN_MEM : '',
				MIN_SWAP : '',
				MAX_CPU : '',
				MAX_IO : '',
				MAX_MEM : '',
				MAX_SWAP : '',
			},
			dsJobStatisticDaily : {		
				SUCC_CNT_PERCENTAGE : '',
				FAIL_CNT_PERCENTAGE : '',
				REG_TIME : '',
				TOTAL_CNT : 0,
				SUCC_CNT : 0,
				FAIL_CNT : 0,
				FILE_SIZE : 0,
				FILE_LENGTH : 0,
				TYPEN : 0,
				TYPER : 0,
				TYPES : 0,
			},
		

			dsSrvDailyJobInfo : DataLib.datalist.getInstance([
			]),

			dsSrvDailyResInfo : DataLib.datalist.getInstance([
			]),
				
		}
		
		this.event.selectbox.onChange = this.event.selectbox.onChange.bind(this);
		
	}
	/*------------------------------------------------------------------------------------------------*/
	// [2. OnLoad Event Zone]
	/*------------------------------------------------------------------------------------------------*/

	componentDidMount () {
		this.transaction('COM010000_R01');
	}
	/*------------------------------------------------------------------------------------------------*/
	// [3. validation Event Zone]
	//  - validation 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	validation = (id) => {
		switch (id) {			
			case 'COM010000_R01' :				
				break;
			case 'COM010000_R02' :
				break;
			default :
				break;
		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	transaction = (serviceid) => {		
		let transManager = new TransManager();
		transManager.setProgress(false);		
		try  {
			switch (serviceid) {
			case 'COM010000_R01' :
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getSrvList",
					datasetsend:"dsSrchSvrInfo",
					datasetrecv:"dsSvrInfo"
				});
				
				transManager.addDataset('dsSrchSvrInfo', [{}]);
				transManager.agent();	
				break;

			case 'COM010000_R02' :		
				console.log("@@@@@@@@@@@@@@@@@@@@@@@@@")
				console.log(document.getElementById("_ul_mainTrayDiv"))		
				console.log(document.getElementsByClassName("scrm-tray-div-li-selected"))		
				if (document.getElementsByClassName("scrm-tray-div-li-selected") !== null) {
					console.log(document.getElementsByClassName("scrm-tray-div-li-selected")[0].id === 'tray_li_COM010000')
				}
				console.log("@@@@@@@@@@@@@@@@@@@@@@@@@")
				transManager.setTransId(serviceid);				
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
			
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getSrvJobStatistic",
					datasetsend:"dsSvrJobStaticInfo",
					datasetrecv:"dsSvrJobInfo"
				});

				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getSrvAllJobStatisticDaily",
					datasetsend:"dsSvrJobStaticInfo",
					datasetrecv:"dsSvrAllJobDailyInfo"
				});	
				
				
				transManager.addDataset('dsSvrJobStaticInfo', [{}]);										
				// transManager.addDataset('dsSvrAllJobStaticInfo', [{}]);	
				transManager.agent();
				break;

			case 'COM010000_R03' :
				transManager.setTransId(serviceid);				
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({		
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"COM.R_getSrvResourceStatisticDaily",
					datasetsend:"dsSvrResourceStaticInfoDaily",
					datasetrecv:"dsSvrResourceInfoDaily"
				});

				if(StrLib.isNull(this.state.selectboxProps.value)){
					this.state.selectboxProps.value = this.state.selectboxProps.dataset[0].name;
				}
				
				transManager.addDataset('dsSvrResourceStaticInfoDaily', [{ "SV_NM" : this.state.selectboxProps.value}]);
				transManager.agent();
				break;
			default :
				break;
			}
		} catch (err) {			
			alert(err);
		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [5. Callback Event Zone]
	//  - Callback 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	callback = (res) => {		
		switch (res.id) {
		case 'COM010000_R01' :
			for(let intA = 0; intA < res.data.dsSvrInfo.length; intA++){					
				res.data.dsSvrInfo[intA].CODE_NM = res.data.dsSvrInfo[intA]['NAME'];
				res.data.dsSvrInfo[intA].CODE    = res.data.dsSvrInfo[intA]['VALUE'];
				delete res.data.dsSvrInfo[intA].NAME;
				delete res.data.dsSvrInfo[intA].VALUE;
			}
			
			this.setState({...this.state, selectboxProps : {...this.state.selectboxProps, dataset : ComLib.convComboList(res.data.dsSvrInfo, newScrmObj.constants.select.argument.all)}});							
			
			this.transaction("COM010000_R02");

			break;

		case 'COM010000_R02' :
			res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'ALL').map((ele) => {
				this.state.dsJobStatisticDaily.TOTAL_CNT = ele.TOTAL_CNT;
				this.state.dsJobStatisticDaily.SUCC_CNT = ele.SUCC_CNT;
				this.state.dsJobStatisticDaily.FAIL_CNT = ele.FAIL_CNT;
				this.state.dsJobStatisticDaily.FILE_LENGTH = ele.FILE_LENGTH.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				this.state.dsJobStatisticDaily.FILE_SIZE = ele.FILE_SIZE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				this.state.dsJobStatisticDaily.SUCC_CNT_PERCENTAGE = ele.SUCC_CNT_PERCENTAGE;
				this.state.dsJobStatisticDaily.FAIL_CNT_PERCENTAGE = ele.FAIL_CNT_PERCENTAGE;
			});

			if(res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'N').length > 0){
				res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'N').map((ele) => {
					this.state.dsJobStatisticDaily.TYPEN = ele.TOTAL_CNT;
				
				});
			}

			if(res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'R').length > 0) {
				res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'R').map((ele) => {
					this.state.dsJobStatisticDaily.TYPER = ele.TOTAL_CNT;
				
				});
			}
			
			if(res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'S').length > 0) {
				res.data.dsSvrJobInfo.filter((item) => item.JOB_TP === 'S').map((ele) => {
					this.state.dsJobStatisticDaily.TYPES = ele.TOTAL_CNT;
				
				});
			}			
		
			let obj = {};
			let svrJobArr = [];
			let svr= [];
			let svrChartView = []
			let strJobData= [];
			let fillArr = [];
			let number = "";

			let fillTimeLineObj = {};

			for(let intA = 0; intA < 24; intA ++){
				if(intA < 10)
					number += "0" + intA + ":" + 0 + ",";
				else if(intA < 23)
					number += intA + ":" + 0 + ",";
				else
					number += intA + ":" + 0;
			}
			fillTimeLineObj.TIMELINE = number;

			for(let intA=0; intA<res.data.dsSvrAllJobDailyInfo.length; intA++ ){
				svr[intA] = res.data.dsSvrAllJobDailyInfo[intA].SV_NM;
				svrChartView.push({"key" : svr[intA], "color" : svrDivColor[intA]} );
				strJobData[intA] = res.data.dsSvrAllJobDailyInfo[intA].TIMELINE;
				fillArr = fillTimeLineObj.TIMELINE.split(',');
				let arr = strJobData[intA].split(',');
				
				for(let intB=0; intB<fillArr.length; intB++){
					for(let intC=0; intC<arr.length; intC++){
						if ( fillArr[intB].substring(0, 2) === arr[intC].substring(0, 2) ) {
							fillArr[intB] = arr[intC];
						}
					}
					obj.name = fillArr[intB].substring(3,4);		
					svr[intA-1] = svr[intA-1] === undefined ? svr[intA] : svr[intA-1];

					if(obj.name === fillArr[intB].substring(1,3) && ( svr[intA-1] !== svr[intA] ) ){	
					//  같은 시각 작업 Index를 찾는다. (prev <--> curr)
						let index = svrJobArr.findIndex(x => x.name === obj.name);							
						svrJobArr[index][svr[intA]] = fillArr[intB].substring(3,4);	
					}else{		
						svrJobArr.push(
							{
								"name" : obj.name,
								[svr[intA]] :fillArr[intB].substring(3,4)
							}
						)								
					}
				}
			}

			this.setState({...this.state, dsJobStatisticDaily : this.state.dsJobStatisticDaily});
			this.setState({...this.state, options : {...this.state.options,	dataKey : svrChartView }});
			ComLib.setStateInitRecords(this, "dsSrvDailyJobInfo", svrJobArr);
			this.transaction("COM010000_R03");
			break;
			
		case 'COM010000_R03' :			
			let strResData= [];
			let svrResArr = [];
			let svrBarChartView = [];
			if(res.data.dsSvrResourceInfoDaily.length > 0) {		
				console.log(res.data.dsSvrResourceInfoDaily)
				console.log(res.data.dsSvrResourceInfoDaily)
				strResData = JSON.parse(res.data.dsSvrResourceInfoDaily[0].DISK);
				for (var intA = 0; intA < strResData.length; intA++) {
					let key = strResData[intA].PATH;
					let value = strResData[intA].USAGE;	
					svrResArr.push({ [key] : value});
					svrBarChartView.push({"key" : strResData[intA].PATH });
					svrBarChartView[intA].color = svrDivColor[intA];
				}
				this.setState({...this.state, dailyOptions : {...this.state.dailyOptions, dataKey : svrBarChartView }});
				ComLib.setStateInitRecords(this, "dsSrvDailyResInfo", svrResArr);				
				this.setState({...this.state, dsResStatsticDaily : res.data.dsSvrResourceInfoDaily[0]});  				
			}else{
				this.state.dsResStatsticDaily.CPU = '0';
				this.state.dsResStatsticDaily.MEM = '0';
				this.state.dsResStatsticDaily.IO = '0';
				this.state.dsResStatsticDaily.DISK = '0';		
				this.state.dsResStatsticDaily.MIN_CPU = '0';
				this.state.dsResStatsticDaily.MIN_MEM = '0';
				this.state.dsResStatsticDaily.MAX_CPU = '0';
				this.state.dsResStatsticDaily.MAX_MEM = '0';
				this.setState({...this.state, dailyOptions : {...this.state.dailyOptions, dataKey : [{key: '/', color: '#ffcf02'}] }});
				ComLib.setStateRecords(this, "dsSrvDailyResInfo", []);				
				this.setState({...this.state, dsResStatsticDaily : this.state.dsResStatsticDaily});
			}
			setTimeout(() => {
				// this.transaction('COM010000_R02');
			}, 30000);	
			break;
		default :  break;
		}
	}
	/*------------------------------------------------------------------------------------------------*/
	// [6. event Zone]
	//  - 각 Component의 event 처리
	/*------------------------------------------------------------------------------------------------*/
	event = {
		button : {
			onClick : () =>  {   
				
			}
		},
		selectbox : {
			onChange : (e) => {				
				switch (e.id) {
				case 'svrList' :			
					this.setState({...this.state, selectboxProps : {...this.state.selectboxProps, selected : e.target.selectedIndex, value : e.target.value}}, () => this.transaction('COM010000_R03'));
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
		let data = [
			{ title: '성공 ', value: this.state.dsJobStatisticDaily.SUCC_CNT, color: '#138ce4' },
			{ title: '실패 ', value: this.state.dsJobStatisticDaily.FAIL_CNT, color: 'red' },
		]
		return (
			<React.Fragment>
				<SubFullPanel>
					<FlexPanel>
						<ComponentPanel>	
							<div className="srcm-dash-data10">
								<Selectbox
									id = {this.state.selectboxProps.id}
									value = {this.state.value}
									dataset = {this.state.selectboxProps.dataset}
									width = {this.state.selectboxProps.width}
									disabled = {this.state.selectboxProps.disabled}
									selected = {this.state.selectboxProps.selected}
									onChange= {this.event.selectbox.onChange}
								/>
							</div>					
							<h3>완료건수 <span className="scrm-dash-data1">{this.state.dsJobStatisticDaily.TOTAL_CNT}건</span></h3>
							<div className="scrm-dash-data2">
								
								<span>실시간  <b>{this.state.dsJobStatisticDaily.TYPEN}</b></span>								
								<span>수동처리 <b>{this.state.dsJobStatisticDaily.TYPES}</b></span>
							</div>
							<div className="srcm-dash-data3">
								<div>
									<p>파일길이 {this.state.dsJobStatisticDaily.FILE_LENGTH}분 </p>
								</div>
								<div>
									<p>파일크기 {this.state.dsJobStatisticDaily.FILE_SIZE}MB </p>
								</div>
							</div>
							<div className="scrm-dash-data4">
								<div>
									<PieChart
										style={{ height: '200px' }}
										data={data}
										radius={50}
										viewBoxSize={[120,120]}
										center={[60, 60]}
										lineWidth={20}
										paddingAngle={2}
										lengthAngle={360}
										label={({ dataEntry }) => dataEntry.title + Math.round(dataEntry.percentage) + '%'}
										labelPosition={60}
										labelStyle={(index) => ({
											fontSize: "0.7em",
											fill: data[index].color,
										})}		
										animate		
									/>
									<h5>성공건수 {this.state.dsJobStatisticDaily.SUCC_CNT}건</h5>									
									<h5>실패건수 {this.state.dsJobStatisticDaily.FAIL_CNT}건</h5>
								</div>
								{/* <div>
									<ProgressBar
										data={this.state.dsJobStatisticDaily.SUCC_CNT_PERCENTAGE} 
										options={{type: 'circle', status: 'active'}}
									/>
									<h5>성공건수 {this.state.dsJobStatisticDaily.SUCC_CNT}건</h5>
								</div>
								<div>
									<ProgressBar
										data={this.state.dsJobStatisticDaily.FAIL_CNT_PERCENTAGE}	
										options={{type: 'circle', status: 'error'}}
									/>
									<h5>실패건수 {this.state.dsJobStatisticDaily.FAIL_CNT}건</h5>
								</div> */}
							</div>
							<div className="scrm-dash-data5">
								<div>
									<PieChart
										style={{ height: '200px' }}
										data={data}
										radius={50}
										viewBoxSize={[120,120]}
										center={[60, 60]}
										lineWidth={20}
										paddingAngle={2}
										lengthAngle={360}
										label={({ dataEntry }) => dataEntry.title + Math.round(dataEntry.percentage) + '%'}
										labelPosition={60}
										labelStyle={(index) => ({
											fontSize: "0.7em",
											fill: data[index].color,
										})}		
										animate		
									/>
									<h5>성공건수 {this.state.dsJobStatisticDaily.SUCC_CNT}건</h5>									
									<h5>실패건수 {this.state.dsJobStatisticDaily.FAIL_CNT}건</h5>
								</div>
								{/* <div>
									<ProgressBar
										data={this.state.dsJobStatisticDaily.SUCC_CNT_PERCENTAGE} 
										options={{type: 'circle', status: 'active'}}
									/>
									<h5>성공건수 {this.state.dsJobStatisticDaily.SUCC_CNT}건</h5>
								</div>
								<div>
									<ProgressBar
										data={this.state.dsJobStatisticDaily.FAIL_CNT_PERCENTAGE}	
										options={{type: 'circle', status: 'error'}}
									/>
									<h5>실패건수 {this.state.dsJobStatisticDaily.FAIL_CNT}건</h5>
								</div> */}
							</div>
						</ComponentPanel>						
	
						<ComponentPanel>
							<div>
								<h3>서버 상황</h3>
							</div>
							<div className="scrm-dash-data11 clear">
								<div>
									<h4>DISK 사용률</h4>
									<ScrmBarChart
										width = {300}
										height = {150}
										data = {this.state.dsSrvDailyResInfo.records}	
										layout = {'vertical'}								
										dailyOptions = {this.state.dailyOptions}
									/>			
								</div>
								<div>
									<h4>CPU 사용률</h4>
									<ProgressBar
										data={this.state.dsResStatsticDaily.CPU !== undefined ? this.state.dsResStatsticDaily.CPU : 0}
										options={{type: 'circle', status: 'active'}}
									/>
									<h4>최고치 : {this.state.dsResStatsticDaily.MAX_CPU !== undefined ? this.state.dsResStatsticDaily.MAX_CPU : 0}%</h4>
									<h4>최저치 : {this.state.dsResStatsticDaily.MIN_CPU !== undefined ? this.state.dsResStatsticDaily.MAX_CPU : 0}%</h4>
								</div>
								<div>
									<h4>Memory 사용률</h4>
									{/* <ProgressBar data={this.state.dsResStatsticDaily.MEM}		options={{type: 'circle', status: 'active'}}/> */}
									<ProgressBar
										data={this.state.dsResStatsticDaily.MEM !== undefined ? this.state.dsResStatsticDaily.MEM : 0}
										options={{type: 'circle', status: 'active'}}
									/>
									<h4>최고치 : {this.state.dsResStatsticDaily.MAX_MEM !== undefined ? this.state.dsResStatsticDaily.MAX_MEM : 0}%</h4>
									<h4>최저치 : {this.state.dsResStatsticDaily.MIN_MEM !== undefined ? this.state.dsResStatsticDaily.MIN_MEM : 0}%</h4>
								</div>
							</div>
						</ComponentPanel>				
					</FlexPanel>
				</SubFullPanel>			

				<ComponentPanel>
					<RelativeGroup>
						<Label value = {"서버별 금일 작업 성공 내역"} />
						<ScrmLineBarChart 
							width = {1500}
							height = {400}
							data = {this.state.dsSrvDailyJobInfo.getRecords()}
							options = {this.state.options}							
						/>
					</RelativeGroup>
				</ComponentPanel>
			</React.Fragment>
		);
	}
}
export default View;