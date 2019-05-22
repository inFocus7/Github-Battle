import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { DiJava, DiJavascript, DiRuby, DiCss3, DiPython } from 'react-icons/di'
import { FaCode, FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import ToolTip from './Tooltip'

function LanguageNav({selected, onUpdateLanguage}) {    
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
    
    return (
        <div id='popular-nav'>
        <ul className='flex-center'>
            {languages.map((language) => (
                <li key={language}>
                    <button 
                    style={language === selected ? { color: 'rgb(236, 18, 109)' } : null} 
                    className="btn-clear nav-link" 
                    onClick={() => onUpdateLanguage(language)}>
                        <div className="nav-icon-wrapper">
                        {   // Immediately Invoked (Anonymous) Function Expression II(A)FE
                            // Using IIFE due to JSX being html-ish and ternary not being enough.
                            (() => { 
                            switch (language) {
                                case 'All':
                                    return <FaCode size="30" className={'All' === selected ? 'nav-icon-selected' : 'nav-icon'}/>
                                case 'JavaScript':
                                    return <DiJavascript size="30" className={'JavaScript' === selected ? 'nav-icon-selected' : 'nav-icon'}/>
                                case 'Ruby':
                                    return <DiRuby size="30" className={'Ruby' === selected ? 'nav-icon-selected' : 'nav-icon'}/>
                                case 'Java':
                                    return <DiJava size="30" className={'Java' === selected ? 'nav-icon-selected' : 'nav-icon'}/>
                                case 'CSS':
                                    return <DiCss3 size="30" className={'CSS' === selected ? 'nav-icon-selected' : 'nav-icon'}/>
                                case 'Python':
                                    return <DiPython size="30" className={'Python' === selected ? 'nav-icon-selected' : 'nav-icon'}/>
                                default:
                                    return <FaCode size="30" className="nav-icon"/>
                            }
                        })()}
                        </div>
                        <h3 className="nav-language-title">{language}</h3>
                    </button>
                </li>
            ))}
        </ul>
    </div>
    )
}

LanguageNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function RepoCard({repo}) {

}

RepoCard.propTypes = {
    repo: PropTypes.object.isRequired
}

function ReposGrid({repos}) {
    return (
        <ul className="grid space-around">
            {
                repos.map((repo, index) => {
                    const { id, name, owner, html_url, stargazers_count, forks, open_issues } = repo
                    const {login, avatar_url} = owner

                    return (
                        <li key={id}>
                            <Card 
                                header={`#${index + 1}`}
                                avatar={avatar_url}
                                href={html_url}
                                name={login}>

                                <ul className='card-list'>
                                    <li>
                                        <ToolTip text='GitHub Username'>
                                            <FaUser color='rgb(255,191,116)' size={22}/>
                                            <a href={`https://github.com/${login}`}>{login}</a>
                                        </ToolTip>
                                    </li>
                                    <li>
                                        <FaStar color='rgb(255,215,0)' size={22}/>
                                        {stargazers_count.toLocaleString()} stars
                                    </li>
                                    <li>
                                    <FaCodeBranch color='rgb(129,195,245)' size={22}/>
                                    {forks.toLocaleString()} forks
                                    </li>
                                    <li>
                                        <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}/>
                                        {open_issues.toLocaleString()} issues
                                    </li>
                                </ul>
                            </Card>
                        </li>
                    )
            })}
        </ul>
    )
}

ReposGrid.propTypes = {
    repos: PropTypes.array.isRequired
}

export default class Popular extends React.Component {
    state = {
        language: 'All',
        repos: {},
        error: null
    }

    componentDidMount() {
        this.updateLanguage(this.state.language)
    }

    updateLanguage = (language) => {
        this.setState({
            language: language,
            error: null,
        })

        // If language not previously selected
        if(!this.state.repos[language]) {
            fetchPopularRepos(language)
                .then((data) => this.setState(({ repos }) => {
                    return {
                        repos: {...repos, [language]: data},
                        error: null
                    }
                }))
                .catch(() => {
                    console.warn('Error fetching repos: ', error)

                    this.setState({
                        error: 'There was an error fetching the repositories.'
                    })
                })
        }
    }

    isLoading = () => {
        const {language, repos, error } = this.state

        return !repos[language] && error === null
    }

    render() {
        // Destructure language from state.
        const { language, repos, error } = this.state

        return (
            <>
                <LanguageNav selected={language} onUpdateLanguage={this.updateLanguage}/>
                {this.isLoading() && <Loading text='Fetching Repos'/>}

                {error && <p className='error center-text'>{error}</p>}

                {repos[language] && <ReposGrid repos={repos[language]}/>}
            </>
        )
    }
}