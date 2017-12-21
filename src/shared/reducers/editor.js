import { SET_MODE } from '../actions/editor'
import { EditorModes } from '../constants/editor'

const initialState = {
  mode: EditorModes.LANGUAGE
}

export default function window(state = initialState, action) {
  switch (action.type) {
    case SET_MODE: {
      return {
        ...state,
        mode: action.payload
      }
    }

    default:
      return state
  }
}
