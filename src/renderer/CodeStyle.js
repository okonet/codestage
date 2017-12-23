import React, { Component, PropTypes } from 'react'
import settings from 'electron-settings'
import SystemFonts from 'system-font-families'
import { Box } from 'react-desktop/macOs'
import ItemsList from './ItemsList'
import Preview from './StaticPreview'

const systemFonts = new SystemFonts()
const fontList = systemFonts.getFontsSync()

class CodeStyle extends Component {
  static propTypes = {
    html: PropTypes.string,
    preferences: PropTypes.object, // eslint-disable-line
    themesList: PropTypes.object // eslint-disable-line
  }

  onFontChanged = selectedFont => {
    settings.set('highlight.fontface', selectedFont)
  }

  onFontSizeChanged = event => {
    const { value } = event.target
    settings.set('highlight.fontsize', value)
  }

  onThemeChanged = selectedTheme => {
    settings.set('highlight.theme', selectedTheme)
  }

  onSubsetChanged = event => {
    const { value } = event.target
    settings.set('highlight.subset', value)
  }

  render() {
    const { html, preferences, themesList } = this.props
    const { fontface, fontsize, theme, subset } = preferences
    const currentTheme = themesList[theme] || { cssText: '' }
    return (
      <section className="wrapper wrapper_vertical">
        <section className="wrapper">
          <section className="content codeSnippet">
            <Box label="Code snippet" padding="0px">
              <Preview html={html} theme={currentTheme} fontface={fontface} />
            </Box>
          </section>
        </section>

        <section className="wrapper">
          <section className="content">
            <ItemsList
              heading="Theme"
              items={Object.values(themesList).map(t => t.name)} // eslint-disable-line id-length
              selectedItem={theme}
              onChange={this.onThemeChanged}
            />
          </section>
          <section className="content">
            <ItemsList
              heading="Font"
              items={fontList}
              selectedItem={fontface}
              onChange={this.onFontChanged}
            />
          </section>
          <section className="content">
            <input type="text" value={subset} onChange={this.onSubsetChanged} />

            <input type="number" value={fontsize} onChange={this.onFontSizeChanged} />
          </section>
        </section>
      </section>
    )
  }
}

export default CodeStyle
