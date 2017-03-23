import React from 'react';
import {DragSource, DropTarget} from 'react-dnd'
import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenuItem'
import ContextMenuSubHeader from './ContextMenuSubHeader'
import AssignMembersPanel from './AssignMembersPanel'
import { StyleSheet, css } from 'aphrodite'
import _ from 'lodash'
import ModalMenu from './ModalMenu'

class Item extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false
    }

    this.handleDelete = this.handleDelete.bind(this)
  }

  toggleMode(e){
    console.log('toggle');
    this.setState({
      modalOpen: true
    })
  }

  onSave(evt, itemText, itemComments){
    const {boardId, listId, itemId, actions} = this.props
    actions.updateItem(boardId, listId, itemId, itemText, itemComments)
    this.setState({
      modalOpen: false
    })
    evt.stopPropagation()
  }

  handleDelete(evt){
    const {boardId, listId, itemId, actions} = this.props
    actions.deleteItem(boardId, listId, itemId)
    evt.stopPropagation()
  }

    render() {
    	const {item, boardId, listId, itemId, connectDragSource, connectDropTarget, isDragging} = this.props
      const styles = StyleSheet.create({
        base: {
          position: 'relative',
          backgroundColor: 'white',
          margin: '2px',
          padding: '4px 10px 4px 4px',
          fontSize: '12px',
          borderRadius: '3px',
          minHeight: '30px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          order: item.itemIndex
        },
        dragging: {
          backgroundColor: 'grey',
          color: 'grey',
        },
        tag: {
          fontSize:'10px',
          padding: '5px',
          color: '#548eff',
          border: '1px solid',
          borderRadius: '10px',
          margin: '2px',
          opacity: '1'
        },
        itemText: {
          display:'flex',
          flexDirection: 'column'
        },
        assignees: {
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }
    	})

      const textDisplay =
          <div className={css(styles.itemText)}>
              {item.itemText}
              <div className={css(styles.assignees)}>

                {
                  _.map(item.assignees, (assignee) => {
                    const {memberId, memberName} = assignee
                    return (
                      <div key={memberId} className={css(styles.tag)}>{memberName}</div>
                    )
                  })
                }
              </div>

          </div>
        return connectDragSource(connectDropTarget(
        	<div className={css(styles.base, isDragging && styles.dragging)} onClick={this.toggleMode.bind(this)}>
            {textDisplay}
            <ContextMenu title="Item Actions">
              <ContextMenuItem onClick={this.handleDelete} itemText="Delete"/>
              <hr />
              <ContextMenuSubHeader>Assigned Members:</ContextMenuSubHeader>
              <AssignMembersPanel boardId={boardId} listId={listId} itemId={itemId}/>
            </ContextMenu>

            {this.state.modalOpen? <ModalMenu item={item} onSave={this.onSave.bind(this)} close={(evt) => {
              this.setState({
                modalOpen: false
              })
              if(evt) evt.stopPropagation()
            }}/>:null}
        	</div>
        ))
    }
}

const itemSource = {
  beginDrag(props){
    return {
      listId: props.listId,
      itemId: props.itemId,
      done:false
    }
  }
}

const itemTarget = {
  hover(props, monitor, component) {
    const boardId = props.boardId
    const dragListId = monitor.getItem().listId
    const dragItemId = monitor.getItem().itemId
    const hoverItemId = props.itemId
    const hoverListId = props.listId
    if(dragItemId !== hoverItemId && hoverListId === dragListId) {
      props.actions.swapItems(boardId, hoverListId, dragItemId, hoverItemId)
    }
  }
}

function collect(connecter, monitor) {
  return {
    connectDragSource: connecter.dragSource(),
    isDragging: monitor.isDragging()
  }
}

Item = DragSource('Item', itemSource, collect)(Item)
Item = DropTarget('Item', itemTarget, connect => ({connectDropTarget: connect.dropTarget()}))(Item)


export default Item;
