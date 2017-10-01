const csstree = require('css-tree')
const { getColorTable, colorTableToRTF, matchDeclarations, getSheet } = require('./stylesheets')

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

describe('getColorTable', () => {
  it('should return an object of all used colors', async () => {
    const sheet = await getSheet(styles)
    const res = getColorTable(sheet)
    expect(res).toMatchSnapshot()
  })
})

describe('colorTableToRTF', () => {
  it('should return a string', () => {
    const res = colorTableToRTF(getColorTable(getSheet(styles)))
    expect(res).toMatchSnapshot()
  })
})

describe('matchDeclarations,', () => {
  it('should return a array of Declarations for matched selectors', async () => {
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
    const ast = await getSheet(sheet)
    expect(matchDeclarations(ast, 'hljs').length).toEqual(5)
    expect(matchDeclarations(ast, 'comment').length).toEqual(1)
    expect(matchDeclarations(ast, 'keyword').length).toEqual(2)
    expect(matchDeclarations(ast, 'quote').length).toEqual(2)
    // Proper inheritance
    expect(csstree.translate(matchDeclarations(ast, 'quote')[0])).toEqual('color:#aa0d91')
    expect(csstree.translate(matchDeclarations(ast, 'quote')[1])).toEqual('background:#fff')
  })
})

describe('getSheet', () => {
  it('should return a AST object', async () => {
    const res = getSheet(styles)
    expect(res).toMatchSnapshot()
  })
})
