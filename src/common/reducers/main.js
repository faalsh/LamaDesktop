import _ from 'lodash'

const initialState = {
	boardListOpen: false,
	memberListOpen: false,
	selectedBoard: null,
	error: null,
	export: '',
	showPrintVersion: false
}
export default function reducer(state =initialState, action){
	switch(action.type){
    case 'FETCH_DATA': {
			let selectedBoard = state.selectedBoard
			if(!selectedBoard && action.payload.length > 0) {
				const firstBoard = _.find(action.payload, {doc: {boardIndex:0}})
				selectedBoard = firstBoard.id
			}
      return {...state, boards:action.payload, selectedBoard}
    }
		case 'LOGIN_STATUS': {
			return action.payload.loggedIn?{...state, loggedIn: action.payload.loggedIn, uid: action.payload.user.uid, emailVerified: action.payload.user.emailVerified || !action.payload.user.email}:{...state, loggedIn: action.payload.loggedIn}
		}
		case 'LOGIN_ERROR': {
			return {...state, error: action.payload.errorMessage}
		}

		case 'REGISTER_ERROR': {
			return {...state, error: action.payload.errorMessage}
		}
		case 'DISMISS_ERROR': {
			return {...state, error:null}
		}
		case 'PASSWORD_RESET_ERROR': {
			return {...state, error: action.payload.errorMessage}
		}
		case 'SELECT_BOARD': {
			return {...state, selectedBoard: action.payload, boardListOpen: false}
		}
    case 'CONNECTION_STATUS': {
    	return {...state, connected:action.payload}
    }
    case 'TOGGLE_BOARD_LIST': {
    	return {...state, boardListOpen: !state.boardListOpen, memberListOpen: false}
    }
		case 'TOGGLE_MEMBER_LIST': {
			return {...state, memberListOpen: !state.memberListOpen, boardListOpen: false}
		}
    case 'CREATE_BOARD': {
    	return {...state, boardListOpen: false, selectedBoard: action.payload}
    }
		case 'SWAP_LISTS': {
			const {boardId, dragListId, hoverListId} = action.payload

			return {...state, boards: state.boards.map((board) => {
				if(board.id !== boardId) return board
				const dragListIndex = _.find(board.doc.lists, {listId: dragListId}).listIndex
				const hoverListIndex = _.find(board.doc.lists, {listId: hoverListId}).listIndex
				return {...board, doc:{...board.doc, lists: board.doc.lists.map((list) => {
					 if(list.listId === dragListId) return {...list, listIndex: hoverListIndex}
					 else if (list.listId === hoverListId) return {...list, listIndex: dragListIndex}
					 else return {...list}
				})}}
			})}
		}
		case 'SWAP_ITEMS': {
			const {boardId, hoverListId, dragItemId, hoverItemId} = action.payload

			return {...state, boards: state.boards.map((board) => {
				if(board.id !== boardId) return board
				return {...board, doc:{...board.doc, lists: board.doc.lists.map((list) =>{
					if(list.listId !== hoverListId) return list
					const dragItemIndex = _.find(list.items, {itemId: dragItemId}).itemIndex
					const hoverItemIndex = _.find(list.items, {itemId: hoverItemId}).itemIndex
					return {...list, items: list.items.map((item) =>{
						if(item.itemId === dragItemId) return {...item, itemIndex: hoverItemIndex}
						else if (item.itemId === hoverItemId) return {...item, itemIndex: dragItemIndex}
						else return {...item}
					})}
				})}}
			})}
		}
		case 'MOVE_ITEM_TO_LIST': {
			const {boardId, dragListId, hoverListId, dragItemId, item} = action.payload
			return {...state, boards: state.boards.map((board) => {
				if(board.id !== boardId) return board
				return {...board, doc:{...board.doc, lists: board.doc.lists.map((list) => {
					if(list.listId === dragListId){
						let items = list.items.slice()
						_.remove(items, (item) => {
							return item.itemId === dragItemId
						})
						items = _.sortBy(items, 'itemIndex')
						for (var i = 0; i < items.length; i++) {
							items[i].itemIndex = i
						}
						return {...list, items: items}
					} else if (list.listId === hoverListId) {
						item.itemIndex = list.items.length
						let newItems = list.items.slice()
						newItems.push(item)
						return {...list, items:newItems}
					} else {
						return {...list}
					}
				})}}
			})}
		}
		case 'SWAP_BOARDS': {
			const {dragBoardId, hoverBoardId} = action.payload
			const dragBoardIndex = _.find(state.boards, {id: dragBoardId}).doc.boardIndex
			const hoverBoardIndex = _.find(state.boards, {id: hoverBoardId}).doc.boardIndex

			return {...state, boards: state.boards.map((board) => {
				if (board.id === dragBoardId)
					return {...board, doc:{...board.doc, boardIndex: hoverBoardIndex}}
				else if (board.id === hoverBoardId)
					return {...board, doc:{...board.doc, boardIndex: dragBoardIndex}}
				else return board
			})}
		}
		case 'SHOW_PRINT_VERSION': {
			let selectedBoard = state.selectedBoard
			if(!selectedBoard && action.payload.length > 0) {
				const firstBoard = _.find(action.payload, {doc: {boardIndex:0}})
				selectedBoard = firstBoard.id
			}

			return {...state, showPrintVersion: !state.showPrintVersion, selectedBoard}
		}
		default:
			return state;
	}
}
