'use strict'

const execa = require('execa')

module.exports = function executeAppleScript(pathToScript) {
  return execa('osascript', [pathToScript])
}
