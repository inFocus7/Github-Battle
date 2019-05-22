import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import {ThemeProvider} from './contexts/theme'
import Nav from './components/Nav'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from './components/Loading'

// Dynamic imports!
const Popular = React.lazy(() => import('./components/Popular'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))

class App extends React.Component {
    state = {
        theme: 'light',
        toggleTheme: () => {
            this.setState(({theme}) => ({
                theme: theme === 'light' ? 'dark' : 'light'
            }))
        }
    }

    render() {
        return (
            // Wrap whole app so they can use Consumer
            <Router>
                <ThemeProvider value={this.state}>
                    <div className={this.state.theme}>
                        <div className="container">
                            <Nav/>
                            <React.Suspense fallback={<Loading/>}>
                                <Switch>
                                    <Route exact path='/' component={Popular}/>
                                    <Route exact path='/battle' component={Battle}/>
                                    <Route path='/battle/results' component={Results}/>
                                    <Route render={() => <h1>404: Not Found... 😦</h1>}/>
                                </Switch>
                            </React.Suspense>
                        </div>
                    </div>
                </ThemeProvider>
            </Router>
        )
    }
}

// Render React onto browser's DOM
ReactDOM.render(
    <App/>,
    document.getElementById('app')    
)