import React, { PropTypes } from 'react'
import Frame from 'react-frame-component'
import styled from 'styled-components'
import { ThemePropType } from '../shared/constants/editor'

const PreviewContainer = styled(Frame)`
  width: 100%;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  pointer-events: none;
`

function StaticPreview({ html, fontface, theme, className }) {
  return (
    <PreviewContainer
      className={className}
      initialContent={`<!DOCTYPE html><html><head></head><body class="${
        theme.cssClass
      }"><div></div></body></html>`}
    >
      <style>{`
body {
  overflow:hidden;
}
${theme.cssText}
      `}</style>
      <pre style={{ fontFamily: fontface, fontSize: '50%' }}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </PreviewContainer>
  )
}

StaticPreview.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string.isRequired,
  fontface: PropTypes.string,
  theme: ThemePropType
}

export default StaticPreview
