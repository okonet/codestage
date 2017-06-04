import { SET_AUTOPASTE, SET_FONT, SET_SHORTCUT, SET_THEME } from '../actions/settings'

const initialState = {
  shortcut: 'Command+Alt+X',
  fontface: 'Courier New',
  theme: 'github',
  subset: 'jsx, css, html',
  autopaste: true
}

export default function settings(state = initialState, action) {
  switch (action.type) {
    case SET_AUTOPASTE: {
      return {
        ...state,
        autopaste: !!action.payload
      }
    }

    case SET_SHORTCUT: {
      return {
        ...state,
        shortcut: action.payload
      }
    }

    case SET_THEME: {
      return {
        ...state,
        theme: action.payload
      }
    }

    case SET_FONT: {
      return {
        ...state,
        fontface: action.payload
      }
    }

    default:
      return state
  }
}
