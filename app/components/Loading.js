import React from 'react'
import PropTypes from 'prop-types'

const styles = {
    content: {
        fontSize: '35px',
        position: 'absolute',
        left: 0,
        right: 0,
        marginTop: '20px',
        textAlign: 'center'
    }
}

export default class Loading extends React.Component {
    state = {
        init: this.props.text,
        content: this.props.text
    }
    
    componentDidMount() {
        this.interval = window.setInterval(() => {
            this.state.content === (this.state.init + '...')
            ? this.setState({ content: this.state.init }) : this.setState((prevState) => ({content: prevState.content + '.'})) 
        }, this.props.time)
    }

    componentWillUnmount() {
        window.clearInterval(this.interval)
    }
    
    render() {
        return (
            <p style={styles.content}>
                {this.state.content}
            </p>
        )
    }
}

Loading.defaultProps = {
    text: 'Loading',
    time: 200
}

Loading.propTypes = {
    text: PropTypes.string,
    time: PropTypes.number
}