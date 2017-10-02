/* eslint no-unused-expressions: 0 */
const path = require('path')
const { getThemes, getLanguages, resolvePackageDir, loadTheme } = require('./highlight-js')

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
        cssAst: expect.any(Object),
        cssText: expect.any(String),
        name: expect.any(String)
      })
    )
  })
})

describe('getThemes', () => {
  it('should return array of objects with names and paths to themes', async () => {
    expect(await getThemes()).toMatchSnapshot()
  })

  it('should match the shape', async () => {
    const themes = await getThemes()
    themes.forEach(theme => {
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