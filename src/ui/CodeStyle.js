import React, { Component } from 'react'
import { Box, Label } from 'react-desktop/macOs'
import './App.css'
import ItemsList from './ItemsList'
import Preview from './Preview'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote, ipcRenderer } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const settings = remote.require('electron-settings')
const SystemFonts = remote.require('system-font-families').default
const { resolveStylesheetsDir } = remote.require('../../lib/')
const { DEFAULT_SETTINGS } = remote.require('../electron/defaults')

const systemFonts = new SystemFonts()
const themesDir = resolveStylesheetsDir('highlight.js', 'styles')
const themeList = fs
  .readdirSync(path.join(themesDir))
  .map(stylesheet => stylesheet.replace(/\.css$/, ''))

const fontList = systemFonts.getFontsSync()

class CodeStyle extends Component {
  state = {
    codeSnippet: 'Copy some code into clipboard',
    selectedFont: settings.get('fontface', DEFAULT_SETTINGS.fontface),
    selectedTheme: settings.get('theme', DEFAULT_SETTINGS.theme),
    subset: settings.get('subset', DEFAULT_SETTINGS.subset)
  }

  componentDidMount() {
    ipcRenderer.on('global-shortcut-pressed', this.onShortcutPressed)
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('global-shortcut-pressed', this.onShortcutPressed)
  }

  onShortcutPressed = (event, { html, language, relevance }) => {
    this.setState({
      html,
      language,
      relevance
    })
  }

  onFontChanged = selectedFont => {
    settings.set('fontface', selectedFont)
    this.setState({ selectedFont })
  }

  onThemeChanged = selectedTheme => {
    settings.set('theme', selectedTheme)
    this.setState({ selectedTheme })
  }

  onSubsetChanged = event => {
    const { value } = event.target
    settings.set('subset', value)
    this.setState({ subset: value })
  }

  render() {
    const { html, language, relevance, selectedFont, selectedTheme, subset } = this.state
    const themePath = path.join(themesDir, `${selectedTheme}.css`)
    const theme = fs.readFileSync(themePath, 'utf-8')
    const languages = subset.split(',').filter(Boolean)
    return (
      <section className="wrapper wrapper_vertical">
        <Label>{language}, {relevance}</Label>
        <section className="wrapper">

          <section className="content codeSnippet">
            <Box label="Code snippet" padding="0px">
              <Preview html={html} theme={theme} fontface={selectedFont} />
            </Box>
          </section>
        </section>

        <section className="wrapper">
          <section className="content">
            <ItemsList
              heading="Theme"
              items={themeList}
              selectedItem={selectedTheme}
              onClick={this.onThemeChanged}
            />
          </section>
          <section className="content">
            <ItemsList
              heading="Font"
              items={fontList}
              selectedItem={selectedFont}
              onClick={this.onFontChanged}
            />
          </section>
          <section className="content">
            <input type="text" value={subset} onChange={this.onSubsetChanged} />

            <ul>
              {languages.map(lang => <li key={lang}>{lang}</li>)}
            </ul>

          </section>
        </section>
      </section>
    )
  }
}

export default CodeStyle
