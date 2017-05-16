const path = require('path')
const csstree = require('css-tree')
const {
  getColorTable,
  colorTableToRTF,
  matchDeclarations,
  loadStylesheet,
  resolveStylesheetsDir,
  getSheet
} = require('./stylesheets')

describe('resolveStylesheetsDir', () => {
  it('should resolve path to highlight.js/styles dir', () => {
    expect(resolveStylesheetsDir('highlight.js', 'styles')).toEqual(
      path.join(__dirname, '..', 'node_modules', 'highlight.js', 'styles')
    )
  })
})

describe('loadStylesheet', () => {
  it('should load highlight CSS and return a string', () => {
    const sheet = loadStylesheet('agate', 'highlight.js', 'styles')
    expect(sheet).toMatchSnapshot()
  })
})

describe('getColorTable', () => {
  it('should return an object of all used colors', () => {
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

.hljs-quote2 {
  color: #ffffff;
}
`
    const sheet = getSheet(styles)
    const res = getColorTable(sheet)
    expect(res).toMatchSnapshot()
  })
})

describe('colorTableToRTF', () => {
  it('should return a string', () => {
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

.hljs-quote2 {
  color: #ffffff;
}
`
    const res = colorTableToRTF(getColorTable(getSheet(styles)))
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
    const ast = getSheet(sheet)
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
  it('should return a AST object', () => {
    const res = getSheet(loadStylesheet('agate', 'highlight.js', 'styles'))
    expect(res).toMatchSnapshot()
  })
})
