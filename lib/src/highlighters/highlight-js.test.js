/* eslint no-unused-expressions: 0 */
import path from 'path'
import { resolvePackageDir, loadTheme } from './highlight-js'

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
})
