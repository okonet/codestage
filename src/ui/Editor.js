import React, { Component, PropTypes } from 'react'
import { Button, Checkbox, SegmentedControl, SegmentedControlItem } from 'react-desktop/macOs'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ItemsList from './ItemsList'
import ThemePicker from './ThemePicker'
import Preview from './DynamicPreview'
import { EditorModes, ThemePropType } from '../shared/constants/editor'
import { setMode } from '../shared/actions/editor'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote } = window.require('electron')
const settings = remote.require('electron-settings')

const Wrapper = styled.section`
  display: flex;
  flex: 1;
`

const SidebarWrapper = styled.aside`
  flex: 0 0 230px;
  box-sizing: border-box;
`

const PreviewWrapper = styled.main`
  display: flex;
  flex: 0 1 100%;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  background-color: rgba(198, 205, 213, 0.85);
  border: 0 solid rgba(0, 0, 0, 0.125);
  border-width: 0 0 0 1px;
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

  constructor({ language, preferences, languagesList }) {
    super()
    this.state = {
      selectedLanguage: language || preferences.lastUsedLanguage || languagesList[0]
    }
  }

  onLangChanged = selection => {
    this.setState({
      selectedLanguage: selection
    })
  }

  onThemeChanged = theme => {
    settings.set('theme', theme)
    this.props.changeMode(EditorModes.STYLE)
  }

  onConfirmSelection = selection => {
    const { onConfirmSelection } = this.props
    if (typeof onConfirmSelection === 'function') {
      settings.set('lastUsedLanguage', selection)
      onConfirmSelection(selection)
    }
  }

  onLineNumbersSettingChanged = event => {
    settings.set('lineNumbers', event.target.checked)
  }

  render() {
    const { mode, html, text, preferences, languagesList, themesList, changeMode } = this.props
    const { selectedLanguage } = this.state
    const { theme, fontface, lineNumbers } = preferences

    if (mode === EditorModes.THEME) {
      return (
        <Wrapper>
          <PreviewWrapper>
            <Button
              onClick={() => {
                changeMode(EditorModes.LANGUAGE)
              }}
            >
              Done
            </Button>
            <ThemePicker
              value={html}
              selectedTheme={theme}
              themesList={themesList}
              language={selectedLanguage}
              fontface={fontface}
              onConfirmSelection={this.onThemeChanged}
            />
          </PreviewWrapper>
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        <SidebarWrapper>
          <SegmentedControl>
            <SegmentedControlItem
              title="Language"
              selected={mode === EditorModes.LANGUAGE}
              onSelect={() => {
                changeMode(EditorModes.LANGUAGE)
              }}
            >
              <Wrapper style={{ height: 550 }}>
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
        </SidebarWrapper>

        <PreviewWrapper>
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
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  mode: state.editor.mode
})

const mapDispatchToProps = dispatch => ({
  changeMode: mode => {
    dispatch(setMode(mode))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Editor)
