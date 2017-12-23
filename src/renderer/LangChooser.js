import React, { Component, PropTypes } from 'react'
import settings from 'electron-settings'
import styled from 'styled-components'
import ItemsList from './ItemsList'
import Preview from './DynamicPreview'

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

class LangChooser extends Component {
  static propTypes = {
    text: PropTypes.string,
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

  onConfirmSelection = selection => {
    const { onConfirmSelection } = this.props
    if (typeof onConfirmSelection === 'function') {
      settings.set('highlight.lastUsedLanguage', selection)
      onConfirmSelection(selection)
    }
  }

  render() {
    const { text, preferences, languagesList, withPreview } = this.props
    const { selectedLanguage } = this.state
    const { theme, fontface } = preferences
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

        {withPreview && (
          <PreviewWrapper>
            <Preview value={text} theme={theme} language={selectedLanguage} fontface={fontface} />
          </PreviewWrapper>
        )}
      </Wrapper>
    )
  }
}

export default LangChooser
