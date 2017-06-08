import { SET_WINDOW_SIZE } from '../actions/window'
import { WindowSizes } from '../contants/window'

const initialState = {
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

    default:
      return state
  }
}
