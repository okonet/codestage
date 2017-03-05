'use strict'

const lowlight = require('lowlight')
const csstree = require('css-tree')
const color = require('color')
const { findIndex } = require('lodash')
const {
  loadStylesheet,
  getSheet,
  getColorTable,
  colorTableToRTF,
  matchDeclarations
} = require('./stylesheets')

let colorMap = []

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
    classNames.forEach((className) => {
      const declarations = matchDeclarations(sheet, className)
      declarations.forEach((decl) => {
        const { property, value } = decl
        const val = csstree.translate(value)
        switch (property) {
          case 'color':
          case 'background':
          case 'background-color': {
            // find matching color in the color table
            const col = color(val).object()
            const colorIdx = findIndex(colorMap, col)
            const sym = property === 'color' ? 'cf' : 'cb'
            controlSymbols.push(`\\${ sym }${ colorIdx }`)
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
    content = controlSymbols.length ? `{${ controlSymbols.join('') } ${ content }}` : content
  }
  return content
}

/* Visit children in `node`. */
function all(nodes, sheet) {
  const result = nodes.map(node => visit(node, sheet))
  return result.join('')
}

function encode(text) {
  return text
    .replace('\\', '\\\\')
    .replace('{', '\\{')
    .replace('}', '\\}')
}

/* Highlight `value` as `language`. */
function highlight(language, value, theme) {
  const result = lowlight.highlight.call(this, language, value)
  const sheet = getSheet(loadStylesheet(theme || 'idea')) // Default theme is xcode
  colorMap = getColorTable(sheet)
  result.value = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fmodern\\fprq1\\fcharset0 Courier New;}}
${ colorTableToRTF(colorMap) }
\\paperw11905\\paperh16837\\margl1134\\margr1134\\margt1134\\margb1134\\sectd\\plain\\f1\\fs20
\\pard ${ all(result.value, sheet).replace(/\n/g, '\\par\\pard\n') }
}`
  return result
}

module.exports = {
  highlight
}
