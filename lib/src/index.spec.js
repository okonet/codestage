const { highlight, renderRTF } = require('./index')

describe('renderRTF', () => {
  it('should not add unnecessary new lines', async () => {
    const html = ''
    const css = ''
    const res = renderRTF(html, css)
    expect(res).toMatchSnapshot()
  })

  it('should apply simple CSS selectors to HTML', async () => {
    const html = '<span class="a">test</span>'
    const css = `
     .a { color: red; }
    `
    const res = renderRTF(html, css)
    expect(res).toMatchSnapshot()
  })

  it('should apply complex CSS selectors to HTML', async () => {
    const html = '<span class="a b">test</span>'
    const css = `
     .a { color: red; }
     .a.b { color: blue; }
    `
    const res = renderRTF(html, css)
    expect(res).toMatchSnapshot()
  })

  it('should apply even more complex CSS selectors to HTML', async () => {
    const html = `
      <div class="wrapper">
        <span class="c">1</span>
        <span class="a">2</span>
        <span class="a b">3</span>
      </div>`
    const css = `
     .wrapper { color: rgb(0,255,0); }
     .a { color: red; }
     .a.b { color: blue; }
    `
    const res = renderRTF(html, css)
    expect(res).toMatchSnapshot()
  })
})

describe('highlight renderer', () => {
  it('should not add unnecessary new lines', async () => {
    const source = ''
    const res = await highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should render multiple lines', async () => {
    const source = `line1
line2


line5
`
    const res = await highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should render a string', async () => {
    const source = 'const a = "foo";'
    const res = await highlight(source, 'javascript', { theme: 'chrome' })
    expect(res.value).toMatchSnapshot()
  })

  it('should render multiple lines', async () => {
    const source = `line1
line2


line5
`
    const res = await highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should encode curly brackets and back slashes', async () => {
    const source = `{
    \\ test
    }`
    const res = await highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should not add white spaces', async () => {
    const source = `test.then((result) => {
  console.log(result.stdout)
})`
    const res = await highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should render specific styles', async () => {
    const source = `
// Comment
function test() {}
`
    const res = await highlight(source, 'javascript', { theme: 'xcode' })
    expect(res.value).toMatchSnapshot()
  })

  it('should render javascript', async () => {
    const source = `settings.set('user.name', {
  first: 'Cosmo',
  last: 'Kramer'
}).then(() => {
  settings.get('user.name.first').then(val => {
    console.log(val);
    // => 'Cosmo'
  });
});
`
    const res = await highlight(source, 'javascript', { theme: 'xcode' })
    expect(res.value).toMatchSnapshot()
  })

  it('should encode single unicode symbols', async () => {
    // RTF doesn't suport Unicode so we need to encode them
    const source = 'â € ¤ каждой'
    const res = await highlight(source, 'css')
    expect(res.value).toMatchSnapshot()
  })

  it('should encode double unicode symbols', async () => {
    // RTF doesn't suport Unicode so we need to encode them
    const source = 'က 힣 ↕ ↕︎ 鼖'
    const res = await highlight(source, 'css')
    expect(res.value).toMatchSnapshot()
  })

  it('should not throw on unparsed colors', async () => {
    expect.assertions(1)
    const source = '* { background: url("image.png"); }'
    await expect(highlight(source, 'css')).resolves.toBeDefined()
  })
})
