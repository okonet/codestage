export const ERROR_OCCURED = 'ERROR_OCCURED'
export const RESET_ERRORS = 'RESET_ERRORS'

export function errorOccured(error) {
  return {
    type: ERROR_OCCURED,
    payload: error
  }
}

export function resetErrors() {
  return {
    type: RESET_ERRORS,
    payload: {}
  }
}
