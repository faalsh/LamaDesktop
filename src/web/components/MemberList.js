import React from 'react';
import _ from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import MemberListItem from './MemberListItem'

class MemberList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newMemberName: ''
    }
    this.onEscape = this.onEscape.bind(this)
  }
  handleChange(e){
    this.setState({
      newMemberName: e.target.value
    })
  }
  handleCloseList(){
    this.props.actions.toggleMemberList()
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscape);
  }

  handleKeyPress(e){
    if(e.key === 'Enter'){
      const {newMemberName} = this.state
      const {boardId} = this.props
        if(newMemberName !== '') {
            this.props.actions.addMemberToBoard(boardId, newMemberName)
            this.setState({
              newMemberName: ''
            })
        }
    }
  }

  onEscape(e){
    if(e.key === 'Escape') {
      this.props.actions.toggleMemberList()
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
          alignItems: 'left',
          margin:'10px',
          width: '150px',
          backgroundColor: 'lightgrey',
          color:'white ',
          padding: '20px',
          position: 'absolute',
          top: '30px',
          left: '85px',
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
        input: {
          width: '150px',
          height:'20px',
          fontWeight: 'bold',
          marginTop: '10px'
        },
        animate: {
          animationName: keyframes,
          animationDuration: '100ms'
        }
      })

      const {boardId, members, actions} = this.props
        return (
          <div>
            <div className={css(styles.closer)} onClick={this.handleCloseList.bind(this)}></div>
          	<div className={css(styles.panel, styles.animate)}>

              {
                  _.map(members,(member) => {
                  return (
                    <MemberListItem key={member.memberId}
                      memberId={member.memberId}
                      member={member.memberName}
                      boardId={boardId}
                      actions={actions}/>
                  )
                })
              }
              <input onChange={this.handleChange.bind(this)}
                value={this.state.newMemberName}
                placeholder="Add new member"
                onKeyPress={this.handleKeyPress.bind(this)}
                autoFocus
              className={css(styles.input)}/>
            </div>
          </div>
        )
    }
}

export default MemberList;
