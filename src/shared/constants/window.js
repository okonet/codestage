/* eslint import/prefer-default-export: 0 */
export const WindowSizes = Object.freeze({
  MINI: 'mini',
  LIST: 'list',
  NORMAL: 'normal'
})

// Window references store
// Create a reference of each window to be able to resize and destroy it
export const windows = {}
