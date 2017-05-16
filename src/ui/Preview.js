import React, { PropTypes } from 'react'

const unified = require('unified')
const rehypeParse = require('rehype-parse')
const rehypeReact = require('rehype-react')

const reqLangs = require.context('highlight.js/lib/languages/', false, /.+\.js$/) // Read all
// language files
// in the config
// dir
reqLangs.keys().forEach(lang => {
  try {
    const dep = reqLangs(lang)
    // Lowlight.registerLanguage(lang, dep)
  } catch (err) {
    console.error('Could not register language: %s', lang)
    console.error(err)
  }
})

const processor = unified().use(rehypeParse).use(rehypeReact, {
  createElement: React.createElement
})

function Preview({ ast, fontface, codeSnippet, theme, subset }) {
  const props = subset.length ? { subset } : {}
  return (
    <div style={{ fontFamily: fontface, height: 250, overflow: 'scroll' }}>
      <style>
        {theme}
      </style>
      <pre>
        <code className="language-javascript">
          {ast && processor.stringify(ast)}
        </code>
      </pre>
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
