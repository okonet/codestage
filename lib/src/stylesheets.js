const fs = require('fs')
const path = require('path')
const csstree = require('css-tree')
const color = require('color')
const { uniqWith, isEqual } = require('lodash')

function resolveStylesheetsDir() {
  const hlPath = path.dirname(require.resolve('highlight.js/package.json'))
  return path.resolve(hlPath, 'styles')
}

function loadStylesheet(themeName) {
  return fs.readFileSync(path.join(resolveStylesheetsDir(), `${themeName}.css`), 'utf-8')
}

function getSheet(cssString) {
  return csstree.parse(cssString)
}

function getColorTable(ast) {
  const colors = []
  csstree.walk(ast, node => {
    if (
      (node.type === 'Declaration' && node.property === 'color') ||
      node.property === 'background-color' ||
      node.property === 'background'
    ) {
      const colorString = csstree.translate(node.value)
      colors.push(color(colorString).object())
    }
  })
  return uniqWith(colors, isEqual)
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
  getColorTable,
  colorTableToRTF,
  matchDeclarations,
  loadStylesheet,
  resolveStylesheetsDir,
  getSheet
}
