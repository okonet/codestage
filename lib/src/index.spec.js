'use strict'

const { highlight } = require('./index')

describe('highlightRTFRenderer', () => {
  it('should render a string', () => {
    const source = 'const a = "foo";'
    const res = highlight('javascript', source)
    expect(res.value).toMatchSnapshot()
  })

  it('should render multiple lines', () => {
    const source = `line1
line2


line5
`
    const res = highlight('javascript', source)
    expect(res.value).toMatchSnapshot()
  })

  it('should encode curly brackets and back slashes', () => {
    const source = `{
    \\ test
    }`
    const res = highlight('javascript', source)
    expect(res.value).toMatchSnapshot()
  })

  it('should render specific styles', () => {
    const source = `
// Comment
function test() {}
`
    const res = highlight('javascript', source, 'idea')
    expect(res.value).toMatchSnapshot()
  })
})
