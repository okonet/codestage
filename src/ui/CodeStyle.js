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
const SystemFonts = remote.require('system-font-families').default
const systemFonts = new SystemFonts()
const fontList = systemFonts.getFontsSync()

class CodeStyle extends Component {
  static propTypes = {
    html: PropTypes.string,
    preferences:  PropTypes.object,
    themeDirPath: PropTypes.string,
    themesList: PropTypes.string
  }

  onFontChanged = selectedFont => {
    settings.set('fontface', selectedFont)
  }

  onThemeChanged = selectedTheme => {
    settings.set('theme', selectedTheme)
  }

  onSubsetChanged = event => {
    const { value } = event.target
    settings.set('subset', value)
  }

  render() {
    const { html, preferences, themeDirPath, themesList } = this.props
    const { fontface, theme, subset } = preferences
    const themePath = path.join(themeDirPath, `${theme}.css`)
    const themeStylesheet = fs.readFileSync(themePath, 'utf-8')
    return (
      <section className="wrapper wrapper_vertical">
        <section className="wrapper">
          <section className="content codeSnippet">
            <Box label="Code snippet" padding="0px">
              <Preview html={html} theme={themeStylesheet} fontface={fontface} />
            </Box>
          </section>
        </section>

        <section className="wrapper">
          <section className="content">
            <ItemsList
              heading="Theme"
              items={themesList}
              selectedItem={theme}
              onClick={this.onThemeChanged}
            />
          </section>
          <section className="content">
            <ItemsList
              heading="Font"
              items={fontList}
              selectedItem={fontface}
              onClick={this.onFontChanged}
            />
          </section>
          <section className="content">
            <input type="text" value={subset} onChange={this.onSubsetChanged} />

          </section>
        </section>
      </section>
    )
  }
}

export default CodeStyle
