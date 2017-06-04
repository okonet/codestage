import React, { PropTypes } from 'react'

function Preview({ html, fontface, theme }) {
  return (
    <div style={{ height: 250, overflow: 'scroll' }}>
      <style>
        {theme}
      </style>
      <pre>
        <code
          className="hljs"
          style={{ fontFamily: fontface }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  )
}

Preview.propTypes = {
  html: PropTypes.string.isRequired,
  fontface: PropTypes.string,
  theme: PropTypes.string.isRequired
}

export default Preview
