/* eslint no-unused-expressions: 0 */
const { getThemes, getLanguages, loadTheme } = require('./ace')

describe('loadTheme', () => {
  it('should load CSS, strip CSS specificity and return a string', async () => {
    const { cssText } = await loadTheme('github')
    expect(cssText).toMatchSnapshot()
  })

  it('should not contain specificity', async () => {
    const { cssText } = await loadTheme('github')
    expect(cssText).not.toMatch('.ace-github .ace')
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
