import React from 'react'
import { StyleSheet, css } from 'aphrodite'
import _ from 'lodash'

class Report extends React.Component {


  render(){
    const styles = StyleSheet.create({
      board: {
        margin: '20px',
      },
      boardTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '100px',
        color: '#71261c',

      },
      listTitle: {
        marginTop: '30px',
        marginBottom: '10px',
        fontWeight: 'bold',
        fontSize: '20px'
      },
      table: {
        border: '1px solid black',
        borderCollapse: 'collapse',
        width: '100%'
      },
      header: {
        height: '30px',
        backgroundColor: '#86b768',
        textAlign: 'left',
        color: 'white'

      },
      row: {
        border: '1px solid black',
      },
      cell: {
        padding: '10px',
        fontWeight: 'bold'
      },
      task: {
        width: '70%'
      }
    })

    const {boards} = this.props

    return (

      <div>
        {
          _.sortBy(boards, 'doc.boardIndex').map(board => {
            return (
              <div key={board.id} className={css(styles.board)} ref={(body) => this.body = body}>
                <div className={css(styles.boardTitle)}>{board.doc.boardTitle}</div>
                {
                  _.sortBy(board.doc.lists, 'listIndex').map(list => {
                    return list.items.length===0? null:(
                      <div key={list.listId}>
                        <div className={css(styles.listTitle)}>{list.listTitle}</div>
                        <table className={css(styles.table)}>
                          <thead>
                            <tr>
                              <th className={css(styles.header)}>Task</th>
                              <th className={css(styles.header)}>Assignee</th>
                              <th className={css(styles.header)}>Comments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              _.sortBy(list.items, 'itemIndex').map(item =>{
                                const assignees = _.map(item.assignees, 'memberName')
                                return (
                                  <tr key={item.itemId} className={css(styles.row)}>
                                    <td className={css(styles.cell, styles.task)}>{item.itemText}</td>
                                    <td className={css(styles.cell)}>{assignees.join()}</td>
                                    <td className={css(styles.cell)}>{item.itemComments}</td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    )
                  })
                }
              </div>

            )
          })
        }
      </div>
    )
  }
}


export default Report
