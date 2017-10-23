import { combineReducers } from 'redux'
import editor from './editor'
import errors from './errors'
import window from './window'

export default function getRootReducer(scope = 'main') {
  let reducers = {
    editor,
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
