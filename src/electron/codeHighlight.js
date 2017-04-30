/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

require('hazardous') //
const path = require('path')
const rtfRenderer = require('../../lib/')
const execa = require('execa')
const { clipboard } = require('electron')
const { DEFAULT_SETTINGS } = require('./defaults')
const log = require('electron-log')

module.exports = function codeHighlight(input, settings) {
  const fontface = settings.get('fontface', DEFAULT_SETTINGS.fontface)
  const theme = settings.get('theme', DEFAULT_SETTINGS.theme)
  const autopaste = settings.get('autopaste', DEFAULT_SETTINGS.autopaste)
  const output = rtfRenderer.highlightAuto(input, {
    fontface,
    theme
  }).value

  clipboard.write({
    text: input,
    rtf: output
  })

  if (autopaste) {
    // Pasting into the active application
    const pathToScript = path.resolve(__dirname, 'paste.as')

    execa('osascript', [pathToScript])
      .then(result => {
        log.error(result.stderr)
      })
      .catch(err => {
        log.error(err)
      })
  }
}
