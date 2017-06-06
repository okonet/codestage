export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE'

export function setWindowSize(size) {
  return {
    type: SET_WINDOW_SIZE,
    payload: size
  }
}
