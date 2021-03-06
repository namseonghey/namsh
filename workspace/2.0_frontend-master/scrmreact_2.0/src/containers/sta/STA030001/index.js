// 결함 이미지 미리보기
import React from 'react';
import {
   ComponentPanel, FlexPanel, FullPanel} from 'components';
import {BasicButton as Button, Label} from 'components';
import {TransManager} from 'common';

class View extends React.Component {
	/*------------------------------------------------------------------------------------------------*/
	// [1. Default State Zone]
	/*------------------------------------------------------------------------------------------------*/
	constructor(props) {
		super(props);

		this.state = {	
			imageIndex: 1, 
			imageTotal: 3
			
		}
   }

   /*------------------------------------------------------------------------------------------------*/
   // [2. OnLoad Event Zone]
   /*------------------------------------------------------------------------------------------------*/
	componentDidMount () {

	}

   /*------------------------------------------------------------------------------------------------*/
   // [3. validation Event Zone]
   //  - validation 관련 정의
   /*------------------------------------------------------------------------------------------------*/
	validation = (serviceid) => {
		switch (serviceid) {
		case 'STA020000_R01':
			
			break;
		
		default : break;
		}

		return true;
	}

   /*------------------------------------------------------------------------------------------------*/
   // [4. transaction Event Zone]
   //  - transaction 관련 정의
   /*------------------------------------------------------------------------------------------------*/
	transaction = (...params) => {
		let serviceid = params[0];
		let transManager = new TransManager();

		try {
			switch (serviceid) {
			case 'STA020000_R01' :
				transManager.setTransId(serviceid);
				transManager.setTransUrl(transManager.constants.url.common);
				transManager.setCallBack(this.callback);
				transManager.addConfig({
					dao: transManager.constants.dao.base,
					crudh: transManager.constants.crudh.read,
					sqlmapid:"STA.R_getQAVlaStaCode",
					datasetsend:"dsSrchStaCode",
					datasetrecv:"dsSvrStatCodeInfo"
				});
				
				transManager.addDataset('dsSrchStaCode', [{}]);					
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
		case 'STA020000_R01':

			break;
	
		default : break;
		}
	}

   /*------------------------------------------------------------------------------------------------*/
   // [6. event Zone]
   //  - 각 Component의 event 처리
   /*------------------------------------------------------------------------------------------------*/
	event = {
		button: {
			onClick: (e) => {
				let state = this.state;
				let { imageIndex, imageTotal } = this.state;

				switch (e.target.id) {
				case 'imgLeft':
					if (1 < imageIndex) {
						state['imageIndex'] = state['imageIndex'] - 1;
							
					} else {
						state['imageIndex'] = imageTotal;	
						
					}

					break;

				case 'imgRight':
					if (imageIndex < imageTotal) {
						state['imageIndex'] = state['imageIndex'] + 1;
						
					} else {
						state['imageIndex'] = 1;						
						
					}					
					
					break;
					
				default : break;
				}

				this.setState(state);
			}
		}
	}

   /*------------------------------------------------------------------------------------------------*/
   // [7. render Zone]
   //  - 화면 관련 내용 작성
   /*------------------------------------------------------------------------------------------------*/

	render () {	
		let { imageIndex, imageTotal } = this.state;			
		return (
			<React.Fragment>
				<FullPanel>
					<FlexPanel>					
						<ComponentPanel>
							<div class="gallery" style={{width:"100%", height:"600px"}}>
								<a target="_blank" href="img_forest.jpg">
									<img src="img_forest.jpg" alt="Forest" height="600"></img>
								</a>
							</div>
							<Button
								id = {'imgLeft'}
								value = {'◀'}
								onClick = {this.event.button.onClick}
							/>
							<Label value={imageIndex + " / " + imageTotal}/>
							<Button
								id = {'imgRight'}
								value = {'▶'}
								onClick = {this.event.button.onClick}
							/>
						
						</ComponentPanel>	
					</FlexPanel>				
				</FullPanel>
			</React.Fragment>
			)
	}
}

export default View;