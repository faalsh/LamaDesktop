import React, { Component } from 'react';
import Board from '../components/Board'
import Header from '../components/Header'
import { connect } from 'react-redux'
import * as LamaActions from '../../common/actions'
import { bindActionCreators } from 'redux'
import HTML5Backend from 'react-dnd-html5-backend';
import {DragDropContext} from 'react-dnd';
import _ from 'lodash'
import ConnectionStatus from '../components/ConnectionStatus'
import ErrorMessage from '../components/ErrorMessage'
import InfoMessage from '../components/InfoMessage'

class App extends Component {

  componentDidMount(){
    const {initialLoad, registerListenter} = this.props.actions
    initialLoad()
    registerListenter()
  }

  render() {
    const style = {
      fontFamily: 'Helvetica, Arial, sans-serif',
      backgroundColor: 'rgb(0, 121, 191)',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflowY: 'scroll',
      overflowX: 'scroll'
    }
		const {main, actions} = this.props
    return (
			<div style={style}>
          <div><Header main={main} actions={actions}/>
            <div style={{display:'flex', flexDirection:'row'}}>
              <div>
                 {_.map(main.boards, (board)  => main.selectedBoard === board.id ? <Board key={board.id} boardId={board.id} board={board} actions={actions}/>:null)}
              </div>
            </div>
          </div>
  			</div>
    );

  }
}

const mapStateToProps = state => ({
  main: state.main,
})
const mapDispatchToProps = dispatch =>({
  actions: bindActionCreators(LamaActions,dispatch)
})

App = DragDropContext(HTML5Backend)(App)
export default connect(mapStateToProps,mapDispatchToProps)(App)
