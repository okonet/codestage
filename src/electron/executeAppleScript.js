import path from 'path'
import execa from 'execa'

export default function execAppleScript(scriptName) {
  const pathToScript = path.resolve(__dirname, '..', 'scripts', `${scriptName}.applescript`)
  return execa('osascript', [pathToScript]).catch(err => {
    throw new Error(`Error executing AppleScript named ${scriptName}:

${err}`)
  })
}
