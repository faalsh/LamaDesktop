import PouchDB from 'pouchdb'
import _ from 'lodash'
import store from '../store'
const db = new PouchDB('lama', {auto_compaction: true})

export const registerListenter = () => {
  return dispatch => {
    db.changes({
      since: 'now',
      live: true
    }).on('change', (changed) => {
      db.allDocs({include_docs:true}).then( result => {
        dispatch({type: 'FETCH_DATA', payload: result.rows})
      })
    } )

  }
}

export const initialLoad = () => {
  return dispatch => {
    db.allDocs({include_docs:true}).then( result => {
      dispatch({type: 'FETCH_DATA', payload: result.rows})
    })
  }
}


export const createBoard = (boardTitle) => {

  return dispatch => {
    let boardIndex = -1

    db.allDocs({include_docs: true}).then((boards) =>{
      const board = {
        _id: Date.now().toString(),
        boardIndex:boards.total_rows,
        boardTitle: boardTitle,
        members:[],
        lists: []
      }

      db.put(board,(err,result) => {
        if(err){
          // to be implemented
        } else {
          dispatch({type: 'CREATE_BOARD', payload: result.id})
        }
      })
    })
  }
}

export const createList = (boardId,listTitle) => {
  return dispatch => {

    return findBoard(boardId).then((board) => {
      board.lists.push({
        listId: Date.now(),
        listIndex: board.lists.length,
        listTitle: listTitle,
        items: []
      })
      db.put(board).then(snapshot => dispatch({type:'CREATE_LIST'}))
    })
  }
}

export const createItem = (boardId,listId, itemText) => {
  return dispatch => {

    findBoard(boardId).then((board) => {
      _.each(board.lists, (list) => {
        if(list.listId === listId) {
          const item = {
            itemId: Date.now(),
            itemIndex: list.items.length,
            itemText,
            assignees: []
          }
          list.items.push(item)
          db.put(board).then(() => dispatch({type: 'CREATE_ITEM'}))
          return false
        }
      })
    })
  }
}

export const deleteBoard = (boardId) => {

  return dispatch => {
    findBoard(boardId).then((board) => {
      db.remove(board)
      db.allDocs({include_docs:true}).then( result => {
        let sortedBoards = _.sortBy(result.rows, 'doc.boardIndex')
        for (var i = 0; i < sortedBoards.length; i++) {
          sortedBoards[i] = sortedBoards[i].doc
          sortedBoards[i].boardIndex = i
        }
        db.bulkDocs(sortedBoards)
      })
    }).then(() => dispatch({type:'DELETE_BOARD'}))
  }
}

export const deleteList = (boardId, listId) => {
  return dispatch => {

    findBoard(boardId).then((board) => {
      _.remove(board.lists,(list) => {
        return list.listId === listId
      })
      let sortedLists = _.sortBy(board.lists, 'listId')
      for (var i = 0; i < sortedLists.length; i++) {
        sortedLists[i].listIndex = i
      }
      board.lists = sortedLists

      db.put(board).then(() => dispatch({type: 'DELETE_LIST'}))
    })
  }
}

export const deleteItem = (boardId, listId, itemId) => {
  return dispatch => {

    findBoard(boardId).then((board) => {
      _.each(board.lists, (list) => {
        if(list.listId === listId){
          _.remove(list.items,(item) => {
            return item.itemId === itemId
          })
          let sortedItems = _.sortBy(list.items, 'itemIndex')
          for (var i = 0; i < sortedItems.length; i++) {
            sortedItems[i].itemIndex = i
          }
          list.items = sortedItems
          db.put(board).then(() => dispatch({type: 'DELETE_ITEM'}))
          return false
        }
      })
    })
  }
}

export const toggleBoardList = () => {
  return {type: 'TOGGLE_BOARD_LIST'}
}

export const toggleMemberList = () => {
  return {type: 'TOGGLE_MEMBER_LIST'}
}

export const selectBoard = (boardId) => {
  return ({type:'SELECT_BOARD', payload: boardId})
}

export const saveBoard = (boardId) => {
  return dispach => {
    const board = _.find(store.getState().main.boards, {id:boardId}).doc
    db.put(board).then(() =>  dispach({type: 'SAVE_BOARD'}))
  }
}

export const saveBoards = (boardId1, boardId2) => {
  return dispach => {
    const board1 = _.find(store.getState().main.boards, {id:boardId1}).doc
    const board2 = _.find(store.getState().main.boards, {id:boardId2}).doc

    db.bulkDocs([board1, board2]).then(() => dispach({type:'SAVE_BOARDS'}))

  }
}

