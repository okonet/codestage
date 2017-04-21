import React, { Component } from 'react'
import styled from 'styled-components'
import './App.css'
import Dropdown from './Dropdown'
import Preview from './Preview'

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote, ipcRenderer } = window.require('electron')
const fs = remote.require('fs')
const path = remote.require('path')
const settings = remote.require('electron-settings')
const SystemFonts = remote.require('system-font-families').default
const { resolveStylesheetsDir } = remote.require('../../lib/')

const systemFonts = new SystemFonts()
const themeList = fs
  .readdirSync(path.join(resolveStylesheetsDir()))
  .map(stylesheet => stylesheet.replace(/\.css$/, ''))

const Wrapper = styled.div`
  padding: 15px;
  font-size: 10px;
`

const fontList = systemFonts.getFontsSync()

class App extends Component {
  state = {
    codeSnippet: 'Copy some code into clipboard',
    selectedFont: settings.getSync('fontface'),
    selectedTheme: settings.getSync('theme'),
    subset: settings.getSync('subset')
  }

  componentDidMount() {
    ipcRenderer.on('global-shortcut-pressed', this.onShortcutPressed)
  }

  componentWillUnmount() {
    ipcRenderer.off('global-shortcut-pressed', this.onShortcutPressed)
  }

  showMenu = event => {
    const { left, bottom } = event.target.getBoundingClientRect()
    ipcRenderer.send('show-options-menu', { left, bottom })
    event.stopPropagation()
  }

  onShortcutPressed = (event, { codeSnippet }) => {
    this.setState({
      codeSnippet
    })
  }

  onFontChanged = event => {
    const selectedFont = event.target.value
    settings.setSync('fontface', selectedFont)
    this.setState({ selectedFont })
  }

  onThemeChanged = event => {
    const selectedTheme = event.target.value
    settings.setSync('theme', selectedTheme)
    this.setState({ selectedTheme })
  }

  onSubsetChanged = event => {
    const { value } = event.target
    settings.setSync('subset', value)
    this.setState({ subset: value })
  }

  render() {
    const { codeSnippet, selectedFont, selectedTheme, subset } = this.state
    const themePath = path.join(resolveStylesheetsDir(), `${selectedTheme}.css`)
    const theme = fs.readFileSync(themePath, 'utf-8')
    const languages = subset.split(',').filter(Boolean)
    return (
      <Wrapper>
        <Dropdown items={fontList} selectedItem={selectedFont} onChange={this.onFontChanged} />
        <Dropdown items={themeList} selectedItem={selectedTheme} onChange={this.onThemeChanged} />
        <input type="text" value={subset} onChange={this.onSubsetChanged} />
        <button onClick={this.showMenu}>⚙</button>
        <ul>
          {languages.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <Preview codeSnippet={codeSnippet} theme={theme} subset={languages} />
      </Wrapper>
    )
  }
}

export default App
