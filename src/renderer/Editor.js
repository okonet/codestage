import React, { Component, PropTypes } from 'react'
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
import FontChooser from './FontChooser'

const Wrapper = styled(Flex)`
  display: flex;
  width: 100%;
  height: 100%;
`

const PreviewWrapper = styled(Flex)`
  width: 100%;
  height: 100%;
  background-color: rgba(198, 205, 213, 0.85);
`

const Sidebar = styled(Box)`
  border: 0 solid rgba(0, 0, 0, 0.25);
  border-right-width: 1px;
`

class Editor extends Component {
  static propTypes = {
    closeWindow: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(Object.keys(EditorModes)).isRequired,
    html: PropTypes.string,
    text: PropTypes.string,
    language: PropTypes.string,
    languagesList: PropTypes.arrayOf(PropTypes.string),
    preferences: PropTypes.object, // eslint-disable-line
    theme: PropTypes.string,
    themesList: PropTypes.objectOf(ThemePropType).isRequired,
    onConfirmSelection: PropTypes.func,
    changeMode: PropTypes.func
  }

  constructor({ fontface, fontsize, language, languagesList, preferences, theme, themesList }) {
    super()
    this.state = {
      fontface: fontface || preferences.fontface,
      fontsize: fontsize || preferences.fontsize,
      language: language || preferences.language || languagesList[0],
      theme: theme || preferences.theme || themesList[0],
      lineNumbers: preferences.lineNumbers,
      includeBackground: preferences.includeBackground
    }
  }

  onLangChanged = selection => {
    this.setState({
      language: selection
    })
  }

  onFontChanged = ({ fontface, fontsize }) => {
    this.setState({
      fontface,
      fontsize
    })
  }

  onThemeChanged = theme => {
    this.setState({ theme })
    this.props.changeMode(EditorModes.STYLE)
  }

  onConfirmSelection = () => {
    const { onConfirmSelection } = this.props
    if (typeof onConfirmSelection === 'function') {
      onConfirmSelection(this.state)
    }
  }

  onLineNumbersSettingChanged = event => {
    this.setState({ lineNumbers: event.target.checked })
  }

  onBackgroundSettingChanged = event => {
    this.setState({ includeBackground: event.target.checked })
  }

  render() {
    const { closeWindow, mode, html, text, languagesList, themesList, changeMode } = this.props
    const { fontface, fontsize, includeBackground, language, theme, lineNumbers } = this.state

    if (mode === EditorModes.THEME) {
      return (
        <Wrapper>
          <PreviewWrapper align="flex-end" column>
            <ThemePicker
              value={html}
              selectedTheme={theme}
              themesList={themesList}
              language={language}
              fontface={fontface}
              onConfirmSelection={this.onThemeChanged}
            />
            <Box m={1}>
              <Button
                onClick={() => {
                  changeMode(EditorModes.STYLE)
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
      <Wrapper>
        <Sidebar flex="0 0 250px" pt={3}>
          <SegmentedControl>
            <SegmentedControlItem
              title="Language"
              selected={mode === EditorModes.LANGUAGE}
              onSelect={() => {
                changeMode(EditorModes.LANGUAGE)
              }}
            >
              <Flex flex="1" column style={{ height: 549 }}>
                <ItemsList
                  focusable
                  heading="Languages"
                  items={languagesList}
                  selectedItem={language}
                  onChange={this.onLangChanged}
                  onSelect={this.onConfirmSelection}
                />
              </Flex>
            </SegmentedControlItem>
            <SegmentedControlItem
              title="Style"
              selected={mode === EditorModes.STYLE}
              onSelect={() => {
                changeMode(EditorModes.STYLE)
              }}
            >
              <Box p={1}>
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
                <Checkbox
                  label="Include background color"
                  onChange={this.onBackgroundSettingChanged}
                  defaultChecked={includeBackground}
                />
              </Box>
            </SegmentedControlItem>
            <SegmentedControlItem
              title="Font"
              selected={mode === EditorModes.FONT}
              onSelect={() => {
                changeMode(EditorModes.FONT)
              }}
            >
              <Box p={1}>
                <FontChooser
                  fontface={fontface}
                  fontsize={fontsize}
                  onChange={this.onFontChanged}
                  onConfirm={this.onConfirmSelection}
                />
              </Box>
            </SegmentedControlItem>
          </SegmentedControl>
        </Sidebar>

        <PreviewWrapper column>
          <Flex flex="1" align="center" justify="center">
            <Preview
              value={text}
              theme={themesList[theme]}
              language={language}
              fontface={fontface}
              fontsize={fontsize}
              showGutter={lineNumbers}
              includeBackground={includeBackground}
            />
          </Flex>
          <Box m={2} style={{ textAlign: 'right' }}>
            <Button color="blue" onClick={this.onConfirmSelection}>
              Re-highlight
            </Button>{' '}
            <Button onClick={closeWindow}>Close</Button>
          </Box>
        </PreviewWrapper>
      </Wrapper>
    )
  }
}

const mapStateToProps = ({ editor }) => ({
  ...editor
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
