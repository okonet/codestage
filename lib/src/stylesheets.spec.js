const csstree = require('css-tree')
const { getCssAst, colorTableToRTF, matchDeclarations } = require('./stylesheets')

const styles = `
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #fff;
  color: black;
}

.hljs-comment,
.hljs-quote {
  color: #006a00;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-literal {
  color: #aa0d91;
}

.hljs-quote {
  color: #ffffff;
}
`

describe('getCssAst', () => {
  it('should return an AST for a given CSS text', () => {
    const { ast } = getCssAst(styles)
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

  it('should return an object of all used colors', () => {
    const { colorTable } = getCssAst(styles)
    expect(colorTable).toMatchSnapshot()
  })
})

describe('colorTableToRTF', () => {
  it('should return a string', () => {
    const { colorTable } = getCssAst(styles)
    const res = colorTableToRTF(colorTable)
    expect(res).toMatchSnapshot()
  })
})

describe('matchDeclarations,', () => {
  it('should return a array of Declarations for matched selectors', () => {
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
