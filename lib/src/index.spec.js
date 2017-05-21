const { highlight, highlightAuto } = require('./index')

describe('highlightRTFRenderer', () => {
  it('should render a string', () => {
    const source = 'const a = "foo";'
    const res = highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should render multiple lines', () => {
    const source = `line1
line2


line5
`
    const res = highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should encode curly brackets and back slashes', () => {
    const source = `{
    \\ test
    }`
    const res = highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should not add white spaces', () => {
    const source = `test.then((result) => {
  console.log(result.stdout)
})`
    const res = highlight(source, 'javascript')
    expect(res.value).toMatchSnapshot()
  })

  it('should render specific styles', () => {
    const source = `
// Comment
function test() {}
`
    const res = highlight(source, 'javascript', { theme: 'xcode' })
    expect(res.value).toMatchSnapshot()
  })

  it('should render javascript', () => {
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
    const res = highlightAuto(source, { theme: 'xcode', subset: ['javascript'] })
    expect(res.value).toMatchSnapshot()
  })

  it('should encode single unicode symbols', () => {
    // RTF doesn't suport Unicode so we need to encode them
    const source = 'â € ¤ каждой'
    const res = highlight(source, 'css')
    expect(res.value).toMatchSnapshot()
  })

  it('should encode double unicode symbols', () => {
    // RTF doesn't suport Unicode so we need to encode them
    const source = 'က 힣 ↕ ↕︎ 鼖'
    const res = highlight(source, 'css')
    expect(res.value).toMatchSnapshot()
  })
})
