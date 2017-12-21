import React, { Component, PropTypes } from 'react'
import settings from 'electron-settings'
import { Button, Checkbox, SegmentedControl, SegmentedControlItem } from 'react-desktop/macOs'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import ItemsList from './ItemsList'
import ThemePicker from './ThemePicker'
import Preview from './DynamicPreview'
import { EditorModes, ThemePropType } from '../shared/constants/editor'
import { setMode } from '../shared/actions/editor'
import { setWindowVisibility } from '../shared/actions/window'

const Wrapper = styled.section`
  display: flex;
  flex: 1;
`

const PreviewWrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  background-color: rgba(198, 205, 213, 0.85);
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-left-width: 1px;
`

const PreviewContainer = styled.div`
  padding: 7vmin;
  width: calc(1 * 100vmin);
  height: calc(3/4 * 100vmin);
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 2px 16px 2px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
`

class Editor extends Component {
  static propTypes = {
    closeWindow: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(Object.keys(EditorModes)).isRequired,
    html: PropTypes.string,
    text: PropTypes.string,
    language: PropTypes.string,
    preferences: PropTypes.object, // eslint-disable-line
    languagesList: PropTypes.arrayOf(PropTypes.string),
    themesList: PropTypes.objectOf(ThemePropType).isRequired,
    onConfirmSelection: PropTypes.func,
    changeMode: PropTypes.func
  }

  constructor({ language, preferences, languagesList, theme, themesList, ...rest }) {
    super()
    console.log(rest)
    this.state = {
      selectedLanguage: language || preferences.lastUsedLanguage || languagesList[0],
      theme: theme || preferences.theme || themesList[0],
      lineNumbers: preferences.lineNumbers
    }
  }

  onLangChanged = selection => {
    this.setState({
      selectedLanguage: selection
    })
  }

  onThemeChanged = theme => {
    this.setState({ theme })
    this.props.changeMode(EditorModes.STYLE)
  }

  onConfirmSelection = () => {
    const { onConfirmSelection } = this.props
    const { lineNumbers, selectedLanguage, theme } = this.state
    if (typeof onConfirmSelection === 'function') {
      settings.set('lastUsedLanguage', selectedLanguage)
      settings.set('theme', theme)
      settings.set('lineNumbers', lineNumbers)
      onConfirmSelection(selectedLanguage)
    }
  }

  onLineNumbersSettingChanged = event => {
    this.setState({ lineNumbers: event.target.checked })
  }

  render() {
    const {
      closeWindow,
      mode,
      html,
      text,
      preferences,
      languagesList,
      themesList,
      changeMode
    } = this.props
    const { selectedLanguage, theme, lineNumbers } = this.state
    const { fontface } = preferences

    if (mode === EditorModes.THEME) {
      return (
        <Wrapper>
          <PreviewWrapper align="flex-end" column>
            <ThemePicker
              value={html}
              selectedTheme={theme}
              themesList={themesList}
              language={selectedLanguage}
              fontface={fontface}
              onConfirmSelection={this.onThemeChanged}
            />
            <Box m={1}>
              <Button
                onClick={() => {
                  changeMode(EditorModes.LANGUAGE)
                }}
              >
                Done
              </Button>
            </Box>
          </PreviewWrapper>
        </Wrapper>
      )
    }
    return (
      <Flex column style={{ width: '100%' }}>
        <Flex flex="1">
          <Box width={300} my={2}>
            <SegmentedControl>
              <SegmentedControlItem
                title="Language"
                selected={mode === EditorModes.LANGUAGE}
                onSelect={() => {
                  changeMode(EditorModes.LANGUAGE)
                }}
              >
                <Wrapper style={{ height: 500 }}>
                  <ItemsList
                    focusable
                    heading="Languages"
                    items={languagesList}
                    selectedItem={selectedLanguage}
                    onChange={this.onLangChanged}
                    onSelect={this.onConfirmSelection}
                  />
                </Wrapper>
              </SegmentedControlItem>
              <SegmentedControlItem
                title="Style"
                selected={mode === EditorModes.STYLE}
                onSelect={() => {
                  changeMode(EditorModes.STYLE)
                }}
              >
                <Button
                  onClick={() => {
                    changeMode(EditorModes.THEME)
                  }}
                >
                  Change theme...
                </Button>
                <Checkbox
                  label="Display line numbers"
                  onChange={this.onLineNumbersSettingChanged}
                  defaultChecked={lineNumbers}
                />
              </SegmentedControlItem>
            </SegmentedControl>
          </Box>

          <PreviewWrapper align="center" justify="center">
            <PreviewContainer>
              <Preview
                value={text}
                theme={themesList[theme]}
                language={selectedLanguage}
                fontface={fontface}
                showGutter={lineNumbers}
              />
            </PreviewContainer>
          </PreviewWrapper>
        </Flex>
        <Flex m={1} justify="flex-end">
          <Box>
            <Button color="blue" onClick={this.onConfirmSelection}>
              Re-highlight
            </Button>
          </Box>
          <Box ml={1}>
            <Button onClick={closeWindow}>Close</Button>
          </Box>
        </Flex>
      </Flex>
    )
  }
}

const mapStateToProps = state => ({
  mode: state.editor.mode
})

const mapDispatchToProps = dispatch => ({
  changeMode: mode => {
    dispatch(setMode(mode))
  },
  closeWindow: () => {
    dispatch(setWindowVisibility(false))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
