export const SET_SHORTCUT = 'SET_SHORTCUT'
export const SET_AUTOPASTE = 'SET_AUTOPASTE'
export const SET_THEME = 'SET_THEME'
export const SET_FONT = 'SET_FONT'

export function setShortcut(shortcut) {
  return {
    type: SET_SHORTCUT,
    payload: shortcut
  }
}

export function setAutopaste(autopaste) {
  return {
    type: SET_AUTOPASTE,
    payload: autopaste
  }
}

export function setTheme(theme) {
  return {
    type: SET_THEME,
    payload: theme
  }
}

export function setFont(font) {
  return {
    type: SET_FONT,
    payload: font
  }
}
