import { createAliasedAction } from 'electron-redux'

export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE'
export const SET_MAIN_WINDOW_VISIBILITY = 'SET_MAIN_WINDOW_VISIBILITY'

export const setWindowSize = createAliasedAction(SET_WINDOW_SIZE, size => ({
  type: SET_WINDOW_SIZE,
  payload: size
}))

export const setWindowVisibility = createAliasedAction(SET_MAIN_WINDOW_VISIBILITY, isVisible => ({
  type: SET_MAIN_WINDOW_VISIBILITY,
  payload: isVisible
}))
