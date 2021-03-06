/* eslint no-unused-expressions: 0 */
const { highlight, getThemes, getLanguages, loadTheme } = require('./ace')

describe('highlight', () => {
  it('should return HTML with proper class names', async () => {
    const html = await highlight('async function html2rtf() {}', 'javascript')
    expect(html).toMatchSnapshot()
  })

  it('should not add unnecessary new line', async () => {
    const html = await highlight(
      `1. line
2. line`,
      'markdown'
    )
    expect(html).toMatchSnapshot()
  })

  it('should add gutter to the output', async () => {
    const html = await highlight(
      `line
line`,
      'markdown',
      { lineNumbers: true }
    )
    expect(html).toMatchSnapshot()
  })

  it('should pad line numbers in the gutter depending on lines number', async () => {
    const html = await highlight(
      `line
line
line
line
line
line
line
line
line
line
`,
      'markdown',
      { lineNumbers: true }
    )
    expect(html).toMatchSnapshot()
  })
})

describe('loadTheme', () => {
  it('should load CSS, strip unparsable colors and return a string', async () => {
    const { cssText } = await loadTheme('github')
    expect(cssText).toMatchSnapshot()
  })

  it('should match the shape', async () => {
    const theme = await loadTheme('github')
    expect(theme).toEqual(
      expect.objectContaining({
        cssText: expect.any(String),
        name: expect.any(String)
      })
    )
  })
})

describe('getThemes', () => {
  it('should return themes as a key values object', async () => {
    const themes = await getThemes()
    Object.keys(themes).forEach(key => expect(key).toEqual(themes[key].name))
  })

  it('should match the shape', async () => {
    const themes = await getThemes()
    Object.values(themes).forEach(theme => {
      expect(theme).toEqual(
        expect.objectContaining({
          caption: expect.any(String),
          cssText: expect.any(String),
          isDark: expect.any(Boolean),
          name: expect.any(String),
          theme: expect.any(String)
        })
      )
    })
  })
})

describe('getLanguages', () => {
  it('should return array of objects with names and paths to languages', async () => {
    expect(await getLanguages()).toMatchSnapshot()
  })
})
