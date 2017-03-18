import {applyMiddleware, createStore} from 'redux'
import reducer from './reducers'
import thunk from 'redux-thunk'

const middlewares = [thunk]

if(process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger')
  const logger = createLogger()
  middlewares.push(logger)
}


export default createStore(reducer, applyMiddleware(...middlewares))
