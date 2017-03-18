import React from 'react';
import CreateBoard from './CreateBoard'
import _ from 'lodash'
import BoardListItem from './BoardListItem'
import { StyleSheet, css } from 'aphrodite'


class BoardList extends React.Component {

  constructor(props){
    super(props)
    this.onEscape = this.onEscape.bind(this)
  }

  handleCloseList(){
    this.props.actions.toggleBoardList()
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscape);
  }

  onEscape(e){
    if(e.key === 'Escape') {
      this.props.actions.toggleBoardList()
    }
  }

    render() {

      const keyframes = {
        'from': {
          transform: 'translateY(-50%) scaleY(0.5)',
          opacity: 0,
        },
        'to': {
          transform: 'translateY(0) scaleY(1)',
          opacity: 1,
        }
      }
      const styles = StyleSheet.create({
        panel: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin:'10px',
          width: '150px',
          backgroundColor: '#4c94be',
          padding: '20px',
          position: 'absolute',
          top: '30px',
          left: '0px',
          zIndex: '1'
        },
        closer: {
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
           zIndex: 1,
           backgroundColor: 'black',
           opacity: '0.5'
        },
        animate: {
          animationName: keyframes,
          animationDuration: '100ms'
        }
      })

      const {boards, selectedBoard, actions} = this.props
        return (
          <div>
            <div className={css(styles.closer)} onClick={this.handleCloseList.bind(this)}></div>
          	<div className={css(styles.panel, styles.animate)}>

              {
                  _.map(boards, (board) => {
                    const {_id, boardTitle, boardIndex} = board.doc
                  return (
                    <BoardListItem key={_id} selectedBoard={selectedBoard} boardIndex={boardIndex}
                        boardId={_id} boardTitle={boardTitle}  actions={actions}/>
                  )
                })
              }
              <CreateBoard />
            </div>
          </div>
        )
    }
}

export default BoardList;
