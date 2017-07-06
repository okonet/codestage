export const ERROR_OCCURED = 'ERROR_OCCURED'

export function errorOccured(error) {
  return {
    type: ERROR_OCCURED,
    payload: error
  }
}
