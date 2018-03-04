const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const Highlight = require('highlight.js')

function resolvePackageDir(packageName) {
  const packajeJsonDirPath = path.dirname(require.resolve(`${packageName}/package.json`))
  return path.resolve(packajeJsonDirPath)
}

async function loadTheme(
  themeName,
  options = {
    packageName: 'highlight.js',
    dirName: 'styles'
  }
) {
  const { packageName, dirName } = options
  const themePath = path.join(resolvePackageDir(packageName), dirName, `${themeName}.css`)
  const cssText = await promisify(fs.readFile)(themePath, 'utf-8')

  return {
    name: themeName,
    cssClass: 'hljs',
    cssText,
    themePath
  }
}

async function getThemes() {
  const themeDirPath = path.join(resolvePackageDir('highlight.js'), 'styles')
  const themesList = await promisify(fs.readdir)(themeDirPath)

  return themesList
    .filter(theme => theme.endsWith('.css')) // Filter non-CSS files
    .reduce(async (res, fileName) => {
      const name = fileName.replace(/\.css$/, '')
      const { cssText, cssClass, themePath } = await loadTheme(name)
      return Object.assign({}, res, {
        [name]: {
          cssClass,
          cssText,
          name,
          path: themePath
        }
      })
    }, {})
}

async function getLanguages() {
  const languagesList = await promisify(fs.readdir)(
    path.join(resolvePackageDir('highlight.js'), 'lib', 'languages')
  )
  return languagesList.map(file => file.replace(/\.js$/, ''))
}

/* Highlight `value` as `language`. */
function highlight(value, language) {
  const html = Highlight.highlight(language, value).value
  return `<div class="hljs">${html}</div>`
}

/* Highlight `value` with auto language detection. */
function highlightAuto(value, options) {
  return Highlight.highlightAuto(value, options.subset)
}

module.exports = {
  getLanguages,
  getThemes,
  highlight,
  highlightAuto,
  loadTheme,
  resolvePackageDir
}
