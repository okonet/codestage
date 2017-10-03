const csstree = require('css-tree')
const { getCssAst, colorTableToRTF, matchDeclarations } = require('./stylesheets')

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

describe('matchDeclarations,', () => {
  it('should return an array of Declarations for matched selectors', () => {
    const sheet = `
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #fff;
  color: black;
}

.hljs.comment,
.hljs.quote {
  color: #006a00;
}

.hljs.keyword,
.hljs.quote {
  color: #aa0d91;
  background: #fff;
}
`
    const { ast } = getCssAst(sheet)
    expect(matchDeclarations(ast, 'hljs').length).toEqual(5)
    expect(matchDeclarations(ast, 'comment').length).toEqual(1)
    expect(matchDeclarations(ast, 'keyword').length).toEqual(2)
    expect(matchDeclarations(ast, 'quote').length).toEqual(2)
    // Proper inheritance
    expect(csstree.translate(matchDeclarations(ast, 'quote')[0])).toEqual('color:#aa0d91')
    expect(csstree.translate(matchDeclarations(ast, 'quote')[1])).toEqual('background:#fff')
  })
})
