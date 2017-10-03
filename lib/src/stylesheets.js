const csstree = require('css-tree')
const color = require('color')
const { uniqWith, isEqual } = require('lodash')

function getCssAst(cssText) {
  const colorTable = []
  const ast = csstree.parse(cssText)
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
          // Remove unparsable color declaration from the AST
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

function colorTableToRTF(colors) {
  // eslint-disable-next-line id-length
  const parts = colors.map(c => `\\red${c.r}\\green${c.g}\\blue${c.b};`)
  return `{\\colortbl${parts.join('')}}`
}

function matchDeclarations(ast, selector) {
  const declarations = []
  csstree.walkRules(ast, rule => {
    csstree.walk(rule.selector, node => {
      // Find a matching selector
      if (node.type === 'ClassSelector' && node.name === selector) {
        // Collect all declarations
        // eslint-disable-next-line no-shadow
        csstree.walkDeclarations(rule.block, node => {
          const existendDecl = declarations.find(decl => decl.property === node.property)
          if (existendDecl) {
            existendDecl.value = node.value
          } else {
            declarations.push(node)
          }
        })
      }
    })
  })
  return declarations
}

module.exports = {
  getCssAst,
  colorTableToRTF,
  matchDeclarations
}
