/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

require('hazardous')
const path = require('path')
const stripIndent = require('strip-indent')
const execa = require('execa')
const { clipboard } = require('electron')
const log = require('electron-log')
const rtfRenderer = require('../../lib/')
const { DEFAULT_SETTINGS } = require('./defaults')

module.exports = function codeHighlight(input, settings) {
  const fontface = settings.get('fontface', DEFAULT_SETTINGS.fontface)
  const theme = settings.get('theme', DEFAULT_SETTINGS.theme)
  const subset = settings.get('subset', DEFAULT_SETTINGS.subset)
  const autopaste = settings.get('autopaste', DEFAULT_SETTINGS.autopaste)

  const stripped = stripIndent(input)
  const result = rtfRenderer.highlightAuto(stripped, {
    fontface,
    theme,
    subset: subset.length ? subset.split(',') : undefined
  })

  const output = result.value

  clipboard.write({
    text: stripped,
    rtf: output
  })

  if (autopaste) {
    // Pasting into the active application
    const pathToScript = path.resolve(__dirname, 'paste.as')

    execa('osascript', [pathToScript]).catch(err => {
      log.error(err)
    })
  }

  return result
}
