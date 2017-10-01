const ace = require('brace')

ace.define(
  'static_highlight',
  ['require', 'exports', 'module', 'ace/edit_session', 'ace/layer/text'],
  (acequire, exports, module) => {
    const EditSession = acequire('../edit_session').EditSession
    const TextLayer = acequire('../layer/text').Text

    const SimpleTextLayer = function() {
      this.config = {}
    }
    SimpleTextLayer.prototype = TextLayer.prototype

    function renderSync(input, mode, lineStart = 1, disableGutter = true) {
      const session = new EditSession('')
      session.setUseWorker(false)
      session.setMode(`ace/mode/${mode}`)
      const textLayer = new SimpleTextLayer()
      textLayer.setSession(session)
      session.setValue(input)
      const stringBuilder = []
      const length = session.getLength()
      for (let idx = 0; idx < length; idx += 1) {
        stringBuilder.push("<div class='ace_line'>")
        if (!disableGutter)
          stringBuilder.push(`<span class='ace_gutter ace_gutter-cell'>${idx + lineStart}</span>`)
        textLayer.$renderLine(stringBuilder, idx, true, false)
        stringBuilder.push('\n</div>')
      }
      const html = `<div class='ace_static_highlight${disableGutter
        ? ''
        : ' ace_show_gutter'}' style='counter-reset:ace_line ${lineStart - 1}'>${stringBuilder.join(
        ''
      )}</div>`
      textLayer.destroy()
      return html
    }

    function renderToStaticMarkup(input, language) {
      return renderSync(input, language)
    }

    // eslint-disable-next-line
    module.exports = renderToStaticMarkup
  }
)

/* Highlight `value` as `language`. */
function highlight(value, language) {
  // eslint-disable-next-line
  require(`brace/mode/${language}`)
  return ace.acequire(['static_highlight'], module => module(value, language))
}

async function requireAceModule(modulePath) {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line
      require(`br${modulePath}`)
      // eslint-disable-next-line
      ace.acequire([modulePath], (module) => {
        return resolve(module)
      })
    } catch (err) {
      return reject(err)
    }
    return null
  })
}

async function loadTheme(themeName) {
  const { cssText } = await requireAceModule(`ace/theme/${themeName}`)
  return cssText
}

module.exports = {
  highlight,
  loadTheme,
  requireAceModule
}
