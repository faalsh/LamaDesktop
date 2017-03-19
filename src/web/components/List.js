import React from 'react';
import Item from './Item'
import { connect } from 'react-redux'
import * as LamaActions from '../../common/actions'
import { bindActionCreators } from 'redux'
import CreateItem from './CreateItem'
import {DragSource, DropTarget} from 'react-dnd'
import _ from 'lodash'
import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenuItem'


class List extends React.Component {

    constructor(props){
      super(props)
      this.state = {
        title: this.props.list.listTitle,
        edit: false
      }

      this.handleDelete = this.handleDelete.bind(this)
    }

    handleDelete(){
        const {actions, list, listId, boardId} = this.props
        actions.deleteList(boardId, listId)
    }
    onChange(e){
      this.setState({
        title: e.target.value
      })
    }

    toggleMode(){
      this.setState({
        edit: !this.state.edit
      })
    }
    handleKeyDown(e){
      if(e.key === 'Enter'){
        const {boardId, list,listId, actions} = this.props
        actions.updateList(boardId, listId, this.state.title)
        this.setState({
          edit: false
        })
      } else if (e.key === 'Escape') {
        this.setState({
          edit: false
        })
      }
    }
    handleOnBlur(){

      this.setState({
        edit: false
      })
    }


    render() {
    	const {boardId, list, listId, actions, connectDragSource, isDragging, connectDropTarget} = this.props
      const opacity = isDragging? 0.3:1
    	const style = {
        position: 'relative',
    		display: 'flex',
    		flexDirection: 'column',
    		padding: '5px',
    		margin: '5px',
    		width: '200px',
    		height: '100%',
        borderRadius: '3px',
    		backgroundColor: 'lightgrey',
    		boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
        cursor: 'pointer',
        order: list.listIndex
    	}
    	const titleStyle = {
    		fontWeight: 'bold',
    		fontSize: '14px',
    		marginBottom: '10px',
    		textAlign: 'center',
        width: '100%'
    	}
        const deleteStyle = {
          position: 'absolute',
          top:'5px',
          right: '5px',
          color: 'grey',
          cursor: 'pointer'

        }

        const editInputStyle = {
          padding: '5px',
          border: 'none',
          merginLeft: '3px',
          marginBottom: '10px',
          opacity: '0.7',
          fontWeight: 'bold'
        }

        const headerStyle = {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }

        const titleDisplay = <div onClick={this.toggleMode.bind(this)} style={titleStyle}>{list.listTitle} {list.listId}</div>
        const titleEdit =  <div><input autoFocus style={editInputStyle} onChange={this.onChange.bind(this)}
                        onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleOnBlur.bind(this)} value={this.state.title}/></div>
        const title = this.state.edit ? titleEdit:titleDisplay

        return connectDragSource( connectDropTarget (
	        <div style={{...style, opacity}}>
            <div style={headerStyle}>
              {title}
              <ContextMenu title="List Actions">
                <ContextMenuItem onClick={this.handleDelete} itemText="Delete"/>
                <ContextMenuItem  itemText="Move List to Board"/>
              </ContextMenu>
		        </div>
            {_.map(list.items,(item) => <Item key={item.itemId} item={item} itemId={item.itemId} listId={listId} boardId={boardId} actions={actions}/>)}
            <CreateItem boardId={boardId} listId={listId}/>
	        </div>
        ))
    }
}

const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(LamaActions,dispatch)
})

const mapStateToProps = state => ({
  items: state.main.items,
  boards: state.main.boards
})

const listSource = {
  beginDrag(props){
    return {
      boardId: props.boardId,
      listId: props.listId,
      listIndex: props.list.listIndex,
      items: props.list.items,
      done: false
    }
  }
}

const listTarget = {
  hover(props, monitor, component) {
    if(monitor.getItemType() === 'List') {
      const boardId = monitor.getItem().boardId
      const dragListId = monitor.getItem().listId
      const hoverListId = props.listId

      if(dragListId !== hoverListId ) {
        props.actions.swapLists(boardId, dragListId, hoverListId)
      }

      } else if(monitor.getItemType() === 'Item'){
        const boardId = props.boardId
        const dragListId = monitor.getItem().listId
        const hoverListId = props.listId
        const dragItemId = monitor.getItem().itemId

        if(dragListId !== hoverListId) {
          if(monitor.getItem().done) return
          monitor.getItem().done = true
          props.actions.moveItemToList(boardId, dragListId, hoverListId, dragItemId)
        }
    }
  },
  drop(props, monitor, component){
    // const boardId = props.boardId
    // const dragListId = monitor.getItem().listId
    // const hoverListId = props.listId
    // const dragItemId = monitor.getItem().itemId
    //
    // if(monitor.getItemType() === 'Item' && dragListId !== hoverListId) {
    //   props.actions.moveItemToList(boardId, dragListId, hoverListId, dragItemId)
    // }
    props.actions.saveBoard(_.find(props.boards, {id:props.boardId}).doc)
  }
}


function collect(connecter, monitor) {
  return {
    connectDragSource: connecter.dragSource(),
    isDragging: monitor.isDragging()
  }
}

List = DragSource('List', listSource, collect)(List)
List = DropTarget(['List', 'Item'], listTarget, connect => ({connectDropTarget: connect.dropTarget()}))(List)
// List = DropTarget('Item', itemTarget, connect => ({connectDropTarget: connect.dropTarget()}))(List)

export default connect(mapStateToProps, mapDispatchToProps)(List);
