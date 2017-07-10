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
  return new Promise((resolve, reject) => {
    const fontface = settings.get('fontface', DEFAULT_SETTINGS.fontface)
    const fontsize = settings.get('fontsize', DEFAULT_SETTINGS.fontsize)
    const theme = settings.get('theme', DEFAULT_SETTINGS.theme)
    const subset = settings.get('subset', DEFAULT_SETTINGS.subset)
    const lastUsedLanguage = settings.get('lastUsedLanguage', DEFAULT_SETTINGS.lastUsedLanguage)
    const autopaste = settings.get('autopaste', DEFAULT_SETTINGS.autopaste)

    const stripped = stripIndent(input)
    let result

    const options = {
      fontface,
      fontsize,
      theme
    }

    if (lastUsedLanguage) {
      result = rtfRenderer.highlight(stripped, lastUsedLanguage, options)
      result.language = lastUsedLanguage
    } else {
      result = rtfRenderer.highlightAuto(
        stripped,
        Object.assign(options, {
          subset: subset.length ? subset.split(',') : undefined
        })
      )
    }

    const output = result.value

    clipboard.write({
      text: stripped,
      rtf: output
    })

    if (autopaste) {
      // Pasting into the active application
      const pathToScript = path.resolve(__dirname, 'paste.as')

      execa('osascript', [pathToScript])
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
