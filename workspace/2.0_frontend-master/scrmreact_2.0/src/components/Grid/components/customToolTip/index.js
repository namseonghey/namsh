import React, { forwardRef, useImperativeHandle, useState } from 'react';

export default forwardRef((props, ref) => {
	const [data] = useState(
		props.api.getDisplayedRowAtIndex(props.rowIndex).data
	);

	useImperativeHandle(ref, () => {
		return {
		getReactContainerClasses() {
			return ['custom-tooltip'];
		},
		};
	});
	
	return (
		
		<div
			className="custom-tooltip"
			style={{ backgroundColor: props.color || 'white'}}
			
		>
			{data[props.colDef.tooltipField]}
		</div>
	);
});
