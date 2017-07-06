import { combineReducers } from 'redux'
import window from './window'
import errors from './errors'

export default function getRootReducer(scope = 'main') {
  let reducers = {
    errors,
    window
  }

  if (scope === 'renderer') {
    reducers = {
      ...reducers
    }
  }

  return combineReducers({ ...reducers })
}
