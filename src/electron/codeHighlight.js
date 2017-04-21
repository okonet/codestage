'use strict'

const path = require('path')
const rtfRenderer = require('../../lib/')
const execa = require('execa')
const { clipboard } = require('electron')

module.exports = function codeHighlight(input, settings) {
  const fontface = settings.getSync('fontface')
  const theme = settings.getSync('theme')
  const autopaste = settings.getSync('autopaste')
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
