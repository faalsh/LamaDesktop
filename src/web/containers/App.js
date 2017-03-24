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
import PrintVersion from '../components/PrintVersion'

class App extends Component {

  componentDidMount(){
    const {initialLoad, registerListenter} = this.props.actions
    initialLoad()
    registerListenter()
  }

  render() {
    const {main, actions} = this.props

    const style = {
      fontFamily: 'Helvetica, Arial, sans-serif',
      backgroundColor: main.showPrintVersion? 'white':'rgb(0, 121, 191)',
      position: main.showPrintVersion? 'relative':'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflowY: 'scroll',
      overflowX: 'scroll',
    }

    const boards = main.filteredBoards === null? main.boards:main.filteredBoards
    return (
			<div style={style}>
          <div><Header main={main} actions={actions}/>
            {
              !main.showPrintVersion?
              <div style={{display:'flex', flexDirection:'row'}}>
                <div>
                   {_.map(boards, (board)  =>
                     main.selectedBoard === board.id ? <Board key={board.id} boardId={board.id} board={board} actions={actions}/>:null)}
                </div>
              </div>:<PrintVersion boards={main.boards}/>

            }

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
