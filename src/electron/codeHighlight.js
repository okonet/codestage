/* eslint import/no-extraneous-dependencies: 0 */

'use strict'

require('hazardous')
const path = require('path')
const stripIndent = require('strip-indent')
const { clipboard } = require('electron')
const log = require('electron-log')
const execute = require('./executeAppleScript')
const rtfRenderer = require('../../lib/')
const { DEFAULT_SETTINGS } = require('./defaults')

module.exports = function codeHighlight(input, settings) {
  return new Promise(async (resolve, reject) => {
    const fontface = settings.get('fontface', DEFAULT_SETTINGS.fontface)
    const fontsize = settings.get('fontsize', DEFAULT_SETTINGS.fontsize)
    const theme = settings.get('theme', DEFAULT_SETTINGS.theme)
    const lastUsedLanguage = settings.get('lastUsedLanguage', DEFAULT_SETTINGS.lastUsedLanguage)
    const autopaste = settings.get('autopaste', DEFAULT_SETTINGS.autopaste)
    const options = {
      fontface,
      fontsize,
      theme
    }
    const stripped = stripIndent(input)
    const result = await rtfRenderer.highlight(stripped, lastUsedLanguage || 'javascript', options)
    result.language = lastUsedLanguage
    const output = result.value
    clipboard.write({
      text: stripped,
      rtf: output
    })

    if (autopaste) {
      // Pasting into the active application
      execute(path.resolve(__dirname, 'paste.applescript'))
        .then(() => {
          resolve(result)
        })
        .catch(err => {
          log.error(err)
          reject(err)
        })
    } else {
      resolve(result)
    }
  })
}
