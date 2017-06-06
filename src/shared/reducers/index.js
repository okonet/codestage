import { combineReducers } from 'redux'
import window from './window'

export default function getRootReducer(scope = 'main') {
  let reducers = {
    window
  }

  if (scope === 'renderer') {
    reducers = {
      ...reducers
    }
  }

  return combineReducers({ ...reducers })
}
