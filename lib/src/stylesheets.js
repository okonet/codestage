const csstree = require('css-tree')
const color = require('color')
const { uniqWith, isEqual } = require('lodash')

function getCssAst(cssText) {
  const colorTable = []
  const ast = csstree.parse(cssText)
  // Remove unparsable color declaration from the AST
  csstree.walkDeclarations(ast, (node, item, list) => {
    const { property, value } = node
    switch (property) {
      case 'color':
      case 'background':
      case 'background-color': {
        try {
          const parsedColor = color(csstree.translate(value))
          colorTable.push(parsedColor.object())
        } catch (err) {
          list.remove(item)
        }
        break
      }
      default: {
        break
      }
    }
  })
  return {
    ast,
    colorTable: uniqWith(colorTable, isEqual)
  }
}

function stripBackgroundForSelector(cssText, className) {
  const ast = csstree.parse(cssText)
  // Remove background or background-color declaration from the root .hljs rule
  csstree.walkRules(ast, rule => {
    csstree.walk(rule.selector, node => {
      // Find a matching .hljs selector
      if (node && node.type === 'ClassSelector' && node.name === className) {
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
  return csstree.translate(ast)
}

function colorTableToRTF(colors) {
  // eslint-disable-next-line id-length
  const parts = colors.map(c => `\\red${c.r}\\green${c.g}\\blue${c.b};`)
  return `{\\colortbl${parts.join('')}}`
}

module.exports = {
  getCssAst,
  stripBackgroundForSelector,
  colorTableToRTF
}
