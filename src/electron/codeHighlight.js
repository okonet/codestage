/* eslint import/no-extraneous-dependencies: 0 */

import stripIndent from 'strip-indent'
import rtfRenderer from '../../lib/'
import { DEFAULT_SETTINGS } from '../shared/constants/defaults'

export default async function codeHighlight(input, settings) {
  const fontface = settings.get('fontface', DEFAULT_SETTINGS.fontface)
  const fontsize = settings.get('fontsize', DEFAULT_SETTINGS.fontsize)
  const theme = settings.get('theme', DEFAULT_SETTINGS.theme)
  const lastUsedLanguage = settings.get('lastUsedLanguage', DEFAULT_SETTINGS.lastUsedLanguage)
  const lineNumbers = settings.get('lineNumbers', DEFAULT_SETTINGS.lineNumbers)
  const options = {
    fontface,
    fontsize,
    theme,
    lineNumbers
  }
  const stripped = stripIndent(input)
  const result = await rtfRenderer
    .highlight(stripped, lastUsedLanguage || 'javascript', options)
    .catch(error => {
      throw new Error(`Could not render RTF!
      ${error}`)
    })
  result.language = lastUsedLanguage
  return Object.assign({}, result, options)
}
