export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE'
export const SET_MAIN_WINDOW_VISIBILITY = 'SET_MAIN_WINDOW_VISIBILITY'

export function setWindowSize(size) {
  return {
    type: SET_WINDOW_SIZE,
    payload: size
  }
}

export function setWindowVisibility(isVisible) {
  return {
    type: SET_MAIN_WINDOW_VISIBILITY,
    payload: isVisible
  }
}
