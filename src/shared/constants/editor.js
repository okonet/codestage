import { PropTypes } from 'react'

export const EditorModes = Object.freeze({
  LANGUAGE: 'LANGUAGE',
  THEME: 'THEME',
  STYLE: 'STYLE'
})

export const ThemePropType = PropTypes.shape({
  caption: PropTypes.string.isRequired,
  cssText: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
}).isRequired
