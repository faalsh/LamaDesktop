import React from 'react';
import { StyleSheet, css } from 'aphrodite'

class ContextMenuItem extends React.Component {

    render() {
      const styles = StyleSheet.create({
        item: {
      		fontSize: '16px',
      		fontWeight: 'bold',
      		padding: '10px',
              ':hover': {
                  backgroundColor: '#dadada'
              }
      	}
      })
        return(
        	<div className={css(styles.item)} onClick={this.props.onClick}>{this.props.itemText}</div>
        )
    }
}

export default ContextMenuItem;
