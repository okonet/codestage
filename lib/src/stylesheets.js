const fs = require('fs')
const path = require('path')
const css = require('jss-css/lib/css')
const csstree = require('css-tree')
const color = require('color')
const { includes, uniqWith, uniqBy, isEqual } = require('lodash')

const colorRules = ['color', 'background-color']

function loadStylesheet(themeName) {
  const hlPath = path.dirname(require.resolve('highlight.js/package.json'))
  return fs.readFileSync(path.resolve(hlPath, 'styles', `${ themeName }.css`), 'utf-8')
}

function getSheet(cssString) {
  // const sheet = css`${cssString}`
  // Object.keys(sheet).forEach(className => {
  //   Object.keys(sheet[className]).forEach(rule => {
  //     if (includes(colorRules, rule)) {
  //       const val = sheet[className][rule]
  //       sheet[className][rule] = color(val).object()
  //     }
  //   })
  // });
  return csstree.parse(cssString)
}

function getColorTable(ast) {
  const colors = []
  csstree.walk(ast, (node) => {
    if (node.type === 'HexColor') {
      colors.push(color(`#${ node.value }`).object())
    }
  })
  return uniqWith(colors, isEqual)
}

function colorTableToRTF(colors) {
  const parts = colors.map(c => `\\red${ c.r }\\green${ c.g }\\blue${ c.b };`)
  return `{\\colortbl;${ parts.join('') }}`
}

function matchDeclarations(ast, selector) {
  const declarations = []
  csstree.walkRules(ast, (rule) => {
    csstree.walk(rule.selector, (node) => {
      // Find a matching selector
      if (node.type === 'ClassSelector' && node.name === selector) {
        // Collect all declarations
        csstree.walkDeclarations(rule.block, (node) => {
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
  getSheet
}

