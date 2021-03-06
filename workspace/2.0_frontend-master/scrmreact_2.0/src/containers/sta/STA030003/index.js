// 오인식문장관리
import React from 'react';
import {
	ComponentPanel, RFloatArea, RelativeGroup
} from 'components';
//버튼 컴포넌트
import {Label} from 'components';
import {Grid} from 'components';
import {DataLib} from 'common';

class View extends React.Component {
	constructor(props) {
		super();

		this.state = {
			dsStudyLogInfo : DataLib.datalist.getInstance()
		}
	}
	componentDidMount () {

	}
	render () {
		return (
			<React.Fragment>
				<ComponentPanel>
					<RelativeGroup>
						<RFloatArea>
							<Label value="최근 3개월 학습 로그만 표시합니다."/>
						</RFloatArea>
					</RelativeGroup>
					<Grid
						height= "300px"
						data = {this.state.dsStudyLogInfo}
						header = {
							[
								{headerName: '학습일자',	field: 'BIZ_PSB_YN',	colId: 'BIZ_PSB_YN' },
								{headerName: '타이틀',		field: 'TEAM_CD',		colId: 'TEAM_CD',	},
								{headerName: '상태',		field: 'USR_CD',		colId: 'USR_CD',	},
							]
						}
					/>
				</ComponentPanel>
			</React.Fragment>
		)
	}
}

export default View;