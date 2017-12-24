import { PropTypes } from 'react'

export const EditorModes = Object.freeze({
  LANGUAGE: 'LANGUAGE',
  THEME: 'THEME',
  STYLE: 'STYLE',
  FONT: 'FONT'
})

export const FontSizes = [32, 64, 128] // each fontsize value equals 1/2 in pt

export const ThemePropType = PropTypes.shape({
  caption: PropTypes.string.isRequired,
  cssText: PropTypes.string.isRequired,
  isDark: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
}).isRequired
