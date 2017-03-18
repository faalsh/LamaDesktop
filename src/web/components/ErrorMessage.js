import React from 'react';
import { StyleSheet, css } from 'aphrodite'
import '../assets/error.png'

class ErrorMessage extends React.Component {

	handleDismiss(){
		this.props.actions.dismissError()
	}

    render() {
			const keyframes = {
				'from': {
					transform: 'scale(0)',
					opacity: 0
				},
				'to': {
					transform: 'scale(1)',
					opacity: 1
				}
			}

      const styles = StyleSheet.create({
				panel: {
					width: '350px',
					height: '200px',
					position: 'absolute',
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					margin: 'auto',
					backgroundColor: 'white',
					zIndex: 100,
					boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)',
				},
        message: {
        	backgroundColor: '#eee',
        	height: '80%',
        	color: '#616161',
        	display: 'flex',
        	flexDirection: 'column',
        	justifyContent: 'center',
        	alignItems: 'center',
        },
        dismiss: {
        	backgroundColor: '#f65656',
        	height: '20%',
        	display: 'flex',
        	justifyContent: 'center',
        	alignItems: 'center',
        	color: 'white',
        	fontWeight: 'bold',
        	fontSize: '20px',
        	cursor: 'pointer',
        },
        errorIcon: {
        	width: '50px',
        	height: '50px'
        },
        snap: {
        	fontWeight: 'bold',
        	marginTop: '10px',
        	marginBottom: '10px',
        	fontSize: '20px'
        },
        errorMessage: {
        	paddingLeft: '30px',
        	paddingRight: '30px',
        	textAlign: 'center'
        },
				animate: {
					animationName: keyframes,
					animationDuration: '200ms'
				}
      })
        const {message} = this.props
        return(
        	<div className={css(styles.panel, styles.animate)}>
        		<div className={css(styles.message)}>
        			<img className={css(styles.errorIcon)} src='static/error.png'/>
        			<div className={css(styles.snap)}>Oh snap!</div>
        			<div className={css(styles.errorMessage)}>{message}</div>
        		</div>
        		<div className={css(styles.dismiss)} onClick={this.handleDismiss.bind(this)}>Dismiss</div>
        	</div>
    	)
    }
}

export default ErrorMessage;
