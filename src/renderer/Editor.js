import React, { Component, PropTypes } from 'react'
import { Button, Checkbox, SegmentedControl, SegmentedControlItem } from 'react-desktop/macOs'
import { connect } from 'react-redux'
import SystemFonts from 'system-font-families'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import ItemsList from './ItemsList'
import ThemePicker from './ThemePicker'
import Preview from './DynamicPreview'
import { EditorModes, FontSizes, ThemePropType } from '../shared/constants/editor'
import { setMode } from '../shared/actions/editor'
import { setWindowVisibility } from '../shared/actions/window'
import Slider from './Slider'
import SliderPane from './SliderPane'
import Select from './Select'

const systemFonts = new SystemFonts()
const fontList = systemFonts.getFontsSync()

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
      lineNumbers: preferences.lineNumbers
    }
  }

  onLangChanged = selection => {
    this.setState({
      language: selection
    })
  }

  onFontChanged = selection => {
    this.setState({
      fontface: selection
    })
  }

  onFontSizeChanged = selection => {
    this.setState({
      fontsize: selection
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

  render() {
    const { closeWindow, mode, html, text, languagesList, themesList, changeMode } = this.props
    const { fontface, fontsize, language, theme, lineNumbers } = this.state

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
            <Slider activePane={mode === EditorModes.FONT ? 1 : 0}>
              <SliderPane>
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
                        selectedItem={language}
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
                      <Button
                        onClick={() => {
                          changeMode(EditorModes.FONT)
                        }}
                      >
                        Change font
                      </Button>
                      <Select
                        name="fontsize"
                        values={FontSizes}
                        valueRenderer={value => `${value / 2}pt`}
                        selectedValue={fontsize}
                        onSelect={this.onFontSizeChanged}
                      />
                    </Box>
                  </SegmentedControlItem>
                </SegmentedControl>
              </SliderPane>
              <SliderPane>
                <Button
                  onClick={() => {
                    changeMode(EditorModes.STYLE)
                  }}
                >
                  Back
                </Button>
                <Wrapper style={{ height: 500 }}>
                  <ItemsList
                    focusable
                    heading="fonts"
                    items={fontList}
                    selectedItem={fontface}
                    onChange={this.onFontChanged}
                    onSelect={this.onConfirmSelection}
                  />
                </Wrapper>
              </SliderPane>
            </Slider>
          </Box>

          <PreviewWrapper align="center" justify="center">
            <PreviewContainer>
              <Preview
                value={text}
                theme={themesList[theme]}
                language={language}
                fontface={fontface}
                fontsize={fontsize}
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
