const csstree = require('css-tree')
const { getCssAst, stripBackgroundForSelector, colorTableToRTF } = require('./stylesheets')

describe('getCssAst', () => {
  it('should return an AST for a given CSS text', () => {
    const { ast } = getCssAst('* { color: red; }')
    expect(ast).toMatchSnapshot()
  })

  it('should remove unparsed colors from AST', () => {
    const validColors = [
      '* { background: red; }',
      '* { background: #cf0; }',
      '* { background: transparent; }'
    ]
    const invalidColors = [
      '* { background: #yyy; }',
      '* { background: url(""); }',
      '* { background: nonsense; }'
    ]
    validColors.concat(invalidColors).forEach(sheet => {
      const { ast } = getCssAst(sheet)
      expect(csstree.translate(ast)).toMatchSnapshot()
    })
  })

  it('should return a unique list of theme colors', () => {
    const { colorTable } = getCssAst(`
      * { color: red; }
      .test { background-color: red }
      .test-2 { background: rgba(0, 100, 255, 0.5); }
    `)
    expect(colorTable).toMatchSnapshot()
  })
})

describe('stripBackgroundForSelector', () => {
  it('should remove background rules for a given selector', () => {
    const { ast } = getCssAst('.test { background-color: red; background: none; color: blue; }')
    const strippedAst = stripBackgroundForSelector(ast, 'test')
    expect(csstree.translate(strippedAst)).toMatchSnapshot()
  })

  it('should only remove background rules for a given selector', () => {
    const { ast } = getCssAst('* { color: red; }')
    const strippedAst = stripBackgroundForSelector(ast, 'test')
    expect(csstree.translate(strippedAst)).toMatchSnapshot()
  })
})

describe('colorTableToRTF', () => {
  it('should return a string', () => {
    const { colorTable } = getCssAst(`
      .test { background-color: red }
      .test-2 { background: rgba(0, 100, 255, 0.5); }
    `)
    const res = colorTableToRTF(colorTable)
    expect(res).toMatchSnapshot()
  })
})
