const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const Highlight = require('highlight.js')
const csstree = require('css-tree')

function resolvePackageDir(packageName) {
  const packajeJsonDirPath = path.dirname(require.resolve(`${packageName}/package.json`))
  return path.resolve(packajeJsonDirPath)
}

async function loadTheme(themeName, packageName = 'highlight.js', dirName = 'styles') {
  const cssText = await promisify(fs.readFile)(
    path.join(resolvePackageDir(packageName), dirName, `${themeName}.css`),
    'utf-8'
  )
  const cssAst = csstree.parse(cssText)

  // Remove background or background-color declaration from the root .hljs rule
  csstree.walkRules(cssAst, rule => {
    csstree.walk(rule.selector, node => {
      // Find a matching .hljs selector
      if (node && node.type === 'ClassSelector' && node.name === 'hljs') {
        // Collect all declarations
        // eslint-disable-next-line no-shadow
        csstree.walkDeclarations(rule.block, (node, item, list) => {
          if (
            node.type === 'Declaration' &&
            (node.property === 'background' || node.property === 'background-color')
          ) {
            list.remove(item)
          }
        })
      }
    })
  })

  return {
    name: themeName,
    cssText,
    cssAst
  }
}

async function getThemes() {
  const themeDirPath = path.join(resolvePackageDir('highlight.js'), 'styles')
  const themesList = await promisify(fs.readdir)(themeDirPath)
  return themesList.reduce((res, fileName) => {
    const name = fileName.replace(/\.css$/, '')
    const themePath = path.join(themeDirPath, fileName)
    const cssText = fs.readFileSync(themePath, 'utf-8')
    return Object.assign({}, res, {
      [name]: {
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
