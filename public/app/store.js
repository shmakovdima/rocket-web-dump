import React from 'react'
import { createStore, applyMiddleware,combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux'

import logger from 'redux-logger'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

import reducer from './reducers/index'

const middleware = applyMiddleware(promise(), thunk, logger())
const store = createStore(combineReducers({reducer, routing: routerReducer }), middleware)




export default store;