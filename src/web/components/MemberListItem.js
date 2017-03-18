import React from 'react'
import { StyleSheet, css } from 'aphrodite'

class MemberListItem extends React.Component {

  handleDelete(boardId, memberId) {
     this.props.actions.deleteMemberFromBoard(boardId, memberId)
  }

  render(){
    const {boardIndex} = this.props

    const styles = StyleSheet.create({
      member: {
        position:'relative',
        marginTop:'5px',
        padding: '5px',
        fontWeight: 'bold',
        backgroundColor: 'grey',
        width: '100%'
      },
      deleteButton: {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '15px',
        color: 'white',
        cursor: 'pointer'
      }
    })

    const {memberId, member, boardId} = this.props

    return (

      <div className={css(styles.member)}>
        {member}
        <div className={css(styles.deleteButton)}
          onClick={this.handleDelete.bind(this,boardId, memberId)}>x</div>

      </div>
    )
  }
}


export default MemberListItem
