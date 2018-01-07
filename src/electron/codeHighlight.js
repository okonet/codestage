/* eslint import/no-extraneous-dependencies: 0 */

import stripIndent from 'strip-indent'
import rtfRenderer from '../../lib/'
import { DEFAULT_SETTINGS } from '../shared/constants/defaults'

export default async function codeHighlight(input, settings) {
  const { language, ...options } = settings.get('highlight', DEFAULT_SETTINGS.highlight)
  const stripped = stripIndent(input)
  try {
    const result = await rtfRenderer.highlight(stripped, language, options)
    return {
      ...result,
      ...options,
      text: stripped,
      language
    }
  } catch (error) {
    throw new Error(`Could not render RTF!
        ${error}`)
  }
}
