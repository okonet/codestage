import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import Dropdown from './Dropdown';

// Working around electron imports from CRA app:
// https://medium.freecodecamp.com/building-an-electron-application-with-create-react-app-97945861647c
const { remote, ipcRenderer } = window.require('electron');
const fs = remote.require('fs');
const path = remote.require('path');
const settings = remote.require('electron-settings');
const SystemFonts = remote.require('system-font-families').default;
const { resolveStylesheetsDir } = remote.require('../../lib/');

const systemFonts = new SystemFonts();
const themeList = fs
  .readdirSync(path.join(resolveStylesheetsDir()))
  .map(stylesheet => stylesheet.replace(/\.css$/, ''));

const Wrapper = styled.div`
  padding: 15px;
  font-size: 10px;
`;

const fontList = systemFonts.getFontsSync();

class App extends Component {
  state = {
    selectedFont: settings.getSync('fontface'),
    selectedTheme: settings.getSync('theme')
  };

  showMenu = event => {
    const { left, bottom } = event.target.getBoundingClientRect();
    ipcRenderer.send('show-options-menu', { left, bottom });
    event.stopPropagation();
  };

  onFontChanged = event => {
    const selectedFont = event.target.value;
    settings.setSync('fontface', selectedFont);
    this.setState({ selectedFont });
  };

  onThemeChanged = event => {
    const selectedTheme = event.target.value;
    settings.setSync('theme', selectedTheme);
    this.setState({ selectedTheme });
  };

  render() {
    const { selectedFont, selectedTheme } = this.state;
    return (
      <Wrapper>
        <Dropdown
          items={fontList}
          selectedItem={selectedFont}
          onChange={this.onFontChanged}
        />
        <Dropdown
          items={themeList}
          selectedItem={selectedTheme}
          onChange={this.onThemeChanged}
        />
        <button onClick={this.showMenu}>⚙</button>
      </Wrapper>
    );
  }
}

export default App;
