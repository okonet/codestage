const { highlight, highlightAuto } = require('./index')

describe('highlightRTFRenderer', () => {
  it('should render a string', async () => {
    const source = 'const a = "foo";'
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
})
