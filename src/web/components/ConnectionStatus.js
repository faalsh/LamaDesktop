import React from 'react';

class ConnectionStatus extends React.Component {

    render() {
    	const style = {
    		position: 'absolute',
    		top: 50,
    		left: 0,
    		zIndex: 1,
			  width: '100%',
			  display: 'flex',
			  justifyContent: 'flex-end'
    	}
    	const messageStyle = {
    		backgroundColor: 'black',
    		color: 'white',
    		padding: '10px',
    		opacity: '0.5',
    		marginTop: '6px',
    		marginRight: '6px',
    		borderRadius: '4px'
    	}
        return(
			<div style={style}>
				<div style={messageStyle}>Connecting ...</div>
			</div>
    	)
    }
}

export default ConnectionStatus;
