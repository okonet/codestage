'use strict'

const path = require('path')
const rtfRenderer = require('../lib/')
const execa = require('execa')

module.exports = function codeHighlight(clipboard, settings) {
  const fontface = settings.getSync('fontface')
  const theme = settings.getSync('theme')
  const input = clipboard.readText()
  const output = rtfRenderer.highlightAuto(input, {
    fontface,
    theme
  }).value

  clipboard.write({
    text: input,
    rtf: output
  })
}
