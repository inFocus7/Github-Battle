import React from 'react'
import { FaUserFriends, FaFighterJet, FaTrophy, FaTimesCircle } from 'react-icons/fa'
import PropTypes from 'prop-types'
import Results from './Results'
import {ThemeConsumer} from '../contexts/theme'
import {Link} from 'react-router-dom'

function Instructions() {
    return (
        <ThemeConsumer>
            {({theme}) => (
                <div className='instructions-container'>
                    <h1 className='center-text header-lg'>
                        Instructions
                    </h1>

                    <ol className='container-sm grid center-text battle-instructions'>
                        <li>
                            <h3 className='header-sm'>Enter two Github users</h3>
                            <FaUserFriends className={`bg-${theme}`} color='rgb(255, 191, 116)' size={140}/>
                        </li>
                        <li>
                            <h3 className='header-sm'>Battle</h3>
                            <FaFighterJet className={`bg-${theme}`} color='#727272' size={140}/>
                        </li>
                        <li>
                            <h3 className='header-sm'>See the winner</h3>
                            <FaTrophy className={`bg-${theme}`} color='rgb(255, 215, 0)' size={140}/>
                        </li>
                    </ol>
                </div>
            )}
        </ThemeConsumer>
    )
}

class PlayerInput extends React.Component {
    state = {
        username: ''
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.props.onSubmit(this.state.username)
    }

    handleInput = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    render() {
        return (
            <ThemeConsumer>
                {({theme}) => (
                    <form className='column player' onSubmit={this.handleSubmit}>
                        <label htmlFor='username' className='player-label'>
                            {this.props.label}
                        </label>

                        <div className='row player-inputs'>
                            <input 
                                type='text' 
                                id='username' 
                                className={`input-${theme}`} 
                                placeholder='github username' 
                                autoComplete='off'
                                value={this.state.username}
                                onChange={this.handleInput}/>
                        
                            <button 
                                type='submit'
                                className={`btn ${theme === 'dark' ? 'light-btn' : 'dark-btn'}`}
                                disabled={!this.state.username}>
                                Submit
                            </button>
                        </div>
                    </form>
                )}
            </ThemeConsumer>
        )
    }
}

PlayerInput.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
}

function PlayerPreview({username, onReset, label}) {
    return (
        <ThemeConsumer>
            {({theme}) => (
                <div className='column player'>
                    <h3 className='player label'>{label}</h3>
                    <div className={`row bg-${theme}`}>
                        <div className='player-info'>
                            <img   
                                className='avatar-small'
                                src={`https://github.com/${username}.png?size=200`}
                                alt={`Avatar for ${username}`}
                                />
                            <a
                                href={`https://github.com/${username}`}
                                className='link'
                                >
                                {username}
                            </a>
                        </div>
                        <button className='btn-clear flex-center' onClick={onReset}>
                            <FaTimesCircle color='rgb(194, 57, 42)' size={26}/>
                        </button>
                    </div>
                </div>
            )}
        </ThemeConsumer>
    )
}

PlayerPreview.propTypes = {
    username: PropTypes.string.isRequired,
    onReset: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
}

export default class Battle extends React.Component {
    state = {
        p1: null,
        p2: null,
    }

    handleSubmit = (id, player) => {
        // Update user
        this.setState({
            [id]: player
        })
    }

    handleReset = (id) => {
        this.setState({
            [id]: null
        })
    }

    render() {
        const { p1, p2 } = this.state

        return(
            <ThemeConsumer>
                {({theme}) => (
                    <>
                    <Instructions />
                    <div className='players-container'>
                        <h1 className='center-text header-lg'> Players </h1>
                        <div className='row space-around'>
                            {p1 === null 
                            ? (
                                <PlayerInput
                                    label='Player One'
                                    onSubmit={(player) => this.handleSubmit('p1', player)}
                                    />
                            )
                            : (
                                <PlayerPreview username={p1} label='Player One' onReset={() => this.handleReset('p1')}/>
                            )}

                            {p2 === null
                            ? (
                                <PlayerInput
                                    label='Player Two'
                                    onSubmit={(player) => this.handleSubmit('p2', player)}
                                    />
                            )
                            : (
                                <PlayerPreview username={p2} label='Player Two' onReset={() => this.handleReset('p2')}/>
                            )}
                        </div>
                        {p1 && p2 && (
                            <Link
                                className={`btn ${theme === 'light' ? 'dark-btn' : 'light-btn'} btn-space`}
                                to={{
                                    pathname: '/battle/results',
                                    search: `?p1=${p1}&p2=${p2}`
                                }}>
                                Battle
                            </Link>
                        )}
                    </div>
                    </>
                )}
            </ThemeConsumer>
        )
    }
}