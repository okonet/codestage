/* eslint no-unused-expressions: 0 */
const path = require('path')
const {
  highlight,
  getThemes,
  getLanguages,
  resolvePackageDir,
  loadTheme
} = require('./highlight-js')

describe('highlight', () => {
  it('should return HTML with proper class names', async () => {
    const html = await highlight('async function html2rtf() {}', 'javascript')
    expect(html).toMatchSnapshot()
  })
})

describe('resolvePackageDir', () => {
  it('should resolve path to highlight.js/styles dir', () => {
    expect(resolvePackageDir('highlight.js')).toEqual(
      path.join(__dirname, '..', '..', 'node_modules', 'highlight.js')
    )
  })
})

describe('loadTheme', () => {
  it('should load highlight CSS and return a string', async () => {
    const { cssText } = await loadTheme('agate')
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
          cssText: expect.any(String),
          name: expect.any(String),
          path: expect.any(String)
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
