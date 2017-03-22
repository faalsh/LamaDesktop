import React from 'react';
import BoardList from './BoardList'
import MemberList from './MemberList'
import FileSaver from 'file-saver'
import store from '../../common/store'
import { StyleSheet, css } from 'aphrodite'


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

  handleShowPrintVersion() {
    const {actions, main} = this.props
    actions.showPrintVersion(main.selectedBoard)
  }


    render() {
      const {main, actions} = this.props
      const {selectedBoard, boards, memberListOpen, boardListOpen} = main

      const styles = StyleSheet.create({
        main:{
      		backgroundColor: '#026AA7',
          height: '50px',
          width: '100%',
          color: 'white',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
      	},
        logo: {
          marginLeft: '10px',
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginRight: '10px',
          width: '100%',
          fontFamily: '"Indie Flower",cursive'
        },
        headerButton: {
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
        },
        printVersion: {
          width: '300px',
          fontSize: '12px'
        },
        fileInput: {
          display:'none'
        },
        noPrint: {
          '@media print': {
            display: 'none'
          }
        }
      })

      const BoardsButton = () => {
        return (
          <div className={css(styles.headerButton)} onClick={this.handleBoardsClick.bind(this)}>
            Boards
          </div>
        )
      }

      const MembersButton = () => {
        return (
          <div className={css(styles.headerButton)} onClick={this.handleMembersClick.bind(this)}>
            Members
          </div>
        )
      }

      const ExportButton = () => {
        return (
          <div className={css(styles.headerButton)} onClick={this.handleExport.bind(this)}>
            Export
          </div>
        )
      }

      const ImportButton = () => {
        return (
          <div className={css(styles.headerButton)} onClick={this.handleOpenFile.bind(this)}>
            <input type="file" className={css(styles.fileInput)} onChange={this.handleImport.bind(this)} ref={(fileInput) => {
              this.fileInput = fileInput
            }}/>
            Import
          </div>
        )
      }

      const PrintVersionButton = () => {
        return (
          <div className={css(styles.headerButton, styles.printVersion)} onClick={this.handleShowPrintVersion.bind(this)}>
            Print Friendly Version
          </div>
        )
      }


      const Logo = () => {
        return (
          <div className={css(styles.logo)}>Kanban</div>
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

        	<div className={css(styles.main, styles.noPrint)}>
            <BoardsButton />
            <MembersButton />
            <ExportButton />
            <ImportButton />
            <PrintVersionButton />
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
