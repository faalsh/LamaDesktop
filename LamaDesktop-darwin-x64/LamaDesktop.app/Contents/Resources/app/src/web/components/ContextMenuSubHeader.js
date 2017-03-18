import React from 'react';
import { StyleSheet, css } from 'aphrodite'

class ContextMenuSubHeader extends React.Component {

    render() {

      const styles = StyleSheet.create({
        item: {
      		fontSize: '16px',
          color: 'grey',
      		padding: '10px'
      	}
      })
        return(
        	<div className={css(styles.item)}>{this.props.children}</div>
        )
    }
}

export default ContextMenuSubHeader;
