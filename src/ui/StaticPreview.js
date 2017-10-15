import React, { PropTypes } from 'react'
import styled from 'styled-components'

const PreviewContainer = styled.div`
  align-self: center;
  padding: 28px;
  width: 100%;
  height: 400px;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  overflow: scroll;
`

function StaticPreview({ html, fontface, theme }) {
  return (
    <PreviewContainer>
      <style>
        {theme}
      </style>
      <pre style={{ fontFamily: fontface, whiteSpace: 'pre-wrap' }}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </PreviewContainer>
  )
}

StaticPreview.propTypes = {
  html: PropTypes.string.isRequired,
  fontface: PropTypes.string,
  theme: PropTypes.string.isRequired
}

export default StaticPreview
