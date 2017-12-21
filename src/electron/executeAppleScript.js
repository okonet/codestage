const execa = require('execa')

module.exports = function executeAppleScript(pathToScript) {
  return execa('osascript', [pathToScript]).catch(
    error =>
      new Error(`Error executing ${pathToScript}: 
${error}`)
  )
}
