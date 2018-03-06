if (typeof window === 'undefined') global.window = {} // Ace needs the global window object :shrug:
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const ace = require('brace')
const { getSafeCssText } = require('../stylesheets')

ace.define(
  'static_highlight',
  ['require', 'exports', 'module', 'ace/edit_session', 'ace/layer/text'],
  (acequire, exports, module) => {
    const EditSession = acequire('ace/edit_session').EditSession
    const TextLayer = acequire('ace/layer/text').Text
    const SimpleTextLayer = function() {
      this.config = {}
    }
    SimpleTextLayer.prototype = TextLayer.prototype

    function renderSync(input, mode, lineStart = 1, withGutter = false) {
      const session = new EditSession('')
      session.setUseWorker(false)
      session.setMode(`ace/mode/${mode}`)
      const textLayer = new SimpleTextLayer()
      textLayer.setSession(session)
      session.setValue(input)
      const stringBuilder = []
      const linesCount = session.getLength()
      const gutterLength = Math.abs(Math.log10(lineStart + linesCount)) + 1
      for (let idx = 0; idx < linesCount; idx += 1) {
        stringBuilder.push("<div class='ace_line'>")
        if (withGutter) {
          const lineNumber = String(lineStart + idx).padStart(gutterLength)
          stringBuilder.push(`<span class='ace_gutter ace_gutter-cell'>${lineNumber}</span>`)
        }
        textLayer.$renderLine(stringBuilder, idx, true, false)
        stringBuilder.push(`${idx < linesCount - 1 ? '\n' : ''}</div>`)
      }
      const html = `<div class='ace_static_highlight' style='counter-reset:ace_line 
${lineStart - 1}'>${stringBuilder.join('')}</div>`
      textLayer.destroy()
      return html
    }

    function renderToStaticMarkup(input, language, options = {}) {
      const withGutter = options.lineNumbers
      return renderSync(input, language, 1, withGutter)
    }

    // eslint-disable-next-line
    module.exports = renderToStaticMarkup
  }
)

async function requireAceModule(modulePath) {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line
      require(`br${modulePath}`)
      // eslint-disable-next-line
      ace.acequire([modulePath], module => {
        if (!module) {
          reject(`Could not find Ace module ${modulePath}`)
        }
        resolve(module)
      })
    } catch (err) {
      reject(err.message)
    }
  })
}

function resolvePackageDir(packageName) {
  const packajeJsonDirPath = path.dirname(require.resolve(`${packageName}/package.json`))
  return path.resolve(packajeJsonDirPath)
}

async function loadTheme(themeName) {
  const { cssClass, cssText } = await requireAceModule(`ace/theme/${themeName}`).catch(err => {
    throw new Error(`Error loading theme ${themeName}:
      ${err}
      `)
  })
  return {
    name: themeName,
    cssClass,
    cssText: getSafeCssText(cssText)
  }
}

async function getThemes() {
  const themesList = await requireAceModule(`ace/ext/themelist`)
  const { themes } = themesList
  // FIXME: themelist.js of ace contains more than brace is bundling. Need to create a PR for that.
  const existingThemes = await promisify(fs.readdir)(path.join(resolvePackageDir('brace'), 'theme'))
  const themeNames = existingThemes.map(file => file.replace(/\.js$/, ''))
  const finalThemesList = themes.filter(theme => themeNames.includes(theme.name))
  const cssContents = await Promise.all(
    finalThemesList.map(async theme => await loadTheme(theme.name))
  )
  return finalThemesList.reduce(
    (res, theme, idx) =>
      Object.assign(res, {
        [theme.name]: Object.assign({}, theme, {
          cssClass: cssContents[idx].cssClass,
          cssText: cssContents[idx].cssText
        })
      }),
    {}
  )
}

async function getLanguages() {
  const languagesList = await promisify(fs.readdir)(path.join(resolvePackageDir('brace'), 'mode'))
  return languagesList.map(file => file.replace(/\.js$/, ''))
}

/* Highlight `value` as `language`. */
async function highlight(value, language, options) {
  requireAceModule(`ace/mode/${language}`)
  return ace.acequire(['static_highlight'], module => module(value, language, options))
}

module.exports = {
  highlight,
  loadTheme,
  getThemes,
  getLanguages
}
