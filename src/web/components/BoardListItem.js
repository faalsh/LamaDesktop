import React from 'react'
import {DragSource, DropTarget} from 'react-dnd'
import { StyleSheet, css } from 'aphrodite'

class BoardListItem extends React.Component {

  handleSelectBoard(key){
      this.props.actions.selectBoard(key)
  }
  handleDelete(key,e) {
     this.props.actions.deleteBoard(key)
  }

  render(){
    const {boardIndex} = this.props

    const styles = StyleSheet.create({
      base: {
        position: 'relative',
        padding: '5px',
        width: '150px',
        margin: '4px',
        borderRadius: '3px',
        backgroundColor: '#026AA7',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
        cursor: 'pointer',
        padding: '10px',
        order: boardIndex
      },
      selected: {
        backgroundColor: '#14a005',
      },
      dragging: {
        backgroundColor: 'black',
        color: 'black',
        opacity: '0.5',
      },
      deleteButton: {
        position: 'absolute',
        top: '11px',
        right: '5px',
        width: '15px',
      }
    })

    const {selectedBoard, boardId, boardTitle,
        isDragging, connectDragSource, connectDropTarget} = this.props

    return connectDragSource(connectDropTarget(
      <div  className={css(styles.base, boardId===selectedBoard && styles.selected, isDragging && styles.dragging )} onClick={this.handleSelectBoard.bind(this,boardId)}>
        {boardTitle}
        <div className={css(styles.deleteButton)} onClick={this.handleDelete.bind(this,boardId)}>x</div>
      </div>
    ))
  }
}

const boardListItemSource = {
  beginDrag(props){
    return {
      boardId: props.boardId
    }
  }
}

const boardListItemTarget = {
  hover(props, monitor, component) {
    const dragBoardId = monitor.getItem().boardId
    const hoverBoardId = props.boardId

    if(dragBoardId !== hoverBoardId) {
      props.actions.swapBoards(dragBoardId, hoverBoardId)
    }
  }
}

function collect(connecter, monitor) {
  return {
    connectDragSource: connecter.dragSource(),
    isDragging: monitor.isDragging()
  }
}

BoardListItem = DragSource('BoardListItem', boardListItemSource, collect)(BoardListItem)
BoardListItem = DropTarget('BoardListItem', boardListItemTarget, connect => ({connectDropTarget: connect.dropTarget()}))(BoardListItem)

export default BoardListItem
