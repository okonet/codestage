export const SET_MODE = 'SET_MODE'
export const HIGHLIGHT_COMPLETE = 'HIGHLIGHT_COMPLETE'

export function setMode(mode) {
  return {
    type: SET_MODE,
    payload: mode
  }
}

export function highlightComplete(result) {
  return {
    type: HIGHLIGHT_COMPLETE,
    payload: result
  }
}
