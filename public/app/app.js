import React from 'react'
import ReactDOM from 'react-dom'
import {Router,Route,IndexRoute,hashHistory} from 'react-router'
import {Provider} from 'react-redux'
import {syncHistoryWithStore} from 'react-router-redux'




import store from './store';
const history = syncHistoryWithStore(hashHistory, store)

import VTemplate from './pages/layout/Template'
import VMain from './pages/Main'
import VAbout from './pages/About'
import VLogin from './pages/Login'
import VProfile from './pages/Profile'
import VDiscounts from './pages/Discounts'
import VSupport from './pages/Support'
import VAccounts from './pages/Accounts'


import routeProtector, {ONLY_AUTHENTICATED} from './helpers/routeProtector'

import {restore_session} from './actions/client'

new Promise((resolve, reject) => {
    resolve()
})
    .then(() => {
        // store.dispatch(restore_session())
    })
    .then(() => {
        const app = document.getElementById('app');
        ReactDOM.render(
            <Provider store={store}>
                <Router history={history}>
                    <Route path="/" component={VTemplate}>
                        <IndexRoute component={VMain}></IndexRoute>

                        <Route path="about" component={VAbout}></Route>

                        <Route path="login" component={VLogin}></Route>
                        <Route path="profile" component={routeProtector(VProfile, ONLY_AUTHENTICATED)}></Route>
                        <Route path="discounts" component={routeProtector(VDiscounts, ONLY_AUTHENTICATED)}></Route>
                        <Route path="support" component={routeProtector(VSupport, ONLY_AUTHENTICATED)}></Route>

                        <Route path="cards" component={routeProtector(VAccounts, ONLY_AUTHENTICATED)}></Route>
                        <Route path="cards(/:account_number)" component={routeProtector(VAccounts, ONLY_AUTHENTICATED)}></Route>
                    </Route>
                </Router>
            </Provider>,
            app);
    })


