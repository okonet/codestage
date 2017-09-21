import React, { Component, PropTypes } from 'react'
import { Box } from 'react-desktop/macOs'
import './App.css'
import ItemsList from './ItemsList'
import Preview from './Preview'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const settings = remote.require('electron-settings')

class LangChooser extends Component {
  static propTypes = {
    html: PropTypes.string,
    language: PropTypes.string,
    preferences: PropTypes.object, // eslint-disable-line
    themeDirPath: PropTypes.string,
    languagesList: PropTypes.arrayOf(PropTypes.string),
    onConfirmSelection: PropTypes.func,
    withPreview: PropTypes.bool
  }

  static defaultProps = {
    withPreview: false
  }

  onLangChanged = selection => {
    settings.set('lastUsedLanguage', selection)
  }

  onConfirmSelection = selection => {
    const { onConfirmSelection } = this.props
    if (typeof onConfirmSelection === 'function') {
      onConfirmSelection(selection)
    }
  }

  render() {
    const { html, language, preferences, themeDirPath, languagesList, withPreview } = this.props
    const { theme, fontface } = preferences
    const themePath = path.join(themeDirPath, `${theme}.css`)
    const themeStylesheet = fs.readFileSync(themePath, 'utf-8')
    return (
      <section className="wrapper wrapper_vertical">
        {withPreview &&
          <section className="wrapper">
            <section className="content codeSnippet">
              <Box label="Code snippet" padding="0px">
                <Preview html={html} theme={themeStylesheet} fontface={fontface} />
              </Box>
            </section>
          </section>}

        <section className="wrapper">
          <section className="content">
            <ItemsList
              heading="Languages"
              items={languagesList}
              selectedItem={language}
              onSelect={this.onLangChanged}
              onEnter={this.onConfirmSelection}
            />
          </section>
        </section>
      </section>
    )
  }
}

export default LangChooser
