/* eslint no-unused-expressions: 0 */
const { getThemes, getLanguages, loadTheme } = require('./ace')

describe('loadTheme', () => {
  it('should load CSS and return a string', async () => {
    const { cssText } = await loadTheme('github')
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
