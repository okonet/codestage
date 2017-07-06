import { ERROR_OCCURED } from '../actions/errors'

const initialState = {
  assistiveAccessEnabled: true
}

export default function errors(state = initialState, action) {
  switch (action.type) {
    case ERROR_OCCURED: {
      return {
        ...state,
        assistiveAccessEnabled: !action.payload.includes(
          'osascript is not allowed assistive access. (-1719)'
        )
      }
    }

    default: {
      return state
    }
  }
}
