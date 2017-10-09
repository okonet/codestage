const { JSDOM } = require('jsdom')
const unified = require('unified')
const rehypeParse = require('rehype-parse')
const csstree = require('css-tree')
const color = require('color')
const { defaults, findIndex } = require('lodash')
const Highlighter = require('./highlighters/ace')
const { resolvePackageDir, getCssAst, colorTableToRTF } = require('./stylesheets')

function unicodeEscape(str) {
  return str
    .split('')
    .map(char => {
      const charCode = char.codePointAt(0)
      if (Math.pow(2, 7) <= charCode && charCode < Math.pow(2, 16)) {
        // single unicode escape sequence
        return `{\\u${charCode}}`
      } else if (Math.pow(2, 16) <= charCode) {
        // RTF limits unicode to 16 bits. Force surrogate pairs
        // Given a unicode character code
        // with length greater than 16 bits,
        // return the two 16 bit surrogate pair.
        // From example D28 of:
        // http://www.unicode.org/book/ch03.pdf
        // eslint-disable-next-line no-bitwise
        return `{\\u${0xd7c0 + (charCode >> 10)}}{\\u${0xdc00 + (charCode & 0x3ff)}}`
      }
      // Return ASCII and anything else as-is
      return char
    })
    .join('')
}

function encode(text) {
  return unicodeEscape(
    text.replace('\\', '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}').replace(/\n/g, '\\par\n')
  )
}

/* Visit children in `node`. */
function all(nodes, dom, colorTable) {
  // eslint-disable-next-line no-use-before-define
  const result = nodes.map(node => visit(node, dom, colorTable))
  return result.join('')
}

/* Visit one `node`. */
function visit(node, dom, colorTable) {
  const classNames = (node.properties || {}).className
  const controlSymbols = []
  let content = ''
  if ('value' in node) {
    content = encode(node.value)
  }
  if ('children' in node) {
    content = all(node.children, dom, colorTable)
  }
  if (classNames) {
    // Convert Array to CSS selector string
    // eslint-disable-next-line no-param-reassign
    const selector = classNames.reduce((res, cn) => (res += cn === ' ' ? ' ' : `.${cn}`), '')
    // Match the DOM element
    const el = dom.window.document.querySelector(selector)
    // Get computed styles
    const styleObj = dom.window.getComputedStyle(el)
    // Apply each style declaration
    Array.prototype.slice.call(styleObj).forEach(property => {
      const val = styleObj.getPropertyValue(property)
      switch (property) {
        case 'color':
        case 'background':
        case 'background-color': {
          const col = color(val)
          const colorIdx = findIndex(colorTable, col.object())
          const sym = property === 'color' ? 'cf' : 'cb'
          controlSymbols.push(`\\${sym}${colorIdx}`)
          break
        }
        case 'font-weight': {
          if (val === 'bold') {
            controlSymbols.push('\\b')
          }
          break
        }
        case 'font-style': {
          if (val === 'italic') {
            controlSymbols.push('\\i')
          }
          break
        }
        case 'text-decoration': {
          if (val === 'underline') {
            controlSymbols.push('\\ul')
          }
          break
        }
        default:
      }
    })
    content = controlSymbols.length ? `{${controlSymbols.join('')} ${content}}` : content
  }
  return content
}

function renderRTF(htmlText, cssText, fontface = 'Courier New', fontsize = 40) {
  const { ast: cssAst, colorTable } = getCssAst(cssText)
  const styles = csstree.translate(cssAst)
  // We use JSDOM to match selectors and getComputedStyle
  const dom = new JSDOM(`
    <html>
      <head><style>${styles}</style></head>
      <body>${htmlText}</body>
    </html>
`)
  const htmlAst = unified().use(rehypeParse, { fragment: true }).parse(htmlText)
  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fmodern\\fprq1\\fcharset0 ${fontface};}}
${colorTableToRTF(colorTable)}
\\f0\\fs${fontsize}
${all(htmlAst.children, dom, colorTable)}
}`
}

/* Highlight `value` as `language`. */
async function highlight(value, language, options) {
  // eslint-disable-next-line no-param-reassign
  options = defaults(options, {
    fontface: 'Courier New',
    fontsize: 40,
    theme: 'github'
  })
  const { theme, fontface, fontsize } = options
  const { cssText } = await Highlighter.loadTheme(theme)
  const highlightedHtml = await Highlighter.highlight(value, language, options)
  console.log(highlightedHtml)
  return {
    html: highlightedHtml,
    value: renderRTF(highlightedHtml, cssText, fontface, fontsize)
  }
}

module.exports = {
  highlight,
  renderRTF,
  resolvePackageDir
}
