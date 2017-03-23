import React from 'react'
import { StyleSheet, css } from 'aphrodite'

class ModalMenu extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      itemText: this.props.item.itemText,
      comments: this.props.item.itemComments
    }
  }

  handleClose(e){
    this.props.close(e)
  }

  handleTextChange(e) {
    this.setState({
      itemText: e.target.value
    })
  }

  handleCommentsChange(e) {
    this.setState({
      comments: e.target.value
    })
  }

  handleSave(e) {
    const {itemText, comments} = this.state
    this.props.onSave(e, itemText, comments)
  }

  handleKeyDown(e){
    if(e.key === 'Escape'){
      this.props.close(e)
    }

  }

  render(){

    const styles = StyleSheet.create({
      modal: {
        position: 'absolute',
        left: '200px',
        top: '0px',
        border: '1px solid grey',
        backgroundColor: 'white',
        width: '400px',
        height: '350px',
        zIndex: 1,
      },
      closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '20px',
        padding: '5px'
      },
      closer: {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        margin: '20px',
        marginTop: '0px'
      },
      h1: {
        marginTop: '30px',
        fontWeight: 'bold',
        marginBottom: '10px'
      },
      button: {
        marginTop: '30px',
        width: '50px',
        height: '30px'
      }
    })

    const {item} = this.props

    return (
      <div className={css(styles.modal)}>
        <div className={css(styles.closer)} onClick={this.handleClose.bind(this)}></div>
        <div className={css(styles.closeButton)} onClick={this.handleClose.bind(this)}>x</div>
        <div className={css(styles.content)}>
          <div className={css(styles.h1)}>Title: </div>
          <textarea autoFocus rows='5' value={this.state.itemText}
            onChange={this.handleTextChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}/>
          <div className={css(styles.h1)}>Comments: </div>
          <textarea rows='5' value={this.state.comments}
            onChange={this.handleCommentsChange.bind(this)} onKeyDown={this.handleKeyDown.bind(this)}/>
          <button className={css(styles.button)} onClick={this.handleSave.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}


export default ModalMenu
