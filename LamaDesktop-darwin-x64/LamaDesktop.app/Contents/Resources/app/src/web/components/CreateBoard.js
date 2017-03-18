import React from 'react';
import { connect } from 'react-redux'
import * as LamaActions from '../../common/actions'
import { bindActionCreators } from 'redux'
import { StyleSheet, css } from 'aphrodite'

class CreateBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	title: '',
          panelOpen: false
        }
    }
    handleClose(){
      this.setState({
        panelOpen: false
      })
    }
    handleClick(){
    	const {title} = this.state
        if(title !== '') {
            this.props.actions.createBoard(title)
            this.setState({
              title: '',
              panelOpen: false
            })

        }
    }
    handleKeyPress(e){
      if(e.key === 'Enter'){
        const {title} = this.state
          if(title !== '') {
              this.props.actions.createBoard(title)
              this.setState({
                title: '',
                panelOpen: false
              })
          }
      }
    }
    handleOpen(){
      this.setState({
        panelOpen: true
      })
    }
    handleChange(e) {
    	this.setState({
    		title: e.target.value
    	})
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
          width: '160px',
      		padding: '5px',
      		borderRadius: '3px',
          backgroundColor: '#026AA7',
      		boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
          marginTop: '10px',
          order: 1000
      	},
      	input: {
          width: '150px',
          height:'20px',
          fontWeight: 'bold'
      	},
      	button: {
      		margin: '3px',
      		padding: '5px',
      		textAlign: 'center',
      		width: '100px',
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
          marginBottom:'10px',
          marginTop: '10px'
      	},
        panelBottom: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        },
        closeButton: {
          marginLeft: '15px',
          fontSize: '20px',
          cursor: 'pointer',
          color: 'white'
        },
        createBoardButton: {
          marginTop: '10px',
          padding: '5px',
          textDecoration: 'underline',
          color: 'white',
          opacity: '0.8',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          height: '30px',
          alignItems: 'center',
          ':hover': {
            backgroundColor: '#44b1f1'
          },
          order: 1000
        },
        // animate: {
        //   animationName: keyframes,
        //   animationDuration: '500ms'
        // }
      })

      const CreateBoardForm = () => {
        return (
          <div className={css(styles.panel, styles.animate)}>
            <div>
              <input autoFocus onChange={this.handleChange.bind(this)} className={css(styles.input)}
                placeholder="Board title" className={css(styles.input)} value={this.state.title}
                onKeyPress={this.handleKeyPress.bind(this)}/>
            </div>
            <div className={css(styles.panelBottom)}>
              <div onClick={this.handleClick.bind(this)} className={css(styles.button)}>
                Create Board
              </div>
              <div onClick={this.handleClose.bind(this)} className={css(styles.closeButton)}>×</div>

            </div>
          </div>
        )
      }

      const CreateBoardButton = () => {
        return (
          <div onClick={this.handleOpen.bind(this)} className={css(styles.createBoardButton)}>
            Create board
          </div>
        )
      }

    return this.state.panelOpen?<CreateBoardForm /> : <CreateBoardButton />

    }
}

const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(LamaActions,dispatch)
})

export default connect(null, mapDispatchToProps)(CreateBoard);
