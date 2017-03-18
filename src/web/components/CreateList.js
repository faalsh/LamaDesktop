import React from 'react';
import { connect } from 'react-redux'
import * as LamaActions from '../../common/actions'
import { bindActionCreators } from 'redux'
import { StyleSheet, css } from 'aphrodite'


class CreateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	title: '',
          panelOpen: false
        }
    }
    handleClick(){
    	const {boardId, actions} = this.props
    	const {title} = this.state
        if(title !== '') {
            actions.createList(boardId,title)
            this.setState({
              title: '',
              panelOpen: false
            })
        }
    }
    handleClose(){
      this.setState({
        title: '',
        panelOpen: false
      })
    }
    handleChange(e) {
    	this.setState({
    		title: e.target.value
    	})
    }
    openPanel(){
      this.setState({
        panelOpen: true
      })
    }
    handleKeyDown(e){
      if(e.key === 'Enter'){
        const {boardId, actions} = this.props
        const {title} = this.state
          if(title !== '') {
              actions.createList(boardId,title)
              this.setState({
                title: '',
                panelOpen: false
              })
          }

      } else if (e.key === 'Escape') {
        this.setState({
          title: '',
          panelOpen: false
        })

      }
    }
    render() {

      const keyframes = {
        'from': {
          opacity: 0,
        },
        'to': {
          opacity: 1,
        }
      }

      const styles = StyleSheet.create({
        panel: {
      		padding: '5px',
      		margin: '5px',
      		borderRadius: '3px',
      		backgroundColor: 'lightgrey',
      		boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
          height: '100%',
          width: '200px',
          display: 'flex',
          flexDirection: 'column'
      	},
        input: {
          width: '185px',
          height: '20px',
          fontWeight: 'bold',
          marginTop: '10px',
          marginLeft: '5px',
          marginBottom:'10px'
        },
        panelButton: {
          padding: '5px',
      		width: '70px',
      		height: '20px',
      		fontSize: '12px',
      		background: 'linear-gradient(to bottom,#61BD4F 0,#5AAC44 100%)',
      		color: 'white',
      		boxShadow: '0 1px 0 #3F6F21',
      		cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '5px',
          marginBottom:'10px'
        },
        panelBottom: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        },
        closeButton: {
          marginLeft: '15px',
          marginBottom: '10px',
          fontSize: '25px',
          cursor: 'pointer'
        },
        addButton: {
          margin: '3px',
          backgroundColor: '#006ba9',
          color:'white',
          height:'20px',
          width: '200px',
          padding: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent:'center',
          cursor: 'pointer',
          opacity: '.7',
          ':hover': {
            backgroundColor: '#51bfff'
          }
        },
        // animate: {
        //   animationName: keyframes,
        //   animationDuration: '500ms'
        // }
      })

      const AddListForm = () => {
        return (
          <div className={css(styles.panel, styles.animate)}>
            <div>
              <input autoFocus onChange={this.handleChange.bind(this)} className={css(styles.input)}
                value={this.state.title} placeholder="List title" onKeyDown={this.handleKeyDown.bind(this)}/>
            </div>
            <div className={css(styles.panelBottom)}>
              <div onClick={this.handleClick.bind(this)} className={css(styles.panelButton)}>
                Save
              </div>
              <div onClick={this.handleClose.bind(this)} className={css(styles.closeButton)}>x</div>
            </div>
          </div>
        )
      }

      const AddListButton = () => {
        return (
          <div >
            <div className={css(styles.addButton)} onClick={this.openPanel.bind(this)}>Add list</div>
          </div>
        )
      }
      return this.state.panelOpen? <AddListForm /> : <AddListButton />
    }
}

const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(LamaActions,dispatch)
})

export default connect(null, mapDispatchToProps)(CreateList);
