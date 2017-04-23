import React, { Component } from 'react'
import { Box, TitleBar, Toolbar, ToolbarNav, ToolbarNavItem, Window } from 'react-desktop/macOs'
import styled from 'styled-components'
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

const systemFonts = new SystemFonts()
const themeList = fs
  .readdirSync(path.join(resolveStylesheetsDir()))
  .map(stylesheet => stylesheet.replace(/\.css$/, ''))

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`

const Sidebar = styled.div`
  flex: 0 auto;
  width: 200px;
  border: 1px solid;
`

const Content = styled.div`
  flex: 1;
  border: 1px solid;
`

const circle = (
  <svg x="0px" y="0px" width="25px" height="25px" viewBox="0 0 25 25">
    <circle cx="12.5" cy="12.5" r="12.5" />
  </svg>
)

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

  onFontChanged = selectedFont => {
    settings.setSync('fontface', selectedFont)
    this.setState({ selectedFont })
  }

  onThemeChanged = selectedTheme => {
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
      <Window chrome padding="0px">
        <TitleBar>
          <Toolbar>
            <ToolbarNav>
              <ToolbarNavItem
                title="Item 1"
                icon={circle}
                selected={this.state.selected === 1}
                onClick={() => this.setState({ selected: 1 })}
              />
              <ToolbarNavItem
                title="Item 2"
                icon={circle}
                selected={this.state.selected === 2}
                onClick={() => this.setState({ selected: 2 })}
              />
              <ToolbarNavItem
                title="Item 3"
                icon={circle}
                selected={this.state.selected === 3}
                onClick={() => this.setState({ selected: 3 })}
              />
            </ToolbarNav>
          </Toolbar>
        </TitleBar>

        <Wrapper>
          <Content>
            <Box label="Code snippet" padding="30px">
              <Preview
                codeSnippet={codeSnippet}
                theme={theme}
                subset={languages}
                fontface={selectedFont}
              />
            </Box>
          </Content>
        </Wrapper>

        <Wrapper>
          <Sidebar>
            <ItemsList
              items={themeList}
              selectedItem={selectedTheme}
              onClick={this.onThemeChanged}
            />
          </Sidebar>
          <Sidebar>
            <ItemsList items={fontList} selectedItem={selectedFont} onClick={this.onFontChanged} />
          </Sidebar>
          <Content>
            <input type="text" value={subset} onChange={this.onSubsetChanged} />
            <button onClick={this.showMenu}>⚙</button>

            <ul>
              {languages.map(lang => <li key={lang}>{lang}</li>)}
            </ul>

          </Content>
        </Wrapper>
      </Window>
    )
  }
}

export default App
