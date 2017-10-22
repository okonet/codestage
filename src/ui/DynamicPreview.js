import React, { PropTypes } from 'react'
import styled from 'styled-components'
import AceEditor from 'react-ace'

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
