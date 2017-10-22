import React, { PropTypes } from 'react'
import styled from 'styled-components'
import AceEditor from 'react-ace'

const PreviewContainer = styled.div`
  padding: 7vmin;
  width: calc(1 * 100vmin);
  height: calc(3/4 * 100vmin);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`

function DynamicPreview({ value, fontface, language, theme }) {
  require(`brace/mode/${language}`) // eslint-disable-line
  require(`brace/theme/${theme}`) // eslint-disable-line
  return (
    <PreviewContainer>
      <AceEditor
        mode={language}
        theme={theme}
        value={value}
        showGutter={false}
        readOnly
        fontSize="3vmin"
        width="100%"
        height="100%"
        style={{ fontFamily: fontface }}
      />
    </PreviewContainer>
  )
}

DynamicPreview.propTypes = {
  value: PropTypes.string.isRequired,
  fontface: PropTypes.string,
  language: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
}

export default DynamicPreview
