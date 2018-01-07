import React, { Component, PropTypes } from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import Preview from './StaticPreview'
import { ThemePropType } from '../shared/constants/editor'

const Wrapper = styled(Box)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 20px;
  width: 100%;
  height: 100%;
  overflow: auto;
`

const PreviewItem = styled.button`
  position: relative;
  display: block;
  padding: 0;
  margin: 7px;
  margin-bottom: 30px;
  width: 150px;
  height: 110px;
  border: none;
  background: none;
  cursor: pointer;
  ${props => props.selected && `box-shadow: 0 0 0 4px blue;`};
`

const Label = styled.p`
  position: absolute;
  margin: 7px 0 0;
  text-align: center;
  width: 100%;
`

class ThemePicker extends Component {
  static propTypes = {
    value: PropTypes.string,
    language: PropTypes.string.isRequired,
    fontface: PropTypes.string.isRequired,
    selectedTheme: PropTypes.string.isRequired,
    themesList: PropTypes.objectOf(ThemePropType).isRequired,
    onConfirmSelection: PropTypes.func
  }

  constructor({ selectedTheme, themesList }) {
    super()
    this.state = {
      selectedTheme: selectedTheme || themesList[0].name
    }
  }

  onThemeChanged = selection => {
    this.setState({
      selectedTheme: selection
    })
  }

  onConfirmSelection = selection => {
    const { onConfirmSelection } = this.props
    this.onThemeChanged(selection)
    if (typeof onConfirmSelection === 'function') {
      onConfirmSelection(selection)
    }
  }

  render() {
    const { value, language, fontface, themesList } = this.props
    const { selectedTheme } = this.state
    return (
      <Wrapper p={2}>
        {Object.keys(themesList).map(theme => (
          <PreviewItem
            key={theme}
            selected={selectedTheme === theme}
            onClick={() => this.onConfirmSelection(theme)}
          >
            <Preview
              html={value}
              theme={themesList[theme]}
              language={language}
              fontface={fontface}
            />
            <Label>{themesList[theme].caption}</Label>
          </PreviewItem>
        ))}
      </Wrapper>
    )
  }
}

export default ThemePicker
