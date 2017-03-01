'use strict'

module.exports = function codeHighlight(clipboard) {
  const source = clipboard.readText()
  console.log(source)
  return source
}
