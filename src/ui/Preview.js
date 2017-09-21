import React, { PropTypes } from 'react'
import styled from 'styled-components'

const PreviewContainer = styled.div`
  width: 100%;
  height: 250px;
  overflow: scroll;
`

function Preview({ html, fontface, theme }) {
  return (
    <PreviewContainer>
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
    </PreviewContainer>
  )
}

Preview.propTypes = {
  html: PropTypes.string.isRequired,
  fontface: PropTypes.string,
  theme: PropTypes.string.isRequired
}

export default Preview
