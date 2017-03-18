import React from 'react';
import { connect } from 'react-redux'
import * as LamaActions from '../../common/actions'
import { bindActionCreators } from 'redux'
import { StyleSheet, css } from 'aphrodite'

class CreateItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        	title: '',
          panelOpen: false
        }
    }
    handleClick(){
    	const {boardId, listId, actions} = this.props
    	const {title} = this.state
        if(title !== '') {
            actions.createItem(boardId, listId, title)
            this.setState({
              title: '',
              panelOpen: false
            })

        }
    }
    handleKeyDown(e){
        if(e.key === 'Enter') {
            const {boardId, listId, actions} = this.props
            const {title} = this.state
            if(title !== '') {
                actions.createItem(boardId, listId, title)
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
    handleClose(){
      this.setState({
        panelOpen: false
      })
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
      		padding: '5px',
      		margin: '5px',
          order: 1000
      	},
      	input: {
          width: '170px'
      	},
      	button: {
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
          cursor: 'pointer'
        },
        addItemButton: {
          marginTop: '10px',
          padding: '5px',
          textDecoration: 'underline',
          color: 'grey',
          cursor: 'pointer',
          ':hover': {
              backgroundColor: '#f7f5f5',
              opacity: '0.5'
          },
          order: 1000
        },
        // animate: {
        //   animationName: keyframes,
        //   animationDuration: '500ms'
        // }
      })

      const AddItemForm = () => {
        return (
          <div className={css(styles.panel)}>
        		<div>
        			<textarea autoFocus rows='3' onChange={this.handleChange.bind(this)} className={css(styles.input)} onKeyDown={this.handleKeyDown.bind(this)}
                value={this.state.title}
                ref={(input) => {
                  if(input) {
                    const length = input.value.length
                    input.selectionStart  = input.selectionEnd = length
                  }
                }}/>
        		</div>

            <div className={css(styles.panelBottom)}>
            <div onClick={this.handleClick.bind(this)} className={css(styles.button)}>
              Save
            </div>
            <div onClick={this.handleClose.bind(this)} className={css(styles.closeButton)}>×</div>
            </div>
        	</div>
        )
      }

      const AddItemButton = () => {
        return (
          <div onClick={this.handleOpen.bind(this)} className={css(styles.addItemButton)}>
            Add item
          </div>
        )
      }

      return this.state.panelOpen? <AddItemForm />:<AddItemButton />
    }
}

const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(LamaActions,dispatch)
})

export default connect(null, mapDispatchToProps)(CreateItem);
