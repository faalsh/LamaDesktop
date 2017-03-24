import React from 'react';
import _ from 'lodash'
import { StyleSheet, css } from 'aphrodite'
import FilterListItem from './FilterListItem'

class FilterList extends React.Component {
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
    this.props.actions.toggleFilterList()
  }
  handleReset(){
    this.props.actions.resetFilter()
  }
  componentDidMount() {
    window.addEventListener('keydown', this.onEscape);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onEscape);
  }


  onEscape(e){
    if(e.key === 'Escape') {
      this.props.actions.toggleFilterList()
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
        reset: {
          color: 'black',
          fontWeight: 'bold',
          marginTop: '10px',
          padding: '5px',
          width: '100%',
          cursor:'pointer',
          // backgroundColor: '#4c94be'
        },
        animate: {
          animationName: keyframes,
          animationDuration: '100ms'
        }
      })

      const {members, actions, memberFilter} = this.props
        return (
          <div>
            <div className={css(styles.closer)} onClick={this.handleCloseList.bind(this)}></div>
          	<div className={css(styles.panel, styles.animate)}>

              {
                  _.map(members,(member) => {
                  return (
                    <FilterListItem key={member.memberId}
                      memberId={member.memberId}
                      member={member.memberName}
                      memberFilter={memberFilter}
                      actions={actions}/>
                  )
                })
              }
              <div onClick={this.handleReset.bind(this)} className={css(styles.reset)}>Reset Filter</div>
            </div>
          </div>
        )
    }
}

export default FilterList;
