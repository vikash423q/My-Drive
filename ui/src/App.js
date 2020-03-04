import React from 'react';
import { AuthPage } from './AuthPages';
import Dashboard from './DashboardPages.js/Dashboard';
import { useSelector, useDispatch } from 'react-redux'


const App = (props) => {
    const dispatch = useDispatch();
    const state = useSelector(state => state.auth);
    return (
        <React.Fragment>
            {state.loggedIn ? <Dashboard dispatch={dispatch} darkMode={state.darkMode} /> : <AuthPage dispatch={dispatch} darkMode={state.darkMode} />}
        </React.Fragment>
    );
}

export default App;