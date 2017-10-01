const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const Highlight = require('highlight.js')

/* Highlight `value` as `language`. */
function highlight(value, language) {
  const html = Highlight.highlight(language, value).value
  return `<div class="hljs">${html}</div>`
}

/* Highlight `value` with auto language detection. */
function highlightAuto(value, options) {
  return Highlight.highlightAuto(value, options.subset)
}

function resolvePackageDir(packageName) {
  const packajeJsonDirPath = path.dirname(require.resolve(`${packageName}/package.json`))
  return path.resolve(packajeJsonDirPath)
}

async function loadTheme(themeName, packageName = 'highlight.js', dirName = 'styles') {
  return {
    name: themeName,
    cssText: await promisify(fs.readFile)(
      path.join(resolvePackageDir(packageName), dirName, `${themeName}.css`),
      'utf-8'
    )
  }
}
module.exports = {
  highlight,
  highlightAuto,
  loadTheme,
  resolvePackageDir
}
