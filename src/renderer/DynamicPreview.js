import React, { PropTypes } from 'react'
import AceEditor from 'react-ace'
import styled from 'styled-components'
import { ThemePropType } from '../shared/constants/editor'

const PreviewContainer = styled.div`
  padding: 40px;
  width: calc(1 * 100vmin);
  height: calc(3/4 * 100vmin);
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`

class DynamicPreview extends React.Component {
  componentDidUpdate() {
    // No spellchecking and other intelligence
    this.ace.editor.getSession().setOption('useWorker', false)
    // No folding on the gutter
    this.ace.editor.renderer.setOption('showFoldWidgets', false)
    // Hide cursor completely
    this.ace.editor.renderer.$cursorLayer.element.style.display = 'none'
  }

  render() {
    const { value, fontface, fontsize, language, showGutter, theme } = this.props
    require(`brace/mode/${language}`) // eslint-disable-line
    require(`brace/theme/${theme.name}`) // eslint-disable-line
    // Someone very smart at Ace decided that theme.name and className
    // should not be the same :shrug:
    const themeClassName = theme.name.replace(/_/g, '-')
    return (
      <PreviewContainer className={`ace-${themeClassName}`}>
        <AceEditor
          ref={node => {
            this.ace = node
          }}
          mode={language}
          theme={theme.name}
          value={value}
          showGutter={showGutter}
          highlightActiveLine={false}
          readOnly
          fontSize={`${fontsize / 5.8}px`}
          width="100%"
          height="100%"
          style={{ fontFamily: fontface }}
          editorProps={{
            $blockScrolling: true
          }}
        />
      </PreviewContainer>
    )
  }
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
