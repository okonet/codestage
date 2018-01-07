import { HIGHLIGHT_COMPLETE, SET_MODE } from '../actions/editor'
import { EditorModes } from '../constants/editor'

const initialState = {
  mode: EditorModes.LANGUAGE,
  text: '',
  html: ''
}

export default function window(state = initialState, action) {
  switch (action.type) {
    case SET_MODE: {
      return {
        ...state,
        mode: action.payload
      }
    }

    case HIGHLIGHT_COMPLETE: {
      const { html, text } = action.payload
      return {
        ...state,
        html,
        text
      }
    }

    default:
      return state
  }
}
