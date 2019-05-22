import React from 'react'

// Render Prop using children as function that gets the hovering state of this!
export default class Hover extends React.Component {
    state = {
        hovering: false,
    }
    
    mouseOver = () => {
        this.setState({
            hovering: true
        })
    }

    mouseOut = () => {
        this.setState({
            hovering: false
        })
    }

    render() {
        return (
            <div onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
                {this.props.children(this.state.hovering)}
            </div>
        )
    }
}
