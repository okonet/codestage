import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import logo from './logo.svg';
console.log(window.require);
const electron = window.require('electron');
const settings = electron.remote.require('electron-settings');
// import settings from 'electron-settings';

const Wrapper = styled.div`
  font-size: 10px
`;

const selectedFont = settings.getSync('fontface');
const selectedTheme = settings.getSync('theme');
const autopaste = settings.getSync('autopaste');

console.log(selectedFont);

class App extends Component {
  render() {
    return (
      <Wrapper>
        <img src={logo} className="App-logo" alt="logo" />
        <h2>{selectedFont}</h2>
      </Wrapper>
    );
  }
}

export default App;
