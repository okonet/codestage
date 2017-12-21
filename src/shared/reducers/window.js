import { SET_MAIN_WINDOW_VISIBILITY, SET_WINDOW_SIZE } from '../actions/window'
import { windows, WindowSizes } from '../constants/window'
import { resizeWindowEffect, toggleWindowEffect } from '../effects/window'

const initialState = {
  windowVisible: false,
  size: WindowSizes.MINI
}

export default function window(state = initialState, action) {
  const { size, windowVisible } = state
  switch (action.type) {
    case SET_WINDOW_SIZE: {
      const shouldAnimate = windowVisible && size !== WindowSizes.MINI
      if (windows.main) {
        resizeWindowEffect(windows.main, action.payload, shouldAnimate)
      }
      return {
        ...state,
        size: action.payload
      }
    }

    case SET_MAIN_WINDOW_VISIBILITY: {
      if (windows.main) {
        toggleWindowEffect(windows.main, action.payload)
      }
      return {
        ...state,
        windowVisible: action.payload
      }
    }

    default:
      return state
  }
}
