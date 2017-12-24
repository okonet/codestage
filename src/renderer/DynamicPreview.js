import React, { PropTypes } from 'react'
import AceEditor from 'react-ace'
import { ThemePropType } from '../shared/constants/editor'

function DynamicPreview({ value, fontface, fontsize, language, showGutter, theme }) {
  require(`brace/mode/${language}`) // eslint-disable-line
  require(`brace/theme/${theme.name}`) // eslint-disable-line
  return (
    <AceEditor
      mode={language}
      theme={theme.name}
      value={value}
      showGutter={showGutter}
      readOnly
      fontSize={`${fontsize / 4}px`}
      width="100%"
      height="100%"
      style={{ fontFamily: fontface, position: 'relative' }}
    />
  )
}

DynamicPreview.propTypes = {
  value: PropTypes.string.isRequired,
  fontface: PropTypes.string,
  fontsize: PropTypes.number,
  language: PropTypes.string.isRequired,
  showGutter: PropTypes.bool,
  theme: ThemePropType
}

export default DynamicPreview
