import { SET_MAIN_WINDOW_VISIBILITY, SET_WINDOW_SIZE } from '../actions/window'
import { WindowSizes } from '../contants/window'

const initialState = {
  windowVisible: false,
  size: WindowSizes.MINI
}

export default function window(state = initialState, action) {
  switch (action.type) {
    case SET_WINDOW_SIZE: {
      return {
        ...state,
        size: action.payload
      }
    }

    case SET_MAIN_WINDOW_VISIBILITY: {
      return {
        ...state,
        windowVisible: action.payload
      }
    }

    default:
      return state
  }
}
