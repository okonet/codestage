/* eslint import/no-extraneous-dependencies: 0 */

import stripIndent from 'strip-indent'
import rtfRenderer from '../../lib/'
import { DEFAULT_SETTINGS } from '../shared/constants/defaults'

export default async function codeHighlight(input, settings) {
  const options = settings.get('highlight', DEFAULT_SETTINGS.highlight)
  const stripped = stripIndent(input)
  const result = await rtfRenderer
    .highlight(stripped, options.lastUsedLanguage || 'javascript', options)
    .catch(error => {
      throw new Error(`Could not render RTF!
      ${error}`)
    })
  result.language = options.lastUsedLanguage
  return Object.assign({}, result, options)
}
