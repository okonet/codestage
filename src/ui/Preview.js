import React, { PropTypes } from 'react'
import Lowlight from 'react-lowlight'

const reqLangs = require.context('highlight.js/lib/languages/', false, /.+\.js$/) // Read all language files in the config dir
reqLangs.keys().forEach(lang => {
  try {
    const dep = reqLangs(lang)
    Lowlight.registerLanguage(lang, dep)
  } catch (err) {
    console.error('Could not register language: %s', lang)
    console.error(err)
  }
})

function Preview({ fontface, codeSnippet, theme, subset }) {
  const props = subset.length ? { subset } : {}
  return (
    <div style={{ fontFamily: fontface, height: 250, overflow: 'scroll' }}>
      <style>
        {theme}
      </style>
      <Lowlight value={codeSnippet} {...props} />
    </div>
  )
}

Preview.propTypes = {
  fontface: PropTypes.string,
  codeSnippet: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  subset: PropTypes.array.isRequired // eslint-disable-line
}

export default Preview
