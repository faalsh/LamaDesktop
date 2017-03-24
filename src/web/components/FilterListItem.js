import React from 'react'
import { StyleSheet, css } from 'aphrodite'

class FilterListItem extends React.Component {

  handleOnClick() {
    const {memberId, actions} = this.props
    actions.filterByMember(memberId)
  }

  render(){
    const {memberId, member, memberFilter} = this.props
    const styles = StyleSheet.create({
      member: {
        position:'relative',
        marginTop:'5px',
        padding: '5px',
        fontWeight: 'bold',
        backgroundColor: memberFilter === memberId ? '#4c94be':'grey',
        width: '100%',
        cursor: 'pointer'
      }
    })


    return (

      <div className={css(styles.member)} onClick={this.handleOnClick.bind(this)}>
        {member}
      </div>
    )
  }
}


export default FilterListItem
