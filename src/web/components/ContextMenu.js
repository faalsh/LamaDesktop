import React from 'react';
import { StyleSheet, css } from 'aphrodite'

class ContextMenuPanel extends React.Component {
	constructor(props) {
		super(props)
		this.onEscape = this.onEscape.bind(this)
	}

	componentDidMount() {
		window.addEventListener('keydown', this.onEscape);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onEscape);
	}
	onEscape(e){

		if(e.key === 'Escape') {
			this.props.onEscape()
		}
	}

	handleCloseList(e){
		this.props.onEscape()
		e.stopPropagation()
	}


	render(){

		const styles = StyleSheet.create({
			panel: {
				position: 'absolute',
				backgroundColor: 'white',
				width: '200px',
				boxShadow: '0 2px 4px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12)',
				zIndex: 2,
				padding: '10px'
			},
			title: {
				display: 'flex',
				justifyContent: 'center',
				fontSize: '16px',
				color: 'grey',
				fontWeight: 'bold'
			},
			closer: {
				position: 'fixed',
				left: 0,
				top: 0,
				width: '100%',
				height: '100%',
				zIndex: -1
			}
		})

		return(
			<div className={css(styles.panel)}>
				<div className={css(styles.closer)} onClick={this.handleCloseList.bind(this)}></div>
				<div className={css(styles.title)} >{this.props.title}</div>
				<hr />
				{this.props.children}
			</div>
		)
	}
}

class ContextMenu extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
        	open: false
        }

        this.togglePanel = this.togglePanel.bind(this)
        this.onEscape = this.onEscape.bind(this)
    }



		onEscape(){
			this.setState({
				open: false
			})
		}

    togglePanel(evt){
    	this.setState({
    		open: !this.state.open
    	})
			evt.stopPropagation()
    }

    render() {

			const styles = StyleSheet.create({
				menuButton: {
	    		cursor: 'pointer',
	    		fontWeight: 'bold',
	    		padding: '2px',
	    		display: 'flex',
	    		justifyContent: 'center',
	    		alignItems: 'center',
	    		width: '15px',
	    		height: '15px',
	    		':hover': {
	    			backgroundColor: '#efecec',
	    		}
	    	}
			})

        return(
        	<div>
						<div className={css(styles.menuButton)} onClick={this.togglePanel}>...</div>
        		{this.state.open ? <ContextMenuPanel title={this.props.title} onEscape={this.onEscape}>{this.props.children}</ContextMenuPanel>:null}
        	</div>

        )
    }
}


export default ContextMenu;
