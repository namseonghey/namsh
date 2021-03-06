// 로그 관리
import React from 'react';
import { FullPanel
	   , SubFullPanel
	   , RelativeGroup
	   , TabPanel
	   , Tabs } from 'components';	   
import { ComLib
	   , DataLib            } from 'common';
import SUP080100 from '../SUP080100';
import SUP080200 from '../SUP080200';
import SUP080300 from '../SUP080300';

class View extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dsSysLogList   : DataLib.datalist.getInstance(),
			dsUserLogList  : DataLib.datalist.getInstance(),
			dsTrainLogList : DataLib.datalist.getInstance(),	
		}

	}
	/*------------------------------------------------------------------------------------------------*
		1) componentDidMount () => init 함수 개념으로 이해하는게 빠름
		=> 컴포넌트가 마운트된 직후, 호출 ->  해당 함수에서 this.setState를 수행할 시, 갱신이 두번 일어나 render()함수가 두번 발생 -> 성능 저하 가능성
	 ------------------------------------------------------------------------------------------------*/
	componentDidMount () {
		
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

	/*------------------------------------------------------------------------------------------------*/
	// [4. transaction Event Zone]
	//  - transaction 관련 정의
	/*------------------------------------------------------------------------------------------------*/

	/*------------------------------------------------------------------------------------------------*/
	// [5. Callback Event Zone]
	//  - Callback 관련 정의
	/*------------------------------------------------------------------------------------------------*/
	
	/*------------------------------------------------------------------------------------------------*/
	// [6. event Zone]
	//  - 각 Component의 event 처리
	/*------------------------------------------------------------------------------------------------*/
	event = {
		tab : {
			onClick : (e) => {
			},
			onLoadData : (e) => {
				console.log(e);

				switch (e.id) {
				case 'SYS':
					ComLib.setStateInitRecords(this, "dsSysLogList", e.data);
					break;
				case 'USR':
					ComLib.setStateInitRecords(this, "dsUserLogList", e.data);
					break;
				case 'TRAIN':
					ComLib.setStateInitRecords(this, "dsTrainLogList", e.data);
					break;
				default : break;
				}
				

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
					<SubFullPanel>	
							<RelativeGroup>					
								<Tabs tabWidth='100px' onClick = {this.event.tab.onClick}>
									<TabPanel id = {'SUP080100'} index={0} label={'시스템 로그'}>
										<SUP080100										
											sysLogList = {this.state.dsSysLogList}
											onLoadData = {this.event.tab.onLoadData}
										/>
									</TabPanel>
									<TabPanel id = {'SUP080200'} index={1} label={'사용자 로그'}>
										<SUP080200										
											userLogList = {this.state.dsUserLogList}
											onLoadData  = {this.event.tab.onLoadData}
										/>
									</TabPanel>
									<TabPanel id = {'SUP080300'} index={2} label={'학습 로그'}>
										<SUP080300										
											trainLogList = {this.state.dsTrainLogList}
											onLoadData   = {this.event.tab.onLoadData}
										/>
									</TabPanel>									
								</Tabs>	
							</RelativeGroup>	
					</SubFullPanel>
				</FullPanel>
			</React.Fragment>
		)
	}
}
export default View;