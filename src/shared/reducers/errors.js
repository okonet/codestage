import { ERROR_OCCURED, RESET_ERRORS } from '../actions/errors'

const initialState = {
  error: null,
  assistiveAccessDisabled: false
}

export default function errors(state = initialState, action) {
  switch (action.type) {
    case ERROR_OCCURED: {
      const error = action.payload
      return {
        ...state,
        error,
        assistiveAccessDisabled: error
          .toString()
          .includes('osascript is not allowed assistive access. (-1719)')
      }
    }
    case RESET_ERRORS: {
      return initialState
    }

    default: {
      return state
    }
  }
}
