/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

const path = require('path')
const rtfRenderer = require('../../lib/')
const execa = require('execa')
const { clipboard } = require('electron')
const { DEFAULT_SETTINGS } = require('./defaults')

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
    execa('osascript', [path.resolve('./src/electron/paste.as')]).then(result => {
      console.log(result.stdout)
    })
  }
}
