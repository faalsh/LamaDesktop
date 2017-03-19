import _ from 'lodash'

const initialState = {
	boardListOpen: false,
	memberListOpen: false,
	selectedBoard: null,
	loggedIn: false,
	uid: null,
	error: null,
	emailVerified: false,
	connected: false
}
export default function reducer(state =initialState, action){
	switch(action.type){
    case 'FETCH_DATA': {
			let selectedBoard = state.selectedBoard
			if(!selectedBoard && action.payload.length > 0) {
				selectedBoard = action.payload[0].id
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

		default:
			return state;
	}
}
