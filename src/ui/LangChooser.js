import React, { Component, PropTypes } from 'react'
import styled from 'styled-components'
import ItemsList from './ItemsList'
import Preview from './Preview'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote } = window.require('electron')
const settings = remote.require('electron-settings')

const Wrapper = styled.section`
  display: flex;
  width: 100%;
`

const SidebarWrapper = styled.aside`
  flex: 0 0 260px;
  box-sizing: border-box;
`

const PreviewWrapper = styled.main`
  display: flex;
  flex: 1;
  padding: 28px;
  box-sizing: border-box;
  background-color: rgba(198, 205, 213, 0.85);
  border-color: rgba(0, 0, 0, 0.125);
  border-style: solid;
  border-width: 0 0 0 1px;
  width: 100%;
  height: 100%;
`

class LangChooser extends Component {
  static propTypes = {
    html: PropTypes.string,
    language: PropTypes.string,
    preferences: PropTypes.object, // eslint-disable-line
    languagesList: PropTypes.arrayOf(PropTypes.string),
    themesList: PropTypes.object, // eslint-disable-line
    onConfirmSelection: PropTypes.func,
    withPreview: PropTypes.bool
  }

  static defaultProps = {
    withPreview: false
  }

  constructor(props) {
    super()
    this.state = {
      selectedLanguage: props.language
    }
  }

  onLangChanged = selection => {
    this.setState({
      selectedLanguage: selection
    })
  }

  onConfirmSelection = selection => {
    const { onConfirmSelection } = this.props
    if (typeof onConfirmSelection === 'function') {
      settings.set('lastUsedLanguage', selection)
      onConfirmSelection(selection)
    }
  }

  render() {
    const { html, preferences, themesList, languagesList, withPreview } = this.props
    const { selectedLanguage } = this.state
    const { theme, fontface } = preferences
    const currentTheme = themesList[theme] || { cssText: '' }
    return (
      <Wrapper>
        <SidebarWrapper>
          <ItemsList
            focusable
            heading="Languages"
            items={languagesList}
            selectedItem={selectedLanguage}
            onChange={this.onLangChanged}
            onSelect={this.onConfirmSelection}
          />
        </SidebarWrapper>

        {withPreview &&
          <PreviewWrapper>
            <Preview html={html} theme={currentTheme.cssText} fontface={fontface} />
          </PreviewWrapper>}
      </Wrapper>
    )
  }
}

export default LangChooser