export const swapLists = (boardId, dragListId, hoverListId) => {
  return {type: 'SWAP_LISTS', payload:{boardId, dragListId, hoverListId}}
}

export const moveItemToList = (boardId, dragListId, hoverListId, dragItemId, item) => {
  return {type: 'MOVE_ITEM_TO_LIST', payload: {boardId, dragListId, hoverListId, dragItemId, item}}
}

export const swapItems = (boardId, hoverListId, dragItemId, hoverItemId) => {
  return {type: 'SWAP_ITEMS', payload:{boardId, hoverListId, dragItemId, hoverItemId}}
}

export function updateList(boardId, listId, listTitle){
  return dispatch => {
    findBoard(boardId).then((board) => {
      _.map(board.lists, (list) => {
        if(list.listId === listId) {
          list.listTitle = listTitle
        }
      })
      db.put(board).then(() => dispatch({type:'UPDATE_LIST'}))
    })
  }
}

export function updateItem(boardId, listId, itemId, itemText) {
  return dispatch => {
    findBoard(boardId).then((board) => {
        _.each(board.lists, (list) => {
          if(list.listId === listId) {

            _.each(list.items, (item) => {
              if(item.itemId === itemId) {
                item.itemText = itemText
                db.put(board).then(() => dispatch({type: 'UPDATE_ITEM'}))
                return false
              }
            })
            return false
          }
        })
    })
  }
}

export function swapBoards(dragBoardId, hoverBoardId) {
  return {type: 'SWAP_BOARDS', payload:{dragBoardId, hoverBoardId}}

  // ref.child('boards').once('value').then(snapshot => {
  //   const boards = snapshot.val()
  //   const dragIndex = boards[dragBoardId].boardIndex
  //   const hoverIndex = boards[hoverBoardId].boardIndex
  //
  //   let updates = {}
  //   updates['boards/'+dragBoardId+'/boardIndex'] = hoverIndex
  //   updates['boards/'+hoverBoardId+'/boardIndex'] = dragIndex
  //   ref.update(updates)
  //
  // })
  // return {type:'SWAP_BOARDS'}
}

export function updateBoard(boardId, boardTitle) {
  ref.child('boards').child(boardId).child('boardTitle').set(boardTitle)
  return {type: 'UPDATE_BOARD'}
}

export function moveListToBoard(fromBoardId, toBoardId, listId) {
  return dispatch => {
    findBoard(fromBoardId).then((fromBoard) => {
      const movingList = _.find(fromBoard.lists, {listId})
      _.remove(fromBoard.lists, (list) => {
        return list.listId === listId
      })

      findBoard(toBoardId).then((toBoard) => {
        movingList.listIndex = toBoard.lists.length
        toBoard.lists.push(movingList)
        db.bulkDocs([fromBoard, toBoard])
      })

    }).then(() => dispatch({type:'MOVE_LIST_TO_BOARD'}))
  }
}

function findBoard(id) {
  return db.get(id)
}

export function addMemberToBoard(boardId, memberName) {
  return dispatch => {
    const member = {
      memberId: Date.now().toString(),
      memberName:memberName
    }

    findBoard(boardId).then((board) => {
      board.members.push(member)
      db.put(board,(err,result) => {
        if(err){
          // to be implemented
        } else {
          dispatch({type: 'ADD_MEMBER'})
        }
      })
    })
  }
}

export function deleteMemberFromBoard(boardId, memberId) {
  return dispatch => {
    findBoard(boardId).then((board) => {
      _.remove(board.members, (member) => {
        return member.memberId === memberId
      })
      db.put(board).then(() => dispatch({type: 'DELETE_MEMBER'}))
    })
  }
}

export function assignMemberToItem(boardId, listId, itemId, memberId, memberName){
  return dispatch => {

    findBoard(boardId).then((board) => {
      _.each(board.lists, (list) => {
        if(list.listId === listId) {
          _.each(list.items, (item) => {
            if(item.itemId === itemId){
              item.assignees.push({
                memberId, memberName
              })
              db.put(board).then(() => dispatch ({type: 'ASSIGN_MEMBER'}))

              return false
            }
          })
          return false
        }
      })
    })
  }
}

export function deassignMemberFromItem(boardId, listId, itemId, memberId){
  return dispatch => {

    findBoard(boardId).then((board) => {
      _.each(board.lists, (list) => {
        if(list.listId === listId) {

          _.each(list.items, (item) => {
            if(item.itemId === itemId) {

              _.remove(item.assignees, (assignee) => {
                return assignee.memberId === memberId
              })
              db.put(board).then(() => dispatch ({type: 'DEASSIGN_MEMBER'}))
              return false
            }
          })
          return false
        }
      })
    })
  }
}
