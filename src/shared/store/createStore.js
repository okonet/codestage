import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import {
  forwardToMain,
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
  replayActionRenderer
} from 'electron-redux'
import getRootReducer from '../reducers'

/**
 * @param  {Object} initialState
 * @param  {String} [scope='main|renderer']
 * @return {Object} store
 */
export default function configureStore(initialState, scope = 'main') {
  const logger = createLogger({
    level: scope === 'main' ? undefined : 'info',
    collapsed: true
  })

  let middleware = []
  //   thunk,
  //   promise,
  // ];

  if (!process.env.NODE_ENV) {
    middleware.push(logger)
  }

  if (scope === 'renderer') {
    middleware = [forwardToMain, ...middleware]
  }

  if (scope === 'main') {
    middleware = [triggerAlias, ...middleware, forwardToRenderer]
  }

  const enhanced = [applyMiddleware(...middleware)]

  const rootReducer = getRootReducer(scope)
  const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // eslint-disable-line
  const enhancer = composeEnhancers(
    ...enhanced
  )
  const store = createStore(rootReducer, initialState, enhancer)

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers')) // eslint-disable-line
    })
  }

  if (scope === 'main') {
    replayActionMain(store)
  } else {
    replayActionRenderer(store)
  }

  return store
}
