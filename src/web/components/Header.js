import React from 'react';
import BoardList from './BoardList'
import MemberList from './MemberList'
import FileSaver from 'file-saver'
import store from '../../common/store'

class Header extends React.Component {


  handleBoardsClick(){
    this.props.actions.toggleBoardList()
  }

  handleMembersClick(){
    this.props.actions.toggleMemberList()
  }

  handleExport() {
    const body = JSON.stringify(store.getState().main.boards)
    const blob = new Blob([body], {type: 'text/plain;charset=utf-8'})
    FileSaver.saveAs(blob, 'kanban_'+Date.now()+'.text')
  }

  handleOpenFile() {
    this.fileInput.click()
  }

  handleImport(e) {
    const file = e.target.files[0]
    if(file) {
      const reader = new FileReader();

      reader.onload = (f) => {
        this.props.actions.importBoards(f.target.result)
      }
      reader.readAsText(file)
    }
  }


    render() {
      const {main, actions} = this.props
      const {selectedBoard, boards, memberListOpen, boardListOpen} = main
    	const style={
    		backgroundColor: '#026AA7',
        height: '50px',
        width: '100%',
        color: 'white',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    	}
      const logoStyle = {
        marginLeft: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginRight: '10px',
        width: '100%',
        fontFamily: '"Indie Flower",cursive'
      }
      const headerButtonStyle = {
        cursor: 'pointer',
        backgroundColor: '#4c94be',
        marginLeft: '10px',
        width: '100px',
        height: '30px',
        paddingLeft: '5px',
        paddingRight: '5px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        WebkitUserSelect:'none',
        fontWeight: 'bold',
        zIndex:2
      }
      const fileInputStyle = {
        display:'none'
      }

      const BoardsButton = () => {
        return (
          <div style={headerButtonStyle} onClick={this.handleBoardsClick.bind(this)}>
            Boards
          </div>
        )
      }

      const MembersButton = () => {
        return (
          <div style={headerButtonStyle} onClick={this.handleMembersClick.bind(this)}>
            Members
          </div>
        )
      }

      const ExportButton = () => {
        return (
          <div style={headerButtonStyle} onClick={this.handleExport.bind(this)}>
            Export
          </div>
        )
      }

      const ImportButton = () => {
        return (
          <div style={headerButtonStyle} onClick={this.handleOpenFile.bind(this)}>
            <input type="file" style={fileInputStyle} onChange={this.handleImport.bind(this)} ref={(fileInput) => {
              this.fileInput = fileInput
            }}/>
            Import
          </div>
        )
      }

      const Logo = () => {
        return (
          <div style={logoStyle}>Kanban</div>
        )
      }
      let members = []

      if(memberListOpen) {
        _.map(boards, (board) => {
          if(board.id === selectedBoard){
            members = board.doc.members
          }
        })
      }

        return (

        	<div style={style}>
            <BoardsButton />
            <MembersButton />
            <ExportButton />
            <ImportButton />
            {
              boardListOpen? <BoardList boards={boards}
                selectedBoard={selectedBoard}
                actions={actions}/>:null
            }
            {
              memberListOpen? <MemberList members={members}
                actions={actions}
                boardId={selectedBoard}/>:null
            }
            <Logo />
        	</div>
        )
    }
}

export default Header;
