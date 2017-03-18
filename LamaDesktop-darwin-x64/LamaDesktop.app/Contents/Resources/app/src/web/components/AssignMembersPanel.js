import React from 'react';
import { StyleSheet, css } from 'aphrodite'
import { connect } from 'react-redux'
import * as LamaActions from '../../common/actions'
import { bindActionCreators } from 'redux'
import _ from 'lodash'


class AssignMembersPanel extends React.Component {

    handleSelected(boardId, listId, itemId, memberId, memberName, checked){

      const {actions} = this.props

      if(checked){
        actions.deassignMemberFromItem(boardId, listId, itemId, memberId)
      } else {
        actions.assignMemberToItem(boardId, listId, itemId, memberId, memberName)
      }

    }

    render() {
      const {boardId, listId, itemId, boards} = this.props

      let members = []
      let assignees = []

      _.each(boards, (board) => {
        if(board.id === boardId) {
          members = board.doc.members
          _.each(board.lists, (list) => {
            if(list.listId === listId) {
              _.each(list.items , (item) => {
                if(item.itemId === itemId){
                  assignees = item.assginees
                  return false
                }
              })
              return false
            }
          })
          return false
        }
      })

      const styles = StyleSheet.create({
        panel: {
          display: 'flex',
          flexDirection: 'column',
      		fontSize: '16px',
      	},
        member: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: '10px',
          color:'#548eff'
        },
        checkbox: {
          width: '25px',
          height: '25px',
          borderRadius: '50px',
          backgroundColor: 'black',
          display: 'inline-block'
        },
        label: {
          width: '100%'
        }
      })
        return(
        	<div className={css(styles.panel)}>
            {
              _.map(members, (member) => {
                const {memberId, memberName} = member
                var checked = false
                // if(assignees) {
                //   checked = assignees[memberId] !== undefined
                // }

                return (
                  <div key={memberId} className={css(styles.member)}>
                    <label htmlFor={memberId} className={css(styles.label)}>{memberName}</label>
                    <input type="checkbox" id={memberId}
                      value={memberId}
                      checked={checked}
                      onChange={this.handleSelected.bind(this,boardId, listId, itemId, memberId, memberName, checked)}
                      className={css(styles.checkbox)}/>
                  </div>
                )
              })
            }
          </div>
        )
    }
}

const mapStateToProps = state => ({
  boards: state.main.boards,
})
const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(LamaActions,dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AssignMembersPanel);
