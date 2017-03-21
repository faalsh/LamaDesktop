import React, { Component } from 'react';
import List from './List'
import CreateList from './CreateList'
import _ from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
// import {sort} from '../../common/utils'

export default class Board extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      title: this.props.board.doc.boardTitle
    }
  }

  handleOnClick(){
    this.setState({
      editMode: true
    })
  }

  handleKeyDown(e){
    if(e.key === 'Enter'){
      const {boardId, actions} = this.props
      actions.updateBoard(boardId, this.state.title)
      this.setState({
        editMode: false
      })
    } else if (e.key === 'Escape') {
      this.setState({
        editMode: false
      })
    }
  }

  handleOnBlur(){
    this.setState({
      editMode: false
    })
  }

  onChange(e){
    this.setState({
      title: e.target.value
    })
  }





  render() {
  	const {boardTitle, lists} = this.props.board.doc
    const {boardId} = this.props

    const renderedList =_.map(lists, (list) =>
        <List key={list.listId}  list={list} listId={list.listId} boardId={boardId}/>)

  	const style = {
  		display: 'flex',
      flexDirection: 'row',
      marginTop: '10px'
  	}

    const titleStyle = {
      marginTop: '10px',
      marginLeft: '5px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '25px'
    }

    const boardStyle = {
      margin: '15px'
    }

    const editInputStyle = {
      padding: '5px',
      fontWeight: 'bold',
      fontSize: '16px'
    }


    return (

      <div style={boardStyle}>
        {
          this.state.editMode?
            <div>
              <input autoFocus style={editInputStyle} onChange={this.onChange.bind(this)}
                            onKeyDown={this.handleKeyDown.bind(this)} onBlur={this.handleOnBlur.bind(this)} value={this.state.title}/>
            </div>
            :<div onClick={this.handleOnClick.bind(this)} style={titleStyle}>{boardTitle}</div>

        }
    		<div style={style}>

          <ReactCSSTransitionGroup
              transitionName="createList"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
              transitionAppear={true}
              transitionAppearTimeout={500}>
              <div style ={{display: 'flex'}}>
              {renderedList}
              </div>
          </ReactCSSTransitionGroup>
          <CreateList  boardId={boardId}/>


    		</div>
      </div>
    );
  }
}
