import React from 'react';
import { StyleSheet, css } from 'aphrodite'
import '../assets/info.png'

class InfoMessage extends React.Component {

	handleDismiss(){
		this.props.actions.dismissError()
	}

    render() {
      const styles = StyleSheet.create({
        panel: {
          position: 'fixed',
          backgroundColor: 'white',
          top: '20%',
          // top: '50%',
          left: '50%',
          zIndex: 100,
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24)',
        },
        message: {
        	backgroundColor: '#eee',
        	height: '100%',
        	color: '#616161',
        	display: 'flex',
        	flexDirection: 'row',
        	justifyContent: 'center',
        	alignItems: 'center',
          padding: '30px',

        },
        infoIcon: {
          width: '40px',
          // height: '40px',
        },
        text: {
          marginLeft: '30px'
        }
      })
        const {message} = this.props
        return(
        	<div className={css(styles.panel)}>
        		<div className={css(styles.message)}>
              <img src='static/info.png' className={css(styles.infoIcon)} />
              <div className={css(styles.text)}>{message}</div>
        		</div>
        	</div>
    	)
    }
}

export default InfoMessage;
