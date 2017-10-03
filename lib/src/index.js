const unified = require('unified')
const rehypeParse = require('rehype-parse')
const csstree = require('css-tree')
const color = require('color')
const { defaults, findIndex } = require('lodash')
const Highlighter = require('./highlighters/ace')
const {
  resolvePackageDir,
  getColorTable,
  colorTableToRTF,
  matchDeclarations
} = require('./stylesheets')

let colorMap = []

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
function all(nodes, sheet) {
  // eslint-disable-next-line no-use-before-define
  const result = nodes.map(node => visit(node, sheet))
  return result.join('')
}

/* Visit one `node`. */
function visit(node, sheet) {
  const classNames = (node.properties || {}).className
  const controlSymbols = []

  let content = ''

  if ('value' in node) {
    content = encode(node.value)
  }

  if ('children' in node) {
    content = all(node.children, sheet)
  }

  if (classNames) {
    classNames.forEach(className => {
      const declarations = matchDeclarations(sheet, className)
      declarations.forEach(decl => {
        const { property, value } = decl
        const val = csstree.translate(value)
        switch (property) {
          case 'color':
          case 'background':
          case 'background-color': {
            try {
              // find matching color in the color table
              const col = color(val).object()
              const colorIdx = findIndex(colorMap, col)
              const sym = property === 'color' ? 'cf' : 'cb'
              controlSymbols.push(`\\${sym}${colorIdx}`)
            } catch (err) {
              // If the color can't be parsed, just ignore it
            }
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
    })
    content = controlSymbols.length ? `{${controlSymbols.join('')} ${content}}` : content
  }
  return content
}

function renderRTF(htmlAst, cssAst, options) {
  const { fontface, fontsize } = options
  colorMap = getColorTable(cssAst)
  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fmodern\\fprq1\\fcharset0 ${fontface};}}
${colorTableToRTF(colorMap)}
\\f0\\fs${fontsize}
${all(htmlAst, cssAst)}
}`
}

async function html2rtf(html, options) {
  const { theme } = options
  const { cssAst } = await Highlighter.loadTheme(theme)
  const ast = unified().use(rehypeParse, { fragment: true }).parse(html)
  return {
    ast,
    html,
    value: renderRTF(ast.children, cssAst, options)
  }
}

/* Highlight `value` as `language`. */
async function highlight(value, language, options) {
  // eslint-disable-next-line no-param-reassign
  options = defaults(options, {
    fontface: 'Courier New',
    fontsize: 40,
    theme: 'github'
  })
  const highlightedHtml = await Highlighter.highlight(value, language, options)
  return await html2rtf(highlightedHtml, options)
}

/* Highlight `value` with auto language detection. */
function highlightAuto(value, options) {
  const result = Highlighter.highlightAuto(value, options.subset)
  return Object.assign(result, html2rtf(result.value, options))
}

module.exports = {
  highlight,
  highlightAuto,
  resolvePackageDir
}
