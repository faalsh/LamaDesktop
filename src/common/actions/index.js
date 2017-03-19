import PouchDB from 'pouchdb'
import _ from 'lodash'
import store from '../store'
const db = new PouchDB('lama', {auto_compaction: true})

// temp
window.db = db
window._ = _

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
    db.get(boardId).then((board) => {
      return db.remove(board)
    }).then(() => dispatch({type:'DELETE_BOARD'}))
  }
}

export const deleteList = (boardId, listId) => {
  return dispatch => {

    findBoard(boardId).then((board) => {
      _.remove(board.lists,(list) => {
        return list.listId === listId
      })
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

export const saveBoard = (board) => {
  return dispach => {
    db.put(board).then(() =>  dispach({type: 'SAVE_BOARD'})).catch((e) => {
      console.log('error ',e);
    })
  }
}

export const saveBoardEx = (boardId) => {
  return dispach => {
    const board = _.find(store.getState().main.boards, {id:boardId}).doc
    db.put(board).then(() =>  dispach({type: 'SAVE_BOARD'}))
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

const updateItemIndexes = (boardId, listId) => {
  ref.child('boards').child(boardId).child('lists')
    .child(listId).child('items').once('value').then(snapshot => {
      let items = snapshot.val()
      const sortedItems = _.sortBy(_.map(items,(item,itemId) => {
        return {itemId, ...item}
      }), 'itemIndex')
      for(var i=0; i<sortedItems.length; i++) {
        items[sortedItems[i].itemId].itemIndex = i
      }
      if(items){
        ref.child('boards').child(boardId).child('lists')
          .child(listId).child('items').update(items)
      }
    })
}

const updateListIndexes = (boardId) => {
  ref.child('boards').child(boardId).child('lists').once('value')
    .then(snapshot => {
      let lists = snapshot.val()
      let i = 0;
      for(const listId in lists){
        lists[listId].listIndex = i
        i++
      }
      if(lists){
        ref.child('boards').child(boardId).child('lists').update(lists)
      }
    })
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
