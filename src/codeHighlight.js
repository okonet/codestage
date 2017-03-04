'use strict'

const path = require('path')
const rtfRenderer = require('../lib/')
const execa = require('execa')

module.exports = function codeHighlight(clipboard) {
  const input = clipboard.readText()
  const output = rtfRenderer.highlight('javascript', input).value
  clipboard.writeRTF(output)

  // Pasting into the active application
  execa('osascript', [path.resolve('./src/paste.as')]).then((result) => {
    console.log(result.stdout)
  })
}
